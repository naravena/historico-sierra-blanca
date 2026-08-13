# Despliegue: GitHub + Vercel + Login

## 0. Seguridad — antes de nada

Este proyecto ahora requiere usuario y contraseña. Nunca subas tu `.env` a GitHub (ya está en `.gitignore`, pero comprueba que no lo has forzado con `git add -f` en algún momento). Los secretos (contraseña, claves) viven **solo** en variables de entorno, nunca en el código.

---

## 1. Desarrollo local

```bash
npm install
cp .env.example .env
```

Genera el hash de tu contraseña (la contraseña en texto plano no se guarda en ningún sitio, solo se usa para calcular el hash):

```bash
npm run generar-hash "TuContraseñaSegura123!"
```

Copia el resultado (`ADMIN_PASSWORD_HASH=...`) a tu `.env`. Rellena también:
- `ADMIN_USERNAME` — el usuario que quieras
- `JWT_SECRET` — genera uno aleatorio: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `SUPABASE_DB_URL` — tu cadena de conexión (Session pooler, como ya tenías)

Copia el frontend dentro de `backend/public` (para que todo se sirva desde el mismo origen, sin líos de CORS):

```bash
cp -r frontend/* backend/public/
```

Arranca:

```bash
npm run dev
```

Abre `http://localhost:3000` — te debería redirigir a `/login.html` si no has iniciado sesión.

---

## 2. Subir a GitHub

```bash
git init
git add .
git commit -m "Portal de informes con autenticación"
```

Crea un repositorio nuevo en GitHub (público o privado, como prefieras — pero recuerda: **nunca** con el `.env` dentro) y:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

---

## 3. Desplegar en Vercel

1. Entra en [vercel.com](https://vercel.com) → **Add New → Project** → importa tu repositorio de GitHub.
2. Framework Preset: **Other** (Vercel detectará `vercel.json` automáticamente).
3. **Antes de darle a Deploy**, ve a la sección **Environment Variables** y añade:

   | Variable | Valor |
   |---|---|
   | `SUPABASE_DB_URL` | tu cadena de conexión (ver nota abajo sobre la integración) |
   | `ADMIN_USERNAME` | tu usuario |
   | `ADMIN_PASSWORD_HASH` | el hash que generaste en el paso 1 |
   | `JWT_SECRET` | el valor aleatorio que generaste |
   | `NODE_ENV` | `production` |

4. **Deploy**.

### Sobre la integración Vercel ↔ Supabase que mencionas

Si conectas la integración oficial (Vercel → Storage/Integrations → Supabase), Vercel puede rellenarte automáticamente variables como `POSTGRES_URL` a partir de tu proyecto de Supabase. Eso sí, esas variables suelen usar el nombre `POSTGRES_URL` (u otro), no `SUPABASE_DB_URL` — dos opciones:
- Renombra/copia esa variable a `SUPABASE_DB_URL` en la configuración del proyecto, o
- Cambia `backend/src/config/db.js` para leer `process.env.POSTGRES_URL || process.env.SUPABASE_DB_URL` (dímelo si quieres que lo haga así directamente).

Para el volumen de tráfico de este proyecto (una sola persona), la integración es cómoda pero no imprescindible — la cadena manual del Session Pooler que ya tienes funciona igual de bien.

---

## 4. Después del primer despliegue

- Tu portal estará en `https://tu-proyecto.vercel.app`, protegido por login.
- Cada `git push` a `main` vuelve a desplegar automáticamente.
- Si algún día cambias la contraseña: genera un hash nuevo (`npm run generar-hash`) y actualiza `ADMIN_PASSWORD_HASH` en Vercel (Project Settings → Environment Variables) — no hace falta tocar código ni volver a desplegar manualmente, Vercel lo aplica en el siguiente despliegue o puedes forzar un redeploy.

---

## 5. Checklist de cierre

- [ ] `.env` NO está en el repositorio (verificado con `git status` / `.gitignore`)
- [ ] Login funciona en local (`npm run dev`)
- [ ] Repo subido a GitHub
- [ ] Variables de entorno configuradas en Vercel (las 5 de la tabla)
- [ ] Despliegue en Vercel accesible, redirige a `/login.html` si no hay sesión
- [ ] Login funciona en producción y accedes al portal
- [ ] Cerrar sesión funciona y vuelve a pedir login
