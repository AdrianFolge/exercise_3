const axios = require('axios');
/**
 * This class is used retrieve weather data for a given city, by calling the Open Weather API.
 * See here for the Open Weather API documentation - https://openweathermap.org/current.
 */
class OpenWeatherAPIService {

    // The API key that is needed to successfully authenticate when calling the Open Weather API. 
    // if this does not work, register one yourself using the instruction here: https://openweathermap.org/appid
    static apiKey = "c8da4ee199183df66c17fe7a2b6bf6da";

    /**
     * Retrieves the weather data for the given city by calling the Open Weather API.
    */
    async getWeather(cityName) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OpenWeatherAPIService.apiKey}&units=metric`;
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to retrieve weather data');
        }
    }
}

module.exports = OpenWeatherAPIService;
