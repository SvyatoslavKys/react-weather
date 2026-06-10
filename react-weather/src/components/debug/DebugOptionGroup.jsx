function formatLabel(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function DebugOptionGroup({ options, title, value, onSelect }) {
  return (
    <div className="rounded-2xl bg-slate-950/80 p-4 text-white">
      <p className="text-sm uppercase tracking-[0.2em] text-white/60">{title}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`rounded-full px-3 py-2 text-sm transition ${
              value === option
                ? "bg-white text-slate-950"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {formatLabel(option)}
          </button>
        ))}
      </div>
    </div>
  )
}
