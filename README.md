# C’FANCY · Prueba estática para GitHub Pages

HTML, CSS y JavaScript sin React, dependencias, compilación, servidor de aplicación ni API. Conserva diez productos ficticios y sus 30 vistas IA. No modifica la base original `DESPLIEGUE`.

## Abrir localmente

Abre `index.html` con doble clic. También puedes servir esta carpeta con cualquier servidor de archivos estáticos. `catalogo.js` incorpora los datos para evitar peticiones de red y permitir el uso mediante `file://`. Las fuentes tienen alternativas locales; no se requieren CDNs.

## Probar los perfiles

| Perfil visual | Correo público de prueba | Clave pública de prueba |
| --- | --- | --- |
| Cliente | `cliente@cfancy.demo` | `Cfancy.Cliente.2026!` |
| Administración | `admin@cfancy.demo` | `Cfancy.Admin.2026!` |

Son controles de demostración visibles en el código, no autenticación ni protección de información. No uses credenciales reales ni datos personales. La sesión, selección, consultas, respuestas, propuestas y citas se guardan solo en el almacenamiento de este navegador. Cada navegador/dispositivo tiene datos distintos. GitHub Pages no recibe las solicitudes de asesoría para la marca.

Recorrido: catálogo → detalle y tres vistas → selección → ingreso cliente → asesoría → cerrar sesión demo → ingreso administrador → Atención → respuesta/propuesta/cita → volver al cliente → Mis consultas. La compra muestra un aviso sin generar transacción. El catálogo administrativo es de lectura; la edición real permanece en la base original.

La sección **Cómo probar** explica los recorridos y permite restablecer únicamente los datos de esta demo estática.

## GitHub Pages

Repositorio: `liccarlosmeza-prog/C-FANCY`. La rama `gh-pages` contiene únicamente los archivos estáticos de esta carpeta, con `index.html` en su raíz. `main` conserva la base original y la configuración de Azure que ya tenía; no se modifica para esta prueba.

En GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → gh-pages → /(root) → Save**. Dirección esperada tras finalizar la publicación: `https://liccarlosmeza-prog.github.io/C-FANCY/`.

Los enlaces y medios son relativos; las rutas de pantalla usan `#/`, por ejemplo `#/joya/anillo-aurora`. Abrir una ficha y recargar no requiere reescrituras ni devuelve una ruta inexistente del servidor. `.nojekyll` evita procesar la carpeta con Jekyll.

Para actualizar la prueba, ejecuta dentro de esta carpeta:

```powershell
git status
git add .
git commit -m "Describe el ajuste de la prueba"
git push origin gh-pages
```

No se necesita cambiar `DESPLIEGUE`, `main` ni la base de datos original.

No incluye datos de `runtime/`, secretos, skills ni documentación de negocio dentro de la rama publicada. El resto del proyecto sigue disponible en `main`.
