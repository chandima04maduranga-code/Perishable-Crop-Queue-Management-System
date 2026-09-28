import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  ["/", "Overview", "01"],
  ["/crops", "Crop batches", "02"],
  ["/crops/add", "Add a batch", "03"],
  ["/distribution", "FIFO distribution", "04"],
  ["/history", "Distribution history", "05"],
];

export default function Layout() {
  return (
    <div className="app-layout">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="sidebar">
        <NavLink className="brand" to="/" aria-label="CropQueue home">
          <span className="brand-mark" aria-hidden="true">
            CQ
          </span>
          <span>
            <strong>CropQueue</strong>
            <small>Harvest. Track. Distribute.</small>
          </span>
        </NavLink>
        <p className="nav-label">WORKSPACE</p>
        <nav aria-label="Main navigation">
          {navigation.map(([to, label, number]) => (
            <NavLink key={to} to={to} end={to === "/" || to === "/crops"}>
              <span aria-hidden="true">{number}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="seed-dot" />
          <strong>Every harvest counts.</strong>
          <p>Keep older batches moving and reduce crop waste.</p>
        </div>
        <div className="sidebar-footer">
          <strong>Chandima & Nikarsan</strong>
          <span>DevOps Engineering Project</span>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span>Perishable Crop Management</span>
          <span className="topbar-tag">Harvest-date FIFO</span>
        </header>
        <main className="main-content" id="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
