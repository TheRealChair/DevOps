import React from 'react';
import './TopBar.css';



const TopBar: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <header className="topbar">
      <div className="topbar-content">
        <h2 className="topbar-title">EscapED</h2>
        <div className="topbar-buttons">
          {/* Add your buttons here, e.g. <button>Home</button> */}
          <button
            className="themed-btn"
            onClick={() => setDarkMode(dm => !dm)}
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
