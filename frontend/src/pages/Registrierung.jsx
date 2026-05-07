// ============================================================
// pages/Registrierung.jsx — Registrierungsseite
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Registrierung = () => {
  const navigate = useNavigate();
  const { registrieren } = useAuth();

  const [formular, setFormular] = useState({ name: '', email: '', passwort: '', passwortWiederholen: '' });
  const [fehler, setFehler] = useState('');
  const [laden, setLaden] = useState(false);

  const handleChange = (e) => {
    setFormular({ ...formular, [e.target.name]: e.target.value });
    setFehler('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Passwörter vergleichen
    if (formular.passwort !== formular.passwortWiederholen) {
      return setFehler('Die Passwörter stimmen nicht überein.');
    }
    if (formular.passwort.length < 6) {
      return setFehler('Das Passwort muss mindestens 6 Zeichen lang sein.');
    }

    setLaden(true);
    try {
      await registrieren(formular.name, formular.email, formular.passwort);
      navigate('/dashboard');
    } catch (err) {
      setFehler(err.response?.data?.nachricht || 'Registrierung fehlgeschlagen.');
    } finally {
      setLaden(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md animiert">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <span className="text-white text-xl font-bold">BT</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Konto erstellen</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Starte deine Bewerbungsverwaltung</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fehler && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-red-700 dark:text-red-300 text-sm">
                {fehler}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Vollständiger Name
              </label>
              <input type="text" name="name" value={formular.name} onChange={handleChange}
                placeholder="Max Mustermann" required className="eingabe" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                E-Mail-Adresse
              </label>
              <input type="email" name="email" value={formular.email} onChange={handleChange}
                placeholder="max@beispiel.de" required className="eingabe" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Passwort
              </label>
              <input type="password" name="passwort" value={formular.passwort} onChange={handleChange}
                placeholder="Mindestens 6 Zeichen" required className="eingabe" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Passwort wiederholen
              </label>
              <input type="password" name="passwortWiederholen" value={formular.passwortWiederholen}
                onChange={handleChange} placeholder="••••••••" required className="eingabe" />
            </div>

            <button type="submit" disabled={laden} className="btn-primary w-full justify-center py-3 mt-2">
              {laden ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Registrieren...</>
              ) : 'Konto erstellen'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Bereits ein Konto?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">Anmelden</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registrierung;
