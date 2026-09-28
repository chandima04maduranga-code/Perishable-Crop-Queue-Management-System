# CropQueue frontend

React frontend for Chandima and Nikarsan's Perishable Crop Queue Management System.

Use the step-by-step `START-HERE.md` supplied with this kit. When adding this folder to the shared repository, copy that guide to the repository root as `FRONTEND-STEPS.md`.

Requires Node.js 22.12 or newer.

```bat
npm ci
copy .env.example .env
npm run dev
```

Edit `.env` before starting if the API runs on another laptop. Use the backend computer's IP in `VITE_API_URL`; the default is `http://localhost:5000/api`.

```bat
npm run build
npm run preview
```

The backend must be running for records to load. This frontend does not connect directly to MySQL and does not implement authentication.
