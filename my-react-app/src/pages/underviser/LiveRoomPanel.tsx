import React from 'react';

type Student = { nickname: string; progress?: number };

export interface LiveRoomPanelProps {
  visible: boolean;
  hasRoomId: boolean;
  started: boolean;
  roomCode: number | null;
  studentList: Student[];
  pagesLength: number;
  onStart: () => void;
  onClose: () => void;
  onDismiss: () => void;
}

const LiveRoomPanel: React.FC<LiveRoomPanelProps> = ({
  visible,
  hasRoomId,
  started,
  roomCode,
  studentList,
  pagesLength,
  onStart,
  onClose,
  onDismiss,
}) => {
  return (
    <>
      {/* Overlay for small screens */}
      {visible && (
        <div className="uv-live-overlay" onClick={onDismiss} />
      )}
      <aside className={`uv-rightpanel ${visible ? 'open' : ''}`} aria-hidden={!visible}>
        <div className="uv-rightpanel-header">
          <div style={{ fontWeight: 700 }}>Live Room</div>
          <button className="uv-btn ghost" onClick={onDismiss} aria-label="Close live panel">
            ✕
          </button>
        </div>
        {!hasRoomId ? (
          <div className="uv-rightpanel-body">
            <strong>Save your room first</strong>
            <p className="uv-muted">You need to save this room to get a room code and allow students to join.</p>
          </div>
        ) : !started ? (
          <div className="uv-rightpanel-body">
            <strong>Room is not live yet</strong>
            <p className="uv-muted">Students cannot join until you start it.</p>
            <button className="uv-btn primary" style={{ width: '100%' }} onClick={onStart}>Start Room</button>
          </div>
        ) : (
          <div className="uv-rightpanel-body">
            {roomCode && (
              <div style={{fontWeight:600,marginBottom:8}}>Join code: <span style={{fontFamily:'monospace',fontSize:18,letterSpacing:1}}>{roomCode}</span></div>
            )}
            <div className="uv-rightpanel-section">
              <div className="uv-rightpanel-section-title">Joined students ({studentList.length})</div>
              <ul className="uv-students">
                {studentList.length === 0 && (
                  <li className="uv-student muted">No students yet</li>
                )}
                {studentList.map(s => (
                  <li key={s.nickname} className="uv-student">
                    <span className="uv-student-name">{s.nickname}</span>
                    <span className="uv-student-progress">{(s.progress ?? 0) + 1}/{pagesLength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="uv-btn"
              style={{ width: '100%', marginTop: 12, background: 'var(--feedback-incorrect-bg)', color: 'var(--feedback-incorrect-text)' }}
              onClick={onClose}
            >
              Close Room
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default LiveRoomPanel;
