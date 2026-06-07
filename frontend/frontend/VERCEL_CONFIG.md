# Vercel Deployment Configuration for Casatic Frontend

## Environment Variables to Set in Vercel

Add the following environment variables in Vercel project settings:

### Production Environment
```
VITE_API_URL=https://casatic-backend-production.up.railway.app
VITE_APP_NAME=Casatic
VITE_APP_ENV=production
```

### Preview/Staging Environment (optional)
```
VITE_API_URL=https://casatic-backend-staging.up.railway.app
VITE_APP_NAME=Casatic Preview
VITE_APP_ENV=preview
```

### Development (local)
```
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=Casatic Dev
VITE_APP_ENV=development
```

## Vercel Configuration

- Framework: Vite (React)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Node Version: 18 (or 20)

## Important Notes

1. **API URL**: Replace with actual Railway backend URL after deployment
2. **CORS**: Backend CORS already configured to accept Vercel domain
3. **Token Storage**: Frontend uses localStorage for JWT tokens (secure flag not applicable for SPA)
4. **SSR/Edge Functions**: Not currently configured (standard SPA deployment)

## Deployment Steps

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy
4. Test authentication flow
5. Monitor error logs in Vercel dashboard
