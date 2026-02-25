import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Building2, Search, Home, Menu, X, ChevronRight } from 'lucide-react';

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <Building2 className="w-6 h-6" />
            CASATIC
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-6">
            <Link
              to="/"
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition ${
                isActive('/') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              Inicio
            </Link>
            <Link
              to="/directorio"
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition ${
                isActive('/directorio') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Search className="w-4 h-4" />
              Directorio
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 bg-white">
            <Link
              to="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/directorio"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Directorio
            </Link>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-2">CASATIC</h3>
              <p className="text-sm">Directorio interactivo de socios y empresas.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">Navegación</h3>
              <ul className="text-sm space-y-1">
                <li><Link to="/" className="hover:text-white">Inicio</Link></li>
                <li><Link to="/directorio" className="hover:text-white">Directorio</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">Contacto</h3>
              <p className="text-sm">contacto@casatic.org</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4 text-center text-sm">
            <p>&copy; 2026 CASATIC. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
