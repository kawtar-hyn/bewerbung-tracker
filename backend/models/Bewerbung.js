// ============================================================
// models/Bewerbung.js — Datenbankmodell für Bewerbungen
// Jede Bewerbung gehört zu einem Benutzer (user-Referenz).
// ============================================================

const mongoose = require('mongoose');

const bewerbungSchema = new mongoose.Schema(
  {
    // Verknüpfung mit dem Benutzer — jede Bewerbung gehört einem User
    benutzer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    firmenname: {
      type: String,
      required: [true, 'Firmenname ist erforderlich'],
      trim: true,
    },

    ort: {
      type: String,
      required: [true, 'Ort ist erforderlich'],
      trim: true,
    },

    position: {
      type: String,
      required: [true, 'Position ist erforderlich'],
      trim: true,
    },

    // Status der Bewerbung — nur diese Werte sind erlaubt
    status: {
      type: String,
      enum: ['Beworben', 'Interview', 'Angenommen', 'Abgelehnt'],
      default: 'Beworben',
    },

    bewerbungsdatum: {
      type: Date,
      default: Date.now, // Standardmäßig heutiges Datum
    },

    notizen: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notizen dürfen maximal 1000 Zeichen lang sein'],
    },

    // Erinnerungsdatum für Nachfassen
    erinnerungDatum: {
      type: Date,
    },

    // Hochgeladene Dateien (nur Dateinamen/Pfade)
    dokumente: {
      lebenslauf: {
        type: String, // Pfad zur Datei z.B. "uploads/lebenslauf-123.pdf"
        default: null,
      },
      anschreiben: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true, // Erstellt automatisch createdAt und updatedAt
  }
);

// ── Index für schnellere Abfragen ───────────────────────────
// Oft werden Bewerbungen nach Benutzer und Status gefiltert
bewerbungSchema.index({ benutzer: 1, status: 1 });

module.exports = mongoose.model('Bewerbung', bewerbungSchema);
