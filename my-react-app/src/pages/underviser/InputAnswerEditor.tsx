// InputAnswerEditor
// -----------------
// Editor for input-answer question pages in the teacher/manager interface.
// Uses utility classes for consistent UI (.uv-btn, .uv-input, .uv-label, .uv-heading).
// Handles question, answer input, and validation logic.
// Last updated: 2025-10-20
import React from 'react';
import type { PageData } from '../UnderviserPagesManager';

const InputAnswerEditor: React.FC<{
  page: Extract<PageData, { type: 'inputAnswer' }>;
  onChange: (page: PageData) => void;
}> = ({ page, onChange }) => (
  <div className="uv-editor">
    {/* Page title and explanation input */}
    <h2 className="uv-heading">Rediger Input Svar Side</h2>
    <label className="uv-label" htmlFor="ia-title">Titel/Forklaring</label>
    <input
      id="ia-title"
      className="uv-input"
      type="text"
      value={page.title}
      onChange={e => onChange({ ...page, title: e.target.value })}
      placeholder="Titel/Forklaring"
    />
    {/* Optional image for the question */}
    <label className="uv-label" htmlFor="ia-image">Billed URL eller beskrivelse</label>
    <input
      id="ia-image"
      className="uv-input"
      type="text"
      value={page.imageUrl}
      onChange={e => onChange({ ...page, imageUrl: e.target.value })}
      placeholder="Billed URL eller beskrivelse"
    />
    {/* Show image preview if imageUrl is set */}
    {page.imageUrl && <img src={page.imageUrl} alt="Preview" style={{ maxWidth: 300, display: 'block', marginTop: 8 }} />}
    {/* Correct answer input */}
    <label className="uv-label" htmlFor="ia-answer" style={{ marginTop: 24 }}>Korrekt Svar</label>
    <input
      id="ia-answer"
      className="uv-input"
      type="text"
      value={page.answer}
      onChange={e => onChange({ ...page, answer: e.target.value })}
      placeholder="Korrekt svar tekst"
    />
  </div>
);

export default InputAnswerEditor;
