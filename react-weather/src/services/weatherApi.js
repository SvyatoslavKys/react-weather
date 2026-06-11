const WEATHER_API_KEY = "4981e52549cd12a6d1fd233bbf04edab"
const LAST_CITY_KEY = "weather:last-city"
const LAST_LOCATION_KEY = "weather:last-location"
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

function normalizeCoordinates(lat, lon) {
  const normalizedLat = Number(lat)
  const normalizedLon = Number(lon)

  if (!Number.isFinite(normalizedLat) || !Number.isFinite(normalizedLon)) {
    throw new Error("Location coordinates are invalid.")
  }

  return {
    lat: normalizedLat,
    lon: normalizedLon,
  }
}

function buildApiUrl(pathname, searchParams) {
  const params = new URLSearchParams({
    ...searchParams,
    appid: WEATHER_API_KEY,
    lang: "en",
    units: "metric",
  })

  return `https://api.openweathermap.org/data/2.5/${pathname}?${params.toString()}`
}

async function fetchWeatherResource(pathname, searchParams, fallbackMessage) {
  const url = buildApiUrl(pathname, searchParams)
  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message ?? fallbackMessage)
  }

  return data
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

export function readStoredLocation() {
  return readStoredJson(LAST_LOCATION_KEY)
}

export function writeStoredLocation(location) {
  const normalizedLocation = normalizeCoordinates(location?.lat, location?.lon)

  writeStoredValue(LAST_LOCATION_KEY, JSON.stringify(normalizedLocation))
}

export function clearStoredLocation() {
  removeStoredValue(LAST_LOCATION_KEY)
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

export function persistWeatherSnapshot({
  city,
  forecast,
  location,
  weather,
}) {
  if (typeof city === "string") {
    localStorage.setItem(LAST_CITY_KEY, city)
  }

  if (location === null) {
    localStorage.removeItem(LAST_LOCATION_KEY)
  } else if (location !== undefined) {
    const normalizedLocation = normalizeCoordinates(location?.lat, location?.lon)

    localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(normalizedLocation))
  }

  if (weather) {
    localStorage.setItem(LAST_WEATHER_KEY, JSON.stringify(weather))
  }

  if (forecast) {
    localStorage.setItem(LAST_FORECAST_KEY, JSON.stringify(forecast))
  }

  notifyWeatherStorageChange()
}

export async function getWeather(city) {
  const trimmedCity = city.trim()

  if (!trimmedCity) {
    throw new Error("Enter a city name.")
  }

  return fetchWeatherResource(
    "weather",
    { q: trimmedCity },
    "Failed to load weather data."
  )
}

export async function getForecast(city) {
  const trimmedCity = city.trim()

  if (!trimmedCity) {
    throw new Error("Enter a city name.")
  }

  return fetchWeatherResource(
    "forecast",
    { q: trimmedCity },
    "Failed to load forecast data."
  )
}

export async function getWeatherByCoordinates(lat, lon) {
  const coordinates = normalizeCoordinates(lat, lon)

  return fetchWeatherResource(
    "weather",
    {
      lat: coordinates.lat.toFixed(6),
      lon: coordinates.lon.toFixed(6),
    },
    "Failed to load weather data for the current location."
  )
}

export async function getForecastByCoordinates(lat, lon) {
  const coordinates = normalizeCoordinates(lat, lon)

  return fetchWeatherResource(
    "forecast",
    {
      lat: coordinates.lat.toFixed(6),
      lon: coordinates.lon.toFixed(6),
    },
    "Failed to load forecast data for the current location."
  )
}
