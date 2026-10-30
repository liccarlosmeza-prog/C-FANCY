# C’FANCY · Atelier digital

Versión 2.0. React/TypeScript, API Express y SQLite persistente, con perfiles de administración y cliente. El alcance es catálogo y asesoría: conversaciones, propuestas y citas se guardan realmente; no se simulan pagos ni pedidos pagados.

## Repositorio · Carga-1

El contenido de `DESPLIEGUE` ocupa la raíz de [liccarlosmeza-prog/C-FANCY](https://github.com/liccarlosmeza-prog/C-FANCY). La documentación adicional está en [DocumentacionBase](DocumentacionBase/README.md), fuera del contenido público y de la imagen Docker. No se incluyen skills, dependencias instaladas, builds, bases de datos ni configuración privada.

Para enlazar un alojamiento al repositorio: rama `main`, directorio raíz `.`, Node 24.13+, instalación `npm ci`, construcción `npm run build` e inicio `npm start`. Configura `BIND_HOST=0.0.0.0` si tu proveedor exige escuchar en todas las interfaces y conecta un volumen persistente para `DB_PATH` y los medios en `runtime/`. Consulta [operación](docs/OPERACION.md) para origen HTTPS y cookies. GitHub Pages no ejecuta esta API ni SQLite: publicar solo `dist/` no habilita cuentas ni atención.

Los datos locales de Valentina no se versionan: una instalación nueva crea las cuentas y el catálogo demo, pero no la conversación de ejemplo guardada en esta computadora.

## Empezar

Requiere Node 24.13+ y npm. Desde esta carpeta, en PowerShell:

```powershell
npm.cmd ci
npm.cmd run dev
```

Abre la URL impresa, normalmente http://localhost:3000. También puedes abrir `INICIAR_CFANCY.cmd`. Detén con Ctrl+C cualquier versión anterior del servidor antes de reiniciar. Utiliza `npm.cmd` para evitar el bloqueo de `npm.ps1`.

| Perfil demo | Correo | Contraseña |
| --- | --- | --- |
| Administración | `admin@cfancy.demo` | `Cfancy.Admin.2026!` |
| Cliente / Valentina | `cliente@cfancy.demo` | `Cfancy.Cliente.2026!` |

Entra por `/acceso` o el icono de cuenta. Administración abre `/admin`; cliente `/cuenta`. Estas cuentas se crean solo en demo y se bloquean con `DEMO=false`. No se restablecen contraseñas existentes.

## Procesos disponibles

- Catálogo público: búsqueda, filtros, colecciones, paginación, variantes, tres vistas y ampliación. Diez piezas ficticias con imágenes IA identificadas.
- Cliente: nombre en encabezado, favoritos por cuenta, consultas propias, conversaciones, respuesta a propuestas y citas, preferencias, verificación y exportación propia.
- Atención: solicitud con o sin cuenta, folio, protección de propiedad, recepción persistente y reintentos sin duplicados. Respuestas públicas y notas privadas.
- Administración: tablero calculado, bandeja, responsable/prioridad/etapas, cotizaciones, citas, clientes, alta/edición/archivo de fichas, carga de fotografías y clasificaciones.
- Gobierno: precios/historial en centavos, reglas de publicación, exclusión de demo, procedencia de medios, políticas editables y auditoría.
- Identidad: Argon2id, sesiones opacas HttpOnly/SameSite, CSRF, revocación, expiración, permisos en servidor y recuperación/verificación con enlaces de uso único.
- Operación: buzón local privado, adaptador explícito de correo, backups y prueba de restauración, preparación de Docker y SEO que excluye demo y espacios privados.

## Recorrido recomendado

Cliente → Iniciar una asesoría → enviar → cerrar sesión → administración → Atención → abrir folio → responder/crear propuesta → volver como cliente a Mis consultas. La consulta de ejemplo de Valentina ya contiene respuesta y propuesta.

Lee [docs/GUIA_DE_USO.md](docs/GUIA_DE_USO.md). Para ver ambos perfiles a la vez usa navegadores/perfiles independientes: las pestañas del mismo navegador comparten la sesión.

## Construir y verificar

```powershell
npm.cmd run build
npm.cmd test
npm.cmd start
npm.cmd run backup
```

`dist/` se sirve junto con la API; un hosting únicamente estático no ejecuta el sistema. `runtime/` conserva base, medios cargados, correo y copias, y está excluido de Git. No lo borres al actualizar código.

Variables: `PORT`, `APP_ORIGIN`, `DEMO`, `COOKIE_SECURE`, `DB_PATH`, `BIND_HOST`, `SEED_DEMO_USERS` y `TRUST_PROXY` solo para un proxy conocido. Correo externo: `RESEND_API_KEY` y `MAIL_FROM`. Alta privada de administrador: `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD`. No se incluyen secretos reales en ejemplos.

Consulta [docs/OPERACION.md](docs/OPERACION.md) para configuración, correo, bootstrap, persistencia y Docker, y [GIT_Y_DESPLIEGUE.md](GIT_Y_DESPLIEGUE.md) para Git. No se ejecutó Docker ni un alojamiento HTTPS real en este entorno.

## Estado de entrega

[Plan por procesos](docs/PLAN_POR_PROCESOS.md), [estado por requisito](docs/ESTADO_BACKLOG.md), [imágenes y prompts](IMAGENES.md). Las aprobaciones, fotos reales, investigación primaria, entregabilidad de correo, dominio, TLS y lanzamiento público conservan sus pendientes; no son hechos técnicos ejecutados.

Los fixtures son ilustrativos. Una imagen IA no acredita materiales o certificados. Aceptar una propuesta expresa interés, no pago. Las políticas requieren aprobación de responsables. Los correos demo quedan locales; no se enviaron mensajes a terceros ni se contrataron servicios.

Fuentes técnicas: [Node SQLite](https://nodejs.org/api/sqlite.html), [Express 5](https://expressjs.com/en/5x/api/router/), [Resend](https://resend.com/docs/api-reference/emails/send-email).
