import React from 'react';
import './TopBar.css';


interface TopBarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopBar: React.FC<TopBarProps> = ({ darkMode, setDarkMode }) => {
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
            {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
