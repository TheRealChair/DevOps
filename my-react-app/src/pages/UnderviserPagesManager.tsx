

const DragAndDropEditor: React.FC<{
  page: Extract<PageData, { type: 'dragAndDrop' }>;
  onChange: (page: PageData) => void;
}> = ({ page, onChange }) => {
  const handleItemChange = (id: number, field: keyof DragAndDropItem, value: string) => {
    onChange({
      ...page,
      items: page.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };
  const handleAddItem = () => {
    const newItem: DragAndDropItem = {
      id: Date.now(),
      label: '',
      imageUrl: '',
    };
    onChange({ ...page, items: [...page.items, newItem], correctOrder: [...page.correctOrder, newItem.id] });
  };
  const handleRemoveItem = (id: number) => {
    onChange({
      ...page,
      items: page.items.filter(item => item.id !== id),
      correctOrder: page.correctOrder.filter(itemId => itemId !== id),
    });
  };
  const handleOrderChange = (idx: number, direction: 'up' | 'down') => {
    const currentOrder = [...page.correctOrder];
    if (direction === 'up' && idx > 0) {
      [currentOrder[idx - 1], currentOrder[idx]] = [currentOrder[idx], currentOrder[idx - 1]];
    } else if (direction === 'down' && idx < currentOrder.length - 1) {
      [currentOrder[idx + 1], currentOrder[idx]] = [currentOrder[idx], currentOrder[idx + 1]];
    }
    onChange({ ...page, correctOrder: currentOrder });
  };
  return (
    <div style={{ marginLeft: 260, padding: 32, width: '100%' }}>
      <h2>Edit Drag and Drop Page</h2>
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
      <h3>Draggable Items</h3>
      {page.items.map((item, idx) => (
        <div key={item.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 8, marginBottom: 8 }}>
          <div>Item {idx + 1}</div>
          <input
            type="text"
            value={item.label}
            onChange={e => handleItemChange(item.id, 'label', e.target.value)}
            placeholder="Item label"
            style={{ width: '100%', marginBottom: 6 }}
          />
          <input
            type="text"
            value={item.imageUrl || ''}
            onChange={e => handleItemChange(item.id, 'imageUrl', e.target.value)}
            placeholder="Image URL (optional)"
            style={{ width: '100%', marginBottom: 6 }}
          />
          {item.imageUrl && <img src={item.imageUrl} alt="item" style={{ maxWidth: 80, marginBottom: 6 }} />}
          <button onClick={() => handleRemoveItem(item.id)} style={{ fontSize: 12 }}>Remove</button>
        </div>
      ))}
      <button onClick={handleAddItem} style={{ marginTop: 8 }}>+ Add Item</button>
      <h3 style={{ marginTop: 24 }}>Correct Order</h3>
      <div style={{ marginBottom: 8, color: '#555', fontSize: '1rem' }}>
        <strong>Set the correct order for the answer below.</strong><br />
        This is the order students must arrange the items to solve the question. Use the arrows to move items up or down.
      </div>
      <ol style={{ padding: 0, listStyle: 'none' }}>
        {page.correctOrder.map((itemId, idx) => {
          const item = page.items.find(i => i.id === itemId);
          if (!item) return null;
          return (
            <li key={itemId} style={{ marginBottom: 4, background: 'inherit', border: '1px solid #bbb', borderRadius: 6, padding: 8, display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, marginRight: 8 }}>#{idx + 1}</span>
              {item.label || 'Item'}
              <button onClick={() => handleOrderChange(idx, 'up')} disabled={idx === 0} style={{ marginLeft: 8 }}>↑</button>
              <button onClick={() => handleOrderChange(idx, 'down')} disabled={idx === page.correctOrder.length - 1} style={{ marginLeft: 4 }}>↓</button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

import React, { useState } from 'react';


type PageType = 'multipleChoice' | 'inputAnswer' | 'progressiveQuestions' | 'dragAndDrop';
interface DragAndDropItem {
  id: number;
  label: string;
  imageUrl?: string;
}

interface DragAndDropPageData {
  id: number;
  type: 'dragAndDrop';
  title: string;
  imageUrl: string;
  items: DragAndDropItem[];
  correctOrder: number[]; // array of item ids in correct order
}

interface MultipleChoiceOption {
  id: number;
  text: string;
  imageUrl: string;
  correct: boolean;
}



interface ProgressiveQuestion {
  id: number;
  prompt: string;
  answer: string;
}

interface ProgressiveQuestionsPageData {
  id: number;
  type: 'progressiveQuestions';
  title: string;
  imageUrl: string;
  questions: ProgressiveQuestion[];
  finalBarLabel: string;
  finalAnswer: string;
}
type PageData =
  | {
      id: number;
      type: 'multipleChoice';
      title: string;
      imageUrl: string;
      options: MultipleChoiceOption[];
    }
  | {
      id: number;
      type: 'inputAnswer';
      title: string;
      imageUrl: string;
      answer: string;
    }
  | ProgressiveQuestionsPageData
  | DragAndDropPageData;
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
    <div style={{ marginLeft: 260, padding: 32, width: '100%' }}>
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


const UnderviserPagesMenu: React.FC<{
  pages: PageData[];
  onSelect: (id: number) => void;
  onClose: () => void;
}> = ({ pages, onSelect, onClose }) => (
  <div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 250, background: '#f0f0f0', boxShadow: '2px 0 8px rgba(0,0,0,0.1)', padding: 16, zIndex: 100 }}>
    <h3>Pages</h3>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {pages.map(page => (
        <li key={page.id} style={{ margin: '8px 0' }}>
          <button onClick={() => onSelect(page.id)} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left' }}>{page.title || `Page ${page.id}`}</button>
        </li>
      ))}
    </ul>
    <button onClick={onClose} style={{ marginTop: 16 }}>Close</button>
  </div>
);



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
    <div style={{ marginLeft: 260, padding: 32, width: '100%' }}>
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

const InputAnswerEditor: React.FC<{
  page: Extract<PageData, { type: 'inputAnswer' }>;
  onChange: (page: PageData) => void;
}> = ({ page, onChange }) => (
  <div style={{ marginLeft: 260, padding: 32, width: '100%' }}>
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

const UnderviserPagesManager: React.FC<{ onBack: () => void }> = ({ onBack }) => {

  const [pages, setPages] = useState<PageData[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(true);

  const [templateType, setTemplateType] = useState<PageType>('multipleChoice');

  const handleAddPage = () => {
    let newPage: PageData;
    if (templateType === 'multipleChoice') {
      newPage = {
        id: Date.now(),
        type: 'multipleChoice',
        title: '',
        imageUrl: '',
        options: [],
      };
    } else if (templateType === 'inputAnswer') {
      newPage = {
        id: Date.now(),
        type: 'inputAnswer',
        title: '',
        imageUrl: '',
        answer: '',
      };
    } else if (templateType === 'progressiveQuestions') {
      newPage = {
        id: Date.now(),
        type: 'progressiveQuestions',
        title: '',
        imageUrl: '',
        questions: [{ id: Date.now(), prompt: '', answer: '' }],
        finalBarLabel: '',
        finalAnswer: '',
      };
    } else {
      newPage = {
        id: Date.now(),
        type: 'dragAndDrop',
        title: '',
        imageUrl: '',
        items: [],
        correctOrder: [],
      };
    }
    setPages(p => [...p, newPage]);
    setSelectedId(newPage.id);
  };

  const handleChange = (page: PageData) => {
    setPages(pages => pages.map(p => (p.id === page.id ? page : p)));
  };

  const selectedPage = pages.find(p => p.id === selectedId) || null;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {showMenu && (
        <UnderviserPagesMenu
          pages={pages}
          onSelect={id => setSelectedId(id)}
          onClose={() => setShowMenu(false)}
        />
      )}
      <div style={{ flex: 1, marginLeft: showMenu ? 260 : 0, padding: 32 }}>
        <button onClick={onBack} style={{ marginBottom: 16 }}>Back</button>
        <select value={templateType} onChange={e => setTemplateType(e.target.value as PageType)} style={{ marginLeft: 8, marginBottom: 16 }}>
          <option value="multipleChoice">Multiple Choice</option>
          <option value="inputAnswer">Input Answer</option>
          <option value="progressiveQuestions">Progressive Questions</option>
          <option value="dragAndDrop">Drag and Drop</option>
        </select>
        <button onClick={handleAddPage} style={{ marginLeft: 8, marginBottom: 16 }}>Add Page</button>
        <button onClick={() => setShowMenu(true)} style={{ marginLeft: 8, marginBottom: 16 }}>Show Menu</button>
        {selectedPage ? (
          selectedPage.type === 'multipleChoice' ? (
            <MultipleChoiceEditor page={selectedPage} onChange={handleChange} />
          ) : selectedPage.type === 'inputAnswer' ? (
            <InputAnswerEditor page={selectedPage} onChange={handleChange} />
          ) : selectedPage.type === 'progressiveQuestions' ? (
            <ProgressiveQuestionsEditor page={selectedPage} onChange={handleChange} />
          ) : selectedPage.type === 'dragAndDrop' ? (
            <DragAndDropEditor page={selectedPage} onChange={handleChange} />
          ) : null
        ) : (
          <p>Select or add a page to edit.</p>
        )}
      </div>
    </div>
  );
};

export default UnderviserPagesManager;
