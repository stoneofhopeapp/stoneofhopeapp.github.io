import type { User } from 'firebase/auth'

export type SessionUser = {
  uid: string
  displayName: string | null
  email: string | null
  authSource: 'firebase' | 'demo'
}

const DEMO_USER_STORAGE_KEY = 'stone-of-hope.demo-user'

const DEV_DEMO_USER: SessionUser = {
  uid: 'dev-local',
  displayName: 'Dev',
  email: null,
  authSource: 'demo',
}

export function mapFirebaseUser(user: User): SessionUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    authSource: 'firebase',
  }
}

export function loadDemoUser(): SessionUser | null {
  const raw = window.localStorage.getItem(DEMO_USER_STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as SessionUser
    if (!parsed.uid || parsed.authSource !== 'demo') return null
    return parsed
  } catch {
    return null
  }
}

/** Dev server only: skip login and open StudyWorkspace with a local demo session. */
export function loadInitialDemoUser(): SessionUser | null {
  return loadDemoUser() ?? (import.meta.env.DEV ? DEV_DEMO_USER : null)
}

export function saveDemoUser(user: SessionUser) {
  window.localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(user))
}

export function clearDemoUser() {
  window.localStorage.removeItem(DEMO_USER_STORAGE_KEY)
}
