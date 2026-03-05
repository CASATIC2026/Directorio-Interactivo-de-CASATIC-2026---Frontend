import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Building2, Plus, Edit, Trash2, ToggleLeft, ToggleRight,
  AlertTriangle, Search, Filter
} from 'lucide-react';

export default function SociosAdminPage() {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [error, setError] = useState('');

  const fetchSocios = () => {
    setLoading(true);
    api.get('/socios')
      .then((r) => setSocios(r.data))
      .catch(() => setError('No se pudieron cargar los socios.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSocios(); }, []);

  const toggleHabilitado = async (socio) => {
    try {
      await api.patch(`/socios/${socio.id}/habilitar`, { habilitado: !socio.habilitado });
      fetchSocios();
    } catch {
      setError('Error al cambiar el estado del socio.');
    }
  };

  const deleteSocio = async (id) => {
    try {
      await api.delete(`/socios/${id}`);
      setConfirmDelete(null);
      fetchSocios();
    } catch {
      setError('Error al eliminar el socio.');
    }
  };

  const filtered = socios.filter((s) =>
    s.nombreEmpresa?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0A0A] flex items-center gap-2">
            <Building2 size={26} className="text-[#0E3877]" /> Socios
          </h1>
          <p className="text-gray-400 text-sm mt-1">Gestión de empresas socias</p>
        </div>
        <Link
          to="/admin/socios/nuevo"
          className="bg-[#0E3877] hover:bg-[#0C9EC6] text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={16} /> Nuevo Socio
        </Link>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Búsqueda */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar empresa..."
          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0C9EC6]"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-[#0E3877]/20 border-t-[#0E3877] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Empresa</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Estado Financiero</th>
                <th className="px-4 py-3 text-center">Habilitado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">
                    <Filter size={32} className="mx-auto mb-2 opacity-30" />
                    Sin resultados
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-[#0A0A0A]">{s.nombreEmpresa}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.estadoFinanciero === 'AlDia' ? 'bg-green-50 text-green-700'
                        : s.estadoFinanciero === 'EnMora' ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-red-50 text-red-700'
                      }`}>
                        {s.estadoFinanciero}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleHabilitado(s)} title="Toggle habilitado">
                        {s.habilitado
                          ? <ToggleRight size={22} className="text-green-500 mx-auto" />
                          : <ToggleLeft size={22} className="text-gray-300 mx-auto" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/admin/socios/${s.id}`} title="Editar">
                          <Edit size={16} className="text-[#0C9EC6] hover:text-[#0E3877] transition" />
                        </Link>
                        <button onClick={() => setConfirmDelete(s)} title="Eliminar">
                          <Trash2 size={16} className="text-red-400 hover:text-red-600 transition" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal confirmación eliminar */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={28} className="text-red-500" />
              <h2 className="text-lg font-bold text-[#0A0A0A]">¿Eliminar socio?</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Se eliminará <strong>{confirmDelete.nombreEmpresa}</strong>. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteSocio(confirmDelete.id)}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
