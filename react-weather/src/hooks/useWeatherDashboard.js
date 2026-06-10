import { useEffect, useState } from "react"
import {
  getForecast,
  getWeather,
  readStoredCity,
  readStoredForecast,
  readStoredWeather,
  writeStoredCity,
  writeStoredForecast,
  writeStoredWeather,
} from "../services/weatherApi"

export function useWeatherDashboard() {
  const [city, setCity] = useState(() => readStoredCity())
  const [weather, setWeather] = useState(() => readStoredWeather())
  const [forecast, setForecast] = useState(() => readStoredForecast())
  const [status, setStatus] = useState(() => {
    const storedCity = readStoredCity()
    const storedWeather = readStoredWeather()

    if (storedWeather) {
      return "success"
    }

    return storedCity ? "loading" : "idle"
  })
  const [errorMessage, setErrorMessage] = useState("")

  async function loadWeatherDashboard(nextCity, { showLoading = true } = {}) {
    const trimmedCity = nextCity.trim()

    if (!trimmedCity) {
      setStatus("error")
      setErrorMessage("Enter a city name.")
      return
    }

    if (showLoading) {
      setStatus("loading")
    }

    setErrorMessage("")

    try {
      const [nextWeather, nextForecast] = await Promise.all([
        getWeather(trimmedCity),
        getForecast(trimmedCity),
      ])

      setCity(trimmedCity)
      setWeather(nextWeather)
      setForecast(nextForecast)
      setStatus("success")
      writeStoredCity(trimmedCity)
      writeStoredWeather(nextWeather)
      writeStoredForecast(nextForecast)
    } catch (error) {
      console.error("weather dashboard error:", error)
      setStatus("error")
      setErrorMessage(error.message)
    }
  }

  async function handleSearch() {
    await loadWeatherDashboard(city)
  }

  useEffect(() => {
    const storedCity = readStoredCity()
    const hasCachedWeather = Boolean(readStoredWeather())
    const hasCachedForecast = Boolean(readStoredForecast())

    if (!storedCity) {
      return
    }

    let isCancelled = false

    async function refreshStoredWeather() {
      try {
        const [nextWeather, nextForecast] = await Promise.all([
          getWeather(storedCity),
          getForecast(storedCity),
        ])

        if (isCancelled) {
          return
        }

        setCity(storedCity)
        setWeather(nextWeather)
        setForecast(nextForecast)
        setStatus("success")
        setErrorMessage("")
        writeStoredWeather(nextWeather)
        writeStoredForecast(nextForecast)
      } catch (error) {
        if (isCancelled) {
          return
        }

        console.error("stored weather refresh error:", error)

        if (!hasCachedWeather && !hasCachedForecast) {
          setStatus("error")
          setErrorMessage(error.message)
        }
      }
    }

    void refreshStoredWeather()

    return () => {
      isCancelled = true
    }
  }, [])

  return {
    city,
    errorMessage,
    forecast,
    handleSearch,
    setCity,
    status,
    weather,
  }
}
