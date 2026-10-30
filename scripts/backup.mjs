import {DatabaseSync,backup} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
try{process.loadEnvFile(path.join(root,'.env'))}catch(e){if(e.code!=='ENOENT')throw e}
const db=new DatabaseSync(process.env.DB_PATH||path.join(root,'runtime/cfancy.sqlite'),{readOnly:true});
const folder=path.join(root,'runtime/backups');mkdirSync(folder,{recursive:true});const file=path.join(folder,`cfancy-${Date.now()}.sqlite`);
await backup(db,file);db.close();console.log('Copia consistente creada: '+file);
