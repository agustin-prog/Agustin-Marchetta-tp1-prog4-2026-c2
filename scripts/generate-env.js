/* Genera src/environments/environments.ts a partir de variables de entorno.
   - En local: si el archivo ya existe (gitignored) y no hay env vars, no toca nada.
   - En Vercel/CI: el archivo no existe (no se commitea) y se genera desde
     SUPABASE_URL y SUPABASE_ANON_KEY configuradas en el proyecto. */
const fs = require("fs");
const path = require("path");

const destino = path.join(__dirname, "..", "src", "environments", "environments.ts");
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (fs.existsSync(destino) && !url) {
  console.log("generate-env: archivo local existente, no se modifica.");
  process.exit(0);
}

if (!url || !key) {
  console.error("generate-env: faltan SUPABASE_URL o SUPABASE_ANON_KEY en las variables de entorno.");
  process.exit(1);
}

fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(
  destino,
  `export const environments = {
    production: true,
    supabaseUrl: "${url}",
    supabaseAnonkey: "${key}"
};
`
);
console.log("generate-env: environments.ts generado correctamente.");