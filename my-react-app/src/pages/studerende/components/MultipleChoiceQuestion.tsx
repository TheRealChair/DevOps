
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
  // Lock interaction only when the correct answer has been chosen
  const [locked, setLocked] = React.useState(false);

  // Handle option click
  const handleClick = (optId: number) => {
    if (disabled || locked) return; // Prevent when disabled or already correct
    setSelected(optId);
    const correct = page.options.find(o => o.id === optId)?.correct;
    const isCorrect = !!correct;
    setFeedback(isCorrect ? 'Korrekt!' : 'Forkert – prøv igen');
    if (isCorrect) setLocked(true);
    onAnswer(isCorrect);
  };

  return (
    <div>
      {/* Question title */}
      <h3>{page.title}</h3>
      {/* Optional image */}
      {page.imageUrl && <img src={page.imageUrl} alt="" style={{ maxWidth: 300, marginBottom: 12 }} />}
      {/* Render options as buttons (with optional image) */}
      {page.options.map(opt => {
        const isSelected = selected === opt.id;
        const isCorrect = !!opt.correct;
        const hasImage = !!opt.imageUrl;
        let optionClass = 'stud-btn-option';
        if (isSelected && isCorrect) optionClass += ' selected-correct';
        else if (isSelected && !isCorrect) optionClass += ' selected-incorrect';
        return (
          <button
            key={opt.id}
            className={optionClass}
            onClick={() => handleClick(opt.id)}
            disabled={disabled || locked}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: hasImage ? 'flex-start' : 'center',
              gap: hasImage ? 10 : 0,
              textAlign: 'center'
            }}
          >
            {hasImage && (
              <img
                src={opt.imageUrl}
                alt={opt.text || 'option image'}
                style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, flexShrink: 0, border: '1px solid var(--border)' }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <span style={{ flex: hasImage ? 1 : 'unset', width: hasImage ? 'auto' : '100%' }}>{opt.text}</span>
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
            color: feedback === 'Korrekt!'
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
