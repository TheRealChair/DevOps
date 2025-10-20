

import React from 'react';
import './design/colors.css';
import './design/app.css';
import './design/components.css';
import HomePage from './pages/HomePage';
import StuderendePage from './pages/StuderendePage';
import UnderviserPage from './pages/UnderviserPage';
import UnderviserPagesManager from './pages/UnderviserPagesManager';


const App: React.FC = () => {
  // Global dark mode state
  const [darkMode, setDarkMode] = React.useState(false);
  const [page, setPage] = React.useState<'home' | 'studerende' | 'underviser' | 'underviserPagesManager'>('home');

  // Toggle dark mode class on root element
  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Global dark mode toggle button (fixed position)
  const DarkModeToggle = (
    <button
      className="themed-btn"
      style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 1000 }}
      onClick={() => setDarkMode(dm => !dm)}
    >
      {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );

  if (page === 'studerende') {
    return <>
      {DarkModeToggle}
      <StuderendePage onBack={() => setPage('home')} />
    </>;
  }
  if (page === 'underviser') {
    return <>
      {DarkModeToggle}
      <UnderviserPage onBack={() => setPage('home')} onPagesManager={() => setPage('underviserPagesManager')} />
    </>;
  }
  if (page === 'underviserPagesManager') {
    return <>
      {DarkModeToggle}
      <UnderviserPagesManager onBack={() => setPage('underviser')} />
    </>;
  }
  return <>
    {DarkModeToggle}
    <HomePage onStuderendeClick={() => setPage('studerende')} onUnderviserClick={() => setPage('underviser')} />
  </>;
};

export default App;
