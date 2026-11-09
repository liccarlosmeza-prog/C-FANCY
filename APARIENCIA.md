# C’FANCY · La mirada del color

La portada conecta el retrato con anillos y la pantera a través de sus miradas. La frase «Las joyas te eligen a ti, a través del color» da paso a siete tonos e intenciones inspiradas en los chakras. Es un lenguaje editorial y espiritual: las piezas no se presentan como tratamientos. Las dos fotografías de campaña están en `assets/campana/` y no representan productos de inventario.

## Probar y personalizar una paleta

1. Inicia sesión como administrador demo. Entra a **Apariencia** en el menú de gestión.
2. Las cinco bases son **Ónix y oro** (inicial), **Marfil y ciruela**, **Selva esmeralda**, **Noche índigo** y **Alba rosa**. Puedes previsualizar o aplicar una base directamente.
3. Usa **Duplicar** y asigna un nombre. Selecciona un componente. Cada uno tiene fondo, texto, acento y borde propios. En Botones se pueden editar también el fondo y texto al pasar el cursor.
4. Cambia cada tono con el selector de color o **Tomar de otra paleta**. El menú ofrece el color equivalente y los tonos generales de cada base. La copia no altera ninguna de las cinco bases.
5. Ajusta la textura de las secciones editoriales: lisa, grano fino o satinada. Abre la **vista previa navegable** y alterna entre Escritorio (1280 px) y Móvil (390 px). Usa el selector de página o navega dentro del sitio; **Ubicar componente** marca la zona que estás editando. **Ampliar vista previa** abre el panel grande. La vista previa muestra borradores sin guardarlos. El editor marca combinaciones de texto o acento y fondo que no llegan a 4.5:1; esta comprobación no sustituye una auditoría de accesibilidad.
6. Selecciona **Guardar y aplicar mi paleta**. Se conserva entre recargas en este navegador. El menú **Mis paletas** permite volver a una copia; **Restaurar Ónix y oro** recupera la base sin borrar las copias.

El tema se exporta e importa como un JSON independiente del respaldo de cuentas y consultas. GitHub Pages no guarda las ediciones del administrador en un servidor. Para publicar una paleta para quienes aún no han guardado una preferencia, exporta el JSON, colócalo en `fuente/datos/tema-publico.json`, ejecuta `node herramientas/construir.mjs` y publica `gh-pages`. Con `null` se mantiene Ónix y oro. El archivo admite solo colores hexadecimales y acabados definidos, sin CSS libre ni recursos externos.

## Recorrido por tonos

**Deja que una joya te encuentre** abre la exploración por color. Seleccionar un tono muestra su chakra, significado y símbolo. Pulsa **Ver joyas** para aplicar el filtro; el catálogo muestra el tono activo, permite quitarlo y regresar a su explicación. Los tonos sin piezas ofrecen asesoría. El formulario conserva el tono que llevó a la consulta. En **Administración → Catálogo**, cada ficha permite editar sus **Tonos de inspiración**. La etiqueta expresa afinidad de color e intención, no el tipo de gema ni una propiedad terapéutica.

## Editar la tipografía

En **Administración → Apariencia → Tipografía** puedes escoger por separado la fuente de títulos y la de textos y navegación. La combinación inicial es Cormorant Garamond con Manrope. Cambiar la letra de una base crea una copia editable; la vista previa permite probarla antes de aplicar. El logo conserva su diseño. La selección viaja con la paleta exportada y las paletas anteriores siguen siendo compatibles.

## Editar la portada

En **Administración → Portada** cambia los títulos, las leyendas, los párrafos y los textos de los botones de cada sección. Puedes mover u ocultar los capítulos que siguen al bloque principal. Los cambios se ven junto al borrador de paleta en la misma vista previa navegable. **Aplicar portada** guarda solo en este navegador; **Descartar borrador** recupera la versión en uso.

En **Administración → Portada → Instinto y color**, usa **Reemplazar imagen** para cargar un PNG o WebP de hasta 8 MB. El archivo debe tener transparencia real. Deja espacio alrededor de la figura y escribe una descripción accesible de lo que se ve. La imagen se optimiza en el navegador y se muestra completa sobre el fondo de Campaña de la paleta. Abre la vista previa y pulsa **Ubicar componente** para revisar la sección en escritorio y móvil. **Restaurar Ónix editorial** recupera el recorte inicial en el borrador.

Para publicar textos o una imagen para los visitantes, usa **Exportar portada JSON**, coloca el archivo en `fuente/datos/portada-publica.json`, compila y publica `gh-pages`. El JSON incluye la imagen optimizada cuando hay un reemplazo. La previsualización requiere HTTP o HTTPS, como GitHub Pages o un servidor local.

La actualización se limita a `despliegueGithub`. La base `DESPLIEGUE`, su servidor y su rama no se modifican.
