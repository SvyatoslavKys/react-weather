export function PositionDetailsGrid({ items }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[1.5rem] border border-white/16 bg-white/7 p-4"
        >
          <p className="text-xs uppercase tracking-[0.28em] text-white/48">
            {item.label}
          </p>
          <p className="mt-3 text-lg font-semibold text-white">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  )
}
