# 🚀 DEPLOYMENT EN VERCEL - INSTRUCCIONES PASO A PASO

## 📋 Información Clave

- **Repositorio:** https://github.com/CASATIC2026/Directorio-Interactivo-de-CASATIC-2026---Frontend
- **Rama:** `desarrollo` 
- **Framework:** Vite + React
- **Backend API:** https://api-production-c13b.up.railway.app

---

## ✅ PASO 1: Ir a Vercel y Conectarse

1. Abre: **https://vercel.com/dashboard**
2. Haz login con tu cuenta de GitHub (o crea una si no tienes)
3. Si te pide autorizar a Vercel acceder a GitHub, autoriza

---

## ✅ PASO 2: Crear Nuevo Proyecto

1. Click en **"Add New"** → **"Project"**
2. Verás una lista de repositorios de GitHub
3. Busca: **`Directorio-Interactivo-de-CASATIC-2026---Frontend`**
4. Haz click en **"Import"**

---

## ✅ PASO 3: Configurar el Proyecto

### Project Name
```
casatic-frontend
```

### Framework Preset
- Selecciona: **Vite**

### Root Directory  
- Cambia a: **`frontend`** ← IMPORTANTE
- (Porque es un monorepo)

### Build Command
```
npm run build
```

### Output Directory
```
dist
```

### Environment Variables
**Agregar esta variable:**

| Clave | Valor |
|-------|-------|
| `VITE_API_URL` | `https://api-production-c13b.up.railway.app` |

---

## ✅ PASO 4: Seleccionar Rama

1. En la sección "Connect Git Repository"
2. Asegúrate que selecciona la rama: **`desarrollo`**
3. ✅ Deploy On Push: debe estar **habilitado**

---

## ✅ PASO 5: Deploy

1. Click en **"Deploy"**
2. Vercel empezará a:
   - Clonar el repositorio
   - Instalar dependencias (`npm install`)
   - Compilar el proyecto (`npm run build`)
   - Desplegar en CDN

---

## 🕐 Tiempo Estimado

- Instalación: 1-2 minutos
- Build: 2-3 minutos  
- **Total: 3-5 minutos**

---

## ✅ DESPUÉS DEL DEPLOY

### Tu URL estará lista en:
```
https://casatic-frontend.vercel.app
```

### Verificar que funciona:
1. Abre la URL arriba
2. Intenta hacer login con:
   - Email: `admin@casatic.sv`
   - Contraseña: `Admin@123456`

### Si hay errores de conexión al backend:
1. Abre DevTools (F12)
2. Ve a la pestaña "Network"
3. Verifica que las llamadas API van a: `https://api-production-c13b.up.railway.app`
4. Si ves errores CORS, revisa la configuración de CORS en Railway

---

## 🔧 Configurar Dominio Personalizado (Opcional)

Si quieres un dominio como `app.casatic.com`:

1. En Vercel Dashboard → Proyecto → Settings
2. Ve a "Domains"
3. Agrega tu dominio
4. Sigue las instrucciones para configurar DNS

---

## 📊 Ver Logs de Deployment

1. En Vercel Dashboard → Tu Proyecto
2. Click en la última deployment
3. "Logs" te mostrará:
   - `npm install` output
   - `npm run build` output
   - Errores si los hay

---

## 🔄 Actualizar el Deployment

Cada vez que hagas **`git push origin desarrollo`**, Vercel automáticamente:
1. Detecta el cambio
2. Clona el código actualizado
3. Rebuilda y redeploya
4. Actualiza la URL en vivo

---

## ⚠️ TROUBLESHOOTING

### "Build Failed"
```
Ver logs en Vercel → Revisar si hay errores en npm run build
Típicamente: falta de variables de entorno o syntax errors
```

### "Frontend no conecta al Backend"
```
1. Verificar que VITE_API_URL está configurada en Vercel
2. Verificar que el backend está online: curl https://api-production-c13b.up.railway.app/health
3. Revisar CORS en Railway: Cors__AllowedOrigins debe incluir https://casatic-frontend.vercel.app
```

### "Dominio muestra error 404"
```
El build probablemente falló. Revisar logs en Vercel dashboard.
```

---

## 📝 Notas

- El monorepo está estructurado como:
  ```
  casatic/
  ├── backend/ (en Railway)
  └── frontend/ (en Vercel)
  ```
  
- Vercel detecta automáticamente que es un monorepo si especificas `frontend/` como Root Directory

- Cada rama en GitHub puede tener su propio deployment en Vercel (Preview Deployments)

---

**¿Listo? ¡Empieza en Paso 1!** 🎉
