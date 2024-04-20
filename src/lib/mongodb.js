import dotenv from 'dotenv';
import {MongoClient} from 'mongodb';
import mongoose from 'mongoose';
dotenv.config({ path: '../.env' });

//Connection database with MongoDB

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;


export async function connectToDatabase() {

    if (mongoose.connection.readyState) {
        console.log("Already connected to database");
        return moongose;
    }

    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
        return mongoose;
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw error; // Lève une exception pour indiquer l'échec de la connexion
    }
}

