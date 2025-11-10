
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
  // Lock only when the order is correct
  const [locked, setLocked] = React.useState(false);
  // Drag state
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  // Reset order and feedback when page changes
  React.useEffect(() => {
    setOrder([...page.correctOrder].sort(() => Math.random() - 0.5));
    setFeedback(null);
    setLocked(false);
  }, [page]);

  // Move item up or down in the order
  const handleMove = (idx: number, dir: 'op' | 'ned') => {
  if (disabled || locked) return; // Prevent moves if disabled or after correct answer
    const arr = [...order];
    if (dir === 'op' && idx > 0) {
      // Swap with previous item
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    } else if (dir === 'ned' && idx < arr.length - 1) {
      // Swap with next item
      [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
    }
    setOrder(arr);
  };

  // Check if current order matches correct order
  const handleCheck = () => {
    if (disabled || locked) return; // Prevent multiple checks when already correct
    const correct = page.correctOrder.every((id: number, idx: number) => order[idx] === id);
    setFeedback(correct ? 'Korrekt rækkefølge!' : 'Forkert rækkefølge – prøv igen.');
    if (correct) setLocked(true);
    onAnswer(correct);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (disabled || locked) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newOrder = [...order];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, removed);
    setOrder(newOrder);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
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
      {/* List of draggable items with optional item images */}
      <ol style={{ padding: 0, listStyle: 'none', width: '100%' }}>
        {order.map((itemId, idx) => {
          const item = page.items.find(i => i.id === itemId); // Find item data by id
          if (!item) return null;
          const isDragging = draggedIndex === idx;
          const isDragOver = dragOverIndex === idx;
          return (
            <li
              key={itemId}
              draggable={!disabled && !locked}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              style={{
                marginBottom: 10,
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: isDragOver ? 'var(--primary)' : 'var(--hover-bg)',
                opacity: isDragging ? 0.5 : 1,
                cursor: (!disabled && !locked) ? 'grab' : 'default',
                transition: 'background 0.2s, opacity 0.2s',
                userSelect: 'none'
              }}
            >
              {/* Item position number */}
              <span style={{ fontWeight: 600, marginRight: 12, color: 'var(--primary)' }}>#{idx + 1}</span>
              {/* Item optional image */}
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.label || 'item'}
                  style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              {/* Item label */}
              <span style={{ flex: 1 }}>{item.label}</span>
              {/* Move up button */}
              <button
                className="arrow-btn"
                onClick={() => handleMove(idx, 'op')}
                disabled={idx === 0 || locked}
                style={{ marginLeft: 8 }}
              >
                ↑
              </button>
              {/* Move down button */}
              <button
                className="arrow-btn"
                onClick={() => handleMove(idx, 'ned')}
                disabled={idx === order.length - 1 || locked}
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
        className="stud-btn"
        onClick={handleCheck}
        disabled={disabled || locked}
        style={{ width: '100%', marginTop: 12 }}
      >
        Check
      </button>
      {/* Feedback message */}
      {feedback && (
        <div
          style={{ marginTop: 10, fontWeight: 600, fontSize: 16, color: feedback === 'Korrekt rækkefølge!' ? 'var(--feedback-correct-text)' : 'var(--feedback-incorrect-text)' }}
        >
          {feedback}
        </div>
      )}
    </div>
  );
};


// Export component
export default DragAndDropQuestion;
