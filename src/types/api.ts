/**
 * ═══════════════════════════════════════════════════════════════
 * API TYPES & DTOs — TypeScript Definitions
 * 
 * Documento único de referencia para TODOS los tipos de datos
 * que fluyen entre frontend y backend.
 * 
 * GENERADO: 2026-04-09 — CASATIC Directorio
 * ═══════════════════════════════════════════════════════════════
 */

// ───────────────────────────────────────────────────────────────
// AUTHENTICATION
// ───────────────────────────────────────────────────────────────

export interface LoginRequest {
  /** Email del usuario administrativo */
  email: string;
  /** Contraseña */
  password: string;
}

export interface LoginResponse {
  /** JWT token válido por 480 minutos */
  token: string;
  /** Email del usuario autenticado */
  email: string;
  /** Rol: "Admin" | "Socio" | "Usuario" */
  rol: string;
  /** Flag: primer login = debe cambiar contraseña */
  primerLogin: boolean;
  /** ID del socio asociado (null si es Admin o Usuario público) */
  socioId?: string | null;
}

export interface CambiarPasswordRequest {
  /** Nueva contraseña (validaciones: 8+ chars, upper, digit, special) */
  nuevaPassword: string;
}

export interface CambiarPasswordResponse {
  message: string;
  /** Nuevo token sin flag PrimerLogin */
  token: string;
}

export interface RecuperarPasswordRequest {
  /** Email del usuario que solicita recuperación */
  email: string;
}

export interface ValidarTokenRecuperacionRequest {
  email: string;
  /** Token enviado por email (6-8 caracteres) */
  token: string;
}

export interface RestablecerPasswordRequest {
  email: string;
  token: string;
  /** Nueva contraseña */
  nuevaPassword: string;
}

/**
 * Payload de logout (cliente envía este)
 */
export interface LogoutRequest {
  reason?: 'user_initiated' | 'token_expired' | 'access_denied';
}

// ───────────────────────────────────────────────────────────────
// DIRECTORIO (Público)
// ───────────────────────────────────────────────────────────────

export interface DirectorioFilterDto {
  /** Búsqueda full-text: nombre, descripción */
  query?: string;
  /** Filtro por categoría/especialidad */
  especialidad?: string;
  /** Filtro por tipo de servicio */
  servicio?: string;
  /** Filtro por marca representada */
  producto?: string;
  /** Filtro por estado financiero */
  estado?: 'AlDia' | 'Atrasado' | 'Suspendido';
  /** Filtro por rango de fechas */
  fechaDesde?: string; // ISO 8601
  fechaHasta?: string; // ISO 8601
  /** Paginación */
  page?: number;
  pageSize?: number;
}

export interface DirectorioResponseDto {
  /** Items paginados */
  items: SocioDirectorioDto[];
  /** Total de registros sin paginar */
  total: number;
  /** Página actual */
  page?: number;
  /** Items por página */
  pageSize?: number;
}

export interface SocioDirectorioDto {
  /** UUID */
  id: string;
  /** Nombre de empresa */
  nombreEmpresa: string;
  /** Slug único para URL: /socio/{slug} */
  slug: string;
  /** Descripción corta */
  descripcion: string;
  /** Categorías: ["Desarrollo", "Consultoría", ...] */
  especialidades: string[];
  /** Servicios ofrecidos */
  servicios: string[];
  /** Teléfono de contacto */
  telefono?: string;
  /** Dirección física */
  direccion?: string;
  /** URL del logo */
  logoUrl?: string;
  /** Marca asuntos representados */
  marcasRepresenta?: string;
  /** Estado financiero del socio */
  estadoFinanciero?: string;
  /** Visible en directorio público */
  habilitado?: boolean;
  /** Redes sociales: 6 campos separados */
  rsWebsite?: string;
  rsFacebook?: string;
  rsLinkedin?: string;
  rsTwitter?: string;
  rsInstagram?: string;
  rsYoutube?: string;
}

export interface SocioDetalleDto extends SocioDirectorioDto {
  /** Email de contacto principal */
  emailContacto: string;
  /** URL de Google Maps embedido */
  mapaUrl?: string;
  /** Fecha creación */
  createdAt?: string; // ISO 8601
  /** Fecha última actualización */
  updatedAt?: string; // ISO 8601
}

// ───────────────────────────────────────────────────────────────
// FORMULARIOS DE CONTACTO  (Público)
// ───────────────────────────────────────────────────────────────

export interface FormularioContactoRequest {
  /** Nombre del contacto */
  nombre: string;
  /** Email de respuesta */
  correo: string;
  /** Mensaje */
  mensaje: string;
}

export interface FormularioContactoResponse {
  /** Confirmación de recepción */
  success: boolean;
  message?: string;
}

export interface FormularioContactoDto {
  id: string;
  socioId: string;
  nombre: string;
  correo: string;
  mensaje: string;
  leido: boolean;
  fecha: string; // ISO 8601
}

// ───────────────────────────────────────────────────────────────
// ADMIN: SOCIOS
// ───────────────────────────────────────────────────────────────

export interface CrearSocioRequest {
  nombreEmpresa: string;
  slug: string;
  descripcion: string;
  especialidades: string[];
  servicios: string[];
  telefono?: string;
  direccion?: string;
  logoUrl?: string;
  emailContacto: string;
  mapaUrl?: string;
  marcasRepresenta?: string;
  estadoFinanciero?: string;
  habilitado?: boolean;
  // Redes sociales
  rsWebsite?: string;
  rsFacebook?: string;
  rsLinkedin?: string;
  rsTwitter?: string;
  rsInstagram?: string;
  rsYoutube?: string;
}

export interface ActualizarSocioRequest extends CrearSocioRequest {
  // Mismo payload que crear
}

export interface SocioAdminDto extends SocioDirectorioDto {
  emailContacto: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToggleHabilitadoRequest {
  id: string;
}

export interface CambiarEstadoFinancieroRequest {
  estado: 'AlDia' | 'Atrasado' | 'Suspendido';
}

// ───────────────────────────────────────────────────────────────
// ADMIN: USUARIOS
// ───────────────────────────────────────────────────────────────

export interface CrearUsuarioRequest {
  email: string;
  /** Rol asignado */
  rol: 'Admin' | 'Socio' | 'Usuario';
  /** ID del socio (requerido si rol='Socio') */
  socioId?: string;
}

export interface UsuarioDto {
  id: string;
  email: string;
  rol: 'Admin' | 'Socio' | 'Usuario';
  activo: boolean;
  primerLogin: boolean;
  socioId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ActualizarUsuarioRequest {
  rol?: string;
  activo?: boolean;
}

export interface EliminarUsuarioRequest {
  id: string;
}

export interface ToggleActivoRequest {
  id: string;
}

// ───────────────────────────────────────────────────────────────
// ADMIN: REPORTES & ESTADÍSTICAS
// ───────────────────────────────────────────────────────────────

export interface DashboardDataDto {
  /** Total de socios */
  totalSocios: number;
  /** Total habitados (habilitado=true && estado='AlDia') */
  sociosActivos: number;
  /** Total de usuarios */
  totalUsuarios: number;
  /** Formularios sin leer */
  formulariosNoLeidos: number;
  /** Total formularios */
  totalFormularios: number;
  /** Socios por estado financiero */
  sociosPorEstado?: {
    alDia: number;
    atrasado: number;
    suspendido: number;
  };
  /** Actividad reciente */
  actividadReciente?: LogActividadDto[];
}

export interface LogActividadDto {
  id: string;
  tipoEvento: string;
  usuarioId?: string;
  socioId?: string;
  fecha: string;
  ip?: string;
  userAgent?: string;
  query?: string;
}

export interface EstadisticasPeriodoRequest {
  fechaDesde: string; // ISO 8601
  fechaHasta: string; // ISO 8601
}

export interface EstadisticasPeriodoDto {
  periodo: {
    desde: string;
    hasta: string;
    dias: number;
  };
  loginsUnicos: number;
  formulariosEnviados: number;
  sociosModificados: number;
  usuariosCreados: number;
}

// ───────────────────────────────────────────────────────────────
// FILE UPLOAD
// ───────────────────────────────────────────────────────────────

export interface UploadLogoResponse {
  /** URL accesible del logo subido */
  url: string;
  /** Path relativo en servidor */
  path?: string;
  /** Tamaño en bytes */
  size?: number;
}

// ───────────────────────────────────────────────────────────────
// ERROR RESPONSES
// ───────────────────────────────────────────────────────────────

export interface ApiErrorResponse {
  /** Mensaje de error amigable */
  message: string;
  /** Código de error técnico */
  code?: string;
  /** Detalles adicionales */
  details?: Record<string, any>;
}

export interface ValidationErrorResponse extends ApiErrorResponse {
  errors?: {
    [field: string]: string[];
  };
}

// ───────────────────────────────────────────────────────────────
// REQUEST/RESPONSE WRAPPERS
// ───────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
  timestamp?: string; // ISO 8601
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ───────────────────────────────────────────────────────────────
// CLIENT STATE (Frontend localStorage)
// ───────────────────────────────────────────────────────────────

/**
 * Contenido de localStorage.casatic_user
 */
export interface StoredUserData {
  email: string;
  rol: 'Admin' | 'Socio' | 'Usuario';
  primerLogin: boolean;
  socioId?: string | null;
}

/**
 * Estado de AuthContext
 */
export interface AuthContextState {
  user: StoredUserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  cambiarPassword: (nuevaPassword: string) => Promise<void>;
}

// ═══════════════════════════════════════════════════════════════
// EXPORT SUMMARY
// ═══════════════════════════════════════════════════════════════

/**
 * USO:
 * 
 * En componentes React:
 * ```
 * import type { SocioDetalleDto, LoginResponse } from '@/types/api';
 * 
 * const handleFetch = async () => {
 *   const response = await api.get(`/socios/${id}`);
 *   const socio: SocioDetalleDto = response.data;
 * }
 * ```
 * 
 * En servicios:
 * ```
 * export const loginUser = async (req: LoginRequest): Promise<LoginResponse> => {
 *   const response = await api.post('/auth/login', req);
 *   return response.data;
 * }
 * ```
 * 
 * Ventajas:
 * ✅ Autocompletado en IDEs (VSCode, WebStorm)
 * ✅ Validación de tipos en compile-time
 * ✅ Documentación integrada en el código
 * ✅ Menos runtime errors
 * ✅ Mejor experiencia developer
 */
