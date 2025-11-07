// MultipleChoiceEditor
// --------------------
// Editor for multiple-choice question pages in the teacher/manager interface.
// Uses utility classes for consistent UI (.uv-btn, .uv-input, .uv-label, .uv-heading).
// Handles question, options, and correct answer logic.
// Last updated: 2025-10-20
import React from 'react';
import type { PageData, MultipleChoiceOption } from '../UnderviserPagesManager';

// Main editor component for multiple-choice questions
const MultipleChoiceEditor: React.FC<{
  page: Extract<PageData, { type: 'multipleChoice' }>;
  onChange: (page: PageData) => void;
}> = ({ page, onChange }) => {
  // Update a field of a specific option (text, imageUrl, correct)
  const handleOptionChange = (id: number, field: keyof MultipleChoiceOption, value: string | boolean) => {
    onChange({
      ...page,
      options: page.options.map(opt =>
        opt.id === id ? { ...opt, [field]: value } : opt
      ),
    });
  };
  // Add a new answer button option
  const handleAddOption = () => {
    const newOption: MultipleChoiceOption = {
      id: Date.now(),
      text: '',
      imageUrl: '',
      correct: false,
    };
    onChange({ ...page, options: [...page.options, newOption] });
  };
  // Remove an answer button option
  const handleRemoveOption = (id: number) => {
    onChange({ ...page, options: page.options.filter(opt => opt.id !== id) });
  };
  return (
    <div className="uv-editor">
      {/* Page title and explanation input */}
      <h2 className="uv-heading">Rediger Multiple Choice Side</h2>
      <label className="uv-label" htmlFor="mc-title">Titel/Forklaring</label>
      <input
        id="mc-title"
        className="uv-input"
        type="text"
        value={page.title}
        onChange={e => onChange({ ...page, title: e.target.value })}
        placeholder="Titel/Forklaring"
      />
      {/* Optional image for the question */}
      <label className="uv-label" htmlFor="mc-image">Billed URL eller beskrivelse</label>
      <input
        id="mc-image"
        className="uv-input"
        type="text"
        value={page.imageUrl}
        onChange={e => onChange({ ...page, imageUrl: e.target.value })}
        placeholder="Billed URL eller beskrivelse"
      />
      {/* Show image preview if imageUrl is set */}
      {page.imageUrl && <img src={page.imageUrl} alt="Preview" style={{ maxWidth: 300, display: 'block', marginTop: 8 }} />}
      {/* Section for answer buttons */}
      <h3 className="uv-label" style={{ marginTop: 24 }}>Svar Knapper</h3>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        {/* Render each answer button option */}
        {page.options.map((opt, idx) => (
          <div key={opt.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 8, minWidth: 180, background: 'var(--hover-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Button text input */}
            <label className="uv-label" htmlFor={`mc-opt-text-${opt.id}`}>{`Knap ${idx + 1} tekst`}</label>
            <input
              id={`mc-opt-text-${opt.id}`}
              className="uv-input"
              type="text"
              value={opt.text}
              onChange={e => handleOptionChange(opt.id, 'text', e.target.value)}
              placeholder={`Knap ${idx + 1} tekst`}
            />
            {/* Optional image for the button */}
            <label className="uv-label" htmlFor={`mc-opt-img-${opt.id}`}>Billed URL (valgfrit)</label>
            <input
              id={`mc-opt-img-${opt.id}`}
              className="uv-input"
              type="text"
              value={opt.imageUrl}
              onChange={e => handleOptionChange(opt.id, 'imageUrl', e.target.value)}
              placeholder="Billed URL (valgfrit)"
            />
            {/* Show button image preview if imageUrl is set */}
            {opt.imageUrl && <img src={opt.imageUrl} alt="btn" style={{ maxWidth: 80, marginBottom: 6 }} />}
            {/* Checkbox to mark as correct answer */}
            <label className="uv-label" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <input
                type="checkbox"
                checked={opt.correct}
                onChange={e => handleOptionChange(opt.id, 'correct', e.target.checked)}
                style={{ marginRight: 4 }}
              />
              Korrekt svar
            </label>
            {/* Remove button for this option */}
            <button className="uv-btn" onClick={() => handleRemoveOption(opt.id)} style={{ marginTop: 6, fontSize: 12 }}>Slet</button>
          </div>
        ))}
        {/* Add new answer button option */}
        <button className="uv-btn primary" onClick={handleAddOption} style={{ alignSelf: 'center', height: 40 }}>+ Tilføj Knap</button>
      </div>
    </div>
  );
};

export default MultipleChoiceEditor;
