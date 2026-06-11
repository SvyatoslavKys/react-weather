import { SearchBar } from "../components/SearchBar"
import { ForecastStrip } from "../components/weather/ForecastStrip"
import { WeatherOverview } from "../components/weather/WeatherOverview"
import { useWeatherDashboard } from "../hooks/useWeatherDashboard"
import { getWeatherTheme } from "../utils/weatherTheme"
import { getWeatherPanelClasses } from "../utils/weatherDisplay"

export function WeatherPage() {
  const {
    city,
    errorMessage,
    forecast,
    handleSearch,
    setCity,
    status,
    weather,
  } = useWeatherDashboard()
  const weatherTheme = getWeatherTheme(weather)
  const mode = weatherTheme?.mode ?? "light"
  const isLight = mode === "light"
  const panelClasses = getWeatherPanelClasses(weatherTheme)

  return (
    <section className="space-y-6 pb-10 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <SearchBar
          city={city}
          isLoading={status === "loading"}
          mode={mode}
          onCityChange={setCity}
          onSearch={handleSearch}
        />

        {status === "error" && (
          <div className={`rounded-2xl border px-4 py-3 text-sm backdrop-blur-xl ${
            isLight
              ? "border-rose-400/30 bg-rose-500/12 text-rose-950/90"
              : "border-rose-200/35 bg-rose-500/15 text-white/92"
          }`}>
            {errorMessage}
          </div>
        )}

        {status === "loading" && !weather && (
          <div className={`rounded-2xl border px-4 py-6 text-center text-sm backdrop-blur-xl ${
            isLight
              ? "border-slate-900/10 bg-white/12 text-slate-900/66"
              : "border-white/18 bg-white/10 text-white/78"
          }`}>
            Pulling the current atmosphere and forecast...
          </div>
        )}
      </div>

      {weather ? (
        <>
          <WeatherOverview
            panelClasses={panelClasses}
            weather={weather}
            weatherTheme={weatherTheme}
          />
          <ForecastStrip
            forecast={forecast}
            mode={mode}
            panelClasses={panelClasses}
            weather={weather}
          />
        </>
      ) : (
        status === "idle" && (
          <section className={`mx-auto max-w-4xl rounded-[2.25rem] border p-8 text-center shadow-2xl backdrop-blur-2xl ${panelClasses}`}>
            <p className={`text-xs uppercase tracking-[0.32em] ${
              isLight ? "text-slate-900/42" : "text-white/55"
            }`}>Ready</p>
            <h2 className={`mt-4 text-3xl font-semibold ${
              isLight ? "text-slate-950" : "text-white"
            }`}>Start with a city search</h2>
            <p className={`mx-auto mt-3 max-w-2xl text-base ${
              isLight ? "text-slate-900/62" : "text-white/72"
            }`}>
              Once a city is loaded, this page will show the current sky, local time,
              sunrise and a compact forecast strip tuned for both phone and desktop.
            </p>
          </section>
        )
      )}
    </section>
  )
}
