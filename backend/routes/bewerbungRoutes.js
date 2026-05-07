// ============================================================
// routes/bewerbungRoutes.js — Routen für Bewerbungen
// Multer: Library für Datei-Uploads
// ============================================================

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  alleBewerbungenHolen,
  statistikenHolen,
  eineBewerbungHolen,
  bewerbungErstellen,
  bewerbungAktualisieren,
  bewerbungLoeschen,
  dokumentHochladen,
} = require('../controllers/bewerbungController');

const { schuetzen } = require('../middleware/authMiddleware');

// ── Multer Konfiguration für Datei-Uploads ──────────────────
const speicher = multer.diskStorage({
  // Zielordner für Uploads
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  // Dateiname: eindeutig durch Zeitstempel + Originalname
  filename: (req, file, cb) => {
    const einzigartiger = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, einzigartiger + path.extname(file.originalname));
  },
});

// Nur PDF-Dateien erlauben
const dateiFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true); // Datei akzeptieren
  } else {
    cb(new Error('Nur PDF-Dateien sind erlaubt!'), false);
  }
};

const upload = multer({
  storage: speicher,
  fileFilter: dateiFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max. 5 MB
});

// ── Alle Routen sind geschützt (Login erforderlich) ─────────
router.use(schuetzen);

// Statistiken für Dashboard
router.get('/statistiken', statistikenHolen);

// CRUD Routen
router.get('/', alleBewerbungenHolen);                                          // Alle holen
router.post('/', bewerbungErstellen);                                           // Neue erstellen
router.get('/:id', eineBewerbungHolen);                                         // Eine holen
router.put('/:id', bewerbungAktualisieren);                                     // Aktualisieren
router.delete('/:id', bewerbungLoeschen);                                       // Löschen

// Datei-Upload Route
router.post('/:id/dokument', upload.single('datei'), dokumentHochladen);

module.exports = router;
