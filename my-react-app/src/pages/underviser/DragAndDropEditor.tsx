// DragAndDropEditor
// -----------------
// Editor for drag-and-drop question pages in the teacher/manager interface.
// Uses utility classes for consistent UI (.uv-btn, .uv-input, .uv-label, .uv-heading).
// Handles draggable items, image preview, and correct order logic.
// Last updated: 2025-10-20
import React, { useState } from 'react';
import type { PageData, DragAndDropItem } from '../UnderviserPagesManager';

const DragAndDropEditor: React.FC<{
  page: Extract<PageData, { type: 'dragAndDrop' }>;
  onChange: (page: PageData) => void;
}> = ({ page, onChange }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Update a field of a specific draggable item (label or imageUrl)
  const handleItemChange = (id: number, field: keyof DragAndDropItem, value: string) => {
    onChange({
      ...page,
      items: page.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };
  // Add a new draggable item
  const handleAddItem = () => {
    const newItem: DragAndDropItem = {
      id: Date.now(),
      label: '',
      imageUrl: '',
    };
    onChange({ ...page, items: [...page.items, newItem], correctOrder: [...page.correctOrder, newItem.id] });
  };
  // Remove a draggable item
  const handleRemoveItem = (id: number) => {
    onChange({
      ...page,
      items: page.items.filter(item => item.id !== id),
      correctOrder: page.correctOrder.filter(itemId => itemId !== id),
    });
  };
  // Drag and drop handlers for correct order
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
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newOrder = [...page.correctOrder];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, removed);
    onChange({ ...page, correctOrder: newOrder });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  return (
    <div className="uv-editor">
      {/* Page title and explanation input */}
      <h2 className="uv-heading">Rediger Drag and Drop Side</h2>
      <label className="uv-label" htmlFor="dd-title">Titel/Forklaring</label>
      <input
        id="dd-title"
        className="uv-input"
        type="text"
        value={page.title}
        onChange={e => onChange({ ...page, title: e.target.value })}
        placeholder="Titel/Forklaring"
      />
      {/* Optional image for the question */}
      <label className="uv-label" htmlFor="dd-image">Billed URL eller beskrivelse</label>
      <input
        id="dd-image"
        className="uv-input"
        type="text"
        value={page.imageUrl}
        onChange={e => onChange({ ...page, imageUrl: e.target.value })}
        placeholder="Billed URL eller beskrivelse"
      />
      {/* Show image preview if imageUrl is set */}
      {page.imageUrl && <img src={page.imageUrl} alt="Preview" style={{ maxWidth: 300, display: 'block', marginTop: 8 }} />}
      {/* Section for draggable items */}
      <h3 className="uv-label" style={{ marginTop: 24 }}>Draggable Elementer</h3>
      {page.items.map((item, idx) => (
  <div key={item.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 8, marginBottom: 8 }}>
          {/* Item label input */}
          <label className="uv-label" htmlFor={`dd-item-label-${item.id}`}>Item {idx + 1} Label</label>
          <input
            id={`dd-item-label-${item.id}`}
            className="uv-input"
            type="text"
            value={item.label}
            onChange={e => handleItemChange(item.id, 'label', e.target.value)}
            placeholder="Element label"
          />
          {/* Optional image for the item */}
          <label className="uv-label" htmlFor={`dd-item-img-${item.id}`}>Billed URL (valgfrit)</label>
          <input
            id={`dd-item-img-${item.id}`}
            className="uv-input"
            type="text"
            value={item.imageUrl || ''}
            onChange={e => handleItemChange(item.id, 'imageUrl', e.target.value)}
            placeholder="Billed URL (valgfrit)"
          />
          {/* Show item image preview if imageUrl is set */}
          {item.imageUrl && <img src={item.imageUrl} alt="item" style={{ maxWidth: 80, marginBottom: 6 }} />}
          {/* Remove button for this item */}
          <button className="uv-btn" onClick={() => handleRemoveItem(item.id)} style={{ fontSize: 12 }}>Slet</button>
        </div>
      ))}
      {/* Add new draggable item */}
      <button className="uv-btn primary" onClick={handleAddItem} style={{ marginTop: 8 }}>+ Tilføj Element</button>
      {/* Section for setting the correct order */}
      <h3 className="uv-label" style={{ marginTop: 24 }}>Korrekt Rækkefølge</h3>
  <div style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: '1rem' }}>
        <strong>Sæt den korrekte rækkefølge for svaret nedenfor.</strong><br />
        Dette er rækkefølgen, som eleverne skal arrangere elementerne i for at løse spørgsmålet. Træk og slip elementer for at ændre rækkefølgen.
      </div>
      <ol style={{ padding: 0, listStyle: 'none' }}>
        {page.correctOrder.map((itemId, idx) => {
          const item = page.items.find(i => i.id === itemId);
          if (!item) return null;
          return (
            <li 
              key={itemId} 
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              style={{ 
                marginBottom: 4, 
                background: dragOverIndex === idx ? 'var(--hover-bg, rgba(0,0,0,0.1))' : 'inherit', 
                border: '1px solid var(--border)', 
                borderRadius: 6, 
                padding: 8, 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'grab',
                opacity: draggedIndex === idx ? 0.5 : 1,
                transition: 'background-color 0.2s',
                userSelect: 'none'
              }}
            >
              {/* Item order number and label */}
              <span style={{ fontWeight: 600, marginRight: 8 }}>#{idx + 1}</span>
              <span style={{ flex: 1 }}>{item.label || 'Item'}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default DragAndDropEditor;
