import { formatClock, formatVisibility } from "../../utils/weatherDisplay"

export function WeatherMetricsGrid({ weather }) {
  const items = [
    {
      label: "Humidity",
      value: `${weather.main.humidity}%`,
    },
    {
      label: "Wind",
      value: `${weather.wind.speed.toFixed(1)} m/s`,
    },
    {
      label: "Visibility",
      value: formatVisibility(weather.visibility),
    },
    {
      label: "Sunrise",
      value: formatClock(weather.sys.sunrise, weather.timezone),
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[1.35rem] border border-white/18 bg-white/8 p-3 sm:rounded-[1.5rem] sm:p-4"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-white/48">
            {item.label}
          </p>
          <p className="mt-2 text-lg font-semibold text-white sm:mt-3 sm:text-2xl">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  )
}
