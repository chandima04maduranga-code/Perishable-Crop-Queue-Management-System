import { useId, useState } from "react";
import Icon from "./Icon.jsx";
export default function PasswordField({ label = "Password", ...props }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-field">
      <label htmlFor={id}>{label}</label>
      <div className="password-input">
        <input id={id} {...props} type={visible ? "text" : "password"} />
        <button
          type="button"
          className="password-toggle"
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
        >
          <Icon name={visible ? "eyeOff" : "eye"} size={20} />
        </button>
      </div>
    </div>
  );
}
