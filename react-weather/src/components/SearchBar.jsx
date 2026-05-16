export function SearchBar({ city, onCityChange, onSearch }) {
    return (
        <div className="flex items-center gap-2 p-1.5 bg-amber-600">
            <input
                value={city}
                onChange={(event) => onCityChange(event.target.value)}
                type="text"
                placeholder="Write your city"
                className="w-full rounded border border-slate-300 px-3 py-2"
            />
            <button onClick={onSearch} className="bg-amber-500 px-4 py-2 rounded text-white hover:bg-amber-700">Search</button>
        </div>
    )
}