import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, Lock, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import api from "../../api/client";
import { validatePassword, validatePasswordMatch, validateEmail } from "../../lib/validators";
import logo from "../../img/logo.png";

/**
 * Página de recuperación de contraseña administrador
 * Flujo de 3 pasos:
 * 1. Solicitar token (email)
 * 2. Validar token (código)
 * 3. Resetear contraseña
 */
export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  
  // Estados del flujo
  const [step, setStep] = useState(1); // 1: solicitar, 2: validar, 3: resetear
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Usar validador senior-level
  const passwordValidation = validatePassword(newPassword);
  const matchValidation = validatePasswordMatch(newPassword, confirmPassword);
  const isPasswordValid = passwordValidation.isValid;
  const isPasswordMatch = matchValidation.match && isPasswordValid;
  const isEmailValid = validateEmail(email);

  // Paso 1: Solicitar token de recuperación
  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post('/auth/recuperar-password', { email });
      setSuccess("Se ha enviado un código de recuperación a tu email. Por favor verifica tu bandeja.");
      setTimeout(() => {
        setSuccess("");
        setStep(2);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al enviar el código de recuperación");
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Validar token
  const handleValidateToken = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post('/auth/validar-token-recuperacion', { email, token });
      setSuccess("Código validado exitosamente.");
      setTimeout(() => {
        setSuccess("");
        setStep(3);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Código inválido o expirado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Paso 3: Resetear contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!isPasswordMatch) {
      setError("Las contraseñas no coinciden o no cumplen los requisitos");
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/restablecer-password', { 
        email, 
        token, 
        nuevaPassword: newPassword 
      });
      setSuccess("Contraseña cambiada exitosamente. Redirigiendo al login...");
      setTimeout(() => navigate("/admin/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al resetear la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-casatic-700 to-casatic-900 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-casatic-500 to-casatic-700 p-6">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="CASATIC" className="h-12 opacity-90" />
            </div>
            <h1 className="text-2xl font-bold text-white text-center">Recuperar Contraseña</h1>
            <p className="text-center text-sm text-casatic-100 mt-2">Administrador</p>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Progress Indicator */}
            <div className="flex justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      step >= s
                        ? "bg-casatic-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step > s ? <CheckCircle size={20} /> : s}
                  </div>
                  <span className="text-xs text-gray-500 text-center">
                    {s === 1 ? "Email" : s === 2 ? "Código" : "Nueva"}
                  </span>
                </div>
              ))}
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded flex gap-2">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded flex gap-2">
                <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            {/* Paso 1: Solicitar Token */}
            {step === 1 && (
              <form onSubmit={handleRequestToken} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email del administrador
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@casatic.org"
                      required
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-casatic-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Se enviará un código de recuperación a este email
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-2.5 bg-casatic-600 hover:bg-casatic-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Enviando código...
                    </>
                  ) : (
                    "Enviar código de recuperación"
                  )}
                </button>
              </form>
            )}

            {/* Paso 2: Validar Token */}
            {step === 2 && (
              <form onSubmit={handleValidateToken} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Código de recuperación
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Copia el código del email"
                    required
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-casatic-500 focus:outline-none transition-colors font-mono text-center text-lg tracking-widest"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Verifica tu email (incluyendo spam) y copia el código
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full py-2.5 bg-casatic-600 hover:bg-casatic-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Validando código...
                    </>
                  ) : (
                    "Validar código"
                  )}
                </button>
              </form>
            )}

            {/* Paso 3: Nueva Contraseña */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 caracteres, mayúscula y número"
                      required
                      className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-lg focus:border-casatic-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="mt-2 text-xs space-y-1">
                    <p className={/^.{8,}$/.test(newPassword) ? "text-green-600" : "text-gray-500"}>
                      ✓ Mínimo 8 caracteres
                    </p>
                    <p className={/[A-Z]/.test(newPassword) ? "text-green-600" : "text-gray-500"}>
                      ✓ Al menos una mayúscula
                    </p>
                    <p className={/\d/.test(newPassword) ? "text-green-600" : "text-gray-500"}>
                      ✓ Al menos un número
                    </p>
                    <p className={/[^a-zA-Z0-9]/.test(newPassword) ? "text-green-600" : "text-gray-500"}>
                      ✓ Al menos un carácter especial (!@#$%^&*)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite la contraseña"
                      required
                      className={`w-full pl-10 pr-10 py-2.5 border-2 rounded-lg focus:outline-none transition-colors ${
                        confirmPassword
                          ? isPasswordMatch
                            ? "border-green-500 focus:border-green-500"
                            : "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-casatic-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isPasswordMatch}
                  className="w-full py-2.5 bg-casatic-600 hover:bg-casatic-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Cambiando contraseña...
                    </>
                  ) : (
                    "Cambiar contraseña"
                  )}
                </button>
              </form>
            )}

            {/* Botón volver */}
            {step > 1 && (
              <button
                onClick={() => {
                  setStep(step - 1);
                  setError("");
                  setSuccess("");
                }}
                className="mt-4 w-full py-2 text-casatic-600 hover:text-casatic-700 font-semibold text-sm flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Volver al paso anterior
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xs text-gray-600">¿Recuerdas tu contraseña?</span>
            <Link
              to="/admin/login"
              className="text-casatic-600 hover:text-casatic-700 font-semibold text-sm flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              Ir a login
            </Link>
          </div>
        </div>

        {/* Help text */}
        <div className="mt-4 p-3 bg-white/20 rounded-lg text-white text-xs">
          <p className="font-semibold mb-1">💡 Ayuda:</p>
          <ul className="space-y-0.5 text-white/90">
            <li>• Verifica tu email incluyendo la carpeta de spam</li>
            <li>• Si no recibiste el código, espera 1 minuto antes de reintentar</li>
            <li>• El código caduca en 24 horas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
