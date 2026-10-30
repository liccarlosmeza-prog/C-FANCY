# Estado del backlog tras la implementacion local

Actualizado el 29/10/2026. No se declara un lanzamiento comercial ni ocho semanas de sprints transcurridas. Se ejecutaron los incrementos P1-P6 del plan por procesos y se conservan los criterios originales.

| ID | Resultado / estado | Evidencia funcional | Pendiente |
| --- | --- | --- | --- |
| CF-01 | Verificado en alcance local | Inventario y replanificacion por P1-P6; version previa conservada en runtime/snapshots. | Sin pendiente para este alcance local. |
| CF-02 | Pendiente externo | Implementacion local autorizada por la propietaria en esta conversacion. | Designar responsables y aprobar salida comercial, presupuesto y cobertura. |
| CF-03 | Verificado en alcance local | Esquema SQLite relacional/editorial, SKUs unicos, centavos, medios, materiales y gemas; migracion conservadora. | Sin pendiente para este alcance local. |
| CF-04 | Implementado; pendientes externos | Editor y validaciones de evidencia implementados. | Recibir y aprobar surtido real y fuentes del proveedor. |
| CF-05 | Implementado; pendientes externos | 30 vistas IA identificadas y cargador de fotografias por vista. | Fotografias comerciales reales autorizadas por la marca. |
| CF-06 | Pendiente externo | Roles admin/cliente, configuracion de contacto y politicas y auditoria disponibles. | Asignar responsables reales y aprobar textos/finalidades/retencion. |
| CF-07 | Verificado en alcance local | Seed no sobrescribe; variantes/precios relacionados; test de modo operativo excluye catalogo y cuentas demo. | Sin pendiente para este alcance local. |
| CF-08 | Implementado; pendientes externos | Catalogo, detalle, filtros, quote/fixed/demo y variantes funcionales con control de publicacion. | Publicar solo referencias comerciales aprobadas; las actuales siguen demo. |
| CF-09 | Verificado en alcance local | Recepcion persistente, folio, propiedad, reintentos idempotentes y respuestas probados por API y navegador. | Sin pendiente para este alcance local. |
| CF-10 | Implementado; pendientes externos | Interfaces responsive; revision de geometria y capturas de escritorio/movil. | Auditoria integral de accesibilidad y rendimiento en dispositivos reales. |
| CF-11 | Pendiente externo | Pruebas tecnicas no se presentan como entrevistas. | Reclutar y ejecutar cinco pruebas cualitativas con personas reales. |
| CF-12 | Implementado; pendientes externos | Roles, nombre, favoritos, CSRF, revocacion, verificacion y reset de uso unico con buzon local; adaptador de correo preparado. | Configurar remitente/proveedor autorizado y verificar entrega externa. |
| CF-13 | Implementado; pendientes externos | Titulos, descripcion, canonica y schema condicionados; robots/sitemap excluyen demo y privado. | Comprobar indexabilidad y datos estructurados con catalogo real y dominio final. |
| CF-14 | Verificado en alcance local | Eventos agregados sin PII, idempotencia y tablero distinguen clic, consulta y propuesta; no compras ficticias. | Sin pendiente para este alcance local. |
| CF-15 | Implementado; pendientes externos | Editor de precios, evidencia, estado y politicas; el servidor bloquea publicacion incompleta. | Aprobar precios/vigencias, contacto y condiciones comerciales reales. |
| CF-16 | Implementado; pendientes externos | Asignacion a administrador, prioridad, etapas, conversacion, notas privadas, citas y propuestas; tiempo transcurrido medido. | Objetivos de horario habil y retencion comercial por aprobar; sin SLA publico garantizado. |
| CF-17 | Verificado en alcance local | Pruebas de permisos, aislamiento, catalogo, tokens, archivos, CSRF e integridad ejecutadas. | No equivale a una auditoria externa de seguridad o cumplimiento. |
| CF-18 | Implementado; pendientes externos | Build de produccion y preparacion Docker/Compose/persistencia/configuracion documentados. | Dominio, alojamiento, proxy/TLS y construccion Docker no ejecutados. |
| CF-19 | Implementado; pendientes externos | Backup consistente y restauracion en archivo separado, integridad y conteos comprobados. | Aprobar y medir RPO/RTO operativos y copias remotas/programacion. |
| CF-20 | Pendiente externo | Recorrido revisable preparado para la propietaria. | Aceptacion humana y decision Go/No-Go de operacion comercial. |
| CF-21 | Implementado; pendientes externos | Smoke test de compilados con servidor local; no publicacion externa. | Autorizacion y ejecucion de salida publica en dominio real. |
| CF-22 | Pendiente externo | Tablero listo para capturar actividad local. | Observar una semana real de operacion; no puede simularse con tests. |
| CF-23 | Fase futura | Propuestas no equivalen a pedidos/pagos. | Fase B: escoger proveedor y aprobar pedidos, pago y conciliacion; no implementados. |
| CF-24 | Fase futura | Disponibilidad por variante editable; no se simula reserva de venta. | Fase B: movimientos/reservas concurrentes y operacion de inventario. |
| CF-25 | Fase futura | Politicas editables y conversaciones de atencion disponibles. | Fase B: flujo de devolucion y reembolso sobre pedidos reales. |
| CF-26 | Fase futura | Metricas locales disponibles; no se activaron campañas. | Datos de negocio, presupuesto y autorizacion para escalar marketing/CRM. |

## Evidencia de ejecucion

Consulta de ejemplo de Valentina recibida, respondida y cotizada en navegador; ficha Aurora guardada; roles y permisos comprobados. Pruebas, compilacion, restauracion y limites en [VERIFICACION_V2.md](VERIFICACION_V2.md). Guia de recorridos en [GUIA_DE_USO.md](GUIA_DE_USO.md).

Los puntos originales se conservan como previsiones. Trabajo verificado local no significa dato comercial aprobado. Las entrevistas, decisiones de negocio, facturacion, pagos, inventario transaccional y la operacion externa no se cierran por generar codigo.
