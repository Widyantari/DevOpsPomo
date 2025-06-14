import React, {
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import produce from 'immer';
import TaskContext from './context';
import Task from '../Task';
import TypeSelect from '../../TypeSelect';

import './styles.css';

function TaskList() {
  const [input, setInput] = useState('');
  const taskStatus = [
    { name: 'All', value: -1 },
    { name: 'On Progress', value: false },
    { name: 'Done', value: true },
  ];

  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('pomodoro-react-tasks');
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedStatus, setSelectedStatus] = useState(taskStatus[0]);

  useEffect(() => {
    window.localStorage.setItem('pomodoro-react-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const move = useCallback(
    (from, to) => {
      setTasks(
        produce(tasks, (draft) => {
          const taskMoved = draft[from];
          draft.splice(from, 1);
          draft.splice(to, 0, taskMoved);
        }),
      );
    },
    [tasks],
  );

  const handleStatus = useCallback(
    (task) => {
      setTasks(
        produce(tasks, (draft) => {
          const foundTask = draft.find((item) => item.id === task.id);
          if (foundTask) {
            foundTask.closed = !foundTask.closed;
          }
        }),
      );
    },
    [tasks],
  );

  const deleteTask = useCallback(
    (taskId) => {
      setTasks(
        produce(tasks, (draft) => {
          const foundIndex = draft.findIndex((item) => item.id === taskId);
          if (foundIndex !== -1) {
            draft.splice(foundIndex, 1);
          }
        }),
      );
    },
    [tasks],
  );

  const addTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setTasks(
      produce(tasks, (draft) => {
        draft.push({
          id: Date.now(),
          title: trimmed,
          closed: false,
        });
      }),
    );
    setInput('');
  };

  const filteredTasks = tasks.filter((task) => (
    selectedStatus.value === -1 || task.closed === selectedStatus.value
  ));

  const contextValue = useMemo(
    () => ({
      tasks,
      move,
      handleStatus,
      deleteTask,
    }),
    [tasks, move, handleStatus, deleteTask],
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <TaskContext.Provider value={contextValue}>
      <TypeSelect
        types={taskStatus}
        selected={selectedStatus}
        changeType={setSelectedStatus}
      />
      <div className="Tasks">
        <div className="Tasks-box">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <Task key={task.id} index={index} task={task} />
            ))
          ) : (
            <div className="Task">No Tasks</div>
          )}
        </div>
      </div>

      {/* --- 👇 BAGIAN INI YANG SAYA PERBAIKI --- */}
      <div className="Task AddTask-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New Task"
          onKeyDown={handleKeyDown}
        />
        <span
          onClick={addTask}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="AddTask-button"
        >
          Add
        </span>
      </div>
    </TaskContext.Provider>
  );
}

export default memo(TaskList);
