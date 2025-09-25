

import React from 'react';
import HomePage from './pages/HomePage';
import StuderendePage from './pages/StuderendePage';
import UnderviserPage from './pages/UnderviserPage';
import UnderviserPagesManager from './pages/UnderviserPagesManager';

const App: React.FC = () => {

  const [page, setPage] = React.useState<'home' | 'studerende' | 'underviser' | 'underviserPagesManager'>('home');

  if (page === 'studerende') {
    return <StuderendePage onBack={() => setPage('home')} />;
  }
  if (page === 'underviser') {
    return <UnderviserPage onBack={() => setPage('home')} onPagesManager={() => setPage('underviserPagesManager')} />;
  }
  if (page === 'underviserPagesManager') {
    return <UnderviserPagesManager onBack={() => setPage('underviser')} />;
  }
  return <HomePage onStuderendeClick={() => setPage('studerende')} onUnderviserClick={() => setPage('underviser')} />;
};

export default App;
