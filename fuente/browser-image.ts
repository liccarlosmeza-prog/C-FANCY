export async function optimizeImage(blob:Blob, maxEdge=1600, transparentOnly=false){
  const bitmap=await createImageBitmap(blob);
  try{
    const scale=Math.min(1,maxEdge/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(bitmap.width*scale));
    canvas.height=Math.max(1,Math.round(bitmap.height*scale));
    const context=canvas.getContext('2d')!;
    context.drawImage(bitmap,0,0,canvas.width,canvas.height);
    if(transparentOnly){
      const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
      let transparent=0,visible=0;
      for(let i=3;i<pixels.length;i+=4){
        if(pixels[i]===0)transparent++;
        if(pixels[i]>=128)visible++;
      }
      if(transparent<pixels.length/400||visible<pixels.length/400)throw Error('El archivo debe tener una figura visible sobre un fondo transparente real.');
    }
    return canvas.toDataURL('image/webp',0.85);
  }finally{bitmap.close()}
}
