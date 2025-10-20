import React from 'react';
import type { PageData, DragAndDropItem } from '../UnderviserPagesManager';

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
    <div className="uv-editor">
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

export default DragAndDropEditor;
