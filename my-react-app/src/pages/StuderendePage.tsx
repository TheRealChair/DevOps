

// StuderendePage: Main entry for student users
import React, { useState } from 'react';
import QuestionDemo from './QuestionDemo';
import '../design/colors.css';
import '../design/app.css';
import '../design/components.css';



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
    <div className="stud-root">
      {/* Page title */}
      <h2 className="stud-title">Studerende</h2>
      {/* Room code input */}
      <p className="stud-label">Indsæt rumnummer</p>
      <input
        className="stud-input"
        type="text"
        value={roomCode}
        onChange={e => setRoomCode(e.target.value)}
  placeholder="Skriv her..."
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
      />
  {/* Submit button */}
  <button className="stud-btn" onClick={handleSubmit}>Send</button>
      {/* Back button */}
      <button className="stud-btn" style={{ marginTop: '2rem' }} onClick={onBack}>Back</button>
    </div>
  );
};

export default StuderendePage;
