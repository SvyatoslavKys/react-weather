const DEBUG_ATMOSPHERE_BY_TYPE = {
  clear: { cloudiness: 10, rainAmount: 0, snowAmount: 0, windDeg: 240, windSpeed: 2.5 },
  cloudy: { cloudiness: 76, rainAmount: 0, snowAmount: 0, windDeg: 245, windSpeed: 3.5 },
  mist: { cloudiness: 42, rainAmount: 0, snowAmount: 0, windDeg: 210, windSpeed: 1.5 },
  neutral: { cloudiness: 16, rainAmount: 0, snowAmount: 0, windDeg: 225, windSpeed: 2 },
  rain: { cloudiness: 92, rainAmount: 1.7, snowAmount: 0, windDeg: 252, windSpeed: 6.5 },
  snow: { cloudiness: 82, rainAmount: 0, snowAmount: 1.6, windDeg: 235, windSpeed: 4 },
  storm: { cloudiness: 100, rainAmount: 4.2, snowAmount: 0, windDeg: 260, windSpeed: 12 },
  wind: { cloudiness: 34, rainAmount: 0, snowAmount: 0, windDeg: 270, windSpeed: 14 },
}

const CLOUD_LAYOUTS = {
  day: [
    { top: 14, width: 13.5, height: 3.8, opacity: 0.34, blur: 0.6, baseDuration: 86, delay: -18, exitPad: 8, startPad: 5 },
    { top: 22, width: 19, height: 5.4, opacity: 0.58, blur: 0.7, baseDuration: 62, delay: -8, exitPad: 10, startPad: 7 },
    { top: 34, width: 15.5, height: 4.6, opacity: 0.5, blur: 0.6, baseDuration: 74, delay: -28, exitPad: 7, startPad: 6 },
    { top: 10, width: 11.5, height: 3.2, opacity: 0.28, blur: 0.8, baseDuration: 98, delay: -40, exitPad: 8, startPad: 4 },
    { top: 44, width: 21, height: 5.9, opacity: 0.42, blur: 0.8, baseDuration: 82, delay: -22, exitPad: 11, startPad: 8 },
    { top: 28, width: 12.5, height: 3.6, opacity: 0.32, blur: 0.6, baseDuration: 92, delay: -54, exitPad: 8, startPad: 4 },
  ],
  "summer-day": [
    { top: 12, width: 14.5, height: 3.9, opacity: 0.26, blur: 1, baseDuration: 94, delay: -16, exitPad: 9, startPad: 5 },
    { top: 18, width: 21, height: 5.6, opacity: 0.46, blur: 1, baseDuration: 70, delay: -9, exitPad: 12, startPad: 8 },
    { top: 31, width: 16, height: 4.5, opacity: 0.38, blur: 0.9, baseDuration: 86, delay: -33, exitPad: 9, startPad: 6 },
    { top: 42, width: 18.5, height: 5.2, opacity: 0.34, blur: 1.1, baseDuration: 104, delay: -24, exitPad: 10, startPad: 7 },
    { top: 8, width: 12, height: 3.3, opacity: 0.22, blur: 1, baseDuration: 114, delay: -48, exitPad: 8, startPad: 4 },
    { top: 24, width: 13.5, height: 3.8, opacity: 0.28, blur: 0.9, baseDuration: 98, delay: -62, exitPad: 8, startPad: 5 },
  ],
  night: [
    { top: 18, width: 18, height: 5, opacity: 0.32, blur: 0.7, baseDuration: 78, delay: -12, exitPad: 9, startPad: 6 },
    { top: 34, width: 15, height: 4.2, opacity: 0.26, blur: 0.6, baseDuration: 92, delay: -30, exitPad: 8, startPad: 5 },
    { top: 10, width: 11.5, height: 3.2, opacity: 0.2, blur: 0.8, baseDuration: 108, delay: -50, exitPad: 7, startPad: 4 },
    { top: 44, width: 19.5, height: 5.6, opacity: 0.24, blur: 0.7, baseDuration: 96, delay: -24, exitPad: 10, startPad: 7 },
    { top: 26, width: 13, height: 3.8, opacity: 0.18, blur: 0.7, baseDuration: 116, delay: -58, exitPad: 8, startPad: 4 },
  ],
  rain: [
    { top: 14, width: 21, height: 5.8, opacity: 0.54, blur: 0.7, baseDuration: 52, delay: -8, exitPad: 9, startPad: 8 },
    { top: 24, width: 18, height: 5.1, opacity: 0.5, blur: 0.6, baseDuration: 48, delay: -24, exitPad: 8, startPad: 7 },
    { top: 34, width: 17, height: 4.8, opacity: 0.46, blur: 0.7, baseDuration: 58, delay: -36, exitPad: 8, startPad: 6 },
    { top: 8, width: 15, height: 4.2, opacity: 0.42, blur: 0.8, baseDuration: 64, delay: -52, exitPad: 7, startPad: 5 },
    { top: 42, width: 22, height: 6.2, opacity: 0.4, blur: 0.9, baseDuration: 60, delay: -18, exitPad: 10, startPad: 8 },
  ],
  snow: [
    { top: 16, width: 19, height: 5.3, opacity: 0.5, blur: 0.7, baseDuration: 66, delay: -10, exitPad: 9, startPad: 7 },
    { top: 30, width: 16.5, height: 4.7, opacity: 0.42, blur: 0.7, baseDuration: 78, delay: -28, exitPad: 8, startPad: 6 },
    { top: 10, width: 13, height: 3.8, opacity: 0.34, blur: 0.8, baseDuration: 88, delay: -44, exitPad: 7, startPad: 4 },
    { top: 40, width: 20.5, height: 5.8, opacity: 0.3, blur: 0.9, baseDuration: 84, delay: -22, exitPad: 10, startPad: 8 },
  ],
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function getTravelDirectionFactor(windDeg = 0) {
  return Math.sin(((windDeg + 180) * Math.PI) / 180)
}

function getRainAmount(weather, weatherType) {
  const rain1h = weather?.rain?.["1h"]
  const rain3h = weather?.rain?.["3h"]

  if (typeof rain1h === "number") {
    return rain1h
  }

  if (typeof rain3h === "number") {
    return rain3h / 3
  }

  if (weatherType === "storm") {
    return 3.2
  }

  if (weatherType === "rain") {
    return 1.1
  }

  return 0
}

function getSnowAmount(weather, weatherType) {
  const snow1h = weather?.snow?.["1h"]
  const snow3h = weather?.snow?.["3h"]

  if (typeof snow1h === "number") {
    return snow1h
  }

  if (typeof snow3h === "number") {
    return snow3h / 3
  }

  if (weatherType === "snow") {
    return 1.2
  }

  return 0
}

export function getAtmosphereMetrics(theme, weather, themeDebugOverride) {
  const fallback = DEBUG_ATMOSPHERE_BY_TYPE[theme.weatherType] ?? DEBUG_ATMOSPHERE_BY_TYPE.clear

  if (themeDebugOverride?.enabled || !weather) {
    return fallback
  }

  return {
    cloudiness: clamp(weather.clouds?.all ?? fallback.cloudiness, 0, 100),
    rainAmount: clamp(
      getRainAmount(weather, theme.weatherType) || fallback.rainAmount,
      0,
      8,
    ),
    snowAmount: clamp(
      getSnowAmount(weather, theme.weatherType) || fallback.snowAmount,
      0,
      8,
    ),
    windDeg: clamp(weather.wind?.deg ?? fallback.windDeg, 0, 360),
    windSpeed: clamp(weather.wind?.speed ?? fallback.windSpeed, 0, 28),
  }
}

function getCloudCount({ cloudiness, scene, timeOfDay }) {
  let count = 0

  if (cloudiness >= 90) {
    count = 6
  } else if (cloudiness >= 75) {
    count = 5
  } else if (cloudiness >= 55) {
    count = 4
  } else if (cloudiness >= 35) {
    count = 3
  } else if (cloudiness >= 18) {
    count = 2
  } else if (cloudiness >= 6) {
    count = 1
  }

  if (scene === "cloudy-day" || scene === "cloudy-night") {
    count = Math.max(count, 3)
  }

  if (scene === "rain") {
    count = Math.max(count, 4)
  }

  if (scene === "storm") {
    count = Math.max(count, 5)
  }

  if (scene === "snow") {
    count = Math.max(count, 3)
  }

  if (scene === "wind") {
    count = Math.max(count, 2)
  }

  if (timeOfDay === "night" && count === 0 && scene !== "neutral") {
    count = 1
  }

  return clamp(count, 0, 6)
}

function getCloudLayout({ scene, season, timeOfDay }) {
  if (scene === "rain" || scene === "storm" || scene === "wind") {
    return CLOUD_LAYOUTS.rain
  }

  if (scene === "snow") {
    return CLOUD_LAYOUTS.snow
  }

  if (season === "summer" && timeOfDay === "day") {
    return CLOUD_LAYOUTS["summer-day"]
  }

  if (timeOfDay === "night") {
    return CLOUD_LAYOUTS.night
  }

  return CLOUD_LAYOUTS.day
}

export function buildClouds({ cloudiness, scene, season, timeOfDay, windSpeed }) {
  const cloudCount = getCloudCount({ cloudiness, scene, timeOfDay })
  const layout = getCloudLayout({ scene, season, timeOfDay })
  const windFactor = clamp(windSpeed / 16, 0, 1.2)

  return layout.slice(0, cloudCount).map((slot, index) => {
    const opacityBoost = 0.82 + cloudiness / 220
    const duration = clamp(
      slot.baseDuration / (1 + windFactor * 0.72),
      24,
      120,
    )

    return {
      key: `${scene}-${season}-${timeOfDay}-${index}`,
      style: {
        "--cloud-top": `${slot.top}%`,
        "--cloud-width": `${slot.width}rem`,
        "--cloud-height": `${slot.height}rem`,
        "--cloud-start-x": `-${slot.width + slot.startPad}rem`,
        "--cloud-end-x": `calc(100vw + ${slot.exitPad}rem)`,
        "--cloud-duration": `${duration.toFixed(2)}s`,
        "--cloud-delay": `${slot.delay}s`,
        "--cloud-opacity": (slot.opacity * opacityBoost).toFixed(3),
        "--cloud-blur": `${slot.blur}px`,
      },
    }
  })
}

export function getMistProps({ cloudiness, scene, timeOfDay, windDeg, windSpeed }) {
  if (scene !== "mist") {
    return null
  }

  const drift = getTravelDirectionFactor(windDeg)
  const density = clamp(0.24 + cloudiness / 200 - windSpeed * 0.006, 0.22, 0.62)
  const veilOpacity = clamp((timeOfDay === "night" ? 0.16 : 0.12) + density * 0.44, 0.18, 0.42)
  const veilBlur = clamp(20 + cloudiness * 0.12 - windSpeed * 0.22, 18, 34)
  const veilShift = clamp(drift * (4 + windSpeed * 0.55), -16, 16)
  const baseDuration = clamp(30 - windSpeed * 0.95, 14, 30)

  const layers = [
    {
      bottom: 6,
      width: 88,
      height: 24,
      opacity: density * 0.76,
      blur: veilBlur + 4,
      duration: baseDuration * 1.16,
      delay: -8,
      shiftX: veilShift * 0.42,
    },
    {
      bottom: 18,
      width: 72,
      height: 18,
      opacity: density * 0.58,
      blur: veilBlur,
      duration: baseDuration * 0.94,
      delay: -18,
      shiftX: veilShift * 0.88,
    },
    {
      bottom: 32,
      width: 58,
      height: 14,
      opacity: density * 0.42,
      blur: veilBlur - 2,
      duration: baseDuration * 0.82,
      delay: -28,
      shiftX: veilShift * 1.18,
    },
  ]

  return {
    layers: layers.map((layer, index) => ({
      key: `mist-${index}`,
      style: {
        "--fog-bottom": `${layer.bottom}%`,
        "--fog-width": `${layer.width}vw`,
        "--fog-height": `${layer.height}vh`,
        "--fog-opacity": layer.opacity.toFixed(3),
        "--fog-blur": `${layer.blur.toFixed(2)}px`,
        "--fog-duration": `${layer.duration.toFixed(2)}s`,
        "--fog-delay": `${layer.delay}s`,
        "--fog-drift-x": `${layer.shiftX.toFixed(2)}vw`,
      },
    })),
    veilStyle: {
      "--mist-veil-opacity": veilOpacity.toFixed(3),
      "--mist-veil-blur": `${veilBlur.toFixed(2)}px`,
      "--mist-veil-shift-x": `${veilShift.toFixed(2)}vw`,
      "--mist-veil-duration": `${(baseDuration * 1.24).toFixed(2)}s`,
    },
  }
}

export function getRainProps({ cloudiness, rainAmount, scene, timeOfDay, windDeg, windSpeed }) {
  if (scene !== "rain" && scene !== "storm") {
    return null
  }

  const travelDirection = getTravelDirectionFactor(windDeg)
  const angle = clamp(travelDirection * (10 + windSpeed * 1.6), -32, 32)
  const shiftX = clamp(travelDirection * (3.2 + windSpeed * 0.95), -22, 22)
  const gustX = clamp(travelDirection * (1.2 + windSpeed * 0.34), -8, 8)
  const baseDuration = clamp(1.16 - windSpeed * 0.027 - rainAmount * 0.052, 0.42, 1.2)
  const density = clamp(
    0.48 + cloudiness / 180 + rainAmount * 0.08 + (scene === "storm" ? 0.16 : 0),
    0.58,
    1.28,
  )
  const isNight = timeOfDay === "night"
  const farOpacity = clamp((isNight ? 0.16 : 0.12) + density * 0.12, 0.18, 0.4)
  const midOpacity = clamp((isNight ? 0.24 : 0.18) + density * 0.16, 0.26, 0.56)
  const nearOpacity = clamp((isNight ? 0.3 : 0.22) + density * 0.18, 0.34, 0.7)
  const mistOpacity = clamp((isNight ? 0.18 : 0.12) + density * 0.16, 0.18, 0.44)
  const stormGlowOpacity = scene === "storm" ? clamp(0.12 + density * 0.08, 0.16, 0.34) : 0

  return {
    style: {
      "--rain-angle": `${90 + angle}deg`,
      "--rain-fall-distance": `${clamp(22 + rainAmount * 4 + windSpeed * 0.4, 26, 44)}vh`,
      "--rain-far-duration": `${(baseDuration * 1.34).toFixed(2)}s`,
      "--rain-mid-duration": `${(baseDuration * 1.02).toFixed(2)}s`,
      "--rain-near-duration": `${(baseDuration * 0.76).toFixed(2)}s`,
      "--rain-far-shift-x": `${(shiftX * 0.66).toFixed(2)}vw`,
      "--rain-mid-shift-x": `${shiftX.toFixed(2)}vw`,
      "--rain-near-shift-x": `${(shiftX * 1.24).toFixed(2)}vw`,
      "--rain-gust-x": `${gustX.toFixed(2)}vw`,
      "--rain-far-opacity": farOpacity.toFixed(3),
      "--rain-mid-opacity": midOpacity.toFixed(3),
      "--rain-near-opacity": nearOpacity.toFixed(3),
      "--rain-mist-opacity": mistOpacity.toFixed(3),
      "--rain-mist-blur": `${clamp(15 + rainAmount * 2.4, 16, 28)}px`,
      "--storm-glow-opacity": stormGlowOpacity.toFixed(3),
      "--storm-glow-peak": (stormGlowOpacity * 1.16).toFixed(3),
      "--storm-glow-dim": (stormGlowOpacity * 0.82).toFixed(3),
    },
  }
}

export function getWindProps({ cloudiness, scene, windDeg, windSpeed }) {
  if (scene !== "wind") {
    return null
  }

  const drift = getTravelDirectionFactor(windDeg)
  const density = clamp(0.18 + cloudiness / 260 + windSpeed * 0.018, 0.24, 0.74)
  const angle = clamp(drift * (6 + windSpeed * 0.9), -24, 24)
  const trailCount = windSpeed >= 18 ? 5 : windSpeed >= 12 ? 4 : 3
  const baseDuration = clamp(5.2 - windSpeed * 0.18, 2.1, 5.2)
  const streamLayouts = [
    { top: 18, width: 26, blur: 0.2, opacity: density * 0.54, delay: -8 },
    { top: 32, width: 34, blur: 0.3, opacity: density * 0.46, delay: -1.8 },
    { top: 46, width: 22, blur: 0.18, opacity: density * 0.38, delay: -3.4 },
    { top: 58, width: 30, blur: 0.4, opacity: density * 0.34, delay: -5.1 },
    { top: 26, width: 18, blur: 0.16, opacity: density * 0.28, delay: -6.3 },
  ]

  return {
    sheenStyle: {
      "--wind-sheen-opacity": clamp(density * 0.32, 0.16, 0.3).toFixed(3),
      "--wind-sheen-shift-x": `${clamp(drift * (7 + windSpeed * 0.65), -18, 18).toFixed(2)}vw`,
      "--wind-sheen-duration": `${(baseDuration * 1.32).toFixed(2)}s`,
    },
    trails: streamLayouts.slice(0, trailCount).map((trail, index) => ({
      key: `wind-${index}`,
      style: {
        "--wind-top": `${trail.top}%`,
        "--wind-width": `${trail.width}vw`,
        "--wind-angle": `${angle.toFixed(2)}deg`,
        "--wind-opacity": trail.opacity.toFixed(3),
        "--wind-blur": `${trail.blur.toFixed(2)}px`,
        "--wind-duration": `${(baseDuration + index * 0.34).toFixed(2)}s`,
        "--wind-delay": `${trail.delay}s`,
        "--wind-drift-y": `${clamp(3 + windSpeed * 0.45, 4, 16)}px`,
      },
    })),
  }
}

export function getSnowProps({ cloudiness, scene, snowAmount, timeOfDay, windDeg, windSpeed }) {
  if (scene !== "snow") {
    return null
  }

  const drift = getTravelDirectionFactor(windDeg)
  const density = clamp(0.34 + cloudiness / 220 + snowAmount * 0.12, 0.36, 1.18)
  const shiftX = clamp(drift * (1.6 + windSpeed * 0.38), -12, 12)
  const gustX = clamp(drift * (0.7 + windSpeed * 0.22), -6, 6)
  const baseDuration = clamp(13.8 - windSpeed * 0.36 - snowAmount * 0.55, 5.2, 14)
  const isNight = timeOfDay === "night"
  const frostOpacity = clamp((isNight ? 0.1 : 0.06) + density * 0.12, 0.08, 0.24)

  const layers = [
    {
      key: "snow-far",
      className: "weather-background__snow weather-background__snow--far",
      style: {
        "--snow-opacity": clamp((isNight ? 0.26 : 0.22) + density * 0.1, 0.24, 0.38).toFixed(3),
        "--snow-duration": `${(baseDuration * 1.26).toFixed(2)}s`,
        "--snow-shift-x": `${(shiftX * 0.44).toFixed(2)}vw`,
        "--snow-gust-x": `${(gustX * 0.28).toFixed(2)}vw`,
        "--snow-fall-distance": `${clamp(28 + snowAmount * 3.2, 28, 42)}vh`,
      },
    },
    {
      key: "snow-mid",
      className: "weather-background__snow weather-background__snow--mid",
      style: {
        "--snow-opacity": clamp((isNight ? 0.4 : 0.34) + density * 0.14, 0.38, 0.58).toFixed(3),
        "--snow-duration": `${(baseDuration * 0.94).toFixed(2)}s`,
        "--snow-shift-x": `${shiftX.toFixed(2)}vw`,
        "--snow-gust-x": `${(gustX * 0.74).toFixed(2)}vw`,
        "--snow-fall-distance": `${clamp(32 + snowAmount * 3.8, 32, 46)}vh`,
      },
    },
    {
      key: "snow-near",
      className: "weather-background__snow weather-background__snow--near",
      style: {
        "--snow-opacity": clamp((isNight ? 0.5 : 0.42) + density * 0.18, 0.46, 0.72).toFixed(3),
        "--snow-duration": `${(baseDuration * 0.72).toFixed(2)}s`,
        "--snow-shift-x": `${(shiftX * 1.42).toFixed(2)}vw`,
        "--snow-gust-x": `${gustX.toFixed(2)}vw`,
        "--snow-fall-distance": `${clamp(36 + snowAmount * 4.4, 36, 52)}vh`,
      },
    },
  ]

  return {
    layers,
    frostStyle: {
      "--snow-frost-opacity": frostOpacity.toFixed(3),
      "--snow-frost-blur": `${clamp(14 + snowAmount * 2.2, 14, 26)}px`,
      "--snow-frost-drift-x": `${(gustX * 0.6).toFixed(2)}vw`,
    },
  }
}

export function getShootingStars(scene, timeOfDay) {
  if (scene !== "clear-night" || timeOfDay !== "night") {
    return []
  }

  const layouts = [
    { top: 6, left: 7, length: 8.8, headSize: 0.58, angle: 28, driftX: 28, driftY: 27, duration: 28, delay: -4 },
    { top: 3, left: 24, length: 7.4, headSize: 0.5, angle: 31, driftX: 21, driftY: 23, duration: 34, delay: -16 },
    { top: 10, left: 38, length: 9.2, headSize: 0.62, angle: 34, driftX: 18, driftY: 30, duration: 31, delay: -23 },
  ]

  return layouts.map((star, index) => ({
    key: `shooting-star-${index}`,
    style: {
      "--shooting-star-top": `${star.top}%`,
      "--shooting-star-left": `${star.left}%`,
      "--shooting-star-length": `${star.length}rem`,
      "--shooting-star-head-size": `${star.headSize}rem`,
      "--shooting-star-angle": `${star.angle}deg`,
      "--shooting-star-early-x": `${(star.driftX * 0.36).toFixed(2)}vw`,
      "--shooting-star-early-y": `${(star.driftY * 0.36).toFixed(2)}vh`,
      "--shooting-star-mid-x": `${(star.driftX * 0.72).toFixed(2)}vw`,
      "--shooting-star-mid-y": `${(star.driftY * 0.72).toFixed(2)}vh`,
      "--shooting-star-end-x": `${star.driftX.toFixed(2)}vw`,
      "--shooting-star-end-y": `${star.driftY.toFixed(2)}vh`,
      "--shooting-star-duration": `${star.duration}s`,
      "--shooting-star-delay": `${star.delay}s`,
    },
  }))
}

export function getBirdProps({ cloudiness, scene, season, timeOfDay, windSpeed }) {
  if (timeOfDay !== "day") {
    return null
  }

  if (scene !== "clear-day" && scene !== "cloudy-day") {
    return null
  }

  if (cloudiness > 64 || windSpeed > 10) {
    return null
  }

  const duration = clamp(28 - windSpeed * 0.9, 16, 28)
  const top = season === "summer" ? 18 : 23

  return {
    className: season === "summer"
      ? "weather-background__bird weather-background__bird--summer"
      : "weather-background__bird",
    style: {
      "--bird-duration": `${duration.toFixed(2)}s`,
      "--bird-delay": cloudiness < 20 ? "-12s" : "-5s",
      "--bird-top": `${top}%`,
    },
  }
}
