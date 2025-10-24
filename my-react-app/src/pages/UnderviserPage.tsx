// Code generation function for new room codes

// function generateCode() {
//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let code = '';
//   for (let i = 0; i < 5; i++) {
//     code += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return code;
// }
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../design/colors.css';
import '../design/App.css';
import '../design/components.css';



interface UnderviserPageProps {
  onBack?: () => void;
  onPagesManager?: (roomId?: string) => void;
}

const UnderviserPage: React.FC<UnderviserPageProps> = ({ onBack, onPagesManager }) => {
  const { user, userData, signOut } = useAuth();
  const [rooms, setRooms] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  // Add room with default name
  const handleCreateRoom = () => {
    const newId = Math.random().toString(36).substring(2, 8);
    setRooms(prev => [
      ...prev,
      { id: newId, name: `Room ${newId}` }
    ]);
  };

  // Placeholder: Replace with actual fetch from backend or Firebase
  // No initial fetch, start with empty room list
  useEffect(() => {
    setLoading(false);
  }, []);
  // Handler to delete a room
  const handleDeleteRoom = (roomId: string) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
  };

  const handleLogout = async () => {
    try {
      await signOut();
      if (onBack) onBack();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="uv-root" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', minHeight: '100vh' }}>
      <h2 className="uv-heading">Underviser-side</h2>

      {/* Brugerinfo as profile button in top-left */}
      {user && userData && (
        <button
          onClick={() => alert('Profilfunktion kan tilføjes her!')}
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 1000,
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            padding: '0.75rem 1.25rem',
            borderRadius: '999px',
            minWidth: '220px',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'box-shadow 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.2rem',
          }}
          onMouseOver={e => (e.currentTarget.style.border = '1.5px solid var(--secondary)')}
          onMouseOut={e => (e.currentTarget.style.border = '1.5px solid var(--border)')}
        >
          <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '1rem' }}>Velkommen, {userData.role}!</span>
          <span style={{ color: 'var(--text)', fontSize: '0.85rem', opacity: 0.8 }}>Email: {userData.email}</span>
        </button>
      )}

      {/* Opret rum knap */}
      <div style={{ margin: '1.5rem 0', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <button className="uv-btn primary" onClick={handleCreateRoom}>Opret rum</button>
      </div>

      {/* Oversigt over rum */}
      <div style={{ margin: '1.5rem 0', width: '100%', maxWidth: '400px' }}>
        <h3 style={{ textAlign: 'center', color: 'var(--text)' }}>Rumsoversigt</h3>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text)' }}>Indlæser rum...</div>
        ) : error ? (
          <div style={{ color: 'var(--feedback-incorrect-text)', textAlign: 'center' }}>{error}</div>
        ) : rooms.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text)' }}>Ingen rum fundet.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {rooms.map(room => (
              <li key={room.id} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                margin: '0.5rem 0',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 4px var(--card-shadow)'
              }}>
                <span style={{ fontWeight: 500, color: 'var(--text)' }}>{room.name}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="uv-btn primary"
                    style={{ padding: '0.4rem 1.2rem', background: 'var(--button-bg)', color: 'var(--button-text)', border: '1px solid var(--button-border)' }}
                    onClick={() => onPagesManager && onPagesManager(room.id)}
                  >
                    Administrer
                  </button>
                  <button
                    className="uv-btn"
                    style={{ background: 'var(--feedback-incorrect-bg)', color: 'var(--feedback-incorrect-text)', padding: '0.4rem 1.2rem' }}
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    Slet
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    <button className="uv-btn" onClick={handleLogout} style={{ marginTop: '1rem', background: 'var(--feedback-incorrect-text)', color: 'var(--button-text)' }}>Log ud</button>
    <button className="uv-btn" onClick={onBack} style={{ marginTop: '0.5rem', background: 'var(--hover-bg)', color: 'var(--muted)' }}>Tilbage</button>
    </div>
  );
};

export default UnderviserPage;
