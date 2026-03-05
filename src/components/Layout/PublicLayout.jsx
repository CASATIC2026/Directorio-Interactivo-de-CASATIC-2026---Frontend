import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Building2, Search, Home, Menu, X, ChevronRight } from 'lucide-react';

export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Inicio', icon: Home },
    { to: '/directorio', label: 'Directorio', icon: Search },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      {/* ── Navbar con glassmorphism ────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-glass border-b border-surface-200/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                scrolled
                  ? 'bg-casatic-600 shadow-lg shadow-casatic-600/25'
                  : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <Building2 size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className={`text-lg font-bold leading-tight tracking-tight transition-colors duration-300 ${
                  scrolled ? 'text-surface-900' : 'text-white'
                }`}>
                  CASATIC
                </span>
                <span className={`text-[10px] font-medium uppercase tracking-widest leading-none transition-colors duration-300 ${
                  scrolled ? 'text-surface-400' : 'text-white/60'
                }`}>
                  Directorio 2026
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? scrolled
                        ? 'bg-casatic-50 text-casatic-700'
                        : 'bg-white/15 text-white'
                      : scrolled
                        ? 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
              <div className={`w-px h-6 mx-2 ${scrolled ? 'bg-surface-200' : 'bg-white/20'}`} />
              <Link
                to="/admin/login"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  scrolled
                    ? 'bg-casatic-600 text-white hover:bg-casatic-700 shadow-sm shadow-casatic-600/25'
                    : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm'
                }`}
              >
                Acceso Admin
                <ChevronRight size={14} />
              </Link>
            </nav>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-xl transition-colors ${
                scrolled ? 'text-surface-700 hover:bg-surface-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-surface-200/50 animate-fade-in-down">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.to) ? 'bg-casatic-50 text-casatic-700' : 'text-surface-600 hover:bg-surface-50'
                  }`}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
              <Link to="/admin/login" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-casatic-600 text-white">
                Acceso Admin <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Contenido ───────────────────────────────────── */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* ── Footer profesional ──────────────────────────── */}
      <footer className="bg-surface-900 text-surface-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-casatic-600 rounded-xl flex items-center justify-center">
                  <Building2 size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">CASATIC</p>
                  <p className="text-xs text-surface-500">Directorio Interactivo 2026</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-surface-500">
                Cámara de Tecnologías de Información y Comunicación de Honduras.
                Conectando empresas líderes en tecnología.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navegación</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm hover:text-white transition-colors">Inicio</Link></li>
                <li><Link to="/directorio" className="text-sm hover:text-white transition-colors">Directorio de Socios</Link></li>
                <li><Link to="/admin/login" className="text-sm hover:text-white transition-colors">Panel de Administración</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li>info@casatic.org</li>
                <li>Tegucigalpa, Honduras</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-surface-500">&copy; {new Date().getFullYear()} CASATIC. Todos los derechos reservados.</p>
            <p className="text-xs text-surface-600">Desarrollado con React + .NET 8</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
