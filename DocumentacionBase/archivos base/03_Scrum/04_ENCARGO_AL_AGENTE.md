# Encargo reutilizable al agente implementador

Este archivo entrega contexto y resultados esperados; no es una orden de publicar, gastar o escribir a terceros.

## Prompt para continuar C’FANCY

> Trabaja sobre el proyecto existente `DESPLIEGUE` de C’FANCY. Primero lee `archivos base/LEEME.md`, las decisiones del plan, el modelo y diccionario de datos, y el ítem de `03_Scrum/backlog.json` que te indique. Inspecciona instrucciones locales y cambios actuales; conserva lo ya construido. No rehagas el sitio desde cero ni trates el backlog histórico como estado actual. Implementa solo el resultado del ítem elegido, con los datos y autorizaciones disponibles. Si faltan aprobaciones comerciales, prepara una versión revisable con los pendientes explícitos y sigue con trabajo independiente. No publiques, contrates ni actives pagos o campañas por inferencia. Conserva separación de demo, inventario, imágenes IA y datos reales. Ejecuta controles apropiados, entrega evidencia y actualiza estado solo cuando se cumpla la aceptación.

## Ficha para cada ejecución

```json
{
  "project": "CFANCY",
  "item_id": "CF-01",
  "target_directory": "DESPLIEGUE",
  "approved_scope": "Auditoria del estado actual, sin cambios comerciales",
  "inputs": ["archivos base/03_Scrum/backlog.json", "DESPLIEGUE/README.md"],
  "decisions_approved": [],
  "external_actions_authorized": [],
  "acceptance_evidence": [],
  "status": "proposed"
}
```

Antes de otro ítem sustituir ID, alcance y entradas por los reales. Las listas vacías expresan ausencia de autorización/evidencia, no permiso general. No incluir contraseñas, tokens o datos de clientes en esta ficha.

## Salida esperada del agente

Resultado y ubicación; requisito cubierto; cambios o decisiones; pruebas realmente ejecutadas con resultado; limitaciones; costo real si fue autorizado y ocurrió; siguiente acción necesaria. Diferenciar «preparado», «verificado en revisión» y «publicado». Una captura o build no acreditan por sí solos operación comercial.

Para nuevas marcas utiliza primero las habilidades de `nuevos agentes/skill/`; ellas preparan un paquete equivalente sin fijar C’FANCY como marca universal.
