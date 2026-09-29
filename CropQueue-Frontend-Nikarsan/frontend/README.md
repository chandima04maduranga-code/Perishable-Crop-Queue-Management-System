# CropQueue frontend

Complete React frontend for Chandima and Nikarsan's Perishable Crop Queue Management System. Includes the colourful farm design, public browsing, approved role-based accounts, Admin user management, crop management and FIFO distribution.

Use `CropQueue-Final-Frontend-Steps.md` supplied in the package, or `FRONTEND-STEPS.md` once copied into your repository. Backend/API requirements are in `API-CONTRACT.md`.

Requires Node.js 22.12 or newer. From this frontend folder in PowerShell:

```powershell
npm ci
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm run dev
```

Set `VITE_API_URL` in `.env` to Chandima's reachable API address, ending in `/api`. The default is `http://localhost:5000/api`; use his laptop's IP if the API runs there. Restart Vite after editing `.env`.

```powershell
npm run build
npm run preview
```

Public pages: `/`, `/crops`, `/distribution`, `/about`, `/login`, `/register`.
Protected pages: `/crops/add`, `/crops/:id/edit`, `/history`, `/account`, `/users`.

Accounts requested through registration need Admin approval. There are no frontend default passwords or mock-data fallbacks. Backend authentication/role middleware provides actual authorization. The UI uses sessionStorage for the current tab's Bearer token and verifies the current user through `/auth/me`.

Commit source, `package-lock.json`, `.env.example` and `public/images`. Keep `.env`, `node_modules` and `dist` ignored.
