import React, { memo } from 'react'
import PropTypes from 'prop-types'
import './Controls.css'

function Controls({
  start, reset, pause, status,
}) {
  const renderInitialButton = () => {
    if (!status || status === 'Finished') {
      return (
        <button type="button" onClick={start} className="start">
          {status === 'Finished' ? 'Restart Timer' : 'Start Timer'}
        </button>
      )
    }
    return null
  }

  const renderActiveButtons = () => {
    if (status === 'Paused' || status === 'Running') {
      return (
        <div>
          <button type="button" onClick={reset} className="reset">
            Reset
          </button>
          <button
            type="button"
            onClick={pause}
            className={status === 'Paused' ? 'resume' : 'pause'}
          >
            {status === 'Paused' ? 'Resume' : 'Pause'}
          </button>
        </div>
      )
    }
    return null
  }

  return (
    <div className="Controls">
      {renderInitialButton()}
      {renderActiveButtons()}
    </div>
  )
}

Controls.propTypes = {
  start: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
  status: PropTypes.oneOf(['Paused', 'Running', 'Finished', null]),
}

export default memo(Controls)
