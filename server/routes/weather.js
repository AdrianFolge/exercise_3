import express from 'express';
import OpenWeatherAPIService from '../../open-weather-api/open-weather-api-service';

const router = express.Router();
const weatherService = new OpenWeatherAPIService();

const cache = {};
const CACHE_SIZE = 5;

router.get('/:city', async function(req, res) {
  const cityName = req.params.city;
  try {
    const weatherData = await weatherService.getWeather(cityName);
    cache[cityName] = {
      cityName: weatherData.name,
      temperature: Math.round(weatherData.main.temp),
      weatherDescription: weatherData.weather[0].description,
      timestamp: Date.now()
    };
    const response = {
      cityName: weatherData.name,
      temperature: Math.round(weatherData.main.temp),
      weatherDescription: weatherData.weather[0].description
    };
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

router.get('/', function(req, res) {
  const max = parseInt(req.query.max);
  if (max < 1) {
    res.status(400).json({ error: 'Invalid max parameter' });
    return;
  }

  const cityEntries = Object.values(cache).sort((a, b) => b.timestamp - a.timestamp);
  let entries;
  if (cityEntries.length > CACHE_SIZE) {
    const cityToRemove = cityEntries[cityEntries.length-1].cityName;
    delete cache[cityToRemove];
    cityEntries.pop();
  }
  if (max >= cityEntries.length || isNaN(max)) {
    entries = cityEntries;
  } else {
    entries = cityEntries.slice(0, max);
  }

  res.json(entries);
});

// clean up cache periodically
setInterval(() => {
  for (const key in cache) {
    delete cache[key];
  }
}, 5000);




export default router;