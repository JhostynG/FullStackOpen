import React from 'react'
import Weather from './Weather'

const countryInfo = ({ country, weather }) => {
  const languages = Object.values(country.languages)
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <h2>languages</h2>
      <ul>
        {languages.map(language => <li key={language}> {language}</li>)}
      </ul>
      <img src={country.flags.png} alt='Flag' />
      <Weather weather={weather} city={country.capital[0]} />
    </div>
  )
}

export default countryInfo