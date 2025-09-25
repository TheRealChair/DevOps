import React from 'react';

const StuderendePage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
      <h2>Studerende Page</h2>
      <p>Insert Room Number</p>
      <input type="text" placeholder="Type here..." style={{ padding: '0.5rem', fontSize: '1rem', margin: '1rem 0', width: '250px' }} />
      <button style={{ padding: '0.75rem 2rem', fontSize: '1rem', cursor: 'pointer' }}>Submit</button>
    </div>
  );
};

export default StuderendePage;
