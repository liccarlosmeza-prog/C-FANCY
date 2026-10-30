# Guía de implementación

## Contrato antes del código
El contrato OpenAPI es una propuesta ejecutable por generadores o mocks, no una API alojada. El paquete no incluye backend, credenciales, servidor, base de datos ni checkout. Se recomienda frontend y API en el mismo origen para reducir configuración de CORS. Framework, hosting y motor relacional deben elegirse en la siguiente fase según operación, costo y mantenimiento.

## Orden de trabajo
1. Aprobar identidad y reglas de publicación; obtener logo maestro y fotografías.
2. Modelar usuarios, sesiones, categorías, productos, variantes, medios, colecciones y certificados.
3. Importar fixtures solo en DEMO o DEV; verificar 10 productos y 4 categorías.
4. Implementar T01–T04 y pruebas de autenticación; no guardar datos personales reales en demo.
5. Implementar T05–T08, catálogo y paginación.
6. Implementar T09–T11, búsqueda y filtros.
7. Implementar T12–T14, detalle y disponibilidad por variante.
8. Aprobar evidencia y después incorporar carrito/pagos, inventario y operación en otra fase.

## Autenticación
Corregir la frase contraseña cifrada del backlog: almacenar hash con Argon2id mediante biblioteca mantenida y sal individual; nunca cifrado reversible ni texto plano. Parámetros se ajustan con pruebas en servidor y guía OWASP. Crear identificador de sesión aleatorio, rotarlo al entrar y almacenar su hash en servidor. Cookie __Host-cf_session con Secure, HttpOnly, SameSite=Lax y Path=/, sin Domain, en HTTPS. No usar JWT en localStorage. Definir CSRF para mutaciones: GET /auth/csrf entrega token asociado a pre-sesión o sesión y POST exige X-CSRF-Token; rotarlo tras login. Verificar Origin y no permitir CORS abierto con credenciales. Logout revoca servidor y expira cookie. Límite inicial de intentos 5 en 15 minutos por combinación de IP e identidad, ajustable y sin bloqueo permanente. Logs sin contraseñas, cookies ni tokens. Evitar enumeración de usuarios; registro responde 202 genérico aun si el correo ya existe. Implementar recuperación y verificación de correo antes del lanzamiento; son ampliaciones fuera de las 14 tareas actuales.

## Catálogo y precios
Almacenar precio en decimal o centavos enteros, nunca float para cálculo monetario. Datos de ejemplo usan enteros MXN. Separar variantes del producto; disponibilidad se calcula por SKU. Producto bajo pedido no tiene stock físico disponible. Separar ct de gema, k de metal y ley 925. No derivar natural/laboratorio del nombre o la imagen. Usar relaciones para colecciones; no duplicar productos. Base de datos aplica unicidad email normalizado, SKU y slug; transacciones para cambios de inventario cuando exista fase de pedidos. No exponer stock preciso al cliente en producción, solo estado comercial.

## Búsqueda y paginación
Consultas parametrizadas; listas blancas para sort y filtros. Normalizar acentos y mayúsculas sin alterar nombre mostrado. category/collection desconocidos devuelven 400. Rango inclusivo y en MXN. q vacío equivale a sin búsqueda. page entero positivo; page_size 1–50, predeterminado 12. Más allá de última página retorna items=[] y conserva total_pages. Con total=0, total_pages=0. Orden predeterminado name_asc, desempate por id. Nombre, tipo, materiales y origen deben indexarse según el motor elegido. Con diez datos no se demuestra escalabilidad: crear fixture sintético separado de al menos 10000 registros para carga, sin PII y sin publicarlo.

## Objetivos propuestos de prueba
p95 API de catálogo/búsqueda <500 ms en entorno acordado con 10000 registros y 20 usuarios concurrentes; no es medición realizada. Medir con caché fría y caliente. Evaluar Core Web Vitals en dispositivos reales después de implementar; las imágenes de concepto no acreditan rendimiento. Preparar imágenes WebP/AVIF, dimensiones explícitas, miniaturas y carga diferida fuera de portada.

## Preparación para producción
Logo vectorial autorizado, fotografías reales y permisos, catálogo sin is_demo, materiales/certificados verificados, precios e impuestos aprobados, disponibilidad real, costos y seguro de envío, plazos, garantía y políticas revisadas, canal de atención operativo, aviso de privacidad, correos transaccionales, monitoreo, respaldos y pruebas de recuperación. Elegir proveedor de pagos en fase posterior. No almacenar tarjetas. La revisión legal y fiscal requiere responsables designados; el paquete no fija condiciones comerciales finales.

## Evidencia de terminación
Cada T01–T14 exige captura de pantalla o respuesta de API, resultado de pruebas y referencia al cambio implementado. Revisar Backlog.csv y Casos_de_prueba.csv. La entrega de esta documentación no significa que las tareas estén desarrolladas o probadas.
