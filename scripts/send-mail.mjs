import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
try{process.loadEnvFile(path.join(root,'.env'))}catch(e){if(e.code!=='ENOENT')throw e}
if(process.env.DEMO!=='false')throw Error('El modo de demostración conserva el correo local. No se enviará ningún mensaje.');
if(!process.env.RESEND_API_KEY||!process.env.MAIL_FROM)throw Error('Configura un dominio remitente autorizado, MAIL_FROM y RESEND_API_KEY en el entorno privado.');
const db=new DatabaseSync(process.env.DB_PATH||path.join(root,'runtime/cfancy.sqlite'));
const rows=db.prepare("SELECT * FROM outbox WHERE status='queued' ORDER BY created_at LIMIT 50").all();let sent=0,failed=0,expired=0;
for(const m of rows){
 const ttl=m.subject.startsWith('Restablece')?1800000:86400000;
 if(Date.now()-m.created_at>ttl){db.prepare("UPDATE outbox SET status='expired',body='' WHERE id=?").run(m.id);expired++;continue;}
 try{
  const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':m.id},body:JSON.stringify({from:process.env.MAIL_FROM,to:[m.recipient],subject:m.subject,text:m.body}),signal:AbortSignal.timeout(20000)});
  if(!r.ok)throw Error('provider_status_'+r.status);
  db.prepare("UPDATE outbox SET status='sent',body='',error=NULL WHERE id=?").run(m.id);sent++;
 }catch(e){db.prepare("UPDATE outbox SET error=? WHERE id=?").run('No enviado; revisar configuración o disponibilidad del proveedor.',m.id);failed++;}
}
db.close();console.log(JSON.stringify({processed:rows.length,sent,failed,expired}));
