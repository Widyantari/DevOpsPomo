import React from 'react';
import PropTypes from 'prop-types';
import './Controls.css';

function Controls({
  start,
  reset,
  pause,
  status,
}) {
  return (
    <div className="Controls">
      {status === 'Idle' && (
        <button type="button" onClick={start} className="start">
          Start Timer
        </button>
      )}

      {
      status === 'Finished' && (
        <button type="button" onClick={start} className="start">
          Restart Timer
        </button>
      )
      }

      {(status === 'Paused' || status === 'Running') && (
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
      )}
    </div>
  );
}

Controls.propTypes = {
  start: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};

export default React.memo(Controls);
