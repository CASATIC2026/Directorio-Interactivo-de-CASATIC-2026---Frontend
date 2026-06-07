import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Building2, Users, LogOut, ChevronRight,
  PanelLeftClose, PanelLeft, Menu, X, Inbox, BarChart3, Calendar,
  Moon, Sun, Receipt, Bell, Check, FileText, CreditCard,
  Camera, User, KeyRound, ChevronDown, Shield,
} from 'lucide-react';
import casaticLogo from '../../img/Reverse - v2@4x.png';
import casaticMoonLogo from '../../img/casatic-moon.png';
import { useNotifications } from '../../hooks/useNotifications';

/* ─── helpers ─────────────────────────────────── */
function timeAgo(iso) {
  if (!iso) return '';
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return 'hace un momento';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
}

function NotifIcon({ type }) {
  if (type === 'formulario') return <FileText size={14} className="text-casatic-400" />;
  if (type === 'factura') return <CreditCard size={14} className="text-accent-500" />;
  return <Bell size={14} className="text-surface-400" />;
}

/* ─── NotificationBell ────────────────────────── */
function NotificationBell({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { notifications, unreadCount, loading, markAllRead } = useNotifications(user);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-xl text-surface-400 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-white/[0.06] hover:text-surface-700 dark:hover:text-white transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-0.5 animate-pulse-soft">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 z-50 rounded-2xl border border-surface-200 dark:border-white/[0.08] bg-white dark:bg-[#13132a] shadow-elevated animate-fade-in-down overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100 dark:border-white/[0.06]">
            <span className="text-sm font-bold text-surface-900 dark:text-white">Notificaciones</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-casatic-500 hover:text-casatic-600 font-semibold transition-colors"
              >
                <Check size={12} /> Marcar todo leído
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-surface-100 dark:divide-white/[0.04]">
            {loading && notifications.length === 0 && (
              <div className="py-8 text-center text-sm text-surface-400">Cargando...</div>
            )}
            {!loading && notifications.length === 0 && (
              <div className="py-8 text-center">
                <Bell size={28} className="mx-auto text-surface-300 dark:text-surface-600 mb-2" />
                <p className="text-sm text-surface-400 dark:text-surface-500">Sin notificaciones</p>
              </div>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                  n.read
                    ? 'bg-transparent'
                    : 'bg-casatic-50/60 dark:bg-casatic-900/20'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <NotifIcon type={n.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-surface-800 dark:text-surface-100 truncate">{n.title}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 truncate mt-0.5">{n.body}</p>
                  <p className="text-[10px] text-surface-400 dark:text-surface-600 mt-1">{timeAgo(n.timestamp)}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-casatic-500 flex-shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ProfileMenu ─────────────────────────────── */
function ProfileMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState(() => localStorage.getItem(`casatic_avatar_${user?.id}`) || null);
  const ref = useRef(null);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result;
      localStorage.setItem(`casatic_avatar_${user?.id}`, b64);
      setAvatar(b64);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    localStorage.removeItem(`casatic_avatar_${user?.id}`);
    setAvatar(null);
  };

  const initial = user?.email?.charAt(0).toUpperCase() || 'U';
  const rolLabel = user?.rol === 'Admin' ? 'Administrador' : user?.rol === 'Socio' ? 'Socio' : user?.rol;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-colors group"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-casatic-500/30 group-hover:ring-casatic-500/60 transition-all">
          {avatar ? (
            <img src={avatar} alt="perfil" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-casatic-500 to-casatic-700 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{initial}</span>
            </div>
          )}
        </div>
        <ChevronDown size={14} className={`text-surface-400 dark:text-surface-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-72 z-50 rounded-2xl border border-surface-200 dark:border-white/[0.08] bg-white dark:bg-[#13132a] shadow-elevated animate-fade-in-down overflow-hidden">
          {/* User info */}
          <div className="px-4 py-4 border-b border-surface-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-casatic-500/40">
                  {avatar ? (
                    <img src={avatar} alt="perfil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-casatic-500 to-casatic-700 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">{initial}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  title="Cambiar foto"
                >
                  <Camera size={14} className="text-white" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                  {user?.nombre || user?.email?.split('@')[0] || 'Usuario'}
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{user?.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold bg-casatic-50 dark:bg-casatic-900/30 text-casatic-700 dark:text-casatic-300 px-2 py-0.5 rounded-full">
                  <Shield size={9} /> {rolLabel}
                </span>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>

          {/* Actions */}
          <div className="p-2 space-y-0.5">
            <button
              onClick={() => { fileRef.current?.click(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.05] transition-colors text-left"
            >
              <Camera size={16} className="text-surface-400 dark:text-surface-500" />
              <span>Cambiar foto de perfil</span>
            </button>
            {avatar && (
              <button
                onClick={() => { removePhoto(); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              >
                <User size={16} />
                <span>Quitar foto</span>
              </button>
            )}
            <button
              onClick={() => { navigate('/admin/cambiar-password'); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.05] transition-colors text-left"
            >
              <KeyRound size={16} className="text-surface-400 dark:text-surface-500" />
              <span>Cambiar contraseña</span>
            </button>
          </div>

          <div className="p-2 border-t border-surface-100 dark:border-white/[0.06]">
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
            >
              <LogOut size={16} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── SidebarContent ──────────────────────────── */
function SidebarContent({ collapsed, user, menuItems, isActive, handleLogout, onLinkClick }) {
  return (
    <>
      <div className={`h-16 flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-4'} border-b border-white/[0.06] flex-shrink-0`}>
        {collapsed ? (
          <div className="h-9 w-9 flex items-center justify-center flex-shrink-0">
            <img src={casaticMoonLogo} alt="CASATIC" className="h-full w-full object-contain brightness-0 invert" />
          </div>
        ) : (
          <div className="h-9 flex items-center px-1 flex-shrink-0">
            <img src={casaticLogo} alt="CASATIC" className="h-full w-auto object-contain" />
          </div>
        )}
        {!collapsed && (
          <div className="animate-fade-in">
            <p className="text-[10px] text-surface-500 uppercase tracking-widest">Admin Panel</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
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
            <p className="text-[10px] text-surface-600 mt-0.5">
              {user.rol === 'Admin' ? 'Administrador' : user.rol === 'Socio' ? 'Socio' : user.rol}
            </p>
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

/* ─── AdminLayout ─────────────────────────────── */
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('admin-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('admin-dark-mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.primerLogin) return <Navigate to="/admin/cambiar-password" replace />;

  const socioAllowed = ['/admin/mi-empresa', '/admin/eventos', '/admin/formularios', '/admin/facturacion'];
  if (user.rol === 'Socio' && !socioAllowed.some(p => location.pathname.startsWith(p))) {
    return <Navigate to="/admin/mi-empresa" replace />;
  }

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const baseMenuItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true, roles: ['Admin'] },
    { to: '/admin/mi-empresa', label: 'Mi Empresa', icon: Building2, exact: true, roles: ['Socio'] },
    { to: '/admin/socios', label: 'Socios', icon: Building2, roles: ['Admin'] },
    { to: '/admin/eventos', label: 'Eventos', icon: Calendar, roles: ['Admin', 'Socio'] },
    { to: '/admin/facturacion', label: 'Facturación', icon: Receipt, roles: ['Admin', 'Socio'] },
    { to: '/admin/formularios', label: 'Mensajes Recibidos', icon: Inbox, roles: ['Socio'] },
    { to: '/admin/formularios', label: 'Formularios', icon: Inbox, roles: ['Admin'] },
    { to: '/admin/reportes', label: 'Reportes', icon: BarChart3, roles: ['Admin'] },
    { to: '/admin/usuarios', label: 'Usuarios', icon: Users, roles: ['Admin'] },
  ];

  const menuItems = baseMenuItems.filter(item => item.roles && item.roles.includes(user.rol));
  const isActive = (item) => item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-[#0c0c1d] transition-colors duration-200">

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-surface-950 text-white flex flex-col
          transition-transform duration-300 ease-out lg:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-surface-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
        <SidebarContent collapsed={false} user={user} menuItems={menuItems} isActive={isActive} handleLogout={handleLogout} onLinkClick={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex ${collapsed ? 'w-[72px]' : 'w-64'} bg-surface-950 text-white flex-col transition-all duration-300 ease-out relative flex-shrink-0`}>
        <SidebarContent collapsed={collapsed} user={user} menuItems={menuItems} isActive={isActive} handleLogout={handleLogout} onLinkClick={undefined} />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* Header */}
        <header className="h-16 bg-white dark:bg-[#13132a] border-b border-surface-200 dark:border-white/[0.06] flex items-center justify-between px-4 sm:px-6 flex-shrink-0 transition-colors duration-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-surface-400 hover:bg-surface-100 dark:hover:bg-white/[0.06] hover:text-surface-700 dark:hover:text-white transition-colors"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-2 rounded-xl text-surface-400 dark:text-surface-500 hover:bg-surface-100 dark:hover:bg-white/[0.06] hover:text-surface-700 dark:hover:text-white transition-colors"
            >
              {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <span className="lg:hidden font-bold text-surface-900 dark:text-white text-sm">Panel CASATIC</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Dark mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-surface-400 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-white/[0.06] hover:text-surface-700 dark:hover:text-amber-300 transition-colors"
              title={darkMode ? 'Modo claro' : 'Modo oscuro'}
            >
              {darkMode
                ? <Sun size={20} className="text-amber-400" />
                : <Moon size={20} />
              }
            </button>

            {/* Notifications */}
            <NotificationBell user={user} />

            {/* Divider */}
            <div className="w-px h-6 bg-surface-200 dark:bg-white/[0.08] mx-1" />

            {/* Profile */}
            <ProfileMenu user={user} onLogout={handleLogout} />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto bg-surface-50 dark:bg-[#0c0c1d] transition-colors duration-200">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
