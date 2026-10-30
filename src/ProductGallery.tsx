import {useState} from 'react';
import type {Media} from './client';
export const viewNames=['Frontal','Lateral','Detalle'];
const views=['front','side','detail'];
export function ProductPhoto({slug,name,view=0,hero=false,media}:{slug:string;name:string;view?:number;hero?:boolean;media?:Media[]}){
 const asset=media?.find(m=>m.view===views[view])||media?.[0];
 const panel=asset?asset.panel:view,atlas=panel!==undefined;
 return <span className={'photo-window'+(hero?' photo-hero':'')} role="img" aria-label={asset?.alt||`${name}, vista ${viewNames[view].toLowerCase()}. Imagen fotorrealista generada con IA.`} style={{backgroundImage:`url("${asset?.path||'/assets/products/'+slug+'.png'}")`,backgroundSize:atlas?'300% 100%':'cover',backgroundPosition:atlas?`${(panel||0)*50}% center`:'center'}}/>;
}
export function ProductGallery({slug,name,media}:{slug:string;name:string;media?:Media[]}){const[view,setView]=useState(0),[zoom,setZoom]=useState(false);return <div className="gallery"><button className={'gallery-main'+(zoom?' enlarged':'')} onClick={()=>setZoom(!zoom)} aria-label={`${zoom?'Reducir':'Ampliar'} vista ${viewNames[view].toLowerCase()} de ${name}`} aria-pressed={zoom}><ProductPhoto slug={slug} name={name} view={view} media={media}/><span className="zoom-label">{zoom?'− Reducir':'+ Ampliar'} · {viewNames[view]}</span></button><div className="gallery-thumbs" aria-label="Vistas de la pieza">{viewNames.map((label,i)=><button key={label} className={i===view?'selected':''} aria-pressed={i===view} onClick={()=>{setView(i);setZoom(false)}}><ProductPhoto slug={slug} name={name} view={i} media={media}/><span>{label}</span></button>)}</div><p className="image-disclosure">{!media||media.some(m=>m.source_kind==='ai_generated')?'Vistas generadas con IA para este diseño de demostración. No son fotografías del inventario real.':'Vistas de la pieza proporcionadas por la marca.'}</p></div>}
