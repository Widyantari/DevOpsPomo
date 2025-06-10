import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  describe, it, expect, vi,
} from 'vitest'

import Controls from './Controls'

// Mengelompokkan semua tes untuk komponen Controls
describe('Controls Component', () => {
  // Membuat "fungsi palsu" (mock function) untuk melacak panggilan
  const startMock = vi.fn()
  const pauseMock = vi.fn()
  const resetMock = vi.fn()

  // Tes untuk status 'Idle'
  it('should display only the "Start Timer" button when status is Idle', () => {
    render(<Controls status="Idle" start={startMock} pause={pauseMock} reset={resetMock} />)
    expect(screen.getByRole('button', { name: /start timer/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument()
  })

  // Tes untuk status 'Finished'
  it('should display only the "Restart Timer" button when status is Finished', () => {
    render(<Controls status="Finished" start={startMock} pause={pauseMock} reset={resetMock} />)
    expect(screen.getByRole('button', { name: /restart timer/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument()
  })

  // Tes untuk status 'Running'
  it('should display "Pause" and "Reset" buttons when status is Running', () => {
    render(<Controls status="Running" start={startMock} pause={pauseMock} reset={resetMock} />)
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /start/i })).not.toBeInTheDocument()
  })

  // Tes untuk status 'Paused'
  it('should display "Resume" and "Reset" buttons when status is Paused', () => {
    render(<Controls status="Paused" start={startMock} pause={pauseMock} reset={resetMock} />)
    expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument()
  })

  // Tes untuk interaksi klik tombol
  it('should call the correct function when a button is clicked', () => {
    // Render komponen dengan status 'Running'
    const { rerender } = render(<Controls status="Running" start={startMock} pause={pauseMock} reset={resetMock} />)

    // Klik tombol "Pause"
    fireEvent.click(screen.getByRole('button', { name: /pause/i }))
    // Harapkan fungsi pauseMock dipanggil
    expect(pauseMock).toHaveBeenCalledTimes(1)

    // Klik tombol "Reset"
    fireEvent.click(screen.getByRole('button', { name: /reset/i }))
    // Harapkan fungsi resetMock dipanggil
    expect(resetMock).toHaveBeenCalledTimes(1)

    // Render ulang komponen dengan status 'Idle' untuk menguji tombol start
    rerender(<Controls status="Idle" start={startMock} pause={pauseMock} reset={resetMock} />)
    fireEvent.click(screen.getByRole('button', { name: /start/i }))
    expect(startMock).toHaveBeenCalledTimes(1)
  })
})
