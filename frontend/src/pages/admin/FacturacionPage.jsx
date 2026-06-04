import { useEffect, useMemo, useState, memo } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { useDebounce } from '../../hooks/useDebounce';
import {
  Receipt, Download, RefreshCw, Search, Save, X, CheckCircle2,
  AlertTriangle, Clock, Ban, Plus, ChevronDown, BarChart3, Upload, FileDown
} from 'lucide-react';

const ESTADOS = ['Pendiente', 'Pagada', 'Vencida', 'Anulada'];

function money(value) {
  return Number(value || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function toDateInput(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

function fromDateInput(value) {
  return value ? new Date(`${value}T00:00:00Z`).toISOString() : null;
}

function estadoClass(estado) {
  if (estado === 'Pagada') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (estado === 'Vencida') return 'bg-red-50 text-red-700 border-red-200';
  if (estado === 'Anulada') return 'bg-surface-100 text-surface-600 border-surface-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
}

function estadoIcon(estado) {
  if (estado === 'Pagada') return CheckCircle2;
  if (estado === 'Vencida') return AlertTriangle;
  if (estado === 'Anulada') return Ban;
  return Clock;
}

async function downloadFactura(url, filename) {
  const response = await api.get(url, { responseType: 'blob' });
  const blobUrl = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
}

function exportFacturas(facturas, filtroEstado = '') {
  const filtered = filtroEstado ? facturas.filter(f => f.estado === filtroEstado) : facturas;
  const dataStr = JSON.stringify(filtered, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `facturas-${filtroEstado || 'todas'}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function importFacturas(file, onSave) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const facturas = JSON.parse(e.target.result);
        if (!Array.isArray(facturas)) throw new Error('El archivo debe contener un array de facturas');
        
        let imported = 0;
        for (const factura of facturas) {
          try {
            const { id, ...data } = factura;
            await onSave(id, data);
            imported++;
          } catch (err) {
            console.error('Error importing factura:', err);
          }
        }
        resolve({ imported, total: facturas.length });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function FacturaCard({ factura, onEdit, isAdmin }) {
  const Icon = estadoIcon(factura.estado);
  return (
    <div className="card-base p-6 sm:p-7 bg-gradient-to-br from-white to-surface-50 border-2 border-surface-100 hover:border-casatic-200 hover:shadow-lg transition-colors group">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-widest text-casatic-600 font-bold mb-1">Empresa</p>
            <h3 className="text-xl font-bold text-surface-900 mb-2.5 truncate group-hover:text-casatic-700 transition-colors">{factura.socioNombre || 'Sin empresa'}</h3>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold bg-casatic-100 text-casatic-700 px-3 py-1.5 rounded-lg ring-1 ring-casatic-200">
                {factura.numero}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border-2 ${estadoClass(factura.estado)}`}>
                <Icon size={14} /> {factura.estado}
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs uppercase tracking-widest text-surface-400 font-bold mb-1">Total</p>
            <p className="text-2xl font-extrabold text-casatic-700">{money(factura.total)}</p>
          </div>
        </div>
        <div className="bg-surface-50 rounded-lg p-4 border border-surface-100">
          <p className="text-sm font-semibold text-surface-900 mb-3">{factura.descripcion}</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-surface-500 font-medium mb-0.5">Plan</p>
              <p className="font-bold text-surface-800">{factura.planNombre}</p>
            </div>
            <div>
              <p className="text-surface-500 font-medium mb-0.5">Período</p>
              <p className="font-bold text-surface-800">{factura.planPeriodo}</p>
            </div>
            <div>
              <p className="text-surface-500 font-medium mb-0.5">Vence</p>
              <p className="font-bold text-surface-800">{toDateInput(factura.fechaVencimiento)}</p>
            </div>
            <div>
              <p className="text-surface-500 font-medium mb-0.5">DTE</p>
              <p className="font-bold text-surface-800">{factura.selloRecepcion ? 'Con sello' : 'Interna'}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-casatic-50 to-casatic-100/50 rounded-lg p-4 border border-casatic-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-casatic-600 font-bold uppercase tracking-wider mb-1">Desglose</p>
            <p className="text-sm text-surface-700 font-medium">Subtotal: <span className="font-bold text-surface-900">{money(factura.subtotal || 0)}</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-casatic-600 font-bold uppercase tracking-wider mb-1">IVA</p>
            <p className="text-lg font-extrabold text-casatic-700">{money(factura.iva || 0)}</p>
          </div>
        </div>

        {factura.numeroControl && (
          <div className="text-xs font-mono text-surface-500 bg-surface-100 p-2.5 rounded-lg truncate ring-1 ring-surface-200">
            {factura.numeroControl}
          </div>
        )}

        <div className="flex gap-2.5 pt-2">
          {isAdmin && (
            <button onClick={() => onEdit(factura)} className="flex-1 px-4 py-2.5 bg-casatic-500 hover:bg-casatic-600 text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg">
              <Save size={16} className="inline mr-2" /> Editar
            </button>
          )}
          <button
            onClick={() => downloadFactura(
              isAdmin ? `/facturacion/${factura.id}/descargar` : `/facturacion/mi-factura/${factura.id}/descargar`,
              `Factura-${factura.numero}.html`
            )}
            className="flex-1 px-4 py-2.5 bg-surface-200 hover:bg-surface-300 text-surface-800 font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <Download size={16} className="inline mr-2" /> Descargar
          </button>
        </div>
      </div>
    </div>
  );
}

const MemoFacturaCard = memo(FacturaCard);

function FacturaForm({ factura, planes, socios, onSave, onCancel }) {
  const isNew = !factura.id;
  const [form, setForm] = useState(() => ({
    socioId: factura.socioId || socios[0]?.id || '',
    tipoDocumento: factura.tipoDocumento || 'Factura interna',
    codigoGeneracion: factura.codigoGeneracion || '',
    numeroControl: factura.numeroControl || '',
    selloRecepcion: factura.selloRecepcion || '',
    ambiente: factura.ambiente || 'Produccion',
    condicionOperacion: factura.condicionOperacion || 'Credito',
    formaPago: factura.formaPago || 'Transferencia',
    referenciaPago: factura.referenciaPago || '',
    planNombre: factura.planNombre || planes[1]?.nombre || planes[0]?.nombre || 'Socios Miembros',
    planPeriodo: factura.planPeriodo || planes[1]?.periodo || 'anual',
    descripcion: factura.descripcion || planes[1]?.descripcion || 'Membresia CASATIC',
    subtotal: factura.subtotal ?? planes[1]?.montoSugerido ?? 400,
    estado: factura.estado || 'Pendiente',
    fechaEmision: toDateInput(factura.fechaEmision || new Date().toISOString()),
    fechaVencimiento: toDateInput(factura.fechaVencimiento || new Date(Date.now() + 30 * 86400000).toISOString()),
    fechaPago: toDateInput(factura.fechaPago),
    notas: factura.notas || '',
  }));
  const [saving, setSaving] = useState(false);

  const applyPlan = (nombre) => {
    const plan = planes.find(p => p.nombre === nombre);
    if (!plan) return setForm(prev => ({ ...prev, planNombre: nombre }));
    setForm(prev => ({
      ...prev,
      planNombre: plan.nombre,
      planPeriodo: plan.periodo,
      descripcion: plan.descripcion,
      subtotal: plan.montoSugerido,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(factura.id, {
      ...form,
      subtotal: Number(form.subtotal),
      fechaEmision: fromDateInput(form.fechaEmision),
      fechaVencimiento: fromDateInput(form.fechaVencimiento),
      fechaPago: form.estado === 'Pagada' ? fromDateInput(form.fechaPago || form.fechaEmision) : null,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-surface-100 overflow-hidden">
        {/* Header Premium */}
        <div className="bg-gradient-to-r from-casatic-600 via-casatic-500 to-casatic-400 px-8 py-6 flex items-center justify-between border-b border-casatic-300">
          <div>
            <h2 className="font-bold text-white text-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                {isNew ? <Plus size={18} className="text-white" /> : <Save size={18} className="text-white" />}
              </div>
              {isNew ? 'Nueva factura' : `Editar factura ${factura.numero}`}
            </h2>
            <p className="text-sm text-casatic-100 mt-1">{isNew ? 'Selecciona el socio y define el plan' : factura.socioNombre}</p>
          </div>
          <button type="button" onClick={onCancel} className="p-2 hover:bg-white/20 rounded-xl transition-all">
            <X size={22} className="text-white" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[calc(75vh-120px)] overflow-y-auto">
          {/* Section 1: Cliente */}
          {isNew && (
            <div className="md:col-span-2 p-4 bg-gradient-to-br from-casatic-50 to-casatic-100/50 rounded-2xl border border-casatic-200">
              <label className="input-label text-casatic-700 font-bold mb-3">Cliente / Socio</label>
              <select value={form.socioId} onChange={(e) => setForm({ ...form, socioId: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-casatic-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-casatic-400 focus:border-transparent" required>
                <option value="" disabled>Seleccionar socio</option>
                {socios.map(socio => <option key={socio.id} value={socio.id}>{socio.nombreEmpresa}</option>)}
              </select>
            </div>
          )}

          {/* Section 2: Plan y Período */}
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200">
            <label className="input-label text-emerald-700 font-bold mb-3">Plan</label>
            <select value={form.planNombre} onChange={(e) => applyPlan(e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-emerald-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent">
              {planes.map(plan => <option key={plan.nombre} value={plan.nombre}>{plan.nombre}</option>)}
            </select>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200">
            <label className="input-label text-blue-700 font-bold mb-3">Período</label>
            <input value={form.planPeriodo} onChange={(e) => setForm({ ...form, planPeriodo: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
          </div>

          {/* Section 3: Estado y Fechas */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200">
            <label className="input-label text-purple-700 font-bold mb-3">Estado</label>
            <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-purple-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent\">
              {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          <div>
            <label className="input-label font-bold mb-2">Emisión</label>
            <input type="date" value={form.fechaEmision} onChange={(e) => setForm({ ...form, fechaEmision: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-surface-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-casatic-400 focus:border-transparent\" />
          </div>

          <div>
            <label className="input-label font-bold mb-2">Vencimiento</label>
            <input type="date" value={form.fechaVencimiento} onChange={(e) => setForm({ ...form, fechaVencimiento: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-surface-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-casatic-400 focus:border-transparent\" />
          </div>

          {/* Section 4: Montos */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl border border-amber-200 md:col-span-2">
            <label className="input-label text-amber-700 font-bold mb-3">Monto</label>
            <input type="number" min="0" step="0.01" value={form.subtotal} onChange={(e) => setForm({ ...form, subtotal: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent\" />
          </div>

          {/* Section 5: Detalles Técnicos */}
          <div>
            <label className="input-label font-bold mb-2">Tipo Documento</label>
            <input value={form.tipoDocumento} onChange={(e) => setForm({ ...form, tipoDocumento: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-casatic-400 focus:border-transparent\" />
          </div>

          <div>
            <label className="input-label font-bold mb-2">Ambiente</label>
            <select value={form.ambiente} onChange={(e) => setForm({ ...form, ambiente: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-surface-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-casatic-400 focus:border-transparent\">
              <option value="Produccion\">Produccion</option>
              <option value="Pruebas\">Pruebas</option>
            </select>
          </div>

          <div>
            <label className="input-label font-bold mb-2">Condición</label>
            <select value={form.condicionOperacion} onChange={(e) => setForm({ ...form, condicionOperacion: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-surface-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-casatic-400 focus:border-transparent\">
              <option value="Credito\">Crédito</option>
              <option value="Contado\">Contado</option>
              <option value="Otro\">Otro</option>
            </select>
          </div>

          <div>
            <label className="input-label font-bold mb-2">Forma de Pago</label>
            <input value={form.formaPago} onChange={(e) => setForm({ ...form, formaPago: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-casatic-400 focus:border-transparent\" />
          </div>

          {/* Section 6: DTE y Control */}
          <div className="md:col-span-2">
            <label className="input-label font-bold mb-2">Descripción</label>
            <input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-casatic-400 focus:border-transparent\" />
          </div>

          <div>
            <label className="input-label font-bold mb-2">Código Generación</label>
            <input value={form.codigoGeneracion} onChange={(e) => setForm({ ...form, codigoGeneracion: e.target.value })} placeholder="Automático si está vacío\" className="w-full px-4 py-3 bg-surface-50 border-2 border-surface-200 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-casatic-400 focus:border-transparent\" />
          </div>

          <div>
            <label className="input-label font-bold mb-2">Número Control</label>
            <input value={form.numeroControl} onChange={(e) => setForm({ ...form, numeroControl: e.target.value })} placeholder="Automático si está vacío\" className="w-full px-4 py-3 bg-surface-50 border-2 border-surface-200 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-casatic-400 focus:border-transparent\" />
          </div>

          <div className="md:col-span-2">
            <label className="input-label font-bold mb-2">Sello Hacienda</label>
            <input value={form.selloRecepcion} onChange={(e) => setForm({ ...form, selloRecepcion: e.target.value })} placeholder="Cuando Hacienda otorgue\" className="w-full px-4 py-3 bg-surface-50 border-2 border-surface-200 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-casatic-400 focus:border-transparent\" />
          </div>

          <div className="md:col-span-2">
            <label className="input-label font-bold mb-2">Referencia Pago</label>
            <input value={form.referenciaPago} onChange={(e) => setForm({ ...form, referenciaPago: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-casatic-400 focus:border-transparent\" />
          </div>

          <div className="md:col-span-2">
            <label className="input-label font-bold mb-2">Notas</label>
            <textarea rows="3" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-casatic-400 focus:border-transparent\" />
          </div>

          <div className="md:col-span-2 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100 px-5 py-4 text-sm text-amber-900 font-medium">
            Para que sea DTE fiscal debe estar firmado electrónicamente, transmitido a Hacienda y contar con sello de recepción. Sin sello, el archivo descargado se marca como factura interna.
          </div>
        </div>

        {/* Actions Footer */}
        <div className="px-8 py-5 bg-gradient-to-r from-surface-50 to-white border-t border-surface-100 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-surface-200 hover:bg-surface-300 text-surface-800 font-bold rounded-lg transition-all shadow-md hover:shadow-lg">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-casatic-500 hover:bg-casatic-600 disabled:opacity-60 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
            <Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function FacturacionPage() {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'Admin';
  const [facturas, setFacturas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [socios, setSocios] = useState([]);
  const [selectedSocioId, setSelectedSocioId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(null);
  const [filterEstado, setFilterEstado] = useState('');
  const [exportEstado, setExportEstado] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const requests = [
        api.get('/facturacion/planes'),
        isAdmin ? api.get('/facturacion') : api.get('/facturacion/mi-factura'),
      ];
      if (isAdmin) requests.push(api.get('/socios'));
      const [planesRes, facturasRes, sociosRes] = await Promise.all(requests);
      setPlanes(planesRes.data);
      setFacturas(isAdmin ? facturasRes.data : (Array.isArray(facturasRes.data) ? facturasRes.data : [facturasRes.data]));
      if (isAdmin) setSocios(sociosRes.data);
    } catch (err) {
      console.error('Error cargando facturacion:', err);
      setError(err?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [isAdmin]);

  const selectedSocio = useMemo(
    () => socios.find(s => s.id === selectedSocioId),
    [selectedSocioId, socios]
  );

  const filtered = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    return facturas
      .filter(f => !selectedSocioId || f.socioId === selectedSocioId)
      .filter(f => !filterEstado || f.estado === filterEstado)
      .filter(f =>
        f.socioNombre?.toLowerCase().includes(term) ||
        f.numero?.toLowerCase().includes(term) ||
        f.descripcion?.toLowerCase().includes(term)
      );
  }, [facturas, debouncedSearch, selectedSocioId, filterEstado]);

  const stats = useMemo(() => {
    const base = selectedSocioId ? facturas.filter(f => f.socioId === selectedSocioId) : facturas;
    return {
      total: base.reduce((sum, f) => sum + (f.total || 0), 0),
      pagadas: base.filter(f => f.estado === 'Pagada').reduce((sum, f) => sum + (f.total || 0), 0),
      vencidas: base.filter(f => f.estado === 'Vencida').reduce((sum, f) => sum + (f.total || 0), 0),
      pendientes: base.filter(f => f.estado === 'Pendiente').reduce((sum, f) => sum + (f.total || 0), 0),
      count: base.length,
    };
  }, [facturas, selectedSocioId]);

  const save = async (id, payload) => {
    if (id) {
      await api.put(`/facturacion/${id}`, payload);
    } else {
      await api.post('/facturacion', payload);
    }
    setEditing(null);
    await load();
  };

  const generar = async () => {
    await api.post('/facturacion/generar-todas');
    await load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-casatic-200 border-t-casatic-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-base p-6 text-center">
        <h3 className="text-lg font-bold text-surface-700">Error</h3>
        <p className="text-sm text-surface-500 mt-2">{String(error)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-casatic-600 via-casatic-500 to-casatic-400 rounded-3xl p-6 mb-8 shadow-lg border border-casatic-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-2 ring-white/30 shadow-lg">
              <Receipt size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Facturación</h1>
              <p className="text-sm text-casatic-100 font-medium mt-0.5">
                {isAdmin
                  ? selectedSocio
                    ? `Facturas de ${selectedSocio.nombreEmpresa}`
                    : `${facturas.length} facturas de socios`
                  : 'Factura de membresía'}
              </p>
            </div>
          </div>
          {isAdmin && (
            <div className="flex flex-wrap gap-2 self-start sm:self-auto">
            <button onClick={() => setEditing({})} className="px-4 py-2 bg-white text-casatic-600 font-bold rounded-lg hover:bg-casatic-50 transition-colors shadow-lg hover:shadow-xl">
              <Plus size={18} className="inline mr-2" /> Nueva
            </button>
            <button onClick={generar} className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-colors backdrop-blur-sm">
                <RefreshCw size={18} className="inline mr-2" /> Generar
              </button>
              <button 
                onClick={() => {
                  setExportEstado('');
                  const modal = document.getElementById('export-modal');
                  if (modal) modal.showModal();
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <FileDown size={18} className="inline mr-2" /> Exportar
              </button>
              <label className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg cursor-pointer">
                <Upload size={18} className="inline mr-2" /> Importar
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const result = await importFacturas(file, save);
                      alert(`Importadas ${result.imported} de ${result.total} facturas`);
                      await load();
                    } catch (err) {
                      alert(`Error: ${err.message}`);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="space-y-4">
        {/* Premium Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Total */}
            <div className="card-base p-5 bg-gradient-to-br from-casatic-50 to-white border-2 border-casatic-200 hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-casatic-600">Total</p>
                <div className="w-8 h-8 bg-casatic-100 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform text-casatic-600 font-bold">$</div>
              </div>
              <p className="text-2xl font-bold text-casatic-700">{money(stats.total)}</p>
              <p className="text-xs text-surface-500 mt-2 font-medium">{stats.count} factura{stats.count !== 1 ? 's' : ''}</p>
            </div>
            
            {/* Pagadas */}
            <div className="card-base p-5 bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Pagadas</p>
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"><CheckCircle2 size={16} className="text-emerald-600" /></div>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{money(stats.pagadas)}</p>
              <p className="text-xs text-surface-500 mt-2">Completadas</p>
            </div>
            
            {/* Vencidas */}
            <div className="card-base p-5 bg-gradient-to-br from-red-50 to-white border-2 border-red-200 hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-red-600">Vencidas</p>
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"><AlertTriangle size={16} className="text-red-600" /></div>
              </div>
              <p className="text-2xl font-bold text-red-600">{money(stats.vencidas)}</p>
              <p className="text-xs text-surface-500 mt-2">Requieren atención</p>
            </div>
            
            {/* Pendientes */}
            <div className="card-base p-5 bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Pendientes</p>
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"><Clock size={16} className="text-amber-600" /></div>
              </div>
              <p className="text-2xl font-bold text-amber-600">{money(stats.pendientes)}</p>
              <p className="text-xs text-surface-500 mt-2">En proceso</p>
            </div>
          </div>

          {/* Selector de socio */}
          {isAdmin && (
            <div className="card-base p-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-surface-700 mb-1">Socio</label>
                  <div className="relative">
                    <select
                      value={selectedSocioId}
                      onChange={(e) => setSelectedSocioId(e.target.value)}
                      className="input-field pr-10 appearance-none"
                    >
                      <option value="">Todos los socios</option>
                      {socios.map((socio) => (
                        <option key={socio.id} value={socio.id}>{socio.nombreEmpresa}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                  </div>
                </div>

                {selectedSocioId && (
                  <button
                    type="button"
                    onClick={() => setSelectedSocioId('')}
                    className="btn-secondary"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              <p className="text-xs text-surface-500 mt-3">
                {selectedSocio
                  ? `Mostrando ${facturas.filter(f => f.socioId === selectedSocioId).length} facturas de ${selectedSocio.nombreEmpresa}`
                  : `Mostrando todas las facturas de ${socios.length} socios`}
              </p>
            </div>
          )}
          {/* Premium Filters & Search */}
          <div className="card-base p-6 bg-gradient-to-r from-surface-50 to-white border-2 border-surface-100 rounded-2xl">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              {/* Search */}
              <div className="flex-1 min-w-[220px] relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-casatic-400 group-focus-within:text-casatic-600 transition-colors" />
                </div>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar empresa, número, descripción..."
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-surface-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-casatic-400 focus:border-transparent transition-all"
                />
              </div>
              
              {/* Status Filter */}
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-4 py-3 bg-white border-2 border-surface-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-casatic-400 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="">Todos los estados</option>
                {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              
              {/* Results badge */}
              <span className="px-4 py-3 bg-casatic-100 text-casatic-700 font-bold rounded-xl text-sm whitespace-nowrap ring-2 ring-casatic-200">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filtered.map(factura => (
          <MemoFacturaCard key={factura.id} factura={factura} onEdit={setEditing} isAdmin={isAdmin} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card-base py-24 text-center border-2 border-dashed border-surface-200 rounded-2xl bg-gradient-to-b from-surface-50 to-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-surface-200 rounded-2xl mb-4">
            <Receipt size={32} className="text-surface-400" />
          </div>
          <h3 className="text-xl font-bold text-surface-800 mb-2">Sin facturas</h3>
          <p className="text-sm text-surface-600 max-w-xs mx-auto">
            {debouncedSearch || filterEstado ? 'No hay registros que coincidan con los filtros aplicados.' : 'No hay facturas registradas aún.'}
          </p>
          {(debouncedSearch || filterEstado) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterEstado('');
              }}
              className="px-6 py-2.5 bg-casatic-500 hover:bg-casatic-600 text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {editing && (
        <FacturaForm factura={editing} planes={planes} socios={socios} onSave={save} onCancel={() => setEditing(null)} />
      )}

      <dialog id="export-modal" className="p-0 rounded-3xl max-w-sm w-full shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm">
        <div className="bg-gradient-to-r from-casatic-600 via-casatic-500 to-casatic-400 px-8 py-6 flex items-center justify-between border-b border-casatic-300">
          <h2 className="font-bold text-white text-xl">Exportar Facturas</h2>
          <button 
            onClick={() => document.getElementById('export-modal').close()}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-surface-700 mb-2">Filtrar por estado:</label>
            <select
              value={exportEstado}
              onChange={(e) => setExportEstado(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-surface-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-casatic-400"
            >
              <option value="">Todas las facturas</option>
              {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded text-sm text-blue-800">
            Se descargarán {exportEstado ? facturas.filter(f => f.estado === exportEstado).length : facturas.length} facturas en formato JSON
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => document.getElementById('export-modal').close()}
              className="flex-1 px-4 py-2 bg-surface-200 hover:bg-surface-300 text-surface-800 font-bold rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                exportFacturas(facturas, exportEstado);
                document.getElementById('export-modal').close();
              }}
              className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors"
            >
              Descargar
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
