import React, { useState, useEffect } from 'react';

// ...existing code...
import type { PageData } from './UnderviserPagesManager';
import MultipleChoiceQuestion from './studerende/components/MultipleChoiceQuestion';
import InputAnswerQuestion from './studerende/components/InputAnswerQuestion';
import ProgressiveQuestions from './studerende/components/ProgressiveQuestions';
import DragAndDropQuestion from './studerende/components/DragAndDropQuestion';
import '../design/colors.css';
import '../design/App.css';
import '../design/components.css';

// Import questions from JSON
import questionsData from '../data/questions.json';



interface RoomViewerProps {
  onBack: () => void;
  questions?: PageData[];
  previewAsStudent?: boolean;
}


const RoomViewer: React.FC<RoomViewerProps> = ({ onBack, questions, previewAsStudent }) => {
  const [pageIdx, setPageIdx] = useState(0);
  // Derive pages from props with a fallback to demo data
  const pages: PageData[] = (questions && questions.length > 0)
    ? questions
    : (questionsData as PageData[]);
  const [completed, setCompleted] = useState(false);
  // Track answers and correctness
  const [answers, setAnswers] = useState<(boolean | null)[]>([]);
  // Timer state
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);


  useEffect(() => {
    if (questions) {
      console.log("RoomViewer loading questions:", questions);
    }
    setAnswers(Array(pages.length).fill(null));
    setStartTime(Date.now());
    setElapsed(0);
    setPageIdx(0);
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
      setPageIdx(i => i + 1);
    } else {
      // Only complete if all answers are correct
      if (answers.every(a => a === true)) {
        setCompleted(true);
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
        <h2 className="stud-title" style={{ fontWeight: 700, fontSize: 28, marginBottom: 8, letterSpacing: 0.5 }}>{previewAsStudent ? 'Forhåndsvisning som studerende' : 'Spørgsmåls Demo'}</h2>
        <div style={{ marginBottom: 24, width: '100%' }}>
          <div className="stud-muted" style={{ fontSize: 14, marginBottom: 2 }}><strong>Type:</strong> {page.type}</div>
          <div style={{ color: 'var(--primary)', fontSize: 20, fontWeight: 600 }}>{page.title}</div>
        </div>
        {/* Timer display */}
        <div style={{ fontSize: 15, color: 'var(--primary)', marginBottom: 8 }}>
          Tid brugt: {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}
        </div>
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
