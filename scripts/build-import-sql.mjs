import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(__dirname, '../backend/docker script/current-data.sql');
const out = path.resolve(__dirname, '../backend/docker script/railway-import-socios.sql');

const raw = fs.readFileSync(source, 'utf8');
let current = '';
const inserts = [];
for (const line of raw.split('\n')) {
  const trimmed = line.trim();
  if (!current && !trimmed.startsWith('INSERT INTO public.socios')) continue;
  current += (current ? '\n' : '') + line;
  if (trimmed.endsWith(');')) {
    inserts.push(current);
    current = '';
  }
}

const header = `-- Importación de ${inserts.length} socios reales
BEGIN;
DELETE FROM logs_actividad;
DELETE FROM formularios_contacto;
DELETE FROM facturas;
DELETE FROM eventos;
DELETE FROM usuarios WHERE "Email" <> 'admin@casatic.sv';
DELETE FROM socios;
`;

const footer = '\nCOMMIT;\n';
fs.writeFileSync(out, header + inserts.join('\n') + footer, 'utf8');
console.log(`Wrote ${out} (${inserts.length} inserts)`);
