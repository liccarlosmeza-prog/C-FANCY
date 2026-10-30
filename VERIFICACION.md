# Verificación de la prueba estática

30/10/2026. No se reutiliza como evidencia la suite de API de la aplicación original: esta entrega no contiene API ni servidor.

- Sintaxis de `app.js` y `catalogo.js` comprobada con `node --check`.
- Diez productos y diez trípticos locales: 30 vistas. Ningún medio o archivo enlazado desde el HTML falta.
- Ninguna llamada `fetch`, XMLHttpRequest o WebSocket en la aplicación. Sin dependencias de CDN ni importaciones remotas de fuentes.
- En navegador HTTP bajo `/despliegueGithub/`: catálogo de diez artículos, búsqueda de Aurora, cambio de vista lateral, selección y recarga de ficha por hash.
- Acceso visual de cliente y administrador; nombre en cabecera; asesoría con pieza vinculada; respuesta administrativa; propuesta ilustrativa; lectura e interés registrado por cliente. Recarga conserva selección, conversación y propuesta.
- Consola sin errores en el recorrido comprobado.
- Portada sin desbordamiento horizontal: viewport 360/ancho útil 345/documento 345; 768/753/753; 1280/1265/1265. Conversación móvil: 360/345/345, con navegación interior desplazable.
- Apertura `file://` preparada mediante scripts clásicos y datos incorporados, sin carga JSON de red. No comprobada en el navegador integrado porque su política solo permite HTTP/HTTPS. La prueba funcional se ejecutó con un servidor de archivos estáticos, sin API.

La simulación es pública, sin autenticación ni aislamiento entre perfiles. Todo se guarda localmente con prefijo `cfancy-pages-v1:`. No hay envíos, cobros, sesiones de servidor ni edición comercial del catálogo. Los datos de prueba del navegador no se incluyen en Git.

`DESPLIEGUE` se conserva como base original. El repositorio remoto publica esta variante desde `gh-pages`; la rama `main` y su flujo existente de Azure se conservan. La activación de Pages y su estado final se comunican al entregar; preparar una rama no equivale por sí solo a un despliegue exitoso.
