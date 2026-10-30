# Liberación, decisiones y riesgos

## Salidas diferenciadas

**Demo:** conserva precios e imágenes ficticios claramente marcados; no pedidos ni cobros. **Catálogo comercial con asesoría (A):** solo referencias aprobadas y contacto operativo; precio real o Cotizar; sin checkout. **Tienda transaccional (B):** requiere además inventario, pago, conciliación, pedido, condiciones y posventa. Publicar A no autoriza activar B.

## Puerta de salida A

- Product Owner y operador de atención designados; alcance y presupuesto aprobados.
- Fichas con fuente, material, variantes, precio vigente o cotización y medios autorizados. Los productos incompletos permanecen fuera de la oferta comercial.
- Contacto real probado; textos de privacidad y condiciones aprobados por responsables. [Profeco, monitoreo de tiendas virtuales](https://www.gob.mx/profeco/documentos/monitoreo-de-tiendas-virtuales-114564) sirve como referencia de revisión, no como certificación de este sitio.
- HTTPS, cookie/configuración de mismo origen, acceso a datos y recuperación de cuenta comprobados.
- Hosting con persistencia; backup restaurado en entorno separado; versión y rollback disponibles.
- Recorrido y errores revisados, sin problemas críticos; analítica sin datos personales y con finalidades definidas.
- Autorización concreta de salida registrada. Si no existe, entregar paquete revisable sin publicar ni contratar.

## Registro de riesgos inicial

| Riesgo | Probabilidad / impacto estimados | Dueño propuesto | Mitigación y disparador |
| --- | --- | --- | --- |
| Vender una pieza demo o con imagen no representativa | Alta / alto | Catálogo | Exclusión en producción y revisión SKU; cualquier ficha sin evidencia bloquea venta |
| Contacto falla o no hay quién responda | Media / alto | Atención | Prueba extremo a extremo y suplente; pausar anuncios si no llegan consultas |
| Precio o entrega incorrectos | Alta / alto | Comercial | Vigencia y confirmación; detener oferta afectada si cambian costo/stock |
| Pérdida de SQLite en alojamiento efímero | Media / alto | Operación técnica | Persistencia o motor aprobado; restauración probada antes de salida |
| Reimportación sobrescribe datos reales | Media / alto | Datos | Seed demo separado e idempotente, backups y reconciliación |
| Aumento de alcance hacia pagos sin estimar | Alta / alto | Product Owner | Fase B separada y cambio de presupuesto/objetivo explícito |
| Pauta consume presupuesto sin evidencia | Media / medio | Marketing | Topes, consulta recibida y calidad; no escalar solo por clics |
| Retraso de fotos, políticas o entrevistas | Alta / medio | PO | Fecha y dueño de cada dependencia; reducir surtido/ajustar salida |
| Tokens o contactos terminan en logs/analítica | Media / alto | Técnico/privacidad | Minimización, acceso por rol y prueba de exclusión |

Son evaluaciones iniciales cualitativas, no incidentes observados.

## Decisiones a registrar antes de ejecución

D01 alcance A/B; D02 surtido y dueño del dato; D03 precios públicos/fijo/cotizar; D04 cobertura y atención; D05 medios reales vs demo; D06 políticas/privacidad y retención; D07 alojamiento y presupuesto; D08 objetivos de backup; D09 analítica y canales; D10 fecha/autoridad de lanzamiento. Cada decisión conserva opción elegida, razón, aprobador, fecha y documentos afectados.

No interpretar «pendiente» como aprobado. Si un costo no se cotizó, conservarlo como estimación. Si una prueba no se ejecutó, indicar exactamente cuál falta, su impacto y quién la resolverá.
