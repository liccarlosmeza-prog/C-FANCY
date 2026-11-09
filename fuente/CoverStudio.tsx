import {useState,useSyncExternalStore} from 'react';
import {applyCover,coverDraft,coverFields,coverLimit,coverRequired,coverSections,currentCover,defaultCover,defaultInstinctImage,readCover,setCoverDraft,subscribeCover,validCoverImage} from './cover';
import type {CoverSection} from './cover';
import {optimizeImage} from './browser-image';
import {activePalette,loadThemes} from './theme';
import {getPaletteDraft} from './preview';
import {SitePreview} from './SitePreview';

export function CoverStudio(){
  const draft=useSyncExternalStore(subscribeCover,coverDraft),[section,setSection]=useState<CoverSection>('hero'),[message,setMessage]=useState(''),[error,setError]=useState(''),[loadingImage,setLoadingImage]=useState(false);
  const fields=Object.entries(coverFields[section]),values=draft.text[section] as Record<string,string>,valid=readCover(draft);
  function update(field:string,value:string){setCoverDraft({...draft,text:{...draft.text,[section]:{...draft.text[section],[field]:value}}});setMessage('');setError('')}
  async function replaceImage(file:File){
    setMessage('');setError('');
    if(!['image/png','image/webp'].includes(file.type)||file.size>8*1024*1024){setError('Selecciona un PNG o WebP transparente de hasta 8 MB.');return}
    setLoadingImage(true);
    try{
      const image=await optimizeImage(file,1200,true);
      if(!validCoverImage(image))throw Error('La imagen optimizada sigue siendo demasiado grande. Reduce el tamaño del archivo.');
      const latest=coverDraft();
      setCoverDraft({...latest,instinctImage:image,text:{...latest.text,instinct:{...latest.text.instinct,alt:''}}});
      setMessage('Imagen cargada en el borrador. Revisa su descripción y la vista previa.');
    }catch(e){setError(e instanceof Error?e.message:'No fue posible leer la imagen.')}finally{setLoadingImage(false)}
  }
  function restoreImage(){
    const next=structuredClone(draft);
    delete next.instinctImage;
    next.text.instinct.alt=defaultCover.text.instinct.alt;
    setCoverDraft(next);setMessage('Ónix editorial restaurada en el borrador.');setError('');
  }
  function reorder(index:number,direction:number){const order=[...draft.order],other=index+direction;if(other<0||other>=order.length)return;[order[index],order[other]]=[order[other],order[index]];setCoverDraft({...draft,order});setMessage('')}
  function save(){try{applyCover(draft);setMessage('Portada aplicada en este navegador.');setError('')}catch(e){setError(e instanceof DOMException&&e.name==='QuotaExceededError'?'El navegador se quedó sin espacio. Prueba una imagen más ligera.':e instanceof Error?e.message:'No fue posible guardar la portada.')}}
  function exportCover(){if(!valid)return;const href=URL.createObjectURL(new Blob([JSON.stringify(valid,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=href;a.download='portada-cfancy.json';a.click();setTimeout(()=>URL.revokeObjectURL(href),1000);setMessage('Portada exportada sin aplicar.');setError('')}
  return <section className="cover-studio"><div className="page-title"><div><p className="eyebrow">ESTUDIO EDITORIAL</p><h1>Portada.</h1><p>Reescribe las leyendas y compón el orden de la historia antes de aplicarla.</p></div><span className="status">{JSON.stringify(draft)===JSON.stringify(currentCover())?'Portada en uso':'Borrador sin aplicar'}</span></div>
  <div className="cover-editor-grid"><section className="panel"><h2>Contenido de la página principal</h2><label>Sección a editar<select value={section} onChange={e=>setSection(e.target.value as CoverSection)}>{Object.entries(coverSections).map(([id,label])=><option value={id} key={id}>{label}</option>)}</select></label>
  {section==='instinct'&&<fieldset className="cover-image-field"><legend>Imagen de «Instinto y color»</legend><img src={draft.instinctImage??defaultInstinctImage} alt={draft.text.instinct.alt||'Vista del recorte'}/><label>Reemplazar imagen<input type="file" accept="image/png,image/webp" disabled={loadingImage} aria-describedby="cover-image-help" onChange={e=>{const file=e.currentTarget.files?.[0];e.currentTarget.value='';if(file)void replaceImage(file)}}/></label><small id="cover-image-help">Usa un PNG o WebP con fondo transparente, hasta 8 MB. Deja margen alrededor de la figura y revisa el resultado sobre la paleta en la vista previa.</small>{draft.instinctImage&&<button type="button" className="text-button" disabled={loadingImage} onClick={restoreImage}>Restaurar Ónix editorial</button>}{loadingImage&&<small role="status">Preparando imagen…</small>}</fieldset>}
  {fields.map(([field,label])=><label key={section+field}>{label}{!coverRequired(field)&&<small> Opcional</small>}{coverLimit(field)>115||field==='title'?<textarea rows={field==='title'?2:3} maxLength={coverLimit(field)} value={values[field]} onChange={e=>update(field,e.target.value)}/>:<input maxLength={coverLimit(field)} value={values[field]} onChange={e=>update(field,e.target.value)}/>}</label>)}</section>
  <section className="panel"><h2>Orden y visibilidad</h2><p className="fineprint">La portada principal abre el sitio. Puedes mover u ocultar los capítulos siguientes.</p><ol className="cover-order">{draft.order.map((id,i)=><li key={id}><label><input type="checkbox" checked={!draft.hidden.includes(id)} onChange={e=>setCoverDraft({...draft,hidden:e.target.checked?draft.hidden.filter(k=>k!==id):[...draft.hidden,id]})}/>{coverSections[id]}</label><button className="secondary" disabled={i===0} aria-label={'Subir '+coverSections[id]} onClick={()=>reorder(i,-1)}>↑</button><button className="secondary" disabled={i===draft.order.length-1} aria-label={'Bajar '+coverSections[id]} onClick={()=>reorder(i,1)}>↓</button></li>)}</ol><div className="button-row"><button className="primary" disabled={!valid||loadingImage} onClick={save}>Aplicar portada</button><button className="secondary" disabled={!valid||loadingImage} onClick={exportCover}>Exportar portada JSON</button><button className="secondary" disabled={loadingImage} onClick={()=>{setCoverDraft(structuredClone(currentCover()));setMessage('Borrador descartado.');setError('')}}>Descartar borrador</button><button className="text-button" disabled={loadingImage} onClick={()=>{setCoverDraft(structuredClone(defaultCover));setMessage('Textos iniciales cargados como borrador.');setError('')}}>Cargar textos iniciales</button></div><p className="fineprint">Aplicar guarda en este navegador. El tema activo no cambia desde este panel.</p>{!valid&&<p className="form-error">Completa los títulos, textos de botones y descripción de la foto.</p>}{message&&<p className="form-success" role="status">{message}</p>}{error&&<p className="form-error" role="alert">{error}</p>}</section></div>
  <SitePreview palette={getPaletteDraft()??activePalette(loadThemes())} cover={draft} group={section==='instinct'?'instinct':'campaign'}/>
  </section>;
}
