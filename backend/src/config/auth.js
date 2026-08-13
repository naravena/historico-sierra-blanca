/**
 * Configuración de autenticación. Todo viene de variables de entorno -
 * nunca hay credenciales en el código ni en el repositorio.
 * Falla rápido y con un mensaje claro si falta algo, en vez de arrancar
 * en un estado a medias inseguro.
 */
require("dotenv").config();

const required = ["ADMIN_USERNAME", "ADMIN_PASSWORD_HASH", "JWT_SECRET"];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(
      `Falta la variable de entorno ${key}. Ejecuta "npm run generar-hash" para crear ` +
        `ADMIN_PASSWORD_HASH, y añade ADMIN_USERNAME y JWT_SECRET a tu .env (ver .env.example).`
    );
  }
}

module.exports = {
  adminUsername: process.env.ADMIN_USERNAME,
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH,
  jwtSecret: process.env.JWT_SECRET,
  tokenExpiresIn: "7d",
  cookieName: "session_token",
};
