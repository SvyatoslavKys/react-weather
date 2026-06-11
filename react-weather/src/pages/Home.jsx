import { useState } from "react"
import { PositionDetailsGrid } from "../components/home/PositionDetailsGrid"
import { useStoredWeatherTheme } from "../hooks/useStoredWeatherTheme"
import { getCurrentPosition } from "../services/getCurrentPosition"
import {
  getForecastByCoordinates,
  getWeatherByCoordinates,
  persistWeatherSnapshot,
} from "../services/weatherApi"
import {
  getGeolocationErrorMessage,
  getPositionDetails,
} from "../utils/geolocationDisplay"
import { clearThemeDebugOverride } from "../utils/weatherTheme"
import {
  capitalizeFirstLetter,
  formatLocation,
  formatTemperature,
} from "../utils/weatherDisplay"

export function Homepage() {
  const { theme, weather } = useStoredWeatherTheme()
  const [position, setPosition] = useState(null)
  const [status, setStatus] = useState("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const positionDetails = getPositionDetails(position)
  const isLight = theme.mode === "light"

  async function handleGetLocation() {
    setStatus("loading")
    setErrorMessage("")
    let nextPosition = null

    try {
      nextPosition = await getCurrentPosition()
      const latitude = nextPosition.coords.latitude
      const longitude = nextPosition.coords.longitude

      setPosition(nextPosition)

      const [nextWeather, nextForecast] = await Promise.all([
        getWeatherByCoordinates(latitude, longitude),
        getForecastByCoordinates(latitude, longitude),
      ])

      const resolvedCity = nextWeather.name?.trim() || "Current location"

      clearThemeDebugOverride()
      persistWeatherSnapshot({
        city: resolvedCity,
        forecast: nextForecast,
        location: {
          lat: latitude,
          lon: longitude,
        },
        weather: nextWeather,
      })

      setStatus("success")
    } catch (error) {
      console.error("Geolocation weather flow error:", error)

      if (!nextPosition) {
        setPosition(null)
      }

      setStatus("error")
      setErrorMessage(
        nextPosition
          ? error.message ?? "Failed to load weather for the current location."
          : getGeolocationErrorMessage(error)
      )
    }
  }

  return (
    <section className="mx-auto max-w-3xl pb-10 text-white">
      <article className={`rounded-[2.5rem] border p-6 shadow-2xl backdrop-blur-2xl sm:p-8 ${
        isLight
          ? "border-slate-900/12 bg-white/16"
          : "border-white/20 bg-slate-950/18"
      }`}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={() => void handleGetLocation()}
            disabled={status === "loading"}
            className={`min-h-14 rounded-[1.25rem] border px-5 text-sm font-semibold tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isLight
                ? "border-slate-900/12 bg-slate-950/8 text-slate-950 hover:bg-slate-950/14"
                : "border-white/28 bg-white/18 text-white hover:bg-white/24"
            }`}
          >
            {status === "loading" ? "REQUESTING LOCATION" : "GET MY GEOLOCATION"}
          </button>

          <span className={`rounded-full border px-4 py-2 text-sm ${
            isLight
              ? "border-slate-900/10 bg-white/14 text-slate-900/72"
              : "border-white/16 bg-white/8 text-white/78"
          }`}>
            Status: {status}
          </span>
        </div>

        {status === "error" && (
          <div className={`mt-6 rounded-[1.5rem] border px-4 py-4 text-sm ${
            isLight
              ? "border-rose-400/30 bg-rose-500/12 text-rose-950/90"
              : "border-rose-200/35 bg-rose-500/15 text-white/92"
          }`}>
            {errorMessage}
          </div>
        )}

        {status === "loading" && (
          <div className={`mt-6 rounded-[1.5rem] border px-4 py-4 text-sm ${
            isLight
              ? "border-slate-900/10 bg-white/12 text-slate-900/66"
              : "border-white/16 bg-white/8 text-white/78"
          }`}>
            Requesting coordinates and syncing weather for your current location...
          </div>
        )}

        {status === "success" && position && weather && (
          <div className={`mt-6 rounded-[1.5rem] border px-4 py-4 ${
            isLight
              ? "border-emerald-500/18 bg-emerald-500/8"
              : "border-emerald-200/20 bg-emerald-500/10"
          }`}>
            <p className={`text-xs uppercase tracking-[0.28em] ${
              isLight ? "text-slate-900/44" : "text-white/54"
            }`}>
              Weather Synced
            </p>
            <p className={`mt-3 text-xl font-semibold ${
              isLight ? "text-slate-950" : "text-white"
            }`}>
              {formatLocation(weather)}
            </p>
            <p className={`mt-2 text-sm ${
              isLight ? "text-slate-900/68" : "text-white/78"
            }`}>
              {capitalizeFirstLetter(weather.weather?.[0]?.description ?? "Weather loaded")}
              {"  |  "}
              {formatTemperature(weather.main?.temp ?? 0)}
              {"  |  "}
              {theme.season} {theme.timeOfDay}
            </p>
          </div>
        )}

        {position && (
          <PositionDetailsGrid
            items={positionDetails}
            mode={theme.mode}
          />
        )}
      </article>
    </section>
  )
}
