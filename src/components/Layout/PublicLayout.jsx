import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, Home, Menu, X, Grid3X3, Mail, HelpCircle, Info } from 'lucide-react';
import colorLogo from '../../img/Full Color v2@4x.png';
import reverseLogo from '../../img/Reverse - v2@4x.png';

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
    { to: '/presentacion', label: 'Presentación', icon: Info },
    { to: '/categorias', label: 'Categorías', icon: Grid3X3 },
    { to: '/contacto', label: 'Contacto', icon: Mail },
    { to: '/faq', label: 'FAQ', icon: HelpCircle },
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
            <Link to="/" className="flex items-center group">
              <div className="h-10 flex items-center">
                <img
                  src={scrolled ? colorLogo : reverseLogo}
                  alt="CASATIC"
                  className="h-full w-auto object-contain transition-all duration-300"
                />
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
                <div className="h-9 flex items-center">
                  <img src={reverseLogo} alt="CASATIC" className="h-full w-auto object-contain" />
                </div>
                <div>
                  
                  <p className="text-xs text-surface-500">Directorio Interactivo 2026</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-surface-500">
                Cámara de Tecnologías de Información y Comunicación de El Salvador.
                Conectando empresas líderes en tecnología.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navegación</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm hover:text-white transition-colors">Inicio</Link></li>
                <li><Link to="/directorio" className="text-sm hover:text-white transition-colors">Directorio de Socios</Link></li>
                <li><Link to="/presentacion" className="text-sm hover:text-white transition-colors">Presentación</Link></li>
                <li><Link to="/admin/login" className="text-sm hover:text-white transition-colors">Panel de Administración</Link></li>
                <li><Link to="/categorias" className="text-sm hover:text-white transition-colors">Categorías</Link></li>
                <li><Link to="/contacto" className="text-sm hover:text-white transition-colors">Contacto</Link></li>
                <li><Link to="/faq" className="text-sm hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm">
             <li>Teléfono: (+503) 2563-5255</li>
                <li>Celular: (+503) 7200-8901</li>
              </ul>
              <br />
              <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Dirección</h4>
              <p className="text-sm text-surface-500">
                Calle Francisco Gavidia Block #161, edificio 8-B, Col. Escalón, San Salvador.
              </p>
            </div>
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
