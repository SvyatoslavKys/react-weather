import { useEffect, useState } from "react"
import { DebugOptionGroup } from "../components/debug/DebugOptionGroup"
import { DebugPreviewCard } from "../components/debug/DebugPreviewCard"
import {
  clearThemeDebugOverride,
  DEBUG_SEASONS,
  DEBUG_TIMES_OF_DAY,
  DEBUG_WEATHER_TYPES,
  DEFAULT_THEME_DEBUG_OVERRIDE,
  getThemeFromDebugOverride,
  readThemeDebugOverride,
  WEATHER_THEME_DEBUG_EVENT,
  writeThemeDebugOverride,
} from "../utils/weatherTheme"

export function AppPage() {
  const [themeDebugOverride, setThemeDebugOverride] = useState(
    () => readThemeDebugOverride() ?? DEFAULT_THEME_DEBUG_OVERRIDE,
  )

  useEffect(() => {
    function syncThemeDebugOverride() {
      setThemeDebugOverride(readThemeDebugOverride() ?? DEFAULT_THEME_DEBUG_OVERRIDE)
    }

    window.addEventListener(WEATHER_THEME_DEBUG_EVENT, syncThemeDebugOverride)
    window.addEventListener("storage", syncThemeDebugOverride)

    return () => {
      window.removeEventListener(WEATHER_THEME_DEBUG_EVENT, syncThemeDebugOverride)
      window.removeEventListener("storage", syncThemeDebugOverride)
    }
  }, [])

  function updateThemeDebugOverride(patch) {
    const nextOverride = {
      ...themeDebugOverride,
      ...patch,
    }

    setThemeDebugOverride(nextOverride)
    writeThemeDebugOverride(nextOverride)
  }

  function handleResetToLiveWeather() {
    clearThemeDebugOverride()
    setThemeDebugOverride(DEFAULT_THEME_DEBUG_OVERRIDE)
  }

  const previewTheme = getThemeFromDebugOverride(themeDebugOverride)

  return (
    <section className="mx-auto max-w-5xl">
      <div className="rounded-3xl border border-white/35 bg-white/35 p-6 shadow-xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-slate-950">App Debug</h1>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => updateThemeDebugOverride({ enabled: !themeDebugOverride.enabled })}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              themeDebugOverride.enabled
                ? "bg-slate-950 text-white"
                : "bg-white/70 text-slate-900 hover:bg-white"
            }`}
          >
            {themeDebugOverride.enabled ? "Debug Theme: ON" : "Debug Theme: OFF"}
          </button>

          <button
            onClick={handleResetToLiveWeather}
            className="rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-950 transition hover:bg-sky-200"
          >
            Use Live Weather
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <DebugOptionGroup
            title="Season"
            options={DEBUG_SEASONS}
            value={themeDebugOverride.season}
            onSelect={(season) => updateThemeDebugOverride({ enabled: true, season })}
          />
          <DebugOptionGroup
            title="Time Of Day"
            options={DEBUG_TIMES_OF_DAY}
            value={themeDebugOverride.timeOfDay}
            onSelect={(timeOfDay) => updateThemeDebugOverride({ enabled: true, timeOfDay })}
          />
          <DebugOptionGroup
            title="Weather Effect"
            options={DEBUG_WEATHER_TYPES}
            value={themeDebugOverride.weatherType}
            onSelect={(weatherType) => updateThemeDebugOverride({ enabled: true, weatherType })}
          />
        </div>

        <DebugPreviewCard
          previewTheme={previewTheme}
          themeDebugOverride={themeDebugOverride}
        />
      </div>
    </section>
  )
}
