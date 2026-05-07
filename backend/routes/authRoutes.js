// ============================================================
// routes/authRoutes.js — Authentifizierungsrouten
// ============================================================

const express = require('express');
const router = express.Router();
const { registrieren, anmelden, ichHolen } = require('../controllers/authController');
const { schuetzen } = require('../middleware/authMiddleware');

// Öffentliche Routen (kein Login erforderlich)
router.post('/register', registrieren);
router.post('/login', anmelden);

// Geschützte Route (Login erforderlich)
router.get('/mich', schuetzen, ichHolen);

module.exports = router;
