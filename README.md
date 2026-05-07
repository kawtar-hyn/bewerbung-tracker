# 🎯 Smart Bewerbung Tracker

> Eine professionelle Full-Stack-Webanwendung zur Verwaltung von Jobbewerbungen und Ausbildungsplätzen in Deutschland.

![Status](https://img.shields.io/badge/Status-In%20Entwicklung-yellow)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20MongoDB-blue)
![Sprache](https://img.shields.io/badge/Sprache-Deutsch-green)

---

## 📸 Screenshots

> *(Screenshots werden nach dem ersten Start der Anwendung hier hinzugefügt)*

| Dashboard | Bewerbungen | Detail |
|-----------|-------------|--------|
| ![Dashboard](screenshots/dashboard.png) | ![Liste](screenshots/bewerbungen.png) | ![Detail](screenshots/detail.png) |

---

## ✨ Features

### 🔐 Authentifizierung
- Sichere Registrierung und Anmeldung mit JWT (JSON Web Tokens)
- Passwörter werden mit bcrypt gehasht — niemals im Klartext gespeichert
- Automatische Token-Verwaltung im Browser

### 📊 Dashboard
- Statistik-Karten: Gesamt, In Bearbeitung, Angenommen, Abgelehnt
- **Balken-Diagramm**: Bewerbungen pro Monat (Chart.js)
- **Donut-Diagramm**: Status-Verteilung auf einen Blick
- Übersicht der neuesten 5 Bewerbungen

### 📋 Bewerbungsverwaltung (CRUD)
Jede Bewerbung enthält:
- **Firmenname** — Unternehmen, bei dem du dich beworben hast
- **Ort / Stadt** — Standort der Stelle
- **Position** — z.B. "Ausbildung Fachinformatiker Anwendungsentwicklung"
- **Status** — Beworben / Interview / Angenommen / Abgelehnt
- **Bewerbungsdatum** — Wann wurde die Bewerbung abgeschickt?
- **Notizen** — Ansprechpartner, Besonderheiten, etc.

### 🔍 Suche & Filter
- Echtzeit-Suche nach Firmenname, Position und Ort
- Status-Filter mit einem Klick
- Sortierung nach Datum oder Firma

### 🔔 Erinnerungssystem
- Setze Erinnerungstermine für das Nachfassen
- Automatische Empfehlung nach 14 Tagen ohne Rückmeldung
- Dashboard zeigt anstehende Erinnerungen

### 📎 Dokument-Upload
- Lebenslauf (PDF) direkt in der App hochladen
- Anschreiben (PDF) hochladen und verwalten
- Dokumente direkt in der App öffnen

### 🌙 Dark Mode
- Eleganter dunkler Modus für abends
- Einstellung wird im Browser gespeichert
- Automatischer Wechsel möglich

### 📱 Responsives Design
- Funktioniert auf Desktop, Tablet und Smartphone
- Mobile-optimierte Sidebar-Navigation

---

## 🛠️ Technologie-Stack

### Backend
| Technologie | Verwendung |
|-------------|------------|
| **Node.js** | Server-Runtime |
| **Express.js** | Web-Framework |
| **MongoDB** | Datenbank |
| **Mongoose** | Datenbankmodelle (ODM) |
| **JWT** | Authentifizierung |
| **bcryptjs** | Passwort-Hashing |
| **Multer** | Datei-Uploads |

### Frontend
| Technologie | Verwendung |
|-------------|------------|
| **React 18** | UI-Framework |
| **React Router v6** | Navigation |
| **Tailwind CSS** | Styling |
| **Chart.js** | Diagramme |
| **Axios** | HTTP-Anfragen |
| **date-fns** | Datumformatierung |

---

## 📁 Projektstruktur

```
bewerbung-tracker/
├── backend/
│   ├── config/           # Konfiguration
│   ├── controllers/      # Geschäftslogik
│   │   ├── authController.js
│   │   └── bewerbungController.js
│   ├── middleware/       # Middleware-Funktionen
│   │   └── authMiddleware.js
│   ├── models/           # Datenbankmodelle
│   │   ├── User.js
│   │   └── Bewerbung.js
│   ├── routes/           # API-Routen
│   │   ├── authRoutes.js
│   │   └── bewerbungRoutes.js
│   ├── uploads/          # Hochgeladene Dateien
│   ├── .env.example      # Umgebungsvariablen (Vorlage)
│   ├── package.json
│   └── server.js         # Server-Einstiegspunkt
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── layout/
        │   │   └── Layout.jsx    # Sidebar & Navigation
        │   └── ui/
        │       └── StatusBadge.jsx
        ├── context/
        │   └── AuthContext.jsx   # Globaler Auth-Zustand
        ├── pages/
        │   ├── Login.jsx
        │   ├── Registrierung.jsx
        │   ├── Dashboard.jsx
        │   ├── Bewerbungen.jsx
        │   ├── NeueBewerbung.jsx
        │   └── BewerbungDetail.jsx
        ├── utils/
        │   └── api.js            # Axios-Instanz
        ├── App.jsx               # Routing
        └── index.js              # Einstiegspunkt
```

---

## 🚀 Installation & Start

### Voraussetzungen
- [Node.js](https://nodejs.org/) (Version 18 oder höher)
- [MongoDB](https://www.mongodb.com/) (lokal oder [MongoDB Atlas](https://www.mongodb.com/atlas) kostenlos)
- [Git](https://git-scm.com/)

### Schritt 1: Repository klonen

```bash
git clone https://github.com/dein-name/bewerbung-tracker.git
cd bewerbung-tracker
```

### Schritt 2: Backend einrichten

```bash
# In den Backend-Ordner wechseln
cd backend

# Abhängigkeiten installieren
npm install

# Umgebungsvariablen einrichten
cp .env.example .env
```

Öffne die `.env` Datei und passe die Werte an:
```env
MONGODB_URI=mongodb://localhost:27017/bewerbung_tracker
JWT_SECRET=dein_geheimer_schluessel_hier
PORT=5000
CLIENT_URL=http://localhost:3000
```

```bash
# Backend starten (Development-Modus mit Auto-Reload)
npm run dev

# Backend starten (Produktionsmodus)
npm start
```

✅ Backend läuft auf: `http://localhost:5000`

### Schritt 3: Frontend einrichten

```bash
# In den Frontend-Ordner wechseln (neues Terminal-Fenster)
cd frontend

# Abhängigkeiten installieren
npm install

# Frontend starten
npm start
```

✅ Frontend läuft auf: `http://localhost:3000`

### Schritt 4: App öffnen

Öffne deinen Browser und gehe zu:
```
http://localhost:3000
```

Registriere dich mit einem neuen Konto und starte deine Bewerbungsverwaltung! 🎉

---

## 📡 API-Dokumentation

### Authentifizierung

| Methode | Route | Beschreibung |
|---------|-------|--------------|
| `POST` | `/api/auth/register` | Neues Konto erstellen |
| `POST` | `/api/auth/login` | Anmelden |
| `GET` | `/api/auth/mich` | Eigenes Profil abrufen |

### Bewerbungen (alle Routen erfordern Login)

| Methode | Route | Beschreibung |
|---------|-------|--------------|
| `GET` | `/api/bewerbungen` | Alle Bewerbungen abrufen |
| `GET` | `/api/bewerbungen/statistiken` | Dashboard-Statistiken |
| `GET` | `/api/bewerbungen/:id` | Eine Bewerbung abrufen |
| `POST` | `/api/bewerbungen` | Neue Bewerbung erstellen |
| `PUT` | `/api/bewerbungen/:id` | Bewerbung aktualisieren |
| `DELETE` | `/api/bewerbungen/:id` | Bewerbung löschen |
| `POST` | `/api/bewerbungen/:id/dokument` | Dokument hochladen |

---

## 💡 Tipps für deine Bewerbung

1. **Status aktuell halten** — Trage jede Rückmeldung sofort ein
2. **Notizen nutzen** — Schreibe Ansprechpartner und Besonderheiten auf
3. **Nachfassen** — Nach 14 Tagen ohne Rückmeldung höflich nachfragen
4. **Dokumente hochladen** — Behalte deine Bewerbungsunterlagen direkt in der App

---

## 🔮 Geplante Features

- [ ] E-Mail-Benachrichtigungen für Erinnerungen
- [ ] Export als PDF/Excel
- [ ] Mehrsprachigkeit (Englisch)
- [ ] Bewerbungsvorlagen-Generator
- [ ] Statistik-Export

---

## 👨‍💻 Entwickelt von

**[Dein Name]** — Bewerber für Fachinformatiker Anwendungsentwicklung / Systemintegration

---

## 📄 Lizenz

MIT License — Frei zur Verwendung und Weiterentwicklung
