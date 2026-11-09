import publicConfig from './datos/tema-publico.json';

export const sections = {
  site: 'Base del sitio', header: 'Cabecera y navegación', campaign: 'Portada y filosofía', catalog: 'Catálogo y categorías',
  cards: 'Tarjetas y fichas', buttons: 'Botones', forms: 'Formularios y ventanas', footer: 'Pie de página', admin: 'Área de cuenta y gestión',
} as const;
export const colors = { bg: 'Fondo', text: 'Texto', accent: 'Acento', border: 'Borde' } as const;
export type Group = keyof typeof sections;
export type Color = keyof typeof colors;
export type Texture = 'liso' | 'grano' | 'satinado';
export type Palette = { id: string; name: string; description: string; groups: Record<Group, Record<Color,string>>; hover: string; hoverText: string; texture: Texture; intensity: number };
export const groupKeys = Object.keys(sections) as Group[];
export const colorKeys = Object.keys(colors) as Color[];
export const themeKey = 'cfancy-theme-v1';
export function mix(a:string,b:string,weight:number){const c=(s:string,i:number)=>parseInt(s.slice(i,i+2),16);return '#'+[1,3,5].map(i=>Math.round(c(a,i)*(1-weight)+c(b,i)*weight).toString(16).padStart(2,'0')).join('')}
function preset(id:string,name:string,description:string,bg:string,surface:string,ink:string,accent:string,onAccent:string,texture:Texture,hover:string):Palette{
  const layer=(base:string,text=ink,tone=accent)=>({bg:base,text,accent:tone,border:mix(base,text,.42)});
  return {id,name,description,groups:{site:layer(bg),header:layer(surface),campaign:layer(bg),catalog:layer(bg),cards:layer(surface),buttons:layer(accent,onAccent,onAccent),forms:layer(surface),footer:layer(surface),admin:layer(bg)},hover,hoverText:onAccent,texture,intensity:texture==='liso'?0:22};
}
export const presets: readonly Palette[] = [
  preset('onix','Ónix y oro','Negro, oro cálido y marfil · tema inicial','#11100F','#1C1917','#F5EDE0','#D8B575','#191209','satinado','#EAC98A'),
  preset('ciruela','Marfil y ciruela','La combinación original de marfil y ciruela','#F5F1EA','#FFFAF5','#34202F','#390D2E','#FFF5ED','grano','#552146'),
  preset('selva','Selva esmeralda','Verde profundo, menta y oro pálido','#101C17','#182A21','#EBF3E9','#A8D4BB','#102019','grano','#C0E2CC'),
  preset('indigo','Noche índigo','Azul noche, lavanda y azul cielo','#131629','#20243C','#EEF0FA','#BBC7F5','#171B32','liso','#D0D8FF'),
  preset('rosa','Alba rosa','Rosa empolvado, cobre y blanco cálido','#F6E9EC','#FFF5F5','#422C35','#863B58','#FFF7F4','satinado','#6C2E48'),
];
const hex=(value:unknown):value is string=>typeof value==='string'&&/^#[\da-f]{6}$/i.test(value);
export function readPalette(value:unknown):Palette|null{
  if(!value||typeof value!=='object')return null;
  const p=value as Palette;
  if(typeof p.id!=='string'||!p.id||p.id.length>80||typeof p.name!=='string'||!p.name.trim()||p.name.length>65||typeof p.description!=='string'||p.description.length>250||!['liso','grano','satinado'].includes(p.texture)||!Number.isInteger(p.intensity)||p.intensity<0||p.intensity>60||!hex(p.hover)||!hex(p.hoverText))return null;
  if(!groupKeys.every(group=>colorKeys.every(color=>hex(p.groups?.[group]?.[color]))))return null;
  return {id:p.id,name:p.name.trim(),description:p.description,groups:Object.fromEntries(groupKeys.map(group=>[group,Object.fromEntries(colorKeys.map(color=>[color,p.groups[group][color]]))])) as Palette['groups'],hover:p.hover,hoverText:p.hoverText,texture:p.texture,intensity:p.intensity};
}
export function contrast(a:string,b:string){const luminance=(s:string)=>[.2126,.7152,.0722].reduce((sum,weight,index)=>{const n=parseInt(s.slice(1+index*2,3+index*2),16)/255;return sum+weight*(n<=.04045?n/12.92:((n+.055)/1.055)**2.4)},0);const l=[luminance(a),luminance(b)].sort((x,y)=>y-x);return (l[0]+.05)/(l[1]+.05)}
export function paletteIssues(p:Palette){const issues:string[]=[];for(const group of groupKeys){const row=p.groups[group];const tinted=group==='campaign'&&p.texture!=='liso'?mix(row.bg,row.accent,p.intensity*.0022):row.bg;if(Math.min(contrast(row.text,row.bg),contrast(row.text,tinted))<4.5)issues.push(`${sections[group]}: texto y fondo`);if(Math.min(contrast(row.accent,row.bg),contrast(row.accent,tinted))<4.5)issues.push(`${sections[group]}: acento y fondo`)}if(contrast(p.hoverText,p.hover)<4.5)issues.push('Botones: texto y fondo al pasar el cursor');return issues}
export type ThemeState={active:string;custom:Palette[]};
const configured=publicConfig as null|{format?:string;version?:number;palette?:unknown};
const published=configured?.format==='cfancy-palette'&&configured.version===1?readPalette(configured.palette):null;
export const defaultPalette=published&&!paletteIssues(published).length?{...published,id:'publicado'}:presets[0];
const initialPalettes=defaultPalette.id==='publicado'?[defaultPalette,...presets]:presets;
export function loadThemes(storage?:Pick<Storage,'getItem'>):ThemeState{
  try{const value=JSON.parse((storage??localStorage).getItem(themeKey)||'null');const custom:Palette[]=Array.isArray(value?.custom)?value.custom.slice(0,40).map(readPalette).filter((p:Palette|null):p is Palette=>!!p&&!initialPalettes.some(x=>x.id===p.id)&&!paletteIssues(p).length):[];return {active:[...initialPalettes,...custom].some(p=>p.id===value?.active)?value.active:defaultPalette.id,custom}}catch{return {active:defaultPalette.id,custom:[]}}
}
export function activePalette(state:ThemeState){return [...initialPalettes,...state.custom].find(p=>p.id===state.active)??defaultPalette}
export function duplicatePalette(p:Palette,id:string){return {...structuredClone(p),id,name:(p.name.slice(0,57)+' · copia'),description:'Paleta personalizada'} }
export function cssTheme(p:Palette):Record<string,string>{const vars:Record<string,string>={};for(const group of groupKeys)for(const color of colorKeys)vars[`--cf-${group}-${color}`]=p.groups[group][color];vars['--cf-button-hover']=p.hover;vars['--cf-button-hover-text']=p.hoverText;vars['--cf-texture-strength']=String(p.intensity/100);return vars}
export function applyPalette(p:Palette){const root=document.documentElement;for(const [name,value] of Object.entries(cssTheme(p)))root.style.setProperty(name,value);root.dataset.texture=p.texture;root.style.colorScheme=contrast('#FFFFFF',p.groups.site.bg)>contrast('#000000',p.groups.site.bg)?'dark':'light';document.querySelector('meta[name="theme-color"]')?.setAttribute('content',p.groups.header.bg)}
export function saveThemes(state:ThemeState){localStorage.setItem(themeKey,JSON.stringify(state));applyPalette(activePalette(state))}
