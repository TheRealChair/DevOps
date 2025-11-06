import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';
//Comment

describe('App Component', () => {
  it('renders HomePage initially', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Studerende/i)).toBeInTheDocument();
    expect(screen.getByText(/Underviser/i)).toBeInTheDocument();
  });

  it('toggles dark mode', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Hvis knappen har emoji 🌙 som i din nuværende DOM
    const toggleButton = screen.getByText('🌙');
    
    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);

    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
  });
});
