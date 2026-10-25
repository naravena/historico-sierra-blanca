# Nueva vivienda: Sierra Blanca

El portal utiliza el mismo backend para cualquier vivienda. La vivienda concreta se configura con el catálogo de sensores, las variables de entorno y su tarifa eléctrica.

## Base de datos Turso

1. Configura `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` en el entorno del backend.
2. Ejecuta `turso/01-schema.sql` en Turso.
3. Ejecuta `turso/02-seed-sensores.sql` solo si necesitas el catálogo inicial de Sierra Blanca y aún no existe uno correcto.
4. Confirma en Home Assistant las unidades reales de los sensores de energía antes de configurar el informe de coste.

El esquema no elimina las lecturas existentes en `readings`. La tabla debe tener las columnas `entity_id`, `recorded_at` y `value`.

## Sincronización desde Home Assistant

La automatización o integración que envía el histórico debe escribir en la base de datos Turso elegida y conservar el formato de fecha ISO en `recorded_at`. No compartas el token de Turso en el frontend ni lo guardes en el repositorio.

## Variables del portal

En local o Vercel configura, como mínimo:

```dotenv
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
ADMIN_USERNAME=...
ADMIN_PASSWORD_HASH=...
JWT_SECRET=...
MAIN_CONSUMPTION_ENTITY_ID=sensor.sierra_blanca_energia_consumida
MAIN_CONSUMPTION_UNIT=kWh
```

Genera el hash con `npm run generar-hash -- "TuContraseñaSegura123!"`. Ajusta `MAIN_CONSUMPTION_UNIT` a `Wh` si esa es la unidad real de la entidad.

## Tarifa eléctrica

La tarifa actual está en `backend/src/config/tarifa.js`. Confirma que sus precios corresponden a Sierra Blanca antes de utilizar la estimación como comparación de factura. Si la vivienda tiene generación propia, el cálculo actual no contempla compensación de excedentes.

Consulta [DEPLOY.md](../DEPLOY.md) para el despliegue en Vercel.
