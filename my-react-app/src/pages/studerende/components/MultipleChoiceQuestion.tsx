
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
  // Cooldown state: timestamp when cooldown ends, or null if no cooldown active
  const [cooldownUntil, setCooldownUntil] = React.useState<number | null>(null);
  // Cooldown timer state for display
  const [cooldownSeconds, setCooldownSeconds] = React.useState(0);
  
  // Cooldown duration in seconds (can be adjusted by teacher later)
  const COOLDOWN_DURATION = 15;

  // Handle option click
  const handleClick = (optId: number) => {
    if (disabled || locked || cooldownUntil !== null) return; // Prevent during cooldown
    setSelected(optId);
    const correct = page.options.find(o => o.id === optId)?.correct;
    const isCorrect = !!correct;
    setFeedback(isCorrect ? 'Korrekt!' : 'Forkert – prøv igen');
    
    if (isCorrect) {
      setLocked(true);
    } else {
      // Start cooldown on wrong answer
      const cooldownEnd = Date.now() + (COOLDOWN_DURATION * 1000);
      setCooldownUntil(cooldownEnd);
      setCooldownSeconds(COOLDOWN_DURATION);
    }
    
    onAnswer(isCorrect);
  };
  
  // Cooldown timer effect
  React.useEffect(() => {
    if (cooldownUntil === null) return;
    
    const interval = setInterval(() => {
      const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setCooldownUntil(null);
        setCooldownSeconds(0);
        setFeedback(null); // Clear feedback when cooldown ends
      } else {
        setCooldownSeconds(remaining);
      }
    }, 100); // Check every 100ms for smooth countdown
    
    return () => clearInterval(interval);
  }, [cooldownUntil]);

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
          {cooldownUntil !== null && (
            <div style={{ marginTop: 8, fontSize: 14 }}>
              Vent {cooldownSeconds} sekunder før næste forsøg...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;
