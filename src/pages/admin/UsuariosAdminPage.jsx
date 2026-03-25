import { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Users, Plus, ToggleLeft, ToggleRight, Trash2, UserPlus,
  AlertCircle, X, ChevronDown, Building2, Mail, Shield
} from 'lucide-react';

function TableSkeleton() {
  return (
    <div className="card-base p-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4 mb-4">
          <div className="h-12 skeleton flex-1" />
          <div className="h-12 skeleton w-24" />
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
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-casatic-100 rounded-2xl flex items-center justify-center">
            <Users size={22} className="text-casatic-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-surface-900">Gestión de Usuarios</h1>
            <p className="text-sm text-surface-500">{usuarios.length} usuarios registrados</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={showForm ? 'btn-secondary self-start sm:self-auto' : 'btn-primary self-start sm:self-auto'}
        >
          {showForm ? <><X size={18} /> Cancelar</> : <><Plus size={18} /> Nuevo Usuario</>}
        </button>
      </div>

      {/* ── Formulario Crear Usuario ──────────────────── */}
      {showForm && (
        <div className="card-base p-6 animate-fade-in-down">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-casatic-50 rounded-xl flex items-center justify-center">
              <UserPlus size={20} className="text-casatic-600" />
            </div>
            <div>
              <h3 className="font-bold text-surface-900">Crear Nuevo Acceso</h3>
              <p className="text-xs text-surface-400">Contraseña inicial: Socio123!</p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="email" required placeholder="Email del usuario"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-9"
                />
              </div>

              <div className="relative">
                <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <select
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  className="input-field pl-9 pr-10 appearance-none"
                >
                  <option value="Socio">Rol: Socio</option>
                  <option value="Admin">Rol: Administrador</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
              </div>

              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <select
                  value={form.socioId}
                  onChange={(e) => setForm({ ...form, socioId: e.target.value })}
                  className="input-field pl-9 pr-10 appearance-none"
                >
                  <option value="">Sin empresa asociada</option>
                  {socios.map((s) => (
                    <option key={s.id} value={s.id}>{s.nombreEmpresa}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
              </div>
            </div>

            {error && (
              <div className="alert-error">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button type="submit" className="btn-primary">
              Confirmar Registro
            </button>
          </form>
        </div>
      )}

      {/* ── Tabla Principal ─────────────────────────────── */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="table-container">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-100">
                  <th className="table-th">Usuario</th>
                  <th className="table-th">Nivel de Acceso</th>
                  <th className="table-th">Organización</th>
                  <th className="table-th text-center">Estado Pass</th>
                  <th className="table-th text-center">Activo</th>
                  <th className="table-th text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="table-row">
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-casatic-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                          {u.email?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="text-sm text-surface-800">{u.email}</span>
                      </div>
                    </td>
                    <td className="table-td">
                      <span className={`badge ${
                        u.rol === 'Admin'
                          ? 'bg-purple-50 text-purple-600 ring-1 ring-inset ring-purple-200'
                          : 'badge-primary'
                      }`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="table-td text-surface-400 italic text-sm">
                      {u.nombreEmpresa || '—'}
                    </td>
                    <td className="table-td text-center">
                      {u.primerLogin ? (
                        <span className="badge-warning">Pendiente</span>
                      ) : (
                        <span className="badge-success">Segura</span>
                      )}
                    </td>
                    <td className="table-td text-center">
                      <button onClick={() => toggleActivo(u.id)} className="transition-transform active:scale-90">
                        {u.activo ? (
                          <ToggleRight size={28} className="text-casatic-500 mx-auto" />
                        ) : (
                          <ToggleLeft size={28} className="text-surface-300 mx-auto" />
                        )}
                      </button>
                    </td>
                    <td className="table-td text-center">
                      <button onClick={() => eliminar(u.id)} className="btn-icon btn-ghost text-red-500 hover:bg-red-50">
                        <Trash2 size={16} />
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
