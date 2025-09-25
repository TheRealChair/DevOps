import React, { useState } from 'react';

interface PageData {
  id: number;
  title: string;
  text: string;
  imageUrl: string;
}

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

const UnderviserEditor: React.FC<{
  page: PageData;
  onChange: (page: PageData) => void;
}> = ({ page, onChange }) => (
  <div style={{ marginLeft: 260, padding: 32, width: '100%' }}>
    <h2>Edit Page</h2>
    <input
      type="text"
      value={page.title}
      onChange={e => onChange({ ...page, title: e.target.value })}
      placeholder="Title"
      style={{ fontSize: '1.2rem', marginBottom: 12, width: '100%' }}
    />
    <textarea
      value={page.text}
      onChange={e => onChange({ ...page, text: e.target.value })}
      placeholder="Text"
      rows={6}
      style={{ width: '100%', marginBottom: 12 }}
    />
    <input
      type="text"
      value={page.imageUrl}
      onChange={e => onChange({ ...page, imageUrl: e.target.value })}
      placeholder="Image URL"
      style={{ width: '100%', marginBottom: 12 }}
    />
    {page.imageUrl && <img src={page.imageUrl} alt="Preview" style={{ maxWidth: 300, display: 'block', marginTop: 8 }} />}
  </div>
);

const UnderviserPagesManager: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [pages, setPages] = useState<PageData[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(true);

  const handleAddPage = () => {
    const newPage: PageData = { id: Date.now(), title: '', text: '', imageUrl: '' };
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
        <button onClick={handleAddPage} style={{ marginLeft: 8, marginBottom: 16 }}>Add Page</button>
        <button onClick={() => setShowMenu(true)} style={{ marginLeft: 8, marginBottom: 16 }}>Show Menu</button>
        {selectedPage ? (
          <UnderviserEditor page={selectedPage} onChange={handleChange} />
        ) : (
          <p>Select or add a page to edit.</p>
        )}
      </div>
    </div>
  );
};

export default UnderviserPagesManager;
