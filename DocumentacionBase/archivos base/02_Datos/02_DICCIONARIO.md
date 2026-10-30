# Diccionario y catálogos de referencia

`diccionario_datos.json` define entidades, claves, relaciones y atributos propuestos de fase A. Tipos son lógicos, no DDL. `catalogos_base.json` contiene valores iniciales; no introduce inventario ni disponibilidad real. Las extensiones transaccionales requieren otro diseño antes de ejecutar la fase B.

## Convenciones

| Clase | Convención |
| --- | --- |
| ID | Identificador estable de entidad; no derivarlo del nombre |
| Clave de catálogo | Slug ASCII estable; etiqueta visible en español |
| Dinero | Centavos enteros no negativos; moneda `MXN` inicial |
| Fechas | ISO 8601 con zona horaria para instantes; fechas civiles cuando corresponda |
| Masa / dimensiones | Decimal g / mm; nunca en una cadena para cálculo |
| Desconocido | `null` y estado de verificación; no usar 0 ni «certificado» |
| Privado | Contraseñas, sesión, contacto, costo y auditoría fuera de respuestas públicas |

## Catálogos necesarios y usos

- **Categorías:** anillos, aretes, collares, pulseras; tipo principal de la ficha.
- **Colecciones:** novedades, alta joyería y personalizadas; alta joyería necesita criterio editorial aprobado.
- **Filtros materiales/piedras:** oro, plata, natural/laboratorio y gemas. Las colecciones históricas por material se conservan como alias de navegación; la semántica futura usa atributos.
- **Materiales y ley:** separar metal/color, quilataje y finura. Oro 18 k se representa con 18 y 750, plata con finura 925 y quilataje no aplicable.
- **Tipos/orígenes/tratamientos de gema:** no confundir origen de formación con país de origen. No afirmar tratamiento «ninguno» porque no está informado.
- **Tallas:** US para anillos; cm para largo con conversión interna definida. No mezclar US 6 con otra escala sin tabla validada.
- **Disponibilidad:** disponible, agotado y bajo pedido; información pública diferente de stock interno.
- **Publicación/verificación/certificados:** estados distintos para evitar que un medio pendiente o un documento incompleto se convierta en evidencia.
- **Vistas y medios:** frente, lateral, detalle y escala; escala adicional recomendada para vender. Tipos IA, foto de producto y video real autorizado.
- **Consulta/consentimiento:** estados de atención, finalidades y canal aprobado. No agregar teléfonos inventados.

## Formularios de carga que debe preparar el agente

1. Producto y variantes: identidad, especificaciones, categoría, SKU y talla/largo.
2. Evidencia: proveedor, aprobación de materiales, medios/licencias y certificados cuando existan.
3. Precio/operación: modalidad fijo/cotizar, vigencia, moneda, estado y plazo confirmado.
4. Marketing: descripción corta/larga, título SEO, alt, colección y ocasión verificadas.

Responsable de catálogo completa; responsable comercial aprueba. Todos los cambios necesitan trazabilidad. Una carga de producto demo no debe poder enviarse a producción con una acción ambigua de «guardar».
