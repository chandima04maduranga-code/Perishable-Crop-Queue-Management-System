import axios from "axios";
import { getToken, notifySession } from "./session.js";

// The supplied backend uses snake_case reads and camelCase crop writes.
const api = axios.create({
  baseURL: (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  ).replace(/\/$/, ""),
  timeout: 15000,
});
api.interceptors.request.use((config) => {
  const token = config.anonymous ? "" : getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.sessionToken = token;
  return config;
});
api.interceptors.response.use(
  (response) => {
    if (response.data?.success === false)
      throw new Error(
        response.data.message || "The request could not be completed.",
      );
    return response;
  },
  (error) => {
    const { config, response } = error;
    // Ignore a late failure belonging to a previous session. Never retry a mutation automatically.
    if (
      !config?.skipSessionEvents &&
      config?.sessionToken &&
      config.sessionToken === getToken()
    ) {
      if (response?.status === 401) notifySession({ type: "expired" });
      if (response?.status === 403) notifySession({ type: "verify" });
    }
    return Promise.reject(error);
  },
);
export function responseData(response) {
  if (response.data?.success !== true || !("data" in response.data)) {
    throw new Error(
      "The service returned an unexpected response. Please try again or contact the administrator.",
    );
  }
  return response.data.data;
}
export async function readData(path, signal, options = {}) {
  return responseData(await api.get(path, { ...options, signal }));
}
export function errorMessage(error) {
  if (typeof error.response?.data?.message === "string")
    return error.response.data.message;
  if (error.response?.status === 404)
    return "This service is not available. Please contact the administrator.";
  if (error.code === "ECONNABORTED")
    return "The service took too long to respond. Refresh the records before retrying a save or distribution.";
  if (error.code === "ERR_NETWORK")
    return "Cannot connect to the service. Check your connection and try again. If you submitted a change, refresh the records before retrying.";
  return error.message || "Something went wrong. Please try again.";
}
export default api;
