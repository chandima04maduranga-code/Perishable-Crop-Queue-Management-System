import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import api, { errorMessage, readData, responseData } from "../services/api.js";
import { getToken, setToken, subscribeSession } from "../services/session.js";
import { isActiveUser } from "../utils/permissions.js";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    loading: Boolean(getToken()),
    error: "",
    notice: "",
  });
  const revision = useRef(0);
  const pending = useRef(null);
  const lastVerified = useRef(0);

  const logout = useCallback((notice = "You have been signed out.") => {
    revision.current += 1;
    pending.current?.abort();
    pending.current = null;
    setToken("");
    setState({ user: null, loading: false, error: "", notice });
  }, []);

  const refreshUser = useCallback(
    async ({ quiet = false } = {}) => {
      const token = getToken();
      if (!token) return null;
      const current = ++revision.current;
      pending.current?.abort();
      const controller = new AbortController();
      pending.current = controller;
      if (!quiet) setState((old) => ({ ...old, loading: true, error: "" }));
      try {
        const user = await readData("/auth/me", controller.signal, {
          skipSessionEvents: true,
        });
        if (
          controller.signal.aborted ||
          current !== revision.current ||
          token !== getToken()
        )
          return null;
        if (!isActiveUser(user)) {
          logout(
            "Your account is not active. Please contact the administrator.",
          );
          return null;
        }
        lastVerified.current = Date.now();
        setState({ user, loading: false, error: "", notice: "" });
        return user;
      } catch (error) {
        if (
          controller.signal.aborted ||
          current !== revision.current ||
          token !== getToken()
        )
          return null;
        if ([401, 403].includes(error.response?.status)) {
          logout(
            error.response.status === 403
              ? "Your account is not active. Please contact the administrator."
              : "Your session has expired. Please sign in again.",
          );
        } else {
          // A network/server failure is not an invalid password: retain the token for Retry.
          setState({
            user: null,
            loading: false,
            error: errorMessage(error),
            notice: "",
          });
        }
        return null;
      } finally {
        if (pending.current === controller) pending.current = null;
      }
    },
    [logout],
  );

  useEffect(() => {
    refreshUser();
    const unsubscribe = subscribeSession((event) => {
      if (event.type === "expired")
        logout("Your session has expired. Please sign in again.");
      if (event.type === "verify" && !pending.current)
        refreshUser({ quiet: true });
    });
    const checkOnReturn = () => {
      if (
        getToken() &&
        !pending.current &&
        Date.now() - lastVerified.current > 30000
      )
        refreshUser({ quiet: true });
    };
    window.addEventListener("focus", checkOnReturn);
    const onVisibility = () => {
      if (document.visibilityState === "visible") checkOnReturn();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      revision.current += 1;
      pending.current?.abort();
      pending.current = null;
      unsubscribe();
      window.removeEventListener("focus", checkOnReturn);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [logout, refreshUser]);

  async function login(email, password) {
    const attempt = ++revision.current;
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    try {
      const data = responseData(
        await api.post(
          "/auth/login",
          { email: email.trim().toLowerCase(), password },
          {
            anonymous: true,
            skipSessionEvents: true,
            signal: controller.signal,
          },
        ),
      );
      if (controller.signal.aborted || attempt !== revision.current)
        throw new Error("Sign-in was cancelled. Please try again.");
      if (
        typeof data?.token !== "string" ||
        !data.token ||
        !isActiveUser(data.user)
      )
        throw new Error(
          "Sign-in could not be verified. Please contact the administrator.",
        );
      setToken(data.token);
      lastVerified.current = Date.now();
      setState({ user: data.user, loading: false, error: "", notice: "" });
      return data.user;
    } finally {
      if (pending.current === controller) pending.current = null;
    }
  }

  const dismissNotice = useCallback(
    () => setState((old) => ({ ...old, notice: "" })),
    [],
  );
  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, refreshUser, dismissNotice }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}
