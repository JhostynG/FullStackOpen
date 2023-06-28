import React from 'react'

const Country = ({ country, handler }) => {

  return (
    <div>
      <p>
        {country.name.common} <button onClick={() => handler(country.name.common)}>show</button>
      </p>
    </div>
  )
}

export default Country