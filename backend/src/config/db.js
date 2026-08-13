const { Pool } = require("pg");
require("dotenv").config();

// La integración oficial Vercel <-> Supabase inyecta la cadena de conexión
// como POSTGRES_URL; si prefieres configurarla a mano (local, u otra),
// se usa SUPABASE_DB_URL. Se acepta cualquiera de las dos, en ese orden.
const connectionString = process.env.SUPABASE_DB_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "Falta la cadena de conexión a la base de datos. Define SUPABASE_DB_URL " +
      "(local, ver .env.example) o conecta la integración Vercel-Supabase, " +
      "que inyecta POSTGRES_URL automáticamente."
  );
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
