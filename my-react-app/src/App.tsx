import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './design/colors.css';
import './design/App.css';
import './design/components.css';

import HomePage from './pages/HomePage';
import StuderendePage from './pages/StuderendePage';
import UnderviserPage from './pages/UnderviserPage';
import UnderviserPagesManager from './pages/UnderviserPagesManager';
import UnderviserLogin from './components/UnderviserLogin';
import TopBar from './components/TopBar';


const App: React.FC = () => {
  // Global dark mode state
  const [darkMode, setDarkMode] = React.useState(false);
  const navigate = useNavigate();

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

  return (
    <>
      {DarkModeToggle}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onStuderendeClick={() => navigate('/studerende')}
              onUnderviserClick={() => navigate('/underviser/login')}
            />
          }
        />
        <Route
          path="/studerende"
          element={<StuderendePage onBack={() => navigate(-1)} />}
        />
        <Route
          path="/underviser"
          element={
            <UnderviserPage
              onBack={() => navigate('/')}
              onPagesManager={() => navigate('/underviser/pages')}
            />
          }
        />
        <Route
          path="/underviser/pages"
          element={<UnderviserPagesManager onBack={() => navigate(-1)} />}
        />
        <Route
          path="/underviser/login"
          element={
            <UnderviserLogin
              onLoginSuccess={() => navigate('/underviser')}
              onBack={() => navigate('/')}
            />
          }
        />
        <Route
          path="*"
          element={
            <HomePage
              onStuderendeClick={() => navigate('/studerende')}
              onUnderviserClick={() => navigate('/underviser/login')}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
