import {
  capitalizeFirstLetter,
  formatClock,
  formatTemperature,
  getWeatherIconUrl,
} from "../utils/weatherDisplay"

export function WeatherCard({ item, timezone }) {
  return (
    <article className="min-w-[10.25rem] snap-start rounded-[1.35rem] border border-white/16 bg-white/8 p-3.5 sm:min-w-0 sm:rounded-[1.6rem] sm:p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/56 sm:text-sm sm:normal-case sm:tracking-normal sm:text-white/72">
        {formatClock(item.dt, timezone)}
      </p>
      <div className="mt-3 flex items-center gap-3 sm:flex-col sm:text-center">
        <img
          alt={item.weather?.[0]?.description ?? "Forecast icon"}
          className="h-11 w-11 shrink-0 object-contain sm:h-14 sm:w-14"
          src={getWeatherIconUrl(item.weather?.[0]?.icon, "2x")}
        />
        <div className="min-w-0 flex-1 sm:flex-none">
          <p className="text-2xl font-semibold text-white">
            {formatTemperature(item.main.temp)}
          </p>
          <p className="mt-1 text-xs leading-snug text-white/66 sm:mt-2 sm:text-sm sm:text-white/68">
            {capitalizeFirstLetter(item.weather?.[0]?.description ?? "")}
          </p>
        </div>
      </div>
    </article>
  )
}
