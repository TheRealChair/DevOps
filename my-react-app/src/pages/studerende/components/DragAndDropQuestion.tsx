
// DragAndDropQuestion: Renders a drag-and-drop ordering question for students
import React from 'react';
import type { PageData } from '../../UnderviserPagesManager';


// Props:
// - page: question data for drag-and-drop type
// - onAnswer: callback when answer is checked
// - disabled: disables interaction
interface Props {
  page: Extract<PageData, { type: 'dragAndDrop' }>;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
}


const DragAndDropQuestion: React.FC<Props> = ({ page, onAnswer, disabled }) => {
  // State: current order of items (shuffled at start)
  const [order, setOrder] = React.useState<number[]>([...page.correctOrder].sort(() => Math.random() - 0.5));
  // State: feedback message after checking answer
  const [feedback, setFeedback] = React.useState<string | null>(null);

  // Reset order and feedback when page changes
  React.useEffect(() => {
    setOrder([...page.correctOrder].sort(() => Math.random() - 0.5));
    setFeedback(null);
  }, [page]);

  // Move item up or down in the order
  const handleMove = (idx: number, dir: 'up' | 'down') => {
    if (disabled || feedback !== null) return; // Prevent moves if disabled or after answer
    const arr = [...order];
    if (dir === 'up' && idx > 0) {
      // Swap with previous item
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    } else if (dir === 'down' && idx < arr.length - 1) {
      // Swap with next item
      [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
    }
    setOrder(arr);
  };

  // Check if current order matches correct order
  const handleCheck = () => {
    if (disabled || feedback !== null) return; // Prevent multiple checks
    const correct = page.correctOrder.every((id: number, idx: number) => order[idx] === id);
    setFeedback(correct ? 'Correct order!' : 'Incorrect order.');
    onAnswer(correct);
  };

  return (
    <div>
      {/* Question title */}
      <h3>{page.title}</h3>
      {/* Optional image */}
      {page.imageUrl && <img src={page.imageUrl} alt="" style={{ maxWidth: 300, marginBottom: 12 }} />}
      {/* Instructions */}
  <div style={{ marginBottom: 16, color: 'var(--primary)', fontWeight: 600, fontSize: 16 }}>
        Arrange the items in the correct order:
      </div>
      {/* List of draggable items */}
      <ol style={{ padding: 0, listStyle: 'none', width: '100%' }}>
        {order.map((itemId, idx) => {
          const item = page.items.find(i => i.id === itemId); // Find item data by id
          if (!item) return null;
          return (
            <li
              key={itemId}
              style={{ marginBottom: 10, border: '1px solid var(--border)', borderRadius: 8, padding: 10, display: 'flex', alignItems: 'center', background: 'var(--hover-bg)' }}
            >
              {/* Item position number */}
              <span style={{ fontWeight: 600, marginRight: 12, color: 'var(--primary)' }}>#{idx + 1}</span>
              {/* Item label */}
              <span style={{ flex: 1 }}>{item.label}</span>
              {/* Move up button */}
              <button
                className="arrow-btn"
                onClick={() => handleMove(idx, 'up')}
                disabled={idx === 0 || feedback !== null}
                style={{ marginLeft: 8 }}
              >
                ↑
              </button>
              {/* Move down button */}
              <button
                className="arrow-btn"
                onClick={() => handleMove(idx, 'down')}
                disabled={idx === order.length - 1 || feedback !== null}
                style={{ marginLeft: 4 }}
              >
                ↓
              </button>
            </li>
          );
        })}
      </ol>
      {/* Check answer button */}
      <button
        onClick={handleCheck}
        disabled={disabled || feedback !== null}
  style={{ width: '100%', padding: 12, borderRadius: 8, background: 'var(--primary)', color: 'var(--button-text)', fontWeight: 600, fontSize: 16, border: 'none', marginTop: 12, cursor: feedback === null ? 'pointer' : 'default' }}
      >
        Check
      </button>
      {/* Feedback message */}
      {feedback && (
        <div
          style={{ marginTop: 10, fontWeight: 600, fontSize: 16, color: feedback === 'Correct order!' ? 'var(--feedback-correct-text)' : 'var(--feedback-incorrect-text)' }}
        >
          {feedback}
        </div>
      )}
    </div>
  );
};


// Export component
export default DragAndDropQuestion;
