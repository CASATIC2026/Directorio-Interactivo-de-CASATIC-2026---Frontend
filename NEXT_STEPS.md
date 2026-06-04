# Casatic - Próximos Pasos de Despliegue

## Estado Actual (2026-06-04)

### ✅ Backend (Railway)
- **Proyecto**: casatic-backend
- **Región**: San Francisco (sfo)
- **Base de Datos**: PostgreSQL ✅ Online
- **API Service**: Desplegando... (últimas actualizaciones: variables de conexión + SKIP_SEED)
- **URL**: https://casatic-backend-production.up.railway.app (cuando esté online)

### 📋 Frontend (Vercel) 
- **Estado**: Listo para desplegar
- **Framework**: Vite (React)
- **Build**: `npm run build`
- **Output**: `dist/`

---

## Pasos Inmediatos

### 1. Verificar Backend Online (mientras se despliega)
```bash
# Ver estado del deploy
railway status

# Ver logs
railway logs -s api --tail 50

# URL de prueba (cuando esté online):
curl https://casatic-backend-production.up.railway.app/health
```

### 2. Desplegar Frontend en Vercel
```bash
# Desde la carpeta frontend, conectar a Vercel:
# 1. Ir a https://vercel.com/new
# 2. Importar repositorio
# 3. Configurar variables de entorno:
#    - VITE_API_URL=https://casatic-backend-production.up.railway.app
#    - VITE_APP_NAME=Casatic
#    - VITE_APP_ENV=production
# 4. Deploy
```

### 3. Probar Integración Completa
```
1. Ir a https://casatic-frontend.vercel.app
2. Login con admin@casatic.org / Admin@123456
3. Verificar funcionalidades:
   - Listar socios
   - Crear factura
   - Ver reportes
   - Upload de archivos
```

---

## Configuración del Backend

### Variables de Entorno (Ya Configuradas)
| Variable | Valor |
|----------|-------|
| `ConnectionStrings__DefaultConnection` | postgresql://postgres:***@postgres.railway.internal:5432/railway |
| `JWT_KEY` | b286493c4a20b7889155b6960c0072e7 |
| `PORT` | 8080 |
| `SEED_ADMIN_PASSWORD` | Admin@123456 |
| `SKIP_SEED` | true |
| `Jwt__Issuer` | CasaticDirectorio |
| `Jwt__Audience` | CasaticDirectorioClients |
| `Cors__AllowedOrigins` | https://casatic-frontend.vercel.app,http://localhost:3000 |

### Base de Datos
- **Host**: postgres.railway.internal
- **Puerto**: 5432
- **Base**: railway
- **Usuario**: postgres
- **Contraseña**: (secreta en Railway)

### Endpoints Disponibles
- `GET /health` - Healthcheck
- `POST /api/auth/login` - Login
- `GET /api/socios` - Listar socios
- `POST /api/facturas` - Crear factura
- `GET /api/reportes` - Reportes
- `/swagger` - Documentación API (dev only)

---

## Troubleshooting

### Si Backend no inicia
```bash
# Ver logs completos
railway logs -s api

# Mostrar variables
railway service api && railway variable ls

# Resetear deployment
railway up --detach
```

### Si conecta a BD pero falla
1. Verificar `ConnectionStrings__DefaultConnection`
2. Confirmar que PostgreSQL está online: `railway service Postgres && railway variable ls`
3. Revisar logs de aplicación

### Si frontend no ve backend
1. Verificar `VITE_API_URL` en Vercel
2. Confirmar CORS en backend: `Cors__AllowedOrigins`
3. Revisar Network tab del navegador

---

## Base de Datos - Primera Ejecución

Cuando el API arranque con `SKIP_SEED=false`:
1. Crea tablas automáticamente (EF Core)
2. Ejecuta DataSeeder.SeedAsync()
3. Crea admin con: admin@casatic.org / (contraseña de SEED_ADMIN_PASSWORD)

Para habilitarlo después:
```bash
railway service api && railway variables set SKIP_SEED=false
railway up --detach
```

---

## Verificación Post-Deploy

### Backend
- [ ] Health check responde: `/health`
- [ ] Swagger disponible: `/swagger`
- [ ] JWT tokens generados correctamente
- [ ] CORS headers presente en respuestas
- [ ] Logs no muestran errores

### Frontend
- [ ] Build exitoso en Vercel
- [ ] Variables de entorno configuradas
- [ ] API URL correcta en console
- [ ] Login funciona
- [ ] Datos cargados correctamente

### Integración
- [ ] Frontend → Backend conexión
- [ ] Autenticación end-to-end
- [ ] Upload de archivos funciona
- [ ] Reportes se generan
- [ ] No hay errores CORS

---

## Rollback (Si es necesario)

### Backend
```bash
# Ver deployment history
railway logs -s api

# Reintentar
railway up --detach

# En último caso, resetear completamente
railway delete --project casatic-backend --yes
```

### Frontend
En Vercel dashboard → Deployments → Revert a deploy anterior

---

## Contacto y Soporte

- **Railway Dashboard**: https://railway.com
- **Vercel Dashboard**: https://vercel.com
- **GitHub Repo**: (agregar cuando esté disponible)
- **Logs**: `railway logs -s [servicio]`

---

**Última actualización**: 2026-06-04
**Estado**: Backend desplegándose, Frontend listo
