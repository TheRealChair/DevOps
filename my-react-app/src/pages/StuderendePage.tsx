

// StuderendePage: Main entry for student users
import React, { useState } from 'react';
import RoomViewer from './RoomViewer';
import questionsData from '../data/questions.json';
import chDemoData from '../data/ch-demo.json';
import '../design/colors.css';
import '../design/App.css';
import '../design/components.css';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';


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
  const [nickname, setNickname] = useState('');
  const [nicknamePrompt, setNicknamePrompt] = useState(false);
  const [pendingRoom, setPendingRoom] = useState<any>(null);

  // Handler for nickname submission (MOVED UP)
  const handleNicknameSubmit = async () => {
    if (!pendingRoom || !nickname.trim()) return;
    if (!pendingRoom.pages || pendingRoom.pages.length === 0) {
      alert('Room content missing.');
      setPendingRoom(null);
      setNicknamePrompt(false);
      return;
    }
    const studentsCol = collection(db, 'EscapeRooms', pendingRoom.id, 'Students');
    // Check uniqueness
    const nickQ = query(studentsCol, where('nickname', '==', nickname.trim()));
    const nickSnap = await getDocs(nickQ);
    if (!nickSnap.empty) {
      alert('That nickname is already taken in this room!');
      return;
    }
    // Assign random ID for this user (could be used for session)
    const studentId = Math.random().toString(36).substring(2, 10);
    await setDoc(doc(studentsCol, studentId), {
      nickname: nickname.trim(),
      progress: 0,
      joinedAt: serverTimestamp(),
    });
    // Debug log for loaded room
    console.log('Pending room at join', pendingRoom);
    console.log('Pages being loaded for RoomViewer:', pendingRoom.pages);
    setDemoQuestions(pendingRoom.pages);
    setShowDemo(true);
    setNicknamePrompt(false);
    setPendingRoom(null);
  };

  // If demo mode is triggered, show demo page
  if (showDemo) {
    // Render room viewer page with loaded questions
    return <RoomViewer onBack={() => setShowDemo(false)} questions={demoQuestions} />;
  }

  if (nicknamePrompt && pendingRoom) {
    return (
      <div className="stud-root">
        <h2>Join as...</h2>
        <input
          className="stud-input"
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          placeholder="Enter your nickname"
        />
        <button className="stud-btn" onClick={handleNicknameSubmit}>Join Room</button>
        <button className="stud-btn" style={{marginTop:'2rem'}} onClick={()=>setNicknamePrompt(false)}>Back</button>
      </div>
    );
  }

  // Handle submit: if code is 'demo', show demo, else (future: join room)
  const handleSubmit = async () => {
    const code = roomCode.trim();
    if (code.toLowerCase() === 'demo') {
      // Enter demo mode, load questions from JSON
      setDemoQuestions(questionsData as any[]);
      setShowDemo(true);
    } else if (code.toLowerCase() === 'ch-demo') {
      // Enter ch-demo mode, load ch-demo questions
      setDemoQuestions(chDemoData as any[]);
      setShowDemo(true);
    } else {
      // Look up real room by code
      const q = query(collection(db, 'EscapeRooms'), where('roomCode', '==', Number(code)));
      const snap = await getDocs(q);
      if (snap.empty) {
        alert('Room not found!');
        return;
      }
      const docSnap = snap.docs[0];
      const room = { id: docSnap.id, ...(docSnap.data() as any) };
      if (!room.started) {
        alert('Room is not live yet. Please wait for your teacher.');
        return;
      }
      if (!room.pages || room.pages.length === 0) {
        alert('This room has no content set!');
        return;
      }
      setPendingRoom(room);
      setNicknamePrompt(true);
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
