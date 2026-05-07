// ============================================================
// pages/Login.jsx — Login-Seite
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { anmelden } = useAuth();

  // Formular-Zustand
  const [formular, setFormular] = useState({ email: '', passwort: '' });
  const [fehler, setFehler] = useState('');
  const [laden, setLaden] = useState(false);

  // Input-Änderung verarbeiten
  const handleChange = (e) => {
    setFormular({ ...formular, [e.target.name]: e.target.value });
    setFehler(''); // Fehler zurücksetzen bei Eingabe
  };

  // Formular absenden
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLaden(true);
    setFehler('');

    try {
      await anmelden(formular.email, formular.passwort);
      navigate('/dashboard');
    } catch (err) {
      setFehler(err.response?.data?.nachricht || 'Login fehlgeschlagen. Bitte erneut versuchen.');
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Willkommen zurück</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Melde dich bei deinem Konto an</p>
        </div>

        {/* Formular-Karte */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Fehlermeldung */}
            {fehler && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-red-700 dark:text-red-300 text-sm">
                {fehler}
              </div>
            )}

            {/* E-Mail */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                E-Mail-Adresse
              </label>
              <input
                type="email"
                name="email"
                value={formular.email}
                onChange={handleChange}
                placeholder="max@beispiel.de"
                required
                className="eingabe"
              />
            </div>

            {/* Passwort */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Passwort
              </label>
              <input
                type="password"
                name="passwort"
                value={formular.passwort}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="eingabe"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={laden}
              className="btn-primary w-full justify-center py-3"
            >
              {laden ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Anmelden...
                </>
              ) : (
                'Anmelden'
              )}
            </button>
          </form>

          {/* Registrierungs-Link */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Noch kein Konto?{' '}
            <Link to="/registrierung" className="text-indigo-600 font-medium hover:underline">
              Jetzt registrieren
            </Link>
          </p>
        </div>

        {/* Demo-Hinweis */}
        <p className="text-center text-xs text-slate-400 mt-4">
          Demo: Erstelle zuerst ein Konto über "Registrieren"
        </p>
      </div>
    </div>
  );
};

export default Login;
