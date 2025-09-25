



const HomePage: React.FC = () => {
  return (
  <div className="frontpage-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
      <h1>Welcome to the Escape Room</h1>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button style={{ padding: '1rem 2rem', fontSize: '1rem', cursor: 'pointer' }}>Underviser</button>
        <button style={{ padding: '1rem 2rem', fontSize: '1rem', cursor: 'pointer' }}>Studerende</button>
      </div>
    </div>
  );
};

export default HomePage;
