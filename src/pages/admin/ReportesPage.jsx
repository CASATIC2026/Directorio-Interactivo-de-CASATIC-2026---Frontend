import { useEffect, useState, useMemo, useRef } from 'react';
import api from '../../api/client';
import {
  BarChart2, Users, TrendingUp, TrendingDown, Mail, Search,
  AlertCircle, Loader2, Calendar, Building2, Activity,
  ArrowUpRight, ArrowDownRight, Eye, Clock, Download, Upload,
  ChevronDown, RefreshCw, FileText, UserCheck, UserX,
  CheckCircle2, XCircle, FileSpreadsheet
} from 'lucide-react';

/* ─── Helpers ────────────────────────────────────────────── */
function pct(current, previous) {
  if (!previous) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function formatNum(n) {
  if (n == null) return '—';
  return n.toLocaleString('es-SV');
}

/* ─── Skeleton Components ────────────────────────────────── */
function KpiSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-surface-100 p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-surface-100 rounded-xl" />
        <div className="w-16 h-5 bg-surface-100 rounded-full" />
      </div>
      <div className="w-20 h-8 bg-surface-100 rounded mb-1" />
      <div className="w-32 h-4 bg-surface-100 rounded" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-surface-100 p-6 animate-pulse">
      <div className="w-48 h-5 bg-surface-100 rounded mb-6" />
      <div className="flex items-end gap-1.5 h-40">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="flex-1 bg-surface-100 rounded-t" style={{ height: `${20 + Math.random() * 80}%` }} />
        ))}
      </div>
    </div>
  );
}

function TableSkeleton({ cols = 3, rows = 5 }) {
  return (
    <div className="bg-white rounded-2xl border border-surface-100 overflow-hidden animate-pulse">
      <div className="px-6 py-4 border-b border-surface-100">
        <div className="w-48 h-5 bg-surface-100 rounded" />
      </div>
      <div className="p-6 space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="flex-1 h-4 bg-surface-50 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── KPI Card ───────────────────────────────────────────── */
function KpiCard({ icon: Icon, label, value, trend, trendLabel, color = 'casatic', accent }) {
  const palettes = {
    casatic: { bg: 'bg-casatic-50', text: 'text-casatic-600', ring: 'ring-casatic-100' },
    green:   { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
    red:     { bg: 'bg-red-50',     text: 'text-red-600',     ring: 'ring-red-100' },
    yellow:  { bg: 'bg-amber-50',   text: 'text-amber-600',   ring: 'ring-amber-100' },
    purple:  { bg: 'bg-violet-50',  text: 'text-violet-600',  ring: 'ring-violet-100' },
    blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    ring: 'ring-blue-100' },
  };
  const p = palettes[color] || palettes.casatic;
  const isPositive = trend > 0;
  const isNeutral = trend === 0 || trend == null;

  return (
    <div className="bg-white rounded-2xl border border-surface-100 p-5 shadow-sm hover:shadow-card transition-shadow duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.bg} ${p.text} ring-1 ${p.ring}`}>
          <Icon size={19} />
        </div>
        {!isNeutral && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-surface-900 tracking-tight">{formatNum(value)}</p>
      <p className="text-sm text-surface-500 mt-0.5">{label}</p>
      {trendLabel && <p className="text-[11px] text-surface-400 mt-1">{trendLabel}</p>}
    </div>
  );
}

/* ─── Bar Chart ──────────────────────────────────────────── */
function BarChart({ data, label = 'Visitas', height = 180 }) {
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-surface-400">
        <BarChart2 size={32} className="mb-2 opacity-40" />
        <p className="text-sm">Sin datos para el período seleccionado</p>
      </div>
    );
  }

  const max = Math.max(...data.map(d => d.cantidad), 1);
  const step = Math.ceil(max / 4);
  const yLabels = [0, step, step * 2, step * 3, max].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="relative">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] text-surface-400 pointer-events-none">
        {yLabels.reverse().map((v) => <span key={v}>{v}</span>)}
      </div>
      {/* Chart area */}
      <div className="ml-10">
        {/* Grid lines */}
        <div className="absolute left-10 right-0 top-0 flex flex-col justify-between pointer-events-none" style={{ height }}>
          {yLabels.map((_, i) => (
            <div key={i} className="border-t border-surface-100 w-full" />
          ))}
        </div>
        {/* Bars */}
        <div className="flex items-end gap-[3px] relative" style={{ height }}>
          {data.map((d, i) => {
            const h = max ? (d.cantidad / max) * 100 : 2;
            const dayLabel = d.fecha?.slice(8);
            const monthLabel = d.fecha?.slice(5, 7);
            return (
              <div key={i} className="flex-1 flex flex-col items-center group relative">
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-900 text-white text-[10px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg pointer-events-none">
                  <span className="font-medium">{d.fecha?.slice(5)}</span>
                  <span className="text-surface-300 mx-1">·</span>
                  <span className="font-bold">{d.cantidad}</span> {label.toLowerCase()}
                </div>
                {/* Bar */}
                <div
                  className="w-full rounded-t-sm bg-gradient-to-t from-casatic-600 to-casatic-400 group-hover:from-casatic-700 group-hover:to-casatic-500 transition-all duration-200 cursor-pointer"
                  style={{ height: `${h}%`, minHeight: 2 }}
                />
              </div>
            );
          })}
        </div>
        {/* X-axis labels (show every 5th) */}
        <div className="flex mt-2">
          {data.map((d, i) => (
            <div key={i} className="flex-1 text-center">
              {(i % 5 === 0 || i === data.length - 1) && (
                <span className="text-[9px] text-surface-400">{d.fecha?.slice(5)}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Section Panel ──────────────────────────────────────── */
function Panel({ title, subtitle, icon: Icon, actions, children }) {
  return (
    <div className="bg-white rounded-2xl border border-surface-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-casatic-50 text-casatic-600 flex items-center justify-center flex-shrink-0">
              <Icon size={16} />
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-surface-800 truncate">{title}</h2>
            {subtitle && <p className="text-xs text-surface-400">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

/* ─── Data Table ─────────────────────────────────────────── */
function DataTable({ columns, rows, emptyIcon: EmptyIcon = FileText, emptyText = 'Sin datos' }) {
  if (!rows?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-surface-400">
        <div className="w-12 h-12 bg-surface-50 rounded-2xl flex items-center justify-center mb-3">
          <EmptyIcon size={22} className="opacity-50" />
        </div>
        <p className="text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-50/80">
            {columns.map((col) => (
              <th key={col.key} className={`text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider ${col.className || ''}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-50">
          {rows.map((row, idx) => (
            <tr key={row._key ?? idx} className="hover:bg-casatic-50/30 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className={`px-5 py-3.5 ${col.cellClass || ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Progress Bar (for Accesos) ─────────────────────────── */
function LoginBar({ email, count, maxCount }) {
  const width = maxCount ? (count / maxCount) * 100 : 0;
  return (
    <div className="flex items-center gap-4 px-6 py-3 hover:bg-casatic-50/30 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-casatic-50 text-casatic-600 flex items-center justify-center flex-shrink-0">
        <UserCheck size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-surface-800 truncate">{email}</span>
          <span className="text-sm font-bold text-casatic-600 ml-3">{count}</span>
        </div>
        <div className="w-full bg-surface-100 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-casatic-500 to-casatic-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function ReportesPage() {
  const [dashboard, setDashboard] = useState(null);
  const [busquedas, setBusquedas] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('general');
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);

  /* ── Exportar Excel ── */
  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get('/reportes/exportar-socios', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CASATIC_Socios_${new Date().toISOString().slice(0,10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Error al exportar el reporte.');
    } finally {
      setExporting(false);
    }
  };

  /* ── Importar Excel ── */
  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append('archivo', file);
      const res = await api.post('/reportes/importar-socios', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImportResult({ success: true, ...res.data });
      cargar(true);
    } catch (err) {
      setImportResult({
        success: false,
        message: err.response?.data?.message || 'Error al importar el archivo.',
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const cargar = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [dash, bus, form] = await Promise.all([
        api.get('/reportes/dashboard').then(r => r.data),
        api.get('/reportes/busquedas').then(r => r.data),
        api.get('/reportes/formularios').then(r => r.data),
      ]);
      setDashboard(dash);
      setBusquedas(bus);
      setFormularios(form);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar reportes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  /* ── Computed values ── */
  const visitasTotal = useMemo(() =>
    dashboard?.visitasDiarias?.reduce((s, d) => s + d.cantidad, 0) || 0,
  [dashboard]);

  const topBusquedas = useMemo(() => {
    const freq = {};
    busquedas.forEach(b => {
      const term = (b.query || '').toLowerCase().trim();
      if (term) freq[term] = (freq[term] || 0) + 1;
    });
    return Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([term, count]) => ({ term, count }));
  }, [busquedas]);

  /* ── Tabs config ── */
  const tabs = [
    { id: 'general',     label: 'Resumen',      icon: BarChart2 },
    { id: 'busquedas',   label: 'Búsquedas',    icon: Search    },
    { id: 'formularios', label: 'Formularios',   icon: Mail      },
    { id: 'accesos',     label: 'Accesos',       icon: Activity  },
  ];

  /* ── Loading state ── */
  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="animate-pulse flex items-center gap-3 mb-2">
        <div className="w-11 h-11 bg-surface-100 rounded-2xl" />
        <div><div className="w-32 h-6 bg-surface-100 rounded mb-1" /><div className="w-48 h-4 bg-surface-100 rounded" /></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
      </div>
      <ChartSkeleton />
      <TableSkeleton cols={4} />
    </div>
  );

  /* ── Error state ── */
  if (error) return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <AlertCircle size={22} className="text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-red-800 mb-1">Error al cargar reportes</h3>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <button onClick={() => cargar()} className="btn-primary btn-sm">
          <RefreshCw size={14} /> Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-in">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-casatic-500 to-casatic-700 rounded-2xl flex items-center justify-center shadow-lg shadow-casatic-500/20">
            <BarChart2 size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-surface-900 tracking-tight">Reportes y Métricas</h1>
            <p className="text-sm text-surface-400">Panel de análisis · Últimos 30 días</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="btn-secondary btn-sm"
          >
            {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {exporting ? 'Exportando…' : 'Descargar Excel'}
          </button>
          <button
            onClick={() => { setImportModal(true); setImportResult(null); }}
            className="btn-secondary btn-sm"
          >
            <Upload size={14} /> Importar Excel
          </button>
          <button
            onClick={() => cargar(true)}
            disabled={refreshing}
            className="btn-secondary btn-sm"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Actualizando…' : 'Actualizar'}
          </button>
        </div>
      </div>

      {/* ── Modal Importar Excel ───────────────────────── */}
      {importModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => !importing && setImportModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-5 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-casatic-50 rounded-xl flex items-center justify-center text-casatic-600">
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-surface-900">Importar Socios desde Excel</h3>
                <p className="text-xs text-surface-400">Archivo .xlsx · Máx 10 MB</p>
              </div>
            </div>

            <div className="bg-surface-50 rounded-xl p-4 text-xs text-surface-600 space-y-1">
              <p className="font-semibold text-surface-700 mb-1">Columnas esperadas:</p>
              <p><span className="font-medium text-casatic-600">Requerida:</span> NombreEmpresa</p>
              <p><span className="font-medium text-surface-500">Opcionales:</span> EmailContacto, Teléfono, Dirección, Descripción, Especialidades, Servicios, MarcasRepresenta, EstadoFinanciero, Habilitado, MapaUrl</p>
              <p className="text-surface-400 mt-2">Si el socio ya existe (por nombre), se actualizan sus datos.</p>
            </div>

            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx"
                onChange={handleImport}
                disabled={importing}
                className="block w-full text-sm text-surface-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-casatic-50 file:text-casatic-700 hover:file:bg-casatic-100 cursor-pointer disabled:opacity-50"
              />
            </div>

            {importing && (
              <div className="flex items-center gap-2 text-sm text-casatic-600">
                <Loader2 size={16} className="animate-spin" /> Procesando archivo…
              </div>
            )}

            {importResult && (
              <div className={`rounded-xl p-4 text-sm flex items-start gap-2 ${
                importResult.success
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {importResult.success ? <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" /> : <XCircle size={18} className="flex-shrink-0 mt-0.5" />}
                <div>
                  <p className="font-medium">{importResult.message}</p>
                  {importResult.errores?.length > 0 && (
                    <ul className="mt-2 space-y-0.5 text-xs text-red-600">
                      {importResult.errores.slice(0, 5).map((err, i) => <li key={i}>• {err}</li>)}
                      {importResult.errores.length > 5 && <li>…y {importResult.errores.length - 5} más</li>}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setImportModal(false)}
                disabled={importing}
                className="btn-ghost btn-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab Navigation ─────────────────────────────── */}
      <div className="bg-white rounded-xl border border-surface-100 p-1 flex gap-1 overflow-x-auto shadow-sm">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
              tab === t.id
                ? 'bg-casatic-600 text-white shadow-md shadow-casatic-600/20'
                : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* ═══ TAB: RESUMEN GENERAL ═══════════════════════ */}
      {tab === 'general' && (
        <div className="space-y-6">

          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              icon={Building2}
              label="Total socios"
              value={dashboard.totalSocios}
              color="casatic"
              trend={dashboard.sociosMesAnterior ? pct(dashboard.totalSocios, dashboard.totalSocios - dashboard.sociosMesAnterior) : null}
              trendLabel={`${dashboard.sociosMesAnterior} nuevos el mes pasado`}
            />
            <KpiCard
              icon={UserCheck}
              label="Socios activos"
              value={dashboard.sociosActivos}
              color="green"
              trendLabel="Al día con pagos"
            />
            <KpiCard
              icon={UserX}
              label="En mora"
              value={dashboard.sociosEnMora}
              color="red"
              trendLabel={`${dashboard.totalSocios ? Math.round((dashboard.sociosEnMora / dashboard.totalSocios) * 100) : 0}% del total`}
            />
            <KpiCard
              icon={Mail}
              label="Formularios recibidos"
              value={dashboard.formulariosMes}
              color="purple"
              trendLabel="Este mes"
            />
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <KpiCard
              icon={Eye}
              label="Visitas esta semana"
              value={dashboard.visitasSemana}
              color="blue"
            />
            <KpiCard
              icon={TrendingUp}
              label="Visitas este mes"
              value={dashboard.visitasMes}
              color="casatic"
              trend={dashboard.visitasSemana ? pct(dashboard.visitasMes, dashboard.visitasMes - dashboard.visitasSemana) : null}
            />
            <KpiCard
              icon={Search}
              label="Búsquedas este mes"
              value={dashboard.busquedasMes}
              color="yellow"
            />
          </div>

          {/* Chart + Top Búsquedas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart - 2/3 */}
            <div className="lg:col-span-2">
              <Panel
                title="Visitas diarias"
                subtitle="Últimos 30 días"
                icon={TrendingUp}
                actions={
                  <span className="text-xs text-surface-400 bg-surface-50 px-2.5 py-1 rounded-full">
                    Total: <span className="font-semibold text-surface-600">{formatNum(visitasTotal)}</span>
                  </span>
                }
              >
                <div className="p-6">
                  <BarChart data={dashboard.visitasDiarias} label="Visitas" height={180} />
                </div>
              </Panel>
            </div>

            {/* Top Búsquedas - 1/3 */}
            <Panel title="Top búsquedas" subtitle="Términos más buscados" icon={Search}>
              {topBusquedas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-surface-400">
                  <Search size={24} className="opacity-40 mb-2" />
                  <p className="text-sm">Sin búsquedas</p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {topBusquedas.map((b, i) => (
                    <div key={b.term} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-50 transition-colors">
                      <span className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center flex-shrink-0 ${
                        i === 0 ? 'bg-casatic-100 text-casatic-700' : 'bg-surface-100 text-surface-500'
                      }`}>
                        {i + 1}
                      </span>
                      <span className="text-sm text-surface-700 truncate flex-1">{b.term}</span>
                      <span className="text-xs font-semibold text-surface-400 bg-surface-50 px-2 py-0.5 rounded-full">{b.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>
        </div>
      )}

      {/* ═══ TAB: BÚSQUEDAS ════════════════════════════ */}
      {tab === 'busquedas' && (
        <Panel
          title={`${busquedas.length} búsquedas registradas`}
          subtitle="Últimos 30 días"
          icon={Search}
        >
          <DataTable
            emptyIcon={Search}
            emptyText="Sin búsquedas registradas en este período"
            columns={[
              {
                key: 'query',
                label: 'Término de búsqueda',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <Search size={14} className="text-surface-300 flex-shrink-0" />
                    <span className="font-medium text-surface-800">{row.query || '—'}</span>
                  </div>
                ),
              },
              {
                key: 'fecha',
                label: 'Fecha y hora',
                render: (row) => (
                  <span className="text-surface-500 flex items-center gap-1.5">
                    <Clock size={13} className="text-surface-300" />
                    {new Date(row.fecha).toLocaleString('es-SV', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                ),
              },
              {
                key: 'ip',
                label: 'Dirección IP',
                render: (row) => (
                  <span className="font-mono text-xs text-surface-400 bg-surface-50 px-2 py-0.5 rounded">{row.ip || '—'}</span>
                ),
              },
            ]}
            rows={busquedas.map((b, i) => ({ ...b, _key: i }))}
          />
        </Panel>
      )}

      {/* ═══ TAB: FORMULARIOS ══════════════════════════ */}
      {tab === 'formularios' && (
        <Panel
          title={`${formularios.length} formularios recibidos`}
          subtitle="Últimos 30 días"
          icon={Mail}
        >
          <DataTable
            emptyIcon={Mail}
            emptyText="Sin formularios recibidos en este período"
            columns={[
              {
                key: 'nombre',
                label: 'Remitente',
                render: (row) => (
                  <div>
                    <p className="font-medium text-surface-800">{row.nombre}</p>
                    <a href={`mailto:${row.correo}`} className="text-xs text-casatic-500 hover:text-casatic-700 transition-colors">{row.correo}</a>
                  </div>
                ),
              },
              {
                key: 'socio',
                label: 'Empresa destino',
                render: (row) => (
                  <span className={row.socio ? 'text-surface-700 font-medium' : 'text-surface-400'}>
                    {row.socio ? (
                      <span className="flex items-center gap-1.5"><Building2 size={13} className="text-surface-300" />{row.socio}</span>
                    ) : '—'}
                  </span>
                ),
              },
              {
                key: 'fecha',
                label: 'Fecha',
                render: (row) => (
                  <span className="text-surface-500 text-xs">
                    {new Date(row.fecha).toLocaleString('es-SV', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                ),
              },
              {
                key: 'mensaje',
                label: 'Mensaje',
                cellClass: 'max-w-[260px]',
                render: (row) => (
                  <p className="text-surface-500 text-xs truncate" title={row.mensaje}>{row.mensaje}</p>
                ),
              },
            ]}
            rows={formularios.map((f) => ({ ...f, _key: f.id }))}
          />
        </Panel>
      )}

      {/* ═══ TAB: ACCESOS ══════════════════════════════ */}
      {tab === 'accesos' && (
        <Panel
          title="Actividad de acceso"
          subtitle="Logins por usuario · Últimos 30 días"
          icon={Activity}
        >
          {!dashboard.loginsPorUsuario || Object.keys(dashboard.loginsPorUsuario).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-surface-400">
              <div className="w-12 h-12 bg-surface-50 rounded-2xl flex items-center justify-center mb-3">
                <Activity size={22} className="opacity-50" />
              </div>
              <p className="text-sm">Sin accesos registrados en este período</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-50 py-2">
              {Object.entries(dashboard.loginsPorUsuario)
                .sort(([, a], [, b]) => b - a)
                .map(([email, count]) => (
                  <LoginBar
                    key={email}
                    email={email}
                    count={count}
                    maxCount={Math.max(...Object.values(dashboard.loginsPorUsuario))}
                  />
                ))
              }
            </div>
          )}
        </Panel>
      )}

      {/* ── Footer note ────────────────────────────────── */}
      <p className="text-center text-xs text-surface-300 pb-4">
        Los datos se actualizan en tiempo real · Último refresh: {new Date().toLocaleString('es-SV')}
      </p>
    </div>
  );
}
