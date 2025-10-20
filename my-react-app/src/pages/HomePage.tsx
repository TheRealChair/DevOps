import React from 'react';
import '../design/App.css';

export interface HomePageProps {
  onStuderendeClick?: () => void;
  onUnderviserClick?: () => void;
}



const HomePage: React.FC<HomePageProps> = ({ onStuderendeClick, onUnderviserClick }) => {
  return (
  <div className="frontpage-container" style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>Welcome to the Escape Room</h1>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button className="themed-btn" onClick={onUnderviserClick}>Underviser</button>
        <button className="themed-btn" onClick={onStuderendeClick}>Studerende</button>
      </div>
    </div>
  );
};

export default HomePage;
