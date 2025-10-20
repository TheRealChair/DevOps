
// MultipleChoiceQuestion: Renders a multiple choice question for students
import React from 'react';
import type { PageData } from '../../UnderviserPagesManager';


// Props:
// - page: question data for multiple choice type
// - onAnswer: callback when answer is checked
// - disabled: disables interaction
interface Props {
  page: Extract<PageData, { type: 'multipleChoice' }>;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
}


const MultipleChoiceQuestion: React.FC<Props> = ({ page, onAnswer, disabled }) => {
  // State: selected option id
  const [selected, setSelected] = React.useState<number | null>(null);
  // State: feedback message after checking answer
  const [feedback, setFeedback] = React.useState<string | null>(null);

  // Handle option click
  const handleClick = (optId: number) => {
    if (disabled || selected !== null) return; // Prevent multiple answers or if disabled
    setSelected(optId);
    const correct = page.options.find(o => o.id === optId)?.correct;
    setFeedback(correct ? 'Correct!' : 'Incorrect');
    onAnswer(!!correct);
  };

  return (
    <div>
      {/* Question title */}
      <h3>{page.title}</h3>
      {/* Optional image */}
      {page.imageUrl && <img src={page.imageUrl} alt="" style={{ maxWidth: 300, marginBottom: 12 }} />}
      {/* Render options as buttons */}
      {page.options.map(opt => (
        <button
          key={opt.id}
          onClick={() => handleClick(opt.id)}
          disabled={disabled || selected !== null}
          style={{
            display: 'block',
            margin: '10px 0',
            padding: '14px 0',
            width: '100%',
            borderRadius: 10,
            border: '1px solid #e2e8f0',
            background: selected === opt.id ? (opt.correct ? '#d1fae5' : '#fee2e2') : '#f7fafc',
            color: '#2d3748',
            fontWeight: 500,
            fontSize: 16,
            cursor: selected === null ? 'pointer' : 'default',
            transition: 'background 0.2s',
          }}
        >
          {opt.text}
        </button>
      ))}
      {/* Feedback message */}
      {feedback && <div style={{ marginTop: 16, fontWeight: 600, fontSize: 16, color: feedback === 'Correct!' ? '#059669' : '#dc2626' }}>{feedback}</div>}
    </div>
  );
};

export default MultipleChoiceQuestion;
