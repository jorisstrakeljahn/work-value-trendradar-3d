# Work Value Trend Radar 3D

Interactive 3D trend radar for mapping weak signals of AI/robotics and their impact on the value of work across industries. Built with TypeScript and Three.js.

## 🚀 Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **3D Rendering**: Three.js + @react-three/fiber
- **Styling**: TailwindCSS
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
