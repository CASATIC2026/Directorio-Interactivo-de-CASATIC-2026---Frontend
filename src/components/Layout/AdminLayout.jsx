import { useState, useEffect } from 'react';
import { Outlet, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Building2, Users, LogOut, ChevronRight,
  PanelLeftClose, PanelLeft, Bell, Menu, X, Inbox, BarChart3
} from 'lucide-react';
import casaticLogo from '../../img/Reverse - v2@4x.png';

/* ─── SidebarContent ─── reusable inside both desktop & mobile drawer */
function SidebarContent({ collapsed, user, menuItems, isActive, handleLogout, onLinkClick }) {
  return (
    <>
      <div className="h-16 flex items-center gap-3 px-4 border-b border-white/[0.06] flex-shrink-0">
        <div className="h-9 flex items-center px-1 flex-shrink-0">
          <img src={casaticLogo} alt="CASATIC" className="h-full w-auto object-contain" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <p className="text-[10px] text-surface-500 uppercase tracking-widest">Admin Panel</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                active
                  ? 'bg-[#0c9ec6] text-white shadow-lg shadow-[#0c9ec6]/25'
                  : 'text-surface-400 hover:bg-white/[0.06] hover:text-white'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <>
                  <span>{item.label}</span>
                  <ChevronRight size={14} className={`ml-auto transition-transform ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                </>
              )}
              {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 w-1 h-5 bg-[#3df0d8] rounded-full" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/[0.06] flex-shrink-0">
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-surface-500 truncate">{user.email}</p>
            <p className="text-[10px] text-surface-600 mt-0.5">{user.rol === 'Admin' ? 'Administrador' : 'Socio'}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-surface-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full"
          title={collapsed ? 'Cerrar sesión' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.primerLogin) return <Navigate to="/admin/cambiar-password" replace />;

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const menuItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/socios', label: 'Socios', icon: Building2 },
    { to: '/admin/formularios', label: 'Formularios', icon: Inbox },
    { to: '/admin/reportes', label: 'Reportes', icon: BarChart3 },
    { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  ];

  const isActive = (item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

  return (
    <div className="min-h-screen flex bg-surface-50">

      {/* ── Mobile overlay backdrop ───────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer sidebar ─────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-surface-950 text-white flex flex-col
          transition-transform duration-300 ease-out
          lg:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-surface-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
        <SidebarContent
          collapsed={false}
          user={user}
          menuItems={menuItems}
          isActive={isActive}
          handleLogout={handleLogout}
          onLinkClick={() => setMobileOpen(false)}
        />
      </aside>

      {/* ── Desktop sidebar (static) ──────────────────── */}
      <aside
        className={`hidden lg:flex ${collapsed ? 'w-[72px]' : 'w-64'} bg-surface-950 text-white flex-col
          transition-all duration-300 ease-out relative flex-shrink-0`}
      >
        <SidebarContent
          collapsed={collapsed}
          user={user}
          menuItems={menuItems}
          isActive={isActive}
          handleLogout={handleLogout}
          onLinkClick={undefined}
        />
      </aside>

      {/* ── Main area ────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-surface-200/50 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors"
            >
              <Menu size={20} />
            </button>
            {/* Desktop collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-2 rounded-xl text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors"
            >
              {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
            </button>
            {/* Brand name on mobile */}
            <span className="lg:hidden font-bold text-surface-900 text-sm">CASATIC Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-casatic-500 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-casatic-100 rounded-full flex items-center justify-center ml-1">
              <span className="text-xs font-bold text-casatic-700">{user.email?.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto bg-mesh">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
