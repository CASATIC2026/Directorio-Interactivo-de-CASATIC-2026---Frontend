import axios from 'axios';

/**
 * ═══════════════════════════════════════════════════════════════
 * UNIFIED HTTP CLIENT — Axios instance used EVERYWHERE
 * 
 * Este archivo es el ÚNICO cliente HTTP de la aplicación.
 * Centraliza toda la comunicación con la API.
 * 
 * Reemplaza:
 *  ✗ lib/api.js (fetch) — DEPRECATED
 *  ✓ api/client.js (axios) — NOW HERE
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Instancia de axios pre-configurada
 * @instance
 * @type {AxiosInstance}
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30s timeout para operaciones largas
});

/**
 * REQUEST INTERCEPTOR: Agregar JWT token a cada solicitud
 * Extrae el token de localStorage y lo añade al header Authorization
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('casatic_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR: Manejo global de errores
 * - 401: Sesión expirada → limpia storage y redirige a login
 * - 403: Acceso denegado
 * - 5xx: Error del servidor
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Sesión expirada
      localStorage.removeItem('casatic_token');
      localStorage.removeItem('casatic_user');
      
      // Redirigir a login solo si estamos en rutas protegidas
      if (window.location.pathname.startsWith('/admin') && 
          !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login?redirected=true';
      } else if (window.location.pathname.startsWith('/socio') || 
                 window.location.pathname === '/') {
        window.location.href = '/login?redirected=true';
      }
    } else if (error.response?.status === 403) {
      console.error('📛 Acceso denegado - Insuficientes permisos');
    } else if (error.response?.status >= 500) {
      console.error('❌ Error del servidor', error.response?.status);
    }
    
    return Promise.reject(error);
  }
);

export default api;
