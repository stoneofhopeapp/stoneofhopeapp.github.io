import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  type Firestore,
} from 'firebase/firestore'
import type { UserOnlineResource } from './types/onlineResource'
import { getFirestoreDb } from './firebase'

const SCHEMA_VERSION = 1
const LOCAL_STORAGE_PREFIX = 'stone-of-hope.user-online-resources.'

/** Prototype: no churches imported until the user taps Add. */
const DEFAULT_IMPORTED_CHURCH_KEYS: string[] = []

function localStorageKey(uid: string): string {
  return `${LOCAL_STORAGE_PREFIX}${uid}`
}

function readLocal(uid: string): UserOnlineResource[] {
  const raw = window.localStorage.getItem(localStorageKey(uid))
  if (!raw) {
    return DEFAULT_IMPORTED_CHURCH_KEYS.map((churchKey) => ({
      schemaVersion: SCHEMA_VERSION,
      churchKey,
      importedAt: new Date(0).toISOString(),
    }))
  }

  try {
    const parsed = JSON.parse(raw) as UserOnlineResource[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeLocal(uid: string, resources: UserOnlineResource[]) {
  window.localStorage.setItem(localStorageKey(uid), JSON.stringify(resources))
}

function userOnlineResourceDoc(db: Firestore, uid: string, churchKey: string) {
  return doc(db, 'users', uid, 'onlineResources', churchKey)
}

export async function loadUserOnlineResources(uid: string): Promise<UserOnlineResource[]> {
  const db = getFirestoreDb()
  if (!db) {
    return readLocal(uid)
  }

  try {
    const snapshot = await getDocs(collection(db, 'users', uid, 'onlineResources'))
    if (snapshot.empty) {
      const local = readLocal(uid)
      await Promise.all(local.map((resource) => saveUserOnlineResourceToCloud(uid, resource)))
      return local
    }

    const cloud = snapshot.docs
      .map((entry) => entry.data() as UserOnlineResource)
      .filter((resource) => resource.churchKey)
      .sort((a, b) => a.churchKey.localeCompare(b.churchKey))

    writeLocal(uid, cloud)
    return cloud
  } catch {
    return readLocal(uid)
  }
}

export async function saveUserOnlineResourceToCloud(
  uid: string,
  resource: UserOnlineResource,
): Promise<void> {
  const db = getFirestoreDb()
  writeLocal(uid, mergeResource(readLocal(uid), resource))

  if (!db) return

  await setDoc(userOnlineResourceDoc(db, uid, resource.churchKey), resource, { merge: true })
}

export async function importOnlineResource(
  uid: string,
  churchKey: string,
  lastImportedVersion?: string,
): Promise<UserOnlineResource> {
  const resource: UserOnlineResource = {
    schemaVersion: SCHEMA_VERSION,
    churchKey,
    importedAt: new Date().toISOString(),
    ...(lastImportedVersion ? { lastImportedVersion } : {}),
  }

  await saveUserOnlineResourceToCloud(uid, resource)
  return resource
}

export async function removeUserOnlineResource(uid: string, churchKey: string): Promise<void> {
  const next = readLocal(uid).filter((resource) => resource.churchKey !== churchKey)
  writeLocal(uid, next)

  const db = getFirestoreDb()
  if (!db) return

  await deleteDoc(userOnlineResourceDoc(db, uid, churchKey))
}

export function getImportedChurchKeys(resources: UserOnlineResource[]): string[] {
  return resources.map((resource) => resource.churchKey)
}

function mergeResource(
  existing: UserOnlineResource[],
  incoming: UserOnlineResource,
): UserOnlineResource[] {
  const without = existing.filter((resource) => resource.churchKey !== incoming.churchKey)
  return [...without, incoming].sort((a, b) => a.churchKey.localeCompare(b.churchKey))
}
