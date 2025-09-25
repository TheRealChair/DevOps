



const HomePage: React.FC = () => {
  return (
    <div className="frontpage-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '3rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1>Welcome to the Front Page</h1>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button style={{ padding: '1rem 2rem', fontSize: '1rem', cursor: 'pointer' }}>Button 1</button>
          <button style={{ padding: '1rem 2rem', fontSize: '1rem', cursor: 'pointer' }}>Button 2</button>
        </div>
      </div>
      {/* Video removed as requested */}
    </div>
  );
};

export default HomePage;
