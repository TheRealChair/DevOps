

import React from 'react';
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
  const [page, setPage] = React.useState<'home' | 'studerende' | 'underviser' | 'underviserPagesManager' | 'underviserLogin'>('home');

  // Toggle dark mode class on root element
  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
  }, [darkMode]);


  let pageContent: React.ReactNode = null;
  if (page === 'studerende') {
    pageContent = <StuderendePage onBack={() => setPage('home')} />;
  } else if (page === 'underviser') {
    pageContent = <UnderviserPage onBack={() => setPage('home')} onPagesManager={() => setPage('underviserPagesManager')} />;
  } else if (page === 'underviserPagesManager') {
    pageContent = <UnderviserPagesManager onBack={() => setPage('underviser')} />;
  } else if (page === 'underviserLogin') {
    pageContent = <UnderviserLogin onLoginSuccess={() => setPage('underviser')} onBack={() => setPage('home')} />;
  } else {
    pageContent = <HomePage onStuderendeClick={() => setPage('studerende')} onUnderviserClick={() => setPage('underviserLogin')} />;
  }

  return (
    <>
      <TopBar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div style={{ paddingTop: '64px' }}>
        {pageContent}
      </div>
    </>
  );
};

export default App;
