export function PositionDetailsGrid({ items, mode = "dark" }) {
  const isLight = mode === "light"

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-[1.5rem] border p-4 ${
            isLight
              ? "border-slate-900/10 bg-slate-950/6"
              : "border-white/16 bg-white/7"
          }`}
        >
          <p className={`text-xs uppercase tracking-[0.28em] ${
            isLight ? "text-slate-900/42" : "text-white/48"
          }`}>
            {item.label}
          </p>
          <p className={`mt-3 text-lg font-semibold ${
            isLight ? "text-slate-950" : "text-white"
          }`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  )
}
