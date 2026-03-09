import { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Eye, Search, FileText, Users, Building2, AlertTriangle,
  TrendingUp, BarChart3, Activity, ArrowUpRight, PieChart as PieIcon
} from 'lucide-react';

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
    <div className="min-h-screen bg-[#0E3877] p-8 text-white/50 font-bold animate-pulse">
      CARGANDO DATOS DEL SISTEMA...
    </div>
  );

  const cards = [
    { label: 'Visitas Sem', value: data.visitasSemana, icon: Eye, accent: '#0C9EC6' },
    { label: 'Visitas Mes', value: data.visitasMes, icon: TrendingUp, accent: '#3FD0D8' },
    { label: 'Búsquedas', value: data.busquedasMes, icon: Search, accent: '#0C9EC6' },
    { label: 'Formularios', value: data.formulariosMes, icon: FileText, accent: '#3FD0D8' },
    { label: 'Total Socios', value: data.totalSocios, icon: Building2, accent: '#0C9EC6' },
    { label: 'Activos', value: data.sociosActivos, icon: Users, accent: '#3FD0D8' },
    { label: 'En Mora', value: data.sociosEnMora, icon: AlertTriangle, accent: '#ef4444' },
  ];

  const totalS = data.sociosActivos + data.sociosEnMora || 1;
  const dashSocio = `${(data.sociosEnMora / totalS) * 100} 100`;

  const totalV = data.visitasMes || 1;
  const dashVisita = `${(data.visitasSemana / totalV) * 100} 100`;

  return (
    <div className="min-h-screen bg-[#0E3877] p-4 sm:p-8 font-['Roboto'] text-white overflow-x-hidden">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');`}
      </style>

      {/* ── Header Estilo Gestión de Usuarios ──────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
            <BarChart3 size={32} className="text-[#0C9EC6]" />
            Tablero Principal
          </h1>
          <p className="text-white/60 text-sm mt-1 font-normal uppercase tracking-wider">Inteligencia de Datos CASATIC</p>
        </div>
      </div>

      {/* ── Stat Cards (Estilo UsuariosAdmin) ────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-xl transition-all hover:translate-y-[-4px] group">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-[#0C9EC6]/10 transition-colors">
                <card.icon size={22} style={{ color: card.accent }} /> 
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0E3877] leading-none tracking-tighter">{card.value}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row (Estilo Contenedores Blancos) ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Gráfico 1: Estado de Socios */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center text-[#0E3877]">
          <div className="w-full mb-6 border-b border-gray-50 pb-4">
            <h3 className="text-lg font-bold tracking-tight">Estado de Socios</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Distribución de Cartera</p>
          </div>
          
          <div className="relative w-40 h-40 mb-6">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f4f6" strokeWidth="3.5" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeDasharray={dashSocio} strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{Math.round((data.sociosEnMora/totalS)*100)}%</span>
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">En Mora</span>
            </div>
          </div>

          <div className="w-full space-y-2">
             <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#0C9EC6]" /> Activos
               </span>
               <span className="font-bold">{data.sociosActivos}</span>
             </div>
             <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#ef4444]" /> En Mora
               </span>
               <span className="font-bold">{data.sociosEnMora}</span>
             </div>
          </div>
        </div>

        {/* Gráfico 2: Rendimiento Red */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center text-[#0E3877]">
          <div className="w-full mb-6 border-b border-gray-50 pb-4">
            <h3 className="text-lg font-bold tracking-tight">Rendimiento Red</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tráfico de Visitas</p>
          </div>

          <div className="relative w-40 h-40 mb-6">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f4f6" strokeWidth="3.5" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#0C9EC6" strokeWidth="3.5" strokeDasharray={dashVisita} strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{Math.round((data.visitasSemana/totalV)*100)}%</span>
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Semanal</span>
            </div>
          </div>

          <div className="w-full space-y-2">
             <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Semana Actual</span>
               <span className="font-bold">{data.visitasSemana}</span>
             </div>
             <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Acumulado Mes</span>
               <span className="font-bold text-gray-400">{data.visitasMes}</span>
             </div>
          </div>
        </div>

        {/* Actividad Estilo Tabla UsuariosAdmin */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          <div className="p-6 bg-gray-50 border-b border-gray-100">
            <h3 className="text-lg font-bold text-[#0E3877] tracking-tight">Actividad</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Accesos Recientes</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {Object.entries(data?.loginsPorUsuario || {}).map(([email, count]) => (
              <div key={email} className="flex items-center justify-between p-3 hover:bg-blue-50/50 rounded-2xl transition-colors group">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-9 h-9 bg-[#0C9EC6] rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-normal text-[#0E3877] truncate tracking-tight">{email}</span>
                </div>
                <div className="bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm group-hover:border-[#0C9EC6]/30 transition-all">
                  <span className="text-xs font-bold text-[#0C9EC6]">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="mt-12 text-center opacity-30">
        <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-white"> Gestión de datos CASATIC©</p>
      </div>
    </div>
  );
}