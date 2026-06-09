# StoneOfHope Web

This folder contains the React + Vite web app for StoneOfHope.

Current scope:

- public landing page
- separate login / register page
- Firebase Apple / Google sign-in
- post-login study workspace MVP

## Run locally

```bash
cd /Users/joyce/Documents/Development/StoneOfHope_Website/web
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## Firebase setup

The web app is intended to use the same Firebase project as the iOS app:

- Project ID: `knowgrowshow-d3609`
- Messaging Sender ID: `454394916647`
- Storage Bucket: `knowgrowshow-d3609.firebasestorage.app`

## 1. Create `web/.env`

```bash
cp .env.example .env
```

Then fill in `VITE_FIREBASE_APP_ID` from Firebase Console after registering a Web app.

## 2. Register a Web app in Firebase Console

In Firebase Console:

1. Open project `knowgrowshow-d3609`
2. Go to Project settings
3. Under "Your apps", add a new Web app
4. Copy the Web config into `web/.env`

The one value we cannot safely recover from the existing iOS config is the Web `appId`, so you need to get that from the Web app registration.

## 3. Enable authentication providers

In Firebase Console → Authentication → Sign-in method:

- enable `Google`
- enable `Apple`

## 4. Add authorized domains

In Firebase Console → Authentication → Settings → Authorized domains, add:

- `localhost`
- your production domain when ready

## 5. Test sign-in

Open:

```text
http://localhost:5173/#auth
```

Then test:

- `Continue with Apple`
- `Login with Google`

## Validation

```bash
npm run lint
npx tsc --noEmit -p tsconfig.app.json
```

## KJV chapter files

The web app can keep public Bible text as chapter-level JSON files instead of storing all verses in Firestore.

Current local output path:

```text
web/public/bible/KJV/<bookOrd>/<chapterOrd>.json
```

Example:

```text
web/public/bible/KJV/60/1.json
```

This keeps chapter fetches small and maps well to the future study page layout:

- left side: chapter text
- right side: notes and comments from Firestore

### Generate KJV chapter files

By default, the generator reads the KJV source from the iOS repo:

```text
/Users/joyce/Documents/Development/KnowGrowShow/KnowGrowShow/Utils/DataFiles/KJV.json
```

Run:

```bash
cd /Users/joyce/Documents/Development/StoneOfHope_Website/web
npm run generate:bible:kjv
```

If you ever move the source file, override it with:

```bash
KJV_SOURCE_PATH=/absolute/path/to/KJV.json npm run generate:bible:kjv
```

### Later sync to Firebase

When you're ready, the easiest cloud sync target is Firebase Storage, not Firestore.

Recommended Storage path:

```text
bible/KJV/<bookOrd>/<chapterOrd>.json
```

Example:

```text
bible/KJV/60/1.json
```

That way:

- local dev reads from `public/bible/KJV/...`
- production can read the same chapter shape from Firebase Storage
- Firestore stays focused on user data like notes, comments, and progress
