import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/authService';
import '../design/colors.css';
import '../design/App.css';
import '../design/components.css';

interface BrugerInfoProps {
  onClose: () => void;
}

const BrugerInfo: React.FC<BrugerInfoProps> = ({ onClose }) => {
  const { user, userData, refreshUserData } = useAuth();
  const [name, setName] = useState(userData?.name || user?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Update local name when userData changes
  React.useEffect(() => {
    if (userData) {
      setName(userData.name || user?.displayName || '');
    }
  }, [userData, user]);

  const handleUpdateName = async () => {
    if (!user || !name.trim()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Update Firebase Auth profile
      await AuthService.updateUserProfile(user, name.trim());
      
      // Update Firestore user data
      await AuthService.updateUserData(user.uid, { name: name.trim() });
      
      // Refresh user data in context
      await refreshUserData();
      
      setSuccess('Navn opdateret!');
      setIsEditing(false);
    } catch (err: any) {
      setError('Kunne ikke opdatere navn: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await AuthService.sendPasswordReset(user.email);
      setSuccess('Et link til nulstilling af adgangskode er blevet sendt til din email.');
    } catch (err: any) {
      setError('Kunne ikke sende nulstillingslink: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: '24px', color: 'var(--text)', fontWeight: 700 }}>
          Brugerinfo
        </h2>

        {error && (
          <div
            style={{
              background: 'var(--feedback-incorrect-bg)',
              color: 'var(--feedback-incorrect-text)',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: 'var(--feedback-correct-bg)',
              color: 'var(--feedback-correct-text)',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '0.9rem',
            }}
          >
            {success}
          </div>
        )}

        {/* Name field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text)' }}>
            Navn
          </label>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="uv-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ flex: 1, padding: '10px' }}
                placeholder="Indtast dit navn"
              />
              <button
                className="uv-btn primary"
                onClick={handleUpdateName}
                disabled={loading || !name.trim()}
                style={{ padding: '10px 16px' }}
              >
                {loading ? '...' : 'Gem'}
              </button>
              <button
                className="uv-btn"
                onClick={() => {
                  setIsEditing(false);
                  setName(userData?.name || user?.displayName || '');
                }}
                disabled={loading}
                style={{ padding: '10px 16px' }}
              >
                Annuller
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ padding: '10px', color: 'var(--text)', minHeight: '38px', flex: 1, background: 'var(--input-bg)', borderRadius: '6px', display: 'flex', alignItems: 'center' }}>
                {name || 'Ingen navn angivet'}
              </span>
              <button
                className="uv-btn"
                onClick={() => setIsEditing(true)}
                style={{ padding: '10px 16px' }}
              >
                Redigér
              </button>
            </div>
          )}
        </div>

        {/* Email field (read-only) */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text)' }}>
            Email
          </label>
          <div
            style={{
              padding: '10px',
              color: 'var(--text-secondary)',
              minHeight: '38px',
              background: 'var(--input-bg)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {userData?.email || user?.email || 'Ingen email'}
          </div>
        </div>

        {/* Role field (read-only) */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text)' }}>
            Rolle
          </label>
          <div
            style={{
              padding: '10px',
              color: 'var(--text-secondary)',
              minHeight: '38px',
              background: 'var(--input-bg)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {userData?.role === 'Teacher' ? 'Underviser' : 'Studerende'}
          </div>
        </div>

        {/* Password reset button */}
        <div style={{ marginBottom: '20px' }}>
          <button
            className="uv-btn"
            onClick={handleResetPassword}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--button-bg)',
              color: 'var(--button-text)',
              border: '1px solid var(--button-border)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Sender...' : 'Nulstil adgangskode'}
          </button>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', textAlign: 'center' }}>
            Du vil modtage et link til nulstilling via email
          </p>
        </div>

        {/* Close button */}
        <button
          className="uv-btn"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--hover-bg)',
            color: 'var(--muted)',
          }}
        >
          Luk
        </button>
      </div>
    </div>
  );
};

export default BrugerInfo;

