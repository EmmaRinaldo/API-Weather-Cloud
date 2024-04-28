// Routes pour la gestion des sessions
import express from 'express';
import { createSession, getLastSession, getSessionsByEmail } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/', createSession);
router.get('/latest', getLastSession);
router.get('/sessionsByEmail', getSessionsByEmail);

export default router;
