// DragAndDropEditor
// -----------------
// Editor for drag-and-drop question pages in the teacher/manager interface.
// Uses utility classes for consistent UI (.uv-btn, .uv-input, .uv-label, .uv-heading).
// Handles draggable items, image preview, and correct order logic.
// Last updated: 2025-10-20
import React from 'react';
import type { PageData, DragAndDropItem } from '../UnderviserPagesManager';

const DragAndDropEditor: React.FC<{
  page: Extract<PageData, { type: 'dragAndDrop' }>;
  onChange: (page: PageData) => void;
}> = ({ page, onChange }) => {
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
  // Change the order of items in the correct answer sequence
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
    <div className="uv-editor">
      {/* Page title and explanation input */}
      <h2 className="uv-heading">Edit Drag and Drop Page</h2>
      <label className="uv-label" htmlFor="dd-title">Title/Explanation</label>
      <input
        id="dd-title"
        className="uv-input"
        type="text"
        value={page.title}
        onChange={e => onChange({ ...page, title: e.target.value })}
        placeholder="Title/Explanation"
      />
      {/* Optional image for the question */}
      <label className="uv-label" htmlFor="dd-image">Image URL or description</label>
      <input
        id="dd-image"
        className="uv-input"
        type="text"
        value={page.imageUrl}
        onChange={e => onChange({ ...page, imageUrl: e.target.value })}
        placeholder="Image URL or description"
      />
      {/* Show image preview if imageUrl is set */}
      {page.imageUrl && <img src={page.imageUrl} alt="Preview" style={{ maxWidth: 300, display: 'block', marginTop: 8 }} />}
      {/* Section for draggable items */}
      <h3 className="uv-label" style={{ marginTop: 24 }}>Draggable Items</h3>
      {page.items.map((item, idx) => (
        <div key={item.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 8, marginBottom: 8 }}>
          {/* Item label input */}
          <label className="uv-label" htmlFor={`dd-item-label-${item.id}`}>Item {idx + 1} Label</label>
          <input
            id={`dd-item-label-${item.id}`}
            className="uv-input"
            type="text"
            value={item.label}
            onChange={e => handleItemChange(item.id, 'label', e.target.value)}
            placeholder="Item label"
          />
          {/* Optional image for the item */}
          <label className="uv-label" htmlFor={`dd-item-img-${item.id}`}>Image URL (optional)</label>
          <input
            id={`dd-item-img-${item.id}`}
            className="uv-input"
            type="text"
            value={item.imageUrl || ''}
            onChange={e => handleItemChange(item.id, 'imageUrl', e.target.value)}
            placeholder="Image URL (optional)"
          />
          {/* Show item image preview if imageUrl is set */}
          {item.imageUrl && <img src={item.imageUrl} alt="item" style={{ maxWidth: 80, marginBottom: 6 }} />}
          {/* Remove button for this item */}
          <button className="uv-btn" onClick={() => handleRemoveItem(item.id)} style={{ fontSize: 12 }}>Remove</button>
        </div>
      ))}
      {/* Add new draggable item */}
      <button className="uv-btn primary" onClick={handleAddItem} style={{ marginTop: 8 }}>+ Add Item</button>
      {/* Section for setting the correct order */}
      <h3 className="uv-label" style={{ marginTop: 24 }}>Correct Order</h3>
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
              {/* Item order number and label */}
              <span style={{ fontWeight: 600, marginRight: 8 }}>#{idx + 1}</span>
              {item.label || 'Item'}
              {/* Move item up in the order */}
              <button className="uv-btn" onClick={() => handleOrderChange(idx, 'up')} disabled={idx === 0} style={{ marginLeft: 8 }}>↑</button>
              {/* Move item down in the order */}
              <button className="uv-btn" onClick={() => handleOrderChange(idx, 'down')} disabled={idx === page.correctOrder.length - 1} style={{ marginLeft: 4 }}>↓</button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default DragAndDropEditor;
