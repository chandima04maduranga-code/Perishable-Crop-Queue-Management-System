import { useState } from "react";
import api, { errorMessage, readData, responseData } from "../services/api.js";
import useResource from "../hooks/useResource.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ROLE_LABELS } from "../utils/permissions.js";
import { formatTime } from "../utils/format.js";
import Icon from "../components/Icon.jsx";
import {
  Alert,
  EmptyState,
  PageHeading,
  ResourceState,
} from "../components/Shared.jsx";
const loadUsers = (signal) => readData("/users", signal);
const statusLabel = {
  PENDING: "Pending",
  ACTIVE: "Active",
  DISABLED: "Disabled",
};

function UserRow({ account, currentUser, busyId, save, remove }) {
  const [role, setRole] = useState(account.role);
  const [status, setStatus] = useState(account.status);
  const self = String(account.id) === String(currentUser.id);
  const busy = busyId !== null;
  const dirty = role !== account.role || status !== account.status;
  return (
    <tr>
      <td>
        <div className="user-cell">
          <span className={`user-avatar role-${account.role.toLowerCase()}`}>
            {account.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <strong>
              {account.name}
              {self && <span className="you-label">You</span>}
            </strong>
            <small>{account.email}</small>
          </div>
        </div>
      </td>
      <td>
        <select
          aria-label={`Role for ${account.email}`}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={busy || self}
        >
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </td>
      <td>
        <span
          className={`account-status status-${account.status.toLowerCase()}`}
        >
          {statusLabel[account.status]}
        </span>
        <select
          aria-label={`Status for ${account.email}`}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={busy || self}
        >
          {Object.entries(statusLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </td>
      <td className="user-joined">
        {account.created_at ? formatTime(account.created_at) : "—"}
      </td>
      <td>
        {self ? (
          <span className="self-account-note">Your current admin account</span>
        ) : (
          <div className="user-actions">
            {account.status === "PENDING" && status === "PENDING" && !dirty ? (
              <button
                className="button primary small-button"
                disabled={busy}
                onClick={() => save(account, { role, status: "ACTIVE" })}
                aria-label={`Approve ${account.email}`}
              >
                <Icon name="check" size={16} />
                Approve
              </button>
            ) : (
              <button
                className="button secondary small-button"
                disabled={busy || !dirty}
                onClick={() => save(account, { role, status })}
                aria-label={`Save ${account.email}`}
              >
                {busyId === account.id ? "Saving…" : "Save changes"}
              </button>
            )}
            <button
              className="text-button danger-text"
              disabled={busy}
              onClick={() => remove(account)}
              aria-label={`Delete ${account.email}`}
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default function UserManagement() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useResource(loadUsers);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [role, setRole] = useState("ALL");
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const users = data || [];
  const filtered = users.filter(
    (account) =>
      (status === "ALL" || account.status === status) &&
      (role === "ALL" || account.role === role) &&
      `${account.name} ${account.email}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  async function save(account, values) {
    if (busyId !== null || String(account.id) === String(user.id)) return;
    if (
      values.role === "ADMIN" &&
      account.role !== "ADMIN" &&
      !window.confirm(
        `Give ${account.name} (${account.email}) full Admin access?`,
      )
    )
      return;
    if (
      values.status === "DISABLED" &&
      account.status !== "DISABLED" &&
      !window.confirm(
        `Disable ${account.name}'s account? They will lose access to signed-in features.`,
      )
    )
      return;
    setBusyId(account.id);
    setActionError("");
    setMessage("");
    try {
      const updated = responseData(
        await api.patch(`/users/${account.id}`, values),
      );
      setMessage(
        updated.status === "ACTIVE" && account.status === "PENDING"
          ? `${updated.name}'s account is approved. They can now sign in.`
          : `${updated.name}'s account was updated.`,
      );
      reload();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }
  async function remove(account) {
    if (busyId !== null || String(account.id) === String(user.id)) return;
    if (
      !window.confirm(
        `Permanently delete the account for ${account.name} (${account.email})? Use Disabled status instead if the person may need access again.`,
      )
    )
      return;
    setBusyId(account.id);
    setActionError("");
    setMessage("");
    try {
      await api.delete(`/users/${account.id}`);
      setMessage(`${account.name}'s account was deleted.`);
      reload();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="ADMIN WORKSPACE"
        title="A growing community."
        description="Review new account requests and give each person the access they need."
      >
        <button
          className="button secondary"
          onClick={reload}
          disabled={loading || busyId !== null}
        >
          <Icon name="refresh" size={18} />
          Refresh users
        </button>
      </PageHeading>
      <Alert success>{message}</Alert>
      <Alert>{actionError}</Alert>
      <div className="user-summary-grid">
        {[
          ["users", "All accounts", users.length, "blue", "ALL"],
          [
            "clock",
            "Awaiting approval",
            users.filter((x) => x.status === "PENDING").length,
            "amber",
            "PENDING",
          ],
          [
            "check",
            "Active accounts",
            users.filter((x) => x.status === "ACTIVE").length,
            "green",
            "ACTIVE",
          ],
          [
            "lock",
            "Disabled accounts",
            users.filter((x) => x.status === "DISABLED").length,
            "purple",
            "DISABLED",
          ],
        ].map(([icon, label, total, tone, filter]) => (
          <button
            key={label}
            className={`user-summary ${tone} ${status === filter ? "selected" : ""}`}
            onClick={() => setStatus(filter)}
            aria-pressed={status === filter}
          >
            <span className={`section-icon ${tone}`}>
              <Icon name={icon} size={24} />
            </span>
            <span>
              <strong>{data ? total : "—"}</strong>
              <small>{label}</small>
            </span>
          </button>
        ))}
      </div>
      <div className="toolbar">
        <label className="search-label">
          Search users
          <input
            type="search"
            placeholder="Name or email address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label>
          Account role
          <select
            aria-label="Filter user role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="ALL">All roles</option>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Account status
          <select
            aria-label="Filter account status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ALL">All statuses</option>
            {Object.entries(statusLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ResourceState loading={loading} error={error} retry={reload} />
      {data && (
        <section className="panel table-panel">
          <div className="table-summary">
            <strong>
              {filtered.length} {filtered.length === 1 ? "account" : "accounts"}
            </strong>
            <span>New accounts require your approval</span>
          </div>
          {filtered.length ? (
            <div className="table-scroll">
              <table className="users-table">
                <caption className="sr-only">User accounts</caption>
                <thead>
                  <tr>
                    <th>Team member</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((account) => (
                    <UserRow
                      key={`${account.id}:${account.role}:${account.status}`}
                      account={account}
                      currentUser={user}
                      busyId={busyId}
                      save={save}
                      remove={remove}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No matching accounts">
              <p>Try a different name, role or account status.</p>
            </EmptyState>
          )}
          <p className="table-footer">
            Change a role or status, then save. Your own Admin account is
            protected from changes here.
          </p>
        </section>
      )}
    </>
  );
}
