

import React, { useState, useEffect } from 'react';
import MultipleChoiceEditor from './underviser/MultipleChoiceEditor';
import InputAnswerEditor from './underviser/InputAnswerEditor';
import ProgressiveQuestionsEditor from './underviser/ProgressiveQuestionsEditor';
import DragAndDropEditor from './underviser/DragAndDropEditor';
import UnderviserPagesMenu from './underviser/UnderviserPagesMenu';
import '../design/colors.css';
import './underviser/underviser.css';
import '../design/components.css';
import { db } from '../services/firebase';
import { addDoc, collection, getDocs, serverTimestamp, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
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

export type UnderviserPagesManagerProps = { onBack: () => void; initialPages?: PageData[] };

const UnderviserPagesManager: React.FC<UnderviserPagesManagerProps> = ({ onBack, initialPages = [] }) => {

  const [pages, setPages] = useState<PageData[]>(initialPages);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { user } = useAuth();
  const [myRooms, setMyRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!user) {
        setMyRooms([]);
        return;
      }
      setLoadingRooms(true);
      try {
        const q = query(collection(db, 'EscapeRooms'), where('ownerId', '==', user.uid));
        const snap = await getDocs(q);
        setMyRooms(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setMyRooms([]);
      }
      setLoadingRooms(false);
    };
    fetchRooms();
  }, [user]);

  // Debug: log whenever selectedId changes
  React.useEffect(() => {
    console.log('Selected page id changed:', selectedId);
  }, [selectedId]);

  // Debug: log whenever pages change
  React.useEffect(() => {
    console.log('Pages array:', pages);
  }, [pages]);
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
      {user && (
        <div style={{background:'#f1f5f9',borderRadius:8,padding:16,marginBottom:18}}>
          <h3>Your Saved Escape Rooms</h3>
          {loadingRooms ? (<div>Loading rooms...</div>) : myRooms.length === 0 ? (<div>No rooms yet.</div>) : (
            <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
              {myRooms.map(r => (
                <div key={r.id} style={{border:'1px solid #aaa',borderRadius:8,padding:12,minWidth:240}}>
                  <div><strong>{r.name || 'Untitled Room'}</strong></div>
                  <div style={{fontSize:13}}>Room code: {r.roomCode}</div>
                  <div style={{fontSize:13}}>{r.pages?.length} pages</div>
                  <button
                    className="uv-btn"
                    style={{marginTop:6,padding:'4px 16px'}}
                    onClick={()=>{
                      setPages(r.pages || []);
                    }}>
                    Edit/Continue
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
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
            <label style={{ color: 'var(--text)', fontSize: 14 }}>Template:</label>
            <select className="uv-input" value={templateType} onChange={e => setTemplateType(e.target.value as PageType)}>
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
            <>
              <div style={{ display: 'flex', width: '100%', marginBottom: 16 }}>
                <div style={{ flex: 1 }} />
                <button
                  className="uv-btn"
                  style={{ background: 'var(--feedback-incorrect-bg)', color: 'var(--feedback-incorrect-text)', border: 'none', fontWeight: 600, padding: '6px 16px' }}
                  title="Delete this page"
                  onClick={() => {
                    setPages(pages => pages.filter(page => page.id !== selectedPage.id));
                    setSelectedId(null);
                  }}
                >
                  Delete Page
                </button>
              </div>
              {selectedPage.type === 'multipleChoice' ? (
                <MultipleChoiceEditor page={selectedPage} onChange={handleChange} />
              ) : selectedPage.type === 'inputAnswer' ? (
                <InputAnswerEditor page={selectedPage} onChange={handleChange} />
              ) : selectedPage.type === 'progressiveQuestions' ? (
                <ProgressiveQuestionsEditor page={selectedPage} onChange={handleChange} />
              ) : selectedPage.type === 'dragAndDrop' ? (
                <DragAndDropEditor page={selectedPage} onChange={handleChange} />
              ) : null}
            </>
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
                      <div key={p.id} className="uv-page-card" style={{ position: 'relative', paddingRight: 36 }}>
                        <div onClick={() => setSelectedId(p.id)} style={{ cursor: 'pointer' }}>
                          <strong style={{ display: 'block', marginBottom: 6 }}>{(p as any).title || `Page ${p.id}`}</strong>
                          <small style={{ color: 'var(--text-secondary)' }}>{p.type}</small>
                        </div>
                        <button
                          className="uv-btn"
                          style={{ position: 'absolute', top: 8, right: 8, padding: '2px 8px', fontSize: 13, background: 'var(--feedback-incorrect-bg)', color: 'var(--feedback-incorrect-text)', border: 'none' }}
                          title="Delete page"
                          onClick={e => {
                            e.stopPropagation();
                            setPages(pages => pages.filter(page => page.id !== p.id));
                            if (selectedId === p.id) setSelectedId(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <button
        className="uv-btn primary"
        style={{ position: 'fixed', bottom: 20, right: 20, padding: '10px 20px', fontSize: 16, border: 'none' }}
        title="Gem rum"
        onClick={async () => {
          if (!user) {
            alert('You must be logged in to save a room.');
            return;
          }
          try {
            const docRef = await addDoc(collection(db, 'EscapeRooms'), {
              pages,
              ownerId: user.uid,
              createdAt: serverTimestamp(),
              isPublished: false,
              name: pages[0]?.title || 'Untitled Room',
              roomCode: Math.floor(1000 + Math.random() * 9000),
            });
            alert(`Room saved to Firestore! ID: ${docRef.id}`);
          } catch (error) {
            alert('Error saving room to Firestore: ' + error);
          }
        }}
      >
        Gem rum
      </button>
    </div>
  );
};

export default UnderviserPagesManager;
