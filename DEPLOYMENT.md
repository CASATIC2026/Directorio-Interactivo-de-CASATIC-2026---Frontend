# Deployment Configuration - Casatic

## Railway Backend Setup

### Project Information
- **Project Name:** casatic-backend
- **Project ID:** 8e6e3238-4677-4153-b623-b6ccddf6f1a3
- **Environment:** production
- **Workspace:** cesarreyes2023's Projects

### Services Configured

#### 1. PostgreSQL Database
- **Status:** ✅ Online
- **Type:** Postgres
- Multiple instances configured for redundancy

#### 2. API Service (CasaticDirectorio.Api)
- **Service ID:** ad85cd66-6edc-49c1-9937-2a8223d173a9
- **Builder:** Dockerfile
- **Status:** Deploying...

### Environment Variables Set
```
JWT_KEY=b286493c4a20b7889155b6960c0072e7
SEED_ADMIN_PASSWORD=Admin@123456
CORS_ORIGINS=https://casatic-frontend.vercel.app,http://localhost:3000
PORT=8080
```

### Build Configuration
- **Dockerfile Path:** `/Dockerfile`
- **Build Stage:** Multi-stage build (SDK 8.0 → ASP.NET Runtime 8.0)
- **Health Check Endpoint:** `/health`
- **Runtime User:** casatic (non-root for security)

### Deployment Steps Completed
✅ 1. Created Railway project (casatic-backend)
✅ 2. Added PostgreSQL database
✅ 3. Added API service
✅ 4. Configured environment variables
✅ 5. Linked local backend folder to Railway
✅ 6. Built Docker image locally (casatic-backend:latest)
🔄 7. Deploying Docker image to Railway (Status: Building)

### Backend Deployment URL
Will be available at: `https://casatic-backend-production.up.railway.app`
Health check: `/health`

### Next Steps - Railway Backend
- ✅ Wait for compilation to complete
- ✅ Verify API health endpoint responds
- Test database connectivity with sample queries
- Monitor logs for any runtime errors

### Frontend - Vercel Configuration
Files prepared:
- `.env.development` - Local dev environment
- `.env.example` - Template for environment variables
- `VERCEL_CONFIG.md` - Deployment instructions
- `vercel.json` - Vite build configuration

Environment variables to set in Vercel:
```
VITE_API_URL=https://casatic-backend-production.up.railway.app
VITE_APP_NAME=Casatic
VITE_APP_ENV=production
```

### Deployment Checklist
- [ ] Backend API online and responding to health checks
- [ ] PostgreSQL connection verified
- [ ] Connect frontend repository to Vercel
- [ ] Set environment variables in Vercel
- [ ] Deploy frontend
- [ ] Test full authentication flow end-to-end
