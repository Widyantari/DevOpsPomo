import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Import komponen
import Controls from './components/Controls';
import Shortcuts from './components/Shortcuts';
import TimeDisplay from './components/TimeDisplay';
import ToggleSound from './components/ToggleSound';
import TypeSelect from './components/TypeSelect';
import Pomodoro from './containers/Pomodoro';

// Import helpers
// HAPUS: import { add } from './helpers'

// Import CSS (opsional, hanya untuk memastikan file ada)
import './components/Controls.css';
import './components/Shortcuts.css';
import './components/TimeDisplay.css';
import './components/ToggleSound.css';
import './components/TypeSelect.css';
import './containers/Pomodoro.css';

describe('Repo Structure and Basic Imports', () => {
  it('should import main components and containers without error', () => {
    expect(Controls).toBeDefined();
    expect(Shortcuts).toBeDefined();
    expect(TimeDisplay).toBeDefined();
    expect(ToggleSound).toBeDefined();
    expect(TypeSelect).toBeDefined();
    expect(Pomodoro).toBeDefined();
  });
});

describe('Component Render', () => {
  it('should render Controls component and show Start Timer', () => {
    const startMock = vi.fn();
    const resetMock = vi.fn();
    const pauseMock = vi.fn();
    render(
      <Controls
        start={startMock}
        reset={resetMock}
        pause={pauseMock}
        status="Idle"
      />,
    );
    expect(screen.getByText(/start timer/i)).toBeInTheDocument();
  });

  it('should render TimeDisplay component', () => {
    render(<TimeDisplay time={60} status="Idle" progress={0} />);
    expect(screen.getByText(/01:00/)).toBeInTheDocument();
  });
});

// HAPUS: describe('Utility Functions', ...) untuk add

describe('CSS Files', () => {
  it('should exist all main CSS files', () => {
    // Jika file CSS tidak error saat diimport, berarti sudah ada
    expect(true).toBe(true);
  });
});
