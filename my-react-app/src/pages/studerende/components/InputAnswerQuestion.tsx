
// InputAnswerQuestion: Renders a text input answer question for students
import React from 'react';
import type { PageData } from '../../UnderviserPagesManager';


// Props:
// - page: question data for input answer type
// - onAnswer: callback when answer is checked
// - disabled: disables interaction
interface Props {
  page: Extract<PageData, { type: 'inputAnswer' }>;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
}


const InputAnswerQuestion: React.FC<Props> = ({ page, onAnswer, disabled }) => {
  // State: input value
  const [value, setValue] = React.useState('');
  // State: feedback message after checking answer
  const [feedback, setFeedback] = React.useState<string | null>(null);

  // Handle check button click
  const handleCheck = () => {
    if (disabled || feedback !== null) return; // Prevent multiple checks or if disabled
    const correct = value.trim().toLowerCase() === page.answer.trim().toLowerCase();
    setFeedback(correct ? 'Correct!' : 'Incorrect');
    onAnswer(correct);
  };

  return (
    <div>
      {/* Question title */}
      <h3>{page.title}</h3>
      {/* Optional image */}
      {page.imageUrl && <img src={page.imageUrl} alt="" style={{ maxWidth: 300, marginBottom: 12 }} />}
      {/* Input field for answer */}
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled || feedback !== null}
        placeholder="Your answer..."
        style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16, marginBottom: 10 }}
      />
      {/* Check answer button */}
      <button onClick={handleCheck} disabled={disabled || feedback !== null} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', marginBottom: 8, cursor: feedback === null ? 'pointer' : 'default' }}>
        Check
      </button>
      {/* Feedback message */}
      {feedback && <div style={{ marginTop: 8, fontWeight: 600, fontSize: 16, color: feedback === 'Correct!' ? '#059669' : '#dc2626' }}>{feedback}</div>}
    </div>
  );
};

export default InputAnswerQuestion;
