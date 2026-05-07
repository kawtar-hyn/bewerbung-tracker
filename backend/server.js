// ============================================================
// server.js — Hauptdatei des Express-Servers
// Hier werden alle Routen, Middleware und die DB-Verbindung
// zusammengeführt und der Server gestartet.
// ============================================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Umgebungsvariablen aus der .env Datei laden
dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────
// CORS erlaubt Anfragen vom React-Frontend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// JSON-Body parsen (für POST/PUT Anfragen)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statischer Ordner für hochgeladene Dokumente (Lebenslauf, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routen ─────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const bewerbungRoutes = require('./routes/bewerbungRoutes');

app.use('/api/auth', authRoutes);              // POST /api/auth/register, /api/auth/login
app.use('/api/bewerbungen', bewerbungRoutes);  // CRUD für Bewerbungen

// ── Gesundheitscheck Route ──────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server läuft' });
});

// ── Datenbankverbindung & Server starten ────────────────────
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bewerbung_tracker';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB verbunden');
    app.listen(PORT, () => {
      console.log(`🚀 Server läuft auf Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Verbindungsfehler:', err.message);
    process.exit(1);
  });
