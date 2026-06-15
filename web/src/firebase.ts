import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

function readConfig() {
  const env = import.meta.env
  return {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
  }
}

let app: FirebaseApp | null = null

export function isFirebaseConfigured(): boolean {
  const c = readConfig()
  return Boolean(c.apiKey && c.authDomain && c.projectId && c.appId)
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null
  if (!app) {
    const c = readConfig()
    app = initializeApp({
      apiKey: c.apiKey,
      authDomain: c.authDomain,
      projectId: c.projectId,
      storageBucket: c.storageBucket,
      messagingSenderId: c.messagingSenderId,
      appId: c.appId,
      measurementId: c.measurementId,
    })
  }
  return app
}

export function getFirebaseAuth(): Auth | null {
  const a = getFirebaseApp()
  return a ? getAuth(a) : null
}

export function getFirestoreDb(): Firestore | null {
  const a = getFirebaseApp()
  return a ? getFirestore(a) : null
}
