const { createClient } = require("@libsql/client");
require("dotenv").config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error("Falta TURSO_DATABASE_URL. Configura la URL de tu base de datos Turso.");
}

const options = { url };
if (authToken) options.authToken = authToken;

module.exports = createClient(options);
