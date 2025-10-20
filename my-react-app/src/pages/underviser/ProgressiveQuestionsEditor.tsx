import React from 'react';
import type { PageData } from '../UnderviserPagesManager';

const ProgressiveQuestionsEditor: React.FC<{
  page: Extract<PageData, { type: 'progressiveQuestions' }>;
  onChange: (page: PageData) => void;
}> = ({ page, onChange }) => {
  const handleQuestionChange = (id: number, field: 'prompt' | 'answer', value: string) => {
    onChange({
      ...page,
      questions: page.questions.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    });
  };
  const handleAddQuestion = () => {
    onChange({
      ...page,
      questions: [...page.questions, { id: Date.now(), prompt: '', answer: '' }],
    });
  };
  const handleRemoveQuestion = (id: number) => {
    onChange({
      ...page,
      questions: page.questions.filter(q => q.id !== id),
    });
  };
  return (
    <div className="uv-editor">
      <h2>Edit Progressive Questions Page</h2>
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
      <h3>Questions</h3>
      {page.questions.map((q, idx) => (
        <div key={q.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 8, marginBottom: 8 }}>
          <div>Question {idx + 1}</div>
          <input
            type="text"
            value={q.prompt}
            onChange={e => handleQuestionChange(q.id, 'prompt', e.target.value)}
            placeholder="Prompt"
            style={{ width: '100%', marginBottom: 6 }}
          />
          <input
            type="text"
            value={q.answer}
            onChange={e => handleQuestionChange(q.id, 'answer', e.target.value)}
            placeholder="Correct answer"
            style={{ width: '100%', marginBottom: 6 }}
          />
          <button onClick={() => handleRemoveQuestion(q.id)} style={{ fontSize: 12 }}>Remove</button>
        </div>
      ))}
      <button onClick={handleAddQuestion} style={{ marginTop: 8 }}>+ Add Question</button>
      <h3 style={{ marginTop: 24 }}>Final Answer Bar Label</h3>
      <input
        type="text"
        value={page.finalBarLabel}
        onChange={e => onChange({ ...page, finalBarLabel: e.target.value })}
        placeholder="Final answer bar label (e.g. 'Final Code')"
        style={{ width: '100%', marginBottom: 12 }}
      />
      <h3>Final Answer</h3>
      <input
        type="text"
        value={(page as any).finalAnswer || ''}
        onChange={e => onChange({ ...page, finalAnswer: e.target.value })}
        placeholder="Final answer (e.g. 'ESCAPE')"
        style={{ width: '100%', marginBottom: 12 }}
      />
    </div>
  );
};

export default ProgressiveQuestionsEditor;
