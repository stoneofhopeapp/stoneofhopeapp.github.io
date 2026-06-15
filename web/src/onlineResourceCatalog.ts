import profilesJson from './data/online-resource-profiles.mock.json'
import type { OnlineResourceProfile } from './types/onlineResource'

const mockProfiles = profilesJson as OnlineResourceProfile[]

/** All enabled profiles in the public catalog (mock JSON → Firestore `onlineResourceProfiles`). */
export function listRegisteredOnlineResourceProfiles(): OnlineResourceProfile[] {
  return [...mockProfiles]
    .filter((profile) => profile.enabled)
    .sort((a, b) => a.name.localeCompare(b.name))
}

/** Enabled catalog entries the user has not imported yet. */
export function listAvailableOnlineResourceProfiles(): OnlineResourceProfile[] {
  return mockProfiles.filter((profile) => profile.enabled)
}

export function getOnlineResourceProfile(churchKey: string): OnlineResourceProfile | undefined {
  return mockProfiles.find((profile) => profile.churchKey === churchKey)
}
