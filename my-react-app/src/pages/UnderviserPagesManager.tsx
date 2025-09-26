
import React, { useState } from 'react';


type PageType = 'multipleChoice' | 'inputAnswer';

interface MultipleChoiceOption {
  id: number;
  text: string;
  imageUrl: string;
  correct: boolean;
}


interface InputAnswerPageData {
  id: number;
  type: 'inputAnswer';
  title: string;
  imageUrl: string;
  answer: string;
}

type PageData =
  | ({ type: 'multipleChoice' } & {
      id: number;
      title: string;
      imageUrl: string;
      options: MultipleChoiceOption[];
    })
  | InputAnswerPageData;


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
    } else {
      newPage = {
        id: Date.now(),
        type: 'inputAnswer',
        title: '',
        imageUrl: '',
        answer: '',
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
        </select>
        <button onClick={handleAddPage} style={{ marginLeft: 8, marginBottom: 16 }}>Add Page</button>
        <button onClick={() => setShowMenu(true)} style={{ marginLeft: 8, marginBottom: 16 }}>Show Menu</button>
        {selectedPage ? (
          selectedPage.type === 'multipleChoice' ? (
            <MultipleChoiceEditor page={selectedPage} onChange={handleChange} />
          ) : (
            <InputAnswerEditor page={selectedPage} onChange={handleChange} />
          )
        ) : (
          <p>Select or add a page to edit.</p>
        )}
      </div>
    </div>
  );
};

export default UnderviserPagesManager;
