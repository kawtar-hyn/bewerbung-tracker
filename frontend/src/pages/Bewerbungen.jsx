// ============================================================
// pages/Bewerbungen.jsx — Liste aller Bewerbungen mit Filter/Suche
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import StatusBadge from '../components/ui/StatusBadge';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Status-Filter Optionen
const STATUSOPTIONEN = ['Alle', 'Beworben', 'Interview', 'Angenommen', 'Abgelehnt'];

// ── Leere Zustands-Anzeige ───────────────────────────────────
const LeereAnzeige = ({ filterAktiv }) => (
  <div className="text-center py-16">
    <p className="text-5xl mb-4">{filterAktiv ? '🔍' : '📋'}</p>
    <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
      {filterAktiv ? 'Keine Ergebnisse gefunden' : 'Noch keine Bewerbungen'}
    </p>
    <p className="text-slate-400 text-sm mt-1">
      {filterAktiv
        ? 'Versuche andere Suchbegriffe oder Filter'
        : 'Starte deine Jobsuche und trage deine erste Bewerbung ein!'
      }
    </p>
    {!filterAktiv && (
      <Link to="/bewerbungen/neu" className="btn-primary inline-flex mt-5">
        + Erste Bewerbung hinzufügen
      </Link>
    )}
  </div>
);

const Bewerbungen = () => {
  const [bewerbungen, setBewerbungen] = useState([]);
  const [laden, setLaden] = useState(true);
  const [suche, setSuche] = useState('');
  const [statusFilter, setStatusFilter] = useState('Alle');
  const [sortieren, setSortieren] = useState('datum_neu');
  const [loeschenId, setLoeschenId] = useState(null); // Welche ID wird gerade gelöscht?

  // Debounced Suche — wartet 300ms nach dem Tippen
  const [suchDebounce, setSuchDebounce] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setSuchDebounce(suche), 300);
    return () => clearTimeout(timer);
  }, [suche]);

  // Bewerbungen laden
  const laden_ = useCallback(async () => {
    setLaden(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'Alle') params.append('status', statusFilter);
      if (suchDebounce) params.append('suche', suchDebounce);
      params.append('sortieren', sortieren);

      const res = await api.get(`/bewerbungen?${params.toString()}`);
      setBewerbungen(res.data);
    } catch (err) {
      console.error('Ladefehler:', err);
    } finally {
      setLaden(false);
    }
  }, [statusFilter, suchDebounce, sortieren]);

  useEffect(() => { laden_(); }, [laden_]);

  // Bewerbung löschen
  const handleLoeschen = async (id) => {
    if (!window.confirm('Bewerbung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
    try {
      await api.delete(`/bewerbungen/${id}`);
      setBewerbungen(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      alert('Fehler beim Löschen der Bewerbung.');
    }
  };

  const filterAktiv = suche !== '' || statusFilter !== 'Alle';

  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Bewerbungen</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {bewerbungen.length} Einträge gefunden
          </p>
        </div>
        <Link to="/bewerbungen/neu" className="btn-primary">
          + Neue Bewerbung
        </Link>
      </div>

      {/* Filter-Leiste */}
      <div className="karte p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Suchfeld */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Firma, Position oder Ort suchen..."
              value={suche}
              onChange={e => setSuche(e.target.value)}
              className="eingabe pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="eingabe w-full sm:w-48"
          >
            {STATUSOPTIONEN.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Sortierung */}
          <select
            value={sortieren}
            onChange={e => setSortieren(e.target.value)}
            className="eingabe w-full sm:w-48"
          >
            <option value="datum_neu">Neueste zuerst</option>
            <option value="datum_alt">Älteste zuerst</option>
            <option value="firma">Firma A–Z</option>
          </select>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {STATUSOPTIONEN.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bewerbungen Liste */}
      <div className="karte p-0 overflow-hidden">
        {laden ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bewerbungen.length === 0 ? (
          <LeereAnzeige filterAktiv={filterAktiv} />
        ) : (
          <>
            {/* Tabellen-Header (Desktop) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-700/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
              <div className="col-span-3">Unternehmen</div>
              <div className="col-span-3">Position</div>
              <div className="col-span-2">Ort</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Datum</div>
              <div className="col-span-1">Aktionen</div>
            </div>

            {/* Bewerbungs-Zeilen */}
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {bewerbungen.map((b) => (
                <div key={b._id}
                  className="px-4 md:px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors animiert">
                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{b.firmenname}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{b.position}</p>
                        <p className="text-xs text-slate-400">{b.ort}</p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {format(new Date(b.bewerbungsdatum), 'dd. MMM yyyy', { locale: de })}
                      </span>
                      <div className="flex gap-2">
                        <Link to={`/bewerbungen/${b._id}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Bearbeiten</Link>
                        <button onClick={() => handleLoeschen(b._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium">Löschen</button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                          {b.firmenname[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-100 text-sm truncate">
                        {b.firmenname}
                      </span>
                    </div>
                    <div className="col-span-3 text-sm text-slate-600 dark:text-slate-300 truncate">
                      {b.position}
                    </div>
                    <div className="col-span-2 text-sm text-slate-500 dark:text-slate-400 truncate">
                      📍 {b.ort}
                    </div>
                    <div className="col-span-2">
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="col-span-1 text-xs text-slate-400">
                      {format(new Date(b.bewerbungsdatum), 'dd.MM.yy')}
                    </div>
                    <div className="col-span-1 flex items-center gap-2">
                      <Link to={`/bewerbungen/${b._id}`}
                        className="text-indigo-500 hover:text-indigo-700 p-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                        title="Bearbeiten">✏️</Link>
                      <button
                        onClick={() => handleLoeschen(b._id)}
                        className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        title="Löschen">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Bewerbungen;
