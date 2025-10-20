import React from 'react';
import type { PageData, MultipleChoiceOption } from '../UnderviserPagesManager';

const MultipleChoiceEditor: React.FC<{
  page: Extract<PageData, { type: 'multipleChoice' }>;
  onChange: (page: PageData) => void;
}> = ({ page, onChange }) => {
  const handleOptionChange = (id: number, field: keyof MultipleChoiceOption, value: string | boolean) => {
    onChange({
      ...page,
      options: page.options.map(opt =>
        opt.id === id ? { ...opt, [field]: value } : opt
      ),
    });
  };
  const handleAddOption = () => {
    const newOption: MultipleChoiceOption = {
      id: Date.now(),
      text: '',
      imageUrl: '',
      correct: false,
    };
    onChange({ ...page, options: [...page.options, newOption] });
  };
  const handleRemoveOption = (id: number) => {
    onChange({ ...page, options: page.options.filter(opt => opt.id !== id) });
  };
  return (
    <div className="uv-editor">
      <h2>Edit Multiple Choice Page</h2>
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
      <h3>Answer Buttons</h3>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        {page.options.map((opt, idx) => (
          <div key={opt.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 8, minWidth: 180, background: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
              type="text"
              value={opt.text}
              onChange={e => handleOptionChange(opt.id, 'text', e.target.value)}
              placeholder={`Button ${idx + 1} text`}
              style={{ marginBottom: 6, width: '90%' }}
            />
            <input
              type="text"
              value={opt.imageUrl}
              onChange={e => handleOptionChange(opt.id, 'imageUrl', e.target.value)}
              placeholder="Image URL (optional)"
              style={{ marginBottom: 6, width: '90%' }}
            />
            {opt.imageUrl && <img src={opt.imageUrl} alt="btn" style={{ maxWidth: 80, marginBottom: 6 }} />}
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                type="checkbox"
                checked={opt.correct}
                onChange={e => handleOptionChange(opt.id, 'correct', e.target.checked)}
              />
              Correct answer
            </label>
            <button onClick={() => handleRemoveOption(opt.id)} style={{ marginTop: 6, fontSize: 12 }}>Remove</button>
          </div>
        ))}
        <button onClick={handleAddOption} style={{ alignSelf: 'center', height: 40 }}>+ Add Button</button>
      </div>
    </div>
  );
};

export default MultipleChoiceEditor;
