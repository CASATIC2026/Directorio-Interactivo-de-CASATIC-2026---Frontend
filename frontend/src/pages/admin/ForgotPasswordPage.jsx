import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, Lock, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import api from "../../api/client";
import { validatePassword, validatePasswordMatch, validateEmail } from "../../lib/validators";
import logo from "../../img/logo.png";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState("");

  const passwordValidation = validatePassword(newPassword);
  const matchValidation = validatePasswordMatch(newPassword, confirmPassword);
  const isPasswordMatch = passwordValidation.isValid && matchValidation.match;
  const isEmailValid = validateEmail(email);

  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[^a-zA-Z0-9]/.test(newPassword);

  const goBack = () => { setStep(s => s - 1); setError(""); setSuccess(""); setDevToken(""); };

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setDevToken(""); setLoading(true);
    try {
      const { data } = await api.post('/auth/recuperar-password', { email });
      if (data?.devOnly_token) {
        setDevToken(data.devOnly_token);
        setSuccess("Se envió un código de recuperación. Usa el token de desarrollo si no recibes el email.");
      } else {
        setSuccess("Se envió un código de recuperación a tu email.");
      }
      setTimeout(() => { setSuccess(""); setStep(2); }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al enviar el código de recuperación.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidateToken = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await api.post('/auth/validar-token-recuperacion', { email, token });
      setSuccess("Código validado exitosamente.");
      setTimeout(() => { setSuccess(""); setStep(3); }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Código inválido o expirado.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    if (!isPasswordMatch) {
      setError("Las contraseñas no coinciden o no cumplen los requisitos.");
      setLoading(false);
      return;
    }
    try {
      await api.post('/auth/restablecer-password', { email, token, nuevaPassword: newPassword });
      setSuccess("Contraseña cambiada. Redirigiendo al login…");
      setTimeout(() => navigate("/admin/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  const STEPS = [
    { label: 'Email', num: 1 },
    { label: 'Código', num: 2 },
    { label: 'Nueva', num: 3 },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-casatic-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-elevated overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-casatic-600 to-casatic-800 p-7 text-center">
            <img src={logo} alt="CASATIC" className="h-11 mx-auto mb-4 opacity-90" />
            <h1 className="text-xl font-bold text-white tracking-tight">Recuperar Contraseña</h1>
            <p className="text-casatic-200 text-xs mt-1">Panel de Administración</p>
          </div>

          {/* Progress */}
          <div className="px-7 pt-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-surface-100 z-0" />
              {STEPS.map(({ label, num }) => (
                <div key={num} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${
                    step > num
                      ? 'bg-casatic-600 border-casatic-600 text-white'
                      : step === num
                      ? 'bg-white border-casatic-600 text-casatic-600'
                      : 'bg-white border-surface-200 text-surface-400'
                  }`}>
                    {step > num ? <CheckCircle2 size={18} /> : num}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                    step >= num ? 'text-casatic-600' : 'text-surface-400'
                  }`}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="p-7 pt-5">

            {error && (
              <div className="alert-error mb-4">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="alert-success mb-4">
                <CheckCircle2 size={16} className="flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}
            {devToken && (
              <div className="alert-info mb-4 rounded-xl border border-casatic-200 bg-casatic-50 p-4 text-sm text-surface-800">
                <p className="font-semibold">Token de desarrollo:</p>
                <pre className="mt-2 overflow-x-auto rounded bg-surface-100 p-3 text-[13px] text-surface-700">{devToken}</pre>
              </div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <form onSubmit={handleRequestToken} className="space-y-4">
                <div>
                  <label className="input-label">Email de la cuenta a recuperar</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                      type="email" required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@dominio.com"
                      className="input-field pl-10"
                    />
                  </div>
                  <p className="text-xs text-surface-400 mt-1">
                    Ingresa el email de la persona cuya contraseña quieres recuperar.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="btn-primary w-full py-3"
                >
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Enviando…</> : 'Enviar código de recuperación'}
                </button>
              </form>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <form onSubmit={handleValidateToken} className="space-y-4">
                <div>
                  <label className="input-label">Código de recuperación</label>
                  <input
                    type="text" required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Copia el código del email"
                    className="input-field font-mono text-center text-lg tracking-widest"
                  />
                  <p className="text-xs text-surface-400 mt-1">
                    Revisa tu email (incluyendo la carpeta de spam).
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading || !token}
                  className="btn-primary w-full py-3"
                >
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Validando…</> : 'Validar código'}
                </button>
                <button type="button" onClick={goBack} className="btn-secondary w-full">
                  <ArrowLeft size={15} /> Volver
                </button>
              </form>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="input-label flex items-center gap-1.5">
                    <Lock size={13} className="text-surface-400" /> Nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'} required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mín. 8 caracteres, mayúscula, número y especial"
                      className="input-field pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {newPassword.length > 0 && (
                    <ul className="mt-2 space-y-0.5 text-[11px]">
                      <li className={hasMinLength ? 'text-emerald-600' : 'text-surface-400'}>{hasMinLength ? '✓' : '○'} Mínimo 8 caracteres</li>
                      <li className={hasUpper ? 'text-emerald-600' : 'text-surface-400'}>{hasUpper ? '✓' : '○'} Una letra mayúscula</li>
                      <li className={hasNumber ? 'text-emerald-600' : 'text-surface-400'}>{hasNumber ? '✓' : '○'} Un número</li>
                      <li className={hasSpecial ? 'text-emerald-600' : 'text-surface-400'}>{hasSpecial ? '✓' : '○'} Un carácter especial (!@#$…)</li>
                    </ul>
                  )}
                </div>
                <div>
                  <label className="input-label">Confirmar contraseña</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'} required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita la contraseña"
                      className={`input-field pr-11 ${
                        confirmPassword
                          ? isPasswordMatch ? 'border-emerald-400 focus:ring-emerald-300' : 'border-red-400 focus:ring-red-300'
                          : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                    >
                      {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && newPassword === confirmPassword && (
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Las contraseñas coinciden
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading || !isPasswordMatch}
                  className="btn-primary w-full py-3"
                >
                  {loading
                    ? <><Loader2 size={16} className="animate-spin" /> Cambiando…</>
                    : <><ShieldCheck size={16} /> Cambiar contraseña</>}
                </button>
                <button type="button" onClick={goBack} className="btn-secondary w-full">
                  <ArrowLeft size={15} /> Volver
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="bg-surface-50 px-7 py-4 border-t border-surface-100 flex items-center justify-between">
            <span className="text-xs text-surface-500">¿Recuerdas tu contraseña?</span>
            <Link to="/admin/login" className="text-casatic-600 hover:text-casatic-700 font-semibold text-sm flex items-center gap-1">
              <ArrowLeft size={13} /> Ir al login
            </Link>
          </div>
        </div>

        {/* Help hint */}
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white text-xs">
          <p className="font-semibold mb-1.5 flex items-center gap-1.5">
            <ShieldCheck size={13} /> Ayuda
          </p>
          <ul className="space-y-0.5 text-white/80">
            <li>• Revisa tu email incluyendo la carpeta de spam.</li>
            <li>• Si no recibiste el código, espera 1 minuto antes de reintentar.</li>
            <li>• El código caduca en 24 horas.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
