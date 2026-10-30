# Especificación de experiencia y pantallas

## Alcance del primer vistazo
Las imágenes PNG son propuestas visuales, no pantallas funcionales ni prueba de responsive. Se documentan los cuatro bloques de la lista adjunta: registro e inicio de sesión, catálogo por categorías, búsqueda y filtros, detalle de producto. Carrito, pedidos, pagos, facturación y panel administrativo se reservan para otra fase. El botón de compra de esta fase prepara la selección o muestra que la compra aún no está habilitada; nunca simula un pago real.

## Arquitectura de información
Inicio → Joyas (Anillos, Aretes, Collares, Pulseras) → detalle. Materiales y piedras son filtros y accesos de colección: Oro 18k, Plata 925, Diamantes naturales, Diamantes de laboratorio, Gemas preciosas. Novedades, Alta joyería y Piezas personalizadas son colecciones editoriales, no categorías de tipo. Un producto puede pertenecer a varias colecciones sin duplicar su SKU. Intenciones queda como colección secundaria opcional. Asesoría es una ruta visible; Cuenta contiene registro, acceso y cierre de sesión.

## Inicio
Header con logo original, navegación, búsqueda y cuenta. Hero claro con frase Elegancia que permanece y botones Descubrir colección / Recibir asesoría. Tres o diez piezas destacadas con precio real cuando se publique. Accesos a tipos y materiales. Bloque de asesoría. Footer con contacto, políticas y datos comerciales aprobados. Los accesos a asesoría abren un canal real por confirmar; en demo deben indicar canal no configurado y no enviar datos a terceros.

## Registro
Campos nombre (2–100 caracteres), correo (máximo 254), contraseña y confirmación. Contraseña propuesta 15–128 caracteres mientras no haya MFA; permitir pegar y gestores, sin reglas arbitrarias de composición; verificar reglas en servidor. Mostrar/ocultar contraseña con nombre accesible. Confirmación solo en cliente, no se almacena. Consentimiento de marketing opcional y sin premarcar, separado del aviso de privacidad que debe revisarse antes de producción. Registrar no inicia sesión automáticamente en este contrato. Mensaje de éxito lleva a acceso. No guardar contraseñas, hashes ni tokens de sesión en localStorage. Recuperación y verificación de correo son requisitos adicionales para lanzamiento, aún no implementados.

## Inicio y cierre de sesión
Acceso con correo y contraseña; errores genéricos sin identificar cuál dato falló. Durante envío deshabilitar doble submit y mantener foco lógico. Al entrar recuperar el destino original validado del mismo sitio, sin redirecciones externas. Propuesta de sesión: 30 minutos de inactividad y 12 horas absolutas; configurable. Salir envía POST al servidor, invalida sesión y elimina cookie; navegar atrás o recargar no debe recuperar acceso autenticado. Expiración conduce a acceso con mensaje Tu sesión terminó. El catálogo y el detalle se pueden consultar sin cuenta.

## Catálogo
Ruta /joyas. H1, conteo total, controles de filtros, orden y cuadrícula. Cuatro columnas desde 1200 px, tres desde 900 px, dos entre 480 y 899 px, una por debajo de 480 px. Imágenes 4:5; cards con nombre, precio MXN, material resumido y disponibilidad textual. No mostrar certificaciones sin evidencia. Paginación visible de 12 elementos, orden estable por criterio elegido y luego ID. Los diez datos demo permiten probar page_size=2 y 5 páginas. El usuario debe poder volver al listado con los filtros conservados en URL.

## Búsqueda y filtros
Ruta /joyas?q=aurora&category=anillos&price_min=10000&price_max=50000&sort=price_asc&page=1&page_size=12. Búsqueda por nombre sin distinguir mayúsculas o acentos, máximo 100 caracteres; normalizar espacios. Categoría y rango de precio se combinan con AND; materiales/origen/colección son extensiones contempladas en contrato. Cambiar filtro reinicia page=1. Búsqueda tras Enter o debounce 300 ms; cancelar petición previa para evitar mostrar resultados antiguos. Mantener palabras y valores ante error. Mínimo mayor que máximo produce error de validación, no intercambio silencioso. Estado sin resultados explica filtros y permite Limpiar filtros. No incluir productos ocultos ni publicar los demo en producción.

## Detalle
Ruta /joya/:slug. Galería con zoom accesible, vistas laterales y de escala; video opcional. Mostrar nombre, precio final, material/quilataje o ley, peso, medidas, tipo y origen de piedra, variantes, certificado verificado cuando corresponda, existencia por variante, plazo/costo de envío, cuidados, garantía y cambios. Oro 18k no significa gema de 18 ct. La variante agotada desactiva compra; bajo pedido requiere asesoría y aprobación de especificación. Para certificado pendiente mostrar Pendiente de verificación, sin sello de autenticidad. Estado 404 para producto inexistente u oculto. En producción, impedir publicar si faltan precio, moneda, material, disponibilidad, fotos y políticas aplicables.

## Estados transversales
Inicial, cargando con indicador no intrusivo, éxito, vacío, validación, error de red con reintento, 404, no autorizado, sesión expirada, variante agotada, bajo pedido. Formularios con etiquetas persistentes, error junto al campo y resumen con foco. No depender solo de color. Esc y foco correcto en panel móvil de filtros; retorno de foco al botón que lo abrió. Respetar reducción de movimiento. Navegación completa con teclado, texto ampliable y contraste mínimo 4.5:1 para texto normal y 3:1 para texto grande; validar componentes, foco y bordes por separado.

## Límites del paquete
Se entrega especificación y datos, no una aplicación ni una API ejecutada. Las imágenes no reemplazan los tokens, el catálogo ni las reglas documentadas. Los fotogramas generados no representan productos reales. El canal de asesoría, las políticas y el contenido comercial necesitan confirmación. No se han configurado cuentas ni contratado servicios.
