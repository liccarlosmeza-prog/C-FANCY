import {useState} from 'react';
import type {Media} from './client';
export const viewNames=['Frontal','Lateral','Detalle'];
const views=['front','side','detail'];
export function ProductPhoto({slug,name,view=0,hero=false,media}:{slug:string;name:string;view?:number;hero?:boolean;media?:Media[]}){
 const asset=media?.find(m=>m.view===views[view])||media?.[0];
 const panel=asset?asset.panel:view,atlas=typeof panel==='number';
 // Un pequeño sangrado evita que aparezcan costuras del tríptico al redondear píxeles.
 const position=atlas?[.5,50,99.5][Math.min(2,Math.max(0,Math.trunc(panel)))]:50;
 return <span className={'photo-window'+(hero?' photo-hero':'')} role="img" aria-label={asset?.alt||`${name}, vista ${viewNames[view].toLowerCase()}. Imagen fotorrealista generada con IA.`} style={{backgroundImage:`url("${asset?.path||'./assets/products/'+slug+'.png'}")`,backgroundSize:atlas?'306% 102%':'cover',backgroundPosition:`${position}% center`}}/>;
}
export function ProductGallery({slug,name,media}:{slug:string;name:string;media?:Media[]}){const[view,setView]=useState(0),[zoom,setZoom]=useState(false);return <div className="gallery"><button className={'gallery-main'+(zoom?' enlarged':'')} onClick={()=>setZoom(!zoom)} aria-label={`${zoom?'Reducir':'Ampliar'} vista ${viewNames[view].toLowerCase()} de ${name}`} aria-pressed={zoom}><ProductPhoto slug={slug} name={name} view={view} media={media}/></button><div className="gallery-caption"><span>Vista {viewNames[view].toLowerCase()}</span><button className="text-button" onClick={()=>setZoom(!zoom)} aria-pressed={zoom}>{zoom?'− Reducir':'+ Ampliar'}</button></div><div className="gallery-thumbs" aria-label="Vistas de la pieza">{viewNames.map((label,i)=><button key={label} className={i===view?'selected':''} aria-pressed={i===view} onClick={()=>{setView(i);setZoom(false)}}><ProductPhoto slug={slug} name={name} view={i} media={media}/><span>{label}</span></button>)}</div><p className="image-disclosure">{!media||media.some(m=>m.source_kind==='ai_generated')?'Vistas generadas con IA para este diseño de demostración. No son fotografías del inventario real.':'Vistas de la pieza proporcionadas por la marca.'}</p></div>}
