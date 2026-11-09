import type {Palette,Group} from './theme';
import {applyPalette,readPalette} from './theme';
import type {Cover} from './cover';
import {readCover,showPreviewCover} from './cover';

export const channel='cfancy-site-preview-v1';
export const isPreview=typeof window!=='undefined'&&window.parent!==window&&new URLSearchParams(window.location.search).get('vista')==='borrador';
export const previewPages=[['/','Portada'],['/colores','El color'],['/joyas','Catálogo'],['/joya/anillo-aurora','Ficha de joya'],['/materiales','Materiales'],['/colecciones','Colecciones'],['/asesoria','Asesoría'],['/cuenta','Cuenta'],['/admin','Gestión']] as const;
export const previewTargets:Record<Group,{path:string;selector:string}>={site:{path:'/',selector:'.gaze-copy'},header:{path:'/',selector:'header'},campaign:{path:'/',selector:'.gaze-hero'},catalog:{path:'/joyas',selector:'.catalog'},cards:{path:'/joya/anillo-aurora',selector:'.detail'},buttons:{path:'/',selector:'.gaze-actions'},forms:{path:'/asesoria',selector:'.advice-form'},footer:{path:'/',selector:'footer'},admin:{path:'/admin',selector:'.atelier-content'}};
let paletteDraft:Palette|undefined;
export const getPaletteDraft=()=>paletteDraft;
export function rememberPalette(p:Palette){paletteDraft=p}
export const previewAllowsRequest=(path:string,method:string)=>method==='GET'&&!path.startsWith('/account/export')&&!path.startsWith('/admin/export');
export function sendPreviewPath(path:string){if(isPreview)window.parent.postMessage({channel,type:'route',path},window.location.origin)}

export function mountPreview(){if(!isPreview)return;
  document.documentElement.dataset.sitePreview='true';
  let locateVersion=0;
  const send=()=>sendPreviewPath(window.location.hash.slice(1)||'/');
  window.addEventListener('hashchange',send);
  window.addEventListener('message',event=>{
    if(event.source!==window.parent||event.origin!==window.location.origin||event.data?.channel!==channel)return;
    const data=event.data;
    if(data.type==='draft'){const palette=readPalette(data.palette);if(palette)applyPalette(palette);const c=readCover(data.cover);if(c)showPreviewCover(c as Cover);return}
    if(data.type==='navigate'&&previewPages.some(([path])=>path===data.path)){window.location.hash=data.path;window.scrollTo(0,0);send()}
    if(data.type==='locate'&&Object.hasOwn(previewTargets,data.group)){
      const target=previewTargets[data.group as Group];if(window.location.hash.slice(1).split('?')[0]!==target.path)window.location.hash=target.path;
      // Las fichas cargan su contenido después del cambio de ruta.
      const version=++locateVersion;let attempts=0;const locate=()=>{if(version!==locateVersion)return;const node=document.querySelector('main')?.dataset.route===target.path?document.querySelector(target.selector):null;if(node){document.querySelector('[data-preview-target]')?.removeAttribute('data-preview-target');node.setAttribute('data-preview-target','');node.scrollIntoView({block:'center'});return}if(++attempts<30)window.setTimeout(locate,50)};requestAnimationFrame(locate);
    }
  });
  window.parent.postMessage({channel,type:'ready'},window.location.origin);send();
}
