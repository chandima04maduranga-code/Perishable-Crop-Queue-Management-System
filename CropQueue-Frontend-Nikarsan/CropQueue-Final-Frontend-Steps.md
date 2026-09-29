# CropQueue — Nikarsan's complete frontend guide

Version 2.0 · 29 September 2026

This package contains the complete React frontend: the colourful Sri Lankan farm design, public pages, login, registration, account approval UI, role permissions, crop management, FIFO distribution and history. Start with this package even if you have not used any earlier ZIP.

**Nikarsan builds and runs the frontend. Chandima builds and runs the backend and database.**

## What is included

| Page | Browser path | Who can use it? |
| --- | --- | --- |
| Farm overview | `/` | Everyone |
| Crop batches, search and filters | `/crops` | Everyone |
| FIFO status | `/distribution` | Everyone can view; Admin and Distributor can distribute |
| How it works | `/about` | Everyone |
| Sign in | `/login` | Visitors with an approved account |
| Create account | `/register` | Visitors; request Farm Manager or Distributor access |
| Add a crop batch | `/crops/add` | Admin, Farm Manager |
| Edit an eligible batch | `/crops/:id/edit` | Admin, Farm Manager |
| Distribution history | `/history` | All active signed-in users, matching the supplied backend routes |
| My account and sign out | `/account` | All active signed-in users |
| Approve accounts and manage users | `/users` | Admin |

Existing crop field names, FIFO ordering and distribution request bodies are preserved. Accounts requested through registration start as **PENDING**, then an Admin changes them to **ACTIVE**. A disabled account cannot sign in. The frontend does not offer public Admin registration.

## Step 1 — Confirm Chandima's backend is ready

Send Chandima `API-CONTRACT.md` from this package. He should complete the backend/database authentication work from the notes you uploaded and ensure:

1. The `users` table exists.
2. `/api/auth/register`, `/api/auth/login` and `/api/auth/me` work.
3. Admin user management uses `GET /api/users`, `PATCH /api/users/:id` and `DELETE /api/users/:id`.
4. Public dashboard/crop reads work without a token.
5. Crop writes require Admin or Farm Manager; distributions require Admin or Distributor.
6. Distribution history allows all active signed-in roles, as in his supplied route code.
7. Chandima's initial Admin account has been created by his seed script.
8. The API allows requests from the frontend, including the `Authorization` header.

You can work on the frontend design while he finishes. Full login and database tests need these API routes running. There are no working accounts or passwords built into the frontend.

If the API is running on Chandima's laptop, you do not need his MySQL password or a MySQL installation on your laptop. Your frontend connects to his API.

## Step 2 — Open your existing Git repository in VS Code

Use **File → Open Folder** and choose the cloned repository containing your project. From your earlier setup, this may be:

`C:\Users\Admin\Documents\DevOps\Perishable-Crop-Queue-Management-System`

Use your actual clone location if it differs. A folder extracted from GitHub ending in `-main` is not automatically a Git repository.

Open **Terminal → New Terminal**, select **PowerShell**, and check:

```powershell
git rev-parse --show-toplevel
git status
node -v
npm -v
```

The first command should print your repository root. Use Node.js 22.12 or newer.

If you have not cloned the project at all, open a terminal in the folder where you keep projects and run:

```powershell
git clone https://github.com/chandima04maduranga-code/Perishable-Crop-Queue-Management-System.git
cd Perishable-Crop-Queue-Management-System
code .
```

## Step 3 — Create your frontend branch

Keep a backup of any frontend files you already edited. Save/commit existing changes on their current branch before switching branches; do not discard them.

Once Chandima has merged his backend authentication work into `main`, and your working tree is clean, run from the repository root:

```powershell
git switch main
git pull --ff-only origin main
git switch -c feature/final-frontend
```

If `feature/final-frontend` already exists, use `git switch feature/final-frontend`.

## Step 4 — Copy the complete frontend into the repository

1. Download and extract `CropQueue-Frontend-Nikarsan.zip`.
2. Open the extracted `CropQueue-Frontend-Nikarsan` folder.
3. Stop an old frontend terminal with **Ctrl+C**, if one is running.
4. Back up your existing `frontend` folder outside the Git repository.
5. Copy this package's **`frontend` folder** into the cloned repository, beside `backend`. Replace matching frontend source files after taking the backup.
6. Keep your existing `frontend/.env` if it has the working API address. The package contains `.env.example`, not a private `.env`.
7. Copy this guide to the repository root as `FRONTEND-STEPS.md`; copy `API-CONTRACT.md` there too.

Expected locations:

| Location | Contents |
| --- | --- |
| `backend/` | Chandima's backend |
| `frontend/package.json` | Complete frontend project and commands |
| `frontend/src/` | React pages, reusable components and API/authentication code |
| `frontend/public/images/` | Leaf logo, Sri Lankan farm illustrations and vegetable crate |
| `frontend/.env` | Your frontend API settings |
| `FRONTEND-STEPS.md` | This guide copied into your repository |
| `API-CONTRACT.md` | Shared frontend/backend interface |

The frontend project is already created. Run it directly; you do not need to create a new Vite project or paste snippets from the earlier authentication notes over these complete files.

## Step 5 — Install the frontend dependencies

In the VS Code terminal, from the repository root:

```powershell
cd frontend
npm ci
```

`npm ci` uses the supplied lockfile. Do not copy someone else's `node_modules` folder.

## Step 6 — Set the backend address

Still inside `frontend`, create `.env` only if it does not already exist:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Open `frontend/.env` in VS Code. Choose the setting that matches where Chandima's API is running.

**Backend running on the same laptop as your browser:**

```dotenv
VITE_API_URL=http://localhost:5000/api
VITE_DATE_TIMEZONE=Asia/Colombo
```

**Backend running on Chandima's laptop, while you use your own laptop:**

Both laptops must be on a network where they can reach each other. Ask Chandima for his laptop's active IPv4 address from `ipconfig`. For example, if his address is `192.168.1.10`:

```dotenv
VITE_API_URL=http://192.168.1.10:5000/api
VITE_DATE_TIMEZONE=Asia/Colombo
```

Replace that example address with his actual address. `localhost` in your browser means your own computer. Keep `/api` at the end of the URL.

Open the chosen backend address in your browser, such as:

- `http://192.168.1.10:5000/api/health`
- `http://192.168.1.10:5000/api/crops`

The crop endpoint should return JSON. An empty `data: []` array is normal if no batches exist. If the address cannot be reached, Chandima should check that his API is running and the private-network connection/firewall permits it.

Keep only public frontend settings in this `.env`. MySQL credentials, `JWT_SECRET` and the Admin seed password belong in Chandima's backend configuration.

## Step 7 — Start the colourful frontend

Inside `frontend`:

```powershell
npm run dev
```

Open the URL printed by Vite, normally:

`http://localhost:5173`

You should immediately see the colourful public farm overview. Sign-in is optional for browsing.

If 5173 is occupied, stop the previous frontend process, or run:

```powershell
npm run dev -- --port 5174
```

Then open `http://localhost:5174`.

Keep the frontend terminal and Chandima's backend running. Restart the frontend after changing `.env`.

If you want Chandima to open your frontend on his laptop over the same trusted network, start Vite with:

```powershell
npm run dev -- --host 0.0.0.0
```

He can use the network URL printed by Vite. Your configured API URL must be reachable from his browser too.

## Step 8 — Check the public website first

Before logging in:

1. Open **Overview** and check the four metric cards.
2. Open **Crop batches**; search by crop name or storage location.
3. Check the status and expiry filters. The bell opens the near-expiry filter.
4. Open **FIFO queue** and view the next batch.
5. Open **How it works**.

Visitors must not see Add/Edit/Delete controls, a distribution form, user management or private history. Opening a protected URL directly should lead to sign-in; it should not enable the action.

If the database is empty, the app shows empty states. Sample records in preview pictures are not added to your database.

## Step 9 — Create Nikarsan's Farm Manager account

1. Click **Create account**.
2. Enter your name and your own email address.
3. Select **Farm Manager**.
4. Enter and confirm your password (at least eight characters).
5. Click **Create account**.
6. The page shows **Approval pending**.

Your first login is possible only after an Admin approves the request. Trying to log in beforehand should display the backend's approval message.

## Step 10 — Chandima approves the account through the frontend

1. Chandima opens **Sign in**.
2. He uses the Admin email and password he configured in his backend seed setup.
3. Open **Manage users**.
4. Find Nikarsan's account. Its status should be **Pending**.
5. Check that the role is **Farm Manager**, then click **Approve**.
6. Sign out.

You can now sign in using your own account. Role selection is part of registration/approval; there is no separate role selector that grants permissions on the login page.

## Step 11 — Test your Farm Manager features

Use development/test records agreed with Chandima.

1. Sign in as Nikarsan.
2. Check that your name and **Farm Manager** role are visible.
3. Add a crop batch with a name, positive quantity, harvest date, expiry date and storage location.
4. Open Crop batches and verify the new record remains after refreshing.
5. Edit an unused batch's storage location and save.
6. Delete a temporary unused batch, confirming the deletion.
7. Check the public FIFO details and signed-in distribution history.
8. Confirm that no distribution form or Manage users page is available to your role.

Once a batch has distribution history, this interface retains its records and disables edit/delete controls. Chandima's server must enforce the business rules for every API client as well.

## Step 12 — Test Distributor and Admin features together

Create a separate test account through **Create account**, selecting **Distributor**, and have Chandima approve it. Use an email address distinct from the Farm Manager account.

For an isolated FIFO test, start with two development batches in the intended queue order:

| Batch | Crop | Quantity | Harvest | Expiry | Storage |
| --- | --- | --- | --- | --- | --- |
| A | Brinjal | 100 kg | Earlier date | A suitable later date | Cold Room A |
| B | Okra | 80 kg | One day after A | A suitable later date | Cold Room B |

Other older available records will take priority, so inspect the actual next batch first.

As Distributor:

1. Open FIFO queue; A should be next if it is the oldest available harvest.
2. Distribute 25 kg. A should have 75 kg left and remain first.
3. Distribute the remaining 75 kg. A becomes fully distributed and B becomes next.
4. Check both records in Distribution history.
5. Confirm you cannot add/edit/delete crop batches or open Manage users.

As Admin:

1. Check access to all crop and distribution functions.
2. Approve a pending account.
3. Change another test account's role or status, then click **Save changes**.
4. Disable a test account and verify that sign-in is rejected.
5. Re-enable it and verify sign-in works.
6. Delete a disposable account only if it is no longer needed.

Your own current Admin account is read-only on this user-management screen to avoid accidental self-lockout.

## Step 13 — Check sessions, errors and mobile layout

- Refresh while signed in: the frontend calls `/auth/me` to verify the current account.
- Sign out: the token is removed, privileged controls disappear, and you return to sign-in. Public navigation remains available.
- Expired token: the frontend asks you to sign in again after the API rejects it.
- Changed role: a permission error triggers account rechecking; the backend remains the authority.
- Temporary account-service failure: use **Retry session**; the app retains the token for recovery instead of treating the network failure as a bad password.
- Failed save/distribution response: refresh records/history before submitting again. Requests are not automatically retried.
- Narrow the browser or use mobile device mode. Check the menu button, forms and tables. Wide tables scroll within their panels.

Sessions use browser `sessionStorage` for this tab and an in-memory token while the page is open. No password is saved. A page refresh preserves the tab session; signing out removes it. The server controls token expiry. This matches the provided Bearer-token API; it is not an HttpOnly-cookie authentication implementation.

## Step 14 — Check the production build

Stop the frontend terminal with **Ctrl+C**, then run inside `frontend`:

```powershell
npm run build
npm run preview
```

Open the preview URL printed by Vite and check that the pages load. The backend must still run for data and login. Stop preview with **Ctrl+C** afterward.

`dist` is generated output and stays ignored by Git. Later hosting needs an SPA fallback to `index.html` for frontend routes; an HTTPS deployment also needs an HTTPS API address. Those deployment tasks can follow your DevOps phases.

## Step 15 — Commit and push only your frontend work

From `frontend`, return to the repository root:

```powershell
cd ..
git status
git add frontend FRONTEND-STEPS.md API-CONTRACT.md
git diff --cached --stat
git commit -m "feat: complete colourful frontend with public access and role based login"
git push -u origin feature/final-frontend
```

Before committing, check that the staged changes are the frontend and the two intended documents. The frontend `.gitignore` excludes `.env`, dependency folders and build output.

In GitHub, create a pull request from **feature/final-frontend** into **main**. Ask Chandima to review the frontend/API integration, then merge through your team's normal workflow.

After the merge, both developers can update a clean local checkout:

```powershell
git switch main
git pull --ff-only origin main
```

A GitHub push stores the source code; it does not automatically make the website publicly hosted.

## Learn and explain your frontend in this order

All complete source files are in `frontend/src`; each file below has one clear responsibility.

| Order | File | What it does |
| --- | --- | --- |
| 1 | `services/api.js` | Backend address, HTTP requests, Bearer header and response errors |
| 2 | `services/session.js` | Stores/removes the token and emits session events |
| 3 | `context/AuthContext.jsx` | Login, logout, `/auth/me`, session restoration and role refresh |
| 4 | `utils/permissions.js` | Role names and allowed crop/distribution actions |
| 5 | `components/ProtectedRoute.jsx` | Handles direct protected URLs, pending session checks and restricted roles |
| 6 | `App.jsx` and `main.jsx` | Mount React/AuthProvider and connect routes |
| 7 | `components/Layout.jsx` and `index.css` | Farm design, navigation, search, profile and mobile layout |
| 8 | `pages/Login.jsx` and `pages/Register.jsx` | Form state, validation, authentication requests and approval confirmation |
| 9 | `pages/UserManagement.jsx` | Admin list, approval, role/status changes and deletion |
| 10 | `pages/Dashboard.jsx` and `pages/CropBatches.jsx` | Public data, search/filter controls and conditional management actions |
| 11 | `components/CropForm.jsx`, `pages/AddCrop.jsx`, `pages/EditCrop.jsx` | Create/edit input validation and crop API requests |
| 12 | `pages/DistributionQueue.jsx` and `pages/DistributionHistory.jsx` | Public FIFO view, authorized quantity submission and history |
| 13 | `pages/Account.jsx` and `pages/About.jsx` | Account details, role tasks and the public explanation page |
| 14 | `hooks/useResource.js` and `utils/format.js` | Loading/retry/cancellation, numbers and date handling |

## Troubleshooting

| Problem | What to check |
| --- | --- |
| `fatal: not a git repository` | Open your cloned repository, not the extracted ZIP folder. |
| `Missing script: dev` | The terminal must be inside `frontend`. |
| Old design still appears | Check which folder Vite is running from, restart it, then hard-refresh with Ctrl+F5. |
| Cannot connect to the service | Backend is running, correct API address and port, both computers can reach each other. |
| Public pages work but login says service unavailable / returns 404 | Chandima still needs to add/register the auth routes. Check `API-CONTRACT.md`. |
| JSON error after a page request | Check that `VITE_API_URL` ends in `/api` and points to Express, not Vite. |
| Waiting for Admin approval | Admin must approve the account before the first sign-in. |
| Invalid email or password | Use the actual registered credentials; there are no built-in frontend test passwords. |
| History fails for Farm Manager | The supplied contract allows every active authenticated role to GET history; compare Chandima's route middleware. |
| Admin changes fail | User updates use **PATCH**, not PUT. |
| HTTP 401 | Token missing, expired or rejected. Sign in again. |
| HTTP 403 | Account is inactive or the role does not have permission. |
| Dates appear a day early | Match `VITE_DATE_TIMEZONE` to the backend host timezone; keep Asia/Colombo for the current setup. |

This frontend was checked with browser tests against simulated responses matching the uploaded backend notes. Complete the real two-laptop tests above with Chandima before merging. Details are in `VERIFICATION.md`.
