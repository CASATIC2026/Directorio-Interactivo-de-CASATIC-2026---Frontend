import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(__dirname, '../backend/docker script/current-data.sql');
const out = path.resolve(
  __dirname,
  '../backend/docker script/railway-import-users-facturas.sql'
);

function extractInserts(sql, table) {
  const prefix = `INSERT INTO public.${table}`;
  const statements = [];
  let current = '';
  for (const line of sql.split('\n')) {
    const trimmed = line.trim();
    if (!current && !trimmed.startsWith(prefix)) continue;
    current += (current ? '\n' : '') + line;
    if (trimmed.endsWith(');')) {
      statements.push(current);
      current = '';
    }
  }
  return statements;
}

const raw = fs.readFileSync(source, 'utf8');
const usuarios = extractInserts(raw, 'usuarios');
const facturas = extractInserts(raw, 'facturas');

const header = `-- Usuarios (${usuarios.length}) y facturas (${facturas.length}) desde current-data.sql
BEGIN;
DELETE FROM logs_actividad;
DELETE FROM facturas;
DELETE FROM usuarios;
`;

const footer = '\nCOMMIT;\n';
const body = [...usuarios, ...facturas].join('\n');
fs.writeFileSync(out, header + body + footer, 'utf8');
console.log(`Wrote ${out}`);
console.log(`  usuarios: ${usuarios.length}`);
console.log(`  facturas: ${facturas.length}`);
