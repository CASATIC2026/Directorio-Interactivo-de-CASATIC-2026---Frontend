import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../api/client';

export default function CambiarPasswordPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ passwordActual: '', passwordNuevo: '', confirmar: '' });
  const [showActual, setShowActual] = useState(false);
  const [showNuevo, setShowNuevo] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.passwordNuevo !== form.confirmar) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }
    if (form.passwordNuevo.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/cambiar-password', {
        passwordActual: form.passwordActual,
        passwordNuevo: form.passwordNuevo,
      });
      setSuccess(true);
      setTimeout(() => navigate('/admin'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <ShieldCheck size={40} className="text-[#0E3877] mb-2" />
          <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-wide">Cambiar Contraseña</h1>
          {user && (
            <p className="text-xs text-gray-400 mt-1">{user.email}</p>
          )}
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <CheckCircle2 size={48} className="text-green-500" />
            <p className="text-center text-sm text-gray-600 font-medium">
              Contraseña actualizada correctamente. Redirigiendo…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contraseña actual */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                Contraseña actual
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0E3877]" size={16} />
                <input
                  type={showActual ? 'text' : 'password'}
                  name="passwordActual"
                  required
                  value={form.passwordActual}
                  onChange={handleChange}
                  className="w-full pl-9 pr-10 py-2.5 border-2 border-gray-100 rounded-lg focus:border-[#0C9EC6] focus:outline-none text-sm"
                  placeholder="Tu contraseña actual"
                />
                <button type="button" onClick={() => setShowActual(!showActual)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showActual ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Nueva contraseña */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                Nueva contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0E3877]" size={16} />
                <input
                  type={showNuevo ? 'text' : 'password'}
                  name="passwordNuevo"
                  required
                  value={form.passwordNuevo}
                  onChange={handleChange}
                  className="w-full pl-9 pr-10 py-2.5 border-2 border-gray-100 rounded-lg focus:border-[#0C9EC6] focus:outline-none text-sm"
                  placeholder="Mínimo 8 caracteres"
                />
                <button type="button" onClick={() => setShowNuevo(!showNuevo)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showNuevo ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirmar */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                Confirmar nueva contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0E3877]" size={16} />
                <input
                  type={showConfirmar ? 'text' : 'password'}
                  name="confirmar"
                  required
                  value={form.confirmar}
                  onChange={handleChange}
                  className="w-full pl-9 pr-10 py-2.5 border-2 border-gray-100 rounded-lg focus:border-[#0C9EC6] focus:outline-none text-sm"
                  placeholder="Repite la nueva contraseña"
                />
                <button type="button" onClick={() => setShowConfirmar(!showConfirmar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirmar ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 py-2 px-3 rounded-lg border border-red-100">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0E3877] hover:bg-[#0C9EC6] text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md active:scale-95 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Actualizar contraseña
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
