import React, { useState } from 'react';
import type { PageData } from '../UnderviserPagesManager';

const UnderviserPagesMenu: React.FC<{
  pages: PageData[];
  selectedId?: number | null;
  onSelect: (id: number) => void;
  onReorder?: (newOrder: PageData[]) => void;
}> = ({ pages, selectedId = null, onSelect, onReorder }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex || !onReorder) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newPages = [...pages];
    const [removed] = newPages.splice(draggedIndex, 1);
    newPages.splice(dropIndex, 0, removed);
    onReorder(newPages);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="uv-sidebar">
      <div className="uv-sidebar-header">
        <h3 style={{ margin: 0 }}>Pages</h3>
        <small style={{ color: '#666' }}>{pages.length} total</small>
      </div>
      <ul className="uv-page-list">
        {pages.map((page, index) => (
          <li
            key={page.id}
            draggable={!!onReorder}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={page.id === selectedId ? 'uv-page-item selected' : 'uv-page-item'}
            onClick={() => { console.log('Menu item clicked, id:', page.id); onSelect(page.id); }}
            style={{ 
              cursor: onReorder ? 'grab' : 'pointer', 
              userSelect: 'none',
              opacity: draggedIndex === index ? 0.5 : 1,
              backgroundColor: dragOverIndex === index ? 'var(--hover-bg, rgba(0,0,0,0.1))' : 'transparent',
              transition: 'background-color 0.2s'
            }}
          >
            <span style={{ flex: 1 }}>{(page as any).title || 'unavngivet'}</span>
            <div className="uv-page-type">{page.type}</div>
          </li>
        ))}
      </ul>
      {/* menu close handled via topbar toggle; removed duplicate Close button */}
    </div>
  );
};

export default UnderviserPagesMenu;
