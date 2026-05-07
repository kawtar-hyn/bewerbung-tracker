// ============================================================
// components/ui/StatusBadge.jsx — Farbiger Status-Badge
// Zeigt den Bewerbungsstatus als farbiges Label an.
// ============================================================

import React from 'react';

// Farb-Konfiguration für jeden Status
const statusKonfig = {
  Beworben: {
    klassen: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-800',
    punkt: 'bg-blue-500',
    label: 'Beworben',
  },
  Interview: {
    klassen: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-800',
    punkt: 'bg-amber-500',
    label: 'Interview',
  },
  Angenommen: {
    klassen: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800',
    punkt: 'bg-emerald-500',
    label: 'Angenommen',
  },
  Abgelehnt: {
    klassen: 'bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-900/20 dark:text-red-300 dark:ring-red-800',
    punkt: 'bg-red-500',
    label: 'Abgelehnt',
  },
};

const StatusBadge = ({ status }) => {
  const konfig = statusKonfig[status] || statusKonfig['Beworben'];

  return (
    <span className={`badge ${konfig.klassen}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${konfig.punkt}`} />
      {konfig.label}
    </span>
  );
};

export default StatusBadge;
