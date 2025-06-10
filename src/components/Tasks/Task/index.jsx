import React, { useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import './styles.css';

import TaskContext from '../TaskList/context';

export default function Task({ task, index }) {
  const ref = useRef();
  const { move, handleStatus } = useContext(TaskContext);
  const [{ isDragging }, dragRef] = useDrag({
    type: 'TASK',
    item: { id: task.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'TASK',
    hover(item, monitor) {
      if (item.id === task.id) return;
      const dragged = item;
      const target = task;
      const targetSize = ref.current.getBoundingClientRect();
      const targetCenter = (targetSize.bottom - targetSize.top) / 2;
      const draggedOffset = monitor.getClientOffset();
      const draggedTop = draggedOffset.y - targetSize.top;

      if (dragged.order < target.order && draggedTop < targetCenter) return;
      if (dragged.order > target.order && draggedTop > targetCenter) return;

      move(item.index, index);
      /* eslint-disable no-param-reassign */
      item.index = index;
      /* eslint-enable no-param-reassign */
    },
  });

  dragRef(dropRef(ref));

  return (
    <div ref={ref} className={isDragging ? 'Task Dragging' : 'Task'}>
      <div>{task.title}</div>
      <span
        role="button"
        tabIndex="0"
        onClick={() => handleStatus(task)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleStatus(task);
        }}
      >
        {task.closed ? 'Open' : 'Close'}
      </span>
    </div>
  );
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    closed: PropTypes.bool.isRequired,
    order: PropTypes.number,
  }).isRequired,
  index: PropTypes.number.isRequired,
};
