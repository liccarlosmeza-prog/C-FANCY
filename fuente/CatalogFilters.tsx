import type {ChangeEvent,FormEvent} from 'react';
import {toneById,tones} from './chromatic';
import {catalogFilterParams} from './catalog-filters';

type Category={id:string;name:string};
type Props={params:URLSearchParams;categories:Category[];go:(to:string,scroll?:boolean)=>void};

export function CatalogFilters({params,categories,go}:Props){
  const tone=toneById(params.get('tono'));
  function apply(form:HTMLFormElement,override?:{tono:string}){
    const data=new FormData(form),min=String(data.get('price_min')??''),max=String(data.get('price_max')??'');
    const maxInput=form.elements.namedItem('price_max') as HTMLInputElement;
    maxInput.setCustomValidity(min&&max&&Number(min)>Number(max)?'El precio máximo debe ser igual o mayor al mínimo.':'');
    if(!form.reportValidity())return;
    const next=catalogFilterParams(params,data,override).toString();
    go(next?'/joyas?'+next:'/joyas',false);
  }
  const submit=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();apply(event.currentTarget)};
  const change=(event:ChangeEvent<HTMLSelectElement>)=>{if(event.currentTarget.form)apply(event.currentTarget.form)};
  return <form className="catalog-filters" aria-labelledby="catalog-filters-title" onSubmit={submit} onInput={event=>(event.currentTarget.elements.namedItem('price_max') as HTMLInputElement).setCustomValidity('')}>
    <div className="catalog-filter-heading"><h2 id="catalog-filters-title">Filtros del catálogo</h2><button className="text-button" type="button" onClick={event=>{event.currentTarget.form?.reset();go('/joyas',false)}}>Limpiar filtros</button></div>
    <div className="catalog-filter-fields">
      <label className="filter-search">Buscar una pieza<input id="search" name="q" placeholder="Nombre de la joya…" defaultValue={params.get('q')||''} maxLength={100}/></label>
      <label>Categoría<select name="category" defaultValue={params.get('category')||''} onChange={change}><option value="">Todas las joyas</option>{categories.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label>
      <label>Tono de inspiración<select name="tono" defaultValue={tone?.id||''} onChange={change}><option value="">Todos los tonos</option>{tones.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
      <label>Desde (MXN)<input name="price_min" type="number" min="0" step="any" defaultValue={params.get('price_min')||''} placeholder="Mínimo"/></label>
      <label>Hasta (MXN)<input name="price_max" type="number" min="0" step="any" defaultValue={params.get('price_max')||''} placeholder="Máximo"/></label>
      <label>Ordenar<select name="sort" defaultValue={params.get('sort')||'name_asc'} onChange={change}><option value="name_asc">Nombre: A–Z</option><option value="name_desc">Nombre: Z–A</option><option value="price_asc">Menor precio</option><option value="price_desc">Mayor precio</option></select></label>
      <label>Por página<select name="page_size" defaultValue={params.get('page_size')||'12'} onChange={change}>{[2,4,12].map(n=><option key={n}>{n}</option>)}</select></label>
      <button className="primary filter-submit" type="submit">Buscar joyas ↗</button>
    </div>
    {(tone||params.get('collection'))&&<div className="catalog-filter-context" aria-label="Filtros activos">{tone&&<><span className="filter-tone-label"><span className="tone-dot" style={{background:tone.hex}} aria-hidden="true"/><strong>{tone.name}</strong> · {tone.chakra}</span><button type="button" className="text-button" onClick={()=>go('/colores?tono='+tone.id)}>Ver significado ↗</button><button type="button" className="text-button" onClick={e=>{const form=e.currentTarget.form;if(form)apply(form,{tono:''})}}>Quitar tono ×</button></>}{params.get('collection')&&<small>Colección: {params.get('collection')?.replaceAll('-',' ')}</small>}</div>}
  </form>;
}
