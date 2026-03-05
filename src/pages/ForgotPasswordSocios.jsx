import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Smartphone, ArrowLeft, Globe } from "lucide-react";

// 👇 Importa el logo
import logo from "../../img/lunalogo.png";

const countryCodes = [
  { code: "+1", flag: "🇺🇸" },
  { code: "+34", flag: "🇪🇸" },
  { code: "+52", flag: "🇲🇽" },
  { code: "+503", flag: "🇸🇻" },
  { code: "+54", flag: "🇦🇷" },
  { code: "+57", flag: "🇨🇴" },
];

const translations = {
  es: {
    title: "RECUPERAR CONTRASEÑA",
    method_email: "Correo",
    method_phone: "Celular",
    email_placeholder: "Correo electrónico",
    phone_placeholder: "Número de celular",
    btn_send: "Enviar solicitud",
    btn_back: "Regresar",
    current_lang: "Español",
    success_msg: "Se ha enviado un enlace para la recuperación de contraseña.",
    error_msg: "Error al procesar la solicitud"
  },
  en: {
    title: "RECOVER PASSWORD",
    method_email: "Email",
    method_phone: "Phone",
    email_placeholder: "Example: admin@gmail.com",
    phone_placeholder: "Phone number",
    btn_send: "Send Request",
    btn_back: "Back",
    current_lang: "English",
    success_msg: "A password recovery email has been sent",
    error_msg: "Error processing request"
  },
};

export default function ForgotPasswordPage() {
  const [lang, setLang] = useState("es");
  const [showDropdown, setShowDropdown] = useState(false);
  const t = translations[lang];

  const [method, setMethod] = useState("email");
  const [contactValue, setContactValue] = useState("");
  const [selectedCode, setSelectedCode] = useState(countryCodes[3].code);
  const [error, setError] = useState(null);
  
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
      // Mensaje solicitado por el usuario
      alert(t.success_msg);
      navigate("/admin/login");
    } catch (err) {
      setError(t.error_msg);
    }
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone) => phone.length >= 4;

  const isFormValid =
    (method === "email" && isValidEmail(contactValue)) ||
    (method === "phone" && isValidPhone(contactValue));

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-[#0E3877] relative"
      style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');`}
      </style>
      
      {/* Selector de idioma */}
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
                  type="button"
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

      <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 w-[400px]">
        
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Logo"
            className="w-[150px] cursor-pointer hover:opacity-80 transition duration-300"
          />
        </div>

        <h2 className="text-center text-lg font-bold text-[#0A0A0A] mb-8 tracking-widest uppercase">
          {t.title}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Tabs de Selección de Método */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => { setMethod("email"); setContactValue(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition-all duration-300 ${
                method === "email" 
                ? "bg-[#0C9EC6] text-white shadow-md" 
                : "bg-gray-100 text-[#0A0A0A]/40 hover:bg-gray-200"
              }`}
            >
              <Mail size={16} /> {t.method_email}
            </button>
            <button
              type="button"
              onClick={() => { setMethod("phone"); setContactValue(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition-all duration-300 ${
                method === "phone" 
                ? "bg-[#0C9EC6] text-white shadow-md" 
                : "bg-gray-100 text-[#0A0A0A]/40 hover:bg-gray-200"
              }`}
            >
              <Smartphone size={16} /> {t.method_phone}
            </button>
          </div>

          {/* Input Único Dinámico */}
          <div className="mb-8">
            {method === "email" ? (
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0E3877]" size={18} />
                <input
                  type="email"
                  required
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-100 rounded-lg focus:border-[#0C9EC6] focus:outline-none transition-all placeholder:text-gray-400 text-[#0A0A0A] font-medium"
                  placeholder={t.email_placeholder}
                />
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                  className="px-2 py-2 border-2 border-gray-100 rounded-lg focus:border-[#0C9EC6] focus:outline-none bg-gray-50 text-[#0A0A0A] font-medium text-sm"
                >
                  {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  required
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  className="flex-1 px-3 py-2.5 border-2 border-gray-100 rounded-lg focus:border-[#0C9EC6] focus:outline-none transition-all placeholder:text-gray-400 text-[#0A0A0A] font-medium"
                  placeholder={t.phone_placeholder}
                />
              </div>
            )}
          </div>

          {error && <div className="text-red-500 text-xs mb-4 text-center italic">{error}</div>}

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3 font-bold rounded-lg transition-all duration-300 shadow-lg active:scale-95 ${
              isFormValid
                ? "bg-[#0E3877] hover:bg-[#0C9EC6] text-white shadow-[#0E3877]/20"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {t.btn_send}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-100"></div>
          <div className="px-3 text-[10px] text-gray-300 font-bold uppercase">o</div>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        <Link 
          to="/admin/login" 
          className="w-full py-2.5 bg-white border-2 border-[#0A0A0A] text-[#0A0A0A] text-sm font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#0A0A0A] hover:text-white transition-all duration-300 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          {t.btn_back}
        </Link>
      </div>
    </div>
  );
}