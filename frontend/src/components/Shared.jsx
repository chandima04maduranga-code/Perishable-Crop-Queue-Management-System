import { amount, expiryLabel, formatDate } from "../utils/format.js";

export function PageHeading({ eyebrow, title, description, children }) {
  return (
    <header className="page-heading">
      <div>
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
      <span className="empty-mark" aria-hidden="true">
        CQ
      </span>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export function StatusBadge({ status }) {
  return (
    <span
      className={`badge ${status === "AVAILABLE" ? "available" : "distributed"}`}
    >
      {status === "AVAILABLE" ? "Available" : "Distributed"}
    </span>
  );
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
