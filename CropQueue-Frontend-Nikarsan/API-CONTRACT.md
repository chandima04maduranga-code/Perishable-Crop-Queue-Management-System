# CropQueue frontend/backend contract

Prepared from Chandima's supplied authentication notes and the existing crop backend. All routes below are relative to `VITE_API_URL`, normally `http://localhost:5000/api`.

## Response format

Data responses:

```json
{ "success": true, "data": {} }
```

Errors return an appropriate 4xx/5xx HTTP status:

```json
{ "success": false, "message": "A readable explanation" }
```

Successful delete responses may omit `data`. Lists use arrays in `data`; `/crops/next` returns a crop object or `null`.

## Authentication

| Method | Route | Request / response |
| --- | --- | --- |
| POST | `/auth/register` | `{name,email,password,requestedRole}` → new user with `status: PENDING`; no token |
| POST | `/auth/login` | `{email,password}` → `data: {token,user}` |
| GET | `/auth/me` | Bearer token → authoritative current user |

A user has `id`, `name`, `email`, `role`, `status`. Roles are `ADMIN`, `FARM_MANAGER`, `DISTRIBUTOR`; account states are `PENDING`, `ACTIVE`, `DISABLED`. Login succeeds only for ACTIVE accounts. Public registration allows FARM_MANAGER or DISTRIBUTOR only.

The frontend sends `Authorization: Bearer <token>` to authenticated API calls. It verifies the current account on page refresh, rechecks on return to a stale tab, clears rejected/expired sessions after 401, and rechecks permissions after 403. Network/server failures retain the token so verification can be retried. It does not decode a token or trust cached role data as proof of current access.

The token is stored per tab in sessionStorage. The supplied API has no refresh-token, server logout/revocation, password-reset or HttpOnly-cookie endpoints. Sign-out removes the browser token; server-side invalidation of a stolen token before expiry would require backend support. Frontend route guards and hidden buttons are user-interface behaviour; the backend must enforce roles and account status for every protected request.

## Exact permissions and payloads

| Method | Route | Access | Body / returned data |
| --- | --- | --- | --- |
| GET | `/dashboard` | Public | `{totalBatches,availableQuantity,nearExpiryBatches,distributedBatches}` |
| GET | `/crops` | Public | Crop array ordered by harvest date, then ID |
| GET | `/crops/next` | Public | Oldest AVAILABLE nonempty batch, or null |
| GET | `/crops/:id` | Public | One crop batch |
| POST | `/crops` | ADMIN, FARM_MANAGER | `{cropName,quantity,harvestDate,expiryDate,storageLocation}` |
| PUT | `/crops/:id` | ADMIN, FARM_MANAGER | Same complete crop body |
| DELETE | `/crops/:id` | ADMIN, FARM_MANAGER | No body |
| GET | `/distributions` | Any ACTIVE signed-in role | History array, latest first |
| POST | `/distributions` | ADMIN, DISTRIBUTOR | `{quantity}` only |
| GET | `/users` | ADMIN | User array, including created_at/updated_at when available |
| PATCH | `/users/:id` | ADMIN | `{role,status}`; return updated user |
| DELETE | `/users/:id` | ADMIN | No body |

**Use PATCH for user updates.** The beginning of the pasted discussion mentions possible PUT/POST user routes, but its final implemented router defines GET/PATCH/DELETE. This frontend follows that concrete router. Accounts are created through public registration and then approved. The initial Admin is created by Chandima's seed script.

## Crop and distribution fields

Crop reads use:

```json
{
  "id": 1,
  "crop_name": "Brinjal",
  "quantity": "100.00",
  "harvest_date": "2026-09-29",
  "expiry_date": "2026-10-03",
  "storage_location": "Cold Room A",
  "status": "AVAILABLE"
}
```

Crop statuses are AVAILABLE or DISTRIBUTED. Near-expiry and past-expiry badges are derived display labels; they do not change the database status.

The frontend accepts quantity strings returned for MySQL DECIMAL values. It accepts calendar-date strings or the supplied backend's ISO timestamp representation of SQL DATE values. `VITE_DATE_TIMEZONE` should match the backend host timezone when interpreting those timestamp responses.

Distribution success data:

```json
{
  "distributionId": 1,
  "cropBatchId": 1,
  "cropName": "Brinjal",
  "distributedQuantity": 25,
  "remainingQuantity": 75,
  "status": "AVAILABLE"
}
```

History records use `id`, `crop_batch_id`, `crop_name`, `quantity`, `distributed_at`.

FIFO remains global across crops: `harvest_date ASC, id ASC`. A request distributes only from the current oldest available batch at server processing time. The frontend does not send a chosen batch ID or silently spread a request across several batches. The confirmation uses the actual batch returned by the server.

## Integration details Chandima should verify

- Public `/crops` does not depend on protected history. The frontend requests history for edit/delete eligibility only after an Admin or Farm Manager is verified.
- Users must stay ACTIVE to access protected routes. Roles should be checked against the current database record, as in the supplied middleware.
- Crop edit/delete restrictions and Admin account protections must also be enforced server-side. The UI keeps the current Admin's own account read-only and retains batches with history, but those checks cannot secure the API.
- The existing backend includes past-expiry available batches in FIFO. This frontend shows expiry warnings while preserving that order; it does not silently introduce a different queue rule.
- No backend files, SQL migrations, passwords or JWT secrets are included in this frontend package.
