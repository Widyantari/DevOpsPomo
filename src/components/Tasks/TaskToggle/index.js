import React, { memo } from 'react'
import './styles.css'

function TaskToggle({ task, toggleTask }) {
  return (
    <button
      className={`ToggleTask ${task && 'active'}`}
      onClick={toggleTask}
      title={task ? 'Disable Task' : 'Enable Task'}
    >
      <i className="fa fa-tasks" />
    </button>
  )
}

export default memo(TaskToggle)
