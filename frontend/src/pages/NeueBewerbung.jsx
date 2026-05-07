// ============================================================
// pages/NeueBewerbung.jsx — Formular für neue Bewerbungen
// ============================================================

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { format } from 'date-fns';

const NeueBewerbung = () => {
  const navigate = useNavigate();
  const [laden, setLaden] = useState(false);
  const [fehler, setFehler] = useState('');

  // Formularfelder mit Standardwerten
  const [formular, setFormular] = useState({
    firmenname: '',
    ort: '',
    position: '',
    status: 'Beworben',
    bewerbungsdatum: format(new Date(), 'yyyy-MM-dd'), // Heutiges Datum
    notizen: '',
    erinnerungDatum: '',
  });

  const handleChange = (e) => {
    setFormular({ ...formular, [e.target.name]: e.target.value });
    setFehler('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLaden(true);
    setFehler('');

    try {
      const res = await api.post('/bewerbungen', formular);
      // Nach Erstellen zur Detail-Seite navigieren
      navigate(`/bewerbungen/${res.data._id}`);
    } catch (err) {
      setFehler(err.response?.data?.nachricht || 'Fehler beim Speichern.');
      setLaden(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Seitenkopf */}
      <div className="mb-6">
        <Link to="/bewerbungen" className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1 mb-3">
          ← Zurück zur Übersicht
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Bewerbung hinzufügen</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Trage deine neue Bewerbung ein und behalte den Überblick
        </p>
      </div>

      {/* Formular */}
      <div className="karte">
        <form onSubmit={handleSubmit} className="space-y-5">
          {fehler && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-red-700 dark:text-red-300 text-sm">
              {fehler}
            </div>
          )}

          {/* Pflichtfelder */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Firmenname <span className="text-red-500">*</span>
              </label>
              <input type="text" name="firmenname" value={formular.firmenname}
                onChange={handleChange} placeholder="z.B. SAP SE, BMW AG" required className="eingabe" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Ort / Stadt <span className="text-red-500">*</span>
              </label>
              <input type="text" name="ort" value={formular.ort}
                onChange={handleChange} placeholder="z.B. München, Berlin" required className="eingabe" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Position / Ausbildungsberuf <span className="text-red-500">*</span>
            </label>
            <input type="text" name="position" value={formular.position}
              onChange={handleChange} placeholder="z.B. Ausbildung Fachinformatiker Anwendungsentwicklung"
              required className="eingabe" />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Status
              </label>
              <select name="status" value={formular.status} onChange={handleChange} className="eingabe">
                <option value="Beworben">📤 Beworben</option>
                <option value="Interview">🎙️ Interview</option>
                <option value="Angenommen">✅ Angenommen</option>
                <option value="Abgelehnt">❌ Abgelehnt</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Bewerbungsdatum
              </label>
              <input type="date" name="bewerbungsdatum" value={formular.bewerbungsdatum}
                onChange={handleChange} className="eingabe" />
            </div>
          </div>

          {/* Erinnerungsdatum */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              🔔 Erinnerung: Nachfassen am
            </label>
            <input type="date" name="erinnerungDatum" value={formular.erinnerungDatum}
              onChange={handleChange} className="eingabe" />
            <p className="text-xs text-slate-400 mt-1">
              Tipp: Fasse nach 2 Wochen nach, falls du keine Antwort erhältst.
            </p>
          </div>

          {/* Notizen */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Notizen
            </label>
            <textarea
              name="notizen"
              value={formular.notizen}
              onChange={handleChange}
              placeholder="z.B. Ansprechpartner, besondere Anforderungen, Gehaltsvorstellung..."
              rows={4}
              className="eingabe resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-slate-400 mt-1 text-right">
              {formular.notizen.length}/1000 Zeichen
            </p>
          </div>

          {/* Aktions-Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
            <Link to="/bewerbungen" className="btn-sekundaer">
              Abbrechen
            </Link>
            <button type="submit" disabled={laden} className="btn-primary">
              {laden ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Speichern...</>
              ) : '💾 Bewerbung speichern'}
            </button>
          </div>
        </form>
      </div>

      {/* Tipp-Box */}
      <div className="mt-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-4">
        <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">💡 Tipp für deine Bewerbung</p>
        <p className="text-indigo-700 dark:text-indigo-300 text-xs mt-1">
          Passe dein Anschreiben für jede Firma individuell an. Erwähne konkrete Projekte und
          zeige, warum genau diese Firma interessant für dich ist.
        </p>
      </div>
    </div>
  );
};

export default NeueBewerbung;
