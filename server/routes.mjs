import { Router } from 'express';
import { hash, verify } from '@node-rs/argon2';
import { backup } from 'node:sqlite';
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { digest, secret, fail, emailValid, passwordValid, text, requireUser, requireAdmin, rateLimiter } from './security.mjs';
import { settingsOf, publicUser, uuid } from './store.mjs';

const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const statuses = ['new', 'contacted', 'qualified', 'quoted', 'closed_won', 'closed_lost'];
export function createRoutes(store, origin) {
  const api = Router(), { db, demo, transaction, audit, findProduct, syncProduct } = store;
  api.use((req,_res,next)=>{if(['POST','PUT','PATCH','DELETE'].includes(req.method)&&req.path!=='/admin/media/upload'&&(!req.body||typeof req.body!=='object'||Array.isArray(req.body)||Buffer.isBuffer(req.body)))return next(Object.assign(new Error('Envía un formulario válido.'),{status:400}));next();});
  const limit = rateLimiter();
  const dummy = hash(secret(), { memoryCost: 19456, timeCost: 2, parallelism: 1 });
  const allProducts = () => db.prepare('SELECT * FROM products ORDER BY id').all().map(row => ({ ...JSON.parse(row.document), demo_fixture: !!row.demo_fixture }));
  const visible = () => allProducts().filter(p => demo ? ['demo_only', 'published'].includes(p.publication_status) : p.publication_status === 'published' && !p.is_demo && !p.demo_fixture && p.verification_status === 'approved');
  const publicProduct = p => Object.fromEntries(Object.entries({
    ...Object.fromEntries(['id','sku','slug','name','category','material','metal_karat','metal_fineness','stone_type','stone_origin','stone_carat_total','weight_g','measurements','description','care','stock_status','collections','is_demo','certificate_status','certificate_issuer','certificate_reference','stone_details','delivery_note','price_mode'].map(k => [k,p[k]])),
    price_mxn: p.price_mode === 'quote' ? null : p.price_mxn,
    media: (p.media || ['front','side','detail'].map((view,panel) => ({ view, panel, path: `/assets/products/${p.slug}.png`, source_kind:'ai_generated', alt:`${p.name}, ${view}; imagen generada con IA` }))).map(({view,panel,path,source_kind,alt})=>({view,panel,path,source_kind,alt})),
    variants: p.variants.map(v => ({ sku:v.sku,label:v.label,available:v.stock_qty>0&&p.stock_status==='in_stock' }))
  }).filter(([,v]) => v !== undefined));
  const mail = (user, subject, body) => {
    db.prepare('INSERT INTO outbox(id,user_id,recipient,subject,body,status,created_at) VALUES(?,?,?,?,?,?,?)').run(uuid(),user.id||null,user.email,subject,body,demo?'local':'queued',Date.now());
  };
  const issueToken = (u,kind) => {
    const raw=secret();
    db.prepare('UPDATE auth_tokens SET used_at=? WHERE user_id=? AND kind=? AND used_at IS NULL').run(Date.now(),u.id,kind);
    db.prepare('INSERT INTO auth_tokens VALUES(?,?,?,?,NULL)').run(digest(raw),u.id,kind,Date.now()+(kind==='reset'?1800000:86400000));
    mail(u,kind==='reset'?'Restablece tu contraseña C’FANCY':'Verifica tu correo C’FANCY',`${kind==='reset'?'Restablece tu contraseña':'Verifica tu correo'} desde este enlace personal:\n${origin}/acceso?flow=${kind}&token=${raw}\nEl enlace tiene vigencia limitada y se utiliza una sola vez.`);
  };
  const caseAccess = req => {
    const c=db.prepare('SELECT * FROM advisories WHERE id=?').get(req.params.id);
    if(!c||(!demo&&c.is_demo))fail(404,'Consulta no encontrada.');
    const guest=req.get('X-Case-Token');
    if(req.user?.role!=='admin' && req.user?.id!==c.user_id && !(guest && c.guest_token_hash && digest(guest)===c.guest_token_hash))fail(404,'Consulta no encontrada.');
    return c;
  };
  const caseSummary = c => ({...Object.fromEntries(['id','user_id','name','email','product_id','variant_sku','subject','message','occasion','budget','contact_preference','status','priority','assigned_to','created_at','updated_at','first_response_at','closed_at','is_demo'].map(k=>[k,c[k]])), product_name:c.product_id?findProduct(c.product_id)?.name:null,
    message_count:db.prepare('SELECT count(*) AS n FROM messages WHERE advisory_id=? AND internal=0').get(c.id).n,
    quote_count:db.prepare('SELECT count(*) AS n FROM quotes WHERE advisory_id=?').get(c.id).n });
  const detail = (c,admin) => ({...caseSummary(c),messages:db.prepare(`SELECT id,user_id,author_name,body,internal,created_at FROM messages WHERE advisory_id=? ${admin?'':'AND internal=0'} ORDER BY id`).all(c.id),quotes:db.prepare('SELECT * FROM quotes WHERE advisory_id=? ORDER BY created_at DESC').all(c.id),appointments:db.prepare('SELECT * FROM appointments WHERE advisory_id=? ORDER BY starts_at').all(c.id)});

  api.get('/health',(_req,res)=>res.json({status:'ok',demo,schema:3}));
  api.get('/config',(_req,res)=>{const s=settingsOf(db);res.json({demo,site_origin:origin,service_name:s.service_name,service_hours:s.service_hours,response_note:s.response_note,coverage:s.coverage,contact_email:s.contact_email,contact_phone:s.contact_phone,policies:Object.fromEntries(['privacy','shipping','warranty','returns'].map(k=>[k,{body:s[k],status:s[k+'_status']}]))});});
  api.get('/auth/csrf',(req,res)=>res.json({csrf_token:(req.session||req.newSession()).csrf}));
  api.get('/auth/me',(req,res)=>req.user?res.json(publicUser(req.user)):res.status(401).json({message:'Tu sesión terminó. Inicia sesión.'}));
  api.post('/auth/logout',(req,res)=>{req.logout();res.sendStatus(204);});
  api.post('/auth/register',async(req,res)=>{
    const email=String(req.body.email||'').trim().toLowerCase(),{name,password,marketing}=req.body;
    limit('register-ip:'+req.ip,20);limit('register:'+req.ip+':'+email);
    if(!emailValid(email)||!passwordValid(password)||!text(name,2,100))fail(400,'Revisa nombre, correo y contraseña (15 a 128 caracteres).');
    const encoded=await hash(password,{memoryCost:19456,timeCost:2,parallelism:1});
    if(!db.prepare('SELECT id FROM users WHERE email=?').get(email)){
      const id=Number(db.prepare('INSERT INTO users(name,email,password,marketing,created_at,is_demo_user) VALUES(?,?,?,?,?,?)').run(name.trim(),email,encoded,marketing===true?1:0,Date.now(),demo?1:0).lastInsertRowid);
      db.prepare('INSERT INTO consents(user_id,purpose,granted,created_at) VALUES(?,?,?,?)').run(id,'marketing',marketing===true?1:0,Date.now());
      issueToken({id,email},'verify');
    }
    res.status(202).json({message:'Solicitud recibida. Puedes intentar iniciar sesión.'});
  });
  api.post('/auth/login',async(req,res)=>{
    const email=String(req.body.email||'').trim().toLowerCase(),password=req.body.password;
    limit('login-ip:'+req.ip,80);limit('login:'+req.ip+':'+email);
    if(!emailValid(email)||!passwordValid(password))fail(400,'Revisa correo y contraseña (15 a 128 caracteres).');
    const u=db.prepare('SELECT * FROM users WHERE email=?').get(email);
    const ok=await verify(u?.password||await dummy,password);
    if(!u||!ok||(!demo&&u.is_demo_user))fail(401,'No fue posible iniciar sesión con estos datos.');
    req.newSession(u.id);audit(u.id,'login','user',u.id);res.json(publicUser(u));
  });
  api.post('/auth/forgot',(req,res)=>{
    const email=String(req.body.email||'').trim().toLowerCase();limit('forgot:'+req.ip,5);
    if(!emailValid(email))fail(400,'Escribe un correo válido.');
    const u=db.prepare('SELECT * FROM users WHERE email=?').get(email);
    if(u&&(demo||!u.is_demo_user))issueToken(u,'reset');
    res.status(202).json({message:'Si existe una cuenta, se preparará un enlace de recuperación.',delivery:demo?'local':'queued'});
  });
  api.post('/auth/verification',requireUser,(req,res)=>{limit('verify:'+req.user.id,5);if(!req.user.verified_at)issueToken(req.user,'verify');res.status(202).json({message:'Solicitud de verificación preparada.',delivery:demo?'local':'queued'});});
  api.post('/auth/token',async(req,res)=>{
    limit('token:'+req.ip,15);
    const {token,kind,password}=req.body;
    if(!/^[a-f0-9]{64}$/.test(token||'')||!['reset','verify'].includes(kind))fail(400,'Enlace no válido o vencido.');
    const t=db.prepare('SELECT * FROM auth_tokens WHERE token_hash=? AND kind=? AND used_at IS NULL AND expires_at>?').get(digest(token),kind,Date.now());
    if(!t)fail(400,'Enlace no válido o vencido.');
    const u=db.prepare('SELECT * FROM users WHERE id=?').get(t.user_id);
    if(!demo&&u.is_demo_user)fail(400,'Enlace no válido o vencido.');
    if(kind==='reset'&&!passwordValid(password))fail(400,'La contraseña debe tener entre 15 y 128 caracteres.');
    const encoded=kind==='reset'?await hash(password,{memoryCost:19456,timeCost:2,parallelism:1}):null;
    transaction(()=>{
      const used=db.prepare('UPDATE auth_tokens SET used_at=? WHERE token_hash=? AND used_at IS NULL').run(Date.now(),t.token_hash);
      if(!used.changes)fail(400,'Enlace ya utilizado.');
      if(kind==='verify')db.prepare('UPDATE users SET verified_at=? WHERE id=?').run(Date.now(),u.id);
      else {db.prepare('UPDATE users SET password=? WHERE id=?').run(encoded,u.id);db.prepare('DELETE FROM sessions WHERE user_id=?').run(u.id);}
      audit(u.id,kind,'user',u.id);
    });
    res.json({message:kind==='verify'?'Correo verificado.':'Contraseña actualizada. Inicia sesión nuevamente.'});
  });
  api.get('/categories',(_req,res)=>res.json(db.prepare('SELECT * FROM categories').all()));
  api.get('/collections',(_req,res)=>res.json(db.prepare('SELECT id,name FROM collections WHERE active=1').all()));
  api.get('/products',(req,res)=>{
    const q=req.query,page=Number(q.page??1),size=Number(q.page_size??12),min=Number(q.price_min??0),max=Number(q.price_max??Number.MAX_SAFE_INTEGER),sort=q.sort||'name_asc';
    if(!Number.isInteger(page)||page<1||!Number.isInteger(size)||size<1||size>50||!Number.isFinite(min)||!Number.isFinite(max)||min<0||max<0||min>max||String(q.q||'').length>100||(q.category&&!db.prepare('SELECT id FROM categories WHERE id=?').get(String(q.category)))||(q.collection&&!db.prepare('SELECT id FROM collections WHERE id=? AND active=1').get(String(q.collection)))||!['name_asc','name_desc','price_asc','price_desc'].includes(sort))fail(400,'Filtros no válidos. Revisa el rango de precios y los valores.');
    let items=visible().filter(p=>(!q.q||normalize(p.name).includes(normalize(String(q.q).trim())))&&(!q.category||p.category===q.category)&&(!q.collection||p.collections?.includes(q.collection))&&(!q.material||normalize(p.material).includes(normalize(String(q.material))))&&(!q.price_min&&!q.price_max||p.price_mode!=='quote'&&p.price_mxn>=min&&p.price_mxn<=max));
    items.sort((a,b)=>(sort.startsWith('price')?(a.price_mxn||0)-(b.price_mxn||0):a.name.localeCompare(b.name,'es'))*(sort.endsWith('desc')?-1:1)||a.id-b.id);
    res.json({items:items.slice((page-1)*size,page*size).map(publicProduct),total:items.length,page,page_size:size,total_pages:Math.ceil(items.length/size)});
  });
  api.get('/products/:slug',(req,res)=>{const p=visible().find(p=>p.slug===req.params.slug);if(!p)fail(404,'No encontramos esta pieza.');res.json(publicProduct(p));});

  api.get('/account/favorites',requireUser,(req,res)=>res.json(db.prepare('SELECT sku FROM favorites WHERE user_id=? ORDER BY created_at DESC').all(req.user.id).map(v=>{const p=visible().find(p=>p.variants.some(x=>x.sku===v.sku));return p?{...publicProduct(p),saved_sku:v.sku}:null}).filter(Boolean)));
  api.post('/account/favorites',requireUser,(req,res)=>{const sku=req.body.sku;if(!visible().some(p=>p.stock_status==='in_stock'&&p.variants.some(v=>v.sku===sku&&v.stock_qty>0)))fail(404,'Variante no disponible.');db.prepare('INSERT OR IGNORE INTO favorites VALUES(?,?,?)').run(req.user.id,sku,Date.now());res.sendStatus(204);});
  api.delete('/account/favorites/:sku',requireUser,(req,res)=>{db.prepare('DELETE FROM favorites WHERE user_id=? AND sku=?').run(req.user.id,req.params.sku);res.sendStatus(204);});
  api.patch('/account/profile',requireUser,(req,res)=>{const{name,marketing}=req.body;if(!text(name,2,100)||typeof marketing!=='boolean')fail(400,'Revisa tu nombre y preferencias.');transaction(()=>{db.prepare('UPDATE users SET name=?,marketing=? WHERE id=?').run(name.trim(),marketing?1:0,req.user.id);db.prepare('INSERT INTO consents(user_id,purpose,granted,created_at) VALUES(?,?,?,?)').run(req.user.id,'marketing',marketing?1:0,Date.now());});res.json(publicUser(db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id)));});
  api.get('/account/export',requireUser,(req,res)=>{res.set('Content-Disposition','attachment; filename="mis-datos-cfancy.json"');res.json({profile:publicUser(req.user),consents:db.prepare('SELECT purpose,granted,created_at FROM consents WHERE user_id=?').all(req.user.id),consultations:db.prepare('SELECT * FROM advisories WHERE user_id=?').all(req.user.id).map(c=>detail(c,false))});});
  api.get('/account/consultations',requireUser,(req,res)=>res.json(db.prepare('SELECT * FROM advisories WHERE user_id=? ORDER BY updated_at DESC').all(req.user.id).filter(c=>demo||!c.is_demo).map(caseSummary)));
  api.post('/consultations',(req,res)=>{
    limit('advisory:'+req.ip,20);
    const b=req.body,name=req.user?.name||b.name,email=req.user?.email||String(b.email||'').trim().toLowerCase();
    if(!text(name,2,100)||!emailValid(email)||!text(b.subject,3,160)||!text(b.message,10,4000)||!text(b.occasion||'',0,120)||!text(b.budget||'',0,120)||b.accept_privacy!==true)fail(400,'Completa nombre, correo, asunto, mensaje y aceptación de privacidad.');
    const key=req.get('Idempotency-Key');if(!/^[a-zA-Z0-9-]{20,80}$/.test(key||''))fail(400,'Identificador de solicitud no válido.');
    if(!req.user&&!/^[a-f0-9]{64}$/.test(b.access_token||''))fail(400,'Identificador de seguimiento no válido.');
    const p=b.product_id?visible().find(p=>p.id===Number(b.product_id)):null;if(b.product_id&&!p)fail(400,'La pieza no está disponible para consulta.');
    if(b.variant_sku&&(!p||!p.variants.some(v=>v.sku===b.variant_sku)))fail(400,'La variante no pertenece a esta pieza.');
    const payload=digest(JSON.stringify([name,email,b.subject.trim(),b.message.trim(),p?.id||null,b.variant_sku||null,b.occasion||'',b.budget||'']));
    const prior=db.prepare('SELECT * FROM advisories WHERE idempotency_key=?').get(key);
    if(prior){if(prior.payload_hash!==payload||!(req.user?.id===prior.user_id||(!req.user&&prior.guest_token_hash===digest(b.access_token))))fail(409,'Esta solicitud ya fue utilizada con otros datos.');return res.status(200).json({id:prior.id,message:'Tu consulta ya fue recibida.',access_token:req.user?undefined:b.access_token});}
    const id=uuid(),now=Date.now();
    transaction(()=>{db.prepare('INSERT INTO advisories(id,user_id,guest_token_hash,name,email,product_id,variant_sku,subject,message,occasion,budget,created_at,updated_at,idempotency_key,payload_hash,is_demo) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(id,req.user?.id||null,req.user?null:digest(b.access_token),name.trim(),email,p?.id||null,b.variant_sku||null,b.subject.trim(),b.message.trim(),b.occasion||'',b.budget||'',now,now,key,payload,demo?1:0);db.prepare('INSERT INTO messages(advisory_id,user_id,author_name,body,created_at) VALUES(?,?,?,?,?)').run(id,req.user?.id||null,name.trim(),b.message.trim(),now);db.prepare('INSERT INTO events VALUES(?,?,?,?)').run(uuid(),'advisory_received',p?.id||null,now);});
    res.status(201).json({id,message:'Consulta recibida en nuestro espacio de atención.',access_token:req.user?undefined:b.access_token});
  });
  api.get('/consultations/:id',(req,res)=>res.json(detail(caseAccess(req),req.user?.role==='admin')));
  api.post('/consultations/:id/messages',(req,res)=>{
    const c=caseAccess(req);limit('message:'+req.ip,60);
    if(!text(req.body.body,1,4000)||typeof(req.body.internal??false)!=='boolean')fail(400,'Escribe un mensaje de hasta 4,000 caracteres.');
    if(req.body.internal&&req.user?.role!=='admin')fail(403,'No puedes crear notas privadas.');
    const internal=req.body.internal===true;const now=Date.now();
    transaction(()=>{db.prepare('INSERT INTO messages(advisory_id,user_id,author_name,body,internal,created_at) VALUES(?,?,?,?,?,?)').run(c.id,req.user?.id||null,req.user?.name||c.name,req.body.body.trim(),internal?1:0,now);db.prepare('UPDATE advisories SET updated_at=?,first_response_at=COALESCE(first_response_at,?),status=CASE WHEN status=\'new\' AND ?=1 THEN \'contacted\' ELSE status END WHERE id=?').run(now,req.user?.role==='admin'&&!internal?now:null,req.user?.role==='admin'&&!internal?1:0,c.id);audit(req.user?.id,'message','advisory',c.id,internal?'internal':'public');});
    res.status(201).json({message:'Mensaje guardado.'});
  });
  api.post('/consultations/:id/quotes/:quoteId/respond',(req,res)=>{
    const c=caseAccess(req);if(req.user?.role==='admin')fail(403,'La respuesta corresponde a la clienta.');
    const q=db.prepare('SELECT * FROM quotes WHERE id=? AND advisory_id=?').get(req.params.quoteId,c.id);
    if(!q)fail(404,'Propuesta no encontrada.');if(q.status!=='sent'||q.valid_until<Date.now())fail(409,'La propuesta ya no admite respuesta.');
    if(!['accepted','rejected'].includes(req.body.status))fail(400,'Respuesta no válida.');
    db.prepare('UPDATE quotes SET status=?,responded_at=? WHERE id=?').run(req.body.status,Date.now(),q.id);audit(req.user?.id,'quote_'+req.body.status,'quote',q.id);res.json({message:'Respuesta registrada. No se ha realizado ningún cobro ni pedido.'});
  });
  api.post('/consultations/:id/appointments/:appointmentId/respond',(req,res)=>{
    const c=caseAccess(req);const a=db.prepare('SELECT * FROM appointments WHERE id=? AND advisory_id=?').get(req.params.appointmentId,c.id);
    if(!a)fail(404,'Cita no encontrada.');if(a.status!=='proposed'||a.starts_at<Date.now())fail(409,'Esta cita ya no admite cambios.');
    const allowed=req.user?.role==='admin'?['cancelled']:['confirmed','declined'];if(!allowed.includes(req.body.status))fail(400,'Estado de cita no válido.');
    db.prepare('UPDATE appointments SET status=? WHERE id=?').run(req.body.status,a.id);res.json({message:'Estado de la cita actualizado.'});
  });
  api.post('/events',(req,res)=>{
    limit('event:'+req.ip,200);if(!['view_item','save_selection','advisory_click'].includes(req.body.type)||!/^[\w-]{20,80}$/.test(req.body.id||''))fail(400,'Evento no válido.');
    const productId=req.body.product_id?Number(req.body.product_id):null;if(productId&&!visible().some(p=>p.id===productId))fail(400,'Pieza no válida.');
    // No se aceptan payloads, UTMs ni identificadores personales arbitrarios.
    db.prepare('INSERT OR IGNORE INTO events VALUES(?,?,?,?)').run(req.body.id,req.body.type,productId,Date.now());res.sendStatus(204);
  });

  api.use('/admin',requireAdmin);
  api.post('/admin/media/upload',(req,res)=>{
    const b=req.body;if(!Buffer.isBuffer(b)||b.length<12)fail(400,'Selecciona una fotografía válida.');
    const kind=b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'png':b[0]===255&&b[1]===216&&b[2]===255?'jpg':b.subarray(0,4).toString()==='RIFF'&&b.subarray(8,12).toString()==='WEBP'?'webp':null;
    if(!kind)fail(400,'Admitimos imágenes PNG, JPG o WebP de hasta 8 MB.');
    const folder=path.join(store.root,'runtime/uploads');mkdirSync(folder,{recursive:true});const filename=uuid()+'.'+kind;writeFileSync(path.join(folder,filename),b,{flag:'wx'});audit(req.user.id,'upload','media',filename);res.status(201).json({path:'/assets/uploads/'+filename});
  });
  api.post('/admin/taxonomies/:kind',(req,res)=>{const {kind}=req.params,b=req.body;if(!['categories','collections'].includes(kind)||!/^[-a-z0-9]{3,80}$/.test(b.id||'')||!text(b.name,2,100))fail(400,'Revisa el nombre y la clave de la clasificación.');if(kind==='categories')db.prepare('INSERT INTO categories VALUES(?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name').run(b.id,b.name.trim());else db.prepare('INSERT INTO collections VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,active=excluded.active').run(b.id,b.name.trim(),b.active===false?0:1);audit(req.user.id,'taxonomy',kind,b.id);res.json({message:'Clasificación guardada.'});});
  api.get('/admin/overview',(_req,res)=>{
    const cases=db.prepare(`SELECT * FROM advisories ${demo?'':'WHERE is_demo=0'} ORDER BY updated_at DESC`).all();
    const responses=cases.filter(c=>c.first_response_at).map(c=>c.first_response_at-c.created_at).sort((a,b)=>a-b);
    res.json({total_consultations:cases.length,open_consultations:cases.filter(c=>!c.status.startsWith('closed')).length,new_consultations:cases.filter(c=>c.status==='new').length,clients:db.prepare("SELECT count(*) AS n FROM users WHERE role='client'").get().n,products:allProducts().length,accepted_quotes:db.prepare("SELECT count(*) AS n FROM quotes WHERE status='accepted'").get().n,median_response_minutes:responses.length?Math.round(responses[Math.floor(responses.length/2)]/60000):null,events:db.prepare('SELECT type,count(*) AS total FROM events GROUP BY type').all(),pipeline:statuses.map(status=>({status,total:cases.filter(c=>c.status===status).length})),recent:cases.slice(0,6).map(caseSummary),demo});
  });
  api.get('/admin/consultations',(req,res)=>{const status=req.query.status;if(status&&!statuses.includes(status))fail(400,'Estado no válido.');res.json(db.prepare(`SELECT * FROM advisories ${status?'WHERE status=?':''} ORDER BY updated_at DESC`).all(...(status?[status]:[])).filter(c=>demo||!c.is_demo).filter(c=>!req.query.q||normalize(c.name+' '+c.subject+' '+c.email).includes(normalize(String(req.query.q)))).map(caseSummary));});
  api.patch('/admin/consultations/:id',(req,res)=>{
    const c=caseAccess(req),{status,priority,assigned_to}=req.body;
    if(!statuses.includes(status)||!['normal','high'].includes(priority))fail(400,'Revisa estado y prioridad.');
    if(assigned_to&&!db.prepare("SELECT id FROM users WHERE id=? AND role='admin'").get(Number(assigned_to)))fail(400,'Responsable no válido.');
    db.prepare('UPDATE advisories SET status=?,priority=?,assigned_to=?,closed_at=?,updated_at=? WHERE id=?').run(status,priority,assigned_to?Number(assigned_to):null,status.startsWith('closed')?Date.now():null,Date.now(),c.id);audit(req.user.id,'status','advisory',c.id,status);res.json(detail(db.prepare('SELECT * FROM advisories WHERE id=?').get(c.id),true));
  });
  api.post('/admin/consultations/:id/quotes',(req,res)=>{
    const c=caseAccess(req),b=req.body,amount=Number(b.amount_mxn),until=Date.parse(b.valid_until);
    if(!text(b.title,3,160)||!text(b.details,5,4000)||!Number.isFinite(amount)||amount<=0||amount>10000000||!Number.isFinite(until)||until<=Date.now())fail(400,'Completa propuesta, importe positivo y vigencia futura.');
    const id=uuid();transaction(()=>{db.prepare('INSERT INTO quotes(id,advisory_id,title,amount_minor,details,valid_until,created_by,created_at,is_demo) VALUES(?,?,?,?,?,?,?,?,?)').run(id,c.id,b.title.trim(),Math.round(amount*100),b.details.trim(),until,req.user.id,Date.now(),demo?1:0);db.prepare("UPDATE advisories SET status='quoted',updated_at=? WHERE id=?").run(Date.now(),c.id);audit(req.user.id,'quote_sent','quote',id);});res.status(201).json({id});
  });
  api.post('/admin/consultations/:id/appointments',(req,res)=>{const c=caseAccess(req),b=req.body,time=Date.parse(b.starts_at);if(!Number.isFinite(time)||time<=Date.now()||!text(b.channel,3,120)||!text(b.note||'',0,1000))fail(400,'Elige una fecha futura, canal y detalles válidos.');const id=uuid();db.prepare('INSERT INTO appointments VALUES(?,?,?,?,?,?,?)').run(id,c.id,time,b.channel.trim(),b.note||'','proposed',Date.now());audit(req.user.id,'appointment','advisory',c.id);res.status(201).json({id});});
  api.get('/admin/users',(_req,res)=>res.json(db.prepare('SELECT * FROM users ORDER BY id DESC').all().filter(u=>demo||!u.is_demo_user).map(u=>({...publicUser(u),consultations:db.prepare('SELECT count(*) AS n FROM advisories WHERE user_id=?').get(u.id).n,created_at:u.created_at}))));
  api.get('/admin/products',(_req,res)=>res.json(allProducts()));
  api.post('/admin/products',(req,res)=>saveProduct(req,res,null));
  api.patch('/admin/products/:id',(req,res)=>saveProduct(req,res,Number(req.params.id)));
  function saveProduct(req,res,id){
    const old=id?findProduct(id):null;if(id&&!old)fail(404,'Producto no encontrado.');
    const fixture=id?db.prepare('SELECT demo_fixture FROM products WHERE id=?').get(id).demo_fixture:0;
    const b=req.body,p={...(old||{}),...b};
    if(fixture&&!p.is_demo)fail(400,'Los fixtures de demostración no pueden convertirse en inventario real. Crea una ficha nueva con evidencia.');
    if(!text(p.name,3,120)||!/^[-a-z0-9]{3,100}$/.test(p.slug||'')||!db.prepare('SELECT id FROM categories WHERE id=?').get(p.category)||!text(p.description,10,4000)||!text(p.material,2,120)||!text(p.measurements,2,1000)||!text(p.care,3,2000))fail(400,'Completa nombre, URL, categoría, descripción, material, medidas y cuidados.');
    if(!['demo','fixed','quote'].includes(p.price_mode)||p.price_mode!=='quote'&&(!Number.isFinite(p.price_mxn)||p.price_mxn<0||!Number.isSafeInteger(Math.round(p.price_mxn*100)))||!['in_stock','out_of_stock','made_to_order'].includes(p.stock_status)||typeof p.is_demo!=='boolean'||!['pending','approved','rejected'].includes(p.verification_status)||!['draft','review','demo_only','published','archived'].includes(p.publication_status))fail(400,'Revisa precio, disponibilidad y estados.');
    if(!Number.isFinite(p.weight_g)||p.weight_g<=0||!['natural','laboratory','mixed','none','unknown'].includes(p.stone_origin)||(p.metal_karat!=null&&(!Number.isFinite(p.metal_karat)||p.metal_karat<=0||p.metal_karat>24))||(p.metal_fineness!=null&&(!Number.isInteger(p.metal_fineness)||p.metal_fineness<1||p.metal_fineness>1000))||!Number.isFinite(p.stone_carat_total??0)||(p.stone_carat_total||0)<0)fail(400,'Revisa el peso, la ley del metal y las características de las piedras.');
    if(!Array.isArray(p.variants)||!p.variants.length||p.variants.length>30||p.variants.some(v=>!/^[-A-Z0-9]{3,80}$/i.test(v.sku||'')||!text(v.label,1,100)||!Number.isInteger(v.stock_qty)||v.stock_qty<0)||new Set(p.variants.map(v=>v.sku)).size!==p.variants.length)fail(400,'Cada variante necesita SKU único, etiqueta y existencias enteras.');
    for(const v of p.variants){const prev=db.prepare('SELECT product_id FROM variants WHERE sku=?').get(v.sku);if(prev&&prev.product_id!==id)fail(400,'Este SKU ya pertenece a otra pieza.');}
    if(!Array.isArray(p.collections)||p.collections.some(c=>!db.prepare('SELECT id FROM collections WHERE id=?').get(c)))fail(400,'Colecciones no válidas.');
    if(p.media&&(!Array.isArray(p.media)||p.media.length>10||p.media.some(m=>!['front','side','detail','scale','clasp','packaging'].includes(m.view)||!/^\/assets\/[a-zA-Z0-9_./-]+\.(png|webp|jpg|jpeg|avif)$/.test(m.path||'')||m.path.includes('..')||!['product_photo','ai_generated'].includes(m.source_kind)||!text(m.alt,3,300)||!text(m.rights_reference,3,300)||!(m.panel===undefined||[0,1,2].includes(m.panel))||!(m.path.startsWith('/assets/uploads/')?existsSync(path.join(store.root,'runtime/uploads',path.basename(m.path))):existsSync(path.resolve(store.root,'public','.'+m.path))||existsSync(path.resolve(store.root,'dist','.'+m.path))))))fail(400,'Revisa archivos existentes, procedencia, permisos y descripción de las imágenes.');
    if(p.certificate_status==='verified'&&(!text(p.certificate_issuer,2,120)||!text(p.certificate_reference,3,200)||!text(p.certificate_evidence,3,1000)))fail(400,'Registra emisor, referencia y evidencia antes de marcar el documento como revisado.');
    const publishProblems=[];
    if(p.is_demo||fixture)publishProblems.push('pieza de demostración');
    if(p.verification_status!=='approved'||!text(p.material_evidence,3,1000))publishProblems.push('material y evidencia por aprobar');
    if(!p.media||['front','side','detail'].some(v=>!p.media.some(m=>m.view===v&&m.source_kind==='product_photo'))||new Set(p.media.filter(m=>m.source_kind==='product_photo').map(m=>m.path)).size<3)publishProblems.push('fotografías reales distintas de tres vistas');
    if(!p.metal_fineness)publishProblems.push('ley del metal confirmada');
    if(p.stone_origin==='unknown'||p.stone_origin==='mixed'&&!p.stone_details)publishProblems.push('origen y detalle de las gemas');
    if(p.price_mode==='demo'||p.price_mode==='fixed'&&!text(p.price_approval,3,1000))publishProblems.push('precio comercial aprobado o cotización');
    const settings=settingsOf(db);if(['privacy','shipping','warranty','returns'].some(k=>settings[k+'_status']!=='approved'))publishProblems.push('políticas comerciales aprobadas');
    if(p.publication_status==='published'&&publishProblems.length)fail(400,'Para publicar faltan: '+publishProblems.join('; ')+'.');
    const safe={...p,id:id||Number(db.prepare('SELECT COALESCE(MAX(id),0)+1 AS id FROM products').get().id)};
    delete safe.demo_fixture;
    transaction(()=>{if(id)db.prepare('UPDATE products SET slug=?,document=? WHERE id=?').run(safe.slug,JSON.stringify(safe),id);else db.prepare('INSERT INTO products(id,slug,document,demo_fixture) VALUES(?,?,?,0)').run(safe.id,safe.slug,JSON.stringify(safe));syncProduct(safe);audit(req.user.id,id?'update':'create','product',safe.id,JSON.stringify({publication_status:p.publication_status,price_mode:p.price_mode}));});
    res.status(id?200:201).json({...safe,publish_problems:publishProblems});
  }
  api.get('/admin/settings',(_req,res)=>res.json(settingsOf(db)));
  api.patch('/admin/settings',(req,res)=>{
    const allowed=['service_name','service_hours','response_note','contact_email','contact_phone','coverage','privacy','privacy_status','shipping','shipping_status','warranty','warranty_status','returns','returns_status'];
    for(const[k,v]of Object.entries(req.body)){if(!allowed.includes(k)||!text(v,0,8000)||k.endsWith('_status')&&!['draft','approved'].includes(v))fail(400,'Configuración no válida.');if(k==='contact_email'&&v&&!emailValid(v))fail(400,'Correo de contacto no válido.');}
    const resulting={...settingsOf(db),...req.body};for(const k of ['privacy','shipping','warranty','returns'])if(resulting[k+'_status']==='approved'&&!text(resulting[k],20,8000))fail(400,'Una política aprobada necesita un texto completo.');
    transaction(()=>{for(const[k,v]of Object.entries(req.body)){db.prepare('INSERT INTO settings VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(k,v);if(['privacy','shipping','warranty','returns'].includes(k))db.prepare('INSERT INTO policy_versions(type,body,status,created_at,created_by) VALUES(?,?,?,?,?)').run(k,v,req.body[k+'_status']||settingsOf(db)[k+'_status'],Date.now(),req.user.id);}audit(req.user.id,'settings','settings','site',Object.keys(req.body).join(','));});res.json(settingsOf(db));
  });
  api.get('/admin/audit',(_req,res)=>res.json(db.prepare('SELECT a.*,u.name AS actor_name FROM audit_events a LEFT JOIN users u ON u.id=a.actor_id ORDER BY a.id DESC LIMIT 150').all()));
  api.get('/admin/mail',(_req,res)=>res.json(db.prepare(`SELECT id,recipient,subject,status,created_at,error${demo?',body':''} FROM outbox ORDER BY created_at DESC LIMIT 100`).all()));
  api.get('/admin/export',(_req,res)=>{res.set('Content-Disposition','attachment; filename="cfancy-gestion.json"');res.json({exported_at:new Date().toISOString(),products:allProducts(),consultations:db.prepare('SELECT * FROM advisories').all().map(c=>detail(c,true)),settings:settingsOf(db)});});
  api.post('/admin/backups',async(req,res)=>{const folder=path.join(store.root,'runtime/backups');mkdirSync(folder,{recursive:true});const name=`cfancy-${Date.now()}.sqlite`;await backup(db,path.join(folder,name));audit(req.user.id,'backup','database',name);res.status(201).json({message:'Copia consistente creada en el servidor.',file:name});});
  api.use((_req,_res,next)=>next(Object.assign(new Error('Ruta no encontrada.'),{status:404})));
  return api;
}
