import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCurrentPosition } from "../services/getCurrentPosition"

export function Homepage() {
    const navigate = useNavigate()
    const [coords, setCoords] = useState(null)
    const [status, setStatus] = useState("idle")
    const [errorMessage, setErrorMessage] = useState("")

    async function handleUseMyLocation() {
        setStatus("loading")
        setErrorMessage("")

        try {
            const position = await getCurrentPosition()
            const lat = position.coords.latitude
            const lon = position.coords.longitude

            console.log(position)
            console.log("lat:", lat)
            console.log("lon:", lon)

            setCoords({ lat, lon })
            setStatus("success")
        } catch (error) {
            console.error("Ошибка геолокации:", error)
            setStatus("error")
            setErrorMessage(error.message)
            navigate("/weather")
        }
    }
	handleUseMyLocation();
    return (
        <>
	        <h1 className="text-3xl font-bold text-black">Home</h1>
            <button
                onClick={handleUseMyLocation}
                className="rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
            >
                Use my location
            </button>
            {status === "loading" && <p>Location...</p>}
            {coords && (
                <div>
                    <p>lat: {coords.lat}</p>
                    <p>lon: {coords.lon}</p>
                </div>
            )}
            {status === "error" && <p>{errorMessage}</p>}
        </>

    )
}
