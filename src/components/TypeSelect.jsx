import React, { memo } from 'react'
import PropTypes from 'prop-types'
import './TypeSelect.css'

function TypeSelect({ types, changeType, selected }) {
  return (
    <div className="TypeSelect">
      {types.map((type) => (
        <button
          type="button"
          key={type.name}
          onClick={() => changeType(type)}
          className={type.name === selected.name ? 'active' : ''}
        >
          {type.name}
        </button>
      ))}
    </div>
  )
}

TypeSelect.propTypes = {
  types: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  changeType: PropTypes.func.isRequired,
  selected: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
}

export default memo(TypeSelect)
