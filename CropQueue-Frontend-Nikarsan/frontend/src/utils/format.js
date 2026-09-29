const dateTimezone = import.meta.env.VITE_DATE_TIMEZONE || "Asia/Colombo";

// SQL DATE is a calendar day. Do not slice an ISO timestamp: local midnight
// in Sri Lanka is on the previous UTC day. Plain YYYY-MM-DD is kept unchanged.
export function inputDate(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return String(value);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: dateTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function formatDate(value) {
  const date = inputDate(value);
  if (!date) return "—";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("en-GB");
}

export function amount(value) {
  const number = Number(value);
  return Number.isFinite(number)
    ? number.toLocaleString("en-GB", { maximumFractionDigits: 2 })
    : "—";
}

export function expiryLabel(value) {
  const day = inputDate(value);
  if (!day) return { text: "Unknown date", className: "muted" };
  const difference = Math.round(
    (Date.parse(`${day}T00:00:00Z`) -
      Date.parse(`${inputDate(new Date())}T00:00:00Z`)) /
      86400000,
  );
  if (difference < 0) return { text: "Past expiry", className: "danger-text" };
  if (difference === 0)
    return { text: "Expires today", className: "warning-text" };
  if (difference <= 3)
    return { text: `Expires in ${difference} days`, className: "warning-text" };
  return { text: `${difference} days remaining`, className: "muted" };
}

export function nearExpiry(value) {
  return expiryLabel(value).className === "warning-text";
}
