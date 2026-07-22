# PUBLIC DEPLOYMENT GUIDE — v1.0.0
**Hazrat Aisha Academy Platform**

## 📦 Deployment Environment Prerequisites
- **Runtime**: Node.js 18+ (Containerized Cloud Run / Cloud Hosted environment)
- **Port**: Binds to Port `3000` (0.0.0.0)
- **Build Tool**: Vite + Esbuild CJS bundler for server entry point

---

## 🛠️ Step-by-Step Production Deployment

### Step 1: Environment Variables Setup
Configure the environment variables in `.env` or container settings:

```env
# Server & App Environment
NODE_ENV=production
PORT=3000

# Firebase Storage & Auth (Optional if Firebase project is bound)
FIREBASE_PROJECT_ID=
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Production Build Execution
Run the unified build command:
```bash
npm run build
```
This script performs two operations:
1. `vite build`: Compiles all frontend client code into `/dist`.
2. `esbuild server.ts`: Bundles the Express server entry point into `/dist/server.cjs`.

### Step 4: Launch Production Server
```bash
npm run start
```
The application will start listening on `http://0.0.0.0:3000`.

---

## 🌐 Reverse Proxy & SSL Configuration
When deploying behind Nginx or Cloud Run:
- Ensure incoming HTTPS requests reverse proxy to local port `3000`.
- Verify domain routing for `hazrataishaacademy.com` to point to the server deployment IP.
- Confirm `sitemap.xml` and `robots.txt` are served directly from the root asset path `/`.
