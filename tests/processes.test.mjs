import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { DatabaseSync, backup } from 'node:sqlite';
import { createStore } from '../server/store.mjs';
const root=path.resolve('.'),folder=mkdtempSync(path.join(tmpdir(),'cfancy-processes-')),port=31881,origin=`http://localhost:${port}`;
let server;
before(async()=>{server=spawn(process.execPath,['server/index.mjs','--production'],{env:{...process.env,PORT:String(port),APP_ORIGIN:origin,DB_PATH:path.join(folder,'app.sqlite'),DEMO:'true'},stdio:['ignore','pipe','pipe']});let output='';server.stderr.on('data',b=>output+=b);await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error(output)),20000);server.stdout.on('data',b=>{if(String(b).includes('http://')){clearTimeout(timer);resolve()}});server.on('exit',()=>{clearTimeout(timer);reject(Error(output))})});});
after(()=>server?.kill());
class Browser{
 cookie='';
 async get(url,headers={}){return this.call(url,{headers})}
 async call(url,options={}){const r=await fetch(origin+'/api/v1'+url,{...options,headers:{cookie:this.cookie,...options.headers}});this.cookie=r.headers.get('set-cookie')?.split(';')[0]||this.cookie;return{status:r.status,headers:r.headers,data:r.status===204?null:await r.json()};}
 async mutate(url,body={},method='POST',headers={}){const c=await this.get('/auth/csrf');return this.call(url,{method,headers:{origin,'Content-Type':'application/json','X-CSRF-Token':c.data.csrf_token,...headers},body:JSON.stringify(body)})}
 async login(email,password){const r=await this.mutate('/auth/login',{email,password});assert.equal(r.status,200,JSON.stringify(r.data));return r.data;}
}
const admin=new Browser(),client=new Browser(),other=new Browser(),guest=new Browser();let caseId,quoteId,token;
test('Roles: accesos demo, autenticación y prohibición de elevar privilegios',async()=>{
 assert.equal((await guest.get('/admin/overview')).status,401);
 const a=await admin.login('admin@cfancy.demo','Cfancy.Admin.2026!');assert.equal(a.role,'admin');
 const c=await client.login('cliente@cfancy.demo','Cfancy.Cliente.2026!');assert.equal(c.role,'client');
 assert.equal((await client.get('/admin/users')).status,403);
 assert.equal((await client.mutate('/admin/settings',{service_name:'Ataque'},'PATCH')).status,403);
 assert.equal((await other.mutate('/auth/register',{name:'Otra clienta',email:'otra@example.test',password:'Otra cuenta de prueba 2026!',role:'admin'})).status,202);
 const u=await other.login('otra@example.test','Otra cuenta de prueba 2026!');assert.equal(u.role,'client');
});
test('Atención: recepción persistente, reintento idempotente y aislamiento entre clientes',async()=>{
 const key=randomUUID(),body={subject:'Consulta de Anillo Aurora',message:'Quisiera conocer la talla y las opciones de esta pieza.',product_id:1,variant_sku:'CF-DEMO-001-US6',accept_privacy:true};
 const r=await client.mutate('/consultations',body,'POST',{'Idempotency-Key':key});assert.equal(r.status,201,JSON.stringify(r.data));caseId=r.data.id;
 assert.equal((await client.mutate('/consultations',body,'POST',{'Idempotency-Key':key})).data.id,caseId);
 assert.equal((await client.mutate('/consultations',{...body,message:'Un mensaje diferente para la misma clave'},'POST',{'Idempotency-Key':key})).status,409);
 assert.equal((await client.get('/account/consultations')).data.length,1);
 assert.equal((await other.get('/consultations/'+caseId)).status,404);
 assert.equal((await other.mutate('/consultations/'+caseId+'/messages',{body:'No autorizado'})).status,404);
 assert.equal((await guest.get('/consultations/'+caseId)).status,404);
 const c=(await admin.get('/admin/consultations')).data.find(c=>c.id===caseId);assert.equal(c.status,'new');assert.equal(c.product_name,'Anillo Aurora');
});
test('Conversación: respuesta pública, notas privadas, asignación y seguimiento',async()=>{
 assert.equal((await admin.mutate('/consultations/'+caseId+'/messages',{body:'Esta es una nota interna del equipo.',internal:true})).status,201);
 assert.equal((await admin.mutate('/consultations/'+caseId+'/messages',{body:'Hola, con gusto te orientamos con la talla.',internal:false})).status,201);
 const c=(await client.get('/consultations/'+caseId)).data;assert.equal(c.messages.length,2);assert.ok(c.messages.every(m=>!m.internal));assert.ok(c.first_response_at);assert.equal(c.status,'contacted');
 assert.equal((await admin.get('/consultations/'+caseId)).data.messages.length,3);
 assert.equal((await client.mutate('/consultations/'+caseId+'/messages',{body:'Intento de nota privada',internal:true})).status,403);
 const a=(await admin.get('/auth/me')).data;
 assert.equal((await admin.mutate('/admin/consultations/'+caseId,{status:'qualified',priority:'high',assigned_to:a.id},'PATCH')).status,200);
});
test('Propuestas y citas: pertenencia, aceptación, vigencia y ausencia de cobros',async()=>{
 const r=await admin.mutate('/admin/consultations/'+caseId+'/quotes',{title:'Aurora · asesoría de talla',amount_mxn:38900,details:'Ejemplo de propuesta, sin pago ni pedido.',valid_until:new Date(Date.now()+86400000).toISOString()});assert.equal(r.status,201);quoteId=r.data.id;
 assert.equal((await other.mutate(`/consultations/${caseId}/quotes/${quoteId}/respond`,{status:'accepted'})).status,404);
 assert.equal((await client.mutate(`/consultations/${caseId}/quotes/${quoteId}/respond`,{status:'accepted'})).status,200);
 assert.equal((await client.mutate(`/consultations/${caseId}/quotes/${quoteId}/respond`,{status:'rejected'})).status,409);
 const ap=await admin.mutate(`/admin/consultations/${caseId}/appointments`,{starts_at:new Date(Date.now()+86400000).toISOString(),channel:'Portal C’FANCY',note:'Conversación de demostración'});assert.equal(ap.status,201);
 assert.equal((await client.mutate(`/consultations/${caseId}/appointments/${ap.data.id}/respond`,{status:'confirmed'})).status,200);
 assert.equal((await admin.get('/admin/overview')).data.accepted_quotes,1);
});
test('Invitada: consulta sin cuenta y seguimiento solo con credencial de propiedad',async()=>{
 token='a'.repeat(64);const r=await guest.mutate('/consultations',{name:'Invitada demo',email:'invitada@example.test',subject:'Una pieza personalizada',message:'Quisiera explorar una medalla con una inicial.',accept_privacy:true,access_token:token},'POST',{'Idempotency-Key':randomUUID()});assert.equal(r.status,201);
 assert.equal((await guest.get('/consultations/'+r.data.id)).status,404);
 assert.equal((await guest.get('/consultations/'+r.data.id,{'X-Case-Token':token})).status,200);
 assert.equal((await guest.mutate('/consultations/'+r.data.id+'/messages',{body:'Gracias por acompañar mi idea.'},'POST',{'X-Case-Token':token})).status,201);
 assert.equal((await guest.get('/consultations/'+r.data.id,{'X-Case-Token':'b'.repeat(64)})).status,404);
});
test('Selección y perfil: persistencia y consentimiento independiente',async()=>{
 assert.equal((await client.mutate('/account/favorites',{sku:'CF-DEMO-001-US6'})).status,204);
 assert.equal((await client.mutate('/account/favorites',{sku:'CF-DEMO-001-US6'})).status,204);
 assert.equal((await client.get('/account/favorites')).data.length,1);
 assert.equal((await other.get('/account/favorites')).data.length,0);
 assert.equal((await client.mutate('/account/profile',{name:'Valentina de prueba',marketing:true},'PATCH')).data.marketing,true);
 assert.equal((await client.get('/account/export')).data.profile.name,'Valentina de prueba');
 assert.equal((await client.mutate('/account/favorites/CF-DEMO-001-US6',{},'DELETE')).status,204);
});
test('Catálogo: edición con historial, validación de publicación, archivo y privacidad',async()=>{
 const p=(await admin.get('/admin/products')).data.find(p=>p.id===1);
 const body={...p,price_mxn:39100,price_mode:'demo',verification_status:'pending',name:'Anillo Aurora editado'};
 assert.equal((await client.mutate('/admin/products/1',body,'PATCH')).status,403);
 assert.equal((await admin.mutate('/admin/products/1',body,'PATCH')).status,200);
 assert.equal((await guest.get('/products/anillo-aurora')).data.price_mxn,39100);
 assert.equal((await admin.mutate('/admin/products/1',{...body,is_demo:false,publication_status:'published'},'PATCH')).status,400);
 assert.equal((await admin.mutate('/admin/products/1',{...body,publication_status:'archived'},'PATCH')).status,200);
 assert.equal((await guest.get('/products/anillo-aurora')).status,404);
 await admin.mutate('/admin/products/1',body,'PATCH');
 const pub=(await guest.get('/products/anillo-aurora')).data;assert.equal(pub.material_evidence,undefined);assert.equal(pub.demo_fixture,undefined);assert.equal(pub.variants[0].stock_qty,undefined);
});
test('Correo: verificación y recuperación local, enlaces de uso único y revocación',async()=>{
 let out=(await admin.get('/admin/mail')).data.find(m=>m.recipient==='otra@example.test'&&m.subject.startsWith('Verifica'));
 assert.ok(out);assert.equal((await client.get('/admin/mail')).status,403);
 let token=new URL(out.body.match(/https?:\/\/[^\s]+/)[0]).searchParams.get('token');
 assert.equal((await other.mutate('/auth/token',{kind:'verify',token})).status,200);
 assert.equal((await other.mutate('/auth/token',{kind:'verify',token})).status,400);
 assert.equal((await other.get('/auth/me')).data.verified,true);
 assert.equal((await guest.mutate('/auth/forgot',{email:'otra@example.test'})).status,202);
 out=(await admin.get('/admin/mail')).data.find(m=>m.recipient==='otra@example.test'&&m.subject.startsWith('Restablece'));
 token=new URL(out.body.match(/https?:\/\/[^\s]+/)[0]).searchParams.get('token');
 assert.equal((await guest.mutate('/auth/token',{kind:'reset',token,password:'Contraseña de reemplazo 2026!'})).status,200);
 assert.equal((await other.get('/auth/me')).status,401);
 assert.equal((await guest.mutate('/auth/token',{kind:'reset',token,password:'Contraseña de reemplazo 2026!'})).status,400);
 await other.login('otra@example.test','Contraseña de reemplazo 2026!');
});
test('CSRF en PATCH/DELETE, datos agregados y taxonomías',async()=>{
 assert.equal((await client.call('/account/profile',{method:'PATCH',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify({name:'Ataque',marketing:false})})).status,403);
 const event=randomUUID();await guest.mutate('/events',{id:event,type:'advisory_click'});await guest.mutate('/events',{id:event,type:'advisory_click'});
 assert.equal((await admin.get('/admin/overview')).data.events.find(e=>e.type==='advisory_click').total,1);
 assert.equal((await guest.mutate('/events',{id:randomUUID(),type:'purchase'})).status,400);
 assert.equal((await admin.mutate('/admin/taxonomies/collections',{id:'prueba-curaduria',name:'Curaduría de prueba'})).status,200);
 assert.ok((await guest.get('/collections')).data.some(c=>c.id==='prueba-curaduria'));
});
test('Carga de imagen: solo administración, firma válida y protección contra rutas',async()=>{
 const png=readFileSync(path.join(root,'public/assets/products/anillo-aurora.png'));const csrf=(await admin.get('/auth/csrf')).data.csrf_token;
 const r=await admin.call('/admin/media/upload',{method:'POST',headers:{origin,'Content-Type':'image/png','X-CSRF-Token':csrf},body:png});assert.equal(r.status,201);assert.match(r.data.path,/^\/assets\/uploads\/.*\.png$/);
 const c=(await client.get('/auth/csrf')).data.csrf_token;
 assert.equal((await client.call('/admin/media/upload',{method:'POST',headers:{origin,'Content-Type':'image/png','X-CSRF-Token':c},body:png})).status,403);
 const bad=await admin.call('/admin/media/upload',{method:'POST',headers:{origin,'Content-Type':'image/png','X-CSRF-Token':csrf},body:Buffer.from('<svg onload="alert(1)"></svg>')});assert.equal(bad.status,400);
});
test('Continuidad: seed idempotente, relaciones y backup restaurable',async()=>{
 const file=path.join(folder,'seed.sqlite');let s=await createStore(root,file,false);
 const p=s.findProduct(1);p.name='No sobrescribir';s.db.prepare('UPDATE products SET document=? WHERE id=1').run(JSON.stringify(p));s.db.close();
 s=await createStore(root,file,false);assert.equal(s.findProduct(1).name,'No sobrescribir');assert.equal(s.db.prepare('SELECT count(*) AS n FROM variants').get().n,13);
 const target=path.join(folder,'restore.sqlite');await backup(s.db,target);s.db.close();const restored=new DatabaseSync(target);assert.equal(restored.prepare('PRAGMA integrity_check').get().integrity_check,'ok');assert.equal(JSON.parse(restored.prepare('SELECT document FROM products WHERE id=1').get().document).name,'No sobrescribir');restored.close();
 assert.equal((await admin.mutate('/admin/backups')).status,201);
});
test('Modo operativo: excluye catálogo y cuentas demo, cookie Secure y sitemap limpio',async()=>{
 const file=path.join(folder,'operativo.sqlite');const seed=await createStore(root,file,true);seed.db.close();
 const service=spawn(process.execPath,['server/index.mjs','--production'],{env:{...process.env,PORT:'31883',APP_ORIGIN:'https://cfancy.example',COOKIE_SECURE:'true',DB_PATH:file,DEMO:'false'},stdio:['ignore','pipe','pipe']});
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('No arrancó modo operativo.')),15000);service.stdout.on('data',b=>{if(String(b).includes('http://')){clearTimeout(timer);resolve()}});service.on('exit',()=>{clearTimeout(timer);reject(Error('Salida anticipada.'))})});
  const base='http://localhost:31883';const list=await(await fetch(base+'/api/v1/products')).json();assert.equal(list.total,0);
  const csrf=await fetch(base+'/api/v1/auth/csrf');assert.match(csrf.headers.get('set-cookie'),/Secure/);assert.match(csrf.headers.get('set-cookie'),/__Host-cf_session/);
  const token=(await csrf.json()).csrf_token;
  const login=await fetch(base+'/api/v1/auth/login',{method:'POST',headers:{origin:'https://cfancy.example',cookie:csrf.headers.get('set-cookie').split(';')[0],'Content-Type':'application/json','X-CSRF-Token':token},body:JSON.stringify({email:'admin@cfancy.demo',password:'Cfancy.Admin.2026!'})});assert.equal(login.status,401);
  assert.ok(!(await(await fetch(base+'/sitemap.xml')).text()).includes('anillo-aurora'));
 }finally{service.kill();}
});
