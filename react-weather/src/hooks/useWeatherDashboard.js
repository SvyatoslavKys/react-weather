import { useEffect, useState } from "react"
import {
  getForecast,
  getForecastByCoordinates,
  getWeather,
  getWeatherByCoordinates,
  persistWeatherSnapshot,
  readStoredCity,
  readStoredForecast,
  readStoredLocation,
  readStoredWeather,
} from "../services/weatherApi"

export function useWeatherDashboard() {
  const [city, setCity] = useState(() => readStoredCity())
  const [weather, setWeather] = useState(() => readStoredWeather())
  const [forecast, setForecast] = useState(() => readStoredForecast())
  const [status, setStatus] = useState(() => {
    const storedCity = readStoredCity()
    const storedLocation = readStoredLocation()
    const storedWeather = readStoredWeather()

    if (storedWeather) {
      return "success"
    }

    return storedCity || storedLocation ? "loading" : "idle"
  })
  const [errorMessage, setErrorMessage] = useState("")

  function applyResolvedWeather({
    nextCity,
    nextForecast,
    nextLocation,
    nextWeather,
  }) {
    setCity(nextCity)
    setWeather(nextWeather)
    setForecast(nextForecast)
    setStatus("success")
    setErrorMessage("")
    persistWeatherSnapshot({
      city: nextCity,
      forecast: nextForecast,
      location: nextLocation,
      weather: nextWeather,
    })
  }

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

      applyResolvedWeather({
        nextCity: trimmedCity,
        nextForecast,
        nextLocation: null,
        nextWeather,
      })
    } catch (error) {
      console.error("weather dashboard error:", error)
      setStatus("error")
      setErrorMessage(error.message)
    }
  }

  async function handleSearch() {
    await loadWeatherDashboard(city)
  }

  async function loadWeatherByLocation(location, { showLoading = true } = {}) {
    const lat = location?.lat ?? location?.latitude
    const lon = location?.lon ?? location?.longitude

    if (showLoading) {
      setStatus("loading")
    }

    setErrorMessage("")

    try {
      const [nextWeather, nextForecast] = await Promise.all([
        getWeatherByCoordinates(lat, lon),
        getForecastByCoordinates(lat, lon),
      ])

      const resolvedCity = nextWeather.name?.trim() || city || "Current location"

      applyResolvedWeather({
        nextCity: resolvedCity,
        nextForecast,
        nextLocation: { lat, lon },
        nextWeather,
      })

      return {
        forecast: nextForecast,
        weather: nextWeather,
      }
    } catch (error) {
      console.error("location weather error:", error)
      setStatus("error")
      setErrorMessage(error.message)
      throw error
    }
  }

  useEffect(() => {
    const storedCity = readStoredCity()
    const storedLocation = readStoredLocation()
    const hasCachedWeather = Boolean(readStoredWeather())
    const hasCachedForecast = Boolean(readStoredForecast())

    if (!storedCity && !storedLocation) {
      return
    }

    let isCancelled = false

    async function refreshStoredWeather() {
      try {
        const [nextWeather, nextForecast] = storedLocation
          ? await Promise.all([
              getWeatherByCoordinates(storedLocation.lat, storedLocation.lon),
              getForecastByCoordinates(storedLocation.lat, storedLocation.lon),
            ])
          : await Promise.all([
              getWeather(storedCity),
              getForecast(storedCity),
            ])

        if (isCancelled) {
          return
        }

        const resolvedCity = nextWeather.name?.trim() || storedCity || "Current location"

        applyResolvedWeather({
          nextCity: resolvedCity,
          nextForecast,
          nextLocation: storedLocation ?? null,
          nextWeather,
        })
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
    loadWeatherByLocation,
    setCity,
    status,
    weather,
  }
}
