// ============================================================
// models/User.js — Datenbankmodell für Benutzer
// Hier definieren wir die Struktur eines Benutzers in MongoDB.
// Passwörter werden gehasht (nie im Klartext gespeichert!).
// ============================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name ist erforderlich'],
      trim: true, // entfernt Leerzeichen am Anfang und Ende
    },
    email: {
      type: String,
      required: [true, 'E-Mail ist erforderlich'],
      unique: true,          // jede E-Mail nur einmal
      lowercase: true,       // immer kleinschreiben
      trim: true,
    },
    passwort: {
      type: String,
      required: [true, 'Passwort ist erforderlich'],
      minlength: [6, 'Passwort muss mindestens 6 Zeichen lang sein'],
    },
  },
  {
    timestamps: true, // createdAt und updatedAt werden automatisch gesetzt
  }
);

// ── Passwort hashen vor dem Speichern ──────────────────────
// Diese Funktion wird AUTOMATISCH aufgerufen, bevor der User gespeichert wird.
userSchema.pre('save', async function (next) {
  // Nur hashen, wenn das Passwort geändert wurde
  if (!this.isModified('passwort')) return next();

  // bcrypt-Kostenfaktor: 12 = sehr sicher, aber etwas langsamer
  const salt = await bcrypt.genSalt(12);
  this.passwort = await bcrypt.hash(this.passwort, salt);
  next();
});

// ── Methode: Passwort vergleichen ───────────────────────────
// Wird beim Login verwendet, um eingegebenes Passwort zu prüfen
userSchema.methods.passwortVergleichen = async function (eingegebenesPasswort) {
  return await bcrypt.compare(eingegebenesPasswort, this.passwort);
};

module.exports = mongoose.model('User', userSchema);
