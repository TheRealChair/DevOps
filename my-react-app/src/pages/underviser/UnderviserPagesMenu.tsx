import React from 'react';
import type { PageData } from '../UnderviserPagesManager';

const UnderviserPagesMenu: React.FC<{
  pages: PageData[];
  selectedId?: number | null;
  onSelect: (id: number) => void;
}> = ({ pages, selectedId = null, onSelect }) => (
  <div className="uv-sidebar">
    <div className="uv-sidebar-header">
      <h3 style={{ margin: 0 }}>Pages</h3>
      <small style={{ color: '#666' }}>{pages.length} total</small>
    </div>
    <ul className="uv-page-list">
      {pages.map(page => (
        <li
          key={page.id}
          className={page.id === selectedId ? 'uv-page-item selected' : 'uv-page-item'}
          onClick={() => { console.log('Menu item clicked, id:', page.id); onSelect(page.id); }}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <span style={{ flex: 1 }}>{(page as any).title || `Page ${page.id}`}</span>
          <div className="uv-page-type">{page.type}</div>
        </li>
      ))}
    </ul>
    {/* menu close handled via topbar toggle; removed duplicate Close button */}
  </div>
);

export default UnderviserPagesMenu;
