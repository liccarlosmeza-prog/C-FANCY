# Archivos base · C’FANCY

Preparado el **29 de octubre de 2026**, México. Paquete de planeación comercial y de producto para entregar a la propietaria y a un agente de implementación. No modifica ni despliega el sitio existente.

## Orden de trabajo

1. [Plan de marca y negocio](01_Plan/01_PLAN.md): posicionamiento, cliente, oferta y objetivos.
2. [Investigación de mercado](01_Plan/02_INVESTIGACION_DE_MERCADO.md): hallazgos, competencia, límites y validación primaria pendiente.
3. [Marketing de 90 días](01_Plan/03_MARKETING_90_DIAS.md), [precios y presupuesto](01_Plan/04_PRECIOS_Y_PRESUPUESTO.md) y [fuentes](01_Plan/05_FUENTES.md).
4. [Estructura de datos](02_Datos/01_MODELO_DE_DATOS.md), [diccionario](02_Datos/02_DICCIONARIO.md), [catálogos](02_Datos/catalogos_base.json) y [plantilla de producto](02_Datos/producto_plantilla.json).
5. [Backlog](03_Scrum/01_BACKLOG.md), [sprints](03_Scrum/02_SPRINTS.md), [liberación](03_Scrum/03_LIBERACION_Y_RIESGOS.md) y [traspaso al agente](03_Scrum/04_ENCARGO_AL_AGENTE.md). `backlog.json` conserva los mismos ítems para importar o transformar.

## Cómo interpretar el paquete

- **Confirmado interno:** aparece en la documentación de la propietaria o en los archivos del proyecto. No implica que se haya validado con clientes.
- **Observado externo:** fuente pública enlazada y consultada el 29/10/2026; se conserva el período real del dato.
- **Propuesta / hipótesis:** decisión sugerida que todavía requiere validación.
- **Estimación:** cifra para planear; no es una cotización ni una promesa de resultado.
- **Pendiente:** falta un dato, responsable o aprobación. No equivale a cero ni a un trabajo terminado.

El mercado inicial se interpreta como México. Se interpreta la petición de precios en dos sentidos: precios de las joyas y costo del sitio. Ambos se presentan separados. El desarrollo queda expresado como resultados, reglas y criterios de aceptación; no se crean migraciones ni código de aplicación en este paquete.

`brief_cfancy.json` conserva el contexto inicial y `decisiones_pendientes.json` las diez decisiones por resolver. Los nulos son deliberados: no hay presupuesto, aprobador ni fecha de salida ficticiamente autorizados. El resultado de los controles del paquete está en [VERIFICACION.md](VERIFICACION.md).

## Fuentes internas utilizadas

`01_Marca/Identidad_de_marca.md`, los JSON de `02_Catalogo/`, `03_UX/Pantallas_y_flujos.md`, la guía y backlog de `04_Desarrollo/`, los controles de `05_Validacion/`, y `DESPLIEGUE/README.md`, `VERIFICACION.md`, `src/`, `server/index.mjs` e `IMAGENES.md`.

El backlog original de 14 tareas decía «no implementado» antes de construir la demo. Ese archivo histórico no se sobrescribe: esta nueva planificación distingue lo observado en el proyecto y lo que falta para una operación real. Las seis pruebas anteriores son evidencia registrada de la demo; no se presentan como una nueva auditoría de producción.

## Decisiones pendientes de la propietaria

Designar Product Owner; elegir salida como catálogo con asesoría o como tienda transaccional; aprobar presupuesto; confirmar proveedores, costos, precios, políticas y canal de atención. Ninguna de estas decisiones autoriza automáticamente gastos, campañas, contratación o publicación.

Las habilidades reutilizables se entregan por separado en `../nuevos agentes/skill/`. Están creadas como archivos locales, no instaladas globalmente.
