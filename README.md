# Directorio Interactivo CASATIC 2026

Plataforma web para el directorio de socios de CASATIC: catálogo público de empresas miembro, gestión interna por rol (Admin / Socio), reportes y eventos.

## Stack

- **Backend:** .NET 8 + Entity Framework Core + PostgreSQL + Serilog
- **Frontend:** React 18 + Vite + TailwindCSS + Axios
- **Infra:** Docker Compose, Nginx, pgAdmin

Arquitectura en capas: `Domain` (entidades + interfaces puras), `Infrastructure` (EF + repositorios), `Api` (controllers + servicios + DTOs).

## Cómo levantar

Ver [`REBUILD.md`](./REBUILD.md). Resumen:

```bash
docker compose up --build
```

Login inicial: `admin@casatic.org` / la password que pusiste en `SEED_ADMIN_PASSWORD` (en el `.env` de desarrollo es `Admin123!`).

## Documentación de la auditoría

- **[AUDITORIA.md](./AUDITORIA.md)** — Análisis completo: hallazgos, severidades, decisiones técnicas. Empezá por acá si querés entender qué se cambió y por qué.
- **[CHANGES.md](./CHANGES.md)** — Listado archivo por archivo de los cambios.
- **[REBUILD.md](./REBUILD.md)** — Cómo levantar el proyecto, troubleshooting, checklist pre-producción.

## Estructura

```
.
├── backend/                          # API .NET 8 (Clean Architecture)
│   ├── Dockerfile                    # Multi-stage, usuario no-root, healthcheck
│   ├── CasaticDirectorio.sln
│   └── src/
│       ├── CasaticDirectorio.Domain/         # Entidades, enums, interfaces
│       ├── CasaticDirectorio.Infrastructure/ # EF DbContext, repos, seed
│       └── CasaticDirectorio.Api/            # Controllers, services, DTOs
│
├── frontend/                         # SPA React + Vite
│   ├── Dockerfile                    # nginx con security headers + gzip
│   ├── nginx.conf
│   └── src/
│       ├── api/             # cliente axios (preferido)
│       ├── lib/             # auth, api fetch (legado), validators
│       ├── context/         # AuthContext
│       ├── components/Layout/
│       └── pages/{public,admin}/
│
├── docker-compose.yml                # Orquesta db + pgadmin + api + frontend
├── .env                              # Secretos locales (NO subir a Git)
├── .env.example                      # Plantilla con todas las variables
├── backup.sql                        # Dump opcional para datos de prueba
├── AUDITORIA.md                      # Informe de auditoría
├── CHANGES.md                        # Registro de cambios
├── REBUILD.md                        # Guía de levantado
└── README.md                         # Este archivo
```

## Endpoints principales

- `POST /api/auth/login` — login (JWT)
- `POST /api/auth/cambiar-password` — cambio de contraseña (autenticado)
- `POST /api/auth/recuperar-password` — solicitar token de recuperación
- `POST /api/auth/restablecer-password` — restablecer con token
- `GET  /api/directorio` — listado público con filtros
- `GET  /api/directorio/socio/{slug}` — detalle público
- `POST /api/formulariocontacto/{socioId}` — formulario de contacto público
- `GET  /api/eventos/proximos` — agenda pública
- `GET  /api/reportes/dashboard` — métricas (admin)
- `GET  /api/reportes/exportar-socios` — Excel de socios (admin)
- `POST /api/usuarios` — crear usuario con password temporal aleatoria (admin)

Documentación completa en `/swagger` cuando corre en Development.

## Estado del proyecto

Pasó por una auditoría completa en mayo 2026 que corrigió 35 issues entre bloqueantes de compilación, vulnerabilidades de seguridad y bugs funcionales. Ver `AUDITORIA.md` para el detalle.

Listo para `docker compose up` con `.env` configurado. Antes de producción, repasar el checklist al final de `REBUILD.md`.
