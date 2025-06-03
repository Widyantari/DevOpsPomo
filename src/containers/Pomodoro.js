import React, { Component } from 'react'
import PropTypes from 'prop-types'

import TypeSelect from '../components/TypeSelect'
import TimeDisplay from '../components/TimeDisplay'
import Controls from '../components/Controls'
import Shortcuts from '../components/Shortcuts'
import ToggleSound from '../components/ToggleSound'
import ToggleTask from '../components/Tasks/TaskToggle'
import TaskList from '../components/Tasks/TaskList'

import './Pomodoro.css'

class Pomodoro extends Component {
  constructor(props) {
    super(props)
    const storedSound = localStorage.getItem('pomodoro-react-sound')
    const storedTask = localStorage.getItem('pomodoro-react-taskStatus')

    this.state = {
      selectedType: props.types[0],
      time: props.types[0].time,
      interval: null,
      running: false,
      sound: storedSound !== 'false',
      taskStatus: storedTask === 'true',
    }

    this.tick = this.tick.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keyup', this.handleKeyUp)
    Notification.requestPermission()
    this.sound = new Audio('bell.flac')
    this.sound.preload = 'auto'
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUp)
    this.stopInterval()
  }

  handleKeyUp = (event) => {
    const { types } = this.props
    if (event.target.tagName === 'INPUT') return
    if (event.key === ' ') {
      this.pauseTimer()
    } else if (event.key === 'Escape') {
      this.resetTimer()
    } else if (event.key >= 1 && event.key <= types.length) {
      this.changeType(types[event.key - 1])
    }
  }

  changeType = (type) => {
    this.resetTimer()
    this.setState({ selectedType: type, time: type.time, running: false })
  }

  handleToggleSound = () => {
    this.setState(
      (state) => ({ sound: !state.sound }),
      () => {
        const { sound } = this.state
        localStorage.setItem('pomodoro-react-sound', sound)
      },
    )
  }

  handleToggleTask = () => {
    this.setState(
      (state) => ({ taskStatus: !state.taskStatus }),
      () => {
        const { taskStatus } = this.state
        localStorage.setItem('pomodoro-react-taskStatus', taskStatus)
      },
    )
  }

  stopInterval = () => {
    const { interval } = this.state
    clearInterval(interval)
    this.setState({ interval: null })
  }

  startTimer = () => {
    const { interval, time, selectedType } = this.state
    if (interval) return
    this.setState({
      running: true,
      interval: setInterval(this.tick, 1000),
      time: time > 0 ? time : selectedType.time,
    })
    this.sound.pause()
    this.sound.currentTime = 0
  }

  resetTimer = () => {
    const { selectedType } = this.state
    this.stopInterval()
    this.setState({
      time: selectedType.time,
      running: false,
    })
  }

  pauseTimer = () => {
    const { interval } = this.state
    if (interval) {
      this.stopInterval()
      this.setState({ running: true })
    } else {
      this.startTimer()
    }
  }

  getStatus = () => {
    const { time, running, interval } = this.state
    if (time === 0) return 'Finished'
    if (running && !interval) return 'Paused'
    if (running) return 'Running'
    return 'Idle'
  }

  getProgress = () => {
    const { time, selectedType } = this.state
    return ((selectedType.time - time) / selectedType.time) * 100
  }

  tick() {
    this.setState((state) => {
      if (state.time <= 1) {
        this.stopInterval()
        if (state.sound) this.sound.play()
        try {
          navigator.serviceWorker.getRegistration().then((sw) => {
            if (sw) {
              sw.showNotification(`${state.selectedType.name} finished!`)
            }
          })
        } catch (e) {
          // Notification failed silently
        }
        return { time: 0, running: false }
      }
      return { time: state.time - 1 }
    })
  }

  render() {
    const {
      time, selectedType, sound, taskStatus,
    } = this.state

    const { types } = this.props

    return (
      <div className="Content">
        <div className="Pomodoro">
          <TypeSelect
            types={types}
            selected={selectedType}
            changeType={this.changeType}
          />
          <TimeDisplay
            time={time}
            status={this.getStatus()}
            progress={this.getProgress()}
          />
          <Controls
            start={this.startTimer}
            reset={this.resetTimer}
            pause={this.pauseTimer}
            status={this.getStatus()}
          />
          <ToggleTask task={taskStatus} toggleTask={this.handleToggleTask} />
          <Shortcuts />
          <ToggleSound sound={sound} toggleSound={this.handleToggleSound} />
        </div>
        {taskStatus && (
          <div className="TaskPainel">
            <TaskList />
          </div>
        )}
      </div>
    )
  }
}

Pomodoro.propTypes = {
  types: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      time: PropTypes.number.isRequired,
    }),
  ).isRequired,
}

export default Pomodoro
