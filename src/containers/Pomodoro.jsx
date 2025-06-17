import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TypeSelect from '../components/TypeSelect';
import TimeDisplay from '../components/TimeDisplay';
import Controls from '../components/Controls';
import Shortcuts from '../components/Shortcuts';
import ToggleSound from '../components/ToggleSound';
import ToggleTask from '../components/Tasks/TaskToggle';
import TaskList from '../components/Tasks/TaskList';

import './Pomodoro.css';

const getInitialTimes = (defaultTypes) => {
  try {
    const storedTimes = localStorage.getItem('pomodoro-custom-times');
    const parsedTimes = storedTimes ? JSON.parse(storedTimes) : null;
    if (Array.isArray(parsedTimes) && parsedTimes.length > 0) {
      return parsedTimes;
    }
  } catch (e) {
    // console.error("Gagal mengambil data waktu dari localStorage:", e);
  }
  return defaultTypes;
};

class Pomodoro extends Component {
  constructor(props) {
    super(props);
    const storedSound = localStorage.getItem('pomodoro-react-sound');
    const storedTask = localStorage.getItem('pomodoro-react-taskStatus');
    const initialTimes = getInitialTimes(props.types);
    const initialType = initialTimes.length > 0
      ? initialTimes[0]
      : { name: 'Error', time: 0 };

    this.state = {
      customTimes: initialTimes,
      selectedType: initialType,
      time: initialType.time,
      interval: null,
      running: false,
      sound: storedSound !== 'false',
      taskStatus: storedTask === 'true',
    };

    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keyup', this.handleKeyUp);
    Notification.requestPermission();
    this.sound = new Audio('bell.flac');
    this.sound.preload = 'auto';
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUp);
    this.stopInterval();
  }

  handleKeyUp = (event) => {
    const { customTimes } = this.state;
    if (event.target.tagName === 'INPUT') return;
    if (event.key === ' ') {
      this.pauseTimer();
    } else if (event.key === 'Escape') {
      this.resetTimer();
    } else if (event.key >= 1 && event.key <= customTimes.length) {
      this.changeType(customTimes[event.key - 1]);
    }
  };

  // --- 👇 FUNGSI INI SUDAH DIKEMBALIKAN KE VERSI ASLI ---
  changeType = (type) => {
    this.stopInterval();
    this.setState({
      selectedType: type,
      time: type.time,
      running: false,
    });
  };
  // --- 👆 ---

  handleTimeChange = (event) => {
    const { name, value } = event.target;
    const intValue = parseInt(value, 10) || 0;
    const {
      customTimes,
      selectedType,
      running,
    } = this.state;
    if (running) return;

    let currentMinutes = Math.floor(selectedType.time / 60);
    let currentSeconds = selectedType.time % 60;

    if (name === 'minutes') currentMinutes = Math.min(intValue, 99);
    if (name === 'seconds') currentSeconds = Math.min(intValue, 59);

    const newTotalSeconds = currentMinutes * 60 + currentSeconds;

    const newCustomTimes = customTimes.map((typeItem) => (
      typeItem.name === selectedType.name
        ? { ...typeItem, time: newTotalSeconds }
        : typeItem
    ));

    localStorage.setItem(
      'pomodoro-custom-times',
      JSON.stringify(newCustomTimes),
    );

    this.setState({
      customTimes: newCustomTimes,
      selectedType: { ...selectedType, time: newTotalSeconds },
      time: newTotalSeconds,
    });
  };

  handleToggleSound = () => {
    this.setState(({ sound }) => {
      const updated = !sound;
      localStorage.setItem('pomodoro-react-sound', updated);
      return { sound: updated };
    });
  };

  handleToggleTask = () => {
    this.setState(({ taskStatus }) => {
      const updated = !taskStatus;
      localStorage.setItem('pomodoro-react-taskStatus', updated);
      return { taskStatus: updated };
    });
  };

  stopInterval = () => {
    const { interval } = this.state;
    clearInterval(interval);
    this.setState({ interval: null });
  };

  startTimer = () => {
    const { interval, time, selectedType } = this.state;
    if (interval) return;
    this.setState({
      running: true,
      interval: setInterval(this.tick, 1000),
      time: time > 0 ? time : selectedType.time,
    });
    this.sound.pause();
    this.sound.currentTime = 0;
  };

  resetTimer = () => {
    const { selectedType } = this.state;
    this.stopInterval();
    this.setState({ time: selectedType.time, running: false });
  };

  pauseTimer = () => {
    this.setState((prevState) => {
      if (prevState.interval) {
        clearInterval(prevState.interval);
        return { running: false, interval: null };
      }
      this.startTimer();
      return null;
    });
  };

  getStatus = () => {
    const { time, running, selectedType } = this.state;
    if (time === 0) return 'Finished';
    if (running) return 'Running';
    if (!running && time < selectedType.time) return 'Paused';
    return 'Idle';
  };

  getProgress = () => {
    const { time, selectedType } = this.state;
    return selectedType.time === 0
      ? 0
      : ((selectedType.time - time) / selectedType.time) * 100;
  };

  tick() {
    this.setState((prevState) => {
      if (prevState.time <= 1) {
        this.stopInterval();
        if (prevState.sound) {
          this.sound.play();
        }
        try {
          navigator.serviceWorker.getRegistration().then((sw) => {
            if (sw) {
              sw.showNotification(`${prevState.selectedType.name} finished!`);
            }
          });
        } catch (_) {
          // Error silently ignored
        }
        return { time: 0, running: false };
      }
      return { time: prevState.time - 1 };
    });
  }

  render() {
    const {
      time,
      selectedType,
      sound,
      taskStatus,
      customTimes,
      running,
    } = this.state;
    const currentMinutes = Math.floor(selectedType.time / 60);
    const currentSeconds = selectedType.time % 60;

    return (
      <div className="Content">
        <div className="Pomodoro">
          <div className="Header">
            <h1>🍋Pomonade Timer🍋</h1>
            <p>Pomodoro Timer App</p>
          </div>

          <TypeSelect
            types={customTimes}
            selected={selectedType}
            changeType={this.changeType}
          />

          <div className="TimeInputGroup">
            <input
              type="number"
              name="minutes"
              className="time-input-box"
              value={currentMinutes}
              onChange={this.handleTimeChange}
              disabled={running}
              min="0"
              max="99"
            />
            <span className="time-input-separator">:</span>
            <input
              type="number"
              name="seconds"
              className="time-input-box"
              value={currentSeconds}
              onChange={this.handleTimeChange}
              disabled={running}
              min="0"
              max="59"
            />
          </div>

          <TimeDisplay
            time={time}
            status={this.getStatus()}
            progress={this.getProgress()}
          />

          <div className="ControlsContainer">
            <Controls
              start={this.startTimer}
              reset={this.resetTimer}
              pause={this.pauseTimer}
              status={this.getStatus()}
            />
          </div>

          <div className="BottomControls">
            <ToggleTask task={taskStatus} toggleTask={this.handleToggleTask} />
            <Shortcuts />
            <ToggleSound sound={sound} toggleSound={this.handleToggleSound} />
          </div>
        </div>

        {taskStatus && (
          <div className="TaskPainel">
            <div className="TaskPanel-header">
              <h2>To-Do List</h2>
            </div>
            <TaskList />
          </div>
        )}
      </div>
    );
  }
}

Pomodoro.propTypes = {
  types: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      time: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default Pomodoro;
