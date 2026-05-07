// ============================================================
// pages/Dashboard.jsx — Haupt-Dashboard mit Statistiken
// Zeigt Übersichtskarten und Chart.js Diagramme
// ============================================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Chart.js Komponenten registrieren (MUSS gemacht werden!)
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// ── Statistik-Karte ──────────────────────────────────────────
const StatKarte = ({ titel, wert, icon, farbe, beschreibung }) => (
  <div className="karte flex items-start gap-4 animiert">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${farbe}`}>
      <span className="text-2xl">{icon}</span>
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{titel}</p>
      <p className="text-3xl font-bold text-slate-800 dark:text-white mt-0.5">{wert}</p>
      {beschreibung && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{beschreibung}</p>
      )}
    </div>
  </div>
);

// ── Erinnerungs-Banner ───────────────────────────────────────
const ErinnerungsBanner = ({ erinnerungen }) => {
  if (!erinnerungen || erinnerungen.length === 0) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
      <span className="text-xl">🔔</span>
      <div>
        <p className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
          {erinnerungen.length} Erinnerung{erinnerungen.length > 1 ? 'en' : ''} diese Woche
        </p>
        <p className="text-amber-700 dark:text-amber-300 text-xs mt-0.5">
          Vergiss nicht, bei deinen Bewerbungen nachzuhaken!
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { benutzer } = useAuth();
  const [stats, setStats] = useState(null);
  const [neueste, setNeueste] = useState([]);
  const [laden, setLaden] = useState(true);

  // Daten beim Laden holen
  useEffect(() => {
    const datenholen = async () => {
      try {
        const [statsRes, bewRes] = await Promise.all([
          api.get('/bewerbungen/statistiken'),
          api.get('/bewerbungen?sortieren=datum_neu'),
        ]);
        setStats(statsRes.data);
        setNeueste(bewRes.data.slice(0, 5)); // Nur die 5 neuesten
      } catch (err) {
        console.error('Dashboard-Fehler:', err);
      } finally {
        setLaden(false);
      }
    };
    datenholen();
  }, []);

  // Tageszeit-Begrüßung
  const stunde = new Date().getHours();
  const begruessung = stunde < 12 ? 'Guten Morgen' : stunde < 18 ? 'Guten Tag' : 'Guten Abend';

  if (laden) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Chart.js Daten ──────────────────────────────────────────
  // Donut Chart: Status-Verteilung
  const donutDaten = {
    labels: ['Beworben', 'Interview', 'Angenommen', 'Abgelehnt'],
    datasets: [{
      data: [stats?.Beworben || 0, stats?.Interview || 0, stats?.Angenommen || 0, stats?.Abgelehnt || 0],
      backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  // Balken Chart: Monatliche Bewerbungen
  const monate = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  const monatlicheDaten = new Array(12).fill(0);
  stats?.monatlich?.forEach(m => {
    monatlicheDaten[m._id.monat - 1] = m.anzahl;
  });

  const balkenDaten = {
    labels: monate,
    datasets: [{
      label: 'Bewerbungen',
      data: monatlicheDaten,
      backgroundColor: '#6366f1',
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const chartOptionen = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="space-y-6">
      {/* Überschrift */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {begruessung}, {benutzer?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Hier ist deine aktuelle Bewerbungsübersicht
          </p>
        </div>
        <Link to="/bewerbungen/neu" className="btn-primary hidden sm:flex">
          <span>+</span> Neue Bewerbung
        </Link>
      </div>

      {/* Erinnerungs-Banner */}
      {stats?.erinnerungen > 0 && <ErinnerungsBanner erinnerungen={[...Array(stats.erinnerungen)]} />}

      {/* Statistik-Karten */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatKarte titel="Gesamt" wert={stats?.gesamt || 0} icon="📋" farbe="bg-indigo-50 dark:bg-indigo-900/20" beschreibung="Alle Bewerbungen" />
        <StatKarte titel="In Bearbeitung" wert={(stats?.Beworben || 0) + (stats?.Interview || 0)} icon="⏳" farbe="bg-amber-50 dark:bg-amber-900/20" beschreibung="Beworben + Interview" />
        <StatKarte titel="Angenommen" wert={stats?.Angenommen || 0} icon="✅" farbe="bg-emerald-50 dark:bg-emerald-900/20" beschreibung="Glückwunsch!" />
        <StatKarte titel="Abgelehnt" wert={stats?.Abgelehnt || 0} icon="❌" farbe="bg-red-50 dark:bg-red-900/20" beschreibung="Weiter so!" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Balken Chart */}
        <div className="karte lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Bewerbungen pro Monat
          </h2>
          <Bar data={balkenDaten} options={chartOptionen} />
        </div>

        {/* Donut Chart */}
        <div className="karte">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Status-Verteilung
          </h2>
          {stats?.gesamt > 0 ? (
            <>
              <Doughnut data={donutDaten} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <span className="text-4xl mb-2">📊</span>
              <p className="text-sm">Noch keine Daten</p>
            </div>
          )}
        </div>
      </div>

      {/* Neueste Bewerbungen */}
      <div className="karte">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Neueste Bewerbungen</h2>
          <Link to="/bewerbungen" className="text-sm text-indigo-600 hover:underline font-medium">
            Alle anzeigen →
          </Link>
        </div>

        {neueste.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-slate-600 dark:text-slate-300 font-medium">Noch keine Bewerbungen</p>
            <p className="text-slate-400 text-sm mt-1">Füge deine erste Bewerbung hinzu!</p>
            <Link to="/bewerbungen/neu" className="btn-primary inline-flex mt-4">
              + Bewerbung hinzufügen
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {neueste.map((b) => (
              <Link key={b._id} to={`/bewerbungen/${b._id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                      {b.firmenname[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{b.firmenname}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{b.position} · {b.ort}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge text-xs ${
                    b.status === 'Angenommen' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' :
                    b.status === 'Abgelehnt'  ? 'bg-red-50 text-red-700 ring-1 ring-red-200' :
                    b.status === 'Interview'  ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' :
                    'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                  }`}>
                    {b.status}
                  </span>
                  <p className="text-slate-400 text-xs mt-1">
                    {format(new Date(b.bewerbungsdatum), 'dd. MMM', { locale: de })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
