import { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Users, Plus, ToggleLeft, ToggleRight, Trash2, UserPlus,
  AlertCircle, X, ChevronDown
} from 'lucide-react';

export default function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [socios, setSocios] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', rol: 'Usuario', socioId: '' });
  const [saving, setSaving] = useState(false);

  const fetchUsuarios = () => {
    setLoading(true);
    api.get('/usuarios')
      .then((r) => setUsuarios(r.data))
      .catch(() => setError('No se pudieron cargar los usuarios.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsuarios();
    api.get('/socios').then((r) => setSocios(r.data)).catch(() => {});
  }, []);

  const toggleActivo = async (u) => {
    try {
      await api.patch(`/usuarios/${u.id}/activo`, { activo: !u.activo });
      fetchUsuarios();
    } catch {
      setError('Error al cambiar el estado del usuario.');
    }
  };

  const deleteUsuario = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      setConfirmDelete(null);
      fetchUsuarios();
    } catch {
      setError('Error al eliminar el usuario.');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/usuarios', {
        email: newUser.email,
        rol: newUser.rol,
        socioId: newUser.socioId || null,
      });
      setShowModal(false);
      setNewUser({ email: '', rol: 'Usuario', socioId: '' });
      fetchUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el usuario.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0A0A] flex items-center gap-2">
            <Users size={26} className="text-[#0E3877]" /> Usuarios
          </h1>
          <p className="text-gray-400 text-sm mt-1">Gestión de accesos al sistema</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#0E3877] hover:bg-[#0C9EC6] text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <UserPlus size={16} /> Nuevo Usuario
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
          <AlertCircle size={16} /> {error}
          <button onClick={() => setError('')} className="ml-auto"><X size={14} /></button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-[#0E3877]/20 border-t-[#0E3877] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Rol</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Empresa</th>
                <th className="px-4 py-3 text-center">Activo</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">Sin usuarios registrados</td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-[#0A0A0A]">{u.email}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.rol === 'Admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500">{u.nombreEmpresa || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleActivo(u)}>
                        {u.activo
                          ? <ToggleRight size={22} className="text-green-500 mx-auto" />
                          : <ToggleLeft size={22} className="text-gray-300 mx-auto" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setConfirmDelete(u)}>
                        <Trash2 size={16} className="text-red-400 hover:text-red-600 transition mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal nuevo usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0A0A0A] flex items-center gap-2">
                <UserPlus size={20} className="text-[#0E3877]" /> Nuevo Usuario
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">La contraseña genérica será <strong>Socio123!</strong> — el usuario deberá cambiarla en su primer login.</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Email *</label>
                <input type="email" required value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0C9EC6]"
                  placeholder="usuario@empresa.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Rol</label>
                <div className="relative">
                  <select value={newUser.rol} onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0C9EC6] appearance-none">
                    <option value="Usuario">Usuario (Socio)</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                </div>
              </div>
              {newUser.rol === 'Usuario' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Empresa Asociada</label>
                  <div className="relative">
                    <select value={newUser.socioId} onChange={(e) => setNewUser({ ...newUser, socioId: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0C9EC6] appearance-none">
                      <option value="">— Sin empresa —</option>
                      {socios.map((s) => (
                        <option key={s.id} value={s.id}>{s.nombreEmpresa}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-xs bg-red-50 p-2 rounded-lg border border-red-100 flex items-center gap-2">
                  <AlertCircle size={12} /> {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-[#0E3877] hover:bg-[#0C9EC6] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminar */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 size={28} className="text-red-500" />
              <h2 className="text-lg font-bold">¿Eliminar usuario?</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Se eliminará <strong>{confirmDelete.email}</strong>. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button onClick={() => deleteUsuario(confirmDelete.id)}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
