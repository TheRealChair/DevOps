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

  const navigate = useNavigate();

  return (
    <>
      <TopBar />
      <div style={{ paddingTop: '28px' }}>
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
      </div>
    </>
  );
};

export default App;
