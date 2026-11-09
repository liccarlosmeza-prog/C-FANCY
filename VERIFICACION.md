# Verificación de paridad · 30/10/2026

**Carga-8 · Ónix editorial.** 23 pruebas aprobadas. Se verificaron la migración de portadas anteriores, la persistencia del reemplazo y la validación de transparencia. El WebP de 1076 × 1462 pesa 299 652 bytes y conserva el canal alfa exacto del PNG, con las cuatro esquinas transparentes. El navegador está deshabilitado en Work, por lo que no hubo revisión visual de la página en escritorio y móvil.

**Carga-7 · Filtros y tipografía:** 21 pruebas de procesos aprobadas. Se verificó que cambiar o quitar el tono conserva los demás filtros y reinicia la paginación, que la migración conserva el texto personalizado de portada y que las paletas anteriores siguen siendo compatibles. La compilación incluye siete archivos de fuentes locales con sus licencias. El navegador está deshabilitado en Work, por lo que esta revisión no incluye una inspección visual en pantalla.

**Carga-5 · Experiencia editorial:** 18 pruebas de procesos aprobadas. Incluyen separación entre borrador y portada aplicada, orden y visibilidad, operaciones de solo lectura en la vista previa y recepción de borradores y navegación por mensajes del mismo origen. El retrato retocado se empaqueta en JPEG de 1024 × 1536, de 241 847 bytes. Se retiraron leyendas superpuestas en resultados y galería; las vistas de producto tienen un pequeño sangrado contra costuras del tríptico. El navegador está deshabilitado en Work, por lo que no se pudo reproducir visualmente la franja reportada ni revisar el diseño en pantalla durante esta sesión.

**Carga-4 · 08/11/2026:** la suite suma 15 pruebas. Las nuevas cubren el filtro por tonos y la edición de etiquetas, las cinco paletas completas y su contraste, la copia y combinación de colores con persistencia, y el rechazo de archivos o combinaciones inválidas. La vista previa interactiva no se pudo ejecutar porque el navegador está deshabilitado en la configuración de Work. Se validan compilación y entrega de archivos por HTTP.

Esta revisión corresponde a la interfaz completa compilada desde una copia de DESPLIEGUE. La evidencia anterior permanece en el historial Git.

## Pruebas

**11 procesos aprobados**, mediante node herramientas/pruebas.mjs: catálogo/filtros/páginas, perfil/favoritos, consulta vinculada e idempotencia, notas internas/respuestas/prioridad/asignación, propuestas y citas múltiples con vigencia y respuesta, alta/edición/archivo/precios/SKU, políticas/taxonomías, actividad/clientes/auditoría/exportación, registro/consentimiento/verificación/recuperación de un uso, rechazo de respaldos ajenos y restauración JSON de consultas/fichas/configuración.

Compilación en app.js y app.css con esbuild. Se comprueba que el bundle no contiene llamadas fetch, XMLHttpRequest o WebSocket. Datos incorporados e imágenes relativas; no hay API ni dependencias de CDN.

Revisión de navegador local: ingreso admin; Resumen, Atención, Catálogo, Clientes, Actividad, Configuración, Buzón e Historial; editor completo de Aurora y guardado de plazo informativo. Las nuevas secciones cargaron sin errores.

La apertura directa file:// no se certifica: el navegador integrado solo permite HTTP/HTTPS. La prueba funcional usa un servidor de archivos, sin API.

## Límites

Los controles locales permiten recorrer pantallas; no se certifican como seguridad. Datos inspeccionables y modificables por quien usa el dispositivo. No hay servicio externo, HttpOnly, correo real, WhatsApp, cobro, pedido ni inventario compartido. La suite de API original no se presenta como evidencia de esta variante.

La publicación se comprueba después de subir el commit. Compilar no equivale a desplegar. DESPLIEGUE se compara por hash y estado Git para verificar que esta tarea no la modifica.


Revisión adicional ejecutada: imagen PNG seleccionada desde el editor, optimizada a WebP local, guardada y visible después de recargar; plazo informativo también persistente. Consola sin errores en la revisión final. Enlaces de cabecera verificados como rutas #/ y marcador de versión Carga-3-paridad presente.

Anchos medidos: editor móvil 360 px, documento/ancho útil 345/345; panel a 768 px, 753/753; panel a 1280 px, 1265/1265. No hubo desbordamiento del documento. Son viewports emulados, no dispositivos físicos ni una auditoría integral de accesibilidad.

Se integró el commit remoto db14814 sin sobrescribirlo. Su flujo Azure de ASP.NET se conserva solo con workflow_dispatch: esta rama no tiene proyecto .NET y los cambios de la prueba no deben disparar ese despliegue. main y su configuración no se modificaron.
