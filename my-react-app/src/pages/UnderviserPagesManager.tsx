

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
import { addDoc, collection, getDocs, serverTimestamp, query, where, doc, updateDoc, deleteDoc, getDoc, onSnapshot, QuerySnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
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

function sanitizePages(inputPages: any[]): any[] {
  return (inputPages || []).map(page => {
    const base = {
      id: Number(page.id),
      type: page.type,
      title: String(page.title || ''),
      imageUrl: page.imageUrl ?? '',
    };
    if (page.type === 'multipleChoice') {
      return {
        ...base,
        options: Array.isArray(page.options) ? page.options.map((opt: any) => ({
          id: Number(opt.id),
          text: String(opt.text),
          imageUrl: opt.imageUrl ?? '',
          correct: !!opt.correct
        })) : [],
      };
    }
    if (page.type === 'inputAnswer') {
      return {
        ...base,
        answer: String(page.answer || ''),
      };
    }
    if (page.type === 'progressiveQuestions') {
      return {
        ...base,
        questions: Array.isArray(page.questions) ? page.questions.map((q: any) => ({
          id: Number(q.id),
          prompt: String(q.prompt || ''),
          answer: String(q.answer || '')
        })) : [],
        finalBarLabel: page.finalBarLabel ?? '',
        finalAnswer: page.finalAnswer ?? '',
      };
    }
    if (page.type === 'dragAndDrop') {
      return {
        ...base,
        items: Array.isArray(page.items) ? page.items.map((it: any) => ({
          id: Number(it.id),
          label: String(it.label || ''),
          imageUrl: it.imageUrl ?? ''
        })) : [],
        correctOrder: Array.isArray(page.correctOrder) ? page.correctOrder.map(Number) : [],
      };
    }
    return base; // fallback
  });
}

const UnderviserPagesManager: React.FC<UnderviserPagesManagerProps> = ({ onBack, initialPages = [] }) => {

  const [pages, setPages] = useState<PageData[]>(initialPages);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { user } = useAuth();
  const [myRooms, setMyRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [editRoomId, setEditRoomId] = useState<string | null>(null);

  // --- Teacher live dashboard logic ---
  const [studentList, setStudentList] = useState<any[]>([]);
  const [roomDocId, setRoomDocId] = useState<string | null>(null);
  useEffect(() => {
    // Try to detect Firestore ID if editing real room (by adding a prop for this in the future, or pass via context)
    if ((initialPages as any)._roomId) {
      setRoomDocId((initialPages as any)._roomId);
    } else {
      setRoomDocId(null);
    }
  }, [initialPages]);

  useEffect(() => {
    if (!roomDocId) return;
    const studentsCol = collection(db, 'EscapeRooms', roomDocId, 'Students');
    const q = query(studentsCol);
    const unsub = onSnapshot(q, (snap: QuerySnapshot) => {
      const arr = snap.docs.map((doc: QueryDocumentSnapshot) => doc.data());
      arr.sort((a: any, b: any) => a.nickname.localeCompare(b.nickname));
      setStudentList(arr);
    });
    return () => unsub();
  }, [roomDocId]);

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

  const [started, setStarted] = useState<boolean>(false);
  const [roomCode, setRoomCode] = useState<number|null>(null);
  useEffect(() => {
    // Fetch started and roomCode from backend if doc loaded
    if (!roomDocId) return;
    const fetchStartedAndCode = async () => {
      const docRef = doc(db, 'EscapeRooms', roomDocId);
      const snap = await getDoc(docRef);
      setStarted(Boolean(snap.get('started')));
      setRoomCode(snap.get('roomCode'));
    };
    fetchStartedAndCode();
  }, [roomDocId]);

  const handleStartRoom = async () => {
    if (!roomDocId) return;
    const docRef = doc(db, 'EscapeRooms', roomDocId);
    await updateDoc(docRef, { started: true });
    setStarted(true);
  };

  const handleCloseRoom = async () => {
    if (!roomDocId) return;
    // 1) Set started: false
    await updateDoc(doc(db, 'EscapeRooms', roomDocId), { started: false });
    setStarted(false);
    // 2) Remove all students in subcollection
    const studentsCol = collection(db, 'EscapeRooms', roomDocId, 'Students');
    const snap = await getDocs(studentsCol);
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
    setStudentList([]);
    alert('Rum lukker alle deltagende elever er smidt ud.');
  };

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

  // Initialize/track roomId for editing
  useEffect(() => {
    if ((initialPages as any)._roomId) {
      setEditRoomId((initialPages as any)._roomId);
    } else {
      setEditRoomId(null);
    }
  }, [initialPages]);

  // Save handler
  const handleSaveRoom = async () => {
    if (!user) {
      alert('Du skal være logget ind for at gemme et rum.');
      return;
    }
    const roomsCol = collection(db, 'EscapeRooms');
    const cleanPages = sanitizePages(pages);
    if (editRoomId) {
      // Update existing room: don't update roomCode or createdAt
      await updateDoc(doc(roomsCol, editRoomId), {
        pages: cleanPages,
        ownerId: user.uid,
        name: cleanPages[0]?.title || 'Untitled Room',
        isPublished: false
        // DO NOT overwrite roomCode or createdAt here!
      });
      alert('Room updated.');
    } else {
      // New room: generate roomCode ONCE
      const code = Math.floor(1000 + Math.random() * 9000);
      const docRef = await addDoc(roomsCol, {
        pages: cleanPages,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        isPublished: false,
        name: cleanPages[0]?.title || 'Untitled Room',
        roomCode: code
      });
      setEditRoomId(docRef.id);
      alert('Rum gemt! Join koden for dette rum er: ' + code);
    }
  };

  // Room delete (for teacher's rooms list)
  const handleDeleteRoom = async (roomId: string) => {
    if (!window.confirm('Er du sikker på, at du vil slette dette rum og alle elevers data?')) return;
    // Delete all Students in subcollection
    const studentsCol = collection(db, 'EscapeRooms', roomId, 'Students');
    const snap = await getDocs(studentsCol);
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
    // Delete the room itself
    await deleteDoc(doc(db, 'EscapeRooms', roomId));
    // Update dashboard UI
    setMyRooms(rms => rms.filter(r => r.id !== roomId));
    alert('Rum slettet.');
  };

  return (
    <div className="uv-root">
      {roomDocId && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1100, background: '#fff', border: '1px solid #ccc', borderRadius: 8, boxShadow: '0 2px 12px #0002', padding: 14, minWidth: 220 }}>
          {!started ? (
            <>
              <strong>Rum er ikke live endnu</strong>
              <div style={{ marginTop: 12, marginBottom: 6, color:'#888', fontSize:14 }}>Elever kan ikke deltage før du starter det.</div>
              <button className="uv-btn primary" style={{width:'100%'}} onClick={handleStartRoom}>Start Rum</button>
            </>
          ) : (
            <>
              <strong>Deltagende elever ({studentList.length}):</strong>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', maxHeight: 220, overflowY: 'auto' }}>
                {studentList.length === 0 && <li style={{ color:'#888', fontSize: 13 }}>Ingen elever endnu</li>}
                {studentList.map(s => (
                  <li key={s.nickname} style={{ fontSize: 15, padding: '2px 0' }}>{s.nickname} <span style={{ color: '#555', fontSize: 13 }}> {s.progress+1 || 1}/{pages.length} pages </span></li>
                ))}
              </ul>
              {/* Show room join code if editing a real room */}
              {roomCode && (
                <div style={{fontWeight:600,marginBottom:8}}>Join kode: <span style={{fontFamily:'monospace',fontSize:18,letterSpacing:1}}>{roomCode}</span></div>
              )}
              <button className="uv-btn" style={{width:'100%', marginTop: 12, background:'var(--feedback-incorrect-bg)', color:'var(--feedback-incorrect-text)'}} onClick={handleCloseRoom}>Luk Rum</button>
            </>
          )}
        </div>
      )}
      {user && (
        <div style={{background:'#f1f5f9',borderRadius:8,padding:16,marginBottom:18}}>
          <h3>Dine gemte Rum</h3>
          {loadingRooms ? (<div>Indlæser rum...</div>) : myRooms.length === 0 ? (<div>Ingen rum endnu.</div>) : (
            <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
              {myRooms.map(r => (
                <div key={r.id} style={{border:'1px solid #aaa',borderRadius:8,padding:12,minWidth:240}}>
                  <div><strong>{r.name || 'Untitled Room'}</strong></div>
                  <div style={{fontSize:13}}>Rum kode: {r.roomCode}</div>
                  <div style={{fontSize:13}}>{r.pages?.length} sider</div>
                  <button
                    className="uv-btn"
                    style={{marginTop:6,padding:'4px 16px'}}
                    onClick={()=>{
                      setPages(r.pages || []);
                    }}>
                    Rediger/Fortryd
                  </button>
                  <button className="uv-btn" onClick={()=>handleDeleteRoom(r.id)} style={{marginTop:6,marginLeft:8,background:'var(--feedback-incorrect-bg)',color:'var(--feedback-incorrect-text)'}}>Delete</button>
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
          onReorder={(newOrder) => setPages(newOrder)}
        />
      )}
      <div className="uv-main">
        <div className="uv-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="uv-btn" onClick={onBack}>Tilbage</button>
            <button className="uv-btn" onClick={() => setShowMenu(s => !s)}>{showMenu ? 'Skjul Menu' : 'Vis Menu'}</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ color: 'var(--text)', fontSize: 14 }}>Template:</label>
            <select className="uv-input" value={templateType} onChange={e => setTemplateType(e.target.value as PageType)}>
              <option value="multipleChoice">Multiple Choice</option>
              <option value="inputAnswer">Input Svar</option>
              <option value="progressiveQuestions">Progressive Spørgsmål</option>
              <option value="dragAndDrop">Drag and Drop</option>
            </select>
            <button className="uv-btn primary" onClick={handleAddPage}>+ Tilføj Side</button>
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
                  Slet Side
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
              <h2>Ingen side valgt</h2>
              <p>Opret en side ved hjælp af kontrollerne i top-højre hjørne. Du kan også åbne venstre menu for at vælge en eksisterende side.</p>
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
                          <strong style={{ display: 'block', marginBottom: 6 }}>{(p as any).title || 'unavngivet'}</strong>
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
        onClick={handleSaveRoom}
      >
        {editRoomId ? 'Update' : 'Save'} Room
      </button>
    </div>
  );
};

export default UnderviserPagesManager;
