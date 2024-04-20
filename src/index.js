import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './lib/mongodb.js';
import sessionRoutes from './routes/sessionRoutes.js';



const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*' // Spécifiez l'origine de votre application Angular ici, ou utilisez '*' pour accepter toutes les origines
}));
app.use(express.json());
app.use('/api/sessions', sessionRoutes);


const startServer = async () => {
  try {

    await connectToDatabase();
    console.log("Connected to MongoDB");

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

  } catch (error) {

    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Arrête le processus en cas d'échec de la connexion

  }
};


app.use((req, res, next) => {
    res.status(404).send("Sorry, can't find that!");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

startServer();