import {useEffect,useState} from 'react';
import type {CSSProperties} from 'react';
import {request} from './client';
import {toneById,tones} from './chromatic';
import type {Cover} from './cover';
import {defaultInstinctImage} from './cover';

export function BrandHero({go,advice,text}:{go:(s:string)=>void;advice:()=>void;text:Cover['text']['hero']}){
  return <section className="gaze-hero campaign-tone textured" aria-labelledby="gaze-title"><div className="gaze-copy"><p className="eyebrow">C’FANCY <span aria-hidden="true">/</span> {text.eyebrow}</p><h1 className="cover-lines" id="gaze-title">{text.title}</h1><p className="gaze-subtitle">{text.subtitle}</p><p className="gaze-intro cover-lines">{text.body}</p><div className="gaze-actions"><button className="primary" onClick={()=>go('/colores')}>{text.primary} <span>↗</span></button><button className="text-button" onClick={advice}>{text.secondary} →</button></div>{text.chapter&&<p className="gaze-edition"><span aria-hidden="true">✧</span>{text.chapter}</p>}</div><figure className="gaze-portrait"><img src="./assets/campana/mirada-editorial.jpg" alt={text.alt} fetchPriority="high"/>{text.caption&&<figcaption>{text.caption}</figcaption>}</figure></section>;
}

export function InstinctStory({text,image=defaultInstinctImage,go}:{text:Cover['text']['instinct'];image?:string;go:(s:string)=>void}){
  return <section className="instinct-story campaign-tone textured" aria-labelledby="instinto-title">
    <figure><img src={image} alt={text.alt} loading="lazy"/>{text.caption&&<figcaption>{text.caption}</figcaption>}</figure>
    <div><p className="eyebrow">{text.eyebrow}</p><h2 id="instinto-title" className="cover-lines">{text.title}</h2><p className="cover-lines">{text.body}</p><p className="cover-lines">{text.detail}</p><a href="#/colores" className="text-button instinct-action" onClick={e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();go('/colores')}}>{text.action} <span aria-hidden="true">→</span></a></div>
  </section>;
}

function ChakraMotif({petals}:{petals:number}){return <svg className="chakra-motif" viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="73"/><circle cx="80" cy="80" r="54" strokeDasharray="2 6"/>{Array.from({length:petals},(_,i)=><ellipse key={i} cx="80" cy="53" rx="15" ry="25" transform={`rotate(${i*360/petals} 80 80)`}/>)}<path d="M80 58 102 80 80 102 58 80Z"/><circle cx="80" cy="80" r="7" fill="currentColor"/></svg>}

export function ColorJourney({go,standalone=false,selectedId,text}:{go:(s:string,scroll?:boolean)=>void;standalone?:boolean;selectedId?:string;text:Cover['text']['journey']}){
  const Title=standalone?'h1':'h2';const [local,setLocal]=useState('dorado');const t=toneById(standalone?selectedId||'dorado':local)??tones[2];const [matches,setMatches]=useState<{id:string;count:number}|null>(null);const count=matches?.id===t.id?matches.count:null;
  useEffect(()=>{const controller=new AbortController();request('/products?tono='+t.id+'&page_size=1',{signal:controller.signal}).then(result=>{if(!controller.signal.aborted)setMatches({id:t.id,count:result.total})}).catch(()=>{});return()=>controller.abort()},[t.id]);
  function select(id:string){if(standalone)go('/colores?tono='+id,false);else setLocal(id);requestAnimationFrame(()=>{const detail=document.getElementById('tono-seleccionado');if(detail&&detail.getBoundingClientRect().top>window.innerHeight-140)detail.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})})}
  return <section className="color-journey campaign-tone" aria-labelledby="color-title"><p className="eyebrow">{text.eyebrow}</p><Title id="color-title" className="cover-lines">{text.title}</Title><p className="journey-intro cover-lines">{text.body}</p><div className="tone-grid" aria-label="Explorar un color">{tones.map(item=><button key={item.id} className="tone-card" aria-pressed={item.id===t.id} aria-controls="tono-seleccionado" onClick={()=>select(item.id)} style={{'--gem':item.hex} as CSSProperties}><span className="tone-gem" aria-hidden="true"/><strong>{item.name}</strong><span className="tone-chakra">{item.chakra}</span><span className="tone-intention">{item.id===t.id?'✓ Seleccionado':item.word}</span></button>)}</div>
  <article id="tono-seleccionado" className="tone-detail" style={{'--gem':t.hex} as CSSProperties} aria-labelledby="tone-detail-title"><div className="tone-symbol"><ChakraMotif petals={t.petals}/><small>SÍMBOLO EDITORIAL · {t.symbol.toUpperCase()}</small></div><div className="tone-detail-copy" key={t.id}><p className="eyebrow"><span className="tone-dot"/> TONO SELECCIONADO · {t.name.toUpperCase()}</p><h3 id="tone-detail-title">{t.chakra} <span>· {t.sanskrit}</span></h3><p>{t.description}</p><p className="tone-question">{t.reflection}</p><div className="button-row">{count!==0&&<button className="primary" onClick={()=>go('/joyas?tono='+t.id)}>{count===null?'Buscar joyas':`Ver ${count} ${count===1?'joya':'joyas'}`} · {t.name} ↗</button>}<button className="text-button" onClick={()=>go('/asesoria?tono='+t.id)}>Consultar por {t.name.toLowerCase()} →</button></div>{count===0&&<p className="fineprint">Aún no hay piezas etiquetadas con este color. Puedes pedir asesoría o explorar otro tono.</p>}</div></article>
  <p className="journey-note cover-lines">{text.note} <a href="https://collections.lacma.org/object/53190" target="_blank" rel="noreferrer">Contexto cultural ↗</a></p></section>;
}
