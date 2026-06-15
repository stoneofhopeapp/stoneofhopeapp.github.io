import { useState } from 'react'
import { listRegisteredOnlineResourceProfiles } from '../onlineResourceCatalog'
import { useUserOnlineResources } from '../context/UserOnlineResourcesContext'

export function OnlineResourcesPage() {
  const { hasImported, importResource, loading } = useUserOnlineResources()
  const [addingKey, setAddingKey] = useState<string | null>(null)
  const profiles = listRegisteredOnlineResourceProfiles()

  const handleAdd = async (churchKey: string) => {
    setAddingKey(churchKey)
    try {
      await importResource(churchKey)
    } finally {
      setAddingKey(null)
    }
  }

  return (
    <main className="library-shell online-resources-shell">
      <header className="library-header online-resources-header">
        <div>
          <h1 className="online-resources-header__title">Online Resources</h1>
          <p className="library-panel__hint">
            Registered churches you can add. After Add, their sermons and series appear under Tags →
            By Bible Books.
          </p>
        </div>
      </header>

      <section className="library-panel online-resources-panel">
        {loading ? (
          <p className="library-empty">Loading your resources…</p>
        ) : profiles.length === 0 ? (
          <p className="library-empty">No online resources registered yet.</p>
        ) : (
          <div className="online-resources-list">
            {profiles.map((profile) => {
              const imported = hasImported(profile.churchKey)
              const isAdding = addingKey === profile.churchKey

              return (
                <article key={profile.churchKey} className="online-resource-card">
                  <div className="online-resource-card__main">
                    <div className="online-resource-card__head">
                      <h2>{profile.name}</h2>
                      {profile.subtitle ? (
                        <p className="online-resource-card__subtitle">{profile.subtitle}</p>
                      ) : null}
                    </div>
                    {profile.intro ? (
                      <p className="online-resource-card__intro">{profile.intro}</p>
                    ) : null}
                    <div className="online-resource-card__links">
                      {profile.churchWebsite ? (
                        <a href={profile.churchWebsite} target="_blank" rel="noreferrer">
                          Website
                        </a>
                      ) : null}
                      {profile.youtubeHomeLink ? (
                        <a href={profile.youtubeHomeLink} target="_blank" rel="noreferrer">
                          YouTube
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <div className="online-resource-card__action">
                    {imported ? (
                      <span className="online-resource-card__added">Added</span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={isAdding}
                        onClick={() => handleAdd(profile.churchKey)}
                      >
                        {isAdding ? 'Adding…' : 'Add'}
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
