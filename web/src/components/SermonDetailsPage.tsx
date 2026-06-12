import { useEffect, useState } from 'react'
import type { MockNote } from '../mockData'
import { getBrowseItemsForSermon } from '../mockDataAdapter'
import {
  getLinkedNotesForSermon,
  getSeriesForSermon,
  getSermonById,
} from '../sermonDetailsData'
import { seriesDetailsRoute } from '../seriesDetailsData'
import { navigateToHome, readSermonIdFromHash } from '../appNavigation'
import { formatPreachedOnDate } from '../dateFormat'
import { BrowseItemCard } from './BrowseItemCard'
import { HeroCornerLabel } from './HeroCornerLabel'
import { SermonMediaActions } from './SermonMediaActions'
import { ScriptureReference } from './ScriptureBlock'

function SermonImageNote({ note }: { note: MockNote }) {
  return (
    <figure className="sermon-details__image-note">
      <img src={note.content} alt="Sermon note image" loading="lazy" />
    </figure>
  )
}

export function SermonDetailsPage() {
  const [sermonId, setSermonId] = useState(() => readSermonIdFromHash())

  useEffect(() => {
    const sync = () => setSermonId(readSermonIdFromHash())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const sermon = sermonId ? getSermonById(sermonId) : undefined

  if (!sermon) {
    return (
      <main className="study-shell">
        <section className="study-panel" style={{ width: 'min(1180px, 100%)', margin: '0 auto' }}>
          <div className="empty-state">
            <h2>Sermon not found</h2>
            <p>This sermon may have been removed or the link is outdated.</p>
            <button type="button" className="btn btn-primary" onClick={navigateToHome}>
              Back to Home
            </button>
          </div>
        </section>
      </main>
    )
  }

  const series = getSeriesForSermon(sermon)
  const preachedDate = formatPreachedOnDate(sermon.preachedOn)
  const linkedNotes = getLinkedNotesForSermon(sermon.id)
  const browseNotes = getBrowseItemsForSermon(sermon.id)
  const imageNotes = linkedNotes.filter((note) => note.noteType === 'image')

  return (
    <main className="study-shell sermon-details-shell">
      <section className="study-hero">
        <div className="study-hero__copy">
          <h1 className="sermon-details__heading">
            {sermon.title}
            <span className="sermon-details__heading-meta"> - {sermon.preacher}</span>
          </h1>
          {sermon.chapterRange || preachedDate ? (
            <div className="sermon-details__ref-row">
              {sermon.chapterRange ? (
                <ScriptureReference reference={sermon.chapterRange} inline />
              ) : null}
              <span className="sermon-details__date">{preachedDate}</span>
            </div>
          ) : null}
          {series ? (
            <a className="sermon-details__series" href={seriesDetailsRoute(series.id)}>
              {series.title}
            </a>
          ) : null}
        </div>

        <div className="study-hero__card study-hero__card--corner-label">
          <HeroCornerLabel label="Sermon Details" />
        </div>
      </section>

      <section className="study-panel sermon-details-panel">
        <p className="sermon-details__intro">{sermon.intro}</p>

        <SermonMediaActions sermonId={sermon.id} showNotesButton={false} className="sermon-details__actions" />

        <div className="sermon-details__notes">
          <h2 className="sermon-details__notes-heading">
            Sermon notes
            <span className="sermon-details__notes-count">{linkedNotes.length}</span>
          </h2>

          {linkedNotes.length === 0 ? (
            <p className="sermon-details__notes-empty">No notes saved for this sermon yet.</p>
          ) : (
            <div className="sermon-details__notes-list">
              {browseNotes.map((item) => (
                <BrowseItemCard key={item.id} item={item} />
              ))}
              {imageNotes.map((note) => (
                <SermonImageNote key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
