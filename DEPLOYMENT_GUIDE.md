# Deployment Guide - Hazrat Aisha Academy

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Backend configuration

## Environment Variables
Create a `.env` file in the root directory and ensure the following variables are set (refer to `.env.example`):
```
VITE_API_BASE_URL=/api
# Add any other required integration keys here
```

## Build Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the production bundle:
   ```bash
   npm run build
   ```
   This will generate optimized static assets in the `dist` directory.

## Deployment Options

### Cloud Run / Docker
1. The app is container-ready. Make sure your server setup maps port `3000`.
2. Start the Express server serving the static files:
   ```bash
   npm run start
   ```

### Static Hosting (Vercel, Netlify, Firebase Hosting)
1. Configure the deployment platform to use the `dist` folder as the publish directory.
2. Ensure that SPA routing is enabled (i.e., rewrite all requests to `index.html`).

## Post-Deployment Checklist
- Verify that `https://yourdomain.com/sitemap.xml` and `/robots.txt` are accessible.
- Test authentication flows in the live environment.
- Verify API endpoint connectivity.
