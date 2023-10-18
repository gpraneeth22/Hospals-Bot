const axios = require('axios');
const { getSunTime } = require('./utils');
const countries = require('country-list')
require('dotenv').config()

const OPENWEATHERMAP_BASE_URL = 'https://api.openweathermap.org/response.data/2.5';

const getWeatherUpdates = async (lat, lon) => {

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6e2fc2646b3384b5728d6389e687c515`)
    const sunTime = getSunTime(response.data.sys.sunrise, response.data.sys.sunset)

    const weatherUpdate = {
        "city": response.data.name,
        "country": countries.getName(response.data.sys.country),
        "temperature": (response.data.main.temp - 273.15).toFixed(2) + "°C\n",
        "feelsLike": (response.data.main.feels_like - 273.15).toFixed(2) + "°C\n",
        "humidity": response.data.main.humidity.toString() + "%\n",
        "wind": response.data.wind.speed.toString() + "m/s\n",
        "clouds": response.data.clouds.all.toString() + "%\n",
        "currentWeather": response.data.weather[0].main + "\n",
        "description": response.data.weather[0].description.toUpperCase(),
        "sunrise": sunTime.sunriseTime + "\n",
        "sunset": sunTime.sunsetTime + "\n\n"
    }
    const message = "Current Weather: " + weatherUpdate['currentWeather'] + "\n" +
                    "🌡️ Temperature: " + weatherUpdate['temperature'] +
                    "🌡️ Feels Like: " + weatherUpdate['feelsLike'] +
                    "🌊 Humidity: " + weatherUpdate['humidity'] +
                    "💨 Wind: " + weatherUpdate['wind'] + 
                    "☁️ Clouds: " + weatherUpdate['clouds'] +
                    "🌞 Sunrise: " + weatherUpdate['sunrise'] + 
                    "🌅 Sunset: " + weatherUpdate['sunset'] +
                    weatherUpdate['description'] + " in " + weatherUpdate['city'] + ", " + weatherUpdate['country'] + "\n" +
                    "Enjoy your day! ☔️"
    return message

}

module.exports = {
  getWeatherUpdates
}