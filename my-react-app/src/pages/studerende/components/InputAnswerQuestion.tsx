import React from 'react';
import type { PageData } from '../../UnderviserPagesManager';

interface Props {
  page: Extract<PageData, { type: 'inputAnswer' }>;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
}

const InputAnswerQuestion: React.FC<Props> = ({ page, onAnswer, disabled }) => {
  const [value, setValue] = React.useState('');
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleCheck = () => {
    if (disabled || feedback !== null) return;
    const correct = value.trim().toLowerCase() === page.answer.trim().toLowerCase();
    setFeedback(correct ? 'Correct!' : 'Incorrect');
    onAnswer(correct);
  };

  return (
    <div>
      <h3>{page.title}</h3>
      {page.imageUrl && <img src={page.imageUrl} alt="" style={{ maxWidth: 300, marginBottom: 12 }} />}
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled || feedback !== null}
        placeholder="Your answer..."
        style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16, marginBottom: 10 }}
      />
      <button onClick={handleCheck} disabled={disabled || feedback !== null} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', marginBottom: 8, cursor: feedback === null ? 'pointer' : 'default' }}>
        Check
      </button>
      {feedback && <div style={{ marginTop: 8, fontWeight: 600, fontSize: 16, color: feedback === 'Correct!' ? '#059669' : '#dc2626' }}>{feedback}</div>}
    </div>
  );
};

export default InputAnswerQuestion;
