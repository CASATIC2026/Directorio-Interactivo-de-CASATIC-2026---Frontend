# ── Build Stage ────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Copiar manifests primero para aprovechar caché de capas Docker.
COPY package.json package-lock.json ./

# `npm ci` es reproducible (usa lockfile) y más rápido que `npm install`.
RUN npm ci --include=dev

# Copiar el resto del código y construir.
COPY . .
RUN npm run build

# ── Runtime Stage ─────────────────────────────────────────
FROM nginx:alpine

# Eliminar config default y copiar la nuestra (con security headers + gzip).
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
