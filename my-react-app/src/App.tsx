


import HomePage from './pages/HomePage';
import StuderendePage from './pages/StuderendePage';
import React from 'react';


import UnderviserPage from './pages/UnderviserPage';

const App: React.FC = () => {
  const [page, setPage] = React.useState<'home' | 'studerende' | 'underviser'>('home');

  if (page === 'studerende') {
    return <StuderendePage />;
  }
  if (page === 'underviser') {
    return <UnderviserPage />;
  }
  return <HomePage onStuderendeClick={() => setPage('studerende')} onUnderviserClick={() => setPage('underviser')} />;
};

export default App;
