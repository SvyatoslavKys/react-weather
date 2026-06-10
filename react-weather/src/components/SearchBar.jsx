export function SearchBar({ city, isLoading = false, onCityChange, onSearch }) {
  function handleSubmit(event) {
    event.preventDefault()
    onSearch()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.75rem] border border-white/30 bg-white/15 p-2 shadow-xl backdrop-blur-xl"
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
          className="min-h-14 w-full rounded-[1.2rem] bg-transparent px-4 text-xl text-white outline-none placeholder:text-white/55"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="min-h-14 rounded-[1.2rem] bg-slate-950/18 px-5 text-sm font-semibold tracking-[0.18em] text-white transition hover:bg-slate-950/28 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-40"
        >
          {isLoading ? "SEARCHING" : "SEARCH"}
        </button>
      </div>
    </form>
  )
}
