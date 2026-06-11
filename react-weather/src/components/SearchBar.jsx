export function SearchBar({ city, isLoading = false, mode = "dark", onCityChange, onSearch }) {
  const isLight = mode === "light"

  function handleSubmit(event) {
    event.preventDefault()
    onSearch()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-[1.75rem] border p-2 shadow-xl backdrop-blur-xl ${
        isLight
          ? "border-slate-900/10 bg-white/20"
          : "border-white/30 bg-white/15"
      }`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="weather-city-input">
          City
        </label>
        <input
          id="weather-city-input"
          value={city}
          onChange={(event) => onCityChange(event.target.value)}
          type="text"
          placeholder="Search city, town or capital"
          className={`min-h-14 w-full rounded-[1.2rem] bg-transparent px-4 text-xl outline-none ${
            isLight
              ? "text-slate-950 placeholder:text-slate-900/40"
              : "text-white placeholder:text-white/55"
          }`}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`min-h-14 rounded-[1.2rem] px-5 text-sm font-semibold tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-40 ${
            isLight
              ? "border border-slate-900/10 bg-slate-950/10 text-slate-950 hover:bg-slate-950/16"
              : "bg-slate-950/18 text-white hover:bg-slate-950/28"
          }`}
        >
          {isLoading ? "SEARCHING" : "SEARCH"}
        </button>
      </div>
    </form>
  )
}
