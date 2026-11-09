export const headingFonts={
  cormorant:{name:'Cormorant Garamond',stack:'"CF cormorant", Georgia, serif',note:'Editorial y delicada. Recomendada para C’FANCY.'},
  bodoni:{name:'Bodoni Moda',stack:'"CF bodoni", Georgia, serif',note:'Contraste marcado, con aire de revista de moda.'},
  fraunces:{name:'Fraunces',stack:'"CF fraunces", Georgia, serif',note:'Formas suaves y un carácter más expresivo.'},
} as const;
export const bodyFonts={
  manrope:{name:'Manrope',stack:'"CF manrope", Arial, sans-serif'},
  arial:{name:'Arial',stack:'Arial, Helvetica, sans-serif'},
} as const;
export type Typography={heading:keyof typeof headingFonts;body:keyof typeof bodyFonts};
export const defaultTypography:Typography={heading:'cormorant',body:'manrope'};
export function readTypography(value:unknown):Typography|null{
  if(value===undefined)return {...defaultTypography};
  if(!value||typeof value!=='object')return null;
  const {heading,body}=value as Typography;
  if(typeof heading!=='string'||typeof body!=='string'||!Object.hasOwn(headingFonts,heading)||!Object.hasOwn(bodyFonts,body))return null;
  return {heading,body};
}
