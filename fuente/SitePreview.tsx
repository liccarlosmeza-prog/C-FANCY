import {useEffect,useRef,useState} from 'react';
import type {Cover} from './cover';
import type {Group,Palette} from './theme';
import {channel,previewPages} from './preview';

export function SitePreview({palette,cover,group}:{palette:Palette;cover:Cover;group?:Group}){
  const [device,setDevice]=useState<'desktop'|'mobile'>('desktop'),[route,setRoute]=useState('/'),[expanded,setExpanded]=useState(false),[available,setAvailable]=useState(800),[started,setStarted]=useState(false);
  const frame=useRef<HTMLIFrameElement>(null),stage=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null),openAt=useRef('/');
  const snapshot=useRef({palette,cover});snapshot.current={palette,cover};
  const width=device==='mobile'?390:1280, height=device==='mobile'?780:790, scale=Math.min(1,available/width);
  function send(type:string,value:Record<string,unknown>={}){frame.current?.contentWindow?.postMessage({channel,type,...value},window.location.origin)}
  const update=()=>send('draft',snapshot.current);
  useEffect(update,[palette,cover]);
  useEffect(()=>{if(!stage.current)return;const observer=new ResizeObserver(entries=>setAvailable(entries[0].contentRect.width));observer.observe(stage.current);return()=>observer.disconnect()},[started,expanded]);
  useEffect(()=>{const handler=(event:MessageEvent)=>{if(event.source!==frame.current?.contentWindow||event.origin!==window.location.origin||event.data?.channel!==channel)return;if(event.data.type==='ready')update();if(event.data.type==='route'&&typeof event.data.path==='string')setRoute(event.data.path)};window.addEventListener('message',handler);return()=>window.removeEventListener('message',handler)},[]);
  useEffect(()=>{if(expanded&&!dialog.current?.open)dialog.current?.showModal();if(!expanded&&dialog.current?.open)dialog.current.close()},[expanded]);
  function expand(next:boolean){openAt.current=route;setExpanded(next)}
  const view=<><div className="preview-toolbar"><div className="theme-devices" aria-label="Tamaño de pantalla"><button aria-pressed={device==='desktop'} onClick={()=>setDevice('desktop')}>Escritorio</button><button aria-pressed={device==='mobile'} onClick={()=>setDevice('mobile')}>Móvil</button></div><label>Página de la vista previa<select value={previewPages.some(([path])=>path===route)?route:''} onChange={e=>send('navigate',{path:e.target.value})}>{!previewPages.some(([path])=>path===route)&&<option value="">Página actual: {route}</option>}{previewPages.map(([path,label])=><option key={path} value={path}>{label}</option>)}</select></label>{group&&<button className="secondary" onClick={()=>send('locate',{group})}>Ubicar componente</button>}<button className="secondary" onClick={()=>expand(!expanded)}>{expanded?'Cerrar ampliación':'Ampliar vista previa'}</button></div><div className="preview-stage" ref={stage}><div className="preview-device" style={{width:width*scale,height:height*scale}}><iframe ref={frame} title="Vista previa navegable de C’FANCY" src={'./index.html?vista=borrador#'+openAt.current} onLoad={update} style={{width,height,transform:`scale(${scale})`}}/></div></div></>;
  return <section className="panel live-preview" aria-label="Vista previa del sitio completo"><h2>Vista previa navegable</h2><p className="fineprint">Recorre el sitio con los cambios de paleta y portada. Aquí no se guardan pedidos, consultas ni preferencias.</p>{!started?<button className="primary" onClick={()=>setStarted(true)}>Abrir vista previa del sitio</button>:expanded?null:view}<dialog className="preview-dialog" ref={dialog} onCancel={()=>expand(false)} aria-label="Vista previa ampliada">{started&&expanded&&view}</dialog></section>;
}
