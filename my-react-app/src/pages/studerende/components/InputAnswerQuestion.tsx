
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
  // Lock interaction only when the correct answer has been provided
  const [locked, setLocked] = React.useState(false);
  // Cooldown state: timestamp when cooldown ends, or null if no cooldown active
  const [cooldownUntil, setCooldownUntil] = React.useState<number | null>(null);
  // Cooldown timer state for display
  const [cooldownSeconds, setCooldownSeconds] = React.useState(0);
  
  // Cooldown duration in seconds (can be adjusted by teacher later)
  const COOLDOWN_DURATION = 15;

  // Handle check button click
  const handleCheck = () => {
    if (disabled || locked || cooldownUntil !== null) return; // Prevent during cooldown
    const correct = value.trim().toLowerCase() === page.answer.trim().toLowerCase();
    setFeedback(correct ? 'Korrekt!' : 'Forkert – prøv igen');
    
    if (correct) {
      setLocked(true);
    } else {
      // Start cooldown on wrong answer
      const cooldownEnd = Date.now() + (COOLDOWN_DURATION * 1000);
      setCooldownUntil(cooldownEnd);
      setCooldownSeconds(COOLDOWN_DURATION);
    }
    
    onAnswer(correct);
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
      {/* Input field for answer */}
      <input
        className="stud-input"
        type="text"
        value={value}
        onChange={e => {
          setValue(e.target.value);
          if (!locked && feedback) setFeedback(null); // clear feedback while retrying
        }}
        disabled={disabled || locked}
  placeholder="Dit svar..."
        style={{ width: '100%', marginBottom: 10 }}
      />
      {/* Check answer button */}
      <button className="stud-btn" onClick={handleCheck} disabled={disabled || locked || cooldownUntil !== null} style={{ width: '100%', marginBottom: 8 }}>
        Tjek
      </button>
  {/* Feedback message */}
  {feedback && (
    <div style={{ marginTop: 8, fontWeight: 600, fontSize: 16, color: feedback === 'Korrekt!' ? 'var(--feedback-correct-text)' : 'var(--feedback-incorrect-text)' }}>
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

export default InputAnswerQuestion;
