
// ProgressiveQuestions: Renders a sequence of questions that must be answered in order
import React from 'react';
import type { PageData } from '../../UnderviserPagesManager';


// Props:
// - page: question data for progressive questions type
// - onAnswer: callback when all answers are checked
// - disabled: disables interaction
interface Props {
  page: Extract<PageData, { type: 'progressiveQuestions' }>;
  onAnswer: (allCorrect: boolean) => void;
  disabled?: boolean;
}


const ProgressiveQuestions: React.FC<Props> = ({ page, onAnswer, disabled }) => {
  // State: answers for each progressive question
  const [answers, setAnswers] = React.useState<string[]>(Array(page.questions.length).fill(''));
  // State: final answer input value
  const [final, setFinal] = React.useState('');
  // State: feedback message after checking answers
  const [feedback, setFeedback] = React.useState<string | null>(null);

  // Handle check button click
  const handleCheck = () => {
    if (disabled || feedback !== null) return; // Prevent multiple checks or if disabled
    let allCorrect = true;
    // Check each progressive question
    for (let i = 0; i < page.questions.length; i++) {
      if (answers[i].trim().toLowerCase() !== page.questions[i].answer.trim().toLowerCase()) {
        allCorrect = false;
        break;
      }
    }
    // Check final answer
    const finalCorrect = final.trim().toLowerCase() === page.finalAnswer.trim().toLowerCase();
    if (allCorrect && finalCorrect) setFeedback('All answers correct!');
    else if (!allCorrect) setFeedback('One or more answers are incorrect.');
    else setFeedback('Final answer is incorrect.');
    onAnswer(allCorrect && finalCorrect);
  };

  return (
    <div>
      {/* Question title */}
      <h3>{page.title}</h3>
      {/* Optional image */}
      {page.imageUrl && <img src={page.imageUrl} alt="" style={{ maxWidth: 300, marginBottom: 12 }} />}
      {/* Render each progressive question */}
      {page.questions.map((q, idx) => {
        // Only enable if previous answer is correct
        const prevCorrect = idx === 0 || answers[idx - 1]?.trim().toLowerCase() === page.questions[idx - 1].answer.trim().toLowerCase();
        const isDisabled = disabled || feedback !== null || !prevCorrect;
        return (
          <div key={q.id} style={{ marginBottom: 14 }}>
            {/* Question prompt */}
            <div style={{ fontWeight: 500, color: '#374151', marginBottom: 4 }}>{q.prompt}</div>
            {/* Input field for answer */}
            <input
              type="text"
              value={answers[idx] || ''}
              onChange={e => {
                const arr = [...answers];
                arr[idx] = e.target.value;
                setAnswers(arr);
              }}
              disabled={isDisabled}
              placeholder="Answer..."
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16, background: isDisabled ? '#f3f4f6' : undefined }}
            />
          </div>
        );
      })}
      {/* Final answer input */}
      <div style={{ marginTop: 18 }}>
        <strong style={{ color: '#6366f1' }}>{page.finalBarLabel}:</strong>
        <input
          type="text"
          value={final}
          onChange={e => setFinal(e.target.value)}
          disabled={disabled || feedback !== null || answers.length === 0 || answers[answers.length - 1]?.trim().toLowerCase() !== page.questions[page.questions.length - 1].answer.trim().toLowerCase()}
          placeholder="Final answer..."
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16, marginTop: 4, background: (answers.length === 0 || answers[answers.length - 1]?.trim().toLowerCase() !== page.questions[page.questions.length - 1].answer.trim().toLowerCase()) ? '#f3f4f6' : undefined }}
        />
      </div>
      {/* Check answers button */}
      <button onClick={handleCheck} disabled={disabled || feedback !== null} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', marginTop: 16, cursor: feedback === null ? 'pointer' : 'default' }}>
        Check
      </button>
      {/* Feedback message */}
      {feedback && <div style={{ marginTop: 10, fontWeight: 600, fontSize: 16, color: feedback === 'All answers correct!' ? '#059669' : '#dc2626' }}>{feedback}</div>}
    </div>
  );
};

export default ProgressiveQuestions;
