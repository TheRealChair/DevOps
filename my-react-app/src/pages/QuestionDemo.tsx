import React, { useState } from 'react';
import type { PageData } from './UnderviserPagesManager';
import MultipleChoiceQuestion from './studerende/components/MultipleChoiceQuestion';
import InputAnswerQuestion from './studerende/components/InputAnswerQuestion';
import ProgressiveQuestions from './studerende/components/ProgressiveQuestions';
import DragAndDropQuestion from './studerende/components/DragAndDropQuestion';
import '../design/colors.css';
import '../design/app.css';
import '../design/components.css';

// Example demo templates (replace or import real templates as needed)
const demoPages: PageData[] = [
  {
    id: 1,
    type: 'multipleChoice',
    title: 'What is 2 + 2?',
    imageUrl: '',
    options: [
      { id: 1, text: '3', imageUrl: '', correct: false },
      { id: 2, text: '4', imageUrl: '', correct: true },
      { id: 3, text: '5', imageUrl: '', correct: false },
    ],
  },
  {
    id: 2,
    type: 'inputAnswer',
    title: 'Type the capital of France',
    imageUrl: '',
    answer: 'Paris',
  },
  {
    id: 3,
    type: 'progressiveQuestions',
    title: 'Progressive Example',
    imageUrl: '',
    questions: [
      { id: 1, prompt: 'First letter of the alphabet?', answer: 'A' },
      { id: 2, prompt: 'Second letter?', answer: 'B' },
    ],
    finalBarLabel: 'Final Word',
    finalAnswer: 'AB',
  },
  {
    id: 4,
    type: 'dragAndDrop',
    title: 'Order the planets from the sun',
    imageUrl: '',
    items: [
      { id: 1, label: 'Venus' },
      { id: 2, label: 'Earth' },
      { id: 3, label: 'Mercury' },
      { id: 4, label: 'Mars' },
    ],
    correctOrder: [3, 1, 2, 4], // Mercury, Venus, Earth, Mars
  },
];



const QuestionDemo: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [pageIdx, setPageIdx] = useState(0);
  const page = demoPages[pageIdx];

  // ...existing code...

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
          <button className="stud-btn" onClick={() => setPageIdx(i => Math.min(demoPages.length - 1, i + 1))} disabled={pageIdx === demoPages.length - 1} style={{ flex: 1, opacity: pageIdx === demoPages.length - 1 ? 0.6 : 1 }}>Næste</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDemo;
