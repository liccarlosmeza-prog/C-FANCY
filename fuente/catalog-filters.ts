import {toneById} from './chromatic';

const fields=['q','price_min','price_max','category','tono','sort','page_size'] as const;
type FilterField=typeof fields[number];

export function catalogFilterParams(previous:URLSearchParams, fieldsInForm:Pick<FormData,'get'>, override:Partial<Record<FilterField,string>>={}){
  const next=new URLSearchParams(previous);
  for(const field of fields){
    const value=(override[field]??String(fieldsInForm.get(field)??'')).trim();
    if(value&&(field!=='tono'||toneById(value)))next.set(field,value);else next.delete(field);
  }
  next.delete('page');
  return next;
}
