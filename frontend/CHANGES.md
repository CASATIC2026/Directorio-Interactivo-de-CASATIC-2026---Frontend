# CHANGES — registro de cambios aplicados

> Listado archivo por archivo de **todo** lo que tocó la auditoría.
> Para el "por qué" detallado de cada cambio, ver `AUDITORIA.md`.

**Convención:** ✏️ modificado · ✨ creado · 🗑️ eliminado · 🔁 renombrado.

---

## Raíz del proyecto

| Archivo | Cambio |
|---------|--------|
| ✏️ `docker-compose.yml` | Reescrito: resuelto el merge conflict de Git, secretos movidos a `.env`, healthchecks, volumen para uploads, depends_on con condition. |
| ✨ `.env` | Creado con valores de **desarrollo local** funcionales (no usar en producción). |
| ✏️ `.env.example` | Reescrito con todas las claves que el `docker-compose.yml` realmente necesita (antes sólo tenía `VITE_API_URL`). Incluye instrucciones de generación de JWT key. |
| ✏️ `.dockerignore` | Reescrito para excluir `node_modules`, `bin`, `obj`, `.env*`, etc. |
| ✨ `.gitignore` | Creado (no existía). |
| 🗑️ `index.html`, `package.json`, `package-lock.json`, `postcss.config.js`, `tailwind.config.js`, `vite.config.js`, `Dockerfile`, `nginx.conf` | Eran duplicados de los archivos reales que viven en `frontend/`. Si alguien corría `npm install` desde la raíz, build roto. |
| 🗑️ `generate_hash.cs` | Script suelto sin proyecto que lo compile. Inútil. |
| 🗑️ `test-password-recovery.ps1` | Script de PowerShell de prueba manual; ya no aplica con la nueva flow. |
| 🗑️ `AUDITORIA_REQUISITOS.md`, `BACKUP_INFO.md`, `ESTRUCTURA_PROYECTO.md`, `FRONTEND_AUDIT.md`, `GUIA_INSTALACION.md`, `README.md`, `RESTAURAR_BASE_DE_DATOS.txt` | Documentación obsoleta (decía "95% completo" cuando el proyecto no compilaba). Reemplazada por `AUDITORIA.md`, `CHANGES.md`, `REBUILD.md` y un nuevo `README.md`. |
| ✨ `AUDITORIA.md` | Informe completo de hallazgos y decisiones. |
| ✨ `CHANGES.md` | Este archivo. |
| ✨ `REBUILD.md` | Guía paso a paso para levantar el proyecto. |
| ✨ `README.md` | Reescrito desde cero con instrucciones reales y precisas. |

---

## Backend — Estructura

| Archivo | Cambio |
|---------|--------|
| 🗑️ `backend/src/Class1.cs` | Template basura de Visual Studio. |
| 🗑️ `backend/src/CasaticDirectorio.Infrastructure.csproj` | Duplicado fuera de carpeta apuntando a .NET 9. El correcto vive en `backend/src/CasaticDirectorio.Infrastructure/`. |
| 🗑️ `backend/src/CasaticDirectorio.Infrastructure/Data/Seed/EventoSeeder.cs` | Código muerto, duplica `DataSeeder.cs`. |
| ✏️ `backend/Dockerfile` | Reescrito: usuario no-root `casatic` (uid 1001), healthcheck contra `/health`, multi-stage optimizado con caché de restore. |
| ✏️ `backend/src/CasaticDirectorio.Domain/CasaticDirectorio.Domain.csproj` | Quitada referencia a `Npgsql.EntityFrameworkCore.PostgreSQL` (provider EF, infraestructura). Sólo queda `Npgsql` (driver, necesario por `NpgsqlTsVector`). |

---

## Backend — Domain

| Archivo | Cambio |
|---------|--------|
| 🔁 `backend/src/CasaticDirectorio.Domain/Entities/LogActividad.cs` | El archivo declaraba `class LogEventoLogActividad`. Renombrado a `class LogActividad` (el nombre que el resto del código ya usaba). |
| 🔁 `backend/src/CasaticDirectorio.Domain/Enums/TipoEventoLogActividad.cs` | El archivo declaraba `enum TipoLogActividad`. Renombrado a `TipoEventoLogActividad`. |
| ✏️ `backend/src/CasaticDirectorio.Domain/Enums/TipoEvento.cs` | Reescrito limpio (era válido pero con valores en lowercase mezclado con PascalCase). |
| ✏️ `backend/src/CasaticDirectorio.Domain/Entities/Evento.cs` | Reescrito: comentarios XML estaban rotos (`<>summary>`, llaves dentro de comentarios), comas/llaves mal puestas. |

---

## Backend — Infrastructure

| Archivo | Cambio |
|---------|--------|
| ✏️ `backend/src/CasaticDirectorio.Infrastructure/Data/AppDbContext.cs` | Eliminado import inútil `using System.Security.Cryptography.X509Certificates;`. |
| ✏️ `backend/src/CasaticDirectorio.Infrastructure/Data/Seed/DataSeeder.cs` | Reescrito: lee `Seed:AdminEmail` y `Seed:AdminPassword` de configuración (no hardcoded), `PrimerLogin = true` para forzar cambio de contraseña en primer login, falla con mensaje claro si falta `AdminPassword`. |

---

## Backend — API (Program.cs y middleware)

| Archivo | Cambio |
|---------|--------|
| ✏️ `backend/src/CasaticDirectorio.Api/Program.cs` | Reescrito completo. Cambios principales: (a) **fail-fast** al arrancar si falta `Jwt:Key`/`ConnectionString`/`Issuer`/`Audience` o son inválidos, con mensajes accionables; (b) CORS desde `Cors:AllowedOrigins` (config), no hardcodeado, y fail-safe (orígenes vacíos = bloqueo total); (c) rate limiting **por IP** con políticas separadas para `auth` (10/min) y `contacto` (5/min) en lugar de global; (d) JWT con `ClockSkew = 1 min` (era 5min default); (e) HTTPS redirection + HSTS en producción; (f) `EnsureCreatedAsync()` en lugar de `MigrateAsync()` (no existen migraciones EF); (g) static files con cache 1 año para logos (nombre incluye Guid → inmutables); (h) Swagger sólo en Development; (i) `MapHealthChecks("/health")` para el container healthcheck. |
| ✨ `backend/src/CasaticDirectorio.Api/Middleware/SecurityHeadersMiddleware.cs` | Nuevo. Añade `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy` y remueve `Server`. |
| ✏️ `backend/src/CasaticDirectorio.Api/appsettings.json` | Reescrito limpio: sólo configuración no-secreta. Antes tenía strings `"REEMPLAZADO_POR_VARIABLE_DE_ENTORNO"` que se cargaban como connection string si las env vars faltaban → errores crípticos. |
| ✏️ `backend/src/CasaticDirectorio.Api/appsettings.Development.json` | Reescrito con defaults seguros para dev local (cuando alguien corre `dotnet run` fuera de Docker sin .env). |

---

## Backend — Services

| Archivo | Cambio |
|---------|--------|
| ✏️ `backend/src/CasaticDirectorio.Api/Services/JwtService.cs` | Reescrito: lee config validada por Program.cs, sin null-forgiving operator (`!`), `ExpireMinutes` configurable con default 60 (antes 480 = 8h), agrega claim `primer_login` para que el frontend sepa si forzar cambio de contraseña. |
| ✏️ `backend/src/CasaticDirectorio.Api/Services/IJwtService.cs` | Limpio (sin cambios funcionales, sólo estilo). |
| ✏️ `backend/src/CasaticDirectorio.Api/Services/LogService.cs` | Reescrito: usa `TipoEventoLogActividad` (correcto, antes usaba `TipoEvento`), trunca campos largos para evitar DoS por strings monstruo, atrapa excepciones para no romper el flujo principal si el log falla. |
| ✏️ `backend/src/CasaticDirectorio.Api/Services/ILogService.cs` | Tipo del parámetro `tipo` cambiado a `TipoEventoLogActividad`. |
| ✏️ `backend/src/CasaticDirectorio.Api/Services/EventoService.cs` | Reescrito completo. Bugs corregidos: `usuarioId` (lowercase) → `UsuarioId`, `TipoEvento` → `Tipo`, `ImagenUrl` → `ImageUrl`, `FindOrDefaultAsync` (no existe) → `FirstOrDefaultAsync`, agregado `EnsureUtc()` para todos los timestamps, generación de slug con normalización Unicode (acentos), `AsNoTracking()` en lecturas. |

---

## Backend — Controllers

| Archivo | Cambio |
|---------|--------|
| ✏️ `backend/src/CasaticDirectorio.Api/Controllers/AuthController.cs` | Reescrito: (a) login timing-safe (siempre corre `BCrypt.Verify` aunque el usuario no exista, contra hash dummy); (b) recuperación de contraseña funcional (en Development devuelve token en respuesta para QA; en producción sólo loguea, queda `TODO` para integrar email); (c) `cambiar-password` ahora devuelve `LoginResponse` completo en lugar de sólo `{message, token}`, así el frontend conserva email/rol/socioId; (d) validación de complejidad de password con regex sincronizado con frontend; (e) token de recuperación válido 1h (era 24h); (f) rate limiting `[EnableRateLimiting("auth")]` por IP. |
| ✏️ `backend/src/CasaticDirectorio.Api/Controllers/EventosController.cs` | Reescrito: (a) compila (la versión original tenía `await_service.CreateAsync` sin espacio y llamaba a `_service.AprobarAsync` que no existe); (b) `[Authorize(Roles=...)]` en `Create` y `Aprobar` (antes anónimos); (c) lee `userId` y `rol` reales del JWT en lugar de generar `Guid.NewGuid()` ficticio; (d) devuelve `CreatedAtAction` apuntando a `GetById`. |
| ✏️ `backend/src/CasaticDirectorio.Api/Controllers/ReportesController.cs` | Reescrito: (a) export Excel arreglado — antes escribía `FechaCreacion` en columna 15 pisando `RsFacebook`, headers (15) ≠ datos (19); ahora 20 columnas consistentes; (b) dashboard `GroupBy` traducible a SQL en lugar de cargar logs a memoria y agrupar en cliente; (c) usa `TipoEventoLogActividad` correcto. |
| ✏️ `backend/src/CasaticDirectorio.Api/Controllers/UsuariosController.cs` | Reescrito: (a) genera contraseña temporal **aleatoria** con `RandomNumberGenerator` (criptográficamente seguro) en lugar del hardcoded `Socio123!`; (b) endpoint `POST /{id}/reset-password` para que el admin pueda resetear; (c) la temp password se devuelve UNA SOLA VEZ en la respuesta del create/reset y debe entregarse por canal seguro; (d) `Authorize(Roles="Admin")` a nivel controller. |
| ✏️ `backend/src/CasaticDirectorio.Api/Controllers/SociosController.cs` | Único cambio: `TipoEvento.CrudSocio` → `TipoEventoLogActividad.CrudSocio` (sed batch). |
| ✏️ `backend/src/CasaticDirectorio.Api/Controllers/DirectorioController.cs` | Reemplazos del enum: `TipoEvento.Busqueda/VisitaMicroSitio` → `TipoEventoLogActividad.X`. |
| ✏️ `backend/src/CasaticDirectorio.Api/Controllers/FormularioContactoController.cs` | `TipoEvento.EnvioFormulario` → `TipoEventoLogActividad.EnvioFormulario`. |
| ✏️ `backend/src/CasaticDirectorio.Api/Controllers/MiEmpresaController.cs` | `TipoEvento.CrudSocio` → `TipoEventoLogActividad.CrudSocio`. |

> **Sin cambios:** `EstadisticasController.cs`, `EstadisticasPeriodoController.cs`, `UploadController.cs`. Funcionan, no presentan problemas críticos.

---

## Frontend

| Archivo | Cambio |
|---------|--------|
| ✏️ `frontend/Dockerfile` | Reescrito: `npm ci` en lugar de `npm install` (reproducible), healthcheck contra `/healthz`, elimina conf default antes de copiar la nuestra. |
| ✏️ `frontend/nginx.conf` | Reescrito: gzip habilitado para todos los textos, security headers (CSP, X-Frame, Referrer, Permissions), cache 1 año para assets con hash, no-cache para `index.html` (deploys siempre se ven), endpoint `/healthz` propio, proxy de `/logos/` al backend. |
| ✏️ `frontend/src/lib/api.js` | Reescrito: (a) `restablecer-password` (era `resetear-password` → 404); (b) `validar-token-recuperacion` ahora envía `{email, token}` (faltaba email); (c) `enviarFormulario` POSTea a `/formulariocontacto/{socioId}` (era body con socioId que el backend ignoraba); (d) `restablecerPassword` envía `{email, token, nuevaPassword}` completo; (e) si recibe 401 limpia la sesión. |
| ✏️ `frontend/src/context/AuthContext.jsx` | Reescrito: tras `cambiarPassword`, hace merge defensivo del nuevo response con el usuario previo para no perder email/rol/socioId si el backend devolviera respuesta parcial. |
| 🗑️ `frontend/src/components/Navbar.jsx` | Código muerto, no se importa en ningún lado. |
| 🗑️ `frontend/src/components/PrivateRoute.jsx` | Código muerto, reemplazado hace tiempo por la lógica en `App.jsx`. |
| 🗑️ `frontend/src/pages/public/img/socios e inversionistas/descargar.htm` | Archivo HTML basura en una carpeta de imágenes. |
| 🗑️ `frontend/dist/` | 16 MB de bundle compilado committeado. Se regenera con `npm run build`. |
| 🗑️ `frontend/docker-compose.yml` | Compose duplicado con valores hardcodeados. El correcto vive en la raíz. |

> **Sin cambios:** todas las páginas (`pages/admin/*`, `pages/public/*`), todos los hooks, `api/client.js`, `lib/auth.js`, `lib/validators.js`, layouts, `App.jsx`, `main.jsx`. Funcionan correctamente con los fixes de `lib/api.js` y `AuthContext.jsx`.

---

## Resumen numérico

- **Archivos modificados:** 28
- **Archivos creados:** 7 (incluyendo docs)
- **Archivos eliminados:** 19 (código muerto, duplicados, docs obsoletas)
- **Archivos renombrados (sólo símbolo dentro):** 2

---

## Lo que NO toqué (lista corta — el "por qué" está en `AUDITORIA.md` §6)

- JWT en `localStorage` del frontend (riesgo XSS conocido, refactor amplio).
- `lib/api.js` deprecated en lugar de eliminado (varias páginas lo usan).
- Optimización de `Directorio/Especialidades` y `/Servicios` (no escala con muchos socios; documentado).
- Generación de migraciones EF (requiere NuGet + revisión vs `backup.sql`).
- Servicio de email para recuperación (requiere SMTP/SendGrid).
