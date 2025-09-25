import React, { useState } from 'react';

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
}

const UnderviserPage: React.FC<UnderviserPageProps> = ({ onBack }) => {
  const [code, setCode] = useState(generateCode());

  const handleGenerate = () => {
    setCode(generateCode());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
      <h2>Underviser Page</h2>
      <div style={{ margin: '1rem 0' }}>
        <input type="text" value={code} readOnly style={{ padding: '0.5rem', fontSize: '1.2rem', width: '180px', textAlign: 'center', letterSpacing: '0.2em' }} />
      </div>
      <button onClick={handleGenerate} style={{ padding: '0.75rem 2rem', fontSize: '1rem', cursor: 'pointer' }}>Generate New Code</button>
      <button onClick={onBack} style={{ marginTop: '2rem', padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}>Back</button>
    </div>
  );
};

export default UnderviserPage;
