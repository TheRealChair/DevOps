import React, { useState } from 'react';
import QuestionDemo from './QuestionDemo';


interface StuderendePageProps {
  onBack?: () => void;
}


const StuderendePage: React.FC<StuderendePageProps> = ({ onBack }) => {
  const [showDemo, setShowDemo] = useState(false);
  if (showDemo) {
    return <QuestionDemo onBack={() => setShowDemo(false)} />;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
      <h2>Studerende Page</h2>
      <p>Insert Room Number</p>
      <input type="text" placeholder="Type here..." style={{ padding: '0.5rem', fontSize: '1rem', margin: '1rem 0', width: '250px' }} />
      <button style={{ padding: '0.75rem 2rem', fontSize: '1rem', cursor: 'pointer' }}>Submit</button>
      <button onClick={() => setShowDemo(true)} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer', background: '#e0e0ff' }}>Demo Questions</button>
      <button onClick={onBack} style={{ marginTop: '2rem', padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}>Back</button>
    </div>
  );
};

export default StuderendePage;
