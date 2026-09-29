import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

export default function StatCard({
  title,
  value,
  description,
  tone = "blue",
  icon = "layers",
  to = "/crops",
}) {
  return (
    <Link to={to} className={`stat-card ${tone}`}>
      <span className="stat-icon">
        <Icon name={icon} size={31} />
      </span>
      <div className="stat-copy">
        <p>{title}</p>
        <strong>{value}</strong>
        <span>{description}</span>
      </div>
      <svg
        className="stat-waves"
        viewBox="0 0 360 70"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 5C78 0 103 81 209 61s99-47 151-51v60H0Z"
          fill="currentColor"
          opacity=".28"
        />
        <path
          d="M0 36c90-33 154 41 240 15s79-31 120-23v42H0Z"
          fill="currentColor"
          opacity=".35"
        />
      </svg>
      <span className="stat-arrow">
        <Icon name="arrow" size={15} />
      </span>
    </Link>
  );
}
