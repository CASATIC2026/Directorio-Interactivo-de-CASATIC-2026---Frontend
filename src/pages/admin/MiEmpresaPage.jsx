import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Edit2, Loader } from 'lucide-react';
import api from '../../api/client';

export default function MiEmpresaPage() {
  const { user } = useAuth();
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        setLoading(true);
        // Obtener la información de la empresa del socio usando su socioId
        if (user?.socioId) {
          const { data } = await api.get(`/directorio/company/${user.socioId}`);
          setEmpresa(data);
        } else {
          setError('No se encontró el ID de tu empresa');
        }
      } catch (err) {
        setError('No se pudo cargar la información de tu empresa');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, [user?.socioId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader size={40} className="text-casatic-600 animate-spin" />
          <p className="text-surface-500">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Building2 size={32} className="text-casatic-600" />
          <div>
            <h1 className="text-3xl font-bold text-surface-900">Mi Empresa</h1>
            <p className="text-surface-500 text-sm">Gestiona la información de tu empresa</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      {empresa ? (
        <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Nombre de la Empresa
              </label>
              <p className="text-surface-900 font-medium">{empresa.nombre}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Email
              </label>
              <p className="text-surface-900 font-medium">{empresa.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Teléfono
              </label>
              <p className="text-surface-900 font-medium">{empresa.telefono || 'No especificado'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Especialidad
              </label>
              <p className="text-surface-900 font-medium">{empresa.especialidad || 'No especificada'}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Descripción
              </label>
              <p className="text-surface-700 leading-relaxed">
                {empresa.descripcion || 'No hay descripción'}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-surface-200">
            <button className="btn btn-primary flex items-center gap-2">
              <Edit2 size={18} />
              Editar Información
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <p className="text-amber-800">No se encontró información de la empresa</p>
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="font-semibold text-blue-900 mb-3">¿Qué puedes hacer desde aquí?</h2>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Ver y editar la información de tu empresa</li>
          <li>✓ Actualizar categorías y especialidades</li>
          <li>✓ Responder formularios de contacto</li>
          <li>✓ Ver estadísticas de perfil</li>
        </ul>
      </div>
    </div>
  );
}
