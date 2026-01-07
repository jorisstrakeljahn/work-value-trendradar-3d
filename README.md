# Work Value Trend Radar 3D

Interactive 3D trend radar for mapping weak signals of AI/robotics and their impact on the value of work across industries. Built with TypeScript, React, and Three.js.

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
   - See [Firebase Setup Documentation](docs/firebase/README.md) for detailed instructions

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

For detailed Firebase setup instructions, including security rules configuration, see the [Firebase Documentation](docs/firebase/README.md).

**Quick Setup:**
1. Copy environment variables from Firebase Console
2. Configure Firestore Security Rules (see `docs/firebase/firestore.rules`)
3. Configure Storage Rules (see `docs/firebase/storage.rules`)

## 🚢 Deployment

The project can be deployed on any static hosting service:

### Vercel / Netlify

1. Push repository to GitHub/GitLab
2. Import project in Vercel/Netlify
3. Configure environment variables in dashboard
4. Build command: `npm run build`
5. Output directory: `dist`

### Environment Variables

See [Firebase Documentation](docs/firebase/README.md) for a complete list of required environment variables.
