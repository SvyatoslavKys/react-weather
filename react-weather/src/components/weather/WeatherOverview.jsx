import {
  capitalizeFirstLetter,
  formatClock,
  formatDateLine,
  formatLocation,
  formatTemperature,
  getWeatherIconUrl,
} from "../../utils/weatherDisplay"
import { WeatherMetricsGrid } from "./WeatherMetricsGrid"

export function WeatherOverview({ panelClasses, weather, weatherTheme }) {
  return (
    <article
      className={`mx-auto max-w-4xl rounded-[2.5rem] border p-5 shadow-2xl backdrop-blur-2xl sm:p-8 lg:p-10 ${panelClasses}`}
      data-mode={weatherTheme?.mode}
      data-scene={weatherTheme?.scene}
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-white/55">
              Today
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
              {formatLocation(weather)}
            </h2>
          </div>

          <div className="rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm text-white/78">
            {weatherTheme?.localTime ?? "--:--"}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          <div className="flex items-center justify-center rounded-[2rem] bg-white/8 p-4 lg:min-h-52">
            <img
              alt={weather.weather?.[0]?.description ?? "Weather icon"}
              className="h-32 w-32 object-contain drop-shadow-[0_10px_24px_rgba(255,255,255,0.14)] sm:h-40 sm:w-40"
              src={getWeatherIconUrl(weather.weather?.[0]?.icon)}
            />
          </div>

          <div className="text-center lg:text-left">
            <div className="flex items-start justify-center gap-3 lg:justify-start">
              <span className="text-[clamp(4.5rem,14vw,9rem)] font-light leading-none tracking-[-0.08em] text-white">
                {Math.round(weather.main.temp)}
              </span>
              <span className="pt-2 text-3xl text-white/85 sm:pt-4 sm:text-4xl">
                °C
              </span>
            </div>

            <p className="mt-4 text-2xl font-semibold text-white/96 sm:text-3xl">
              {capitalizeFirstLetter(weather.weather?.[0]?.description)}
            </p>

            <p className="mt-3 text-base text-white/72 sm:text-lg">
              {formatDateLine(weather.dt, weather.timezone)}
            </p>

            <p className="mt-6 text-base text-white/82 sm:text-lg">
              Feels like {formatTemperature(weather.main.feels_like)}
              {"  |  "}
              Sunset {formatClock(weather.sys.sunset, weather.timezone)}
            </p>
          </div>
        </div>

        <WeatherMetricsGrid weather={weather} />
      </div>
    </article>
  )
}
