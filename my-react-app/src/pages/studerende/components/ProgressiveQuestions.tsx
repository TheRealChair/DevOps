
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
  // State: feedback message (optional summary)
  const [feedback, setFeedback] = React.useState<string | null>(null);
  // Lock only when the entire sequence including final answer is correct
  const [locked, setLocked] = React.useState(false);
  
  // Helper to normalize text
  const norm = (s: string) => s.trim().toLowerCase();
  
  // Helper to check if answer matches with support for numerical intervals
  // Supports formats like "42±1" or "42+/-1" meaning 41-43 is accepted
  const isAnswerCorrect = (userAnswer: string, correctAnswer: string): boolean => {
    const userNorm = norm(userAnswer);
    const correctNorm = norm(correctAnswer);
    
    // First try exact match (for text answers)
    if (userNorm === correctNorm) return true;
    
    // Try to parse as numerical interval: "value±tolerance" or "value+/-tolerance"
    const intervalMatch = correctNorm.match(/^([+-]?\d+(?:[.,]\d+)?)\s*[±+\/-]+\s*(\d+(?:[.,]\d+)?)$/);
    if (intervalMatch) {
      const centerValue = parseFloat(intervalMatch[1].replace(',', '.'));
      const tolerance = parseFloat(intervalMatch[2].replace(',', '.'));
      const userValue = parseFloat(userNorm.replace(',', '.'));
      
      if (!isNaN(centerValue) && !isNaN(tolerance) && !isNaN(userValue)) {
        return userValue >= (centerValue - tolerance) && userValue <= (centerValue + tolerance);
      }
    }
    
    return false;
  };
  
  const isStepCorrect = (idx: number) => isAnswerCorrect(answers[idx] || '', page.questions[idx].answer || '');
  const allStepsCorrect = page.questions.every((_, i) => isStepCorrect(i));
  const finalCorrect = isAnswerCorrect(final || '', page.finalAnswer || '');

  // Auto complete when everything is correct (no need to press Tjek)
  React.useEffect(() => {
    if (!disabled && !locked && allStepsCorrect && finalCorrect) {
      setFeedback('Alle svar er korrekte!');
      setLocked(true);
      onAnswer(true);
    }
  }, [allStepsCorrect, finalCorrect, disabled, locked, onAnswer]);

  // Reset on page change
  React.useEffect(() => {
    setAnswers(Array(page.questions.length).fill(''));
    setFinal('');
    setFeedback(null);
    setLocked(false);
  }, [page]);

  // No manual check or retry needed due to inline validation

  return (
    <div>
      {/* Question title */}
      <h3>{page.title}</h3>
      {/* Optional image */}
      {page.imageUrl && <img src={page.imageUrl} alt="" style={{ maxWidth: 300, marginBottom: 12 }} />}
      {/* Render each progressive question */}
      {page.questions.map((q, idx) => {
        const prevCorrect = idx === 0 || isStepCorrect(idx - 1);
        const isDisabled = disabled || locked || !prevCorrect;
        const value = answers[idx] || '';
        const showState = value.length > 0;
        const correct = showState && isStepCorrect(idx);
        return (
          <div key={q.id} style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>{q.prompt}</div>
            <input
              className="stud-input"
              type="text"
              value={value}
              onChange={e => {
                const arr = [...answers];
                arr[idx] = e.target.value;
                setAnswers(arr);
                if (feedback) setFeedback(null); // clear summary feedback while editing
              }}
              disabled={isDisabled}
              placeholder="Svar..."
              style={{
                width: '100%',
                borderColor: showState ? (correct ? 'var(--feedback-correct-text)' : 'var(--feedback-incorrect-text)') : undefined,
                boxShadow: 'none'
              }}
            />
            {showState && (
              <div style={{ marginTop: 4, fontSize: 12, color: correct ? 'var(--feedback-correct-text)' : 'var(--feedback-incorrect-text)' }}>
                {correct ? '✔️ Rigtigt' : '✖️ Forkert'}
              </div>
            )}
          </div>
        );
      })}
      {/* Final answer input */}
      <div style={{ marginTop: 18 }}>
        <strong style={{ color: 'var(--primary)' }}>{page.finalBarLabel}:</strong>
        <input
          className="stud-input"
          type="text"
          value={final}
          onChange={e => {
            setFinal(e.target.value);
            if (feedback) setFeedback(null);
          }}
          disabled={disabled || locked || answers.length === 0 || !isStepCorrect(page.questions.length - 1)}
          placeholder="Endeligt svar..."
          style={{
            width: '100%',
            marginTop: 4,
            borderColor: final.length > 0 ? (finalCorrect ? 'var(--feedback-correct-text)' : 'var(--feedback-incorrect-text)') : undefined,
            boxShadow: 'none'
          }}
        />
        {final.length > 0 && (
          <div style={{ marginTop: 4, fontSize: 12, color: finalCorrect ? 'var(--feedback-correct-text)' : 'var(--feedback-incorrect-text)' }}>
            {finalCorrect ? '✔️ Rigtigt' : '✖️ Forkert'}
          </div>
        )}
      </div>
      {/* Check and retry buttons fjernet – validering sker løbende */}
      {/* Feedback message */}
      {feedback && (
        <div style={{ marginTop: 10, fontWeight: 600, fontSize: 16, color: feedback.includes('korrekt') ? 'var(--feedback-correct-text)' : 'var(--feedback-incorrect-text)' }}>
          {feedback}
        </div>
      )}
    </div>
  );
};

export default ProgressiveQuestions;
