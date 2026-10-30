# Verificación de implementación 2.0

Fecha: 29/10/2026. Alcance: plataforma local de catálogo y atención personalizada. Estado comercial por ítem: [ESTADO_BACKLOG.md](ESTADO_BACKLOG.md).

## Comprobaciones ejecutadas

| Comprobación | Resultado |
| --- | --- |
| `npm.cmd test` | 18 pruebas aprobadas, 0 fallos |
| `npm.cmd run build` | TypeScript y Vite correctos; 34 módulos |
| Roles y aislamiento | API administrativa y consultas ajenas denegadas al cliente; notas internas excluidas de su respuesta |
| Identidad | Registro sin escalamiento de rol, CSRF, recuperación/verificación de un uso, revocación de sesiones y cuentas demo excluidas del modo operativo |
| Atención | Recepción persistente, reintentos idempotentes, mensajes, asignación, propuestas y citas; propiedad comprobada |
| Catálogo | Edición persistente, seed idempotente, historial de precios, filtros, archivo, validación de publicación y carga de imágenes |
| Respaldo | Copia consistente y restauración a archivo nuevo; integridad SQLite `ok` |
| Navegador | Ingreso con ambos perfiles; consulta de Valentina, respuesta administrativa, propuesta y lectura posterior por cliente |
| Consola navegador | Sin errores registrados al revisar el recorrido final |

La restauración conservó 10 productos, 4 usuarios y 1 consulta sin modificar el archivo activo. Los 14 ms de esta operación local no constituyen un objetivo de recuperación en alojamiento. Evidencia: [restore-report.json](restore-report.json).

## Revisión visual

Panel administrativo comprobado mediante emulación de viewport en navegador, después de corregir la cabecera móvil:

| Viewport | Ancho útil | Ancho del documento |
| --- | --- | --- |
| 360 px | 345 px | 345 px |
| 768 px | 753 px | 753 px |
| 1280 px | 1265 px | 1265 px |

Sin desbordamiento horizontal del documento en esos tamaños. La navegación móvil del atelier permite desplazamiento dentro de su propio contenedor. No sustituye pruebas en dispositivos físicos ni una auditoría integral de accesibilidad.

Capturas: [Administración](capturas/administracion.jpg), [Mi espacio de Valentina](capturas/cliente.jpg), [Conversación y propuesta](capturas/asesoria-cliente.jpg).

La consulta «Una pieza para celebrar mi aniversario · prueba» queda disponible como ejemplo. La propuesta permanece pendiente para explorarla; no se generó compra ni pago. Los datos sobrevivieron al reinicio del servidor.

## Pendientes

Vista probada en `http://localhost:3001`; el servicio previo del puerto 3000 no fue detenido. No se publicó el sitio ni se modificó infraestructura externa.

Docker/Compose preparados pero no ejecutados: Docker no está instalado. Pendientes de comprobar en alojamiento: TLS/DNS, entrega de correo externo, carga concurrente y recuperación remota. No hay integración automática de WhatsApp. El correo demo queda en el buzón local privado.

Las fotografías actuales son imágenes IA declaradas; productos y precios ilustrativos. Faltan datos comerciales acreditados y aprobación de políticas. Pagos, pedidos, conciliación, reembolsos y reservas de inventario corresponden a fase B pendiente; aceptar una cotización registra interés. El backlog completo no está cerrado.
