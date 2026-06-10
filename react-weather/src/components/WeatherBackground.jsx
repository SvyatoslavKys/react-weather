import { useStoredWeatherTheme } from "../hooks/useStoredWeatherTheme"
import { BackgroundScene } from "./weather-background/BackgroundScene"
import {
  BACKGROUND_IMAGES,
  NEUTRAL_BACKGROUND_IMAGE,
} from "./weather-background/backgroundImages"
import { getAtmosphereMetrics } from "./weather-background/sceneUtils"

export function WeatherBackground() {
  const { theme, themeDebugOverride, weather } = useStoredWeatherTheme()
  const atmosphere = getAtmosphereMetrics(theme, weather, themeDebugOverride)
  const backgroundImage = BACKGROUND_IMAGES[theme.backgroundKey] ?? NEUTRAL_BACKGROUND_IMAGE

  return (
    <div
      className={`weather-background weather-background--${theme.scene} weather-background--${theme.season}`}
      data-mode={theme.mode}
      data-season={theme.season}
      data-time-of-day={theme.timeOfDay}
      aria-hidden="true"
    >
      <div
        className="weather-background__image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="weather-background__wash" />
      <div className="weather-background__mesh" />
      <BackgroundScene
        atmosphere={atmosphere}
        scene={theme.scene}
        season={theme.season}
        timeOfDay={theme.timeOfDay}
      />
    </div>
  )
}
