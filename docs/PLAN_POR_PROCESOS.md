# Replanificación de implementación · 29/10/2026

## Diagnóstico

La demo contiene catálogo, filtros, galerías y autenticación local. Faltan roles, vistas de administración/cliente, atención persistente, seguimiento, cotizaciones, edición de catálogo, auditoría y operación de correo/backup. El seed de productos sobrescribe datos: corregir antes de habilitar edición.

## Procesos e incrementos de esta ejecución

| Proceso | Trabajo | Referencias del backlog |
| --- | --- | --- |
| P1 Datos y gobierno | Migración conservadora, seed idempotente, variantes/precios/colecciones relacionados, estados de publicación y auditoría | CF-01,03,07 |
| P2 Identidad | Roles admin/cliente, accesos demo, cuenta, preferencias, verificación y recuperación con correo local verificable | CF-12,17 |
| P3 Atención | Solicitud con/sin cuenta, recepción real en SQLite, folio, conversación, notas privadas, estados, citas y cotización | CF-09,16 |
| P4 Gestión | Tablero calculado, catálogo editable, precios/disponibilidad, clientes, seguimiento y configuración | CF-04,08,14,15 |
| P5 Experiencia | Tienda editorial refinada, navegación por perfil, espacios de cliente y administración responsive | CF-05,10,13 |
| P6 Operación | Pruebas de permisos y recorrido, exportación, backups/restauración, documentación y entrega local | CF-17,18,19 |

Orden: P1 → P2 → P3/P4 → P5 → P6. Son incrementos de trabajo de esta ejecución, no ocho semanas transcurridas ni sprints ceremoniales completados. La evidencia final y estado por ítem se registran por separado.

## Alcance comercial

Se completa una plataforma local de catálogo y asesoría. Las consultas, respuestas, citas propuestas y cotizaciones se guardan realmente. La aceptación de una propuesta no equivale a cobro ni pedido pagado. No inventar transacciones, comprobantes o certificados. Mantener fotos IA, precios y condiciones demo identificados.

La recepción de correo se podrá comprobar en un buzón local privado de administración; envío externo requiere configurar un proveedor y su dominio. Sin proveedor real no se afirmará entrega de email. No se realizan envíos a terceros en esta ejecución.

El software permitirá documentar y validar datos comerciales; no sustituye fotografías reales, aprobaciones, entrevistas, contratación de dominio/hosting ni una decisión humana de salida. CF-11,20–22 y las aprobaciones de CF-02,04–06,15 conservarán sus pendientes externos cuando corresponda. Fase B no se convertirá en pagos ficticios.

## Aceptación técnica

Cliente no ve consultas ajenas, notas internas ni API administrativa. Administrador recibe consultas y puede responder; cliente ve respuesta y propuesta. Reintentar no duplica la solicitud. El seed no deshace ediciones al reiniciar. Mutaciones exigen sesión/propiedad y CSRF. Las cuentas demo solo existen y operan en modo demo. Construcción, pruebas de integración y restauración se ejecutan con evidencia. La guía final explica cada pantalla y acceso.
