import { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Eye, Search, FileText, Users, Building2, AlertTriangle,
  TrendingUp, BarChart3, Activity
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/estadisticas')
      .then((r) => setStats(r.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: 'Total Socios', value: stats.totalSocios ?? '—', icon: <Building2 size={28} className="text-[#0E3877]" /> },
        { label: 'Socios Activos', value: stats.sociosActivos ?? '—', icon: <TrendingUp size={28} className="text-green-500" /> },
        { label: 'Socios En Mora', value: stats.sociosEnMora ?? '—', icon: <AlertTriangle size={28} className="text-yellow-500" /> },
        { label: 'Usuarios', value: stats.totalUsuarios ?? '—', icon: <Users size={28} className="text-[#0C9EC6]" /> },
        { label: 'Visitas Directorio', value: stats.visitasDirectorio ?? '—', icon: <Eye size={28} className="text-purple-500" /> },
        { label: 'Formularios Recibidos', value: stats.formulariosContacto ?? '—', icon: <FileText size={28} className="text-pink-500" /> },
      ]
    : [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0A0A0A] flex items-center gap-2">
          <BarChart3 size={28} className="text-[#0E3877]" /> Dashboard
        </h1>
        <p className="text-gray-400 text-sm mt-1">Resumen general del directorio CASATIC</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#0E3877]/20 border-t-[#0E3877] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">{c.icon}</div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{c.label}</p>
                <p className="text-3xl font-bold text-[#0A0A0A]">{c.value}</p>
              </div>
            </div>
          ))}
          {!stats && (
            <div className="col-span-3 text-center text-gray-400 py-10">
              <Activity size={40} className="mx-auto mb-2 opacity-30" />
              <p>No se pudieron cargar las estadísticas.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
