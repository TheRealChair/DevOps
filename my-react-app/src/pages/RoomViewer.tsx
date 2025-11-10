import React, { useState, useEffect } from 'react';

// ...existing code...
import type { PageData } from './UnderviserPagesManager';
import MultipleChoiceQuestion from './studerende/components/MultipleChoiceQuestion';
import InputAnswerQuestion from './studerende/components/InputAnswerQuestion';
import ProgressiveQuestions from './studerende/components/ProgressiveQuestions';
import DragAndDropQuestion from './studerende/components/DragAndDropQuestion';
import QuestionHeader from '../components/QuestionHeader';
import '../design/colors.css';
import '../design/App.css';
import '../design/components.css';
import { db } from '../services/firebase';
import { doc, onSnapshot, DocumentSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';

// Import questions from JSON
import questionsData from '../data/questions.json';



interface RoomViewerProps {
  onBack: () => void;
  questions?: PageData[];
  previewAsStudent?: boolean;
  roomId?: string;
  studentId?: string;
  initialPageIndex?: number; // Start preview at specific page index
}


const RoomViewer: React.FC<RoomViewerProps> = ({ onBack, questions, previewAsStudent, roomId, studentId, initialPageIndex }) => {
  const [pageIdx, setPageIdx] = useState(initialPageIndex || 0);
  // Derive pages from props with a fallback to demo data
  const pages: PageData[] = (questions && questions.length > 0)
    ? questions
    : (questionsData as PageData[]);
  // Track if we've initialized - to prevent resetting pageIdx after initial load
  const [hasInitialized, setHasInitialized] = useState(false);
  const [completed, setCompleted] = useState(false);
  // Track answers and correctness
  const [answers, setAnswers] = useState<(boolean | null)[]>([]);
  // Timer state
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const [kickedOut, setKickedOut] = useState(false);
  const [kickReason, setKickReason] = useState<string | null>(null);

  // Listen to room status and student document in real-time (only for real rooms, not preview/demo)
  useEffect(() => {
    if (previewAsStudent || !roomId) return; // Don't listen for preview mode or demo rooms
    
    // Listen to room status
    const roomRef = doc(db, 'EscapeRooms', roomId);
    const unsubscribeRoom = onSnapshot(roomRef, (snap: DocumentSnapshot) => {
      if (!snap.exists()) {
        // Room was deleted
        setKickReason('room-deleted');
        setKickedOut(true);
        return;
      }
      
      const roomData = snap.data();
      if (!roomData?.started) {
        // Room was closed
        setKickReason('room-closed');
        setKickedOut(true);
      }
    }, (error) => {
      console.error('Error listening to room:', error);
    });

    // Listen to student document (to detect if student was removed)
    if (studentId) {
      const studentRef = doc(db, 'EscapeRooms', roomId, 'Students', studentId);
      const unsubscribeStudent = onSnapshot(studentRef, (snap: DocumentSnapshot) => {
        if (!snap.exists()) {
          // Student was removed. If we've already completed, ignore this so the student can see the summary.
          if (!completed) {
            setKickReason('student-removed');
            setKickedOut(true);
          }
          return;
        }
        // Sync progress from Firestore so re-joins on another device resume where they left off
        const data = snap.data() as any;
        // Only sync progress if not completed locally (prevent overwriting completion state)
        if (typeof data?.progress === 'number' && !completed) {
          setPageIdx(prev => (prev !== data.progress ? data.progress : prev));
        }
        // If the student is marked as completed in Firestore, set local completed state
        if (data?.completed && !completed) {
          setCompleted(true);
        }
      }, (error) => {
        console.error('Error listening to student:', error);
      });

      return () => {
        unsubscribeRoom();
        unsubscribeStudent();
      };
    }

    return () => {
      unsubscribeRoom();
    };
  }, [roomId, studentId, previewAsStudent, completed]);

  // Handle being kicked out
  useEffect(() => {
    if (kickedOut) {
      const msg = kickReason === 'student-removed'
        ? 'Du er blevet fjernet fra rummet.'
        : 'Rummet er blevet lukket. Du bliver nu sendt tilbage.';
      alert(msg);
      onBack();
    }
  }, [kickedOut, kickReason, onBack]);


  useEffect(() => {
    if (questions) {
      console.log("RoomViewer loading questions:", questions);
    }
    // Only reset state if not completed (prevent losing completion state on data updates)
    // And only reset if already initialized (don't override initialPageIndex on first load)
    if (!completed && hasInitialized) {
      setAnswers(Array(pages.length).fill(null));
      setStartTime(Date.now());
      setElapsed(0);
      setPageIdx(0);
    }
    if (!hasInitialized) {
      setAnswers(Array(pages.length).fill(null));
      setStartTime(Date.now());
      setElapsed(0);
      setHasInitialized(true);
    }
  }, [questions, pages.length]);

  // Timer effect
  useEffect(() => {
    if (completed || startTime === null) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [completed, startTime]);

  // Called when user reaches the last question and clicks 'Næste'
  const handleNext = () => {
    if (pageIdx < pages.length - 1) {
      // Advance to next page and persist progress to Firestore (so teacher sees it live)
      setPageIdx(i => {
        const nextIdx = i + 1;
        // Persist progress only for real room sessions (not preview/demo)
        if (!previewAsStudent && roomId && studentId) {
          try {
            const studentRef = doc(db, 'EscapeRooms', roomId, 'Students', studentId);
            // Store current page index (0-based). Teacher UI adds +1 when showing.
            updateDoc(studentRef, { progress: nextIdx, lastUpdated: serverTimestamp() }).catch(err => {
              console.error('Kunne ikke opdatere elevens progress:', err);
            });
          } catch (err) {
            console.error('Fejl ved progress update:', err);
          }
        }
        return nextIdx;
      });
    } else {
      // Only complete if all answers are correct
      if (answers.every(a => a === true)) {
        setCompleted(true);
        // Mark student as completed instead of deleting
        if (!previewAsStudent && roomId && studentId) {
          const studentRef = doc(db, 'EscapeRooms', roomId, 'Students', studentId);
          updateDoc(studentRef, { 
            completed: true, 
            completedAt: serverTimestamp(),
            finalTime: elapsed
          }).catch(err => {
            console.error('Kunne ikke markere elev som færdig:', err);
          });
        }
      }
    }
  };

  // Called when user clicks 'Forrige'
  const handlePrev = () => {
    setPageIdx(i => Math.max(0, i - 1));
  };

  // Called by question components when answered
  const handleAnswer = (correct: boolean) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[pageIdx] = correct;
      return updated;
    });
  };

  if (!pages.length) {
    return (
      <div
        className="stud-root"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - var(--topbar-h, 48px))'
        }}
      >
        <div>
          <div style={{color:'red'}}>Error: No questions/pages loaded for this room. Please check with your teacher or reload the page.</div>
          <button className="stud-btn" onClick={onBack}>Back</button>
        </div>
      </div>
    );
  }


  if (completed) {
    // Show summary when all questions are answered correctly
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return (
      <div
        className="stud-root"
        style={{
          minHeight: 'calc(100vh - var(--topbar-h, 48px))',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          boxSizing: 'border-box',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle at 60% 40%, var(--card-shadow, rgba(99,102,241,0.08)) 0%, rgba(0,0,0,0) 70%)' }} />
        <div className="stud-card" style={{ borderRadius: 22, border: '1.5px solid var(--border)', boxShadow: '0 8px 32px 0 var(--card-shadow, rgba(60,72,100,0.13))', padding: '48px 36px', maxWidth: 480, width: '100%', margin: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto', zIndex: 1 }}>
          <h2 className="stud-title" style={{ fontWeight: 700, fontSize: 28, marginBottom: 8, letterSpacing: 0.5 }}>Rummet er fuldført!</h2>
          <div style={{ marginBottom: 24, width: '100%' }}>
            <div className="stud-muted" style={{ fontSize: 16, marginBottom: 8 }}>Du har besvaret alle spørgsmål korrekt.</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--primary)' }}>Antal spørgsmål: {pages.length}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--primary)', marginTop: 8 }}>Tid brugt: {minutes}:{seconds.toString().padStart(2, '0')}</div>
          </div>
          <button className="stud-btn" onClick={onBack} style={{ marginTop: 32 }}>Tilbage</button>
        </div>
      </div>
    );
  }

  const page = pages[pageIdx];
  const answeredCorrectly = answers[pageIdx] === true;

  return (
    <div
      className="stud-root"
      style={{
        minHeight: 'calc(100vh - var(--topbar-h, 48px))',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Subtle fade shadow for depth */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle at 60% 40%, var(--card-shadow, rgba(99,102,241,0.08)) 0%, rgba(0,0,0,0) 70%)' }} />
      <div className="stud-card" style={{ borderRadius: 22, border: '1.5px solid var(--border)', boxShadow: '0 8px 32px 0 var(--card-shadow, rgba(60,72,100,0.13))', padding: '48px 36px', maxWidth: 480, width: '100%', margin: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto', zIndex: 1 }}>
        <QuestionHeader
          title={page.title || (previewAsStudent ? 'Forhåndsvisning' : 'Spørgsmåls Demo')}
          type={page.type}
          current={pageIdx}
          total={pages.length}
          elapsedSec={elapsed}
          preview={!!previewAsStudent}
        />
        {/* Render modular question components based on type */}
        {page.type === 'multipleChoice' && (
          <MultipleChoiceQuestion page={page} onAnswer={handleAnswer} />
        )}
        {page.type === 'inputAnswer' && (
          <InputAnswerQuestion page={page} onAnswer={handleAnswer} />
        )}
        {page.type === 'progressiveQuestions' && (
          <ProgressiveQuestions page={page} onAnswer={handleAnswer} />
        )}
        {page.type === 'dragAndDrop' && (
          <DragAndDropQuestion page={page} onAnswer={handleAnswer} />
        )}
        <div style={{ marginTop: 32, display: 'flex', gap: 12, width: '100%' }}>
          <button className="stud-btn" onClick={onBack} style={{ flex: 1 }}>Tilbage</button>
          <button className="stud-btn" onClick={handlePrev} disabled={pageIdx === 0} style={{ flex: 1, opacity: pageIdx === 0 ? 0.6 : 1 }}>Forrige</button>
          <button className="stud-btn" onClick={handleNext} disabled={!answeredCorrectly} style={{ flex: 1, opacity: answeredCorrectly ? 1 : 0.6 }}>Næste</button>
        </div>
  {!answeredCorrectly && <div style={{ color: 'var(--danger, #e53e3e)', marginTop: 16, fontWeight: 500 }}>Du skal svare korrekt for at gå videre.</div>}
      </div>
    </div>
  );
};

export default RoomViewer;
