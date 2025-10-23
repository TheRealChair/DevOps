import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../design/colors.css';
import '../design/app.css';
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
  onPagesManager?: () => void;
}

const UnderviserPage: React.FC<UnderviserPageProps> = ({ onBack, onPagesManager }) => {
  const [code, setCode] = useState(generateCode());
  const { user, userData, signOut } = useAuth();

  const handleGenerate = () => {
    setCode(generateCode());
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
    <div className="uv-root" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 className="uv-heading">Underviser Page</h2>
      
      {/* User Info */}
      {user && userData && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          textAlign: 'center',
          minWidth: '300px'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Welcome, {userData.role}!</h3>
          <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>Email: {userData.email}</p>
        </div>
      )}

      <div style={{ margin: '1rem 0' }}>
        <input className="uv-input" type="text" value={code} readOnly style={{ fontSize: '1.2rem', width: '180px', textAlign: 'center', letterSpacing: '0.2em' }} />
      </div>
      <button className="uv-btn primary" onClick={handleGenerate}>Generate New Code</button>
      <button className="uv-btn" onClick={onPagesManager} style={{ marginTop: '1.5rem' }}>Manage Pages</button>
      <button className="uv-btn" onClick={handleLogout} style={{ marginTop: '1rem', background: '#dc3545', color: 'white' }}>Logout</button>
      <button className="uv-btn" onClick={onBack} style={{ marginTop: '0.5rem' }}>Back</button>
    </div>
  );
};

export default UnderviserPage;
