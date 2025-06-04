import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import formatTime from '../helpers'
import './TimeDisplay.css'

function TimeDisplay({ time, status, progress }) {
  const defaultTitle = useRef(document.title)
  document.title = `(${formatTime(time)}) ${defaultTitle.current}`

  const radius = 150
  const stroke = 5
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="TimeDisplay">
      <svg width="100%" viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <circle
          stroke="#ddd"
          fill="#fff"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#D9534F"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div>
        <h1>{formatTime(time)}</h1>
        <p>{status}</p>
      </div>
    </div>
  )
}

TimeDisplay.propTypes = {
  time: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
}

export default TimeDisplay
