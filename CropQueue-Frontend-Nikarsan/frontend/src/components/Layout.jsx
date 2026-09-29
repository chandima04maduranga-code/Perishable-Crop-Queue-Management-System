import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { CROP_ROLES, hasRole, ROLE_LABELS } from "../utils/permissions.js";
import Icon from "./Icon.jsx";

export default function Layout() {
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const canManage = hasRole(auth.user, CROP_ROLES);
  const navigation = [
    ["/", "Overview", "home"],
    ["/crops", "Crop batches", "box"],
    ...(canManage ? [["/crops/add", "Add a batch", "circlePlus"]] : []),
    ["/distribution", "FIFO queue", "truck"],
    ...(auth.user ? [["/history", "Distribution history", "history"]] : []),
    ...(auth.user?.role === "ADMIN"
      ? [["/users", "Manage users", "users"]]
      : []),
    ["/about", "How it works", "leaf"],
  ];
  useEffect(() => {
    function shortcut(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  function submitSearch(event) {
    event.preventDefault();
    navigate(
      `/crops${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ""}`,
    );
    searchRef.current?.blur();
  }
  function signOut() {
    auth.logout();
    navigate("/login", { replace: true });
  }
  return (
    <div className="app-layout">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className={`sidebar ${menuOpen ? "menu-open" : ""}`}>
        <div className="brand-row">
          <NavLink className="brand" to="/" aria-label="CropQueue home">
            <img
              className="brand-mark"
              src={`${import.meta.env.BASE_URL}images/cropqueue-mark.svg`}
              alt=""
              width="58"
              height="65"
            />
            <span>
              <strong>
                Crop<span>Queue</span>
              </strong>
              <small>Harvest smarter. Waste less.</small>
            </span>
          </NavLink>
          <button
            className="mobile-menu"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
        <nav id="main-navigation" aria-label="Main navigation">
          {navigation.map(([to, label, icon]) => (
            <NavLink key={to} to={to} end={to === "/" || to === "/crops"}>
              <Icon name={icon} size={24} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-account">
          {auth.user ? (
            <>
              <Link to="/account" className="sidebar-user">
                <span className="mini-avatar">
                  {auth.user.name.slice(0, 1).toUpperCase()}
                </span>
                <span>
                  <strong>{auth.user.name}</strong>
                  <small>{ROLE_LABELS[auth.user.role]}</small>
                </span>
              </Link>
              <button className="sidebar-signout" onClick={signOut}>
                <Icon name="logout" size={17} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <p>
                <Icon name="globe" size={15} />
                Public visitor
              </p>
              <Link className="sidebar-signin" to="/login">
                Sign in to your account
                <Icon name="arrow" size={17} />
              </Link>
              <Link className="sidebar-register" to="/register">
                Create account
              </Link>
            </>
          )}
        </div>
        <div className="sidebar-landscape" aria-hidden="true">
          <div className="sidebar-motto">
            Stronger Sri Lankan farms.
            <br />
            <span>Brighter tomorrows.</span>
          </div>
        </div>
        <footer className="sidebar-footer">
          <span>Developers</span>
          <strong>Chandima & Nikarsan</strong>
        </footer>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <form className="global-search" role="search" onSubmit={submitSearch}>
            <Icon name="search" size={20} />
            <input
              ref={searchRef}
              aria-label="Search crops or batches"
              type="search"
              placeholder="Search batches, crops or storage…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <kbd>Ctrl + K</kbd>
            <button className="sr-only" type="submit">
              Search
            </button>
          </form>
          <div className="topbar-actions">
            <Link
              to="/crops?filter=expiring"
              className="icon-button expiry-link"
              aria-label="View batches near expiry"
              title="View batches near expiry"
            >
              <Icon name="bell" size={23} />
            </Link>
            {auth.user ? (
              <>
                <Link
                  to="/account"
                  className="workspace-identity signed-in"
                  aria-label="My account"
                >
                  <span className="workspace-avatar">
                    {auth.user.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span>
                    <strong>{auth.user.name}</strong>
                    <small>{ROLE_LABELS[auth.user.role]}</small>
                  </span>
                </Link>
                <button
                  className="icon-button topbar-signout"
                  onClick={signOut}
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <Icon name="logout" size={21} />
                </button>
              </>
            ) : (
              <div className="visitor-actions">
                <Link className="button secondary" to="/login">
                  Sign in
                </Link>
                <Link className="button primary register-link" to="/register">
                  Create account
                </Link>
              </div>
            )}
          </div>
        </header>
        {auth.notice && (
          <div className="session-banner" role="status">
            <Icon name="info" size={19} />
            <span>{auth.notice}</span>
            <button
              aria-label="Dismiss session message"
              onClick={auth.dismissNotice}
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        )}
        {auth.error && (
          <div className="session-banner session-error" role="alert">
            <Icon name="alert" size={19} />
            <span>
              We couldn't check your session. Public browsing is still
              available.
            </span>
            <button
              className="session-retry"
              onClick={() => auth.refreshUser()}
            >
              Retry session
            </button>
          </div>
        )}
        <main className="main-content" id="main">
          <Outlet
            key={`${auth.user?.id || "public"}:${auth.user?.role || "visitor"}`}
          />
        </main>
        <footer className="main-footer">
          <span>
            <Icon name="leaf" size={14} />A fresher future, one harvest at a
            time.
          </span>
          <span>CropQueue · {new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  );
}
