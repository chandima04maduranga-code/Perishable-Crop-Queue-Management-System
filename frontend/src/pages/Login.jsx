import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { errorMessage } from "../services/api.js";
import { safeReturnPath } from "../utils/permissions.js";
import AuthShell from "../components/AuthShell.jsx";
import PasswordField from "../components/PasswordField.jsx";
import Icon from "../components/Icon.jsx";
import { Alert } from "../components/Shared.jsx";

export default function Login() {
  const auth = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const from = safeReturnPath(location.state?.from);
  if (auth.user) return <Navigate to={from} replace />;
  async function submit(event) {
    event.preventDefault();
    if (busy || auth.loading) return;
    setBusy(true);
    setError("");
    try {
      await auth.login(email, password);
      setPassword("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthShell>
      <span className="auth-emblem">
        <Icon name="sprout" size={29} />
      </span>
      <p className="eyebrow">WELCOME BACK TO CROPQUEUE</p>
      <h1>Sign in to your farm community.</h1>
      <p className="auth-intro">
        Manage your harvest, distribute fresh produce and keep your team
        connected.
      </p>
      <Alert>{error}</Alert>
      <form onSubmit={submit} className="auth-form">
        <fieldset disabled={busy || auth.loading}>
          <label>
            Email address
            <input
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              maxLength={191}
            />
          </label>
          <PasswordField
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </fieldset>
        <p className="auth-help">
          <Icon name="lock" size={15} /> Your approved account determines your
          role.
        </p>
        <button
          className="button primary stretch"
          disabled={busy || auth.loading}
        >
          {busy
            ? "Signing in…"
            : auth.loading
              ? "Checking session…"
              : "Sign in"}
          <Icon name="arrow" size={18} />
        </button>
      </form>
      <p className="auth-switch">
        New to CropQueue? <Link to="/register">Create an account</Link>
      </p>
      <div className="auth-footnote">
        Waiting for approval or need help signing in? Contact your
        administrator.
      </div>
    </AuthShell>
  );
}
