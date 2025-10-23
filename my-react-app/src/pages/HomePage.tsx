import React from 'react';
import '../design/colors.css';
import '../design/App.css';
import '../design/components.css';

export interface HomePageProps {
  onStuderendeClick?: () => void;
  onUnderviserClick?: () => void;
}



const HomePage: React.FC<HomePageProps> = ({ onStuderendeClick, onUnderviserClick }) => {
  return (
    <div className="frontpage-container" style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: '260px',
          height: '200px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2.5rem',
        }}
      >
        <img
          src="/logo.svg"
          alt="Escape Room Logo"
          style={{ width: '280px', minWidth: '100%', minHeight: '100%', objectFit: 'cover', filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.10))', marginTop: '10px' }}
          draggable={false}
        />
      </div>
      <h1 style={{ fontWeight: 800, fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Welcome to the Escape Room</h1>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button className="themed-btn" onClick={onUnderviserClick}>Underviser</button>
        <button className="themed-btn" onClick={onStuderendeClick}>Studerende</button>
      </div>
    </div>
  );
};

export default HomePage;
