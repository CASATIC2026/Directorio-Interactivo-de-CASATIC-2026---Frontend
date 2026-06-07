# ── Build Stage ────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar solución y proyectos primero (caché de restore).
COPY CasaticDirectorio.sln .
COPY src/CasaticDirectorio.Domain/CasaticDirectorio.Domain.csproj src/CasaticDirectorio.Domain/
COPY src/CasaticDirectorio.Infrastructure/CasaticDirectorio.Infrastructure.csproj src/CasaticDirectorio.Infrastructure/
COPY src/CasaticDirectorio.Api/CasaticDirectorio.Api.csproj src/CasaticDirectorio.Api/

RUN dotnet restore

# Copiar el resto del código y publicar.
COPY src/ src/
WORKDIR /src/src/CasaticDirectorio.Api
RUN dotnet publish -c Release -o /app/publish

# ── Runtime Stage ─────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# curl para el healthcheck + crear usuario no-root para reducir superficie.
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/* \
 && groupadd --system --gid 1001 casatic \
 && useradd  --system --uid 1001 --gid casatic --shell /bin/false casatic

COPY --from=build --chown=casatic:casatic /app/publish .

# Asegurar que los directorios de imagenes existen y son escribibles por el usuario.
RUN mkdir -p /app/wwwroot/logos /app/wwwroot/uploads && chown -R casatic:casatic /app/wwwroot

ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_NOLOGO=true

USER casatic
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD curl -fsS http://localhost:8080/health || exit 1

CMD ["dotnet", "CasaticDirectorio.Api.dll"]
