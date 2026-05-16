import { useState } from 'react'
import { SearchBar } from "../components/SearchBar"
import { getWeather } from '../services/weatherApi'

export function WeatherPage() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)

  const handleSearch = async () => {
    const data = await getWeather(city)
    setWeather(data)
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-black">Weather</h1>
      <SearchBar city={city} onCityChange={setCity} onSearch={handleSearch} />
      {weather && (
        <div>
          <p>{weather.name}</p>
          <p>{weather.main.temp}°C</p>
        </div>
      )}
    </>
  )
}
    