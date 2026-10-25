# Portal de informes de Sierra Blanca

Portal web para consultar el histórico de Home Assistant, comparar estadísticas, estimar costes y guardar informes. El backend utiliza **Turso/libSQL** y se despliega en Vercel.

## Configuración

| Elemento | Configuración |
|---|---|
| Base de datos | `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` |
| Catálogo de sensores | Tabla `sensors` en Turso |
| Histórico de lecturas | Tabla `readings` en Turso |
| Sensor de consumo principal | `MAIN_CONSUMPTION_ENTITY_ID` |
| Unidad del consumo principal | `MAIN_CONSUMPTION_UNIT` (`Wh` o `kWh`) |
| Tarifa eléctrica | `backend/src/config/tarifa.js` |
| Acceso al portal | `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET` |

## Preparar Turso

1. Configura las variables de entorno a partir de `.env.example`.
2. Ejecuta `turso/01-schema.sql` en la base de datos Turso.
3. Ejecuta `turso/02-seed-sensores.sql` **solo** si necesitas insertar el catálogo inicial de Sierra Blanca y no tienes ya un catálogo correcto.

El esquema crea las tablas auxiliares si no existen y no elimina la tabla `readings` ni sus lecturas. La tabla debe incluir `entity_id`, `recorded_at` y `value`; las fechas deben estar guardadas como texto ISO consistente.

## Desarrollo local

```bash
npm install
cp .env.example .env
npm run generar-hash -- "TuContraseñaSegura123!"
npm run dev
```

Copia el hash generado a `ADMIN_PASSWORD_HASH` en `.env`. Después abre `http://localhost:3000`.

## Despliegue

Consulta [DEPLOY.md](DEPLOY.md) para configurar las variables de entorno en Vercel. No subas `.env` ni el token de Turso a GitHub.

## Costes eléctricos

La estimación combina el histórico del sensor configurado con la tarifa de `backend/src/config/tarifa.js`. Si Sierra Blanca tiene generación propia, revisa la configuración de tarifa y el tratamiento de excedentes antes de dar por buena la estimación.
