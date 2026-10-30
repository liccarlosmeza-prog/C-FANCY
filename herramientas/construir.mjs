import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
// Solo lee el compilador instalado; no ejecuta npm ni escribe en la base original.
const dependencyRoot=path.resolve(root,'../DESPLIEGUE/node_modules');
const require=createRequire(path.join(dependencyRoot,'esbuild/package.json'));
const {build}=require('esbuild');
await build({absWorkingDir:root,entryPoints:['fuente/main.tsx'],bundle:true,format:'iife',platform:'browser',target:['es2022'],jsx:'automatic',nodePaths:[dependencyRoot],outfile:'app.js',minify:true,define:{'process.env.NODE_ENV':'"production"'},legalComments:'eof',logLevel:'info'});
const js=readFileSync(path.join(root,'app.js'),'utf8');
if(/\bfetch\s*\(|XMLHttpRequest|new WebSocket/.test(js))throw Error('Se encontró una petición de red no permitida.');
const stamp=name=>createHash('sha256').update(readFileSync(path.join(root,name))).digest('hex').slice(0,12);
const jsHash=stamp('app.js'),cssHash=stamp('app.css');
writeFileSync(path.join(root,'index.html'),`<!doctype html><html lang="es-MX"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#390d2e"><meta name="robots" content="noindex,nofollow"><meta name="cfancy-version" content="Carga-3-paridad"><meta name="description" content="C’FANCY · Prueba estática completa de interfaces. Datos ficticios, guardados únicamente en tu navegador."><title>C’FANCY · Elegancia que permanece</title><link rel="icon" href="./assets/logo.png"><link rel="stylesheet" href="./app.css?v=${cssHash}"></head><body><div id="root"></div><noscript>Activa JavaScript para probar las pantallas de C’FANCY.</noscript><script defer src="./app.js?v=${jsHash}"></script></body></html>\n`);
writeFileSync(path.join(root,'version.json'),JSON.stringify({edition:'Carga-3-paridad',javascript:jsHash,css:cssHash},null,2)+'\n');
console.log('HTML/CSS/JS estáticos generados sin API ni módulos de red.');
