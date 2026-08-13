/**
 * Genera el hash bcrypt de una contraseña, para usarlo como
 * ADMIN_PASSWORD_HASH en tus variables de entorno (local o Vercel).
 * La contraseña en texto plano nunca se guarda en ningún sitio -
 * solo se usa aquí, una vez, para calcular el hash.
 *
 * Uso:
 *   node scripts/generar-hash-password.js "TuContraseñaSegura123!"
 */
const bcrypt = require("bcryptjs");

const password = process.argv[2];
if (!password) {
  console.error('Uso: node scripts/generar-hash-password.js "TuContraseña"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\nAñade esto a tu .env (local) o a las variables de entorno de Vercel:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
