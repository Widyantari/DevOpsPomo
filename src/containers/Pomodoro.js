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
    // Aturan 'no-console' melarang adanya console.error di sini.
    // Gagal mengambil data akan kembali ke default secara diam-diam.
  }
  return defaultTypes;
};

class Pomodoro extends Component {
  constructor(props) {
    super(props);
    const storedSound = localStorage.getItem('pomodoro-react-sound');
    const storedTask = localStorage.getItem('pomodoro-react-taskStatus');
    const initialTimes = getInitialTimes(props.types);
    const initialType = (initialTimes && initialTimes.length > 0) ? initialTimes[0] : { name: 'Error', time: 0 };

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

    if (event.key === ' ') this.pauseTimer();
    else if (event.key === 'Escape') this.resetTimer();
    else if (event.key >= 1 && event.key <= customTimes.length) {
      this.changeType(customTimes[event.key - 1]);
    }
  };

  changeType = (type) => {
    this.stopInterval();
    this.setState({
      selectedType: type,
      time: type.time,
      running: false,
    });
  };

  handleTimeChange = (event) => {
    const { running, customTimes, selectedType } = this.state;
    if (running) return;

    const { name, value } = event.target;
    const intValue = parseInt(value, 10) || 0;

    let currentMinutes = Math.floor(selectedType.time / 60);
    let currentSeconds = selectedType.time % 60;

    if (name === 'minutes') {
      currentMinutes = intValue > 99 ? 99 : intValue;
    } else if (name === 'seconds') {
      currentSeconds = intValue > 59 ? 59 : intValue;
    }

    const newTotalSeconds = (currentMinutes * 60) + currentSeconds;

    const newCustomTimes = customTimes.map((type) => {
      if (type.name === selectedType.name) {
        return { ...type, time: newTotalSeconds };
      }
      return type;
    });

    localStorage.setItem('pomodoro-custom-times', JSON.stringify(newCustomTimes));

    this.setState({
      customTimes: newCustomTimes,
      selectedType: { ...selectedType, time: newTotalSeconds },
      time: newTotalSeconds,
    });
  };

  handleToggleSound = () => {
    // PERBAIKAN: Menggunakan updater function untuk setState
    this.setState((prevState) => ({ sound: !prevState.sound }), () => {
      const { sound } = this.state;
      localStorage.setItem('pomodoro-react-sound', sound);
    });
  };

  handleToggleTask = () => {
    // PERBAIKAN: Menggunakan updater function untuk setState
    this.setState((prevState) => ({ taskStatus: !prevState.taskStatus }), () => {
      const { taskStatus } = this.state;
      localStorage.setItem('pomodoro-react-taskStatus', taskStatus);
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
    this.setState({
      time: selectedType.time,
      running: false,
    });
  };

  pauseTimer = () => {
    // PERBAIKAN: Menggunakan updater function untuk setState
    this.setState((prevState) => {
      if (prevState.interval) {
        this.stopInterval();
        return { running: false };
      }
      this.startTimer();
      return null; // startTimer sudah mengatur state running
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
    if (selectedType.time === 0) return 0;
    return ((selectedType.time - time) / selectedType.time) * 100;
  };

  tick() {
    // PERBAIKAN: Menggunakan updater function untuk setState
    this.setState((prevState) => {
      if (prevState.time <= 1) {
        this.stopInterval();
        const { sound, selectedType } = this.state;
        if (sound) this.sound.play();
        try {
          navigator.serviceWorker.getRegistration().then((sw) => {
            if (sw) sw.showNotification(`${selectedType.name} finished!`);
          });
        } catch (e) { /* Gagal secara diam-diam */ }
        return { time: 0, running: false };
      }
      return { time: prevState.time - 1 };
    });
  }

  render() {
    // PERBAIKAN: Menggunakan destructuring untuk props dan state
    const {
      time, selectedType, sound, taskStatus, customTimes, running,
    } = this.state;
    const { types } = this.props;

    const currentMinutes = Math.floor(selectedType.time / 60);
    const currentSeconds = selectedType.time % 60;

    return (
      <div className="Content">
        <div className="Pomodoro">
          <div className="Header">
            <h1>Pomonade</h1>
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
            <Shortcuts types={types} />
            <ToggleSound sound={sound} toggleSound={this.handleToggleSound} />
          </div>
        </div>

        {taskStatus && (
          <div className="TaskPainel">
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