import { useEffect, useState } from 'react'
import { getBibleBook } from '../bibleBooks'
import { navigateToHome, readSeriesIdFromHash } from '../appNavigation'
import { getSeriesById, getSermonsForSeries } from '../seriesDetailsData'
import { HeroCornerLabel } from './HeroCornerLabel'
import { SermonBrowseCard } from './SermonBrowseCard'

export function SeriesDetailsPage() {
  const [seriesId, setSeriesId] = useState(() => readSeriesIdFromHash())

  useEffect(() => {
    const sync = () => setSeriesId(readSeriesIdFromHash())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const series = seriesId ? getSeriesById(seriesId) : undefined

  if (!series) {
    return (
      <main className="study-shell">
        <section className="study-panel" style={{ width: 'min(1180px, 100%)', margin: '0 auto' }}>
          <div className="empty-state">
            <h2>Series not found</h2>
            <p>This series may have been removed or the link is outdated.</p>
            <button type="button" className="btn btn-primary" onClick={navigateToHome}>
              Back to Home
            </button>
          </div>
        </section>
      </main>
    )
  }

  const sermons = getSermonsForSeries(series.id)
  const book = series.bookOrd != null ? getBibleBook(series.bookOrd) : undefined

  return (
    <main className="study-shell series-details-shell">
      <section className="study-hero">
        <div className="study-hero__copy">
          <h1 className="series-details__heading">{series.title}</h1>
          {book ? <p className="series-details__book">{book.name}</p> : null}
          <p className="series-details__meta">
            {sermons.length} sermon{sermons.length === 1 ? '' : 's'}
            {series.isFinished ? ' · Finished' : ' · In progress'}
          </p>
        </div>

        <div className="study-hero__card study-hero__card--corner-label">
          <HeroCornerLabel label="Series Details" />
        </div>
      </section>

      <section className="study-panel series-details-panel">
        {sermons.length === 0 ? (
          <p className="series-details__empty">No sermons in this series yet.</p>
        ) : (
          <div className="series-details__sermon-list">
            {sermons.map((sermon) => (
              <SermonBrowseCard key={sermon.id} sermon={sermon} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
