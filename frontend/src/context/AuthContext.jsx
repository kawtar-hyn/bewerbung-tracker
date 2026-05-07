// ============================================================
// context/AuthContext.jsx — Globaler Authentifizierungs-Zustand
// Context API: Macht den Login-Status in der ganzen App verfügbar.
// Kein "Prop Drilling" durch 10 Ebenen mehr!
// ============================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// Context erstellen (wie eine "globale Variable" für React)
const AuthContext = createContext(null);

// ── Provider Komponente ─────────────────────────────────────
// Diese Komponente "umhüllt" die gesamte App und stellt den Auth-Status bereit
export const AuthProvider = ({ children }) => {
  const [benutzer, setBenutzer] = useState(null);
  const [laden, setLaden] = useState(true); // Beim Start: prüfen ob User eingeloggt ist

  // Beim App-Start: gespeicherter Token prüfen
  useEffect(() => {
    const token = localStorage.getItem('token');
    const gespeicherterBenutzer = localStorage.getItem('benutzer');

    if (token && gespeicherterBenutzer) {
      try {
        setBenutzer(JSON.parse(gespeicherterBenutzer));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('benutzer');
      }
    }
    setLaden(false);
  }, []);

  // ── Registrieren ──────────────────────────────────────────
  const registrieren = async (name, email, passwort) => {
    const antwort = await api.post('/auth/register', { name, email, passwort });
    const { token, benutzer: neuerBenutzer } = antwort.data;

    localStorage.setItem('token', token);
    localStorage.setItem('benutzer', JSON.stringify(neuerBenutzer));
    setBenutzer(neuerBenutzer);

    return antwort.data;
  };

  // ── Anmelden ──────────────────────────────────────────────
  const anmelden = async (email, passwort) => {
    const antwort = await api.post('/auth/login', { email, passwort });
    const { token, benutzer: eingeloggterBenutzer } = antwort.data;

    localStorage.setItem('token', token);
    localStorage.setItem('benutzer', JSON.stringify(eingeloggterBenutzer));
    setBenutzer(eingeloggterBenutzer);

    return antwort.data;
  };

  // ── Abmelden ──────────────────────────────────────────────
  const abmelden = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('benutzer');
    setBenutzer(null);
  };

  // Werte die überall in der App verfügbar sein sollen
  const wert = {
    benutzer,
    laden,
    registrieren,
    anmelden,
    abmelden,
    istEingeloggt: !!benutzer,
  };

  return <AuthContext.Provider value={wert}>{children}</AuthContext.Provider>;
};

// ── Custom Hook ─────────────────────────────────────────────
// Einfachere Verwendung: const { benutzer, anmelden } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth muss innerhalb eines AuthProviders verwendet werden');
  }
  return context;
};
