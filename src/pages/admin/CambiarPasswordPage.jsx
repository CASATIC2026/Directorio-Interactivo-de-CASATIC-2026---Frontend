import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CambiarPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState(null);
  const { cambiarPassword } = useAuth();
  const navigate = useNavigate();

  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const hasMinLength = password.length >= 8;
  const isValid = hasUpper && hasNumber && hasSpecial && hasMinLength;

  const strength = [hasMinLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthColors = ['bg-red-400', 'bg-amber-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500'];
  const strengthLabels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Fuerte'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isValid) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await cambiarPassword(password);
      navigate('/admin');
    } catch (err) {
      setError('Error al cambiar la contraseña');
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-casatic-600/15 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in-up">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-elevated p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mb-4 shadow-lg shadow-amber-500/25">
              <ShieldCheck size={30} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Cambiar Contraseña</h1>
            <p className="text-surface-500 text-sm mt-1">
              Es su primer inicio de sesión. Establezca una contraseña segura.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label flex items-center gap-1.5">
                <Lock size={13} className="text-surface-400" />
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'} required minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-11"
                  placeholder="Mín. 8 caracteres, mayúscula, número y especial"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Strength meter */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                        i < strength ? strengthColors[strength] : 'bg-surface-200'
                      }`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-surface-500">{strengthLabels[strength]}</p>
                  <ul className="space-y-0.5 text-[11px]">
                    <li className={hasMinLength ? 'text-emerald-600' : 'text-surface-400'}>
                      {hasMinLength ? '✓' : '○'} Mínimo 8 caracteres
                    </li>
                    <li className={hasUpper ? 'text-emerald-600' : 'text-surface-400'}>
                      {hasUpper ? '✓' : '○'} Una letra mayúscula
                    </li>
                    <li className={hasNumber ? 'text-emerald-600' : 'text-surface-400'}>
                      {hasNumber ? '✓' : '○'} Un número
                    </li>
                    <li className={hasSpecial ? 'text-emerald-600' : 'text-surface-400'}>
                      {hasSpecial ? '✓' : '○'} Un carácter especial (!@#$...)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="input-label">Confirmar Contraseña</label>
              <input
                type="password" required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input-field"
                placeholder="Repita la contraseña"
              />
              {confirm.length > 0 && password === confirm && (
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Las contraseñas coinciden
                </p>
              )}
            </div>

            {error && (
              <div className="alert-error">
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-3 text-base bg-amber-500 hover:bg-amber-600 focus:ring-amber-400"
            >
              <ShieldCheck size={20} />
              Guardar Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
