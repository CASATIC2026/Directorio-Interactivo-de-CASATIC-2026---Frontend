import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/Layout/PublicLayout';
import AdminLayout from './components/Layout/AdminLayout';

// ── Carga diferida de páginas (code splitting) ───────────────
const HomePage           = lazy(() => import('./pages/public/HomePage'));
const DirectorioPage     = lazy(() => import('./pages/public/DirectorioPage'));
const ContactoPage       = lazy(() => import('./pages/public/ContactoPage'));
const FAQPage            = lazy(() => import('./pages/public/FAQPage'));
const CategoriasPage     = lazy(() => import('./pages/public/CategoriasPage'));
const MicroSitioPage     = lazy(() => import('./pages/public/SocioDetallePage'));
const LoginPage          = lazy(() => import('./pages/public/LoginPage'));
const PresentacionPage     = lazy(() => import('./pages/public/PresentacionPage'));
const EjesEstrategicosPage = lazy(() => import('./pages/public/EjesEstrategicosPage'));
const ForgotPasswordPage = lazy(() => import('./pages/admin/ForgotPasswordPage'));
const CambiarPasswordPage = lazy(() => import('./pages/admin/CambiarPasswordPage'));
const DashboardPage      = lazy(() => import('./pages/admin/DashboardPage'));
const MiEmpresaPage      = lazy(() => import('./pages/admin/MiEmpresaPage'));
const SociosAdminPage    = lazy(() => import('./pages/admin/SociosAdminPage'));
const UsuariosAdminPage  = lazy(() => import('./pages/admin/UsuariosAdminPage'));
const SocioFormPage      = lazy(() => import('./pages/admin/SocioFormPage'));
const FormulariosAdminPage = lazy(() => import('./pages/admin/FormulariosAdminPage'));
const ReportesPage       = lazy(() => import('./pages/admin/ReportesPage'));
const EventosAdminPage   = lazy(() => import('./pages/admin/EventosAdminPage'));
const EventosPage        = lazy(() => import('./pages/public/EventosPage'));
const FacturacionPage    = lazy(() => import('./pages/admin/FacturacionPage'));


/** Spinner de transición mientras carga el chunk */
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-casatic-200 border-t-casatic-600 rounded-full animate-spin" />
        <p className="text-sm text-surface-400 font-medium">Cargando…</p>
      </div>
    </div>
  );
}

/**
 * App principal: rutas públicas y admin.
 */
export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Rutas Públicas ─────────────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/directorio" element={<DirectorioPage />} />
          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/presentacion" element={<PresentacionPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/socio/:slug" element={<MicroSitioPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ejes-estrategicos" element={<EjesEstrategicosPage />} />  
        </Route>

        {/* ── Rutas Admin ────────────────────────────────── */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/admin/cambiar-password" element={<CambiarPasswordPage />} />

        {/* Protegidas */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/mi-empresa" element={<MiEmpresaPage />} />
          <Route path="/admin/eventos" element={<EventosAdminPage />} />
          <Route path="/admin/facturacion" element={<FacturacionPage />} />
          <Route path="/admin/socios" element={<SociosAdminPage />} />
          <Route path="/admin/socios/nuevo" element={<SocioFormPage />} />
          <Route path="/admin/socios/:id" element={<SocioFormPage />} />
          <Route path="/admin/usuarios" element={<UsuariosAdminPage />} />
          <Route path="/admin/formularios" element={<FormulariosAdminPage />} />
          <Route path="/admin/reportes" element={<ReportesPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
