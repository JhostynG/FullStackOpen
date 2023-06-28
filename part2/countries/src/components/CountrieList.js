import React from 'react'
import Country from './Country'
import CountryInfo from './CountryInfo'

const CountrieList = ({ countries, weather, handler }) => {
  if (!countries) return <div>no countrie found</div>

  if (countries.length === 1) {
    return <CountryInfo country={countries[0]} weather={weather} />
  }

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }


  return (
    <div>
      {countries.map(country =>
        <Country key={country.name.common} country={country} handler={handler} />)
      }
    </div>
  )
}

export default CountrieList