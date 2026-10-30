# Preparación para Git y alojamiento

Actualización 2.0: el procedimiento vigente es [docs/OPERACION.md](docs/OPERACION.md). Perfiles, atención, medios cargados y correo local usan datos persistentes bajo `runtime/`, que no se sube a Git. Los archivos Docker son preparación revisable; no se ejecutó Docker ni se contrató alojamiento.

## Repositorio preparado: Carga-1

Destino: `https://github.com/liccarlosmeza-prog/C-FANCY`, rama `main`. El sitio está en la raíz y el contexto en `DocumentacionBase/`. No se suben `runtime/`, `.env`, `dist/`, `node_modules/` ni skills. La conversación local de ejemplo no viaja con Git.

Para siguientes cambios, ejecuta dentro de esta carpeta:

```powershell
git status
git add .
git diff --cached --stat
git commit -m "Describe el cambio"
git push origin main
```

## Referencia: crear otro repositorio vacío

Ejecuta dentro de `DESPLIEGUE`. Crea previamente un repositorio vacío en tu proveedor y sustituye la URL de ejemplo:

```powershell
git init
git add .
git status
git commit -m "Implementa sitio de demostración C’FANCY"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

Revisa `git status` antes del commit: no deben aparecer `.env`, `runtime/`, `node_modules/` ni datos privados. No ejecutes `git init` sobre un repositorio existente sin revisar su estado.

## Alojamiento con Node

1. Clona el repositorio en un entorno con Node 24.13+.
2. Ejecuta `npm ci` y `npm run build`.
3. Configura `APP_ORIGIN` con tu dominio exacto y `COOKIE_SECURE=true` detrás de HTTPS. Configura almacenamiento persistente para `DB_PATH`.
4. Inicia con `npm start` y conecta un proxy inverso al puerto 3000 de loopback. Usa un supervisor de procesos según tu proveedor.
5. Mantén `DEMO=true` para esta presentación. La venta real requiere sustituir y verificar el catálogo, además de completar los pendientes del README. `DEMO=false` produce un catálogo vacío con estos fixtures.

No se ha configurado ni contratado hosting. No hay credenciales incluidas. Para compartir solo una demostración visual estática hace falta adaptar la lectura del catálogo a archivos públicos; la versión entregada usa la API del servidor.
