# 🎉 CASATIC 2026 - DEPLOYMENT COMPLETADO

## ✅ Backend (Railway) - ONLINE

**URL:** `https://api-production-c13b.up.railway.app`

**Estado:** 🟢 Online y respondiendo requests

**Credenciales de Prueba:**
```
Email:    admin@casatic.sv
Password: Admin@123456
```

---

## 📦 Frontend (Vercel) - LISTO PARA DEPLOY

**Repositorio:** 
```
https://github.com/CASATIC2026/Directorio-Interactivo-de-CASATIC-2026---Frontend
```

**Rama:** `desarrollo` ✅ (Toda la configuración está lista)

**Estado:** ⏳ Esperando deployment en Vercel

---

## 🚀 INICIO RÁPIDO - DEPLOY EN VERCEL (3 PASOS)

### 1️⃣ Abre Vercel
```
https://vercel.com/dashboard
```

### 2️⃣ Importa el Repositorio
- Click "Add New" → "Project"
- Busca y selecciona: `Directorio-Interactivo-de-CASATIC-2026---Frontend`
- Click "Import"

### 3️⃣ Configura y Deploya

**Root Directory:**
```
frontend
```

**Environment Variables:**
```
VITE_API_URL = https://api-production-c13b.up.railway.app
```

**Branch:** `desarrollo`

Click **"Deploy"** y listo! ✨

---

## 📊 URLs y Endpoints

| Servicio | URL |
|----------|-----|
| **Backend API** | https://api-production-c13b.up.railway.app |
| **Health Check** | https://api-production-c13b.up.railway.app/health |
| **Frontend** | https://casatic-frontend.vercel.app *(después del deploy)* |
| **GitHub** | https://github.com/CASATIC2026/Directorio-Interactivo-de-CASATIC-2026---Frontend |

---

## 🔑 Credenciales Sistema

### Admin User
```
Email:    admin@casatic.sv
Password: Admin@123456
```

### JWT Configuration
```
Issuer:   CasaticDirectorio
Audience: CasaticDirectorioClients
Key:      b286493c4a20b7889155b6960c0072e7
```

### Database (PostgreSQL)
```
Host:     postgres.railway.internal
Port:     5432
User:     postgres
Database: railway
```

---

## 🧪 Prueba el Sistema

### 1. Verifica Backend está Online
```bash
curl https://api-production-c13b.up.railway.app/health
```

### 2. Login para Obtener JWT
```bash
curl -X POST https://api-production-c13b.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@casatic.sv","password":"Admin@123456"}'
```

### 3. Usa el Token
```bash
curl -X GET https://api-production-c13b.up.railway.app/api/socios \
  -H "Authorization: Bearer {TOKEN_AQUI}"
```

---

## 📋 Checklist de Deployment

- [x] Backend desplegado en Railway
- [x] PostgreSQL online en Railway
- [x] Conexión Backend ↔ BD verificada
- [x] Variables de entorno configuradas
- [x] JWT validado
- [x] Health check pasando (200 OK)
- [x] Rama `desarrollo` lista en GitHub
- [x] Configuración de Vercel preparada
- [ ] **Frontend desplegado en Vercel** ← SIGUIENTE PASO
- [ ] Frontend ↔ Backend comunicación verificada
- [ ] Login end-to-end funcionando
- [ ] Todos los endpoints testeados

---

## 📁 Estructura del Proyecto

```
casatic/
├── backend/
│   ├── src/
│   │   ├── CasaticDirectorio.Api/
│   │   ├── CasaticDirectorio.Domain/
│   │   └── CasaticDirectorio.Infrastructure/
│   ├── Dockerfile
│   └── railway.toml
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── App.jsx
│   ├── vercel.json
│   ├── vite.config.js
│   └── package.json
│
└── [archivos de documentación]
```

---

## 🎯 Próximos Pasos

1. **Ahora:** Deploy el Frontend en Vercel (ver instrucciones arriba)
2. **Después:** Probar la integración completa Frontend ↔ Backend
3. **Luego:** Habilitar database seeding (SKIP_SEED=false)
4. **Finalmente:** Testing e iteración de features

---

## 📞 Soporte

- **Railway Dashboard:** https://railway.com/project/8e6e3238-4677-4153-b623-b6ccddf6f1a3
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repository:** https://github.com/CASATIC2026/Directorio-Interactivo-de-CASATIC-2026---Frontend

---

## 📝 Notas Técnicas

- **Backend:** .NET 8.0 ASP.NET Core con EF Core + PostgreSQL
- **Frontend:** Vite + React con TailwindCSS
- **Monorepo:** Backend y Frontend en mismo repositorio con deploys independientes
- **CI/CD:** Railway (Backend) y Vercel (Frontend) con auto-deploy en cada push
- **Autenticación:** JWT Bearer tokens con validación en Backend
- **CORS:** Configurado para Vercel frontend y localhost (desarrollo)

---

**Estado Final:** ✅ Listo para Vercel  
**Última Actualización:** 2026-06-04  
**Ambos servicios listos para comunicarse:** Backend + Frontend
