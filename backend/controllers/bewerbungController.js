// controllers/bewerbungController.js — CRUD für Bewerbungen
// Create, Read, Update, Delete — alle Operationen für Bewerbungen

const Bewerbung = require('../models/Bewerbung');
const path = require('path');
const fs = require('fs');

// ── Alle Bewerbungen des Benutzers holen ────────────────────
// GET /api/bewerbungen
const alleBewerbungenHolen = async (req, res) => {
  try {
    const { status, suche, sortieren } = req.query;

    // Filter: nur Bewerbungen des eingeloggten Benutzers
    const filter = { benutzer: req.benutzer._id };

    // Optional nach Status filtern
    if (status && status !== 'Alle') {
      filter.status = status;
    }

    // Optional Textsuche in Firmenname und Position
    if (suche) {
      filter.$or = [
        { firmenname: { $regex: suche, $options: 'i' } }, // 'i' = case-insensitive
        { position: { $regex: suche, $options: 'i' } },
        { ort: { $regex: suche, $options: 'i' } },
      ];
    }

    // Sortierung (Standard: neueste zuerst)
    let sortOption = { createdAt: -1 };
    if (sortieren === 'datum_alt') sortOption = { bewerbungsdatum: 1 };
    if (sortieren === 'datum_neu') sortOption = { bewerbungsdatum: -1 };
    if (sortieren === 'firma') sortOption = { firmenname: 1 };

    const bewerbungen = await Bewerbung.find(filter).sort(sortOption);

    res.json(bewerbungen);
  } catch (fehler) {
    console.error('Fehler beim Laden:', fehler);
    res.status(500).json({ nachricht: 'Fehler beim Laden der Bewerbungen.' });
  }
};

// ── Statistiken für das Dashboard ──────────────────────────
// GET /api/bewerbungen/statistiken
const statistikenHolen = async (req, res) => {
  try {
    const userId = req.benutzer._id;

    // Zähle Bewerbungen nach Status (Aggregation)
    const stats = await Bewerbung.aggregate([
      { $match: { benutzer: userId } },
      { $group: { _id: '$status', anzahl: { $sum: 1 } } },
    ]);

    // Gesamtanzahl
    const gesamt = await Bewerbung.countDocuments({ benutzer: userId });

    // Bald fällige Erinnerungen (nächste 7 Tage)
    const heute = new Date();
    const in7Tagen = new Date(heute.getTime() + 7 * 24 * 60 * 60 * 1000);
    const erinnerungen = await Bewerbung.countDocuments({
      benutzer: userId,
      erinnerungDatum: { $gte: heute, $lte: in7Tagen },
    });

    // Monatliche Bewerbungen für den Chart (letzten 6 Monate)
    const sechsMonateAgo = new Date();
    sechsMonateAgo.setMonth(sechsMonateAgo.getMonth() - 6);

    const monatlich = await Bewerbung.aggregate([
      { $match: { benutzer: userId, createdAt: { $gte: sechsMonateAgo } } },
      {
        $group: {
          _id: { monat: { $month: '$createdAt' }, jahr: { $year: '$createdAt' } },
          anzahl: { $sum: 1 },
        },
      },
      { $sort: { '_id.jahr': 1, '_id.monat': 1 } },
    ]);

    // Ergebnis strukturieren
    const statusMap = { Beworben: 0, Interview: 0, Angenommen: 0, Abgelehnt: 0 };
    stats.forEach((s) => {
      if (statusMap.hasOwnProperty(s._id)) {
        statusMap[s._id] = s.anzahl;
      }
    });

    res.json({
      gesamt,
      ...statusMap,
      erinnerungen,
      monatlich,
    });
  } catch (fehler) {
    console.error('Statistik-Fehler:', fehler);
    res.status(500).json({ nachricht: 'Fehler beim Laden der Statistiken.' });
  }
};

// ── Einzelne Bewerbung holen ────────────────────────────────
// GET /api/bewerbungen/:id
const eineBewerbungHolen = async (req, res) => {
  try {
    const bewerbung = await Bewerbung.findOne({
      _id: req.params.id,
      benutzer: req.benutzer._id, // Sicherheit: nur eigene Bewerbungen
    });

    if (!bewerbung) {
      return res.status(404).json({ nachricht: 'Bewerbung nicht gefunden.' });
    }

    res.json(bewerbung);
  } catch (fehler) {
    res.status(500).json({ nachricht: 'Fehler beim Laden der Bewerbung.' });
  }
};

// ── Neue Bewerbung erstellen ────────────────────────────────
// POST /api/bewerbungen
const bewerbungErstellen = async (req, res) => {
  try {
    const { firmenname, ort, position, status, bewerbungsdatum, notizen, erinnerungDatum } = req.body;

    if (!firmenname || !ort || !position) {
      return res.status(400).json({ nachricht: 'Firma, Ort und Position sind Pflichtfelder.' });
    }

    const neueBewerbung = await Bewerbung.create({
      benutzer: req.benutzer._id,
      firmenname,
      ort,
      position,
      status: status || 'Beworben',
      bewerbungsdatum: bewerbungsdatum || Date.now(),
      notizen,
      erinnerungDatum,
    });

    res.status(201).json(neueBewerbung);
  } catch (fehler) {
    console.error('Erstellungsfehler:', fehler);
    res.status(500).json({ nachricht: 'Fehler beim Erstellen der Bewerbung.' });
  }
};

// ── Bewerbung aktualisieren ─────────────────────────────────
// PUT /api/bewerbungen/:id
const bewerbungAktualisieren = async (req, res) => {
  try {
    const bewerbung = await Bewerbung.findOneAndUpdate(
      { _id: req.params.id, benutzer: req.benutzer._id },
      req.body,
      { new: true, runValidators: true } // 'new: true' gibt die aktualisierte Version zurück
    );

    if (!bewerbung) {
      return res.status(404).json({ nachricht: 'Bewerbung nicht gefunden.' });
    }

    res.json(bewerbung);
  } catch (fehler) {
    res.status(500).json({ nachricht: 'Fehler beim Aktualisieren.' });
  }
};

// ── Bewerbung löschen ───────────────────────────────────────
// DELETE /api/bewerbungen/:id
const bewerbungLoeschen = async (req, res) => {
  try {
    const bewerbung = await Bewerbung.findOneAndDelete({
      _id: req.params.id,
      benutzer: req.benutzer._id,
    });

    if (!bewerbung) {
      return res.status(404).json({ nachricht: 'Bewerbung nicht gefunden.' });
    }

    res.json({ nachricht: 'Bewerbung erfolgreich gelöscht.' });
  } catch (fehler) {
    res.status(500).json({ nachricht: 'Fehler beim Löschen.' });
  }
};

// ── Dokument hochladen ──────────────────────────────────────
// POST /api/bewerbungen/:id/dokument
const dokumentHochladen = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ nachricht: 'Keine Datei hochgeladen.' });
    }

    const { typ } = req.body; // 'lebenslauf' oder 'anschreiben'
    if (!['lebenslauf', 'anschreiben'].includes(typ)) {
      return res.status(400).json({ nachricht: 'Ungültiger Dokumenttyp.' });
    }

    const bewerbung = await Bewerbung.findOne({
      _id: req.params.id,
      benutzer: req.benutzer._id,
    });

    if (!bewerbung) {
      return res.status(404).json({ nachricht: 'Bewerbung nicht gefunden.' });
    }

    // Alte Datei löschen falls vorhanden
    if (bewerbung.dokumente[typ]) {
      const altePfad = path.join(__dirname, '..', bewerbung.dokumente[typ]);
      if (fs.existsSync(altePfad)) {
        fs.unlinkSync(altePfad);
      }
    }

    // Neuen Dateipfad speichern
    bewerbung.dokumente[typ] = `uploads/${req.file.filename}`;
    await bewerbung.save();

    res.json({ nachricht: 'Dokument erfolgreich hochgeladen.', bewerbung });
  } catch (fehler) {
    console.error('Upload-Fehler:', fehler);
    res.status(500).json({ nachricht: 'Fehler beim Hochladen.' });
  }
};

module.exports = {
  alleBewerbungenHolen,
  statistikenHolen,
  eineBewerbungHolen,
  bewerbungErstellen,
  bewerbungAktualisieren,
  bewerbungLoeschen,
  dokumentHochladen,
};
