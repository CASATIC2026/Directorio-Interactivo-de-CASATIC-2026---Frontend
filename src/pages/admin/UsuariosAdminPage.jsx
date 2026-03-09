import { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Users, Plus, ToggleLeft, ToggleRight, Trash2, UserPlus,
  AlertCircle, X, ChevronDown, Building2, Mail, Shield
} from 'lucide-react';

function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 animate-pulse shadow-sm font-['Roboto']">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4 mb-4">
          <div className="h-12 bg-gray-100 rounded-xl flex-1" />
          <div className="h-12 bg-gray-100 rounded-xl w-24" />
        </div>
      ))}
    </div>
  );
}

export default function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', rol: 'Socio', socioId: '' });
  const [error, setError] = useState(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get('/usuarios'), api.get('/socios')])
      .then(([uRes, sRes]) => {
        setUsuarios(uRes.data);
        setSocios(sRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const toggleActivo = async (id) => {
    await api.patch(`/usuarios/${id}/toggle-activo`);
    loadData();
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    await api.delete(`/usuarios/${id}`);
    loadData();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/usuarios', {
        email: form.email,
        rol: form.rol,
        socioId: form.socioId || null,
      });
      setShowForm(false);
      setForm({ email: '', rol: 'Socio', socioId: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear usuario');
    }
  };

  return (
    <div className="min-h-screen bg-[#0E3877] p-4 sm:p-8 font-['Roboto'] font-normal text-white">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');`}
      </style>

      {/* ── Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
            <Users size={32} className="text-[#0C9EC6]" />
            Gestión de Usuarios
          </h1>
          <p className="text-white/60 text-sm mt-1 font-normal">{usuarios.length} usuarios registrados</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg active:scale-95 ${
            showForm ? 'bg-[#0A0A0A] text-white' : 'bg-[#0C9EC6] hover:bg-white hover:text-[#0E3877] text-white'
          }`}
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancelar' : 'Nuevo Usuario'}
        </button>
      </div>

      {/* ── Formulario (Fondo Blanco) ─────────────────── */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 max-w-4xl mx-auto animate-fade-in-down text-[#0A0A0A]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#0C9EC6]/10 rounded-xl flex items-center justify-center">
              <UserPlus size={24} className="text-[#0C9EC6]" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-[#0E3877]">Crear Nuevo Acceso</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pass inicial: Socio123!</p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0C9EC6]" size={18} />
                <input
                  type="email" required placeholder="Email del usuario"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-3 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all text-gray-700 font-normal"
                />
              </div>

              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0C9EC6]" size={18} />
                <select
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] appearance-none bg-white text-gray-700 font-normal"
                >
                  <option value="Socio">Rol: Socio</option>
                  <option value="Admin">Rol: Administrador</option>
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0C9EC6]" size={18} />
                <select
                  value={form.socioId}
                  onChange={(e) => setForm({ ...form, socioId: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] appearance-none bg-white text-gray-700 font-normal"
                >
                  <option value="">Sin empresa asociada</option>
                  {socios.map((s) => (
                    <option key={s.id} value={s.id}>{s.nombreEmpresa}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-100 flex items-center gap-2 font-normal">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <button type="submit" className="w-full md:w-auto px-8 py-3 bg-[#0C9EC6] hover:bg-[#0E3877] text-white font-bold rounded-xl transition-all shadow-lg active:scale-95">
              Confirmar Registro
            </button>
          </form>
        </div>
      )}

      {/* ── Tabla Principal (Fondo Blanco) ──────────────── */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[#0E3877] uppercase text-[11px] tracking-[0.2em] font-bold border-b border-gray-100">
                  <th className="px-6 py-5">Usuario</th>
                  <th className="px-6 py-5">Nivel de Acceso</th>
                  <th className="px-6 py-5">Organización</th>
                  <th className="px-6 py-5 text-center">Estado Pass</th>
                  <th className="px-6 py-5 text-center">Activo</th>
                  <th className="px-6 py-5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0C9EC6] rounded-xl flex items-center justify-center font-bold text-white shadow-md">
                          {u.email?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-normal text-[#0C9EC6] tracking-tight">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.rol === 'Admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-[#0E3877]'
                      }`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 italic text-sm font-normal">
                      {u.nombreEmpresa || '—'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {u.primerLogin ? (
                        <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-1 rounded-md font-bold uppercase">Pendiente</span>
                      ) : (
                        <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-1 rounded-md font-bold uppercase">Segura</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleActivo(u.id)}
                        className="transition-transform active:scale-90"
                      >
                        {u.activo ? (
                          <ToggleRight size={32} className="text-[#0C9EC6] mx-auto" />
                        ) : (
                          <ToggleLeft size={32} className="text-gray-300 mx-auto" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => eliminar(u.id)}
                        className="p-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}