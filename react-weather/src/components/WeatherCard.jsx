import {
  capitalizeFirstLetter,
  formatClock,
  formatTemperature,
  getWeatherIconUrl,
} from "../utils/weatherDisplay"

export function WeatherCard({ item, mode = "dark", timezone }) {
  const isLight = mode === "light"

  return (
    <article className={`min-w-[10.25rem] snap-start rounded-[1.35rem] border p-3.5 sm:min-w-0 sm:rounded-[1.6rem] sm:p-4 ${
      isLight
        ? "border-slate-900/10 bg-slate-950/6"
        : "border-white/16 bg-white/8"
    }`}>
      <p className={`text-xs font-medium uppercase tracking-[0.18em] sm:text-sm sm:normal-case sm:tracking-normal ${
        isLight
          ? "text-slate-900/48 sm:text-slate-900/62"
          : "text-white/56 sm:text-white/72"
      }`}>
        {formatClock(item.dt, timezone)}
      </p>
      <div className="mt-3 flex items-center gap-3 sm:flex-col sm:text-center">
        <img
          alt={item.weather?.[0]?.description ?? "Forecast icon"}
          className="h-11 w-11 shrink-0 object-contain sm:h-14 sm:w-14"
          src={getWeatherIconUrl(item.weather?.[0]?.icon, "2x")}
        />
        <div className="min-w-0 flex-1 sm:flex-none">
          <p className={`text-2xl font-semibold ${isLight ? "text-slate-950" : "text-white"}`}>
            {formatTemperature(item.main.temp)}
          </p>
          <p className={`mt-1 text-xs leading-snug sm:mt-2 sm:text-sm ${
            isLight
              ? "text-slate-900/60 sm:text-slate-900/62"
              : "text-white/66 sm:text-white/68"
          }`}>
            {capitalizeFirstLetter(item.weather?.[0]?.description ?? "")}
          </p>
        </div>
      </div>
    </article>
  )
}
