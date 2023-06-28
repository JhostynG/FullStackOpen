import React from 'react'

const Weather = ({ weather, city }) => {
  if (weather.length === 0) {
    return <></>
  }
  const image = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  return (
    <div>
      <h2>Weather in {city}</h2>
      <p>temperature: {weather.main.temp} Celcius</p>
      <img src={image} alt='weather' />
      <p>wind: {weather.wind.speed} m/s</p>
    </div>
  )
}

export default Weather