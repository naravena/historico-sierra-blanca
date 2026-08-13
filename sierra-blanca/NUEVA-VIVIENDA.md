# Nueva vivienda: Sierra Blanca

Reutiliza exactamente el mismo código (backend + frontend + arquitectura). Lo único que cambia entre viviendas es **configuración**, nunca código. Esto es un proyecto **separado e independiente** del de la vivienda principal: su propio Supabase, su propio despliegue en Vercel, su propio repositorio (o una carpeta/rama distinta, como prefieras).

---

## 0. Qué es específico de cada vivienda (y ya está aislado en el código)

Gracias al cambio de hoy, nada del código depende de la vivienda principal:

| Qué cambia por vivienda | Dónde vive |
|---|---|
| Catálogo de sensores | Tabla `sensors` en Supabase (datos, no código) |
| Sensor de "consumo general" para el informe de coste | `MAIN_CONSUMPTION_ENTITY_ID` (variable de entorno) |
| Unidad de ese sensor (Wh o kWh) | `MAIN_CONSUMPTION_UNIT` (variable de entorno) |
| Tarifa eléctrica | `backend/src/config/tarifa.js` |
| Credenciales de acceso al portal | `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` |
| Base de datos | `SUPABASE_DB_URL` |

---

## 1. Supabase — proyecto nuevo

1. Crea un proyecto de Supabase **nuevo** (Fase 2 desde cero, pero ya con todo lo aprendido).
2. Ejecuta en su SQL Editor, en este orden:
   - `sierra-blanca/01-schema.sql` (esquema completo)
   - `sierra-blanca/02-seed-sensores.sql` (catálogo de sensores de Sierra Blanca)
3. **Antes de dar esto por cerrado**, confirma en Developer Tools → States de ese Home Assistant si `sensor.sierra_blanca_energia_consumida` (y el resto de `energia_*`) vienen en `kWh` o en `Wh` — el dashboard no lo especifica. Si es `Wh`, lo ajustas en el paso 3 más abajo.

## 2. Home Assistant de Sierra Blanca — sincronización

Repite la Fase 3 (rest_command + automatizaciones) tal cual la hicimos para la vivienda principal, pero:
- Apuntando a la URL y `service_role` de **este** proyecto Supabase nuevo
- Con la lista de entidades de `sierra-blanca/02-seed-sensores.sql` en vez de las de la vivienda principal

## 3. Portal — despliegue independiente

Clona/copia la carpeta `portal-informes/` a un repositorio nuevo de GitHub (o usa el mismo repo en otro proyecto de Vercel, como prefieras). En sus variables de entorno de Vercel:

```
SUPABASE_DB_URL=<el de este proyecto nuevo de Supabase>
ADMIN_USERNAME=<puede ser el mismo u otro>
ADMIN_PASSWORD_HASH=<genera uno nuevo con npm run generar-hash>
JWT_SECRET=<genera uno nuevo, no reutilices el de la vivienda principal>
MAIN_CONSUMPTION_ENTITY_ID=sensor.sierra_blanca_energia_consumida
MAIN_CONSUMPTION_UNIT=kWh
```
(cambia `MAIN_CONSUMPTION_UNIT` a `Wh` si en el paso 1.3 confirmaste que es esa la unidad real)

## 4. Tarifa eléctrica de Sierra Blanca

`backend/src/config/tarifa.js` tiene los precios de la tarifa de Repsol de la vivienda principal — para Sierra Blanca necesitas los suyos propios (pásame una factura de esa vivienda igual que hiciste con la otra, y te reconstruyo la fórmula igual de precisa).

Si Sierra Blanca tiene generación propia (paneles solares, dado que hay sensores de "energía producida"), el informe de coste actual **no contempla excedentes ni compensación** — es una vivienda con generación, así que probablemente necesites una fórmula de coste distinta (con compensación de excedentes, por ejemplo). Dímelo cuando tengas la factura y lo diseñamos.

---

## 5. Checklist

- [ ] Unidad de `energia_consumida`/`energia_producida` confirmada (kWh o Wh)
- [ ] Proyecto Supabase nuevo creado + esquema + semilla ejecutados
- [ ] Automatizaciones de HA de Sierra Blanca sincronizando
- [ ] Portal desplegado en Vercel (proyecto separado) con sus propias variables de entorno
- [ ] Login funcionando con credenciales propias de esta vivienda
- [ ] Tarifa de Sierra Blanca configurada (pendiente de que pases la factura)
- [ ] Decidido cómo tratar la energía producida/excedentes en el informe de coste
