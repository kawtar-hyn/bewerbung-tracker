// ============================================================
// controllers/authController.js — Registrierung & Login Logik
// Controller-Funktionen halten die Geschäftslogik.
// Routen rufen diese Funktionen auf.
// ============================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Hilfsfunktion: JWT Token erstellen ─────────────────────
const tokenErstellen = (userId) => {
  return jwt.sign(
    { id: userId },                          // Payload: Benutzer-ID
    process.env.JWT_SECRET,                  // Geheimschlüssel aus .env
    { expiresIn: '7d' }                      // Token läuft nach 7 Tagen ab
  );
};

// ── Registrierung ───────────────────────────────────────────
// POST /api/auth/register
// Body: { name, email, passwort }
const registrieren = async (req, res) => {
  const { name, email, passwort } = req.body;

  try {
    // Pflichtfelder prüfen
    if (!name || !email || !passwort) {
      return res.status(400).json({ nachricht: 'Bitte alle Felder ausfüllen.' });
    }

    // Prüfen ob die E-Mail schon vergeben ist
    const benutzerExistiert = await User.findOne({ email });
    if (benutzerExistiert) {
      return res.status(400).json({ nachricht: 'Diese E-Mail-Adresse ist bereits registriert.' });
    }

    // Neuen Benutzer erstellen (Passwort wird im Model automatisch gehasht)
    const neuerBenutzer = await User.create({ name, email, passwort });

    // Token erstellen und zurückgeben
    const token = tokenErstellen(neuerBenutzer._id);

    res.status(201).json({
      token,
      benutzer: {
        id: neuerBenutzer._id,
        name: neuerBenutzer.name,
        email: neuerBenutzer.email,
      },
      nachricht: 'Registrierung erfolgreich!',
    });
  } catch (fehler) {
    console.error('Registrierungsfehler:', fehler);
    res.status(500).json({ nachricht: 'Serverfehler bei der Registrierung.' });
  }
};

// ── Login ───────────────────────────────────────────────────
// POST /api/auth/login
// Body: { email, passwort }
const anmelden = async (req, res) => {
  const { email, passwort } = req.body;

  try {
    if (!email || !passwort) {
      return res.status(400).json({ nachricht: 'E-Mail und Passwort erforderlich.' });
    }

    // Benutzer in der Datenbank suchen
    const benutzer = await User.findOne({ email });
    if (!benutzer) {
      return res.status(401).json({ nachricht: 'Ungültige E-Mail oder Passwort.' });
    }

    // Passwort vergleichen (bcrypt-Vergleich)
    const passwortKorrekt = await benutzer.passwortVergleichen(passwort);
    if (!passwortKorrekt) {
      return res.status(401).json({ nachricht: 'Ungültige E-Mail oder Passwort.' });
    }

    const token = tokenErstellen(benutzer._id);

    res.json({
      token,
      benutzer: {
        id: benutzer._id,
        name: benutzer.name,
        email: benutzer.email,
      },
    });
  } catch (fehler) {
    console.error('Login-Fehler:', fehler);
    res.status(500).json({ nachricht: 'Serverfehler beim Login.' });
  }
};

// ── Aktuellen Benutzer holen ────────────────────────────────
// GET /api/auth/mich — gibt den eingeloggten Benutzer zurück
const ichHolen = async (req, res) => {
  res.json({
    id: req.benutzer._id,
    name: req.benutzer.name,
    email: req.benutzer.email,
  });
};

module.exports = { registrieren, anmelden, ichHolen };
