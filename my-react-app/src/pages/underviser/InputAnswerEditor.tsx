import React from 'react';
import type { PageData } from '../UnderviserPagesManager';

const InputAnswerEditor: React.FC<{
  page: Extract<PageData, { type: 'inputAnswer' }>;
  onChange: (page: PageData) => void;
}> = ({ page, onChange }) => (
  <div className="uv-editor">
    <h2>Edit Input Answer Page</h2>
    <input
      type="text"
      value={page.title}
      onChange={e => onChange({ ...page, title: e.target.value })}
      placeholder="Title/Explanation"
      style={{ fontSize: '1.2rem', marginBottom: 12, width: '100%' }}
    />
    <input
      type="text"
      value={page.imageUrl}
      onChange={e => onChange({ ...page, imageUrl: e.target.value })}
      placeholder="Image URL or description"
      style={{ width: '100%', marginBottom: 12 }}
    />
    {page.imageUrl && <img src={page.imageUrl} alt="Preview" style={{ maxWidth: 300, display: 'block', marginTop: 8 }} />}
    <h3>Correct Answer</h3>
    <input
      type="text"
      value={page.answer}
      onChange={e => onChange({ ...page, answer: e.target.value })}
      placeholder="Correct answer text"
      style={{ width: '100%', marginBottom: 12 }}
    />
  </div>
);

export default InputAnswerEditor;
