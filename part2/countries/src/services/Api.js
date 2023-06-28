import axios from 'axios'

const getCountries = () => {
  const request = axios.get('https://restcountries.com/v3.1/all')
  return request.then(response => response.data)
}

const getWeather = (capitalInfo) => {
  const api_key = process.env.REACT_APP_API_KEY
  const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${capitalInfo[0]}&lon=${capitalInfo[1]}&appid=${api_key}&units=metric`)
  return request.then(response => response.data)
}

export default { getCountries, getWeather }