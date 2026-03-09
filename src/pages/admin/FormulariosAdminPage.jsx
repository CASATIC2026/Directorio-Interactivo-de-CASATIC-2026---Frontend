import { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Mail, Search, CalendarDays, Building2, RefreshCw,
  Inbox, ChevronDown, ChevronUp, Eye, X, MailOpen, MailCheck
} from 'lucide-react';

function formatDate(iso) {
  return new Date(iso).toLocaleString('es-SV', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function RowSkeleton() {
  return (
    <tr>
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 skeleton rounded w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

function DetailModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-elevated w-full max-w-lg p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-bold text-surface-900">Detalle del mensaje</h2>
          <button onClick={onClose} className="btn-icon btn-ghost">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex gap-2">
            <span className="font-semibold text-surface-500 w-28 flex-shrink-0">Empresa:</span>
            <span className="text-surface-900">{item.nombreEmpresa || '—'}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-surface-500 w-28 flex-shrink-0">Remitente:</span>
            <span className="text-surface-900">{item.nombre}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-surface-500 w-28 flex-shrink-0">Correo:</span>
            <a href={`mailto:${item.correo}`} className="text-casatic-600 hover:underline">{item.correo}</a>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-surface-500 w-28 flex-shrink-0">Fecha:</span>
            <span className="text-surface-600">{formatDate(item.fecha)}</span>
          </div>
          <div>
            <span className="font-semibold text-surface-500 block mb-1">Mensaje:</span>
            <p className="bg-surface-50 rounded-xl p-4 text-surface-700 leading-relaxed whitespace-pre-wrap">
              {item.mensaje}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <a
            href={`mailto:${item.correo}?subject=Re: Consulta CASATIC`}
            className="btn-primary btn-sm"
          >
            <Mail size={14} /> Responder
          </a>
          <button onClick={onClose} className="btn-secondary btn-sm">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

const SORT_FIELDS = ['fecha', 'nombre', 'nombreEmpresa'];

export default function FormulariosAdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [sort, setSort] = useState({ field: 'fecha', dir: 'desc' });

  const toggleLeido = async (item) => {
    const nuevoEstado = !item.leido;
    // Actualizar optimista
    setItems((prev) => prev.map((f) => f.id === item.id ? { ...f, leido: nuevoEstado } : f));
    try {
      await api.patch(`/formulariocontacto/${item.id}/leido`, nuevoEstado, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      // Revertir si falla
      setItems((prev) => prev.map((f) => f.id === item.id ? { ...f, leido: item.leido } : f));
    }
  };

  const openDetail = async (item) => {
    setSelected(item);
    // Si no estaba leído, marcarlo automáticamente al abrir
    if (!item.leido) await toggleLeido(item);
  };

  // Date range: last 30 days by default
  const [desde, setDesde] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [hasta, setHasta] = useState(() => new Date().toISOString().split('T')[0]);

  const load = () => {
    setLoading(true);
    api
      .get('/formulariocontacto', { params: { desde: `${desde}T00:00:00`, hasta: `${hasta}T23:59:59` } })
      .then((res) => setItems(res.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleSort = (field) => {
    setSort((prev) =>
      prev.field === field ? { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { field, dir: 'desc' },
    );
  };

  const filtered = items
    .filter((f) => {
      const q = search.toLowerCase();
      return (
        !q ||
        f.nombre?.toLowerCase().includes(q) ||
        f.correo?.toLowerCase().includes(q) ||
        f.nombreEmpresa?.toLowerCase().includes(q) ||
        f.mensaje?.toLowerCase().includes(q)
      );
    })
    .slice()
    .sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1;
      const va = a[sort.field] ?? '';
      const vb = b[sort.field] ?? '';
      return dir * String(va).localeCompare(String(vb));
    });

  const SortIcon = ({ field }) => {
    if (sort.field !== field) return null;
    return sort.dir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  };

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Formularios de Contacto</h1>
          <p className="text-sm text-surface-500 mt-0.5">Mensajes recibidos a través del directorio</p>
        </div>
        <button onClick={load} className="btn-secondary btn-sm self-start sm:self-auto">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      {/* ── Filtros ─────────────────────────────────────── */}
      <div className="card-base p-4 flex flex-wrap gap-3">
        {/* Buscar texto */}
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo, empresa…"
            className="input-field pl-9 text-sm"
          />
        </div>
        {/* Rango fechas */}
        <div className="flex items-center gap-2 text-sm flex-shrink-0">
          <CalendarDays size={15} className="text-surface-400" />
          <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="input-field py-1.5 text-sm" />
          <span className="text-surface-400">–</span>
          <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="input-field py-1.5 text-sm" />
          <button onClick={load} className="btn-primary btn-sm">Filtrar</button>
        </div>
      </div>

      {/* ── Tabla ───────────────────────────────────────── */}
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 bg-surface-50">
                {[
                  { field: 'fecha', label: 'Fecha' },
                  { field: 'nombreEmpresa', label: 'Empresa' },
                  { field: 'nombre', label: 'Remitente' },
                  { field: 'correo', label: 'Correo' },
                ].map(({ field, label }) => (
                  <th
                    key={field}
                    onClick={() => toggleSort(field)}
                    className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-400 cursor-pointer hover:text-surface-700 transition-colors"
                  >
                    <span className="inline-flex items-center gap-1">
                      {label} <SortIcon field={field} />
                    </span>
                  </th>
                ))}
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-400">Mensaje</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-400">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {loading ? (
                [...Array(6)].map((_, i) => <RowSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-surface-400">
                    <div className="flex flex-col items-center gap-3">
                      <Inbox size={32} className="text-surface-300" />
                      <span className="text-sm">
                        {search ? 'No hay resultados para la búsqueda' : 'No hay formularios en este período'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-50 transition-colors group">
                    <td className="px-4 py-3 whitespace-nowrap text-surface-500">{formatDate(item.fecha)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-surface-700">
                        <Building2 size={13} className="text-surface-400" />
                        {item.nombreEmpresa || <span className="italic text-surface-400">Sin empresa</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-surface-900">{item.nombre}</td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${item.correo}`} className="text-casatic-600 hover:underline">
                        {item.correo}
                      </a>
                    </td>
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className={`truncate ${item.leido ? 'text-surface-400' : 'text-surface-700 font-medium'}`}>{item.mensaje}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => toggleLeido(item)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                          item.leido
                            ? 'bg-surface-100 text-surface-400 hover:bg-surface-200'
                            : 'bg-casatic-50 text-casatic-600 hover:bg-casatic-100'
                        }`}
                        title={item.leido ? 'Marcar como no leído' : 'Marcar como leído'}
                      >
                        {item.leido ? <MailOpen size={12} /> : <MailCheck size={12} />}
                        {item.leido ? 'Leído' : 'Nuevo'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openDetail(item)}
                        className="btn-icon btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Ver detalle"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-surface-100 text-xs text-surface-400">
            {filtered.length} mensaje{filtered.length !== 1 ? 's' : ''} mostrado{filtered.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* ── Modal detalle ───────────────────────────────── */}
      <DetailModal item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
