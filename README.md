# C’FANCY · Interfaces completas para GitHub Pages

Esta actualización reemplaza la prueba simplificada por una copia de los componentes visuales de DESPLIEGUE, conectados a datos del navegador. El resultado publicado es HTML, CSS y JavaScript estático, sin API, servidor ni instalaciones para visitarlo. La base original no se modifica.

Sitio: **https://liccarlosmeza-prog.github.io/C-FANCY/**. Publicación: rama `gh-pages`. `main` conserva la aplicación con servidor y su flujo de Azure.

## Accesos públicos de prueba

| Perfil | Correo | Contraseña |
| --- | --- | --- |
| Cliente | cliente@cfancy.demo | Cfancy.Cliente.2026! |
| Administrador | admin@cfancy.demo | Cfancy.Admin.2026! |

Usa datos y claves ficticios. El acceso, los perfiles y las notas internas son una simulación visual sin seguridad real. La interfaz muestra esta advertencia permanentemente.

## Recorridos incluidos

- Tienda: inicio, categorías, búsqueda, rango de precios, orden A–Z/Z–A/precio, paginación y tamaño de página, materiales y colecciones.
- Diez productos: tres vistas, ampliación, variantes, disponibilidad, ficha técnica, cuidados y políticas.
- Cliente: Mi espacio, Mis consultas, Mi selección y Mi perfil; preferencias, verificación y exportación JSON propia.
- Administrador: Resumen, Atención, Catálogo editable, Clientes, Actividad, Configuración, Buzón local e Historial.
- Atención: pieza y variante vinculadas, correo de prueba, ocasión y presupuesto, respuestas, notas internas visuales, prioridad, responsable y seis etapas.
- Varias propuestas con importe/vigencia/respuesta y varias citas para confirmar, declinar o cancelar.
- Catálogo: alta, edición y archivo; precio/cotización, SKU, variantes, existencias, materiales, gemas, documentación declarativa y colecciones. Carga local de PNG/JPG/WebP hasta 8 MB, optimizada y guardada en el navegador.
- Servicio y políticas editables, categorías/colecciones, actividad calculada y auditoría local.
- Registro, recuperación y verificación con enlaces de un uso en el buzón simulado; no se envía correo.
- Descargas JSON de cuenta/gestión y respaldo restaurable.

Comparación detallada: [COMPARACION.md](COMPARACION.md). Pruebas: [VERIFICACION.md](VERIFICACION.md).

Cliente → ficha y variante → solicitar asesoría → salir → administrador → Atención → responder y crear propuesta/cita → cliente → Mis consultas. Las notas internas solo se ocultan en la interfaz cliente; no son confidenciales.

Recuperación/verificación: solicitar enlace → ingresar como administrador → Buzón local → abrir enlace en este mismo navegador → completar el recorrido → volver a entrar como cliente.

## Persistencia y límites

Datos en IndexedDB (`cfancy-pages-paridad-v3`), con alternativa local si IndexedDB no está disponible. La sesión visual queda en la pestaña. No hay sincronización entre equipos ni aislamiento seguro entre perfiles. Todo es inspeccionable: no uses datos personales, contraseñas reales ni documentos confidenciales.

El almacenamiento de la primera prueba (`cfancy-pages-v1:`) permanece, pero no se importa automáticamente al nuevo modelo. No se copia la base SQLite original. Cada instalación nueva empieza con diez artículos y dos accesos, sin consultas inventadas.

**Guía y accesos de prueba**, arriba del sitio, ofrece restablecimiento y respaldo/restauración JSON. Para restaurar necesitas el perfil admin demo; después vuelve a iniciar sesión. No es un respaldo SQLite ni una restauración del servidor.

La publicación comercial se bloquea: conserva artículos demo, en revisión, borrador o archivo. No hay cobros, pedidos, reservas de inventario, envíos externos ni seguridad de servidor. Estas capacidades requieren la base completa y decisiones de la marca.

## Abrir y actualizar

Abre `index.html` o sirve esta carpeta con cualquier servidor de archivos. No se requiere compilar para visitar. La apertura directa file:// no se presenta como prueba ejecutada: el navegador integrado solo permite HTTP/HTTPS.

Las fuentes editables están en `fuente/`. Para recompilar, con las dependencias originales instaladas al lado:

```powershell
node herramientas/construir.mjs
node herramientas/pruebas.mjs
```

El compilador solo lee dependencias de ../DESPLIEGUE/node_modules y escribe aquí. adaptar.py documenta la transformación inicial de la copia; no lo ejecutes de nuevo sobre fuentes ya adaptadas sin volver a copiar primero la interfaz original. demo-store.ts y DemoTools.tsx son exclusivos de esta variante.

Después de verificar:

```powershell
git add .
git commit -m "Describe el ajuste de la prueba"
git push origin gh-pages
```

Pages publica la raíz de gh-pages. Los enlaces usan #/ y no requieren reescrituras. No hay service worker; recarga con Ctrl+F5 si conservas una versión anterior tras la publicación.

La configuración Azure heredada añadida a gh-pages se conserva con ejecución manual; esta rama estática no contiene un proyecto ASP.NET. GitHub Pages usa su proceso propio de publicación desde la rama.
