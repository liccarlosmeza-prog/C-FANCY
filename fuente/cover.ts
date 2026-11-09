import publishedCover from './datos/portada-publica.json';

export const coverSections = {hero:'Portada principal',instinct:'Instinto y color',journey:'Explorador de tonos',collection:'Joyas destacadas',materials:'Materiales',advice:'Invitación a asesoría'} as const;
export const coverFields = {
  hero:{eyebrow:'Leyenda superior',title:'Título',subtitle:'Subtítulo',body:'Introducción',primary:'Botón de color',secondary:'Botón de asesoría',chapter:'Leyenda de portada',caption:'Pie de la imagen',alt:'Descripción accesible de la foto'},
  instinct:{eyebrow:'Leyenda superior',title:'Título',body:'Primer párrafo',detail:'Segundo párrafo',caption:'Pie de la imagen'},
  journey:{eyebrow:'Leyenda superior',title:'Título',body:'Introducción',note:'Nota cultural'},
  collection:{eyebrow:'Leyenda superior',title:'Título',action:'Enlace al catálogo'},
  materials:{eyebrow:'Leyenda superior',title:'Título',body:'Descripción',action:'Botón'},
  advice:{eyebrow:'Leyenda superior',title:'Título',body:'Descripción',action:'Botón'},
} as const;
export type CoverSection=keyof typeof coverSections;
export type Cover={version:1;order:Exclude<CoverSection,'hero'>[];hidden:Exclude<CoverSection,'hero'>[];text:{[K in CoverSection]:{[F in keyof typeof coverFields[K]]:string}}};
export const coverKey='cfancy-cover-v1';
export const defaultCover:Cover={version:1,order:['instinct','journey','collection','materials','advice'],hidden:[],text:{
  hero:{eyebrow:'EL MISTICISMO DEL COLOR',title:'Las joyas\nte eligen a ti.',subtitle:'A través del color.',body:'Un tono te llama. Una joya te encuentra.',primary:'Deja que una joya te encuentre',secondary:'Recibir asesoría',chapter:'LA MIRADA',caption:'La mirada del color',alt:'Retrato con ojos verdes, velo negro y anillos de tonos rosa y dorado'},
  instinct:{eyebrow:'LA MIRADA, HACIA DENTRO',title:'Instinto y color.',body:'La pantera sostiene la mirada. El retrato la devuelve. Entre ambas hay un instante de reconocimiento: algo te atrae antes de que sepas nombrarlo.',detail:'En C’FANCY, ese instante inspira joyas para acompañar tus rituales personales de introspección. El color da forma a esa intención.',caption:'EL INSTINTO'},
  journey:{eyebrow:'SIETE TONOS / SIETE INTENCIONES',title:'El color te encuentra.',body:'Detente en el tono que te llama hoy. Descubre su significado y, si resuena contigo, explora las piezas afines.',note:'Los colores reflejan una lectura contemporánea de los chakras. Sus representaciones varían entre tradiciones.'},
  collection:{eyebrow:'EL INICIO DE UNA HISTORIA',title:'Piezas que te encuentran.',action:'Explorar todas las joyas'},
  materials:{eyebrow:'BELLEZA QUE SE SIENTE',title:'La luz de los materiales.',body:'Oro, plata y gemas. Descubre el carácter de cada material y lo que aporta al diseño.',action:'Conocer los materiales'},
  advice:{eyebrow:'ATENCIÓN PERSONALIZADA',title:'De la mirada a una pieza tuya.',body:'Cuéntanos qué color te llamó. Exploremos diseños que acompañen tu intención.',action:'Conversemos'},
}};
export const coverLimit=(field:string)=>['body','detail','note','alt'].includes(field)?520:115;
export const coverRequired=(field:string)=>['title','primary','secondary','action','alt'].includes(field);
export function readCover(value:unknown):Cover|null{
  if(!value||typeof value!=='object')return null;
  const c=value as Cover, keys=defaultCover.order;
  if(c.version!==1||!Array.isArray(c.order)||c.order.length!==keys.length||new Set(c.order).size!==keys.length||!c.order.every(k=>keys.includes(k))||!Array.isArray(c.hidden)||!c.hidden.every(k=>keys.includes(k)))return null;
  const copy=structuredClone(defaultCover);copy.order=[...c.order];copy.hidden=[...new Set(c.hidden)];
  for(const section of Object.keys(coverFields) as CoverSection[]){const text=c.text?.[section] as Record<string,string>|undefined, out=copy.text[section] as Record<string,string>;for(const field of Object.keys(coverFields[section])){const v=text?.[field];if(typeof v!=='string'||(coverRequired(field)&&!v.trim())||v.length>coverLimit(field))return null;out[field]=v.trim()}}
  if(copy.text.hero.body==='Todo empieza con una mirada. Un tono te detiene y te acerca a una pieza que se siente tuya.')copy.text.hero.body=defaultCover.text.hero.body;
  copy.text.hero.chapter=copy.text.hero.chapter.replace(/^CAP[ÍI]TULO\s+\d{1,2}\s*[/·—-]\s*/i,'');
  copy.text.instinct.caption=copy.text.instinct.caption.replace(/^\d{1,2}\s*[/·—-]\s*/,'');
  return copy;
}
const initialCover=readCover(publishedCover)??defaultCover;
export function loadCover(storage?:Pick<Storage,'getItem'>){try{return readCover(JSON.parse((storage??localStorage).getItem(coverKey)||'null'))??initialCover}catch{return initialCover}}
let active=loadCover(),draft=structuredClone(active);
const listeners=new Set<()=>void>();
export function subscribeCover(fn:()=>void){listeners.add(fn);return()=>{listeners.delete(fn)}}
export const currentCover=()=>active;
export const coverDraft=()=>draft;
export function setCoverDraft(value:Cover){draft=value;listeners.forEach(fn=>fn())}
export function applyCover(value:Cover){const valid=readCover(value);if(!valid)throw Error('Completa los textos de portada antes de aplicar.');localStorage.setItem(coverKey,JSON.stringify(valid));active=valid;setCoverDraft(structuredClone(valid))}
export function showPreviewCover(value:Cover){active=value;listeners.forEach(fn=>fn())}
