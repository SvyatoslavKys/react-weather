// q= — название города (сразу ищет по имени)
//  units=metric — градусы Цельсия
//  lang=ru — ответ на русском
// appid= — твой API-ключ
// https://api.openweathermap.org/data/2.5/weather?q=Москва&units=metric&lang=ru&appid=YOUR_KEY

// const API_KEY{"temp": 15,"humidity": 70,"main": "Clear","description": "ясно",...}

const API_KEY = "f9d83ffcb4301c9cac35b13c4c483004";
const defApiKey = "4981e52549cd12a6d1fd233bbf04edab";

export async function getWeather(city){
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${defApiKey}`
    const response = await fetch(url)
    const data = await response.json()
     console.log(data)
    return data
} 
// console.log(getWeather("kyiv"))