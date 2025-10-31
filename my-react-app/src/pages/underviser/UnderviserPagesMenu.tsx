import React from 'react';
import type { PageData } from '../UnderviserPagesManager';

const UnderviserPagesMenu: React.FC<{
  pages: PageData[];
  selectedId?: number | null;
  onSelect: (id: number) => void;
  roomName: string;
  onChangeRoomName: (name: string) => void;
}> = ({ pages, selectedId = null, onSelect, roomName, onChangeRoomName }) => (
  <div className="uv-sidebar">
    {/* Move room name input all the way to the top */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '0 0 12px 0' }}>
      <label style={{ color: 'var(--text)', fontSize: 13 }}>Rumnavn</label>
      <input
        className="uv-input"
        value={roomName}
        onChange={e => onChangeRoomName(e.target.value)}
        placeholder="Angiv rumnavn"
      />
    </div>
    <div className="uv-sidebar-header">
      <h3 style={{ margin: 0 }}>Sider</h3>
      <small style={{ color: 'var(--muted)' }}>{pages.length} i alt</small>
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
