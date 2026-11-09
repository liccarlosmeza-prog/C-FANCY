export const tones=[
  {id:'rojo',name:'Rojo',chakra:'Raíz',word:'Arraigo',hex:'#BC5F57',description:'Una pausa para volver a lo esencial.'},
  {id:'ambar',name:'Ámbar',chakra:'Sacro',word:'Creatividad',hex:'#D58953',description:'Una invitación a imaginar otra forma.'},
  {id:'dorado',name:'Dorado',chakra:'Plexo solar',word:'Presencia',hex:'#D8B575',description:'Una luz cálida que atrae la mirada.'},
  {id:'verde',name:'Verde',chakra:'Corazón',word:'Apertura',hex:'#6B9A83',description:'Un encuentro con lo que quieres cuidar.'},
  {id:'azul',name:'Azul',chakra:'Garganta',word:'Expresión',hex:'#72A4CA',description:'Una forma de dar voz a tu intención.'},
  {id:'indigo',name:'Índigo',chakra:'Entrecejo',word:'Intuición',hex:'#898CCB',description:'Una mirada hacia lo que sientes.'},
  {id:'violeta',name:'Violeta',chakra:'Corona',word:'Contemplación',hex:'#BA93CD',description:'Un instante para mirar con calma.'},
] as const;
const originals:Record<string,string[]>={'anillo-aurora':['dorado'],'pulsera-serena':['azul','indigo','dorado'],'anillo-esencia-rosa':['rojo'],'collar-origen-personalizado':['verde','dorado'],'aretes-celeste':['azul','indigo','dorado'],'collar-luz':['dorado']};
export function toneById(id:unknown){return tones.find(t=>t.id===id)}
export function productTones(p:{slug:string;tones?:string[]}|null|undefined){return p?(Array.isArray(p.tones)?p.tones:originals[p.slug]??[]).filter(t=>!!toneById(t)):[]}
