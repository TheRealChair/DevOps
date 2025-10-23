
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
  setFeedback(correct ? 'Korrekt!' : 'Forkert');
    onAnswer(!!correct);
  };

  return (
    <div>
      {/* Question title */}
      <h3>{page.title}</h3>
      {/* Optional image */}
      {page.imageUrl && <img src={page.imageUrl} alt="" style={{ maxWidth: 300, marginBottom: 12 }} />}
      {/* Render options as buttons */}
      {page.options.map(opt => {
        const isSelected = selected === opt.id;
        const isCorrect = !!opt.correct;
        let optionClass = 'stud-btn-option';
        if (isSelected && isCorrect) optionClass += ' selected-correct';
        else if (isSelected && !isCorrect) optionClass += ' selected-incorrect';
        return (
          <button
            key={opt.id}
            className={optionClass}
            onClick={() => handleClick(opt.id)}
            disabled={disabled || selected !== null}
          >
            {opt.text}
          </button>
        );
      })}
      {/* Feedback message */}
      {feedback && (
        <div
          style={{
            marginTop: 16,
            fontWeight: 600,
            fontSize: 16,
            color: feedback === 'Correct!'
              ? 'var(--feedback-correct-text)'
              : 'var(--feedback-incorrect-text)'
          }}
        >
          {feedback}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;
