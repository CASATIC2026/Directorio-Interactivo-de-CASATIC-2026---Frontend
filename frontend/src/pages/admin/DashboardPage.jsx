import { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Eye, Search, FileText, Users, Building2, AlertTriangle,
  TrendingUp, BarChart3, Activity
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color = 'casatic' }) {
  const colors = {
    casatic: 'bg-casatic-50 text-casatic-600',
    accent:  'bg-accent-50 text-accent-600',
    red:     'bg-red-50 text-red-600',
    purple:  'bg-purple-50 text-purple-600',
  };
  return (
    <div className="card-base p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex flex-col gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold text-surface-900 leading-none">{value}</p>
          <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-widest mt-1.5">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reportes/dashboard')
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-casatic-200 border-t-casatic-600 rounded-full animate-spin" />
        <p className="text-sm text-surface-400 font-medium">Cargando datos…</p>
      </div>
    </div>
  );

  const cards = [
    { label: 'Visitas Sem',  value: data.visitasSemana,  icon: Eye,           color: 'casatic' },
    { label: 'Visitas Mes',  value: data.visitasMes,     icon: TrendingUp,    color: 'accent' },
    { label: 'Búsquedas',    value: data.busquedasMes,   icon: Search,        color: 'purple' },
    { label: 'Formularios',  value: data.formulariosMes, icon: FileText,      color: 'accent' },
    { label: 'Total Socios', value: data.totalSocios,    icon: Building2,     color: 'casatic' },
    { label: 'Activos',      value: data.sociosActivos,  icon: Users,         color: 'accent' },
    { label: 'En Mora',      value: data.sociosEnMora,   icon: AlertTriangle, color: 'red' },
  ];

  const totalS = data.sociosActivos + data.sociosEnMora || 1;
  const dashSocio = `${(data.sociosEnMora / totalS) * 100} 100`;

  const totalV = data.visitasMes || 1;
  const dashVisita = `${(data.visitasSemana / totalV) * 100} 100`;

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-casatic-100 rounded-2xl flex items-center justify-center">
            <BarChart3 size={22} className="text-casatic-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-surface-900">Tablero Principal</h1>
            <p className="text-sm text-surface-500">Inteligencia de datos CASATIC</p>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Charts Row ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Gráfico 1: Estado de Socios */}
        <div className="lg:col-span-4 card-base p-6 flex flex-col items-center">
          <div className="w-full mb-6 border-b border-surface-100 pb-4">
            <h3 className="text-base font-bold text-surface-900">Estado de Socios</h3>
            <p className="text-xs text-surface-400 mt-0.5">Distribución de cartera</p>
          </div>

          <div className="relative w-36 h-36 mb-6">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-surface-100" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeDasharray={dashSocio} strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-surface-900">{Math.round((data.sociosEnMora / totalS) * 100)}%</span>
              <span className="text-[9px] font-semibold text-surface-400 uppercase">En Mora</span>
            </div>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between items-center p-2.5 bg-surface-50 rounded-xl">
              <span className="text-xs font-medium text-surface-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-casatic-500" /> Activos
              </span>
              <span className="font-bold text-surface-800">{data.sociosActivos}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-surface-50 rounded-xl">
              <span className="text-xs font-medium text-surface-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" /> En Mora
              </span>
              <span className="font-bold text-surface-800">{data.sociosEnMora}</span>
            </div>
          </div>
        </div>

        {/* Gráfico 2: Rendimiento Red */}
        <div className="lg:col-span-4 card-base p-6 flex flex-col items-center">
          <div className="w-full mb-6 border-b border-surface-100 pb-4">
            <h3 className="text-base font-bold text-surface-900">Rendimiento Red</h3>
            <p className="text-xs text-surface-400 mt-0.5">Tráfico de visitas</p>
          </div>

          <div className="relative w-36 h-36 mb-6">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-surface-100" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3.5" strokeDasharray={dashVisita} strokeDashoffset="0" strokeLinecap="round" className="text-casatic-500" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-surface-900">{Math.round((data.visitasSemana / totalV) * 100)}%</span>
              <span className="text-[9px] font-semibold text-surface-400 uppercase">Semanal</span>
            </div>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between items-center p-2.5 bg-surface-50 rounded-xl">
              <span className="text-xs font-medium text-surface-500">Semana Actual</span>
              <span className="font-bold text-surface-800">{data.visitasSemana}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-surface-50 rounded-xl">
              <span className="text-xs font-medium text-surface-500">Acumulado Mes</span>
              <span className="font-bold text-surface-400">{data.visitasMes}</span>
            </div>
          </div>
        </div>

        {/* Actividad: Accesos recientes */}
        <div className="lg:col-span-4 card-base overflow-hidden flex flex-col">
          <div className="p-5 border-b border-surface-100">
            <h3 className="text-base font-bold text-surface-900 flex items-center gap-2">
              <Activity size={16} className="text-casatic-500" /> Actividad
            </h3>
            <p className="text-xs text-surface-400 mt-0.5">Accesos recientes</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {Object.entries(data?.loginsPorUsuario || {}).map(([email, count]) => (
              <div key={email} className="flex items-center justify-between p-3 hover:bg-casatic-50/50 rounded-xl transition-colors group">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 bg-casatic-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    {email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-surface-700 truncate">{email}</span>
                </div>
                <span className="badge-primary">{count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
