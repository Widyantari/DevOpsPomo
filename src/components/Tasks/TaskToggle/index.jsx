import React, { memo } from 'react';
import PropTypes from 'prop-types';
import './styles.css';

function TaskToggle({ task, toggleTask }) {
  return (
    <button
      type="button"
      className={`ToggleTask ${task && 'active'}`}
      onClick={toggleTask}
      title={task ? 'Disable Task' : 'Enable Task'}
      aria-label={task ? 'Disable Task' : 'Enable Task'}
    >
      <i className="fa fa-tasks" />
    </button>
  );
}

TaskToggle.propTypes = {
  task: PropTypes.bool.isRequired,
  toggleTask: PropTypes.func.isRequired,
};

export default memo(TaskToggle);
