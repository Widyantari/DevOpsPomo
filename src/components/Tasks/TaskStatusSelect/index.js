import React, { memo } from 'react'
import './styles.css'

function TypeSelect({ types, changeType, selected }) {
  return (
    <div className="TypeSelect">
      {types.map((type, index) => (
        <button
          key={type.name}
          onClick={() => changeType(type)}
          className={type === selected ? 'active' : ''}
        >
          {type.name}
        </button>
      ))}
    </div>
  )
}

export default memo(TypeSelect)
