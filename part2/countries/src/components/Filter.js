import React from 'react'

const Filter = (props) => {
  return (
    <div>
      find countries:
      <input
        value={props.name}
        onChange={props.handler}
      />
    </div>
  )
}

export default Filter