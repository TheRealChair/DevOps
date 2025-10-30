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
import { db } from '../services/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import UnderviserPagesManager from './UnderviserPagesManager';


interface UnderviserPageProps {
  onBack?: () => void;
  onPagesManager?: (roomId?: string) => void;
}

const UnderviserPage: React.FC<UnderviserPageProps> = ({ onBack }) => {
  const { user, userData, signOut } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showManager, setShowManager] = useState(false);
  const [initialPages, setInitialPages] = useState<any[]>([]);

  // Fetch real rooms from Firestore
  useEffect(() => {
    const fetchRooms = async () => {
      if (!user) {
        setRooms([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, 'EscapeRooms'), where('ownerId', '==', user.uid));
        const snap = await getDocs(q);
        setRooms(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (err) {
        setError('Kunne ikke hente rum!');
        setRooms([]);
      }
      setLoading(false);
    };
    fetchRooms();
  }, [user, showManager]);

  if (showManager) {
    return (
      <UnderviserPagesManager
        onBack={() => {
          setShowManager(false);
        }}
        initialPages={initialPages}
      />
    );
  }

  return (
    <div className="uv-root" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', minHeight: '100vh' }}>
      <h2 className="uv-heading">Underviser-side</h2>
      {user && userData && (
        <button
          onClick={() => alert('Profilfunktion kan tilføjes her!')}
          style={{
            position: 'fixed',top: '24px',right: '24px',zIndex: 1000,background: 'var(--surface)',border: '1.5px solid var(--border)',padding: '0.75rem 1.25rem',borderRadius: '999px',minWidth: '220px',textAlign: 'left',cursor: 'pointer',transition: 'box-shadow 0.2s',display: 'flex',flexDirection: 'column',alignItems: 'flex-start',gap: '0.2rem',
          }}
          onMouseOver={e => (e.currentTarget.style.border = '1.5px solid var(--secondary)')}
          onMouseOut={e => (e.currentTarget.style.border = '1.5px solid var(--border)')}
        >
          <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '1rem' }}>Velkommen, {userData.role}!</span>
          <span style={{ color: 'var(--text)', fontSize: '0.85rem', opacity: 0.8 }}>Email: {userData.email}</span>
        </button>
      )}
      <div style={{ margin: '1.5rem 0', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
        <button className="uv-btn primary" onClick={() => {
          setInitialPages([]);
          setShowManager(true);
        }}>Ny Room</button>
      </div>
      <div style={{ margin: '1.5rem 0', width: '100%', maxWidth: '600px' }}>
        <h3 style={{ textAlign: 'center', color: 'var(--text)' }}>Dine Escape Rooms</h3>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text)' }}>Indlæser rum...</div>
        ) : error ? (
          <div style={{ color: 'var(--feedback-incorrect-text)', textAlign: 'center' }}>{error}</div>
        ) : rooms.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text)' }}>Ingen rum fundet.</div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent:'center' }}>
            {rooms.map(room => (
              <div key={room.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', margin: '0.5rem 0', padding: '1rem', display: 'flex', flexDirection: 'column', minWidth: 220, alignItems: 'flex-start', boxShadow: '0 2px 4px var(--card-shadow)' }}>
                <span style={{ fontWeight: 500, color: 'var(--text)' }}>{room.name || 'Untitled Room'}</span>
                <span style={{ color: '#444', fontSize: 13 }}>Room code: {room.roomCode}</span>
                <span style={{ color: '#444', fontSize: 13 }}>{room.pages?.length || 0} pages</span>
                <button
                  className="uv-btn primary"
                  style={{ marginTop: '0.7rem', padding: '0.5rem 1.4rem', background: 'var(--button-bg)', color: 'var(--button-text)', border: '1px solid var(--button-border)' }}
                  onClick={() => {
                    const arr = room.pages ? [...room.pages] : [];
                    (arr as any)._roomId = room.id;
                    setInitialPages(arr);
                    setShowManager(true);
                  }}
                >
                  Administrer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="uv-btn" onClick={async () => { await signOut(); if(onBack)onBack(); }} style={{ marginTop: '1rem', background: 'var(--feedback-incorrect-text)', color: 'var(--button-text)' }}>Log ud</button>
      <button className="uv-btn" onClick={onBack} style={{ marginTop: '0.5rem', background: 'var(--hover-bg)', color: 'var(--muted)' }}>Tilbage</button>
    </div>
  );
};

export default UnderviserPage;
