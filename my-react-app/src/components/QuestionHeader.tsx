import React from 'react';

type QuestionHeaderProps = {
  title: string;
  type: string;
  current: number; // 0-based index
  total: number;
  elapsedSec?: number;
  preview?: boolean;
};

const friendlyType = (t: string) => {
  switch (t) {
    case 'multipleChoice': return 'Multiple Choice';
    case 'inputAnswer': return 'Input Svar';
    case 'progressiveQuestions': return 'Progressive Spørgsmål';
    case 'dragAndDrop': return 'Drag & Drop';
    default: return t;
  }
};

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({ title, type, current, total, elapsedSec = 0, preview }) => {
  const minutes = Math.floor(elapsedSec / 60);
  const seconds = elapsedSec % 60;
  const pct = total > 0 ? Math.min(100, Math.max(0, Math.round(((current + 1) / total) * 100))) : 0;

  return (
    <div style={{ width: '100%' }}>
      {/* Progress bar */}
      <div style={{ position: 'relative', width: '100%', height: 8, background: 'var(--hover-bg)', borderRadius: 999, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary)', transition: 'width 180ms ease' }} />
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
        <span style={{ padding: '2px 8px', borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 12 }}>
          {friendlyType(type)}
        </span>
        <span style={{ padding: '2px 8px', borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 12 }}>
          {current + 1}/{total}
        </span>
        <span style={{ padding: '2px 8px', borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--primary)' }}>
          Tid: {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default QuestionHeader;
