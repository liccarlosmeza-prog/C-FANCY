# C’FANCY · Guía de perfiles y atención

Versión 2.0 · 29/10/2026. El sistema se ejecuta localmente; las consultas y respuestas se guardan realmente en SQLite. Las joyas, imágenes IA y precios siguen siendo demostrativos. No hay cobros ni pedidos pagados.

## 1. Iniciar y entrar

Desde `C:\Users\licca\Documents\Fancy\DESPLIEGUE`:

```powershell
npm.cmd run dev
```

Abre la dirección que imprime el servidor, normalmente http://localhost:3000. Si sigue abierto un servidor anterior, detenlo con Ctrl+C en su terminal y vuelve a iniciar: una recarga del navegador no reemplaza un servidor antiguo. También puedes ejecutar `INICIAR_CFANCY.cmd` desde esta carpeta.

La revisión realizada por el agente usó **http://localhost:3001** para conservar el servicio que pudiera estar abierto en el puerto 3000. El puerto de tu siguiente ejecución depende de `PORT` y `APP_ORIGIN`; deben coincidir.

Entra mediante el icono de cuenta o `/acceso`. No hay un acceso administrativo secreto: el servidor reconoce el perfil de la cuenta y autoriza sus operaciones.

| Perfil demo | Correo | Contraseña | Destino |
| --- | --- | --- | --- |
| Administración | `admin@cfancy.demo` | `Cfancy.Admin.2026!` | `/admin` |
| Cliente, Valentina | `cliente@cfancy.demo` | `Cfancy.Cliente.2026!` | `/cuenta` |

Estos accesos se crean solo en modo demo y no se admiten con `DEMO=false`. El seed no restablece contraseñas de cuentas existentes. No son credenciales para una instalación comercial. Para un administrador propio se usa el procedimiento privado de `OPERACION.md`.

## 2. Qué puede ver cada perfil

| Pantalla | Cliente | Administración |
| --- | --- | --- |
| Inicio, joyas, materiales, colecciones y detalle | Catálogo público y galería | Igual; acceso adicional al atelier |
| Mi espacio | Bienvenida, consultas, propuestas y piezas guardadas | Puede usar su cuenta personal; no sustituye la vista de gestión |
| Mis consultas | Solo sus conversaciones, propuestas y citas | Todas las consultas desde Atención |
| Mi selección | Favoritos de su propia cuenta | Puede guardar su propia selección |
| Mi perfil | Nombre, consentimiento, verificación y exportación propia | Cuenta propia; listado de clientes en gestión |
| Resumen | Sin acceso | Cifras calculadas desde la base y etapas de atención |
| Atención | Sin acceso a la bandeja global | Consulta, respuesta pública, notas privadas, prioridad y asignación |
| Catálogo | Solo lectura pública | Crear/editar ficha, variantes, imágenes, precio y estado |
| Clientes | Sin acceso | Nombre, correo, perfil, verificación y consentimiento |
| Configuración | Sin acceso | Servicio, contacto, políticas, clasificaciones y backup |
| Buzón local / Historial | Sin acceso | Correos de prueba y auditoría |

Ocultar un enlace no es el control de seguridad: las API comprueban rol y propiedad. Otro cliente no puede abrir una consulta ajena aunque conozca su identificador. Las notas privadas no se envían al cliente.

## 3. Recorrido completo de atención personalizada

1. Entra como Valentina. Abre una joya y pulsa **Solicitar asesoría**, o entra a **Iniciar una asesoría** desde Mi espacio.
2. En una ficha se vinculan pieza y variante. Completa asunto y mensaje; ocasión y presupuesto son opcionales. Confirma el aviso del formulario y envía.
3. El sistema muestra el folio y abre la conversación. La solicitud está guardada en el servidor, no es un botón que simula envío.
4. Cierra sesión. Entra como administración y abre **Atención**. Busca el nombre/asunto o filtra por etapa. Abre el folio.
5. Elige responsable, prioridad y etapa; pulsa **Guardar seguimiento**. Escribe una respuesta en **La conversación** y envíala.
6. Si necesitas una nota para el equipo, marca **Guardar como nota privada**. Esa nota no aparece en el portal de la clienta.
7. Abre **Crear propuesta personalizada**, indica título, importe MXN, vigencia y condiciones. **Enviar al portal de la clienta** guarda la propuesta en esa consulta.
8. Opcionalmente abre **Proponer una cita**, elige fecha/hora local, canal y detalles. La clienta puede confirmar o declinar desde su conversación.
9. Vuelve a entrar como Valentina, abre **Mis consultas** y el mismo folio. Verá respuesta, propuesta y cita. **Me interesa esta propuesta** registra su interés: no cobra, no descuenta inventario ni crea un pedido pagado.
10. Administración continúa la conversación o cambia la etapa. **Acuerdo registrado** es una clasificación de atención, no una venta conciliada.

Se dejó una consulta de prueba con el asunto **«Una pieza para celebrar mi aniversario · prueba»**, respuesta de administración y propuesta de Anillo Aurora. Sirve para explorar el recorrido sin completar primero otra solicitud. Sus datos son de demostración.

El portal no es un chat en tiempo real: usa **Actualizar** para traer mensajes recientes. Una solicitud reintentada conserva el mismo folio en vez de duplicarse.

### Consulta sin cuenta

También puedes usar `/asesoria` sin iniciar sesión. Recibes acceso a esa conversación en la misma pestaña mediante una credencial privada guardada en su sesión de navegador. Recargar la pestaña conserva el seguimiento; cerrar la pestaña/eliminar la sesión puede perderlo. El folio por sí solo no da acceso. Una cuenta nueva no hereda automáticamente consultas anteriores por compartir correo. Para seguimiento entre dispositivos, utiliza una cuenta desde el inicio.

El correo y el teléfono públicos son opcionales y configurables. El canal ya operativo en esta versión es **el portal**; añadir un número no conecta automáticamente WhatsApp. No se enviaron mensajes externos en esta ejecución.

## 4. Selección de piezas

En una ficha, elige una variante disponible y pulsa **Agregar a mi selección**. Con sesión se guarda en la cuenta y se consulta desde **Mi selección**. Sin sesión se conserva una selección de demostración en ese navegador. Las variantes agotadas no se añaden como disponibles y las personalizadas conducen a asesoría.

## 5. Gestionar el catálogo

Administración → **Catálogo** → pieza → **Editar ficha**, o **Nueva pieza**. Completa nombre, URL, categoría, descripción, metal, ley, peso, piedra, medidas y cuidados. En variantes define SKU único, etiqueta/talla y existencias internas. El público ve disponibilidad, no el stock preciso.

Para imágenes elige vista, procedencia y descripción accesible; registra permiso/origen. **Seleccionar fotografía** acepta PNG/JPG/WebP de hasta 8 MB. La carga se guarda en `runtime/uploads`; pulsa **Guardar pieza** para vincularla. Las tres vistas originales IA se conservan como tales. No basta cambiar una etiqueta para acreditar materiales o autenticidad.

Modalidades de precio: demostración, fijo aprobado o cotizar. Estados: borrador, revisión, demostración, publicada y archivada. Archivar retira una ficha de la consulta pública sin eliminar su historial. Los fixtures originales no se convierten en inventario real; crea fichas nuevas para productos comerciales.

El servidor bloquea publicación comercial sin evidencia declarada, ley del metal, tres fotografías reales distintas, precio aprobado o cotización y políticas aprobadas. La comprobación técnica no reemplaza la revisión humana de autenticidad, proveedor y derechos de imagen.

## 6. Configuración, correo y auditoría

**Configuración:** nombre/horario de atención, cobertura, contacto y textos de políticas. Los borradores se identifican como tales. Aprobar una política corresponde a la marca y sus revisores. **Categorías y colecciones** permite registrar una clave estable y su nombre; una clave existente actualiza su etiqueta.

**Buzón local:** muestra los correos preparados en demo, con enlace para probar verificación y recuperación. Para solicitar recuperación, usa **¿Olvidaste tu contraseña?**; para verificar, **Mi perfil → Solicitar verificación**. Solo administración ve este buzón. En modo operativo no se exponen cuerpos de mensajes ni enlaces de recuperación por esta API.

**Historial:** muestra actor, acción, entidad y fecha; no contraseñas. **Actividad:** mide eventos agregados locales y consultas recibidas. Una vista, selección o propuesta no se registra como compra. No hay campañas ni píxeles publicitarios activados.

**Crear copia de seguridad** guarda una copia consistente en el servidor. Los procedimientos de restauración, correo externo y preparación de alojamiento están en [OPERACION.md](OPERACION.md).
