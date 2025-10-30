import React from 'react';
import './TopBar.css';



// Simple inline SVG icons to avoid extra dependencies
const SunIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    aria-hidden="true"
    className={className}
  >
    {title ? <title>{title}</title> : null}
    <path
      fill="currentColor"
      d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.48 14.32l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM12 4V1h-2v3h2zm0 19v-3h-2v3h2zm8-9h3v-2h-3v2zM1 12H4v-2H1v2zm3.54 7.07l1.41 1.41 1.8-1.79-1.42-1.42-1.79 1.8zM19.07 4.93l-1.41-1.41-1.8 1.79 1.42 1.42 1.79-1.8zM11 7a5 5 0 100 10 5 5 0 000-10z"
    />
  </svg>
);

const MoonIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    aria-hidden="true"
    className={className}
  >
    {title ? <title>{title}</title> : null}
    <path
      fill="currentColor"
      d="M21 12.79A9 9 0 1111.21 3c.14.45.22.93.22 1.43a7 7 0 007 7c.5 0 .98-.08 1.43-.22A8.96 8.96 0 0121 12.79z"
    />
  </svg>
);

const TopBar: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
    } catch {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
    try {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    } catch {}
  }, [darkMode]);

  return (
    <header className="topbar">
      <div className="topbar-content">
        <h2 className="topbar-title">EscapED</h2>
        <div className="topbar-buttons">
          {/* Theme toggle */}
          <button
            type="button"
            className="theme-toggle"
            aria-label="Toggle dark mode"
            role="switch"
            aria-checked={darkMode}
            data-dark={darkMode}
            title={darkMode ? 'Dark mode on — switch to light' : 'Light mode on — switch to dark'}
            onClick={() => setDarkMode((dm) => !dm)}
          >
            <span className="icon sun" aria-hidden="true"><SunIcon /></span>
            <span className="icon moon" aria-hidden="true"><MoonIcon /></span>
            <span className="knob" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
