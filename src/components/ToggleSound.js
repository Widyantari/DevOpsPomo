import React, { memo } from 'react'
import PropTypes from 'prop-types'
import './ToggleSound.css'

function ToggleSound({ sound, toggleSound }) {
  return (
    <button
      type="button"
      className={`ToggleSound ${sound && 'active'}`}
      onClick={toggleSound}
      title={sound ? 'Disable Sound' : 'Enable Sound'}
      aria-label={sound ? 'Disable Sound' : 'Enable Sound'}
    >
      <i className={`fa fa-volume-${sound ? 'up' : 'mute'}`} />
    </button>
  )
}

ToggleSound.propTypes = {
  sound: PropTypes.bool.isRequired,
  toggleSound: PropTypes.func.isRequired,
}

export default memo(ToggleSound)
