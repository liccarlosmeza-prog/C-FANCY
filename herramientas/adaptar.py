"""Adaptaciones de la copia de interfaz. Nunca escribe en DESPLIEGUE."""
from pathlib import Path
root = Path(__file__).resolve().parents[1] / 'fuente'
def replace(text, old, new):
    if old not in text:
        raise RuntimeError('No se encontró adaptación esperada: ' + old[:100])
    return text.replace(old, new)
p=root/'client.ts'
s=p.read_text(encoding='utf-8-sig')
start=s.index('export async function request<')
end=s.index('export async function mutate<')
s=s[:start]+"export async function request<T=any>(url:string,options:RequestInit={}):Promise<T>{return demoRequest(url,options) as Promise<T>;}\n"+s[end:]
s="import {demoRequest} from './demo-store';\nexport {downloadDemo} from './demo-store';\n"+s
p.write_text(s,encoding='utf-8')
p=root/'main.tsx';s=p.read_text(encoding='utf-8-sig')
s=replace(s,'User,CatalogProduct,mutate,price','User,CatalogProduct,mutate,price,request')
a=s.index('async function api(');b=s.index('async function post(',a)
s=s[:a]+"async function api(url:string,options:RequestInit={}){return request(url,options);}\n"+s[b:]
s=replace(s,'window.location.pathname+window.location.search',"(window.location.hash.slice(1)||'/')")
s=replace(s,"window.history.pushState({},'',to);setLocation(to);","window.location.hash=to;setLocation(to);")
s=replace(s,"'popstate'","'hashchange'")
s=s.replace('src="/assets/logo.png"','src="./assets/logo.png"')
s=s.replace('href={to}',"href={'#'+to}").replace('href="/"','href="#/"').replace("href={'/joya/'","href={'#/joya/'").replace("href={'/joyas?collection='","href={'#/joyas?collection='")
s=replace(s,"window.location.pathname==='/joyas'","window.location.hash.startsWith('#/joyas')")
s=replace(s,'window.location.search',"(window.location.hash.split('?')[1]||'')")
s=replace(s,"createRoot(document.getElementById('root')!).render(<App/>);","createRoot(document.getElementById('root')!).render(<><DemoTools/><App/></>);")
s="import {DemoTools} from './DemoTools';\nimport './static.css';\n"+s
s=s.replace('La solicitud se guarda en este servidor.','La solicitud se guarda solo en este navegador.')
p.write_text(s,encoding='utf-8')
p=root/'ProductGallery.tsx';s=p.read_text(encoding='utf-8-sig').replace("'/assets/products/'","'./assets/products/'");p.write_text(s,encoding='utf-8')
p=root/'Atelier.tsx';s=p.read_text(encoding='utf-8-sig')
s=replace(s,'caseHeaders,User','caseHeaders,downloadDemo,User')
s=replace(s,'new URLSearchParams(window.location.search)',"new URLSearchParams(window.location.hash.split('?')[1]||'')")
s=replace(s,'<a className="text-button" href="/api/v1/account/export">Descargar mis datos ↓</a>','<button className="text-button" type="button" onClick={()=>a.run(()=>downloadDemo(\'account\'),\'Archivo de prueba descargado.\')}>Descargar mis datos ↓</button>')
s=replace(s,'<a className="text-button" href="/api/v1/admin/export">Exportar gestión ↓</a>','<button className="text-button" type="button" onClick={()=>downloadDemo(\'admin\').catch(e=>window.dispatchEvent(new CustomEvent(\'demo-feedback\',{detail:e.message})))}>Exportar gestión ↓</button>')
s=s.replace('`/assets/products/','`./assets/products/')
s=s.replace('La solicitud se guarda en este servidor.','La solicitud se guarda en este navegador.')
s=s.replace('con acceso restringido.','según el perfil visual de prueba; sin seguridad real.')
s=s.replace('El portal recibe las consultas aunque no haya correo o teléfono externo.','El navegador conserva las consultas de prueba sin transmitirlas a terceros.')
s=s.replace('Crea una copia consistente de la base en el servidor. La restauración se realiza con el servicio detenido.','Descarga un respaldo JSON de esta prueba. Puedes restaurarlo desde Guía y accesos de prueba.')
s=s.replace('Copia de seguridad creada en el servidor.','Respaldo JSON de prueba descargado.')
s=s.replace('Copia de seguridad creada en runtime/backups.','Respaldo JSON de prueba descargado.')
s=s.replace('El servidor bloquea publicación comercial','Esta prueba bloquea publicación comercial')
s=s.replace('Esta prueba bloquea publicación comercial si faltan evidencias, fotos reales, políticas o aprobación del precio.','Esta prueba conserva únicamente datos demo. La publicación comercial se realiza en la base con servidor, con evidencias y aprobaciones.')
s=s.replace('PNG, JPG o WebP · hasta 8 MB','PNG, JPG o WebP · hasta 8 MB · copia local optimizada')
s=s.replace('Información pendiente de configurar.','Información pendiente de configurar en esta prueba.')
p.write_text(s,encoding='utf-8')
p=root/'style.css';s=p.read_text(encoding='utf-8-sig');s='\n'.join(line for line in s.splitlines() if not line.startswith('@import'));p.write_text(s,encoding='utf-8')
print('Interfaz copiada adaptada a datos locales y rutas por hash.')
