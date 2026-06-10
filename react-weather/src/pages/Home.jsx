import { useState } from "react"
import { PositionDetailsGrid } from "../components/home/PositionDetailsGrid"
import { getCurrentPosition } from "../services/getCurrentPosition"
import {
  getGeolocationErrorMessage,
  getPositionDetails,
} from "../utils/geolocationDisplay"

export function Homepage() {
  const [position, setPosition] = useState(null)
  const [status, setStatus] = useState("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const positionDetails = getPositionDetails(position)

  async function handleGetLocation() {
    setStatus("loading")
    setErrorMessage("")

    try {
      const nextPosition = await getCurrentPosition()

      setPosition(nextPosition)
      setStatus("success")
    } catch (error) {
      console.error("Geolocation error:", error)
      setPosition(null)
      setStatus("error")
      setErrorMessage(getGeolocationErrorMessage(error))
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
            Waiting for the browser to return your coordinates...
          </div>
        )}

        {position && <PositionDetailsGrid items={positionDetails} />}
      </article>
    </section>
  )
}
