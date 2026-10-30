import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {hash} from '@node-rs/argon2';
import {createStore} from '../server/store.mjs';
import {emailValid,passwordValid,text} from '../server/security.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
try{process.loadEnvFile(path.join(root,'.env'))}catch(e){if(e.code!=='ENOENT')throw e}
const email=process.env.ADMIN_EMAIL?.trim().toLowerCase(),name=process.env.ADMIN_NAME||'Administración C’FANCY',password=process.env.ADMIN_PASSWORD;
if(!emailValid(email)||!passwordValid(password)||!text(name,2,100))throw Error('Configura ADMIN_EMAIL, ADMIN_NAME y ADMIN_PASSWORD (15–128 caracteres) en el entorno privado del proceso.');
const store=await createStore(root,process.env.DB_PATH||path.join(root,'runtime/cfancy.sqlite'),false);
if(store.db.prepare('SELECT id FROM users WHERE email=?').get(email))throw Error('El correo ya existe; no se modificó la cuenta ni su perfil.');
const encoded=await hash(password,{memoryCost:19456,timeCost:2,parallelism:1});
const result=store.db.prepare("INSERT INTO users(name,email,password,role,verified_at,is_demo_user,created_at) VALUES(?,?,?,'admin',?,0,?)").run(name,email,encoded,Date.now(),Date.now());
store.audit(Number(result.lastInsertRowid),'bootstrap_admin','user',Number(result.lastInsertRowid));store.db.close();console.log('Administrador creado. La contraseña no se imprime ni se guarda en archivos de entrega.');
