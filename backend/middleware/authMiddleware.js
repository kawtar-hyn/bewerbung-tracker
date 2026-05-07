// ============================================================
// middleware/authMiddleware.js — JWT-Authentifizierungs-Middleware
// Schützt Routen vor nicht angemeldeten Benutzern.
// Jede geschützte Route ruft diese Funktion zuerst auf.
// ============================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const schuetzen = async (req, res, next) => {
  let token;

  // JWT Token wird im Authorization-Header übertragen: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Nur den Token-Teil nehmen
  }

  // Kein Token = nicht eingeloggt
  if (!token) {
    return res.status(401).json({ nachricht: 'Nicht autorisiert. Bitte einloggen.' });
  }

  try {
    // Token entschlüsseln und prüfen ob er gültig ist
    const dekodiert = jwt.verify(token, process.env.JWT_SECRET);

    // Benutzer aus der Datenbank holen (ohne Passwort!)
    // Das Minus vor "passwort" bedeutet: dieses Feld NICHT zurückgeben
    req.benutzer = await User.findById(dekodiert.id).select('-passwort');

    if (!req.benutzer) {
      return res.status(401).json({ nachricht: 'Benutzer nicht gefunden.' });
    }

    // Weiter zur eigentlichen Route
    next();
  } catch (fehler) {
    return res.status(401).json({ nachricht: 'Token ungültig oder abgelaufen.' });
  }
};

module.exports = { schuetzen };
