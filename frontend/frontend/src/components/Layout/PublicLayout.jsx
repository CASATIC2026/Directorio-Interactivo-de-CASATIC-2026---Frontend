import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Search, Home, Menu, X, Grid3X3, Mail, HelpCircle, Info, LogIn,
  Phone, MapPin, Facebook, Linkedin, Instagram, Youtube, Calendar
} from 'lucide-react';
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
    { to: '/',           label: 'Inicio',       icon: Home },
    { to: '/directorio', label: 'Directorio',   icon: Search },
    { to: '/eventos',    label: 'Eventos',      icon: Calendar },
    { to: '/presentacion', label: 'Presentación', icon: Info },
    { to: '/categorias', label: 'Categorías',   icon: Grid3X3 },
    { to: '/contacto',   label: 'Contacto',     icon: Mail },
    { to: '/faq',        label: 'FAQ',          icon: HelpCircle },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">

      {/* ── Navbar ──────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-sm border-b border-surface-200'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center group flex-shrink-0">
              <div className="h-9 flex items-center">
                <img
                  src={scrolled ? colorLogo : reverseLogo}
                  alt="CASATIC"
                  className="h-full w-auto object-contain transition-all duration-300"
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? scrolled
                        ? 'bg-casatic-50 text-casatic-700'
                        : 'bg-white/15 text-white'
                      : scrolled
                        ? 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <link.icon size={15} />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className={`hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  scrolled
                    ? 'bg-casatic-600 text-white hover:bg-casatic-700 shadow-md hover:shadow-lg'
                    : 'bg-white/15 text-white border border-white/30 hover:bg-white/25 backdrop-blur-sm'
                }`}
              >
                <LogIn size={15} />
                Acceso Socios
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden p-2 rounded-xl transition-colors ${
                  scrolled ? 'text-surface-700 hover:bg-surface-100' : 'text-white hover:bg-white/10'
                }`}
                aria-label="Abrir menú"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-surface-200 animate-fade-in-down shadow-sm">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-casatic-50 text-casatic-700'
                      : 'text-surface-600 hover:bg-surface-50'
                  }`}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-surface-100 mt-2">
                <Link
                  to="/login"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-casatic-600 text-white"
                >
                  <LogIn size={16} />
                  Acceso Socios
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Contenido ───────────────────────────────────── */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="bg-surface-900 text-surface-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Marca */}
            <div className="lg:col-span-1">
              <div className="h-9 mb-4">
                <img src={reverseLogo} alt="CASATIC" className="h-full w-auto object-contain" />
              </div>
              <p className="text-sm leading-relaxed text-surface-500 mb-5">
                Cámara de Tecnologías de Información y Comunicación de El Salvador.
                Conectando empresas líderes en tecnología.
              </p>
              <div className="flex items-center gap-2">
                {[
                  { href: 'https://www.facebook.com/casatic/', Icon: Facebook, label: 'Facebook' },
                  { href: 'https://www.linkedin.com/company/casatic/', Icon: Linkedin, label: 'LinkedIn' },
                  { href: 'https://www.instagram.com/casaticsv/', Icon: Instagram, label: 'Instagram' },
                  { href: 'https://www.youtube.com/@casaticsv', Icon: Youtube, label: 'YouTube' },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 bg-surface-800 hover:bg-casatic-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Navegación */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Navegación</h4>
              <ul className="space-y-2.5">
                {[
                  { to: '/', label: 'Inicio' },
                  { to: '/directorio', label: 'Directorio de Socios' },
                  { to: '/presentacion', label: 'Presentación' },
                  { to: '/categorias', label: 'Categorías' },
                  { to: '/ejes-estrategicos', label: 'Ejes Estratégicos' },
                  { to: '/faq', label: 'Preguntas Frecuentes' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-surface-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socios */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Área de Socios</h4>
              <ul className="space-y-2.5">
                {[
                  { to: '/login', label: 'Iniciar Sesión' },
                  { to: '/admin/forgot-password', label: 'Recuperar Contraseña' },
                  { to: '/contacto', label: 'Contactar CASATIC' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-surface-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Contacto</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-sm text-surface-500">
                  <Phone size={14} className="text-casatic-500 flex-shrink-0" />
                  (+503) 2563-5255
                </li>
                <li className="flex items-center gap-2.5 text-sm text-surface-500">
                  <Phone size={14} className="text-casatic-500 flex-shrink-0" />
                  (+503) 7200-8901
                </li>
                <li className="flex items-center gap-2.5 text-sm text-surface-500">
                  <Mail size={14} className="text-casatic-500 flex-shrink-0" />
                  <a href="mailto:info@casatic.org" className="hover:text-white transition-colors">
                    info@casatic.org
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-surface-500">
                  <MapPin size={14} className="text-casatic-500 flex-shrink-0 mt-0.5" />
                  Calle Francisco Gavidia Block #161, Edificio 8-B, Col. Escalón, San Salvador.
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-surface-600">
              &copy; {new Date().getFullYear()} CASATIC. Todos los derechos reservados.
            </p>
            <p className="text-xs text-surface-700">Desarrollado con React + .NET 8</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
