import React, { useState } from 'react';
import type { PageData } from './UnderviserPagesManager';

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

  // State for answers and feedback
  const [mcSelected, setMcSelected] = useState<number | null>(null);
  const [mcFeedback, setMcFeedback] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [inputFeedback, setInputFeedback] = useState<string | null>(null);
  const [progAnswers, setProgAnswers] = useState<string[]>([]);
  const [progFinal, setProgFinal] = useState('');
  const [progFeedback, setProgFeedback] = useState<string | null>(null);


  // Drag and drop state (only used for dragAndDrop page)
  const [ddOrder, setDdOrder] = useState<number[]>([]);
  const [ddFeedback, setDdFeedback] = useState<string | null>(null);

  // Drag and drop handlers

  // Reset drag-and-drop state when page changes
  React.useEffect(() => {
    if (page.type === 'dragAndDrop') {
      setDdOrder([...page.correctOrder].sort(() => Math.random() - 0.5));
    } else {
      setDdOrder([]);
    }
    setDdFeedback(null);
  }, [pageIdx]);

  // Reset state when page changes
  React.useEffect(() => {
    setMcSelected(null);
    setMcFeedback(null);
    setInputValue('');
    setInputFeedback(null);
    setProgAnswers(page.type === 'progressiveQuestions' ? Array(page.questions.length).fill('') : []);
    setProgFinal('');
    setProgFeedback(null);
    if (page.type === 'dragAndDrop') {
      setDdOrder([...page.correctOrder].sort(() => Math.random() - 0.5));
    } else {
      setDdOrder([]);
    }
    setDdFeedback(null);
  }, [pageIdx]);

  // Handlers
  const handleMcClick = (optId: number) => {
    setMcSelected(optId);
    const correct = page.type === 'multipleChoice' && page.options.find(o => o.id === optId)?.correct;
    setMcFeedback(correct ? 'Correct!' : 'Incorrect');
  };

  const handleInputCheck = () => {
    if (page.type === 'inputAnswer') {
      setInputFeedback(inputValue.trim().toLowerCase() === page.answer.trim().toLowerCase() ? 'Correct!' : 'Incorrect');
    }
  };

  const handleProgCheck = () => {
    if (page.type === 'progressiveQuestions') {
      let allCorrect = true;
      for (let i = 0; i < page.questions.length; i++) {
        if (progAnswers[i].trim().toLowerCase() !== page.questions[i].answer.trim().toLowerCase()) {
          allCorrect = false;
          break;
        }
      }
      const finalCorrect = progFinal.trim().toLowerCase() === page.finalAnswer.trim().toLowerCase();
      if (allCorrect && finalCorrect) setProgFeedback('All answers correct!');
      else if (!allCorrect) setProgFeedback('One or more answers are incorrect.');
      else setProgFeedback('Final answer is incorrect.');
    }
  };

  const handleDdMove = (idx: number, dir: 'up' | 'down') => {
    if (!ddOrder) return;
    const arr = [...ddOrder];
    if (dir === 'up' && idx > 0) {
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    } else if (dir === 'down' && idx < arr.length - 1) {
      [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
    }
    setDdOrder(arr);
  };

  const handleDdCheck = () => {
    if (page.type === 'dragAndDrop') {
      const correct = page.correctOrder.every((id: number, idx: number) => ddOrder[idx] === id);
      setDdFeedback(correct ? 'Correct order!' : 'Incorrect order.');
    }
  };

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
        {/* Render based on type */}
        {page.type === 'multipleChoice' && (
          <div style={{ width: '100%' }}>
            {page.options.map((opt: { id: number; text: string; correct: boolean }) => (
              <button
                key={opt.id}
                style={{
                  display: 'block',
                  margin: '10px 0',
                  padding: '14px 0',
                  width: '100%',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  background: mcSelected === opt.id ? (opt.correct ? '#d1fae5' : '#fee2e2') : '#f7fafc',
                  color: '#2d3748',
                  fontWeight: 500,
                  fontSize: 16,
                  cursor: mcSelected === null ? 'pointer' : 'default',
                  transition: 'background 0.2s',
                }}
                onClick={() => handleMcClick(opt.id)}
                disabled={mcSelected !== null}
              >
                {opt.text}
              </button>
            ))}
            {mcFeedback && <div style={{ marginTop: 16, fontWeight: 600, fontSize: 16, color: mcFeedback === 'Correct!' ? '#059669' : '#dc2626' }}>{mcFeedback}</div>}
          </div>
        )}
        {page.type === 'inputAnswer' && (
          <div style={{ width: '100%' }}>
            <input
              type="text"
              placeholder="Your answer..."
              style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16, marginBottom: 10 }}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={inputFeedback !== null}
            />
            <button onClick={handleInputCheck} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', marginBottom: 8, cursor: inputFeedback === null ? 'pointer' : 'default' }} disabled={inputFeedback !== null}>Check</button>
            {inputFeedback && <div style={{ marginTop: 8, fontWeight: 600, fontSize: 16, color: inputFeedback === 'Correct!' ? '#059669' : '#dc2626' }}>{inputFeedback}</div>}
          </div>
        )}
        {page.type === 'progressiveQuestions' && (
          <div style={{ width: '100%' }}>
            {page.questions.map((q: { id: number; prompt: string }, idx: number) => {
              // Only allow input if all previous answers are correct
              const prevCorrect = idx === 0 || progAnswers[idx - 1]?.trim().toLowerCase() === page.questions[idx - 1].answer.trim().toLowerCase();
              const isDisabled = progFeedback !== null || !prevCorrect;
              return (
                <div key={q.id} style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 500, color: '#374151', marginBottom: 4 }}>{q.prompt}</div>
                  <input
                    type="text"
                    placeholder="Answer..."
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16, background: isDisabled ? '#f3f4f6' : undefined }}
                    value={progAnswers[idx] || ''}
                    onChange={e => {
                      const arr = [...progAnswers];
                      arr[idx] = e.target.value;
                      setProgAnswers(arr);
                    }}
                    disabled={isDisabled}
                  />
                </div>
              );
            })}
            <div style={{ marginTop: 18 }}>
              <strong style={{ color: '#6366f1' }}>{page.finalBarLabel}:</strong>
              <input
                type="text"
                placeholder="Final answer..."
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16, marginTop: 4, background: (progAnswers.length === 0 || progAnswers[progAnswers.length - 1]?.trim().toLowerCase() !== page.questions[page.questions.length - 1].answer.trim().toLowerCase()) ? '#f3f4f6' : undefined }}
                value={progFinal}
                onChange={e => setProgFinal(e.target.value)}
                disabled={progFeedback !== null || progAnswers.length === 0 || progAnswers[progAnswers.length - 1]?.trim().toLowerCase() !== page.questions[page.questions.length - 1].answer.trim().toLowerCase()}
              />
            </div>
            <button onClick={handleProgCheck} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', marginTop: 16, cursor: progFeedback === null ? 'pointer' : 'default' }} disabled={progFeedback !== null}>Check</button>
            {progFeedback && <div style={{ marginTop: 10, fontWeight: 600, fontSize: 16, color: progFeedback === 'All answers correct!' ? '#059669' : '#dc2626' }}>{progFeedback}</div>}
          </div>
        )}
        {page.type === 'dragAndDrop' && (
          <div style={{ width: '100%' }}>
            <div style={{ marginBottom: 16, color: '#6366f1', fontWeight: 600, fontSize: 16 }}>
              Arrange the items in the correct order:
            </div>
            <ol style={{ padding: 0, listStyle: 'none', width: '100%' }}>
              {ddOrder.map((itemId, idx) => {
                const item = page.items.find(i => i.id === itemId);
                if (!item) return null;
                return (
                  <li key={itemId} style={{ marginBottom: 10, border: '1px solid #cbd5e1', borderRadius: 8, padding: 10, display: 'flex', alignItems: 'center', background: '#f1f5f9' }}>
                    <span style={{ fontWeight: 600, marginRight: 12, color: '#6366f1' }}>#{idx + 1}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    <button onClick={() => handleDdMove(idx, 'up')} disabled={idx === 0 || ddFeedback !== null} style={{ marginLeft: 8, border: 'none', background: '#e0e7ef', borderRadius: 4, padding: '4px 8px', cursor: idx === 0 || ddFeedback !== null ? 'not-allowed' : 'pointer' }}>↑</button>
                    <button onClick={() => handleDdMove(idx, 'down')} disabled={idx === ddOrder.length - 1 || ddFeedback !== null} style={{ marginLeft: 4, border: 'none', background: '#e0e7ef', borderRadius: 4, padding: '4px 8px', cursor: idx === ddOrder.length - 1 || ddFeedback !== null ? 'not-allowed' : 'pointer' }}>↓</button>
                  </li>
                );
              })}
            </ol>
            <button onClick={handleDdCheck} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', marginTop: 12, cursor: ddFeedback === null ? 'pointer' : 'default' }} disabled={ddFeedback !== null}>Check</button>
            {ddFeedback && <div style={{ marginTop: 10, fontWeight: 600, fontSize: 16, color: ddFeedback === 'Correct order!' ? '#059669' : '#dc2626' }}>{ddFeedback}</div>}
          </div>
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
