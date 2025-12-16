# Work Value Trend Radar 3D

Interactive 3D trend radar for mapping weak signals of AI/robotics and their impact on the value of work across industries. Built with TypeScript and Three.js.

## 🚀 Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite (fastest way to a web demo)
- **3D Rendering**: Three.js + @react-three/fiber
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Code Quality**: ESLint + Prettier

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

### Code Quality

```bash
# Linting
npm run lint

# Format code
npm run format

# Check formatting (without changes)
npm run format:check
```

## 📋 User Stories

### Epic 0 — Project Setup & Deployment

#### US0.1 — Repo & Tooling ✅

**As a team** we want a TS frontend project with clean lint/format, so we can work in parallel.

**Acceptance Criteria:**
- ✅ Vite + TS runs locally (`npm run dev`)
- ✅ ESLint + Prettier active
- ✅ Basic folder structure present

### Epic 1 — Data Model & Seed Data

#### US1.1 — Signal Schema ✅

**As a developer** I want a clear data model for Weak Signals, so visualization and popups are consistent.

#### US1.2 — Seed Dataset ✅

**As a team** we want initial 15-25 signals as demo data, so something is immediately visible in the 3D radar.

### Epic 2 — 3D Radar View

#### US2.1 — Render 3D Scene ✅

**As a user** I want to see a 3D space where points (Weak Signals) are placed.

#### US2.2 — Map Values to Coordinates ✅

**As a user** I want axes to be logical (Impact, Horizon, Work Value), so the model is explainable.

#### US2.3 — Hover Tooltip ✅

**As a user** I want to see a tooltip (Title + Industry) on hover, so I can quickly scan.

#### US2.4 — Click to Select Signal ✅

**As a user** I want to click on a point to see details.

## 🎯 Features

- ✅ 3D Radar Visualization with classic trend radar design
- ✅ Interactive signal points with hover and click
- ✅ Industry-based filtering
- ✅ Collapsible filter and legend panels
- ✅ Work Value Index calculated from 4 value dimensions
- ✅ Responsive UI with TailwindCSS

## 📝 Development

The project uses:
- **TypeScript** for type safety
- **React Three Fiber** for declarative 3D graphics
- **Zustand** for simple state management
- **TailwindCSS** for fast styling

## 🚢 Deployment

The project can be easily deployed on Vercel or Netlify:

1. Push repository to GitHub/GitLab
2. Import in Vercel/Netlify
3. Build command: `npm run build`
4. Output directory: `dist`

## 📄 License

MIT
