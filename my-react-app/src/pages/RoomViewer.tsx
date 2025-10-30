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
}

const RoomViewer: React.FC<RoomViewerProps> = ({ onBack, questions }) => {
  const [pageIdx, setPageIdx] = useState(0);
  const [pages, setPages] = useState<PageData[]>(questions ?? []);

  useEffect(() => {
    if (questions) {
      console.log("RoomViewer loading questions:", questions);
    }
  }, [questions]);

  const page = pages[pageIdx];

  // ...existing code...

  if (!page && pages.length === 0) {
    return (
      <div className="stud-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div>
          <div style={{color:'red'}}>Error: No questions/pages loaded for this room. Please check with your teacher or reload the page.</div>
          <button className="stud-btn" onClick={onBack}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="stud-root" style={{ minHeight: '100vh', minWidth: '100vw', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, boxSizing: 'border-box', overflow: 'hidden', position: 'relative' }}>
      {/* Subtle fade shadow for depth */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle at 60% 40%, var(--card-shadow, rgba(99,102,241,0.08)) 0%, rgba(0,0,0,0) 70%)' }} />
      <div className="stud-card" style={{ borderRadius: 22, border: '1.5px solid var(--border)', boxShadow: '0 8px 32px 0 var(--card-shadow, rgba(60,72,100,0.13))', padding: '48px 36px', maxWidth: 480, width: '100%', margin: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto', zIndex: 1 }}>
        <h2 className="stud-title" style={{ fontWeight: 700, fontSize: 28, marginBottom: 8, letterSpacing: 0.5 }}>Spørgsmåls Demo</h2>
        <div style={{ marginBottom: 24, width: '100%' }}>
          <div className="stud-muted" style={{ fontSize: 14, marginBottom: 2 }}><strong>Type:</strong> {page.type}</div>
          <div style={{ color: 'var(--primary)', fontSize: 20, fontWeight: 600 }}>{page.title}</div>
        </div>
        {/* Render modular question components based on type */}
        {page.type === 'multipleChoice' && (
          <MultipleChoiceQuestion page={page} onAnswer={() => {}} />
        )}
        {page.type === 'inputAnswer' && (
          <InputAnswerQuestion page={page} onAnswer={() => {}} />
        )}
        {page.type === 'progressiveQuestions' && (
          <ProgressiveQuestions page={page} onAnswer={() => {}} />
        )}
        {page.type === 'dragAndDrop' && (
          <DragAndDropQuestion page={page} onAnswer={() => {}} />
        )}
        <div style={{ marginTop: 32, display: 'flex', gap: 12, width: '100%' }}>
          <button className="stud-btn" onClick={onBack} style={{ flex: 1 }}>Tilbage</button>
          <button className="stud-btn" onClick={() => setPageIdx(i => Math.max(0, i - 1))} disabled={pageIdx === 0} style={{ flex: 1, opacity: pageIdx === 0 ? 0.6 : 1 }}>Forrige</button>
          <button className="stud-btn" onClick={() => setPageIdx(i => Math.min(pages.length - 1, i + 1))} disabled={pageIdx === pages.length - 1} style={{ flex: 1, opacity: pageIdx === pages.length - 1 ? 0.6 : 1 }}>Næste</button>
        </div>
      </div>
    </div>
  );
};

export default RoomViewer;
