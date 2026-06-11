import { getcurentData } from "../services/getCurentData"
import { useStoredWeatherTheme } from "../hooks/useStoredWeatherTheme"

function getMoonPhase(dateString) {
  const date = new Date(dateString)

  const KNOWN_NEW_MOON = new Date("2000-01-06T18:14:00Z")
  const LUNAR_MONTH = 29.530588853

  const diffMs = date - KNOWN_NEW_MOON
  const daysSinceNewMoon = diffMs / (1000 * 60 * 60 * 24)

  let moonAge = daysSinceNewMoon % LUNAR_MONTH

  if (moonAge < 0) {
    moonAge += LUNAR_MONTH
  }

  if (moonAge < 1.84566) {
    return {
      age: moonAge,
      description: "The moon is almost fully in shadow and starting a new cycle.",
      key: "new-moon",
      name: "New Moon",
    }
  }

  if (moonAge < 5.53699) {
    return {
      age: moonAge,
      description: "A slim bright crescent is growing on the right side.",
      key: "waxing-crescent",
      name: "Waxing Crescent",
    }
  }

  if (moonAge < 9.22831) {
    return {
      age: moonAge,
      description: "Half of the moon is illuminated as the cycle keeps growing.",
      key: "first-quarter",
      name: "First Quarter",
    }
  }

  if (moonAge < 12.91963) {
    return {
      age: moonAge,
      description: "Most of the moon is lit and moving toward full moon.",
      key: "waxing-gibbous",
      name: "Waxing Gibbous",
    }
  }

  if (moonAge < 16.61096) {
    return {
      age: moonAge,
      description: "The moon is fully illuminated.",
      key: "full-moon",
      name: "Full Moon",
    }
  }

  if (moonAge < 20.30228) {
    return {
      age: moonAge,
      description: "The illuminated part is shrinking after the full moon.",
      key: "waning-gibbous",
      name: "Waning Gibbous",
    }
  }

  if (moonAge < 23.99361) {
    return {
      age: moonAge,
      description: "Half of the moon remains visible as the cycle fades.",
      key: "last-quarter",
      name: "Last Quarter",
    }
  }

  if (moonAge < 27.68493) {
    return {
      age: moonAge,
      description: "Only a thin crescent remains before the next new moon.",
      key: "waning-crescent",
      name: "Waning Crescent",
    }
  }

  return {
    age: moonAge,
    description: "The moon is almost fully in shadow and starting a new cycle.",
    key: "new-moon",
    name: "New Moon",
  }
}

function formatLocalDate(dateString) {
  return new Date(dateString).toLocaleString("en-GB", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    weekday: "long",
    year: "numeric",
  })
}

function getMoonShadowStyle(phaseKey) {
  const shadowColor = "rgba(15, 23, 42, 0.88)"

  switch (phaseKey) {
    case "new-moon":
      return { background: shadowColor, inset: "0" }
    case "waxing-crescent":
      return { background: shadowColor, inset: "0", transform: "translateX(-42%) scale(1.02)" }
    case "first-quarter":
      return { background: shadowColor, clipPath: "inset(0 50% 0 0 round 999px)", inset: "0" }
    case "waxing-gibbous":
      return { background: shadowColor, inset: "0", transform: "translateX(-76%) scale(1.02)" }
    case "full-moon":
      return null
    case "waning-gibbous":
      return { background: shadowColor, inset: "0", transform: "translateX(76%) scale(1.02)" }
    case "last-quarter":
      return { background: shadowColor, clipPath: "inset(0 0 0 50% round 999px)", inset: "0" }
    case "waning-crescent":
      return { background: shadowColor, inset: "0", transform: "translateX(42%) scale(1.02)" }
    default:
      return { background: shadowColor, inset: "0" }
  }
}

function getPhaseAccent(phaseKey) {
  switch (phaseKey) {
    case "new-moon":
      return "from-slate-500/30 to-slate-900/30"
    case "waxing-crescent":
    case "waning-crescent":
      return "from-sky-300/30 to-indigo-400/25"
    case "first-quarter":
    case "last-quarter":
      return "from-cyan-300/30 to-slate-400/25"
    case "waxing-gibbous":
    case "waning-gibbous":
      return "from-amber-200/35 to-sky-300/25"
    case "full-moon":
      return "from-yellow-200/45 to-amber-300/30"
    default:
      return "from-slate-500/30 to-slate-900/30"
  }
}

function MoonPreview({ phase }) {
  const shadowStyle = getMoonShadowStyle(phase.key)

  return (
    <div className="relative flex items-center justify-center">
      <div className={`absolute h-48 w-48 rounded-full bg-gradient-to-br blur-3xl ${getPhaseAccent(phase.key)}`} />
      <div className="relative h-40 w-40 overflow-hidden rounded-full border border-white/20 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.98),rgba(223,232,255,0.96)_38%,rgba(185,200,232,0.92)_70%,rgba(120,136,166,0.9)_100%)] shadow-[0_18px_60px_rgba(15,23,42,0.28)]">
        <div className="absolute inset-[10%] rounded-full border border-white/18" />
        <div className="absolute inset-[22%_58%_52%_24%] rounded-full bg-white/30 blur-[2px]" />
        <div className="absolute inset-[56%_24%_18%_50%] rounded-full bg-slate-400/18 blur-[1px]" />
        {shadowStyle && (
          <div
            className="absolute rounded-full transition-transform duration-500"
            style={shadowStyle}
          />
        )}
      </div>
    </div>
  )
}

function MoonInfoRow({ isLight, label, value, mono = false }) {
  return (
    <div className={`rounded-[1.5rem] border p-4 ${
      isLight
        ? "border-slate-900/10 bg-slate-950/6"
        : "border-white/14 bg-white/7"
    }`}>
      <p className={`text-xs uppercase tracking-[0.24em] ${
        isLight ? "text-slate-900/42" : "text-white/48"
      }`}>
        {label}
      </p>
      <p className={`mt-3 break-words text-lg font-semibold ${
        mono ? "font-mono text-base sm:text-lg" : ""
      } ${isLight ? "text-slate-950" : "text-white"}`}>
        {value}
      </p>
    </div>
  )
}

export function MoonCalendar() {
  const { theme } = useStoredWeatherTheme()
  const currentTimestamp = getcurentData()
  const phase = getMoonPhase(currentTimestamp)
  const isLight = theme.mode === "light"

  return (
    <section className="mx-auto max-w-5xl pb-10">
      <article className={`rounded-[2.5rem] border p-6 shadow-2xl backdrop-blur-2xl sm:p-8 ${
        isLight
          ? "border-slate-900/12 bg-white/16"
          : "border-white/20 bg-slate-950/18"
      }`}>
        <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          <MoonPreview phase={phase} />

          <div>
            <p className={`text-xs uppercase tracking-[0.32em] ${
              isLight ? "text-slate-900/42" : "text-white/54"
            }`}>
              Moon Phase
            </p>
            <h1 className={`mt-3 text-3xl font-semibold sm:text-4xl ${
              isLight ? "text-slate-950" : "text-white"
            }`}>
              {phase.name}
            </h1>
            <p className={`mt-4 max-w-2xl text-base sm:text-lg ${
              isLight ? "text-slate-900/68" : "text-white/76"
            }`}>
              {phase.description}
            </p>
            <div className={`mt-5 inline-flex rounded-full border px-4 py-2 text-sm ${
              isLight
                ? "border-slate-900/10 bg-white/16 text-slate-900/72"
                : "border-white/18 bg-white/8 text-white/78"
            }`}>
              Moon age: {phase.age.toFixed(2)} days
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <MoonInfoRow
            isLight={isLight}
            label="ISO Timestamp"
            mono
            value={currentTimestamp}
          />
          <MoonInfoRow
            isLight={isLight}
            label="Local Device Time"
            value={formatLocalDate(currentTimestamp)}
          />
          <MoonInfoRow
            isLight={isLight}
            label="Phase Name"
            value={phase.name}
          />
          <MoonInfoRow
            isLight={isLight}
            label="Cycle Progress"
            value={`${phase.age.toFixed(2)} / 29.53 days`}
          />
        </div>
      </article>
    </section>
  )
}
