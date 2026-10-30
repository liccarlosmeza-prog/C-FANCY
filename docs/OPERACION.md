# Operación y preparación de alojamiento

## Comandos locales

```powershell
npm.cmd ci
npm.cmd run dev
```

Para revisar compilados: `npm.cmd run build` y después `npm.cmd start`. Tanto desarrollo como compilados necesitan el servidor Node; GitHub Pages por sí solo no ejecuta esta API. Node 24.13 o posterior.

El servidor escucha en loopback salvo `BIND_HOST`. `PORT` y `APP_ORIGIN` deben coincidir con el origen del navegador. `APP_ORIGIN` no lleva barra final ni ruta. En local: `http://localhost:3000`, `COOKIE_SECURE=false`, `DEMO=true`. Nunca desactivar la política de PowerShell para ejecutar npm: utiliza `npm.cmd`.

## Persistencia y migración

La base se conserva en `runtime/cfancy.sqlite` o `DB_PATH`. Al pasar a esquema 3 se crea una copia previa cuando existe una base de versión anterior. Se agregan tablas/columnas, se conservan cuentas y documentos, y se sincronizan relaciones de catálogo. Los fixtures se insertan solo si no existen; no sobrescriben ediciones al reiniciar. Los cambios editoriales actualizan variantes, colecciones, medios, material, gemas y precio actual/histórico en una transacción.

Se mantiene un modelo híbrido: documento editorial para compatibilidad de las fichas y tablas relacionales para integridad/operación. No se anuncia una migración a PostgreSQL. Las dimensiones siguen teniendo resumen textual y las agrupaciones de gema mixtas necesitan desglose documental antes de una oferta verificada.

`runtime/` contiene datos privados, fotografías cargadas, correo y copias; está excluido de Git y Docker build. No lo borres para actualizar el código. El hosting necesita almacenamiento persistente y respaldo fuera del dispositivo/servidor.

## Backup y restauración

```powershell
npm.cmd run backup
npm.cmd run restore:check -- "C:\ruta\a\cfancy-copia.sqlite"
```

El primer comando usa la API de backup consistente de SQLite. El segundo restaura en **otro archivo** bajo `runtime/restore-checks`, verifica integridad y cuenta entidades; no sobrescribe la base activa. Se ejecutaron ambos y se conserva el reporte de esa prueba en `restore-report.json`.

Para una restauración operativa: detener todos los procesos que usan la base, conservar el archivo actual y sus acompañantes WAL/SHM como respaldo, elegir una copia probada y arrancar con `DB_PATH` apuntando al archivo restaurado. Verificar antes de volver a atender. No reemplazar una base abierta con una copia directa de archivos. No se ha automatizado una copia remota ni aceptado un RPO/RTO comercial: 14 ms de restauración local no equivalen a tiempo de recuperación ante desastre.

## Administrador propio fuera de demo

Configura en el entorno privado del proceso `ADMIN_EMAIL`, `ADMIN_NAME` y `ADMIN_PASSWORD` (15–128 caracteres), y ejecuta:

```powershell
npm.cmd run admin:create
```

El script no toma la contraseña como argumento ni la imprime. No modifica una cuenta existente ni eleva una cuenta cliente por coincidencia de correo. No guardes estos valores en Git; retira la variable de contraseña tras el alta. Las cuentas `@cfancy.demo` solo sirven en demo y se bloquean al cambiar `DEMO=false`.

## Correo externo

En demo todo queda en el buzón local, sin envío. En modo operativo las solicitudes de verificación/recuperación se encolan. El adaptador preparado usa Resend y necesita dominio/remitente autorizado, `MAIL_FROM` y `RESEND_API_KEY` como secretos del entorno. Para despachar la cola de forma explícita:

```powershell
npm.cmd run mail:send
```

El comando se niega a enviar si `DEMO` no es exactamente `false`. Procesa hasta 50 mensajes, utiliza clave de idempotencia por correo, conserva fallos para reintento y descarta enlaces caducados. Los cuerpos enviados se limpian de la cola local. Para operar continuamente hay que configurar y supervisar la ejecución del despachador en la infraestructura elegida; no está programada una automatización externa aquí. Las conversaciones se siguen en el portal, sin notificaciones automáticas de WhatsApp.

No se envió correo real ni se comprobó entregabilidad de un dominio. La entrega al proveedor tampoco demuestra lectura o entrega en bandeja. Referencia: [API oficial de Resend](https://resend.com/docs/api-reference/emails/send-email).

## Alojamiento

Se prepararon `Dockerfile`, `compose.yaml` y `.env.production.example`, sin ejecutar una construcción Docker en esta máquina (Docker no está disponible). Conserva Node + API + archivos persistentes como una unidad; el contenedor usa usuario sin privilegios y volumen para runtime.

1. Revisar y copiar `.env.production.example` a `.env.production`; definir dominio/origen real, `DEMO=false`, `COOKIE_SECURE=true` y persistencia.
2. Obtener fotos, catálogo, precios y políticas aprobados; los fixtures no se publicarán en ese modo.
3. Construir y arrancar en la infraestructura elegida con `docker compose up -d --build`, si se elige Docker, o servir Node con supervisor.
4. Configurar un proxy HTTPS al puerto local del servicio. El ejemplo Compose enlaza el puerto del host a loopback; no aporta certificado TLS por sí solo. Si hay proxy, definir `TRUST_PROXY` únicamente para direcciones/CIDR reales y confiables; por defecto no se confían encabezados reenviados.
5. Crear un administrador propio y probar cuenta, asesoría, contenido, correo, backups y rollback. No habilitar pagos por publicar el catálogo.

El servidor rechaza modo no demo sin origen HTTPS y cookies Secure. La prueba automatizada verifica esa configuración de cookies y la exclusión de datos demo; **no es una prueba de TLS de un dominio real**. DNS, contratación, certificado, monitoreo, copias remotas, revisión comercial y aprobación de salida siguen siendo decisiones externas.

## Límites operativos actuales

Sesiones de 30 minutos de inactividad y 12 horas absolutas; límites de intentos en memoria para un solo proceso. Una instalación de múltiples instancias necesita limitador compartido y estrategia de datos/archivos consistente. El portal trae mensajes al abrir/actualizar; no es WebSocket/chat en tiempo real. Las cotizaciones y citas son herramientas de atención, sin cobros, órdenes, conciliación o reservas de inventario.
