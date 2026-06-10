const THEME_DEBUG_STORAGE_KEY = "weather:theme-debug"

export const WEATHER_THEME_DEBUG_EVENT = "weather:theme-debug-updated"
export const DEBUG_SEASONS = ["winter", "spring", "summer", "autumn"]
export const DEBUG_TIMES_OF_DAY = ["day", "night"]
export const DEBUG_WEATHER_TYPES = [
  "clear",
  "cloudy",
  "rain",
  "snow",
  "storm",
  "mist",
  "wind",
]

export const DEFAULT_THEME_DEBUG_OVERRIDE = {
  enabled: false,
  season: "summer",
  timeOfDay: "day",
  weatherType: "clear",
}

export const NEUTRAL_WEATHER_THEME = {
  backgroundKey: "neutral",
  description: "Neutral fallback background",
  localTime: "--:--",
  mode: "light",
  scene: "neutral",
  season: "neutral",
  timeOfDay: "day",
  weatherMain: "Neutral",
  weatherType: "neutral",
}

function notifyThemeDebugChange() {
  window.dispatchEvent(new Event(WEATHER_THEME_DEBUG_EVENT))
}

function getShiftedDate(unixSeconds, timezoneOffsetSeconds) {
  return new Date((unixSeconds + timezoneOffsetSeconds) * 1000)
}

function formatLocalTime(unixSeconds, timezoneOffsetSeconds) {
  const localDate = getShiftedDate(unixSeconds, timezoneOffsetSeconds)

  return localDate.toISOString().slice(11, 16)
}

function getSeason(monthIndex, latitude = 0) {
  const adjustedMonth = latitude < 0 ? (monthIndex + 6) % 12 : monthIndex

  if (adjustedMonth === 11 || adjustedMonth === 0 || adjustedMonth === 1) {
    return "winter"
  }

  if (adjustedMonth >= 2 && adjustedMonth <= 4) {
    return "spring"
  }

  if (adjustedMonth >= 5 && adjustedMonth <= 7) {
    return "summer"
  }

  return "autumn"
}

function getSceneFromWeatherType(weatherType, timeOfDay) {
  switch (weatherType) {
    case "storm":
      return "storm"
    case "snow":
      return "snow"
    case "rain":
      return "rain"
    case "cloudy":
      return timeOfDay === "day" ? "cloudy-day" : "cloudy-night"
    case "mist":
      return "mist"
    case "wind":
      return "wind"
    case "clear":
    default:
      return timeOfDay === "day" ? "clear-day" : "clear-night"
  }
}

function getWeatherTypeFromLiveWeather(weatherMain, windSpeed = 0) {
  if (windSpeed >= 10 && (weatherMain === "Clear" || weatherMain === "Clouds")) {
    return "wind"
  }

  switch (weatherMain) {
    case "Thunderstorm":
      return "storm"
    case "Snow":
      return "snow"
    case "Rain":
    case "Drizzle":
      return "rain"
    case "Clouds":
      return "cloudy"
    case "Mist":
    case "Smoke":
    case "Haze":
    case "Dust":
    case "Fog":
    case "Sand":
    case "Ash":
    case "Squall":
    case "Tornado":
      return "mist"
    case "Clear":
    default:
      return "clear"
  }
}

function getWeatherMainFromWeatherType(weatherType) {
  switch (weatherType) {
    case "storm":
      return "Thunderstorm"
    case "snow":
      return "Snow"
    case "rain":
      return "Rain"
    case "cloudy":
      return "Clouds"
    case "mist":
      return "Mist"
    case "wind":
      return "Wind"
    case "clear":
    default:
      return "Clear"
  }
}

function normalizeThemeDebugOverride(override = {}) {
  const enabled = Boolean(override.enabled)
  const season = DEBUG_SEASONS.includes(override.season)
    ? override.season
    : DEFAULT_THEME_DEBUG_OVERRIDE.season
  const timeOfDay = DEBUG_TIMES_OF_DAY.includes(override.timeOfDay)
    ? override.timeOfDay
    : DEFAULT_THEME_DEBUG_OVERRIDE.timeOfDay
  const weatherType = DEBUG_WEATHER_TYPES.includes(override.weatherType)
    ? override.weatherType
    : DEFAULT_THEME_DEBUG_OVERRIDE.weatherType

  return {
    enabled,
    season,
    timeOfDay,
    weatherType,
  }
}

function createTheme({
  description = "",
  localTime = "12:00",
  season,
  timeOfDay,
  weatherType,
}) {
  return {
    backgroundKey: `${season}-${timeOfDay}`,
    description,
    localTime,
    mode: timeOfDay === "day" ? "light" : "dark",
    scene: getSceneFromWeatherType(weatherType, timeOfDay),
    season,
    timeOfDay,
    weatherMain: getWeatherMainFromWeatherType(weatherType),
    weatherType,
  }
}

export function readThemeDebugOverride() {
  const rawOverride = localStorage.getItem(THEME_DEBUG_STORAGE_KEY)

  if (!rawOverride) {
    return null
  }

  try {
    return normalizeThemeDebugOverride(JSON.parse(rawOverride))
  } catch {
    localStorage.removeItem(THEME_DEBUG_STORAGE_KEY)
    return null
  }
}

export function writeThemeDebugOverride(override) {
  const normalizedOverride = normalizeThemeDebugOverride(override)

  localStorage.setItem(THEME_DEBUG_STORAGE_KEY, JSON.stringify(normalizedOverride))
  notifyThemeDebugChange()
}

export function clearThemeDebugOverride() {
  localStorage.removeItem(THEME_DEBUG_STORAGE_KEY)
  notifyThemeDebugChange()
}

export function getThemeFromDebugOverride(override) {
  const normalizedOverride = normalizeThemeDebugOverride(override)
  const localTime = normalizedOverride.timeOfDay === "day" ? "12:00" : "22:00"

  return createTheme({
    description: "Debug background override",
    localTime,
    season: normalizedOverride.season,
    timeOfDay: normalizedOverride.timeOfDay,
    weatherType: normalizedOverride.weatherType,
  })
}

export function getDefaultWeatherTheme(now = new Date()) {
  const shiftedNow = new Date(Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
  ))
  const hour = shiftedNow.getUTCHours()
  const monthIndex = shiftedNow.getUTCMonth()
  const timeOfDay = hour >= 6 && hour < 18 ? "day" : "night"
  const season = getSeason(monthIndex)

  return createTheme({
    localTime: shiftedNow.toISOString().slice(11, 16),
    season,
    timeOfDay,
    weatherType: "clear",
  })
}

export function getWeatherTheme(weather) {
  if (!weather) {
    return null
  }

  if (
    weather.dt == null ||
    weather.timezone == null ||
    weather.coord?.lat == null ||
    !weather.weather?.[0]?.main
  ) {
    return null
  }

  const weatherMain = weather.weather?.[0]?.main ?? "Clear"
  const description = weather.weather?.[0]?.description ?? ""
  const currentTime = weather.dt ?? 0
  const timezoneOffset = weather.timezone ?? 0
  const latitude = weather.coord?.lat ?? 50
  const localDate = getShiftedDate(currentTime, timezoneOffset)
  const sunrise = weather.sys?.sunrise ?? 0
  const sunset = weather.sys?.sunset ?? 0
  const isDay = currentTime >= sunrise && currentTime < sunset
  const timeOfDay = isDay ? "day" : "night"
  const season = getSeason(localDate.getUTCMonth(), latitude)
  const windSpeed = weather.wind?.speed ?? 0
  const weatherType = getWeatherTypeFromLiveWeather(weatherMain, windSpeed)

  return createTheme({
    description,
    localTime: formatLocalTime(currentTime, timezoneOffset),
    season,
    timeOfDay,
    weatherType,
  })
}
