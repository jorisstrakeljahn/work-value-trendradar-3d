# Work Value Trend Radar 3D

> Interactive 3D trend radar for mapping weak signals of AI/robotics and their impact on the value of work across industries. Built with TypeScript, React, and Three.js.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.160-black)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple)](https://vitejs.dev/)

## 🚀 Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **3D Rendering**: Three.js + @react-three/fiber + @react-three/drei
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Backend**: Firebase (Firestore, Auth, Storage)
- **i18n**: react-i18next
- **Code Quality**: ESLint + Prettier + TypeScript strict mode

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Firebase project (for backend functionality)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jorisstrakeljahn/work-value-trendradar-3d.git
cd work-value-trendradar-3d
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Firebase credentials
# Get these from: Firebase Console > Project Settings > General > Your apps
```

4. **Configure Firebase**
   - Set up Firestore Security Rules (see [Firebase Setup](#-firebase-setup))
   - Set up Storage Rules (see [Firebase Setup](#-firebase-setup))

5. **Start development server**
```bash
npm run dev
```

6. **Build for production**
```bash
npm run build
npm run preview
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

## 🎯 Features

### Core Functionality
- ✅ **3D Radar Visualization** - Interactive 3D trend radar with classic design
- ✅ **Real-time Updates** - Firebase Firestore subscriptions for live data
- ✅ **Signal Management** - Create, edit, and delete signals with rich metadata
- ✅ **Industry Filtering** - Filter signals by industry with multi-select
- ✅ **Work Value Index** - Calculated from 4 value dimensions (economic, social, subjective, political)
- ✅ **Dynamic Weighting** - Adjustable weights for value dimensions with auto-equalization

### User Experience
- ✅ **Interactive 3D Scene** - Orbit controls, zoom, and smooth camera movements
- ✅ **Signal Windows** - Draggable and resizable detail windows
- ✅ **Hover Tooltips** - Quick information on signal hover
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Dark Mode** - Full dark mode support with theme persistence
- ✅ **Internationalization** - German and English language support

### Technical Features
- ✅ **Performance Optimized** - Code splitting, lazy loading, React.memo, useMemo
- ✅ **Type Safety** - Comprehensive TypeScript with type guards
- ✅ **Error Handling** - Centralized error logging and user-friendly error messages
- ✅ **Image Management** - Upload, preview, and delete signal images
- ✅ **Form Validation** - Comprehensive form validation with error messages

## 📝 Development

### Project Structure

The project follows a **domain-driven architecture**:

```
src/
├── domains/              # Feature-based domains
│   ├── admin/           # Admin functionality (CRUD operations)
│   ├── auth/            # Authentication
│   ├── radar/           # 3D radar visualization
│   ├── explanation/      # Explanation section
│   └── layout/          # Layout components (Header, etc.)
├── shared/              # Shared utilities & components
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Shared React hooks
│   ├── utils/          # Utility functions
│   └── constants/      # App-wide constants
├── firebase/            # Firebase services
│   └── services/       # Organized by entity (signals, industries)
├── store/              # Zustand state management
└── types/              # TypeScript type definitions
```

### Key Design Decisions

- **Domain-Driven Design**: Code organized by business domains for better maintainability
- **Type Safety**: Comprehensive TypeScript with type guards and strict mode
- **Performance**: React.memo, useMemo, useCallback, and code splitting
- **Error Handling**: Centralized error logging with context-aware messages
- **Code Organization**: Services split into converters, queries, mutations, subscriptions

### Development Scripts

```bash
# Development
npm run dev              # Start dev server

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run format:check    # Check formatting

# Build
npm run build           # Production build
npm run preview         # Preview production build
```

## 🔥 Firebase Setup

### Firestore Security Rules

The Firestore Security Rules must be configured in the Firebase Console. The `firestore.rules` file contains the necessary rules.

**How to set up the Rules:**

1. Open the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** > **Rules**
4. Copy the content from the `firestore.rules` file
5. Paste the rules into the console
6. Click **Publish**

**The rules allow:**
- **Read**: Anyone can read signals (public viewing)
- **Create**: Only authenticated users can create signals
- **Update/Delete**: Only the creator of a signal can edit/delete it

### Firebase Storage Rules

If you want to upload images, Storage Rules must also be configured. The `storage.rules` file contains the necessary rules.

**How to set up the Rules:**

1. Open the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Storage** > **Rules**
4. Copy the content from the `storage.rules` file
5. Paste the rules into the console
6. Click **Publish**

**The rules allow:**
- **Write**: Only authenticated users can upload images
- **Read**: Anyone can view images (public access)

## 🚢 Deployment

The project can be deployed on any static hosting service:

### Vercel / Netlify

1. Push repository to GitHub/GitLab
2. Import project in Vercel/Netlify
3. Configure environment variables in dashboard
4. Build command: `npm run build`
5. Output directory: `dist`

### Environment Variables

Make sure to set all Firebase environment variables in your hosting platform:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
