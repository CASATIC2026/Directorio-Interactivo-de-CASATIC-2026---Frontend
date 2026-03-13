import { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  BarChart2, Users, TrendingUp, Mail, Search,
  AlertCircle, Loader2, Calendar, Building2, Activity
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color = 'casatic' }) {
  const colors = {
    casatic: 'bg-casatic-50 text-casatic-600',
    green:   'bg-green-50 text-green-600',
    red:     'bg-red-50 text-red-600',
    yellow:  'bg-yellow-50 text-yellow-600',
    purple:  'bg-purple-50 text-purple-600',
  };
  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-5 flex items-start gap-4 shadow-sm">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-surface-900">{value ?? '—'}</p>
        <p className="text-sm font-medium text-surface-700">{label}</p>
        {sub && <p className="text-xs text-surface-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function MiniBar({ data }) {
  if (!data?.length) return <p className="text-sm text-surface-400 text-center py-6">Sin datos</p>;
  const max = Math.max(...data.map(d => d.cantidad));
  return (
    <div className="flex items-end gap-1 h-28 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
          <div
            className="w-full bg-casatic-500 rounded-sm transition-all hover:bg-casatic-600"
            style={{ height: max ? `${(d.cantidad / max) * 100}%` : '4%', minHeight: 3 }}
          />
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
            {d.fecha?.slice(5)}: {d.cantidad}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReportesPage() {
  const [dashboard, setDashboard] = useState(null);
  const [busquedas, setBusquedas] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('general');

  useEffect(() => {
    const cargar = async () => {
      try {
        const [dash, bus, form] = await Promise.all([
          api.get('/reportes/dashboard').then(r => r.data),
          api.get('/reportes/busquedas').then(r => r.data),
          api.get('/reportes/formularios').then(r => r.data),
        ]);
        setDashboard(dash);
        setBusquedas(bus);
        setFormularios(form);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar reportes');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 size={32} className="animate-spin text-casatic-500" />
    </div>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 text-sm border border-red-100">
        <AlertCircle size={18} /> {error}
      </div>
    </div>
  );

  const tabs = [
    { id: 'general',     label: 'General',     icon: BarChart2 },
    { id: 'busquedas',   label: 'Búsquedas',   icon: Search    },
    { id: 'formularios', label: 'Formularios',  icon: Mail      },
    { id: 'accesos',     label: 'Accesos',      icon: Activity  },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-casatic-100 rounded-2xl flex items-center justify-center">
          <BarChart2 size={22} className="text-casatic-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-surface-900">Reportes</h1>
          <p className="text-sm text-surface-500">Últimos 30 días</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-surface-200 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              tab === t.id
                ? 'border-casatic-500 text-casatic-600'
                : 'border-transparent text-surface-400 hover:text-surface-700'
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB GENERAL ── */}
      {tab === 'general' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard icon={Building2}    label="Total socios"         value={dashboard.totalSocios}      color="casatic" />
            <StatCard icon={Users}        label="Socios activos"       value={dashboard.sociosActivos}    color="green"   sub="Al día" />
            <StatCard icon={AlertCircle}  label="En mora"              value={dashboard.sociosEnMora}     color="red" />
            <StatCard icon={TrendingUp}   label="Visitas esta semana"  value={dashboard.visitasSemana}    color="purple" />
            <StatCard icon={TrendingUp}   label="Visitas este mes"     value={dashboard.visitasMes}       color="casatic" />
            <StatCard icon={Search}       label="Búsquedas este mes"   value={dashboard.busquedasMes}     color="yellow" />
            <StatCard icon={Mail}         label="Formularios este mes" value={dashboard.formulariosMes}   color="green" />
            <StatCard icon={Calendar}     label="Socios mes anterior"  value={dashboard.sociosMesAnterior} color="purple" />
          </div>

          <div className="bg-white rounded-2xl border border-surface-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-surface-700 mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-casatic-500" /> Visitas diarias (últimos 30 días)
            </h2>
            <MiniBar data={dashboard.visitasDiarias} />
            <p className="text-[10px] text-surface-300 text-right mt-2">Pasa el cursor para ver el detalle</p>
          </div>
        </div>
      )}

      {/* ── TAB BÚSQUEDAS ── */}
      {tab === 'busquedas' && (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100">
            <h2 className="text-sm font-semibold text-surface-700">{busquedas.length} búsquedas en los últimos 30 días</h2>
          </div>
          {busquedas.length === 0 ? (
            <p className="text-sm text-surface-400 text-center py-10">Sin búsquedas registradas</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-50 text-surface-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-5 py-3">Término</th>
                    <th className="text-left px-5 py-3">Fecha</th>
                    <th className="text-left px-5 py-3">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {busquedas.map((b, i) => (
                    <tr key={i} className="hover:bg-surface-50">
                      <td className="px-5 py-3 font-medium text-surface-800">{b.query || '—'}</td>
                      <td className="px-5 py-3 text-surface-500">{new Date(b.fecha).toLocaleString('es-SV')}</td>
                      <td className="px-5 py-3 text-surface-400 font-mono text-xs">{b.ip || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB FORMULARIOS ── */}
      {tab === 'formularios' && (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100">
            <h2 className="text-sm font-semibold text-surface-700">{formularios.length} formularios en los últimos 30 días</h2>
          </div>
          {formularios.length === 0 ? (
            <p className="text-sm text-surface-400 text-center py-10">Sin formularios</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-50 text-surface-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-5 py-3">Nombre</th>
                    <th className="text-left px-5 py-3">Correo</th>
                    <th className="text-left px-5 py-3">Empresa</th>
                    <th className="text-left px-5 py-3">Fecha</th>
                    <th className="text-left px-5 py-3">Mensaje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {formularios.map((f) => (
                    <tr key={f.id} className="hover:bg-surface-50">
                      <td className="px-5 py-3 font-medium text-surface-800">{f.nombre}</td>
                      <td className="px-5 py-3 text-casatic-600"><a href={`mailto:${f.correo}`}>{f.correo}</a></td>
                      <td className="px-5 py-3 text-surface-600">{f.socio || '—'}</td>
                      <td className="px-5 py-3 text-surface-500">{new Date(f.fecha).toLocaleString('es-SV')}</td>
                      <td className="px-5 py-3 text-surface-500 max-w-xs truncate" title={f.mensaje}>{f.mensaje}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB ACCESOS ── */}
      {tab === 'accesos' && (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100">
            <h2 className="text-sm font-semibold text-surface-700">Logins por usuario (últimos 30 días)</h2>
          </div>
          {!dashboard.loginsPorUsuario || Object.keys(dashboard.loginsPorUsuario).length === 0 ? (
            <p className="text-sm text-surface-400 text-center py-10">Sin accesos registrados</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-50 text-surface-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-5 py-3">Usuario</th>
                    <th className="text-right px-5 py-3">Ingresos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {Object.entries(dashboard.loginsPorUsuario)
                    .sort(([, a], [, b]) => b - a)
                    .map(([email, count]) => (
                      <tr key={email} className="hover:bg-surface-50">
                        <td className="px-5 py-3 text-surface-800">{email}</td>
                        <td className="px-5 py-3 text-right font-bold text-casatic-600">{count}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
