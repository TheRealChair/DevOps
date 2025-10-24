

// StuderendePage: Main entry for student users
import React, { useState } from 'react';
import RoomViewer from './RoomViewer';
import questionsData from '../data/questions.json';
import chDemoData from '../data/ch-demo.json';
import '../design/colors.css';
import '../design/App.css';
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
  // State: questions to pass to demo (if any)
  const [demoQuestions, setDemoQuestions] = useState<any[]>([]);

  // If demo mode is triggered, show demo page
  if (showDemo) {
    // Render room viewer page with loaded questions
    return <RoomViewer onBack={() => setShowDemo(false)} questions={demoQuestions} />;
  }

  // Handle submit: if code is 'demo', show demo, else (future: join room)
  const handleSubmit = () => {
    const code = roomCode.trim().toLowerCase();
    if (code === 'demo') {
      // Enter demo mode, load questions from JSON
      setDemoQuestions(questionsData as any[]);
      setShowDemo(true);
    } else if (code === 'ch-demo') {
      // Enter ch-demo mode, load ch-demo questions
      setDemoQuestions(chDemoData as any[]);
      setShowDemo(true);
    } else {
      // TODO: handle joining a real room
      alert('Room joining not implemented. Enter "demo" or "ch-demo" for demo mode.');
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
