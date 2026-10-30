# Comparación con DESPLIEGUE · 30/10/2026

La primera prueba tenía tres secciones administrativas y catálogo de lectura. Esta actualización reutiliza main, Atelier, ProductGallery, ProductInformation, iconos y estilos de la base. Se adaptan rutas, descargas, mensajes y persistencia; no se copia el servidor ni runtime.

| Proceso | DESPLIEGUE | GitHub Pages actualizado |
| --- | --- | --- |
| Inicio y diseño responsive | React | Mismos componentes compilados estáticamente |
| Búsqueda, categorías, colecciones, rango, orden y tamaño de página | API | Cálculo local con los mismos controles |
| Diez artículos, tres vistas, zoom y ficha técnica | Servidor | Misma presentación con fixtures y edición local |
| Variantes disponibles, agotadas y bajo pedido | Validación servidor | Comportamiento de prueba y asesoría vinculada |
| Acceso y nombre en cabecera | Sesión HttpOnly | Sesión visual en pestaña, sin seguridad real |
| Registro, consentimiento, preferencias | Cuenta SQLite | Cuenta ficticia local |
| Recuperación y verificación | Token servidor / buzón | Enlaces locales de un uso y con vencimiento |
| Mi espacio, Mis consultas, Mi selección, Mi perfil | Datos de cuenta | Mismas pantallas, datos locales por perfil visual |
| Solicitud con/sin cuenta, correo, ocasión y presupuesto | Recepción API | Guardado en navegador sin envío a la marca |
| Conversación, notas internas y folio | Permisos servidor | Mismos controles; notas solo ocultas visualmente |
| Prioridad, responsable y seis etapas | CRM persistente | Seguimiento local equivalente |
| Propuestas múltiples y vigencia | Servidor | Simulación sin pago ni pedido |
| Citas múltiples y respuestas/cancelación | Servidor | Simulación con fechas futuras |
| Resumen y Actividad | Cálculo SQLite | Cálculo de datos locales, sin cifras inventadas |
| Catálogo: nueva, editar, archivar y buscar | Formularios administrativos | Mismos formularios con persistencia local |
| Precio, SKU, stock, materiales, gemas, certificados y colecciones | Registros y evidencia | Campos y validaciones de prueba, sin acreditación real |
| Fotos y procedencia | Carga runtime | Lectura y optimización local, sin subida externa |
| Clientes | Listado autorizado | Cuentas ficticias del navegador |
| Servicio, políticas y clasificaciones | Configuración servidor | Edición local reflejada en la prueba |
| Buzón e Historial | Cola/auditoría SQLite | Correos simulados y auditoría local |
| Exportar cuenta y gestión | Descarga servidor | JSON generado en navegador |
| Respaldo y restauración | SQLite y scripts | JSON descargable y restaurable desde la guía |
| Seguridad y publicación comercial | Requieren configuración/evidencia | Bloqueadas; no se presenta una aprobación comercial efectiva |
| Correo real, WhatsApp, pagos y pedidos | No activados en base demo | No activados |
| Datos compartidos entre dispositivos | Servidor | Requieren un servicio remoto, fuera de esta prueba |

Las diferencias técnicas son deliberadas y visibles. Pages reproduce los recorridos; no sustituye al backend. La base DESPLIEGUE permanece intacta.
