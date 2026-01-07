# Firebase Setup

This directory contains the Firebase configuration files and setup instructions.

## Files

- `firestore.rules` - Firestore Security Rules
- `storage.rules` - Firebase Storage Rules

## Setup Instructions

### 1. Firestore Security Rules

The Firestore Security Rules must be configured in the Firebase Console.

**How to set up the Rules:**

1. Open the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** > **Rules**
4. Copy the content from `docs/firebase/firestore.rules`
5. Paste the rules into the console
6. Click **Publish**

**The rules allow:**
- **Read**: Anyone can read signals and industries (public viewing)
- **Create**: Only authenticated users can create signals/industries
- **Update/Delete**: Only the creator of a signal/industry can edit/delete it

### 2. Firebase Storage Rules

If you want to upload images, Storage Rules must also be configured.

**How to set up the Rules:**

1. Open the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Storage** > **Rules**
4. Copy the content from `docs/firebase/storage.rules`
5. Paste the rules into the console
6. Click **Publish**

**The rules allow:**
- **Write**: Only authenticated users can upload images
- **Read**: Anyone can view images (public access)

## Environment Variables

Make sure to set all Firebase environment variables in your `.env` file or hosting platform:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

You can find these values in:
**Firebase Console** > **Project Settings** > **General** > **Your apps**

## Project Structure

```
firebase/
├── signals/          # Signal-related collections
│   └── {signalId}/    # Individual signal documents
└── industries/       # Industry-related collections
    └── {industryId}/ # Individual industry documents
```

## Storage Structure

```
storage/
└── signals/
    └── {signalId}/
        └── {imageFile}  # Signal images
```

