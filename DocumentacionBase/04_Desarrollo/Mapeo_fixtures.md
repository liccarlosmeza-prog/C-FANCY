# Mapeo de fixtures al contrato público

Los JSON son datos editoriales y de carga de demo, no respuestas de API listas para exponer sin transformación.

| Fixture | API | Regla |
|---|---|---|
| stock_status | availability | Copiar estado comercial |
| stock_qty_demo y variants.stock_qty | No exponer | Derivar availability por variante; no revelar inventario exacto |
| delivery_estimate_demo | delivery_estimate | Solo en DEMO; en producción calcular con operación real |
| photo_plan | No exponer como images | Lista de tomas pendientes; no es medio disponible |
| images=[] | image=null e images=[] | Mostrar placeholder honesto hasta contar con fotos |
| material Oro amarillo/Oro blanco/Oro rosa | filtro material=gold | Normalizar sin perder descripción visible |
| material Plata | filtro material=silver | Usar ley925 y metal_karat=null |
| publication_status=demo_only | Visible solo DEMO | Producción solo published y is_demo=false |
| warranty/shipping_policy/returns_policy | Mismos nombres | Son borradores; policies_status=draft en DEMO |
| certificate_status | certificate_status | Sin número inventado ni sello verificado |

Cada variant API contiene sku, label y availability. Para el personalizado usar made_to_order aunque stock_qty=0; para las otras opciones 0=out_of_stock y >0=in_stock. Registrar policies_status=approved solo tras aprobación real.
