import { WeatherCard } from "../WeatherCard"
import { getHourlyForecast } from "../../utils/weatherDisplay"

export function ForecastStrip({ forecast, mode = "dark", panelClasses, weather }) {
  const isLight = mode === "light"
  const hourlyForecast = getHourlyForecast(forecast)
  const timezone = forecast?.city?.timezone ?? weather.timezone

  return (
    <section
      className={`mx-auto max-w-5xl rounded-[2.25rem] border p-4 shadow-2xl backdrop-blur-2xl sm:p-7 ${panelClasses}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={`text-xs uppercase tracking-[0.32em] ${
            isLight ? "text-slate-900/42" : "text-white/52"
          }`}>
            Forecast line
          </p>
          <h3 className={`mt-2 text-xl font-semibold sm:text-2xl ${
            isLight ? "text-slate-950" : "text-white"
          }`}>
            Upcoming Hours
          </h3>
        </div>
        <p className={`text-sm ${isLight ? "text-slate-900/58" : "text-white/68"}`}>
          OpenWeather 3-hour forecast samples
        </p>
      </div>

      {hourlyForecast.length > 0 ? (
        <div className="-mx-1 mt-5 overflow-x-auto pb-2 sm:mx-0 sm:mt-6 sm:overflow-visible sm:pb-0">
          <div className="flex w-max snap-x snap-mandatory gap-3 px-1 sm:grid sm:w-auto sm:grid-cols-2 sm:px-0 lg:grid-cols-5">
            {hourlyForecast.map((item) => (
              <WeatherCard
                key={item.dt}
                item={item}
                mode={mode}
                timezone={timezone}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className={`mt-6 rounded-[1.6rem] border px-4 py-8 text-center text-sm ${
          isLight
            ? "border-slate-900/10 bg-slate-950/6 text-slate-900/62"
            : "border-white/16 bg-white/8 text-white/72"
        }`}>
          Forecast samples will appear here after the next successful weather request.
        </div>
      )}
    </section>
  )
}
