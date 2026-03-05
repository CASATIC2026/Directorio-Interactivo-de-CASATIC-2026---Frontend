import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordSocios() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: integrar endpoint de recuperación de contraseña para socios
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0E3877]"
      style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');`}
      </style>

      <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 w-[350px]">
        <div className="flex flex-col items-center mb-6 gap-2">
          <img src="/src/img/lunalogo.png" alt="LunaLogo" className="w-[140px]" />
          <img src="/src/img/logo.png" alt="Logo" className="w-[170px]" />
        </div>

        <h2 className="text-center text-xl font-bold text-[#0A0A0A] mb-2 tracking-widest">
          RECUPERAR CONTRASEÑA
        </h2>
        <p className="text-center text-xs text-gray-400 mb-8">
          Ingresa tu correo y te enviaremos las instrucciones.
        </p>

        {sent ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <CheckCircle size={48} className="text-green-500" />
            <p className="text-center text-sm text-gray-600">
              Si el correo está registrado, recibirás las instrucciones en breve.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="relative mb-6">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0E3877]" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-100 rounded-lg focus:border-[#0C9EC6] focus:outline-none transition-all placeholder:text-gray-400 text-[#0A0A0A] font-medium"
                placeholder="Correo electrónico"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0E3877] hover:bg-[#0C9EC6] text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Mail size={18} />
                  Enviar instrucciones
                </>
              )}
            </button>
          </form>
        )}

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-100"></div>
          <div className="px-3 text-[10px] text-gray-300 font-bold uppercase tracking-tighter">o</div>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        <Link
          to="/login-socios"
          className="w-full py-2.5 bg-white border-2 border-[#0A0A0A] text-[#0A0A0A] text-sm font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#0A0A0A] hover:text-white transition-all duration-300 group"
        >
          <ArrowLeft size={18} className="group-hover:scale-110 transition-transform" />
          Volver al Login
        </Link>
      </div>
    </div>
  );
}
