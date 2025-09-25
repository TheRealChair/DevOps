import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('Welcome to your React app!')

  const handleReset = () => {
    setCount(0)
    setMessage('Counter reset! 🎉')
    setTimeout(() => setMessage('Welcome to your React app!'), 2000)
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>🚀 My Custom React App</h1>
      <p className="message">{message}</p>
      
      <div className="card">
        <div className="counter-section">
          <h3>Interactive Counter</h3>
          <p>Current count: <strong>{count}</strong></p>
          <div className="button-group">
            <button 
              onClick={() => setCount((count) => count + 1)}
              className="increment-btn"
            >
              ➕ Increment
            </button>
            <button 
              onClick={() => setCount((count) => count - 1)}
              className="decrement-btn"
            >
              ➖ Decrement
            </button>
            <button 
              onClick={handleReset}
              className="reset-btn"
            >
              🔄 Reset
            </button>
          </div>
        </div>
        <p className="hint">
          Edit <code>src/App.tsx</code> and save to test HMR (Hot Module Replacement)
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more about these awesome tools!
      </p>
    </>
  )
}

export default App
