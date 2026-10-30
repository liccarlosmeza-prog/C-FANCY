# Product Backlog · C’FANCY

> Actualizacion 29/10/2026: el cuerpo de este documento conserva la propuesta original. El estado vigente por item y evidencia se encuentra en [cierre de implementacion](../../DESPLIEGUE/docs/ESTADO_BACKLOG.md) y en backlog.json; no debe interpretarse todo el cuerpo como aun no iniciado.

Orden de trabajo propuesto sobre la demo existente. **Todos estos ítems están propuestos, no ejecutados.** Los puntos son relativos y provisionales; el equipo los reestima. El Product Owner ordena por valor/riesgo; el Scrum Master facilita, no sustituye la aprobación de negocio.

Fase A: catálogo verificable y asesoría. Fase B: transacciones separadas. `backlog.json` conserva detalles y dependencias. No se copiaron como pendientes todas las tareas históricas de la demo.

| ID | Sprint propuesto | Prioridad | Puntos | Épica | Resultado | Dependencias |
| --- | --- | --- | ---: | --- | --- | --- |
| CF-01 | 1 | Must | 3 | Base | Auditar lo existente sin rehacer la demo | — |
| CF-02 | 1 | Must | 2 | Base | Acordar alcance A y responsables | CF-01 |
| CF-03 | 1 | Must | 5 | Datos | Validar modelo, catalogos y correspondencia de IDs | CF-02 |
| CF-04 | 1 | Must | 5 | Catalogo | Preparar surtido comercial verificable | CF-03 |
| CF-05 | 1 | Must | 3 | Contenido | Definir y reunir medios autorizados | CF-04 |
| CF-06 | 1 | Must | 3 | Operacion | Asignar aprobacion comercial y de privacidad | CF-02 |
| CF-07 | 2 | Must | 5 | Datos | Preparar carga idempotente y excluir demo en produccion | CF-03, CF-04 |
| CF-08 | 2 | Must | 5 | Catalogo | Publicar catalogo verificable en entorno de revision | CF-05, CF-07 |
| CF-09 | 2 | Must | 5 | Atencion | Conectar asesoria de extremo a extremo | CF-06, CF-08 |
| CF-10 | 2 | Should | 3 | Experiencia | Revisar legibilidad, galeria y rendimiento movil | CF-08 |
| CF-11 | 2 | Must | 3 | Operacion | Validar opciones y consulta con usuarias | CF-09, CF-10 |
| CF-12 | 3 | Must | 5 | Cuenta | Completar preparacion de cuenta para lanzamiento | CF-01, CF-06 |
| CF-13 | 3 | Should | 3 | Contenido | Preparar SEO y contenido de descubrimiento | CF-08 |
| CF-14 | 3 | Must | 3 | Marketing | Instrumentar eventos minimos y tablero | CF-09 |
| CF-15 | 3 | Must | 3 | Operacion | Aprobar precio y condiciones visibles | CF-04, CF-06 |
| CF-16 | 3 | Must | 3 | Atencion | Preparar operacion de seguimiento | CF-09, CF-14 |
| CF-17 | 3 | Must | 5 | Calidad | Cerrar QA funcional y control de exposicion | CF-10, CF-12, CF-15 |
| CF-18 | 4 | Must | 5 | Liberacion | Preparar alojamiento, dominio y despliegue revisable | CF-13, CF-17 |
| CF-19 | 4 | Must | 3 | Continuidad | Demostrar backup y restauracion | CF-18 |
| CF-20 | 4 | Must | 3 | Liberacion | Aceptacion de negocio y decision de salida | CF-11, CF-16, CF-19 |
| CF-21 | 4 | Must | 3 | Liberacion | Ejecutar lanzamiento autorizado y smoke test | CF-20 |
| CF-22 | 4 | Must | 3 | Marketing | Observar piloto y ajustar prioridades | CF-14, CF-21 |
| CF-23 | Futuro | Could | 8 | Fase B | Definir pedidos, pago y conciliacion | CF-21, CF-15 |
| CF-24 | Futuro | Could | 8 | Fase B | Definir inventario y reservas por SKU | CF-23 |
| CF-25 | Futuro | Could | 5 | Fase B | Definir devoluciones, reembolsos y posventa | CF-23 |
| CF-26 | Futuro | Could | 5 | Crecimiento | Escalar campañas y CRM con evidencia | CF-22 |

## Criterios de aceptación por ítem

### CF-01 · Auditar lo existente sin rehacer la demo

Responsable propuesto: Equipo implementador. Estado: propuesto.

- Inventario de pantallas, API y pruebas con evidencia y limitaciones.
- Clasificar cada requisito como observado, pendiente o requiere correccion; conservar cambios previos.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-02 · Acordar alcance A y responsables

Responsable propuesto: Product Owner. Estado: propuesto.

- Product Owner identificado y salida catalogo/asesoria aprobada.
- Checkout fuera de A; presupuesto, cobertura y canal registrados como decision.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-03 · Validar modelo, catalogos y correspondencia de IDs

Responsable propuesto: Responsable de datos. Estado: propuesto.

- No se duplican variantes por coleccion; precio en centavos y SKU unico.
- Mapeo de los diez fixtures y estrategia de migracion/rollback documentados, sin tocar datos reales.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-04 · Preparar surtido comercial verificable

Responsable propuesto: Catalogo + Product Owner. Estado: propuesto.

- Cada referencia seleccionada tiene material, medidas, variantes, fuente y aprobador.
- Faltantes permanecen en borrador; no convertir precios demo en aprobados.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-05 · Definir y reunir medios autorizados

Responsable propuesto: Contenido. Estado: propuesto.

- Matriz por SKU con tres vistas, alt, procedencia y permisos.
- La IA se identifica; fotografia comercial real pendiente bloquea ofrecer esa pieza como verificada.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-06 · Asignar aprobacion comercial y de privacidad

Responsable propuesto: Product Owner + revisores. Estado: propuesto.

- Responsables de contacto, politicas, datos y precios identificados.
- Lista de textos/evidencias pendientes y fechas objetivo sin afirmar cumplimiento legal.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-07 · Preparar carga idempotente y excluir demo en produccion

Responsable propuesto: Equipo implementador. Estado: propuesto.

- Importar dos veces no duplica ni sobrescribe contenido aprobado.
- Una consulta de produccion no devuelve demo_only ni is_demo=true; reconciliar SKUs y precios.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-08 · Publicar catalogo verificable en entorno de revision

Responsable propuesto: Equipo implementador. Estado: propuesto.

- Ficha y filtros muestran datos aprobados, variantes y tres vistas; estados vacio/error/agotado cubiertos.
- Precio fijo o Cotizar segun aprobacion, nunca cero por falta de dato; regreso conserva filtros.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-09 · Conectar asesoria de extremo a extremo

Responsable propuesto: Atencion + equipo implementador. Estado: propuesto.

- Una consulta de prueba llega a un responsable con SKU y datos minimos.
- Error/reintento no duplica contactos; marketing es independiente; no simular envio exitoso.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-10 · Revisar legibilidad, galeria y rendimiento movil

Responsable propuesto: QA + UX. Estado: propuesto.

- Verificar 360/768/1280, teclado, foco, etiquetas y contraste con evidencia.
- Impresiones y carga de medios razonables; registrar medicion y equipo usado, sin declarar CWV por intuicion.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-11 · Validar opciones y consulta con usuarias

Responsable propuesto: Investigacion + Product Owner. Estado: propuesto.

- Cinco pruebas cualitativas registran tarea, exito, friccion y ajuste.
- No inventar participantes; si no se reclutan, dejar pendiente y reevaluar alcance con PO.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-12 · Completar preparacion de cuenta para lanzamiento

Responsable propuesto: Equipo implementador. Estado: propuesto.

- Nombre en encabezado, salida y expiracion comprobados; hash, CSRF y revocacion conservados.
- Recuperacion y verificacion de correo funcionan con proveedor aprobado; sin tokens/PII en logs.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-13 · Preparar SEO y contenido de descubrimiento

Responsable propuesto: Contenido + equipo implementador. Estado: propuesto.

- Titulos, descripciones, canonicas y sitemap solo con rutas publicables.
- Datos estructurados de precio/disponibilidad solo si son reales y coinciden con la ficha; no reseñas inventadas.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-14 · Instrumentar eventos minimos y tablero

Responsable propuesto: Marketing + equipo implementador. Estado: propuesto.

- Separar clic de asesoria y consulta recibida; no emitir purchase en demo o seleccion.
- UTM sin PII, finalidad/consentimiento definidos y prueba de evento duplicado.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-15 · Aprobar precio y condiciones visibles

Responsable propuesto: Product Owner + revisores. Estado: propuesto.

- Cada precio comercial tiene costo/fuente, aprobador y vigencia o muestra Cotizar.
- Contacto, privacidad, garantia/envios/cambios aprobados; no publicar borradores como condiciones vigentes.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-16 · Preparar operacion de seguimiento

Responsable propuesto: Atencion. Estado: propuesto.

- Horario, responsable y suplente identificados; una consulta recorre el pipeline.
- Tiempo de primera respuesta medido; retencion y acceso de contactos aprobados.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-17 · Cerrar QA funcional y control de exposicion

Responsable propuesto: QA + equipo implementador. Estado: propuesto.

- Autenticacion, filtros, fichas, permisos y ausencia de stock/costos/secretos publicos comprobados.
- Fallos criticos resueltos; evidencias, defectos residuales y decision documentados.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-18 · Preparar alojamiento, dominio y despliegue revisable

Responsable propuesto: Equipo implementador + Product Owner. Estado: propuesto.

- Configuracion de mismo origen, HTTPS y persistencia probadas en revision.
- Presupuesto y dominio aprobados; procedimiento de version y rollback documentado; publicar solo con autorizacion de lanzamiento.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-19 · Demostrar backup y restauracion

Responsable propuesto: Operacion tecnica. Estado: propuesto.

- Restauracion en entorno separado conserva catalogo y cuentas sinteticas; registrar tiempo y resultado.
- Objetivos iniciales propuestos RPO 24h y RTO 4h aceptados o ajustados; no afirmar logrados sin medir.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-20 · Aceptacion de negocio y decision de salida

Responsable propuesto: Product Owner. Estado: propuesto.

- PO revisa recorrido publico y consulta real de prueba, politicas y costos.
- Decision Go/No-Go registrada con responsable; pendientes bloqueantes impiden venta/publicacion de esa capacidad.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-21 · Ejecutar lanzamiento autorizado y smoke test

Responsable propuesto: Operacion tecnica. Estado: propuesto.

- Version aprobada accesible y comprobada con ficha, cuenta y consulta.
- Plan de reversa disponible; no habilitar pagos por publicar el catalogo.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-22 · Observar piloto y ajustar prioridades

Responsable propuesto: Marketing + Product Owner. Estado: propuesto.

- Primera semana de seguimiento con consultas, tiempos, incidencias y gasto real si hay campaña autorizada.
- Separar datos de prueba; actualizar backlog por hallazgo y no por supuestas ventas.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-23 · Definir pedidos, pago y conciliacion

Responsable propuesto: Product Owner + equipo implementador. Estado: propuesto.

- Flujo, proveedor, idempotencia, conciliacion y casos de pago fallido aprobados.
- No guardar tarjeta; aceptacion de pedidos separada de demo; reestimar antes de implementar.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-24 · Definir inventario y reservas por SKU

Responsable propuesto: Operacion + equipo implementador. Estado: propuesto.

- Movimiento y reserva evitan sobreventa concurrente.
- Agotamiento/cancelacion libera o ajusta stock con trazabilidad.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-25 · Definir devoluciones, reembolsos y posventa

Responsable propuesto: Atencion + finanzas. Estado: propuesto.

- Politica aplicada con caso, estado, autorizacion y conciliacion.
- Precio y condiciones del pedido se conservan historicamente.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

### CF-26 · Escalar campañas y CRM con evidencia

Responsable propuesto: Marketing. Estado: propuesto.

- Costos y calidad permiten aumentar inversion dentro del tope aprobado.
- Consentimiento, exclusiones y medicion de contribucion documentados; sin campañas activadas por defecto.

Evidencia requerida: resultado revisable o prueba registrada, ruta/versión y responsable de revisión.

## Relación con lo ya construido

La demo ya contiene navegación, catálogo, filtros, fichas, galería IA, selección y autenticación local. CF-01 determina qué se conserva; CF-08, CF-10, CF-12 y CF-17 verifican y completan. No marcar estos ítems como terminados por tener una pantalla ni presupuestarlos todos como una nueva aplicación desde cero.

Fuente de responsabilidades y objetivos: [Scrum Guide](https://scrumguides.org/scrum-guide.html). Las historias, prioridades, puntos y sprints son propuesta propia y requieren acuerdo del equipo.
