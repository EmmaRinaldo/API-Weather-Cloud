# Weather Cloud — API Backend

Backend RESTful de l'application météo **Weather Cloud** : expose une API sécurisée par JWT permettant à un frontend Angular de s'authentifier, d'envoyer sa position géographique et d'historiser des sessions météo enrichies via l'API OpenWeather.

---

## Skills & Technologies

### Langage & Runtime

| Technologie | Détail |
|---|---|
| **Node.js** | Runtime JavaScript côté serveur, modules ES natifs (`"type": "module"`, `import/export`) |
| **JavaScript ES2022+** | `async/await`, déstructuration, optional chaining |

### Framework & Architecture

| Technologie | Détail |
|---|---|
| **Express 4.x** | Framework HTTP minimaliste — routing, middlewares, gestion des erreurs |
| **Architecture MVC** | Séparation stricte en couches : `routes/` → `controllers/` → `services/` → `models/` |
| **Service Layer** | Logique métier isolée dans `weatherService.js` (appel API externe), indépendante des controllers |
| **Middleware custom** | `authMiddleware.js` — intercepteur de requêtes HTTP pour la protection de routes |
| **Gestion d'erreurs globale** | Handlers Express dédiés pour les erreurs 404 et 500 enregistrés après les routes |

### Base de données & ODM

| Technologie | Détail |
|---|---|
| **MongoDB Atlas** | Base de données NoSQL hébergée dans le cloud (cluster MongoDB managé) |
| **Mongoose 8.x** | ODM (Object Document Mapper) — définition de schémas typés, validation, timestamps automatiques (`createdAt`, `updatedAt`) |
| **Schémas Mongoose** | `UserSchema` (index unique sur `email`, normalisation `lowercase`/`trim`) et `SessionSchema` (données météo complètes) |
| **Singleton de connexion** | `lib/mongodb.js` — vérification de `readyState` pour éviter les connexions multiples |

### Authentification & Sécurité

| Technologie | Détail |
|---|---|
| **JWT — `jsonwebtoken` 9.x** | Génération de tokens signés avec payload `{ sub: userId, email }`, expiration de 7 jours |
| **Hachage de mots de passe — `bcryptjs`** | Hachage avec un salt factor de 10 rounds à l'inscription, comparaison sécurisée à la connexion |
| **Bearer Token** | Extraction et vérification du token depuis le header `Authorization: Bearer <token>` |
| **Protection de routes** | `authMiddleware` appliqué globalement sur le préfixe `/api/sessions` — toutes les routes sessions sont authentifiées |
| **Gestion des doublons** | Code d'erreur MongoDB `11000` (violation d'index unique) intercepté pour retourner un 422 explicite |

### Intégration d'API externe

| Technologie | Détail |
|---|---|
| **OpenWeather API** | Consommation de l'endpoint `Current Weather Data` (v2.5) avec coordonnées GPS et unités métriques |
| **`node-fetch` 3.x** | Client HTTP natif ES Modules pour les appels vers OpenWeather |
| **Pattern anti-doublon** | Avant tout appel OpenWeather, vérification si une session existe déjà dans les 5 dernières minutes pour le même utilisateur (économie de quota API) |

### Gestion du temps

| Technologie | Détail |
|---|---|
| **`moment-timezone`** | Formatage des dates et heures selon le fuseau horaire de l'utilisateur (`timezone` envoyé par le frontend) |

### Configuration & Middlewares transverses

| Technologie | Détail |
|---|---|
| **`dotenv`** | Chargement des variables d'environnement depuis `.env` — aucune credential hardcodée |
| **`cors`** | Middleware de gestion du Cross-Origin Resource Sharing pour autoriser les appels depuis le frontend Angular |
| **`express.json()`** | Parsing automatique des corps de requête JSON |
| **`multer`** | Middleware de gestion des uploads multipart (dépendance intégrée) |

### Déploiement

| Technologie | Détail |
|---|---|
| **Heroku / Render / Railway** | `Procfile` présent (`web: node index.js`) — compatible avec toute plateforme PaaS lisant un Procfile |
| **Variables d'environnement** | Configuration 100% externalisée — `.env.example` fourni comme référence |

---

## Structure du projet

```
├── controllers/
│   ├── authController.js      # Inscription, connexion, génération JWT
│   └── sessionController.js   # Création et récupération des sessions météo
├── lib/
│   └── mongodb.js             # Connexion Mongoose (singleton)
├── middleware/
│   └── authMiddleware.js      # Vérification du Bearer token JWT
├── models/
│   ├── userModel.js           # Schéma Mongoose User
│   └── sessionModel.js        # Schéma Mongoose Session
├── routes/
│   ├── authRoutes.js          # POST /register, POST /login
│   └── sessionRoutes.js       # Routes sessions (protégées)
├── services/
│   └── weatherService.js      # Appel OpenWeather API
├── index.js                   # Point d'entrée — Express, CORS, routes, démarrage
├── Procfile                   # Déploiement PaaS
└── .env.example               # Template des variables d'environnement
```

---

## Prérequis

- **Node.js** >= 18.x
- **npm** >= 9.x
- Un cluster **MongoDB Atlas** (ou instance MongoDB locale)
- Une clé API **OpenWeather** (compte gratuit suffisant)

---

## Installation

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd API-Weather-Cloud

# Installer les dépendances
npm install
```

---

## Configuration

Copier le fichier d'exemple et renseigner les valeurs :

```bash
cp .env.example .env
```

| Variable | Description | Exemple |
|---|---|---|
| `MONGODB_URI` | URI de connexion MongoDB Atlas | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/` |
| `JWT_SECRET` | Clé secrète pour signer les tokens JWT (chaîne aléatoire longue) | `un_secret_tres_long_et_aleatoire` |
| `OPENWEATHER_API_KEY` | Clé API OpenWeather | `abc123def456...` |
| `PORT` | Port d'écoute du serveur (optionnel, défaut : `3000`) | `3000` |

> **Sécurité** : ne jamais commiter le fichier `.env`. Il est ignoré par `.gitignore`.

---

## Lancer en local

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`. La connexion à MongoDB est établie au démarrage — en cas d'échec, le processus s'arrête (`process.exit(1)`).

---

## Routes API

### Authentification — `/api/auth`

Routes publiques, sans protection JWT.

| Méthode | Route | Description | Auth requise |
|---|---|---|---|
| `POST` | `/api/auth/register` | Inscription — crée un utilisateur, retourne un token JWT | Non |
| `POST` | `/api/auth/login` | Connexion — vérifie les credentials, retourne un token JWT | Non |

**Corps attendu :**
```json
{
  "email": "utilisateur@exemple.com",
  "password": "motdepasse"
}
```

**Réponse (200/201) :**
```json
{
  "token": "<jwt>",
  "user": { "id": "...", "email": "utilisateur@exemple.com" }
}
```

---

### Sessions météo — `/api/sessions`

Toutes ces routes nécessitent le header : `Authorization: Bearer <token>`

| Méthode | Route | Description | Auth requise |
|---|---|---|---|
| `POST` | `/api/sessions` | Crée une session météo (appel OpenWeather + sauvegarde en base) | Oui |
| `GET` | `/api/sessions/latest?email=` | Récupère la session la plus récente | Oui |
| `GET` | `/api/sessions/sessionsByEmail?email=` | Récupère l'historique complet des sessions d'un utilisateur | Oui |

**Corps attendu (POST `/api/sessions`) :**
```json
{
  "email": "utilisateur@exemple.com",
  "lat": 48.8566,
  "lng": 2.3522,
  "timezone": "Europe/Paris"
}
```

> **Anti-doublon** : si une session a déjà été créée pour cet email dans les 5 dernières minutes, elle est retournée directement sans nouvel appel à OpenWeather.

---

## Déploiement

Le projet est prêt à être déployé sur **Heroku**, **Render** ou **Railway** grâce au `Procfile`.

```
web: node index.js
```

**Étapes génériques :**

1. Créer une application sur la plateforme choisie
2. Lier le dépôt Git (ou pousser via CLI)
3. Définir les variables d'environnement (`MONGODB_URI`, `JWT_SECRET`, `OPENWEATHER_API_KEY`) dans le dashboard de la plateforme
4. Déployer — la plateforme exécute automatiquement `node index.js`

> **Avant la mise en production** : restreindre la valeur de `origin` dans la configuration CORS ([index.js](index.js)) à l'URL exacte du frontend Angular.
