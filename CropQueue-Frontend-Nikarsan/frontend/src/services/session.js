// The token lasts for this browser tab. Passwords and cached user roles are never stored.
export const SESSION_KEY = "cropqueue_session_token";
let token = "";
try {
  token = sessionStorage.getItem(SESSION_KEY) || "";
} catch {
  /* Memory-only session if storage is blocked. */
}
const listeners = new Set();
export const getToken = () => token;
export function setToken(value) {
  token = value || "";
  try {
    if (token) sessionStorage.setItem(SESSION_KEY, token);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* Requests still use the in-memory token for this page. */
  }
}
export function subscribeSession(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function notifySession(event) {
  for (const listener of listeners) listener(event);
}
