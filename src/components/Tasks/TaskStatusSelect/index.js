import React, { memo } from 'react'
import PropTypes from 'prop-types' // ✅ Import PropTypes
import './styles.css'

function TypeSelect({ types, changeType, selected }) {
  return (
    <div className="TypeSelect">
      {types.map((type) => (
        <button
          key={type.name}
          type="button" // ✅ Tambahin type biar gak dianggap submit
          onClick={() => changeType(type)}
          className={type === selected ? 'active' : ''}
        >
          {type.name}
        </button>
      ))}
    </div>
  )
}

// ✅ Tambah propTypes
TypeSelect.propTypes = {
  types: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
      ]),
    }),
  ).isRequired,
  changeType: PropTypes.func.isRequired,
  selected: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
  }).isRequired,
}

export default memo(TypeSelect)
