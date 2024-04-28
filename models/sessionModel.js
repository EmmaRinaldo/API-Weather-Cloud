import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  name: { type: String, required: true },
  temperature: { type: Number, required: true },
  weather: { type: String, required: true },
  weatherIcon: { type: String, required: true },
  temp_min: { type: Number, required: true },
  temp_max: { type: Number, required: true },
  feels_like: { type: Number, required: true },
  humidity: { type: Number, required: true },
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
