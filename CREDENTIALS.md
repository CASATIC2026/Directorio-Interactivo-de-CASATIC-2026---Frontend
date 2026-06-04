# 🔐 Credenciales CASATIC 2026

## Backend API (Railway) - ✅ EN VIVO

**URL Base:** https://api-production-c13b.up.railway.app

### Variables de Entorno del Backend:
```
VITE_API_URL=https://api-production-c13b.up.railway.app
VITE_APP_ENV=production
```

---

## Credenciales de Prueba

### Usuario Administrador
- **Email:** admin@casatic.sv
- **Contraseña:** Admin@123456
- **Rol:** Administrador

### Endpoints Importantes
- 🏥 **Health Check:** `GET /health`
- 🔐 **Login:** `POST /api/auth/login`
- 📋 **Socios:** `GET /api/socios`
- 📊 **Estadísticas:** `GET /api/estadisticas`
- 📅 **Eventos:** `GET /api/eventos`
- 🧾 **Facturación:** `GET /api/facturacion`

---

## Información de Base de Datos

**PostgreSQL en Railway**
```
Host: postgres.railway.internal
Port: 5432
User: postgres
Database: railway
```

---

## JWT Configuration

**Issuer:** CasaticDirectorio  
**Audience:** CasaticDirectorioClients  
**Key:** b286493c4a20b7889155b6960c0072e7 (32 caracteres)

---

## Frontend (Vercel) - 🔄 CONFIGURANDO

**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Framework:** Vite + React

**Espera a que Vercel termine de desplegar...**

---

## Testing del Endpoint

### 1. Verificar que el backend está en vivo:
```bash
curl -X GET https://api-production-c13b.up.railway.app/health
```

**Respuesta esperada:**
```json
{
  "status": "Healthy",
  "timestamp": "2026-06-04T19:50:05Z"
}
```

### 2. Login para obtener token JWT:
```bash
curl -X POST https://api-production-c13b.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@casatic.sv","password":"Admin@123456"}'
```

**Respuesta esperada:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@casatic.sv",
    "nombre": "Administrator",
    "rol": "Administrador"
  }
}
```

### 3. Usar el token para llamadas autenticadas:
```bash
curl -X GET https://api-production-c13b.up.railway.app/api/socios \
  -H "Authorization: Bearer {accessToken}"
```

---

## CORS Configurado Para:
- ✅ https://casatic-frontend.vercel.app (Vercel)
- ✅ http://localhost:3000 (Desarrollo local)

---

## Estado del Deployment

✅ **Backend:** Online en Railway  
🔄 **Frontend:** Esperando deployment en Vercel  
✅ **Base de Datos:** Online en Railway  
✅ **Health Check:** Pasando  

---

**Última actualización:** 2026-06-04  
**Status:** Listo para probar
