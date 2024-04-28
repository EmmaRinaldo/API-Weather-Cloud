// Gère la création et la récupération des sessions, communique avec les APIs OpenWeather
import dotenv from 'dotenv';

import moment from 'moment-timezone';
import Session from '../models/sessionModel.js';
import { fetchWeatherData } from '../services/weatherService.js';

dotenv.config({ path: '../.env' });

export const createSession = async (req, res) => {

    const { email, lat, lng, timezone } = req.body;

    if (!timezone) {
        return res.status(400).json({ message: "Timezone is required" });
    }

    try {
        // Appel au service météo pour enrichir les données
        const weatherData = await fetchWeatherData(lat, lng);

        const currentDate = moment().tz(timezone);
        const formattedDate = currentDate.format('DD/MM/YYYY');
        const formattedTime = currentDate.format('HH[h]mm');

        const newSession = new Session({
        email,
        lat,
        lng,
        date: formattedDate,
        time: formattedTime,
        name: weatherData.name,
        temperature: weatherData.temperature,
        weather: weatherData.weather,
        weatherIcon: weatherData.icon,
        temp_min: weatherData.temp_min,
        temp_max: weatherData.temp_max,
        feels_like: weatherData.feels_like,
        humidity: weatherData.humidity,
        wind: {
            speed: weatherData.wind.speed, 
            deg: weatherData.wind.deg,     
            gust: weatherData.wind.gust,
        },
        });
        await newSession.save();
        res.status(201).json(newSession);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getLastSession = async (req, res) => {
    const { email } = req.query;  // Récupère l'email à partir des paramètres de requête
    if (!email) {
        return res.status(400).json({ message: "Email parameter is required." });
    }
    try {
        const session = await Session.findOne().sort({ createdAt: -1 });
        if (!session) {
            return res.status(404).send('No session data found.');
        }
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getSessionsByEmail = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Email is required as a query parameter." });
    }

    try {
        const sessions = await Session.find({ email }).sort({ date: -1, time: -1 });
        res.json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error.stack);
        res.status(500).json({ message: error.message });
    }
};




