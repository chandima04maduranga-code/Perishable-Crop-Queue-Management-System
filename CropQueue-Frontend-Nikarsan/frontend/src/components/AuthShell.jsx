import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
export default function AuthShell({ children, register = false }) {
  return (
    <section className={`auth-shell ${register ? "register-shell" : ""}`}>
      <aside className="auth-story">
        <span className="auth-story-tag">
          <Icon name="leaf" size={17} /> GROWING TOGETHER
        </span>
        <h2>
          Fresh harvests. <br />
          Shared progress. <br />
          <span>Less waste.</span>
        </h2>
        <p>
          A better journey for every Sri Lankan harvest, from the farm to the
          next distribution.
        </p>
        <div className="auth-story-bottom">
          <Icon name="sprout" size={28} />
          <span>
            One community.
            <br />
            <strong>A fresher tomorrow.</strong>
          </span>
        </div>
      </aside>
      <div className="auth-form-area">
        <Link className="auth-back" to="/">
          <Icon name="arrow" size={17} /> Back to public overview
        </Link>
        {children}
      </div>
    </section>
  );
}
