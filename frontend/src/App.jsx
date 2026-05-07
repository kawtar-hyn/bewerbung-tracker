// ============================================================
// App.jsx — Haupt-App-Komponente mit React Router
// Definiert alle Routen (Seiten) der App
// ============================================================

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Seiten importieren
import Login from './pages/Login';
import Registrierung from './pages/Registrierung';
import Dashboard from './pages/Dashboard';
import Bewerbungen from './pages/Bewerbungen';
import BewerbungDetail from './pages/BewerbungDetail';
import NeuerBewerbung from './pages/NeueBewerbung';
import Layout from './components/layout/Layout';

// Geschützte Route — nur für eingeloggte Benutzer
const GeschuetzteRoute = ({ children }) => {
  const { istEingeloggt, laden } = useAuth();

  if (laden) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Lade...</p>
        </div>
      </div>
    );
  }

  // Nicht eingeloggt → zur Login-Seite weiterleiten
  return istEingeloggt ? children : <Navigate to="/login" replace />;
};

// Öffentliche Route — nur für NICHT eingeloggte Benutzer
const OeffentlicheRoute = ({ children }) => {
  const { istEingeloggt, laden } = useAuth();
  if (laden) return null;
  // Bereits eingeloggt → direkt zum Dashboard
  return !istEingeloggt ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Öffentliche Routen */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<OeffentlicheRoute><Login /></OeffentlicheRoute>} />
          <Route path="/registrierung" element={<OeffentlicheRoute><Registrierung /></OeffentlicheRoute>} />

          {/* Geschützte Routen (mit Sidebar-Layout) */}
          <Route path="/" element={
            <GeschuetzteRoute>
              <Layout darkMode={darkMode} setDarkMode={setDarkMode} />
            </GeschuetzteRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bewerbungen" element={<Bewerbungen />} />
            <Route path="bewerbungen/neu" element={<NeuerBewerbung />} />
            <Route path="bewerbungen/:id" element={<BewerbungDetail />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
