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

**The rules include:**
- **Read**: Anyone can read signals and industries (public viewing)
- **Create**: Only authenticated users can create signals/industries with strict schema validation
- **Update/Delete**: Only the creator of a signal/industry can edit/delete it (IDOR protection)
- **Schema Validation**: Enforced field types, lengths, and value ranges (OWASP A03: Injection prevention)
- **Immutable Fields**: `createdBy` and `createdAt` cannot be modified after creation

### 2. Firebase Storage Rules

If you want to upload images, Storage Rules must also be configured.

**How to set up the Rules:**

1. Open the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Storage** > **Rules**
4. Copy the content from `docs/firebase/storage.rules`
5. Paste the rules into the console
6. Click **Publish**

**The rules include:**
- **Write**: Only authenticated users can upload images with validation:
  - Maximum file size: 5MB
  - Allowed types: JPEG, PNG, WebP, GIF only (OWASP A04: Unrestricted File Upload prevention)
- **Read**: Anyone can view images (public access)

## Environment Variables

Make sure to set all Firebase environment variables in your `.env` file or hosting platform:

```env
# Required - Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional - Firebase App Check (Recommended for Production)
VITE_FIREBASE_APPCHECK_SITE_KEY=your_recaptcha_v3_site_key
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

## 3. Firebase App Check (Optional, Recommended for Production)

Firebase App Check helps protect your app from abuse by preventing unauthorized clients from accessing your backend resources. It uses attestation providers like reCAPTCHA v3 to verify that requests come from legitimate devices.

**Benefits:**
- Prevents automated bot/scraper abuse
- No traditional rate limiting needed (handled by Firebase)
- Works transparently for legitimate users
- Auto-refreshes tokens

**Setup Steps:**

### Step 1: Register reCAPTCHA v3 Site
1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click **+** to create a new site
3. Choose **reCAPTCHA v3**
4. Add your domains (e.g., `your-app.netlify.app`)
5. Copy the **Site Key**

### Step 2: Enable App Check in Firebase
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Build** > **App Check**
4. Click **Get Started** if not already enabled
5. Select your web app
6. Choose **reCAPTCHA v3** as the provider
7. Paste your **reCAPTCHA Site Key**
8. Save

### Step 3: Add Environment Variable
Add the reCAPTCHA Site Key to your environment:

```env
VITE_FIREBASE_APPCHECK_SITE_KEY=your_recaptcha_v3_site_key
```

### Step 4: Enable Enforcement (Production)
**⚠️ Important**: Start with **monitoring mode**, then enable enforcement after testing.

1. In Firebase Console > **App Check**
2. Go to **APIs** tab
3. For each service (Firestore, Storage):
   - Click **...** menu > **Manage**
   - Start with **Unenforced** (logs violations but allows requests)
   - After monitoring for a few days, switch to **Enforced**

**Monitoring Mode vs. Enforcement:**
- **Unenforced**: Logs requests without valid tokens, but allows them (good for testing)
- **Enforced**: Blocks requests without valid tokens (enable after confirming no false positives)

### Step 5: Verify App Check is Working
1. Open your deployed app in browser
2. Open **Developer Console** > **Network** tab
3. Look for Firebase API requests
4. Check for `X-Firebase-AppCheck` header in requests
5. In Firebase Console > **App Check** > **Metrics**, verify token issuance

**Debugging:**
```javascript
// App Check initialization logs are enabled in src/firebase/config.ts
// Look for: "✅ Firebase App Check initialized" in console
```

**Local Development:**
- If `VITE_FIREBASE_APPCHECK_SITE_KEY` is not set, App Check will not initialize
- This allows local development without reCAPTCHA interference
- For testing App Check locally, you can use debug tokens (see [Firebase Docs](https://firebase.google.com/docs/app-check/web/debug-provider))

**Troubleshooting:**
- If legitimate users are blocked, check Firebase Console > App Check > Metrics for false positives
- Verify reCAPTCHA v3 site key is correct and domain is whitelisted
- Check browser console for App Check errors
- Ensure enforcement is enabled for the correct services (Firestore/Storage)

