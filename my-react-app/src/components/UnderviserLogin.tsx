import React, { useState } from 'react';
import { AuthService } from '../services/authService';
import '../design/colors.css';
import '../design/App.css';
import '../design/components.css';

interface UnderviserLoginProps {
  onLoginSuccess?: () => void;
  onBack?: () => void;
}

const UnderviserLogin: React.FC<UnderviserLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        // Sign in
        await AuthService.signIn(email, password);
        setSuccess('Succesfuldt logget ind!');
        if (onLoginSuccess) {
          setTimeout(() => onLoginSuccess(), 1000);
        }
      } else {
        // Register
        if (password !== confirmPassword) {
          setError('Adgangskoderne matcher ikke');
          setLoading(false);
          return;
        }
        
        await AuthService.register(email, password, 'Teacher');
        setSuccess('Konto oprettet succesfuldt! Du er nu logget ind.');
        if (onLoginSuccess) {
          setTimeout(() => onLoginSuccess(), 1000);
        }
      }
    } catch (error: any) {
      setError(error.message || 'Der opstod en fejl');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="uv-root" style={{ 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      overflow: 'auto',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        background: 'var(--surface)', 
        padding: '2rem', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px var(--card-shadow)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 className="uv-heading" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {isLogin ? 'Underviser Login' : 'Opret Underviser Konto'}
        </h2>

        {error && (
          <div style={{ 
            background: 'var(--feedback-incorrect-bg)', 
            color: 'var(--feedback-incorrect-text)', 
            padding: '0.75rem', 
            borderRadius: '4px', 
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ 
            background: 'var(--feedback-correct-bg)', 
            color: 'var(--feedback-correct-text)', 
            padding: '0.75rem', 
            borderRadius: '4px', 
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Email:
            </label>
            <input
              className="uv-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem' }}
              placeholder="Indtast din email"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Adgangskode:
            </label>
            <input
              className="uv-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem' }}
              placeholder="Indtast din adgangskode"
            />
          </div>

          {!isLogin && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Bekræft Adgangskode:
              </label>
              <input
                className="uv-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem' }}
                placeholder="Bekræft din adgangskode"
              />
            </div>
          )}

          <button
            className="uv-btn primary"
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              marginBottom: '1rem',
              opacity: loading ? 0.7 : 1,
              background: 'var(--button-bg)',
              color: 'var(--button-text)',
              border: '1px solid var(--button-border)'
            }}
          >
            {loading ? 'Indlæser...' : (isLogin ? 'Log Ind' : 'Opret Konto')}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <button
            className="uv-btn"
            onClick={toggleMode}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--muted)', 
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {isLogin ? "Har du ikke en konto? Opret en" : "Har du allerede en konto? Log ind"}
          </button>
        </div>

        {onBack && (
          <button
            className="uv-btn"
            onClick={onBack}
            style={{ 
              width: '100%', 
              marginTop: '1rem',
              background: 'var(--hover-bg)',
              color: 'var(--muted)'
            }}
          >
            Tilbage
          </button>
        )}
      </div>
    </div>
  );
};

export default UnderviserLogin;
