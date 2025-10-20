import React, { useState } from 'react';
import type { PageData } from './UnderviserPagesManager';
import MultipleChoiceQuestion from './studerende/components/MultipleChoiceQuestion';
import InputAnswerQuestion from './studerende/components/InputAnswerQuestion';
import ProgressiveQuestions from './studerende/components/ProgressiveQuestions';
import DragAndDropQuestion from './studerende/components/DragAndDropQuestion';

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
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ef 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      boxSizing: 'border-box',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Subtle fade shadow for depth */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        background: 'radial-gradient(circle at 60% 40%, rgba(99,102,241,0.08) 0%, rgba(0,0,0,0) 70%)',
      }} />
      <div style={{
        background: '#fff',
        borderRadius: 22,
        border: '1.5px solid #e5e7eb',
        boxShadow: '0 8px 32px 0 rgba(60,72,100,0.13)',
        padding: '48px 36px',
        maxWidth: 480,
        width: '100%',
        margin: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        maxHeight: 'calc(100vh - 48px)',
        overflowY: 'auto',
        zIndex: 1,
      }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 8, color: '#2d3748', letterSpacing: 0.5 }}>Question Demo</h2>
        <div style={{ marginBottom: 24, width: '100%' }}>
          <div style={{ color: '#718096', fontSize: 14, marginBottom: 2 }}><strong>Type:</strong> {page.type}</div>
          <div style={{ color: '#4a5568', fontSize: 20, fontWeight: 600 }}>{page.title}</div>
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
          <button onClick={onBack} style={{ flex: 1, padding: 12, borderRadius: 8, background: '#e2e8f0', color: '#2d3748', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}>Back</button>
          <button onClick={() => setPageIdx(i => Math.max(0, i - 1))} disabled={pageIdx === 0} style={{ flex: 1, padding: 12, borderRadius: 8, background: pageIdx === 0 ? '#f1f5f9' : '#6366f1', color: pageIdx === 0 ? '#a0aec0' : '#fff', fontWeight: 600, fontSize: 16, border: 'none', cursor: pageIdx === 0 ? 'not-allowed' : 'pointer' }}>Previous</button>
          <button onClick={() => setPageIdx(i => Math.min(demoPages.length - 1, i + 1))} disabled={pageIdx === demoPages.length - 1} style={{ flex: 1, padding: 12, borderRadius: 8, background: pageIdx === demoPages.length - 1 ? '#f1f5f9' : '#6366f1', color: pageIdx === demoPages.length - 1 ? '#a0aec0' : '#fff', fontWeight: 600, fontSize: 16, border: 'none', cursor: pageIdx === demoPages.length - 1 ? 'not-allowed' : 'pointer' }}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDemo;
