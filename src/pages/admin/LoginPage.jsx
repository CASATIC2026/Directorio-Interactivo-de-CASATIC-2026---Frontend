import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, User, Lock } from 'lucide-react';

const translations = {
  es: { welcome_msg: "¡Bienvenido!", user_placeholder: "Usuario", pass_placeholder: "Contraseña", remember_me: "Recordarme", btn_login: "Ingresar", forgot_pass: "¿Olvidaste tu contraseña?", register: "Regístrate", current_lang: "Español", dir: "ltr" },
  en: { welcome_msg: "Welcome!", user_placeholder: "Username", pass_placeholder: "Password", remember_me: "Remember me", btn_login: "Login", forgot_pass: "Forgot password?", register: "Register", current_lang: "English", dir: "ltr" },
  
};

export default function LoginPage() {
  const [lang, setLang] = useState('es');
  const t = translations[lang];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(email, password);
      if (data.primerLogin) {
        navigate('/admin/cambiar-password');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div dir={t.dir} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000079] via-[#005ab5] to-[#2894fe] relative">
      
      {/* Selector de idioma */}
      <div className="absolute top-5 right-5">
        <div className="relative">
          <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/30">
            🌐 {t.current_lang}
          </button>
          {/* Dropdown simple */}
          <div className="absolute mt-2 right-0 bg-white rounded-md shadow-lg w-40">
            {Object.keys(translations).map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-blue-100"
              >
                {translations[code].current_lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tarjeta de login */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-[300px]">
        <img src="/src/img/logo.png" alt="CASATIC Logo" className="w-[180px] mx-auto mb-3 cursor-pointer hover:scale-105 transition" />
        <h2 className="text-center text-xl font-bold text-gray-800 mb-4">{t.welcome_msg}</h2>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-3">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:border-blue-500 focus:outline-none"
              placeholder={t.user_placeholder}
            />
          </div>

          <div className="relative mb-3">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:border-blue-500 focus:outline-none"
              placeholder={t.pass_placeholder}
            />
          </div>

          <label className="flex items-center text-sm text-gray-600 mb-2 cursor-pointer">
            <input type="checkbox" className="mr-2 accent-blue-500" /> {t.remember_me}
          </label>

          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md flex items-center justify-center gap-2 transition"
          >
            <LogIn size={16} />
            {loading ? '...' : t.btn_login}
          </button>
        </form>

        <div className="text-center mt-3 text-sm">
          <a href="/forgot-password" className="text-blue-500 hover:underline">{t.forgot_pass}</a><br />
          <a href="/register" className="text-blue-500 hover:underline">{t.register}</a>
        </div>
      </div>
    </div>
  );
}
