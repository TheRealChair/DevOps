

// StuderendePage: Main entry for student users
import React, { useState, useEffect } from 'react';
import RoomViewer from './RoomViewer';
import questionsData from '../data/questions.json';
import chDemoData from '../data/ch-demo.json';
import '../design/colors.css';
import '../design/App.css';
import '../design/components.css';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp, onSnapshot, DocumentSnapshot } from 'firebase/firestore';


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
  const [roomId, setRoomId] = useState<string | null>(null);
  const [waitingForRoom, setWaitingForRoom] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);

  // Listen to room status in real-time when roomId is set
  useEffect(() => {
    if (!roomId) return;
    
    const roomRef = doc(db, 'EscapeRooms', roomId);
    const unsubscribe = onSnapshot(roomRef, (snap: DocumentSnapshot) => {
      if (!snap.exists()) {
        // Room was deleted
        setWaitingForRoom(false);
        setRoomId(null);
        if (nicknamePrompt) {
          alert('Rummet blev ikke fundet eller blev slettet.');
          setNicknamePrompt(false);
          setPendingRoom(null);
        }
        return;
      }
      
      const roomData = snap.data();
      if (roomData?.started) {
        // Room is now started, allow joining
        setPendingRoom({ id: snap.id, ...roomData });
        setWaitingForRoom(false);
      } else if (waitingForRoom) {
        // Room is not started yet, but we're waiting
        // Update pendingRoom with latest data
        setPendingRoom({ id: snap.id, ...roomData });
      }
    }, (error) => {
      console.error('Error listening to room:', error);
      setWaitingForRoom(false);
      setRoomId(null);
    });
    
    return () => unsubscribe();
  }, [roomId, waitingForRoom, nicknamePrompt]);

  // Handler for nickname submission (MOVED UP)
  const handleNicknameSubmit = async () => {
    if (!pendingRoom || !nickname.trim()) return;
    if (!pendingRoom.pages || pendingRoom.pages.length === 0) {
      alert('Room content missing.');
      setPendingRoom(null);
      setNicknamePrompt(false);
      setRoomId(null);
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
    const newStudentId = Math.random().toString(36).substring(2, 10);
    await setDoc(doc(studentsCol, newStudentId), {
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
    setStudentId(newStudentId);
    setRoomId(pendingRoom.id);
  };

  // If demo mode is triggered, show demo page
  if (showDemo) {
    // Render room viewer page with loaded questions
    return <RoomViewer 
      onBack={() => {
        setShowDemo(false);
        setRoomId(null);
        setPendingRoom(null);
        setStudentId(null);
      }} 
      questions={demoQuestions}
      roomId={roomId || undefined}
      studentId={studentId || undefined}
    />;
  }

  if (nicknamePrompt && pendingRoom) {
    return (
      <div className="stud-root">
        <h2>Join som...</h2>
        {waitingForRoom && !pendingRoom.started && (
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--warning-bg, #fff3cd)', color: 'var(--warning-text, #856404)', borderRadius: 8 }}>
            Vent venligst - rummet er ikke startet endnu. Du vil automatisk kunne joine når underviseren starter rummet.
          </div>
        )}
        <input
          className="stud-input"
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          placeholder="Indtast dit kaldenavn"
          disabled={waitingForRoom && !pendingRoom?.started}
        />
        <button 
          className="stud-btn" 
          onClick={handleNicknameSubmit}
          disabled={waitingForRoom && !pendingRoom?.started}
        >
          {waitingForRoom && !pendingRoom?.started ? 'Venter på rum...' : 'Join rum'}
        </button>
        <button 
          className="stud-btn" 
          style={{marginTop:'2rem'}} 
          onClick={() => {
            setNicknamePrompt(false);
            setWaitingForRoom(false);
            setRoomId(null);
            setPendingRoom(null);
            setStudentId(null);
          }}
        >
          Tilbage
        </button>
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
        alert('Rum ikke fundet!');
        return;
      }
      const docSnap = snap.docs[0];
      const room = { id: docSnap.id, ...(docSnap.data() as any) };
      
      if (!room.pages || room.pages.length === 0) {
        alert('Dette rum har ingen indhold!');
        return;
      }
      
      // Set roomId to start listening
      setRoomId(room.id);
      
      if (!room.started) {
        // Room is not started yet, wait for it
        setWaitingForRoom(true);
        setPendingRoom(room); // Store room data for when it starts
        // Show waiting message
        alert('Rummet er ikke live endnu. Vent venligst på din underviser. Du vil automatisk kunne joine når rummet starter.');
        setNicknamePrompt(true);
        return;
      }
      
      // Room is already started, allow joining immediately
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
