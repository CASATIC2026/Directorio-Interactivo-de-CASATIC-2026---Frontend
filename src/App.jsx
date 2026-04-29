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
const PresentacionPage   = lazy(() => import('./pages/public/PresentacionPage'));
const PublicLoginPage    = lazy(() => import('./pages/public/LoginPage'));
const InnovacionPage     = lazy(() => import('./pages/public/EJEESESTRATEGICOS DE CASATIC/InnovacionPage'));
const ExportacionPage    = lazy(() => import('./pages/public/EJEESESTRATEGICOS DE CASATIC/ExportacionPage'));
const PoliticasPublicasPage = lazy(() => import('./pages/public/EJEESESTRATEGICOS DE CASATIC/PoliticaspublicasPage'));
const TalentoHumanoPage  = lazy(() => import('./pages/public/EJEESESTRATEGICOS DE CASATIC/TalentohumanoPage'));
const ConvenioInnovacionPage = lazy(() => import('./pages/public/Convenios/ConvenioInnovacionPage'));
const ConvenioBritapage  = lazy(() => import('./pages/public/Convenios/ConvenioBritapage'));
const Convenioproyectosocialpage = lazy(() => import('./pages/public/Convenios/Convenioproyectosocialpage'));
const ConveniougbPage    = lazy(() => import('./pages/public/Convenios/ConveniougbPage'));
const ConvenioUOPage     = lazy(() => import('./pages/public/Convenios/ConvenioUOPage'));

const ForgotPasswordPage = lazy(() => import('./pages/admin/ForgotPasswordPage'));
const CambiarPasswordPage = lazy(() => import('./pages/admin/CambiarPasswordPage'));
const DashboardPage      = lazy(() => import('./pages/admin/DashboardPage'));
const MiEmpresaPage      = lazy(() => import('./pages/admin/MiEmpresaPage'));
const SociosAdminPage    = lazy(() => import('./pages/admin/SociosAdminPage'));
const UsuariosAdminPage  = lazy(() => import('./pages/admin/UsuariosAdminPage'));
const SocioFormPage      = lazy(() => import('./pages/admin/SocioFormPage'));
const FormulariosAdminPage = lazy(() => import('./pages/admin/FormulariosAdminPage'));
const ReportesPage       = lazy(() => import('./pages/admin/ReportesPage'));


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
          <Route path="/presentacion" element={<PresentacionPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/socio/:slug" element={<MicroSitioPage />} />

          <Route path="/login" element={<PublicLoginPage />} />
          <Route path="/politicaspublicas" element={<PoliticasPublicasPage />} />
          <Route path="/exportacion" element={<ExportacionPage />} />
          <Route path="/talentohumano" element={<TalentoHumanoPage />} />
          <Route path="/innovacion" element={<InnovacionPage />} />
          {/*                      los convenios carpeta*/}
          <Route path="/convenio_innovacion" element={<ConvenioInnovacionPage />} />
          <Route path="/convenio_brita" element={<ConvenioBritapage />} />
          <Route path="/convenio_proyeccion" element={<Convenioproyectosocialpage />} />
          <Route path="/convenio_ugb" element={<ConveniougbPage />} />
          <Route path="/convenio_uo" element={<ConvenioUOPage />} />
   </Route>

        {/* ── Rutas Admin ────────────────────────────────── */}
        <Route path="/admin/login" element={<PublicLoginPage />} />
        <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/admin/cambiar-password" element={<CambiarPasswordPage />} />

        {/* Protegidas */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />


          <Route path="/admin/mi-empresa" element={<MiEmpresaPage />} />
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
