const HOURLY_FORECAST_LIMIT = 10
const REGION_NAMES = typeof Intl !== "undefined" && Intl.DisplayNames
  ? new Intl.DisplayNames(["en"], { type: "region" })
  : null

function getShiftedDate(unixSeconds, timezoneOffsetSeconds = 0) {
  return new Date((unixSeconds + timezoneOffsetSeconds) * 1000)
}

function formatCountryName(countryCode) {
  if (!countryCode) {
    return ""
  }

  if (!REGION_NAMES) {
    return countryCode
  }

  return REGION_NAMES.of(countryCode) ?? countryCode
}

export function formatClock(unixSeconds, timezoneOffsetSeconds = 0) {
  return getShiftedDate(unixSeconds, timezoneOffsetSeconds).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  })
}

export function formatDateLine(unixSeconds, timezoneOffsetSeconds = 0) {
  return getShiftedDate(unixSeconds, timezoneOffsetSeconds).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

export function formatTemperature(value) {
  return `${Math.round(value)}°`
}

export function capitalizeFirstLetter(value = "") {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatLocation(weather) {
  const cityName = weather?.name ?? ""
  const countryName = formatCountryName(weather?.sys?.country)

  if (!cityName) {
    return countryName
  }

  if (!countryName) {
    return cityName
  }

  return `${cityName}, ${countryName}`
}

export function formatVisibility(visibilityInMeters = 0) {
  if (visibilityInMeters >= 10000) {
    return `${Math.round(visibilityInMeters / 1000)} km`
  }

  if (visibilityInMeters >= 1000) {
    return `${(visibilityInMeters / 1000).toFixed(1)} km`
  }

  return `${visibilityInMeters} m`
}

export function getWeatherIconUrl(iconCode, size = "4x") {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`
}

export function getHourlyForecast(forecast) {
  return forecast?.list?.slice(0, HOURLY_FORECAST_LIMIT) ?? []
}

export function getWeatherPanelClasses(weatherTheme) {
  if (weatherTheme?.timeOfDay === "night") {
    return "border-white/18 bg-slate-950/22"
  }

  return "border-white/28 bg-white/16"
}
