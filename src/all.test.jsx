import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Controls from './components/Controls';
import Shortcuts from './components/Shortcuts';
import TimeDisplay from './components/TimeDisplay';
import ToggleSound from './components/ToggleSound';
import TypeSelect from './components/TypeSelect';

// Cleanup setelah setiap test
afterEach(() => {
  cleanup();
});

describe('Controls', () => {
  const start = vi.fn();
  const reset = vi.fn();
  const pause = vi.fn();

  it('shows Start Timer when status is Idle', () => {
    render(<Controls start={start} reset={reset} pause={pause} status="Idle" />);
    expect(screen.getByText(/start timer/i)).toBeInTheDocument();
  });

  it('shows Restart Timer when status is Finished', () => {
    render(<Controls start={start} reset={reset} pause={pause} status="Finished" />);
    expect(screen.getByText(/restart timer/i)).toBeInTheDocument();
  });

  it('shows Reset and Pause when status is Running', () => {
    render(<Controls start={start} reset={reset} pause={pause} status="Running" />);
    expect(screen.getByText(/reset/i)).toBeInTheDocument();
    expect(screen.getByText(/pause/i)).toBeInTheDocument();
  });

  it('shows Reset and Resume when status is Paused', () => {
    render(<Controls start={start} reset={reset} pause={pause} status="Paused" />);
    expect(screen.getByText(/reset/i)).toBeInTheDocument();
    expect(screen.getByText(/resume/i)).toBeInTheDocument();
  });

  it('calls start, reset, and pause when clicked', () => {
    render(<Controls start={start} reset={reset} pause={pause} status="Idle" />);
    fireEvent.click(screen.getByText(/start timer/i));
    expect(start).toHaveBeenCalled();

    render(<Controls start={start} reset={reset} pause={pause} status="Running" />);
    fireEvent.click(screen.getByText(/reset/i));
    expect(reset).toHaveBeenCalled();

    fireEvent.click(screen.getByText(/pause/i));
    expect(pause).toHaveBeenCalled();
  });
});

describe('Shortcuts', () => {
  it('renders all shortcut keys', () => {
    render(<Shortcuts />);
    expect(screen.getByText(/play \/ pause \/ resume/i)).toBeInTheDocument();
    expect(screen.getByText(/reset/i)).toBeInTheDocument();
    expect(screen.getByText(/pomodoro/i)).toBeInTheDocument();
    expect(screen.getByText(/short break/i)).toBeInTheDocument();
    expect(screen.getByText(/long break/i)).toBeInTheDocument();
    expect(screen.getAllByText(/1/)).toHaveLength(2); // 1 dan Num1
    expect(screen.getAllByText(/2/)).toHaveLength(2); // 2 dan Num2
    expect(screen.getAllByText(/3/)).toHaveLength(2); // 3 dan Num3
  });
});

describe('TimeDisplay', () => {
  it('renders formatted time and status', () => {
    // Mock formatTime jika perlu
    vi.mock('../helpers', () => ({
      default: (time) => `00:0${time}`,
    }));


    render(<TimeDisplay time={5} status="Running" progress={50} />);
    expect(screen.getByText(/00:05/)).toBeInTheDocument();
    expect(screen.getByText(/running/i)).toBeInTheDocument();
  });
});

describe('ToggleSound', () => {
  it('shows icon and toggles sound', () => {
    const toggleSound = vi.fn();
    render(<ToggleSound sound={true} toggleSound={toggleSound} />);
    expect(screen.getByLabelText(/disable sound/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(toggleSound).toHaveBeenCalled();
  });

  it('shows enable sound when sound is off', () => {
    render(<ToggleSound sound={false} toggleSound={() => {}} />);
    expect(screen.getByLabelText(/enable sound/i)).toBeInTheDocument();
  });
});

describe('TypeSelect', () => {
  const types = [
    { name: 'Pomodoro' },
    { name: 'Short Break' },
    { name: 'Long Break' },
  ];
  const changeType = vi.fn();
  const selected = { name: 'Pomodoro' };

  it('renders all types and highlights selected', () => {
    render(<TypeSelect types={types} changeType={changeType} selected={selected} />);
    expect(screen.getByText(/pomodoro/i)).toHaveClass('active');
    expect(screen.getByText(/short break/i)).not.toHaveClass('active');
    expect(screen.getByText(/long break/i)).not.toHaveClass('active');
  });

  it('calls changeType when a type is clicked', () => {
    render(<TypeSelect types={types} changeType={changeType} selected={selected} />);
    fireEvent.click(screen.getByText(/short break/i));
    expect(changeType).toHaveBeenCalled();
  });
});

// Test file CSS (optional, bisa dihapus kalau nggak perlu)
describe('CSS file existence', () => {
  it('Controls.css exists', () => {
    expect(() => require('./components/Controls.css')).not.toThrow();
  });
  it('Shortcuts.css exists', () => {
    expect(() => require('./components/Shortcuts.css')).not.toThrow();
  });
  it('TimeDisplay.css exists', () => {
    expect(() => require('./components/TimeDisplay.css')).not.toThrow();
  });
  it('ToggleSound.css exists', () => {
    expect(() => require('./components/ToggleSound.css')).not.toThrow();
  });
  it('TypeSelect.css exists', () => {
    expect(() => require('./components/TypeSelect.css')).not.toThrow();
  });
});
