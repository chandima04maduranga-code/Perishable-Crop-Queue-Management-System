import { amount, expiryLabel, formatDate } from "../utils/format.js";
import Icon from "./Icon.jsx";

export function PageHeading({
  eyebrow,
  title,
  description,
  children,
  hero = false,
}) {
  return (
    <header
      className={`page-heading ${hero ? "hero-heading" : "compact-heading"}`}
    >
      <div className="hero-location">
        <Icon name="pin" size={18} />
        <span>
          <strong>Sri Lanka</strong>
          <time dateTime={new Date().toISOString()}>
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              timeZone: "Asia/Colombo",
            }).format(new Date())}
          </time>
        </span>
      </div>
      <div className="heading-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="subtitle">{description}</p>
      </div>
      <div className="heading-actions">{children}</div>
    </header>
  );
}

export function Alert({ children, success = false }) {
  if (!children) return null;
  return (
    <div
      className={`alert ${success ? "success" : "error"}`}
      role={success ? "status" : "alert"}
    >
      {children}
    </div>
  );
}

export function ResourceState({ loading, error, retry }) {
  if (loading)
    return (
      <div className="panel state-panel" role="status">
        <span className="spinner" />
        Loading crop records…
      </div>
    );
  if (error)
    return (
      <div className="panel">
        <Alert>{error}</Alert>
        <button className="button secondary" onClick={retry}>
          Try again
        </button>
      </div>
    );
  return null;
}

export function EmptyState({ title, children }) {
  return (
    <div className="empty-state">
      <img
        className="empty-art"
        src={`${import.meta.env.BASE_URL}images/sri-lanka-harvest-crate.png`}
        alt=""
        width="230"
        height="205"
        loading="lazy"
      />
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export function StatusBadge({ status, expiry }) {
  const label = expiry ? expiryLabel(expiry) : null;
  const tone =
    status === "DISTRIBUTED"
      ? "distributed"
      : label?.className === "danger-text"
        ? "expired"
        : label?.className === "warning-text"
          ? "near-expiry"
          : "available";
  const text =
    tone === "distributed"
      ? "Distributed"
      : tone === "expired"
        ? "Past expiry"
        : tone === "near-expiry"
          ? "Near expiry"
          : "Available";
  return <span className={`badge ${tone}`}>{text}</span>;
}

export function ExpiryDate({ value, active = true }) {
  const expiry = expiryLabel(value);
  return (
    <>
      <span>{formatDate(value)}</span>
      {active && <small className={expiry.className}>{expiry.text}</small>}
    </>
  );
}

export function BatchDetails({ crop }) {
  return (
    <dl className="detail-list">
      <div>
        <dt>Batch ID</dt>
        <dd>#{crop.id}</dd>
      </div>
      <div>
        <dt>Available quantity</dt>
        <dd>{amount(crop.quantity)} kg</dd>
      </div>
      <div>
        <dt>Harvest date</dt>
        <dd>{formatDate(crop.harvest_date)}</dd>
      </div>
      <div>
        <dt>Expiry date</dt>
        <dd>
          <ExpiryDate value={crop.expiry_date} />
        </dd>
      </div>
      <div>
        <dt>Storage location</dt>
        <dd>{crop.storage_location}</dd>
      </div>
    </dl>
  );
}
