/**
 * Importa los 73 socios reales desde backend/docker script/current-data.sql
 * a la base de datos PostgreSQL indicada en DATABASE_URL.
 *
 * Uso: node scripts/import-real-socios.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.resolve(
  __dirname,
  '../backend/docker script/current-data.sql'
);

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL es requerida');
  process.exit(1);
}

const raw = fs.readFileSync(sqlPath, 'utf8');

/** Agrupa INSERT que ocupan varias líneas (p. ej. descripción de CASATIC). */
function extractSociosInserts(sql) {
  const statements = [];
  let current = '';
  for (const line of sql.split('\n')) {
    const trimmed = line.trim();
    if (!current && !trimmed.startsWith('INSERT INTO public.socios')) continue;
    current += (current ? '\n' : '') + line;
    if (trimmed.endsWith(');')) {
      statements.push(current);
      current = '';
    }
  }
  return statements;
}

const inserts = extractSociosInserts(raw);

if (inserts.length !== 73) {
  console.error(`Se esperaban 73 INSERT de socios, se encontraron ${inserts.length}`);
  process.exit(1);
}

const client = new pg.Client({ connectionString });
await client.connect();

try {
  await client.query('BEGIN');

  await client.query(`
    DELETE FROM logs_actividad;
    DELETE FROM formularios_contacto;
    DELETE FROM facturas;
    DELETE FROM eventos;
    DELETE FROM usuarios WHERE "Email" <> 'admin@casatic.sv';
    DELETE FROM socios;
  `);

  for (const statement of inserts) {
    await client.query(statement);
  }

  await client.query('COMMIT');

  const { rows } = await client.query('SELECT COUNT(*)::int AS n FROM socios');
  const sample = await client.query(
    'SELECT "NombreEmpresa" FROM socios ORDER BY "NombreEmpresa" LIMIT 5'
  );

  console.log(JSON.stringify({ socios: rows[0].n, sample: sample.rows }, null, 2));
} catch (err) {
  await client.query('ROLLBACK');
  console.error('Importación fallida:', err.message);
  process.exit(1);
} finally {
  await client.end();
}
