# Precios de joyas, sitio y operación

Consulta 29/10/2026. Se separan **precios observados de terceros**, **datos ficticios internos** y **estimaciones propias**. Ninguna cifra es una cotización aceptada. Importes propios en MXN, antes de impuestos salvo indicación expresa.

## A. Precio de las joyas

Los diez precios actuales son demo, entre $3,900 y $52,900 MXN; no son precios aprobados ni un análisis de disposición a pagar. Ver `matriz_precios_demo.json`, que conserva cada SKU y deja costos/precios comerciales sin completar.

Para cada variante reunir costo documentado de metal y gema, fabricación, merma, transporte de entrada, empaque, inspección, costo de cobro, subsidio logístico, servicio y provisión de devoluciones. Evitar contar dos veces un costo ya incluido en el proveedor. Registrar moneda, fecha de cotización y vigencia; las variaciones de metal/divisa requieren revisión, no ajustes silenciosos al cliente.

Una fórmula de planeación para ingreso **neto de impuestos** es:

`precio neto = costos variables fijos por pieza / (1 − proporción variable sobre ingreso − margen de contribución objetivo)`.

Ejemplo hipotético: costos de $8,000; cargos variables 4%; contribución objetivo 40%; precio neto = $8,000 / 0.56 = **$14,285.71**. No equivale al precio público final: falta el tratamiento fiscal aprobado, y el objetivo de contribución no implica margen neto. Si se desea reservar CAC por pieza, incluirlo como costo o reducir la contribución disponible, pero no ambas cosas.

`contribución antes de adquisición = ingreso neto − mercancía − cobro − logística subsidiada − empaque − demás variables`; `CAC máximo de planeación = contribución antes de adquisición − contribución mínima requerida`. No usar un múltiplo fijo de costo como prueba suficiente de precio de lujo. Validar con propuesta de valor, comparables y decisiones reales.

**Regla de publicación propuesta:** `demo` siempre rotulado; `fixed` necesita precio y vigencia aprobados; `quote` muestra «Cotizar» sin precio inventado. Una pieza personalizada no se representa como precio fijo si depende del diseño. Definir si precio se controla por producto o variante; propuesta: por variante con una vista agregada transparente.

## B. Costo de terminar el sitio

Estimación de esfuerzo incremental sobre la demo existente; no cobrar de nuevo como inexistentes las pantallas ya construidas. La inspección y corrección sí requieren tiempo. Las herramientas de IA pueden reducir esfuerzo, pero no sustituyen revisión, datos ni aceptación.

| Escenario | Alcance | Horas estimadas | Tarifa hipotética | Rango resultante |
| --- | --- | --- | --- | --- |
| A: catálogo con asesoría | Auditar demo, catálogo real, contacto, medición acotada, preparación de despliegue y QA | 40–70 | $450–$700/h | $18,000–$49,000 |
| B: agregar operación transaccional | Pedidos, pagos, conciliación, stock, devoluciones y QA, adicional a A | 70–120 | $450–$700/h | $31,500–$84,000 adicionales |

No son tarifas investigadas de agencias: son **supuestos editables** para convertir esfuerzo en presupuesto. Escenario A con reserva de 15%: **$20,700–$56,350**. A+B antes de reserva: **$49,500–$133,000**; con 15%: **$56,925–$152,950**. No se incluyen fotos reales, asesoría legal/fiscal, inventario, pauta, dominio, suscripciones de agentes ni soporte continuo. El equipo debe reestimar tras revisar cada criterio del backlog. Story points no se convierten automáticamente a horas.

Desglose orientativo de A, sin sumarlo otra vez al total: diagnóstico 4–6 h; contenido/datos 8–14 h; canal y medición 8–14 h; configuración/preparación de alojamiento 8–14 h; QA y ajustes 12–22 h. Total 40–70 h. Alcance contractual, revisiones incluidas, entregables y responsable de aprobaciones deben quedar escritos.

## C. Costos de terceros observados

| Servicio | Observación pública | Precaución para el presupuesto |
| --- | --- | --- |
| Akky `.com.mx` | $249 MXN por un año, página indica IVA incluido | Verificar renovación, disponibilidad y titularidad antes de compra |
| Akky `.mx` | Lista $689 MXN; promoción $344.50 del 1/9 al 31/10/2026, no renovaciones | No presupuestar años siguientes al precio promocional |
| Supabase Pro | Desde US$25/mes; primer proyecto incluido; adicionales desde US$10/mes | Excedentes y cómputo pueden modificar total; es alternativa, no obligación |
| Render | Página pública diferencia planes y servicios; no se recuperó una tabla numérica completa | Solicitar/verificar precio de cómputo, persistencia y backups; no fijar un valor no comprobado |

Fuentes: [Akky](https://www.akky.mx/servicios/dominios?lng=es), [Supabase](https://supabase.com/pricing), [Render](https://render.com/pricing). No se contrató ningún servicio.

Supabase es una alternativa para datos gestionados, no una dependencia del proyecto actual. La demo usa Node y SQLite; un hosting exclusivamente estático no ejecuta su API. Elegir **una arquitectura**, y evitar sumar dos bases de datos como si ambas fueran necesarias. Si se conserva SQLite, exigir disco persistente y prueba de restauración; si se cambia de motor, presupuestar migración aparte.

## D. Reserva operativa editable

Presupuesto mensual interno propuesto: infraestructura/datos/backups $800–$1,800; correo transaccional $0–$500; mantenimiento $1,500–$4,000. Suma **$2,300–$6,300 MXN/mes**, sin marketing ni atención, **estimación sin cotizar**. No sumar nuevamente Supabase u otro servicio si ya está contemplado dentro de infraestructura.

Para servicios en USD conservar precio en USD y calcular `USD × tipo de cambio realmente aplicable + impuestos/cargos`. No se consultó una cotización cambiaria y no se presenta una equivalencia como vigente. Dominio anual y fotografía real van aparte. El piloto de marketing de $12,000/30 días está en el plan de marketing; no debe confundirse con costo del sitio ni renovación mensual perpetua.

## Regla para aprobar inversión

Cotización escrita con alcance y exclusiones → revisión de capacidad operativa → aprobación de propietaria → contratación autorizada → prueba → medición real de gasto. Revisar costos de terceros antes de cada compra y al renovar; las páginas públicas cambian. Ninguna estimación autoriza gasto automáticamente.
