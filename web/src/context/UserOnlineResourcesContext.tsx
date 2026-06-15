import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { SessionUser } from '../session'
import { getOnlineResourceProfile, listAvailableOnlineResourceProfiles } from '../onlineResourceCatalog'
import type { OnlineResourceProfile, UserOnlineResource } from '../types/onlineResource'
import {
  getImportedChurchKeys,
  importOnlineResource,
  loadUserOnlineResources,
  removeUserOnlineResource,
} from '../userOnlineResourcesStore'

type UserOnlineResourcesContextValue = {
  loading: boolean
  imported: UserOnlineResource[]
  importedKeys: string[]
  available: OnlineResourceProfile[]
  profileFor: (churchKey: string) => OnlineResourceProfile | undefined
  importResource: (churchKey: string, lastImportedVersion?: string) => Promise<void>
  removeResource: (churchKey: string) => Promise<void>
  hasImported: (churchKey: string) => boolean
}

const UserOnlineResourcesContext = createContext<UserOnlineResourcesContextValue | null>(null)

type ProviderProps = {
  user: SessionUser
  children: ReactNode
}

export function UserOnlineResourcesProvider({ user, children }: ProviderProps) {
  const [loading, setLoading] = useState(true)
  const [imported, setImported] = useState<UserOnlineResource[]>([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    loadUserOnlineResources(user.uid)
      .then((resources) => {
        if (!cancelled) setImported(resources)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user.uid])

  const importedKeys = useMemo(() => getImportedChurchKeys(imported), [imported])

  const available = useMemo(() => {
    const importedSet = new Set(importedKeys)
    return listAvailableOnlineResourceProfiles().filter(
      (profile) => !importedSet.has(profile.churchKey),
    )
  }, [importedKeys])

  const value = useMemo<UserOnlineResourcesContextValue>(
    () => ({
      loading,
      imported,
      importedKeys,
      available,
      profileFor: (churchKey) => getOnlineResourceProfile(churchKey),
      hasImported: (churchKey) => importedKeys.includes(churchKey),
      importResource: async (churchKey, lastImportedVersion) => {
        const resource = await importOnlineResource(user.uid, churchKey, lastImportedVersion)
        setImported((current) => {
          const without = current.filter((item) => item.churchKey !== churchKey)
          return [...without, resource].sort((a, b) => a.churchKey.localeCompare(b.churchKey))
        })
      },
      removeResource: async (churchKey) => {
        await removeUserOnlineResource(user.uid, churchKey)
        setImported((current) => current.filter((item) => item.churchKey !== churchKey))
      },
    }),
    [available, imported, importedKeys, loading, user.uid],
  )

  return (
    <UserOnlineResourcesContext.Provider value={value}>{children}</UserOnlineResourcesContext.Provider>
  )
}

export function useUserOnlineResources(): UserOnlineResourcesContextValue {
  const context = useContext(UserOnlineResourcesContext)
  if (!context) {
    throw new Error('useUserOnlineResources must be used within UserOnlineResourcesProvider')
  }
  return context
}
