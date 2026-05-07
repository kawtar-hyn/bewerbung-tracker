// ============================================================
// components/layout/Layout.jsx — Haupt-Layout mit Sidebar
// Enthält die Navigationsleiste und den Hauptbereich.
// Outlet = Platzhalter für die aktuelle Seite (React Router)
// ============================================================

import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ── Icons (SVG) ─────────────────────────────────────────────
const Icons = {
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 11h18M11 3v18" />
    </svg>
  ),
  Bewerbungen: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Moon: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  Sun: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  ),
  Abmelden: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
};

// ── Navigations-Links ───────────────────────────────────────
const navLinks = [
  { zu: '/dashboard',      bezeichnung: 'Übersicht',        Icon: Icons.Dashboard },
  { zu: '/bewerbungen',    bezeichnung: 'Bewerbungen',       Icon: Icons.Bewerbungen },
  { zu: '/bewerbungen/neu',bezeichnung: 'Neu hinzufügen',   Icon: Icons.Plus },
];

const Layout = ({ darkMode, setDarkMode }) => {
  const { benutzer, abmelden } = useAuth();
  const navigate = useNavigate();
  const [sidebarOffen, setSidebarOffen] = useState(false);

  const handleAbmelden = () => {
    abmelden();
    navigate('/login');
  };

  // Benutzer-Initialen für Avatar
  const initialen = benutzer?.name
    ? benutzer.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'BT';

  const SidebarInhalt = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">BT</span>
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-white text-sm leading-none">Bewerbung</p>
            <p className="text-indigo-600 text-xs font-semibold">Tracker</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
          Navigation
        </p>
        <ul className="space-y-1">
          {navLinks.map(({ zu, bezeichnung, Icon }) => (
            <li key={zu}>
              <NavLink
                to={zu}
                end={zu === '/dashboard'}
                onClick={() => setSidebarOffen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-200'
                  }`
                }
              >
                <Icon />
                {bezeichnung}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Unterer Bereich: Dark Mode + Abmelden */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                     text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50 transition-all"
        >
          {darkMode ? <Icons.Sun /> : <Icons.Moon />}
          {darkMode ? 'Heller Modus' : 'Dunkler Modus'}
        </button>

        {/* Benutzer-Info & Abmelden */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{initialen}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
              {benutzer?.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {benutzer?.email}
            </p>
          </div>
          <button
            onClick={handleAbmelden}
            title="Abmelden"
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <Icons.Abmelden />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 fixed inset-y-0">
        <SidebarInhalt />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOffen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOffen(false)} />
          <aside className="relative flex flex-col w-64 bg-white dark:bg-slate-800 z-50">
            <SidebarInhalt />
          </aside>
        </div>
      )}

      {/* Hauptbereich */}
      <main className="flex-1 md:ml-64">
        {/* Mobile Topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">BT</span>
            </div>
            <span className="font-bold text-sm dark:text-white">Bewerbung Tracker</span>
          </div>
          <button onClick={() => setSidebarOffen(true)} className="text-slate-600 dark:text-slate-400">
            <Icons.Menu />
          </button>
        </div>

        {/* Seiteninhalt */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
