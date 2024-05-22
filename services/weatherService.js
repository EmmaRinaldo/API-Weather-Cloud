// Service pour interagir avec l'API OpenWeather
import dotenv from 'dotenv';

import fetch from 'node-fetch';
dotenv.config({ path: '../.env' });

export async function fetchWeatherData(lat, lng) {
  const apiKey = process.env.OPENWEATHER_API_KEY; // Votre clé API pour OpenWeather
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=fr`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data || !data.main || !data.weather) {
      console.error("Incomplete data:", data);
      throw new Error('Weather data is incomplete or unavailable.');
    }
    return {
      name: data.name,
      temperature: data.main.temp,
      weather: data.weather[0].description,
      icon: data.weather[0].icon,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
    };
  } catch (error) {
      console.error('Failed to fetch weather data:', error);
      throw error;  // Rethrow to handle it in the calling function
  }
}




