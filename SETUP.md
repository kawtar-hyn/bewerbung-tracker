# SETUP.md — Schnellstart in 5 Minuten

## Schritt-für-Schritt Anleitung

### 1. Backend starten
```bash
cd bewerbung-tracker/backend
npm install
cp .env.example .env
# .env bearbeiten: MONGODB_URI und JWT_SECRET anpassen
npm run dev
```

### 2. Frontend starten (neues Terminal)
```bash
cd bewerbung-tracker/frontend
npm install
npm start
```

### 3. Fertig!
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- MongoDB lokal oder über Atlas (kostenlos): https://www.mongodb.com/atlas

## Häufige Probleme

**MongoDB läuft nicht lokal?**
→ Nutze MongoDB Atlas (kostenlos, online):
  1. Konto erstellen auf mongodb.com/atlas
  2. Cluster erstellen (Free Tier)
  3. Connection String kopieren und in .env eintragen

**Port 5000 bereits belegt?**
→ In backend/.env: PORT=5001 ändern
→ In frontend/src/utils/api.js: baseURL anpassen

**npm install schlägt fehl?**
→ Node.js Version prüfen: node --version (muss >= 18 sein)
