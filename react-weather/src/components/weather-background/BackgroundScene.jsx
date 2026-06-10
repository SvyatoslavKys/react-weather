import {
  buildClouds,
  getBirdProps,
  getMistProps,
  getRainProps,
  getSnowProps,
  getShootingStars,
  getWindProps,
} from "./sceneUtils"

function SummerDayAtmosphere() {
  return (
    <>
      <div className="weather-background__summer-aura" />
      <div className="weather-background__summer-rays" />
      <div className="weather-background__summer-haze" />
      <div className="weather-background__summer-bloom" />
      <div className="weather-background__summer-pollen weather-background__summer-pollen--one" />
      <div className="weather-background__summer-pollen weather-background__summer-pollen--two" />
    </>
  )
}

function CloudLayer({ clouds }) {
  return clouds.map((cloud) => (
    <div
      key={cloud.key}
      className="weather-background__cloud"
      style={cloud.style}
    />
  ))
}

function MistLayer({ mist }) {
  if (!mist) {
    return null
  }

  return (
    <>
      <div className="weather-background__mist-veil" style={mist.veilStyle} />
      {mist.layers.map((layer) => (
        <div
          key={layer.key}
          className="weather-background__fog"
          style={layer.style}
        />
      ))}
    </>
  )
}

function RainLayer({ rain, scene }) {
  if (!rain) {
    return null
  }

  return (
    <>
      <div className="weather-background__rain weather-background__rain--far" style={rain.style} />
      <div className="weather-background__rain weather-background__rain--mid" style={rain.style} />
      <div className="weather-background__rain weather-background__rain--near" style={rain.style} />
      <div className="weather-background__rain-mist" style={rain.style} />
      {scene === "storm" && <div className="weather-background__storm-glow" style={rain.style} />}
    </>
  )
}

function WindLayer({ wind }) {
  if (!wind) {
    return null
  }

  return (
    <>
      <div className="weather-background__wind-sheen" style={wind.sheenStyle} />
      {wind.trails.map((trail) => (
        <div
          key={trail.key}
          className="weather-background__wind-stream"
          style={trail.style}
        />
      ))}
    </>
  )
}

function SnowLayer({ snow }) {
  if (!snow) {
    return null
  }

  return (
    <>
      {snow.layers.map((layer) => (
        <div
          key={layer.key}
          className={layer.className}
          style={layer.style}
        />
      ))}
      <div className="weather-background__snow-frost" style={snow.frostStyle} />
    </>
  )
}

function StormLightningLayer() {
  return (
    <>
      <div className="weather-background__lightning-bolt weather-background__lightning-bolt--main" />
      <div className="weather-background__lightning-bolt weather-background__lightning-bolt--secondary" />
    </>
  )
}

function ShootingStarsLayer({ stars }) {
  if (!stars.length) {
    return null
  }

  return stars.map((star) => (
    <div
      key={star.key}
      className="weather-background__shooting-star"
      style={star.style}
    />
  ))
}

export function BackgroundScene({ atmosphere, scene, season, timeOfDay }) {
  const isSummerDayScene = season === "summer" &&
    timeOfDay === "day" &&
    (scene === "clear-day" || scene === "cloudy-day")
  const clouds = buildClouds({
    cloudiness: atmosphere.cloudiness,
    scene,
    season,
    timeOfDay,
    windSpeed: atmosphere.windSpeed,
  })
  const bird = getBirdProps({
    cloudiness: atmosphere.cloudiness,
    scene,
    season,
    timeOfDay,
    windSpeed: atmosphere.windSpeed,
  })
  const rain = getRainProps({
    cloudiness: atmosphere.cloudiness,
    rainAmount: atmosphere.rainAmount,
    scene,
    timeOfDay,
    windDeg: atmosphere.windDeg,
    windSpeed: atmosphere.windSpeed,
  })
  const mist = getMistProps({
    cloudiness: atmosphere.cloudiness,
    scene,
    timeOfDay,
    windDeg: atmosphere.windDeg,
    windSpeed: atmosphere.windSpeed,
  })
  const wind = getWindProps({
    cloudiness: atmosphere.cloudiness,
    scene,
    windDeg: atmosphere.windDeg,
    windSpeed: atmosphere.windSpeed,
  })
  const snow = getSnowProps({
    cloudiness: atmosphere.cloudiness,
    scene,
    snowAmount: atmosphere.snowAmount,
    timeOfDay,
    windDeg: atmosphere.windDeg,
    windSpeed: atmosphere.windSpeed,
  })
  const shootingStars = getShootingStars(scene, timeOfDay)

  if (scene === "rain" || scene === "storm") {
    return (
      <>
        <CloudLayer clouds={clouds} />
        <RainLayer rain={rain} scene={scene} />
        {scene === "storm" && (
          <>
            <StormLightningLayer />
            <div className="weather-background__flash" />
          </>
        )}
      </>
    )
  }

  if (scene === "snow") {
    return (
      <>
        <SnowLayer snow={snow} />
        <CloudLayer clouds={clouds} />
      </>
    )
  }

  if (scene === "mist") {
    return <MistLayer mist={mist} />
  }

  if (scene === "wind") {
    return (
      <>
        <CloudLayer clouds={clouds} />
        <WindLayer wind={wind} />
      </>
    )
  }

  if (scene === "neutral") {
    return null
  }

  if (timeOfDay === "night") {
    return (
      <>
        <div className="weather-background__moon" />
        <div className="weather-background__stars" />
        <ShootingStarsLayer stars={shootingStars} />
        <CloudLayer clouds={clouds} />
      </>
    )
  }

  return (
    <>
      {isSummerDayScene && <SummerDayAtmosphere />}
      <div className="weather-background__orb weather-background__orb--sun" />
      <CloudLayer clouds={clouds} />
      {bird && <div className={bird.className} style={bird.style} />}
    </>
  )
}
