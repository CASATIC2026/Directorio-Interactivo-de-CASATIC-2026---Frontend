import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/Layout/PublicLayout';
import AdminLayout from './components/Layout/AdminLayout';
import HomePage from './pages/public/HomePage';
import DirectorioPage from './pages/public/DirectorioPage';

import LoginPage from './pages/admin/LoginPage';
import LoginPageSocios from './pages/public/LoginPageSocios';
import ForgotPasswordPage from './pages/admin/ForgotPasswordPage'; // ✅ asegúrate que esté en la carpeta correcta
import ForgotPasswordSociosPage from './pages/public/ForgotPasswordSocios'; // ✅ nueva página para socios
import CambiarPasswordPage from './pages/admin/CambiarPasswordPage';
import DashboardPage from './pages/admin/DashboardPage';
import SociosAdminPage from './pages/admin/SociosAdminPage';
import UsuariosAdminPage from './pages/admin/UsuariosAdminPage';
import SocioFormPage from './pages/admin/SocioFormPage';
import MicroSitioPage from './pages/public/SocioDetallePage';


/**
 * App principal: rutas públicas y admin.
 */
export default function App() {
  return (
    <Routes>
      {/* ── Rutas Públicas ─────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/directorio" element={<DirectorioPage />} />
        <Route path="/socio/:slug" element={<MicroSitioPage />} />
        <Route path="/login-socios" element={<LoginPageSocios />} />
        <Route path="/admin/forgot-passwordsocios" element={<ForgotPasswordSociosPage />} />

       
        

      </Route>

      {/* ── Rutas Admin ────────────────────────────────── */}
      <Route path="/admin/login" element={<LoginPage />} />
      
      <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/admin/cambiar-password" element={<CambiarPasswordPage />} />
      {/*Protegidas*/}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/socios" element={<SociosAdminPage />} />
        <Route path="/admin/socios/nuevo" element={<SocioFormPage />} />
        <Route path="/admin/socios/:id" element={<SocioFormPage />} />
        <Route path="/admin/usuarios" element={<UsuariosAdminPage />} />

        
      </Route>
    </Routes>
  );
}