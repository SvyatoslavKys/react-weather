const WEATHER_API_KEY = "4981e52549cd12a6d1fd233bbf04edab"
const LAST_CITY_KEY = "weather:last-city"
const LAST_WEATHER_KEY = "weather:last-data"
const LAST_FORECAST_KEY = "weather:last-forecast"
export const WEATHER_STORAGE_EVENT = "weather:storage-updated"

function notifyWeatherStorageChange() {
  window.dispatchEvent(new Event(WEATHER_STORAGE_EVENT))
}

function readStoredJson(key) {
  const rawValue = localStorage.getItem(key)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue)
  } catch {
    localStorage.removeItem(key)
    return null
  }
}

function writeStoredValue(key, value) {
  localStorage.setItem(key, value)
  notifyWeatherStorageChange()
}

function removeStoredValue(key) {
  localStorage.removeItem(key)
  notifyWeatherStorageChange()
}

export function readStoredCity() {
  return localStorage.getItem(LAST_CITY_KEY) ?? ""
}

export function writeStoredCity(city) {
  writeStoredValue(LAST_CITY_KEY, city)
}

export function clearStoredCity() {
  removeStoredValue(LAST_CITY_KEY)
}

export function readStoredWeather() {
  return readStoredJson(LAST_WEATHER_KEY)
}

export function writeStoredWeather(weather) {
  writeStoredValue(LAST_WEATHER_KEY, JSON.stringify(weather))
}

export function clearStoredWeather() {
  removeStoredValue(LAST_WEATHER_KEY)
}

export function readStoredForecast() {
  return readStoredJson(LAST_FORECAST_KEY)
}

export function writeStoredForecast(forecast) {
  writeStoredValue(LAST_FORECAST_KEY, JSON.stringify(forecast))
}

export function clearStoredForecast() {
  removeStoredValue(LAST_FORECAST_KEY)
}

export async function getWeather(city) {
  const trimmedCity = city.trim()

  if (!trimmedCity) {
    throw new Error("Enter a city name.")
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(trimmedCity)}&units=metric&lang=en&appid=${WEATHER_API_KEY}`
  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to load weather data.")
  }

  return data
}

export async function getForecast(city) {
  const trimmedCity = city.trim()

  if (!trimmedCity) {
    throw new Error("Enter a city name.")
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(trimmedCity)}&units=metric&lang=en&appid=${WEATHER_API_KEY}`
  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to load forecast data.")
  }

  return data
}
