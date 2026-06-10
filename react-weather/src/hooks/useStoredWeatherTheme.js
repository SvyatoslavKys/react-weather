import { useEffect, useState } from "react"
import {
  readStoredWeather,
  WEATHER_STORAGE_EVENT,
} from "../services/weatherApi"
import {
  getThemeFromDebugOverride,
  getWeatherTheme,
  NEUTRAL_WEATHER_THEME,
  readThemeDebugOverride,
  WEATHER_THEME_DEBUG_EVENT,
} from "../utils/weatherTheme"

export function useStoredWeatherTheme() {
  const [weather, setWeather] = useState(() => readStoredWeather())
  const [themeDebugOverride, setThemeDebugOverride] = useState(() =>
    readThemeDebugOverride()
  )

  useEffect(() => {
    function syncStoredThemeState() {
      setWeather(readStoredWeather())
      setThemeDebugOverride(readThemeDebugOverride())
    }

    window.addEventListener(WEATHER_STORAGE_EVENT, syncStoredThemeState)
    window.addEventListener(WEATHER_THEME_DEBUG_EVENT, syncStoredThemeState)
    window.addEventListener("storage", syncStoredThemeState)

    return () => {
      window.removeEventListener(WEATHER_STORAGE_EVENT, syncStoredThemeState)
      window.removeEventListener(WEATHER_THEME_DEBUG_EVENT, syncStoredThemeState)
      window.removeEventListener("storage", syncStoredThemeState)
    }
  }, [])

  const liveWeatherTheme = getWeatherTheme(weather)
  const theme = themeDebugOverride?.enabled
    ? getThemeFromDebugOverride(themeDebugOverride)
    : liveWeatherTheme ?? NEUTRAL_WEATHER_THEME

  return {
    theme,
    themeDebugOverride,
    weather,
  }
}
