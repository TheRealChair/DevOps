// ProgressiveQuestionsEditor
// --------------------------
// Editor for progressive question pages in the teacher/manager interface.
// Uses utility classes for consistent UI (.uv-btn, .uv-input, .uv-label, .uv-heading).
// Handles progressive gating, question steps, and answer logic.
// Last updated: 2025-10-20
import React from 'react';
import type { PageData } from '../UnderviserPagesManager';

const ProgressiveQuestionsEditor: React.FC<{
  page: Extract<PageData, { type: 'progressiveQuestions' }>;
  onChange: (page: PageData) => void;
}> = ({ page, onChange }) => {
  // Update a field of a specific question (prompt or answer)
  const handleQuestionChange = (id: number, field: 'prompt' | 'answer', value: string) => {
    onChange({
      ...page,
      questions: page.questions.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    });
  };
  // Add a new progressive question step
  const handleAddQuestion = () => {
    onChange({
      ...page,
      questions: [...page.questions, { id: Date.now(), prompt: '', answer: '' }],
    });
  };
  // Remove a progressive question step
  const handleRemoveQuestion = (id: number) => {
    onChange({
      ...page,
      questions: page.questions.filter(q => q.id !== id),
    });
  };
  return (
    <div className="uv-editor">
      {/* Page title and explanation input */}
      <h2 className="uv-heading">Rediger Progressive Spørgsmål Side</h2>
      <label className="uv-label" htmlFor="pq-title">Titel/Forklaring</label>
      <input
        id="pq-title"
        className="uv-input"
        type="text"
        value={page.title}
        onChange={e => onChange({ ...page, title: e.target.value })}
        placeholder="Titel/Forklaring"
      />
      {/* Optional image for the question */}
      <label className="uv-label" htmlFor="pq-image">Billed URL eller beskrivelse</label>
      <input
        id="pq-image"
        className="uv-input"
        type="text"
        value={page.imageUrl}
        onChange={e => onChange({ ...page, imageUrl: e.target.value })}
        placeholder="Billed URL eller beskrivelse"
      />
      {/* Show image preview if imageUrl is set */}
      {page.imageUrl && <img src={page.imageUrl} alt="Preview" style={{ maxWidth: 300, display: 'block', marginTop: 8 }} />}
      {/* Section for progressive question steps */}
      <h3 className="uv-label" style={{ marginTop: 24 }}>Spørgsmål</h3>
      {page.questions.map((q, idx) => (
  <div key={q.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 8, marginBottom: 8 }}>
          {/* Question prompt input */}
          <label className="uv-label" htmlFor={`pq-q-${q.id}-prompt`}>Spørgsmål {idx + 1} tekst</label>
          <input
            id={`pq-q-${q.id}-prompt`}
            className="uv-input"
            type="text"
            value={q.prompt}
            onChange={e => handleQuestionChange(q.id, 'prompt', e.target.value)}
            placeholder="Spørgsmål"
          />
          {/* Correct answer input for this step */}
          <label className="uv-label" htmlFor={`pq-q-${q.id}-answer`}>Korrekt svar</label>
          <input
            id={`pq-q-${q.id}-answer`}
            className="uv-input"
            type="text"
            value={q.answer}
            onChange={e => handleQuestionChange(q.id, 'answer', e.target.value)}
            placeholder="Korrekt svar"
          />
          {/* Remove button for this question step */}
          <button className="uv-btn" onClick={() => handleRemoveQuestion(q.id)} style={{ fontSize: 12 }}>Slet</button>
        </div>
      ))}
      {/* Add new progressive question step */}
      <button className="uv-btn primary" onClick={handleAddQuestion} style={{ marginTop: 8 }}>+ Tilføj Spørgsmål</button>
      {/* Final answer bar label input */}
      <label className="uv-label" htmlFor="pq-final-label" style={{ marginTop: 24 }}>Endeligt svar bånd label</label>
      <input
        id="pq-final-label"
        className="uv-input"
        type="text"
        value={page.finalBarLabel}
        onChange={e => onChange({ ...page, finalBarLabel: e.target.value })}
        placeholder="Endeligt svar bånd label (f.eks. 'Endeligt svar kode')"
      />
      {/* Final answer input */}
      <label className="uv-label" htmlFor="pq-final-answer" style={{ marginTop: 12 }}>Endeligt svar</label>
      <input
        id="pq-final-answer"
        className="uv-input"
        type="text"
        value={(page as any).finalAnswer || ''}
        onChange={e => onChange({ ...page, finalAnswer: e.target.value })}
        placeholder="Endeligt svar (f.eks. 'ESCAPE')"
      />
    </div>
  );
};

export default ProgressiveQuestionsEditor;
