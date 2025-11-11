import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

// Reset theme-related side effects between tests for stability
beforeEach(() => {
  try {
    localStorage.clear();
  } catch {}
  document.documentElement.classList.remove('dark-mode');
});

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

  it('toggles dark mode via the TopBar switch', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // The TopBar toggle is an accessible switch with label "Toggle dark mode"
    const toggleSwitch = screen.getByRole('switch', { name: /toggle dark mode/i });

    fireEvent.click(toggleSwitch);
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);

    fireEvent.click(toggleSwitch);
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
  });
});
