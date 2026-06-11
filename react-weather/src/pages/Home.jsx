import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { PositionDetailsGrid } from "../components/home/PositionDetailsGrid"
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

export function Homepage() {
  const navigate = useNavigate()
  const [position, setPosition] = useState(null)
  const [status, setStatus] = useState("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const positionDetails = getPositionDetails(position)

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
      navigate("/weather")
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
      <article className="rounded-[2.5rem] border border-white/20 bg-slate-950/18 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={() => void handleGetLocation()}
            disabled={status === "loading"}
            className="min-h-14 rounded-[1.25rem] border border-white/28 bg-white/18 px-5 text-sm font-semibold tracking-[0.16em] text-white transition hover:bg-white/24 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "REQUESTING LOCATION" : "GET MY GEOLOCATION"}
          </button>

          <span className="rounded-full border border-white/16 bg-white/8 px-4 py-2 text-sm text-white/78">
            Status: {status}
          </span>
        </div>

        {status === "error" && (
          <div className="mt-6 rounded-[1.5rem] border border-rose-200/35 bg-rose-500/15 px-4 py-4 text-sm text-white/92">
            {errorMessage}
          </div>
        )}

        {status === "loading" && (
          <div className="mt-6 rounded-[1.5rem] border border-white/16 bg-white/8 px-4 py-4 text-sm text-white/78">
            Requesting coordinates and syncing weather for your current location...
          </div>
        )}

        {position && <PositionDetailsGrid items={positionDetails} />}
      </article>
    </section>
  )
}
