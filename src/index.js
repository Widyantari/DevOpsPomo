import React from 'react'
import ReactDOM from 'react-dom'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import Pomodoro from './containers/Pomodoro'

const types = [
  { name: 'Pomodoro Timer', time: 25 * 60 },
  { name: 'Istirahat Sebentar', time: 5 * 60 },
  { name: 'Istirahat Lama', time: 15 * 60 },
]

ReactDOM.render(
  <DndProvider backend={HTML5Backend}>
    <Pomodoro types={types} />
  </DndProvider>,
  document.getElementById('root'),
)
