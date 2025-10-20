import React, { useState } from 'react';
import '../design/App.css';

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

  const handleGenerate = () => {
    setCode(generateCode());
  };

  return (
    <div className="uv-root" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 className="uv-heading">Underviser Page</h2>
      <div style={{ margin: '1rem 0' }}>
        <input className="uv-input" type="text" value={code} readOnly style={{ fontSize: '1.2rem', width: '180px', textAlign: 'center', letterSpacing: '0.2em' }} />
      </div>
      <button className="uv-btn primary" onClick={handleGenerate}>Generate New Code</button>
      <button className="uv-btn" onClick={onPagesManager} style={{ marginTop: '1.5rem' }}>Manage Pages</button>
      <button className="uv-btn" onClick={onBack} style={{ marginTop: '1rem' }}>Back</button>
    </div>
  );
};

export default UnderviserPage;
