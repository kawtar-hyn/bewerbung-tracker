// ============================================================
// pages/BewerbungDetail.jsx — Detail & Bearbeiten einer Bewerbung
// Enthält: Daten ansehen/bearbeiten + Dokumente hochladen
// ============================================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import StatusBadge from '../components/ui/StatusBadge';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const BewerbungDetail = () => {
  const { id } = useParams(); // ID aus der URL
  const navigate = useNavigate();

  const [bewerbung, setBewerbung] = useState(null);
  const [laden, setLaden] = useState(true);
  const [bearbeitenModus, setBearbeitenModus] = useState(false);
  const [speichernLaden, setSpeichernLaden] = useState(false);
  const [uploadLaden, setUploadLaden] = useState({ lebenslauf: false, anschreiben: false });
  const [formular, setFormular] = useState({});
  const [meldung, setMeldung] = useState({ typ: '', text: '' });

  // Bewerbung laden
  useEffect(() => {
    const laden_ = async () => {
      try {
        const res = await api.get(`/bewerbungen/${id}`);
        setBewerbung(res.data);
        setFormular({
          firmenname: res.data.firmenname,
          ort: res.data.ort,
          position: res.data.position,
          status: res.data.status,
          bewerbungsdatum: format(new Date(res.data.bewerbungsdatum), 'yyyy-MM-dd'),
          notizen: res.data.notizen || '',
          erinnerungDatum: res.data.erinnerungDatum
            ? format(new Date(res.data.erinnerungDatum), 'yyyy-MM-dd')
            : '',
        });
      } catch {
        navigate('/bewerbungen');
      } finally {
        setLaden(false);
      }
    };
    laden_();
  }, [id, navigate]);

  // Änderungen speichern
  const handleSpeichern = async () => {
    setSpeichernLaden(true);
    try {
      const res = await api.put(`/bewerbungen/${id}`, formular);
      setBewerbung(res.data);
      setBearbeitenModus(false);
      zeigeErfolg('Änderungen erfolgreich gespeichert!');
    } catch {
      zeigeFehler('Fehler beim Speichern.');
    } finally {
      setSpeichernLaden(false);
    }
  };

  // Dokument hochladen
  const handleUpload = async (e, typ) => {
    const datei = e.target.files[0];
    if (!datei) return;

    setUploadLaden(prev => ({ ...prev, [typ]: true }));
    const formData = new FormData();
    formData.append('datei', datei);
    formData.append('typ', typ);

    try {
      const res = await api.post(`/bewerbungen/${id}/dokument`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBewerbung(res.data.bewerbung);
      zeigeErfolg('Dokument erfolgreich hochgeladen!');
    } catch {
      zeigeFehler('Fehler beim Hochladen. Nur PDF-Dateien bis 5 MB erlaubt.');
    } finally {
      setUploadLaden(prev => ({ ...prev, [typ]: false }));
    }
  };

  const zeigeErfolg = (text) => {
    setMeldung({ typ: 'erfolg', text });
    setTimeout(() => setMeldung({ typ: '', text: '' }), 3000);
  };
  const zeigeFehler = (text) => {
    setMeldung({ typ: 'fehler', text });
    setTimeout(() => setMeldung({ typ: '', text: '' }), 3000);
  };

  if (laden) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!bewerbung) return null;

  const tageSeitBewerbung = Math.floor(
    (new Date() - new Date(bewerbung.bewerbungsdatum)) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Zurück-Link */}
      <Link to="/bewerbungen" className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1">
        ← Zurück zur Liste
      </Link>

      {/* Meldungen */}
      {meldung.text && (
        <div className={`rounded-xl p-4 text-sm animiert ${
          meldung.typ === 'erfolg'
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
        }`}>
          {meldung.typ === 'erfolg' ? '✅' : '❌'} {meldung.text}
        </div>
      )}

      {/* Kopfzeile der Detailansicht */}
      <div className="karte">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {bewerbung.firmenname[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">{bewerbung.firmenname}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{bewerbung.position}</p>
              <p className="text-slate-400 text-xs mt-1">📍 {bewerbung.ort}</p>
            </div>
          </div>
          <StatusBadge status={bewerbung.status} />
        </div>

        {/* Meta-Info */}
        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Beworben am</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-1">
              {format(new Date(bewerbung.bewerbungsdatum), 'dd. MMMM yyyy', { locale: de })}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Tage vergangen</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-1">
              {tageSeitBewerbung} Tage
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Erinnerung</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-1">
              {bewerbung.erinnerungDatum
                ? format(new Date(bewerbung.erinnerungDatum), 'dd.MM.yyyy')
                : '—'
              }
            </p>
          </div>
        </div>

        {/* Aktionen */}
        <div className="flex gap-3 mt-5">
          {bearbeitenModus ? (
            <>
              <button onClick={handleSpeichern} disabled={speichernLaden} className="btn-primary">
                {speichernLaden ? 'Speichern...' : '💾 Speichern'}
              </button>
              <button onClick={() => setBearbeitenModus(false)} className="btn-sekundaer">
                Abbrechen
              </button>
            </>
          ) : (
            <button onClick={() => setBearbeitenModus(true)} className="btn-sekundaer">
              ✏️ Bearbeiten
            </button>
          )}
        </div>
      </div>

      {/* Bearbeitungsformular oder Detailansicht */}
      {bearbeitenModus ? (
        <div className="karte space-y-5 animiert">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Daten bearbeiten</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Firmenname</label>
              <input type="text" value={formular.firmenname}
                onChange={e => setFormular({...formular, firmenname: e.target.value})} className="eingabe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Ort</label>
              <input type="text" value={formular.ort}
                onChange={e => setFormular({...formular, ort: e.target.value})} className="eingabe" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Position</label>
            <input type="text" value={formular.position}
              onChange={e => setFormular({...formular, position: e.target.value})} className="eingabe" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
              <select value={formular.status}
                onChange={e => setFormular({...formular, status: e.target.value})} className="eingabe">
                <option value="Beworben">📤 Beworben</option>
                <option value="Interview">🎙️ Interview</option>
                <option value="Angenommen">✅ Angenommen</option>
                <option value="Abgelehnt">❌ Abgelehnt</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Bewerbungsdatum</label>
              <input type="date" value={formular.bewerbungsdatum}
                onChange={e => setFormular({...formular, bewerbungsdatum: e.target.value})} className="eingabe" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">🔔 Erinnerung</label>
            <input type="date" value={formular.erinnerungDatum}
              onChange={e => setFormular({...formular, erinnerungDatum: e.target.value})} className="eingabe" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notizen</label>
            <textarea value={formular.notizen} rows={4}
              onChange={e => setFormular({...formular, notizen: e.target.value})}
              className="eingabe resize-none" maxLength={1000} />
          </div>
        </div>
      ) : (
        /* Notizen-Ansicht */
        bewerbung.notizen && (
          <div className="karte">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">Notizen</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
              {bewerbung.notizen}
            </p>
          </div>
        )
      )}

      {/* Dokumente Hochladen */}
      <div className="karte">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">📎 Dokumente hochladen</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Lebenslauf */}
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-5 text-center hover:border-indigo-300 transition-colors">
            <div className="text-3xl mb-2">📄</div>
            <p className="font-medium text-slate-700 dark:text-slate-300 text-sm">Lebenslauf (CV)</p>
            {bewerbung.dokumente?.lebenslauf ? (
              <a href={`http://localhost:5000/${bewerbung.dokumente.lebenslauf}`} target="_blank" rel="noreferrer"
                className="text-indigo-600 text-xs hover:underline mt-1 block">
                ✅ Hochgeladen — Anzeigen
              </a>
            ) : (
              <p className="text-slate-400 text-xs mt-1">Noch nicht hochgeladen</p>
            )}
            <label className="mt-3 cursor-pointer">
              <span className="btn-sekundaer text-xs inline-flex justify-center">
                {uploadLaden.lebenslauf ? 'Lädt...' : '📤 PDF wählen'}
              </span>
              <input type="file" accept=".pdf" className="hidden"
                onChange={e => handleUpload(e, 'lebenslauf')} disabled={uploadLaden.lebenslauf} />
            </label>
          </div>

          {/* Anschreiben */}
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-5 text-center hover:border-indigo-300 transition-colors">
            <div className="text-3xl mb-2">✉️</div>
            <p className="font-medium text-slate-700 dark:text-slate-300 text-sm">Anschreiben</p>
            {bewerbung.dokumente?.anschreiben ? (
              <a href={`http://localhost:5000/${bewerbung.dokumente.anschreiben}`} target="_blank" rel="noreferrer"
                className="text-indigo-600 text-xs hover:underline mt-1 block">
                ✅ Hochgeladen — Anzeigen
              </a>
            ) : (
              <p className="text-slate-400 text-xs mt-1">Noch nicht hochgeladen</p>
            )}
            <label className="mt-3 cursor-pointer">
              <span className="btn-sekundaer text-xs inline-flex justify-center">
                {uploadLaden.anschreiben ? 'Lädt...' : '📤 PDF wählen'}
              </span>
              <input type="file" accept=".pdf" className="hidden"
                onChange={e => handleUpload(e, 'anschreiben')} disabled={uploadLaden.anschreiben} />
            </label>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3 text-center">Nur PDF-Dateien, maximal 5 MB</p>
      </div>

      {/* Erinnerungs-Empfehlung */}
      {tageSeitBewerbung >= 14 && bewerbung.status === 'Beworben' && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 animiert">
          <p className="font-semibold text-amber-800 dark:text-amber-200 text-sm">⏰ Nachfassen empfohlen!</p>
          <p className="text-amber-700 dark:text-amber-300 text-xs mt-1">
            Du hast dich vor {tageSeitBewerbung} Tagen beworben und noch keine Rückmeldung erhalten.
            Es ist Zeit, höflich nachzufragen!
          </p>
        </div>
      )}
    </div>
  );
};

export default BewerbungDetail;
