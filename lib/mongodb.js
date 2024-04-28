import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: '.env' });

//Connection database with MongoDB

const uri = process.env.MONGODB_URI;


export async function connectToDatabase() {

    if (mongoose.connection.readyState) {
        console.log("Already connected to database");
        return mongoose;
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
        throw error;
    }
}

