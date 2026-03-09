import { useState, useEffect, useRef } from 'react';
import logo from '../../img/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, User, Lock, Home, Globe, Eye, EyeOff } from 'lucide-react';



const translations = {
  es: {
    welcome_msg: "¡BIENVENIDO!",
    user_placeholder: "Usuario",
    pass_placeholder: "Contraseña",
    remember_me: "Recordarme",
    btn_login: "Ingresar",
    forgot_pass: "¿Olvidaste tu contraseña?",
    btn_home: "Ir al Inicio",
    current_lang: "Español",
    dir: "ltr"
  },
  en: {
    welcome_msg: "WELCOME!",
    user_placeholder: "Username",
    pass_placeholder: "Password",
    remember_me: "Remember me",
    btn_login: "Login",
    forgot_pass: "Forgot password?",
    btn_home: "Back to Home",
    current_lang: "English",
    dir: "ltr"
  },
};

export default function LoginPage() {
  const [lang, setLang] = useState('es');
  const [showDropdown, setShowDropdown] = useState(false);
  const t = translations[lang];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div
      dir={t.dir}
      className="min-h-screen flex items-center justify-center bg-[#0E3877] relative"
      style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}
    >
      {/* Importación de Roboto Medium */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');`}
      </style>

      {/* Selector de idioma - Usando el Neutro #0A0A0A en el dropdown */}
      <div className="absolute top-5 right-5" ref={dropdownRef}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#0A0A0A]/40 transition"
          >
            <Globe size={16} /> {t.current_lang}
          </button>
          
          {showDropdown && (
            <div className="absolute mt-2 right-0 bg-white rounded-md shadow-xl w-40 z-50 overflow-hidden border border-[#0A0A0A]/10">
              {Object.keys(translations).map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    setLang(code);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[#0C9EC6]/10 text-[#0A0A0A] transition-colors border-b border-gray-50 last:border-none font-medium"
                >
                  {translations[code].current_lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tarjeta de login */}
      <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 w-[350px]">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-6 gap-2">
          <img
            src={logo}
            alt="Logo CASATIC"
            className="w-[170px] cursor-pointer hover:opacity-80 transition duration-300"
          />
        </div>
        
        <h2 className="text-center text-xl font-bold text-[#0A0A0A] mb-8 tracking-widest">
          {t.welcome_msg}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Input Usuario */}
          <div className="relative mb-4">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0E3877]" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-100 rounded-lg focus:border-[#0C9EC6] focus:outline-none transition-all placeholder:text-gray-400 text-[#0A0A0A] font-medium"
              placeholder={t.user_placeholder}
            />
          </div>

          {/* Input Password */}
          <div className="relative mb-3">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0E3877]" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-100 rounded-lg focus:border-[#0C9EC6] focus:outline-none transition-all placeholder:text-gray-400 text-[#0A0A0A] font-medium"
              placeholder={t.pass_placeholder}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0E3877] transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="flex items-center justify-between mb-8">
            <label className="flex items-center text-xs text-[#0A0A0A]/60 cursor-pointer select-none font-medium">
              <input type="checkbox" className="mr-2 accent-[#0E3877] w-4 h-4" /> {t.remember_me}
            </label>
            <Link to="/admin/forgot-password" size={14} className="text-[11px] text-[#0C9EC6] hover:text-[#0E3877] font-bold">
              {t.forgot_pass}
            </Link>
          </div>

          {error && (
            <div className="text-red-500 text-xs mb-4 text-center bg-red-50 py-2 rounded-lg border border-red-100 italic">
              {error}
            </div>
          )}

          {/* Botón Ingresar Principal */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0E3877] hover:bg-[#0C9EC6] text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg active:scale-95"
          >
            {loading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={20} />
                {t.btn_login}
              </>
            )}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-100"></div>
          <div className="px-3 text-[10px] text-gray-300 font-bold uppercase tracking-tighter">o</div>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        {/* Botón Home - Estilo Neutro */}
        <Link 
          to="/" 
          className="w-full py-2.5 bg-white border-2 border-[#0A0A0A] text-[#0A0A0A] text-sm font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#0A0A0A] hover:text-white transition-all duration-300 group"
        >
          <Home size={18} className="group-hover:scale-110 transition-transform" />
          {t.btn_home}
        </Link>
      </div>
    </div>
  );
}