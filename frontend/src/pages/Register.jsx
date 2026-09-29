import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api, { errorMessage, responseData } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import AuthShell from "../components/AuthShell.jsx";
import PasswordField from "../components/PasswordField.jsx";
import Icon from "../components/Icon.jsx";
import { Alert } from "../components/Shared.jsx";

export default function Register() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    requestedRole: "FARM_MANAGER",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);
  if (user) return <Navigate to="/account" replace />;
  const change = (e) =>
    setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setError("");
    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (form.password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }
    if (new TextEncoder().encode(form.password).length > 72) {
      setError("This password is too long. Please use a shorter password.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const data = responseData(
        await api.post(
          "/auth/register",
          {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
            requestedRole: form.requestedRole,
          },
          { anonymous: true, skipSessionEvents: true },
        ),
      );
      setCreated(data);
      setForm((old) => ({ ...old, password: "", confirmPassword: "" }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthShell register>
      {created ? (
        <div className="registration-success" role="status">
          <span className="auth-emblem">
            <Icon name="check" size={34} />
          </span>
          <p className="eyebrow">ACCOUNT REQUEST RECEIVED</p>
          <h1>You're one step closer.</h1>
          <p>
            Your account for <strong>{created.email}</strong> is waiting for
            administrator approval.
          </p>
          <div className="approval-note">
            <Icon name="clock" size={24} />
            <div>
              <strong>Approval pending</strong>
              <p>
                You can sign in after your administrator activates your account.
                Until then, explore the crops and FIFO queue.
              </p>
            </div>
          </div>
          <div className="button-row">
            <Link className="button primary" to="/login">
              Go to sign in
            </Link>
            <Link className="button secondary" to="/">
              Browse crops & overview
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="eyebrow">JOIN OUR FARM COMMUNITY</p>
          <h1>A fresh start, together.</h1>
          <p className="auth-intro">
            Create an account to contribute to a better harvest journey.
          </p>
          <Alert>{error}</Alert>
          <form className="auth-form" onSubmit={submit}>
            <fieldset disabled={busy}>
              <div className="auth-two-fields">
                <label>
                  Full name
                  <input
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={change}
                    placeholder="Your full name"
                    maxLength={100}
                    required
                  />
                </label>
                <label>
                  Email address
                  <input
                    type="email"
                    name="email"
                    autoComplete="username"
                    value={form.email}
                    onChange={change}
                    placeholder="Your email address"
                    maxLength={191}
                    required
                  />
                </label>
              </div>
              <fieldset className="role-picker">
                <legend>How will you use CropQueue?</legend>
                <label
                  className={
                    form.requestedRole === "FARM_MANAGER" ? "selected" : ""
                  }
                >
                  <input
                    type="radio"
                    name="requestedRole"
                    value="FARM_MANAGER"
                    checked={form.requestedRole === "FARM_MANAGER"}
                    onChange={change}
                  />
                  <Icon name="sprout" size={24} />
                  <span>
                    <strong>Farm Manager</strong>
                    <small>Register and manage crop batches</small>
                  </span>
                </label>
                <label
                  className={
                    form.requestedRole === "DISTRIBUTOR" ? "selected" : ""
                  }
                >
                  <input
                    type="radio"
                    name="requestedRole"
                    value="DISTRIBUTOR"
                    checked={form.requestedRole === "DISTRIBUTOR"}
                    onChange={change}
                  />
                  <Icon name="truck" size={24} />
                  <span>
                    <strong>Distributor</strong>
                    <small>Distribute crops using FIFO</small>
                  </span>
                </label>
              </fieldset>
              <div className="auth-two-fields">
                <PasswordField
                  name="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={change}
                  placeholder="At least 8 characters"
                  minLength={8}
                  maxLength={72}
                  required
                />
                <PasswordField
                  label="Confirm password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={change}
                  placeholder="Enter password again"
                  minLength={8}
                  maxLength={72}
                  required
                />
              </div>
            </fieldset>
            <div className="approval-note">
              <Icon name="shield" size={22} />
              <p>
                An administrator will approve your account before you can sign
                in.
              </p>
            </div>
            <button className="button primary stretch" disabled={busy}>
              {busy ? "Creating account…" : "Create account"}
              <Icon name="arrow" size={18} />
            </button>
          </form>
          <p className="auth-switch">
            Already a member? <Link to="/login">Sign in</Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
