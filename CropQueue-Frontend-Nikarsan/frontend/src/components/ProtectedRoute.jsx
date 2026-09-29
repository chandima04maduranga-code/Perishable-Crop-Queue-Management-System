import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Icon from "./Icon.jsx";
import { ROLE_LABELS } from "../utils/permissions.js";

export default function ProtectedRoute({ roles, children }) {
  const auth = useAuth();
  const location = useLocation();
  if (auth.loading)
    return (
      <div className="panel state-panel route-state" role="status">
        <span className="spinner" />
        Checking your session…
      </div>
    );
  if (auth.error)
    return (
      <div className="panel access-card">
        <Icon name="alert" size={36} />
        <h1>Unable to check your session</h1>
        <p>{auth.error}</p>
        <div className="button-row">
          <button className="button primary" onClick={() => auth.refreshUser()}>
            Retry session
          </button>
          <button className="button secondary" onClick={() => auth.logout()}>
            Sign out
          </button>
          <Link className="button secondary" to="/">
            Browse public pages
          </Link>
        </div>
      </div>
    );
  if (!auth.user)
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  if (roles && !roles.includes(auth.user.role))
    return (
      <div className="panel access-card">
        <Icon name="lock" size={38} />
        <p className="eyebrow">{ROLE_LABELS[auth.user.role]}</p>
        <h1>Access restricted</h1>
        <p>
          This page is available to{" "}
          {roles.map((role) => ROLE_LABELS[role]).join(" or ")} accounts.
        </p>
        <Link className="button primary" to="/">
          Return to overview
        </Link>
      </div>
    );
  return children;
}
