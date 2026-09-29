const paths = {
  users: (
    <>
      <circle cx="9" cy="7" r="3" />
      <path d="M2 21v-3a7 7 0 0 1 14 0v3M16 4a3 3 0 0 1 0 6M18 14a6 6 0 0 1 4 6" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="12" rx="3" />
      <path d="M8 10V6a4 4 0 0 1 8 0v4M12 15v3" />
    </>
  ),
  shield: (
    <>
      <path d="m12 2 9 4v7c0 5-9 9-9 9s-9-4-9-9V6l9-4Z" />
      <path d="m8 12 3 3 6-6" />
    </>
  ),
  logout: (
    <>
      <path d="M9 3H4v18h5M10 12h12m-4-4 4 4-4 4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7h.01" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="m3 3 18 18M10 5a12 12 0 0 1 12 7l-3 4M6 6a17 17 0 0 0-4 6s4 7 10 7a12 12 0 0 0 5-1M10 10a3 3 0 0 0 4 4" />
    </>
  ),
  home: (
    <>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h5v-6h4v6h5V9" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 9 5v8l-9 5-9-5V8l9-5Z" />
      <path d="m3 8 9 5 9-5M12 13v8M7.5 5.5l9 5" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 10 6-10 6L2 9l10-6ZM3 14l9 5 9-5M3 18l9 5 9-5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  circlePlus: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  truck: (
    <>
      <path d="M2 5h12v12H2zM14 9h4l4 5v3h-8" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
    </>
  ),
  history: <path d="M7 21V11H2v10zM15 21V3h-5v18zM23 21V8h-5v13z" />,
  leaf: (
    <>
      <path d="M20 3C8 2 2 7 5 16c9 4 16-2 15-13Z" />
      <path d="M3 21 16 8M8 16v-5M9 15h5" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 21v-9M12 15C3 16 2 10 3 5c7 0 10 4 9 10ZM12 11c0-7 4-9 9-9 1 7-3 10-9 9Z" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />,
  refresh: (
    <path d="M20 7a9 9 0 0 0-15-2L2 8M2 2v6h6M4 17a9 9 0 0 0 15 2l3-3M22 22v-6h-6" />
  ),
  arrow: <path d="M4 12h15m-5-5 5 5-5 5" />,
  clock: (
    <>
      <circle cx="12" cy="13" r="9" />
      <path d="M12 7v6l4 2M9 1h6" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m7 12 3 3 7-7" />
    </>
  ),
  alert: (
    <>
      <path d="m12 3 10 18H2L12 3Z" />
      <path d="M12 9v5M12 17h.01" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M7 2v6M17 2v6M3 11h18" />
    </>
  ),
  list: (
    <>
      <path d="M10 5h11M10 12h11M10 19h11" />
      <circle cx="4" cy="5" r="1" />
      <circle cx="4" cy="12" r="1" />
      <circle cx="4" cy="19" r="1" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="m5 5 14 14M19 5 5 19" />,
  download: <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />,
};

export default function Icon({ name, size = 22, className = "" }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.leaf}
    </svg>
  );
}
