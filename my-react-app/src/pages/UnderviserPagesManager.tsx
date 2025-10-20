

import React, { useState } from 'react';
import MultipleChoiceEditor from './underviser/MultipleChoiceEditor';
import InputAnswerEditor from './underviser/InputAnswerEditor';
import ProgressiveQuestionsEditor from './underviser/ProgressiveQuestionsEditor';
import DragAndDropEditor from './underviser/DragAndDropEditor';
import UnderviserPagesMenu from './underviser/UnderviserPagesMenu';
import './underviser/underviser.css';
export type PageType = 'multipleChoice' | 'inputAnswer' | 'progressiveQuestions' | 'dragAndDrop';
export interface DragAndDropItem {
  id: number;
  label: string;
  imageUrl?: string;
}

export interface DragAndDropPageData {
  id: number;
  type: 'dragAndDrop';
  title: string;
  imageUrl: string;
  items: DragAndDropItem[];
  correctOrder: number[]; // array of item ids in correct order
}

export interface MultipleChoiceOption {
  id: number;
  text: string;
  imageUrl: string;
  correct: boolean;
}

export interface ProgressiveQuestion {
  id: number;
  prompt: string;
  answer: string;
}

export interface ProgressiveQuestionsPageData {
  id: number;
  type: 'progressiveQuestions';
  title: string;
  imageUrl: string;
  questions: ProgressiveQuestion[];
  finalBarLabel: string;
  finalAnswer: string;
}
export type PageData =
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
    <div className="uv-root">
      {showMenu && (
        <UnderviserPagesMenu
          pages={pages}
          selectedId={selectedId}
          onSelect={id => setSelectedId(id)}
        />
      )}
      <div className="uv-main">
        <div className="uv-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="uv-btn" onClick={onBack}>Back</button>
            <button className="uv-btn" onClick={() => setShowMenu(s => !s)}>{showMenu ? 'Hide Menu' : 'Show Menu'}</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ color: '#333', fontSize: 14 }}>Template:</label>
            <select className="uv-select" value={templateType} onChange={e => setTemplateType(e.target.value as PageType)}>
              <option value="multipleChoice">Multiple Choice</option>
              <option value="inputAnswer">Input Answer</option>
              <option value="progressiveQuestions">Progressive Questions</option>
              <option value="dragAndDrop">Drag and Drop</option>
            </select>
            <button className="uv-btn primary" onClick={handleAddPage}>+ Add Page</button>
          </div>
        </div>
        <div className="uv-content">
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
            <div className="uv-empty">
              <h2>No page selected</h2>
              <p>Create a page using the controls in the top-right. You can also open the left menu to select an existing page.</p>
              <div style={{ marginTop: 12 }}>
                <button className="uv-btn primary" onClick={handleAddPage}>Create {templateType === 'multipleChoice' ? 'Multiple Choice' : templateType === 'inputAnswer' ? 'Input Answer' : templateType === 'progressiveQuestions' ? 'Progressive Questions' : 'Drag and Drop'}</button>
              </div>
              {pages.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <h3>Your pages</h3>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {pages.map(p => (
                      <div key={p.id} className="uv-page-card" onClick={() => setSelectedId(p.id)}>
                        <strong style={{ display: 'block', marginBottom: 6 }}>{(p as any).title || `Page ${p.id}`}</strong>
                        <small style={{ color: '#666' }}>{p.type}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnderviserPagesManager;
