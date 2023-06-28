import React, { useState, useEffect } from 'react'
import Api from './services/Api'
import Filter from './components/Filter'
import CountriesList from './components/CountrieList'

function App() {
  const [countries, setCountries] = useState([])
  const [countryToFilter, setcountryToFilter] = useState('')
  const [weather, setWeather] = useState([])

  useEffect(() => {
    Api
      .getCountries()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  useEffect(() => {
    if (countriesToShow.length === 1) {
      Api
        .getWeather(countriesToShow[0].capitalInfo.latlng)
        .then(w => {
          setWeather(w)
        })
    }
    else {
      setWeather([])
    }
  }, [countryToFilter])

  const handleCountryToFilterChange = (event) => setcountryToFilter(event.target.value)

  const handleShowClick = (country) => {
    setcountryToFilter(country)
  }

  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(countryToFilter.toLowerCase())
  )

  return (
    <div>
      <Filter
        name={countryToFilter}
        handler={handleCountryToFilterChange}
      />
      <CountriesList
        countries={countriesToShow}
        handler={handleShowClick}
        weather={weather}
      />
    </div>
  );
}

export default App;
