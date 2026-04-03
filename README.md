# API Weather Cloud

API REST Node.js/Express pour la gestion de sessions météo, avec stockage MongoDB et intégration OpenWeatherMap.

## Stack

- **Node.js** + **Express**
- **MongoDB** (via Mongoose)
- **OpenWeatherMap API**
- **dotenv**, **cors**, **moment-timezone**

## Installation

```bash
npm install
```

## Configuration

Copie le fichier `.env.example` en `.env` et renseigne tes variables :

```bash
cp .env.example .env
```

| Variable              | Description                          |
|-----------------------|--------------------------------------|
| `MONGODB_URI`         | URI de connexion MongoDB Atlas       |
| `OPENWEATHER_API_KEY` | Clé API OpenWeatherMap               |
| `PORT`                | Port du serveur (défaut : `3000`)    |

## Lancement

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`.

## Endpoints

Base URL : `/api/sessions`

| Méthode | Route                          | Description                              |
|---------|--------------------------------|------------------------------------------|
| `POST`  | `/api/sessions`                | Créer une nouvelle session               |
| `GET`   | `/api/sessions/latest`         | Récupérer la dernière session            |
| `GET`   | `/api/sessions/sessionsByEmail`| Récupérer les sessions par email         |

## Structure

```
├── controllers/
│   └── sessionController.js
├── lib/
│   └── mongodb.js
├── models/
├── routes/
│   └── sessionRoutes.js
├── services/
├── index.js
└── .env
```
