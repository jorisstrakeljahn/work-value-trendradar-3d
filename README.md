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

If you want to upload images, Storage Rules must also be configured:

1. Go to **Storage** > **Rules**
2. Use the following rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /signals/{signalId}/{allPaths=**} {
      // Only authenticated users can upload images
      allow write: if request.auth != null;
      // Anyone can view images
      allow read: if true;
    }
  }
}
```

## 🚢 Deployment

The project can be easily deployed on Vercel or Netlify:

1. Push repository to GitHub/GitLab
2. Import in Vercel/Netlify
3. Build command: `npm run build`
4. Output directory: `dist`
