# Despliegue: GitHub + Vercel + Turso + Login

## 1. Seguridad

No subas `.env` a GitHub. Los tokens y secretos solo deben estar en variables de entorno. Si un token de Turso se compartió públicamente, revócalo y genera uno nuevo.

## 2. Preparar Turso

1. Crea o selecciona la base de datos en Turso.
2. Obtén la URL (`libsql://...`) y genera un token de autenticación.
3. Ejecuta `turso/01-schema.sql` en la consola SQL de Turso.
4. Ejecuta `turso/02-seed-sensores.sql` únicamente si quieres insertar el catálogo inicial de Sierra Blanca y aún no tienes el catálogo correcto.

El esquema no borra ni reemplaza las lecturas existentes. El backend espera que `readings` tenga `entity_id`, `recorded_at` y `value`; las fechas deben estar guardadas como texto ISO comparable.

## 3. Desarrollo local

```bash
npm install
cp .env.example .env
```

Configura en `.env`:
- `TURSO_DATABASE_URL`: URL de la base Turso.
- `TURSO_AUTH_TOKEN`: token de Turso.
- `ADMIN_USERNAME`: usuario del portal.
- `ADMIN_PASSWORD_HASH`: hash de contraseña.
- `JWT_SECRET`: secreto aleatorio largo.
- `MAIN_CONSUMPTION_ENTITY_ID` y `MAIN_CONSUMPTION_UNIT`: entidad y unidad reales.

Genera el hash de contraseña:

```bash
npm run generar-hash -- "TuContraseñaSegura123!"
```

Para servir el frontend desde Express, copia los archivos estáticos a `backend/public` y ejecuta:

```bash
cp -r frontend/* backend/public/
npm run dev
```

Abre `http://localhost:3000`.

## 4. Desplegar en Vercel

1. Importa el repositorio en Vercel y selecciona Framework Preset `Other`.
2. Configura las variables en los entornos que vayas a utilizar:

| Variable | Valor |
|---|---|
| `TURSO_DATABASE_URL` | URL `libsql://...` de Turso |
| `TURSO_AUTH_TOKEN` | Token secreto de Turso |
| `ADMIN_USERNAME` | Usuario del portal |
| `ADMIN_PASSWORD_HASH` | Hash generado con el script |
| `JWT_SECRET` | Secreto aleatorio largo |
| `NODE_ENV` | `production` |
| `MAIN_CONSUMPTION_ENTITY_ID` | ID real del sensor de consumo total |
| `MAIN_CONSUMPTION_UNIT` | `Wh` o `kWh`, según la entidad |

3. Despliega. `api/index.js` expone el backend y `vercel.json` enruta `/api/*` hacia él.

## 5. Comprobaciones después del despliegue

- `/api/health` responde `{"status":"ok"}`.
- El login funciona y se puede cerrar sesión.
- El catálogo muestra las entidades correctas.
- Un rango de fechas conocido devuelve lecturas.
- Los informes se pueden crear, listar, abrir y eliminar.
- El cálculo de coste utiliza el sensor y la unidad configurados.

## 6. Checklist

- [ ] `.env` no está en el repositorio.
- [ ] `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` están configurados.
- [ ] El esquema se ejecutó sin borrar `readings`.
- [ ] El catálogo `sensors` corresponde a Sierra Blanca.
- [ ] Variables de autenticación configuradas en Vercel.
- [ ] Login, estadísticas, informes y coste comprobados en producción.
