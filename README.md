# Work Value Trend Radar 3D

Interactive 3D trend radar for mapping weak signals of AI/robotics and their impact on the value of work across industries. Built with TypeScript and Three.js.

## 🚀 Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite (schnellster Weg zu einer Web-Demo)
- **3D Rendering**: Three.js + @react-three/fiber
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Code Quality**: ESLint + Prettier

## 📁 Projektstruktur

```
/src
  /components
    RadarScene.tsx          # Haupt-3D-Szene
    FiltersPanel.tsx        # Filter-UI
    SignalDetailsPanel.tsx  # Detailansicht für ausgewählte Signale
    Legend.tsx              # Legende für das Radar
  /data
    signals.seed.json       # Seed-Daten für Signale
    industries.json         # Branchen-Definitionen
  /lib
    scoring.ts              # Scoring-Logik für Signale
    mapping.ts              # Mapping von Signalen zu 3D-Positionen
    raycast.ts              # Raycasting für Interaktionen
  /store
    useRadarStore.ts        # Zustand Store für State Management
  /types
    signal.ts               # TypeScript-Definitionen
  App.tsx
  main.tsx
/public
README.md
```

## 🛠️ Setup & Installation

### Voraussetzungen

- Node.js 18+ und npm/yarn/pnpm

### Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Build für Production
npm run build

# Preview des Production Builds
npm preview
```

### Code Quality

```bash
# Linting
npm run lint

# Code formatieren
npm run format

# Format-Check (ohne Änderungen)
npm run format:check
```

## 📋 User Stories

### Epic 0 — Project Setup & Deployment

#### US0.1 — Repo & Tooling ✅

**Als Team** wollen wir ein TS-Frontend-Projekt mit sauberem Lint/Format, damit wir parallel arbeiten können.

**Acceptance Criteria:**
- ✅ Vite + TS läuft lokal (`npm run dev`)
- ✅ ESLint + Prettier aktiv
- ✅ Basic folder structure vorhanden

## 🎯 Nächste Schritte

- [ ] 3D-Radar-Visualisierung implementieren
- [ ] Signal-Daten in 3D-Szene rendern
- [ ] Filter-Funktionalität implementieren
- [ ] Interaktive Signal-Auswahl (Raycasting)
- [ ] Detail-Panel mit Signal-Informationen
- [ ] Legende für Kategorien und Branchen
- [ ] Responsive Design
- [ ] Deployment auf Vercel/Netlify

## 📝 Entwicklung

Das Projekt verwendet:
- **TypeScript** für Type-Safety
- **React Three Fiber** für deklarative 3D-Grafiken
- **Zustand** für einfaches State Management
- **TailwindCSS** für schnelles Styling

## 🚢 Deployment

Das Projekt kann einfach auf Vercel oder Netlify deployed werden:

1. Repository zu GitHub/GitLab pushen
2. In Vercel/Netlify importieren
3. Build-Kommando: `npm run build`
4. Output-Verzeichnis: `dist`

## 📄 Lizenz

MIT
