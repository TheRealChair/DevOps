import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('renders HomePage initially', () => {
    render(<App />);
    expect(screen.getByText(/Studerende/i)).toBeInTheDocument();
    expect(screen.getByText(/Underviser/i)).toBeInTheDocument();
  });

  it('toggles dark mode', () => {
    render(<App />);
    const toggleButton = screen.getByRole('button', { name: /Switch to Dark Mode/i });
    
    // Klik for at aktivere dark mode
    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);

    // Klik igen for at deaktivere
    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
  });
});
