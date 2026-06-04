import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Lock, Home, Eye, EyeOff, AlertCircle } from 'lucide-react';
import reverseLogo from '../../img/Reverse - v3@4x.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.primerLogin) {
        navigate('/admin/cambiar-password');
      } else if (data.rol === 'Socio') {
        navigate('/admin/mi-empresa');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      let mensaje = 'Error al iniciar sesión';
      if (err.response?.data?.message) {
        mensaje = err.response.data.message;
      } else if (err.response?.status === 401) {
        mensaje = 'Correo o contraseña incorrectos';
      } else if (err.response?.status === 403) {
        mensaje = 'Acceso denegado. Usuario inactivo';
      } else if (err.response?.status >= 500) {
        mensaje = 'Error del servidor. Intenta más tarde';
      } else if (err.message === 'Network Error') {
        mensaje = 'Error de conexión. Verifica tu internet';
      }
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-casatic-900 via-casatic-800 to-casatic-700 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-casatic-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <img src={reverseLogo} alt="CASATIC" className="h-14 w-auto object-contain mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Directorio Interactivo<br />
              <span className="text-gradient-accent">CASATIC 2026</span>
            </h2>
            <p className="text-casatic-200 text-base leading-relaxed">
              La plataforma oficial de la Cámara de Tecnologías de Información
              y Comunicación de El Salvador.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-10">
            {['Socios Verificados', 'Directorio Completo', 'Acceso Seguro'].map((item) => (
              <div key={item} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-white text-xs font-medium leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src={reverseLogo} alt="CASATIC" className="h-10 w-auto object-contain mx-auto mb-3" />
            <p className="text-casatic-200 text-sm">Directorio Interactivo 2026</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-7 sm:p-9">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-surface-900 mb-1 text-center">Bienvenido</h1>
              <p className="text-sm text-surface- text-center">Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="input-label">Correo electrónico</label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400"
                  />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="tu@empresa.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="input-label">Contraseña</label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end -mt-1">
                <Link
                  to="/admin/forgot-password"
                  className="text-xs text-casatic-600 hover:text-casatic-700 font-semibold transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Error */}
              {error && (
                <div className="alert-error text-xs">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-base mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} />
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-surface-100" />
              <span className="text-xs text-surface-400 font-medium">o</span>
              <div className="flex-1 h-px bg-surface-100" />
            </div>

            <Link
              to="/"
              className="btn-secondary w-full justify-center py-2.5 text-sm"
            >
              <Home size={16} />
              Volver al Inicio
            </Link>
          </div>

          <p className="text-center text-xs text-casatic-300 mt-6">
            &copy; {new Date().getFullYear()} CASATIC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
