import axios from "axios";

// GET responses use snake_case fields. POST/PUT crop bodies use camelCase.
const api = axios.create({
  baseURL: (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  ).replace(/\/$/, ""),
  timeout: 15000,
});

export async function readData(path, signal) {
  const response = await api.get(path, { signal });
  if (response.data?.success !== true || !("data" in response.data)) {
    throw new Error(
      "Unexpected API response. Check VITE_API_URL and the backend route.",
    );
  }
  return response.data.data;
}

export function errorMessage(error) {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === "ECONNABORTED")
    return "The server took too long to respond. Refresh the records before retrying a save or distribution.";
  if (error.code === "ERR_NETWORK")
    return "Cannot reach the backend. Check its address, that it is running, and your network connection. If you submitted a change, refresh the records before retrying.";
  return error.message || "Something went wrong. Please try again.";
}

export default api;
