/** Public catalog document: `onlineResourceProfiles/{churchKey}` (matches iOS `ImportedChurchProfile`). */
export type OnlineResourceProfile = {
  schemaVersion: number
  id?: string
  churchKey: string
  isUserData: boolean
  enabled: boolean
  name: string
  subtitle?: string
  intro?: string
  introLocalizationKey?: string
  logoImageName?: string
  logoURL?: string
  churchWebsite?: string
  youtubeHomeLink?: string
  churchSermonBaseURL?: string
  sermonImportRepoURL?: string
  updatedAt?: string
}

/** Per-user import record: `users/{uid}/onlineResources/{churchKey}`. */
export type UserOnlineResource = {
  schemaVersion: number
  churchKey: string
  importedAt: string
  lastImportedVersion?: string
}
