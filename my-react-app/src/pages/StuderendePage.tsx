
// StuderendePage: Main entry for student users
import React, { useState } from 'react';
import QuestionDemo from './QuestionDemo';



// Props:
// - onBack: callback to go back to previous page
interface StuderendePageProps {
  onBack?: () => void;
}



const StuderendePage: React.FC<StuderendePageProps> = ({ onBack }) => {
  // State: room code input value
  const [roomCode, setRoomCode] = useState('');
  // State: whether to show demo page
  const [showDemo, setShowDemo] = useState(false);

  // If demo mode is triggered, show demo page
  if (showDemo) {
    // Render demo questions page
    return <QuestionDemo onBack={() => setShowDemo(false)} />;
  }

  // Handle submit: if code is 'demo', show demo, else (future: join room)
  const handleSubmit = () => {
    if (roomCode.trim().toLowerCase() === 'demo') {
      // Enter demo mode
      setShowDemo(true);
    } else {
      // TODO: handle joining a real room
      alert('Room joining not implemented. Enter "demo" for demo mode.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
      {/* Page title */}
      <h2>Studerende Page</h2>
      {/* Room code input */}
      <p>Insert Room Number</p>
      <input
        type="text"
        value={roomCode}
        onChange={e => setRoomCode(e.target.value)}
        placeholder="Type here..."
        style={{ padding: '0.5rem', fontSize: '1rem', margin: '1rem 0', width: '250px' }}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
      />
      {/* Submit button */}
      <button onClick={handleSubmit} style={{ padding: '0.75rem 2rem', fontSize: '1rem', cursor: 'pointer' }}>Submit</button>
      {/* Back button */}
      <button onClick={onBack} style={{ marginTop: '2rem', padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}>Back</button>
    </div>
  );
};

export default StuderendePage;
