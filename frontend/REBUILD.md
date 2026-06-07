# REBUILD — cómo reconstruir y levantar el proyecto

> Tres caminos: (A) Docker — recomendado, levanta todo de cero en un comando.
> (B) Local sin Docker, para debuggear el backend desde Visual Studio o Rider.
> (C) Mixto: PostgreSQL en Docker, backend y frontend en máquina.

---

## A. Levantar todo con Docker (recomendado)

### Pre-requisitos

- Docker Desktop (Windows/Mac) o Docker Engine 20+ y Docker Compose v2 (Linux).
- 4 GB RAM libres.
- Puertos 80, 5000, 5050 y 5432 libres en el host.

### Paso 1 — Configurar `.env`

El proyecto viene con un `.env` para **desarrollo local**. Si vas a usarlo así, podés saltar al Paso 2.

Para producción (o si querés tus propios valores):

```bash
cp .env.example .env
```

Editá `.env` y reemplazá todos los `CHANGE_ME_...`. Para generar la `JWT_KEY`:

```bash
# Linux / Mac / WSL
openssl rand -base64 64

# PowerShell
[Convert]::ToBase64String((1..64 | %{ Get-Random -Maximum 256 } | ForEach-Object {[byte]$_}))
```

Variables obligatorias:

| Variable | Para qué |
|----------|----------|
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Credenciales de PostgreSQL. |
| `CONNECTION_STRING` | Connection string que usa la API. **Debe coincidir** con las credenciales de arriba. |
| `JWT_KEY` | Clave de firma de JWT — mínimo 32 caracteres. La app falla al arrancar si está vacía o es corta. |
| `JWT_ISSUER`, `JWT_AUDIENCE` | Identificadores del token. Cualquier string consistente. |
| `JWT_EXPIRE_MINUTES` | Default 60. Reducir en producción si querés más seguridad. |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos separados por coma. **Sin esto, el frontend no puede llamar al backend.** |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | Admin que se crea en primer arranque. La password es obligatoria — la app falla si no está. |
| `PGADMIN_DEFAULT_EMAIL`, `PGADMIN_DEFAULT_PASSWORD` | Login de pgAdmin. |

### Paso 2 — Build y up

```bash
docker compose up --build
```

La primera vez tarda unos minutos: descarga las imágenes base, hace `dotnet restore`, `npm ci`, `npm run build`. Las siguientes veces es mucho más rápido por la caché de capas.

Cuando todo termine de levantar (verás `🚀 Directorio Interactivo CASATIC 2026 iniciado en entorno Development` en la consola), tenés:

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost |
| API (Swagger) | http://localhost:5000/swagger |
| API health | http://localhost:5000/health |
| pgAdmin | http://localhost:5050 |
| PostgreSQL | localhost:5432 (sólo en dev — comentar el `ports:` en producción) |

### Paso 3 — Login

Login inicial con las credenciales que configuraste en `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.

Por defecto en el `.env` de desarrollo: `admin@casatic.org` / `Admin123!`.

**El primer login te va a forzar a cambiar la contraseña** (campo `PrimerLogin = true` en el seed).

### Paso 4 — Restaurar `backup.sql` (opcional)

Si querés cargar los datos del backup en lugar de empezar de cero:

```bash
# Asegurate de que el contenedor de DB ya está corriendo
docker exec -i casatic-db psql -U casatic -d casatic_directorio < backup.sql
```

> ⚠️ **Importante:** hacelo **antes** de que la API arranque por primera vez, o vas a tener conflictos entre el seed automático y los datos del backup. Si ya arrancó, parar la app, vaciar el volumen `pgdata`, restaurar, y arrancar de nuevo.

### Comandos útiles

```bash
# Ver logs en vivo
docker compose logs -f api

# Ver logs sólo del backend, desde el principio
docker compose logs api

# Reiniciar sólo el backend (después de cambiar código)
docker compose up -d --build api

# Bajar todo PRESERVANDO la DB (volumen pgdata sigue ahí)
docker compose down

# Bajar todo Y BORRAR la DB (empezar de cero)
docker compose down -v

# Acceder al psql desde el container
docker exec -it casatic-db psql -U casatic -d casatic_directorio
```

---

## B. Levantar sin Docker (desarrollo local del backend)

### Pre-requisitos

- .NET 8 SDK
- Node.js 20+
- PostgreSQL 16 corriendo en local (puerto 5432)

### B.1 — Backend

```bash
cd backend
dotnet restore
cd src/CasaticDirectorio.Api
```

Editá `appsettings.Development.json` con tu connection string local si no usás los defaults.

```bash
dotnet run
```

La API arranca en `https://localhost:5001` y `http://localhost:5000`. Swagger en `/swagger`.

### B.2 — Frontend

En otra terminal:

```bash
cd frontend
npm ci
npm run dev
```

Vite arranca en `http://localhost:5173`. Las llamadas a `/api` van por proxy al backend (configurado en `vite.config.js`).

> El backend en este modo lee `Cors:AllowedOrigins` de `appsettings.Development.json`. Verificá que `http://localhost:5173` esté en la lista.

---

## C. Mixto — DB en Docker, app en local

Útil para tener PostgreSQL prolijo sin instalarlo en el host.

```bash
# Sólo levantar la DB y pgAdmin
docker compose up -d db pgadmin

# Backend en local
cd backend/src/CasaticDirectorio.Api
dotnet run

# Frontend en local
cd frontend
npm ci
npm run dev
```

Cambiá la connection string en `appsettings.Development.json` para que apunte a `localhost:5432` (no `db:5432`, que sólo resuelve dentro de la red Docker).

---

## Troubleshooting

### "JWT Key no configurada o demasiado corta"
La app hace fail-fast al arrancar si `JWT_KEY` está vacía, contiene "REEMPLAZ" (placeholder) o tiene menos de 32 caracteres. Generá una nueva con `openssl rand -base64 64` y volvé a `docker compose up`.

### "Seed:AdminPassword no está configurada"
Falta `SEED_ADMIN_PASSWORD` en `.env`. Es necesaria sólo en el primer arranque (cuando se crea el admin). Si ya tenías usuarios en la DB, podés poner cualquier valor.

### "ConnectionStrings:DefaultConnection no está configurada"
Falta `CONNECTION_STRING` en `.env`. Tiene que apuntar a `Host=db` cuando corrés con Docker (no `localhost`).

### El frontend carga pero las llamadas a la API fallan con CORS
`CORS_ALLOWED_ORIGINS` en `.env` no incluye el origen desde el que estás visitando. Para desarrollo local típicamente debe contener: `http://localhost,http://localhost:80,http://localhost:5173`.

### "Unable to resolve service for type ..."
Si tocaste DI (registración de servicios) en `Program.cs` y olvidaste registrar algo. Mirá el log al arranque, ASP.NET Core dice exactamente qué tipo no puede resolver.

### El healthcheck del container de la API falla pero la API responde
Verificá que `curl` está instalado en la imagen runtime — el Dockerfile lo instala explícitamente. Si modificaste el Dockerfile, asegurate de no haberlo sacado.

### "Foreign key violation" o "duplicate key" al hacer seed
Pasa cuando el seed corre sobre una DB que ya tiene datos parciales. Para empezar de cero:

```bash
docker compose down -v   # ← el -v borra los volúmenes, incluido pgdata
docker compose up --build
```

### En producción, la API funciona pero el frontend muestra "Network error"
- ¿`CORS_ALLOWED_ORIGINS` incluye el dominio real? (sin barra final, sin trailing slash)
- ¿`HSTS` está obligando HTTPS y el navegador rechaza HTTP? Configurá certificado o forzá HTTPS desde el reverse proxy.
- ¿Hay un reverse proxy (nginx, traefik, ALB) entre el navegador y el frontend? Verificá los headers `X-Forwarded-Proto` y `Host`.

---

## Checklist pre-producción

Antes de poner esto en un servidor real, **verificá todo lo de abajo**:

- [ ] `.env` con valores únicos por entorno; `JWT_KEY` regenerada con `openssl rand -base64 64`.
- [ ] `ASPNETCORE_ENVIRONMENT=Production` (no `Development`). Sin esto, Swagger queda expuesto y el endpoint de recuperación devuelve el token en la respuesta.
- [ ] `CORS_ALLOWED_ORIGINS` con sólo el dominio real (sin `localhost`).
- [ ] El servicio `db` del compose con el `ports: 5432:5432` **comentado** (la DB no debe ser accesible desde fuera de la red Docker).
- [ ] HTTPS funcionando — la app activa `UseHsts()` automáticamente cuando no es Development.
- [ ] Servicio de email implementado para recuperación de contraseña (hoy hay un `TODO` en `AuthController.RecuperarPassword`).
- [ ] Backups automáticos del volumen `pgdata`.
- [ ] Logs siendo enviados a un agregador (la app ya escribe a Serilog console + archivo; falta destino remoto).
- [ ] Cambiada la contraseña del admin desde el primer login.
- [ ] Considerar mover JWT de `localStorage` a HttpOnly cookies (riesgo XSS — ver `AUDITORIA.md` §6).
