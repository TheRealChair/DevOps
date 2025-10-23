// Code generation function for new room codes
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../design/colors.css';
import '../design/App.css';
import '../design/components.css';

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}


interface UnderviserPageProps {
  onBack?: () => void;
  onPagesManager?: (roomId?: string) => void;
}

const UnderviserPage: React.FC<UnderviserPageProps> = ({ onBack, onPagesManager }) => {
  const { user, userData, signOut } = useAuth();
  const [rooms, setRooms] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRoomCode, setNewRoomCode] = useState(generateCode());
  // Handler to generate a new code
  const handleGenerate = () => {
    setNewRoomCode(generateCode());
  };

  // Handler to create a new room (placeholder logic)
  const handleCreateRoom = () => {
    // In a real app, you would send this to your backend/Firebase
    setRooms(prev => [
      ...prev,
      { id: newRoomCode, name: `Room ${newRoomCode}` }
    ]);
    setNewRoomCode(generateCode());
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

      {/* Brugerinfo */}
      {user && userData && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          textAlign: 'center',
          minWidth: '300px',
          boxShadow: '0 4px 6px var(--card-shadow)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)' }}>Velkommen, {userData.role}!</h3>
          <p style={{ margin: '0', color: 'var(--text)', fontSize: '0.9rem' }}>Email: {userData.email}</p>
        </div>
      )}

      {/* Kodegenerering til nyt rum */}
      <div style={{ margin: '1.5rem 0', width: '100%', maxWidth: '400px' }}>
        <h3 style={{ textAlign: 'center', color: 'var(--text)' }}>Opret nyt rum</h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <input
            className="uv-input"
            type="text"
            value={newRoomCode}
            readOnly
            style={{ fontSize: '1.2rem', width: '180px', textAlign: 'center', letterSpacing: '0.2em', marginBottom: '0.5rem' }}
          />
          <div>
            <button className="uv-btn primary" onClick={handleGenerate} style={{ marginRight: '0.5rem' }}>Generér ny kode</button>
            <button className="uv-btn" onClick={handleCreateRoom}>Opret rum</button>
          </div>
        </div>
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
