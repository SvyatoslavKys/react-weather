function formatNumber(value, digits = 3) {
  if (typeof value !== "number") {
    return "Not available"
  }

  return value.toFixed(digits)
}

function formatMeters(value) {
  if (typeof value !== "number") {
    return "Not available"
  }

  return `${Math.round(value)} m`
}

function formatSpeed(value) {
  if (typeof value !== "number") {
    return "Not available"
  }

  return `${value.toFixed(2)} m/s`
}

function formatHeading(value) {
  if (typeof value !== "number") {
    return "Not available"
  }

  return `${Math.round(value)}°`
}

function formatTimestamp(value) {
  if (typeof value !== "number") {
    return "Not available"
  }

  return new Date(value).toLocaleString()
}

export function getGeolocationErrorMessage(error) {
  switch (error?.code) {
    case 1:
      return "User denied the geolocation request."
    case 2:
      return "Location information is unavailable."
    case 3:
      return "The geolocation request timed out."
    default:
      return error?.message ?? "Failed to get geolocation."
  }
}

export function getPositionDetails(position) {
  if (!position) {
    return []
  }

  return [
    {
      label: "Latitude",
      value: formatNumber(position.coords.latitude, 6),
    },
    {
      label: "Longitude",
      value: formatNumber(position.coords.longitude, 6),
    },
    {
      label: "Accuracy",
      value: formatMeters(position.coords.accuracy),
    },
    {
      label: "Altitude",
      value: formatMeters(position.coords.altitude),
    },
    {
      label: "Altitude accuracy",
      value: formatMeters(position.coords.altitudeAccuracy),
    },
    {
      label: "Heading",
      value: formatHeading(position.coords.heading),
    },
    {
      label: "Speed",
      value: formatSpeed(position.coords.speed),
    },
    {
      label: "Timestamp",
      value: formatTimestamp(position.timestamp),
    },
  ]
}
