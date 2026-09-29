import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  CROP_ROLES,
  DISTRIBUTION_ROLES,
  hasRole,
  ROLE_LABELS,
} from "../utils/permissions.js";
import { PageHeading } from "../components/Shared.jsx";
import Icon from "../components/Icon.jsx";
export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <PageHeading
        eyebrow="YOUR CROPQUEUE ACCOUNT"
        title="My account"
        description="Your approved role and access, in one place."
      />
      <div className="account-grid">
        <section className="panel account-profile">
          <span className="profile-avatar">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span className="role-badge">{ROLE_LABELS[user.role]}</span>
          <dl className="detail-list">
            <div>
              <dt>Account status</dt>
              <dd>
                <span className="badge available">Active</span>
              </dd>
            </div>
            <div>
              <dt>Account ID</dt>
              <dd>#{user.id}</dd>
            </div>
          </dl>
          <button
            className="button secondary stretch"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            <Icon name="logout" size={18} />
            Sign out
          </button>
        </section>
        <section className="panel">
          <h2>Your workspace</h2>
          <p className="panel-description">
            Choose a task available to your account.
          </p>
          <div className="account-links">
            <Link to="/crops">
              <Icon name="box" />
              <span>
                <strong>Explore crop batches</strong>
                <small>Find crops and check their freshness</small>
              </span>
              <Icon name="arrow" size={18} />
            </Link>
            {hasRole(user, CROP_ROLES) && (
              <Link to="/crops/add">
                <Icon name="circlePlus" />
                <span>
                  <strong>Register a harvest</strong>
                  <small>Add and manage crop batches</small>
                </span>
                <Icon name="arrow" size={18} />
              </Link>
            )}
            {hasRole(user, DISTRIBUTION_ROLES) && (
              <Link to="/distribution">
                <Icon name="truck" />
                <span>
                  <strong>Distribute from the FIFO queue</strong>
                  <small>Move the oldest available harvest first</small>
                </span>
                <Icon name="arrow" size={18} />
              </Link>
            )}
            <Link to="/history">
              <Icon name="history" />
              <span>
                <strong>View distribution history</strong>
                <small>Review recorded crop movements</small>
              </span>
              <Icon name="arrow" size={18} />
            </Link>
            {user.role === "ADMIN" && (
              <Link to="/users">
                <Icon name="users" />
                <span>
                  <strong>Manage users</strong>
                  <small>Approve accounts and manage access</small>
                </span>
                <Icon name="arrow" size={18} />
              </Link>
            )}
          </div>
          <p className="account-help">
            Contact your administrator if your account details or access need to
            change.
          </p>
        </section>
      </div>
    </>
  );
}
