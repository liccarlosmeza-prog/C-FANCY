import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStore } from './store.mjs';
import { installSecurity } from './security.mjs';
import { createRoutes } from './routes.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
try { process.loadEnvFile(path.join(root,'.env')); } catch(error) { if(error.code!=='ENOENT')throw error; }
const demo=process.env.DEMO!=='false',port=Number(process.env.PORT||3000),origin=process.env.APP_ORIGIN||`http://localhost:${port}`,secure=process.env.COOKIE_SECURE==='true';
if(new URL(origin).origin!==origin)throw Error('APP_ORIGIN debe ser un origen completo, sin ruta, parámetros ni barra final.');
if(!demo&&(!secure||!origin.startsWith('https://')))throw Error('La operación sin demo requiere APP_ORIGIN HTTPS y COOKIE_SECURE=true.');
const store=await createStore(root,process.env.DB_PATH||path.join(root,'runtime/cfancy.sqlite'),demo);
const app=express();
if(process.env.TRUST_PROXY)app.set('trust proxy',process.env.TRUST_PROXY);
app.use('/api/v1/admin/media/upload',express.raw({type:['image/jpeg','image/png','image/webp'],limit:'8mb'}));
app.use(express.json({limit:'80kb'}));
installSecurity(app,store,origin,secure);
app.use('/assets/uploads',express.static(path.join(root,'runtime/uploads'),{dotfiles:'deny',fallthrough:false}));
app.use('/api/v1',createRoutes(store,origin));
app.get('/robots.txt',(_req,res)=>res.type('text').send(demo?'User-agent: *\nDisallow: /\n':`User-agent: *\nDisallow: /admin\nDisallow: /cuenta\nDisallow: /consulta\nSitemap: ${origin}/sitemap.xml\n`));
app.get('/sitemap.xml',(_req,res)=>{const slugs=demo?[]:store.db.prepare('SELECT document FROM products WHERE demo_fixture=0').all().map(r=>JSON.parse(r.document)).filter(p=>p.publication_status==='published'&&!p.is_demo&&p.verification_status==='approved').map(p=>p.slug);const urls=demo?[]:['/','/joyas','/materiales','/colecciones',...slugs.map(s=>'/joya/'+encodeURIComponent(s))];res.type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(s=>`<url><loc>${origin.replaceAll('&','&amp;')}${s}</loc></url>`).join('')+'</urlset>');});
if(process.argv.includes('--production')){
 app.use((_req,res,next)=>{res.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");next();});
 app.use(express.static(path.join(root,'dist')));
 app.get('/{*path}',(req,res)=>{if(req.path.startsWith('/api/'))return res.status(404).json({message:'Ruta no encontrada.'});res.sendFile(path.join(root,'dist/index.html'));});
}else{
 const {createServer}=await import('vite');const vite=await createServer({root,server:{middlewareMode:true},appType:'spa'});app.use(vite.middlewares);
}
app.use((error,_req,res,_next)=>{const status=error.status||(error.code?.startsWith('ERR_SQLITE')?409:500);if(status===429)res.set('Retry-After','900');res.status(status).json({message:error.type==='entity.parse.failed'?'El formulario contiene datos no válidos.':status===413?'La solicitud supera el tamaño permitido.':status===500?'No se pudo completar la solicitud.':status===409&&!error.status?'Este dato ya existe o está relacionado con otro registro.':error.message});});
const server=app.listen(port,process.env.BIND_HOST||'127.0.0.1',()=>console.log(`C’FANCY: http://localhost:${port}`));
function stop(){server.close(()=>{store.db.close();process.exit(0);});}
process.on('SIGTERM',stop);process.on('SIGINT',stop);
