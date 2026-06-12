import { useEffect, useMemo, useState } from 'react'
import { loadBibleChapter } from '../bibleChapterLoader'
import { getBibleBook } from '../bibleBooks'
import { getItemsForChapter } from '../browseData'
import { groupBrowseItemsByVerse, parseVerseStart } from '../chapterNotes'
import { navigateToChapter } from '../chapterNavigation'
import { readVerseRouteFromHash } from '../verseNavigation'
import type { ScriptureChapter } from '../studyData'
import { VerseStudyNote } from './VerseStudyNote'

export function VerseDetailPage() {
  const [route, setRoute] = useState(() => readVerseRouteFromHash())
  const [scripture, setScripture] = useState<ScriptureChapter | null>(null)
  const [draftBody, setDraftBody] = useState('')
  const [hiddenNoteIds, setHiddenNoteIds] = useState<string[]>([])

  useEffect(() => {
    const sync = () => setRoute(readVerseRouteFromHash())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => {
    if (!route) return

    let cancelled = false
    loadBibleChapter(route.bookOrd, route.chapterOrd).then((chapter) => {
      if (cancelled) return
      setScripture(chapter)
    })

    return () => {
      cancelled = true
    }
  }, [route?.bookOrd, route?.chapterOrd])

  const notes = useMemo(() => {
    if (!route) return []
    const chapterNotes = getItemsForChapter(route.bookOrd, route.chapterOrd)
    const { byVerse } = groupBrowseItemsByVerse(chapterNotes)

    return (byVerse.get(route.verseOrd) ?? []).filter((item) => !hiddenNoteIds.includes(item.id))
  }, [route, hiddenNoteIds])

  if (!route) {
    return (
      <main className="study-shell">
        <section className="study-panel" style={{ width: 'min(1180px, 100%)', margin: '0 auto' }}>
          <div className="empty-state">
            <h2>Verse not found</h2>
          </div>
        </section>
      </main>
    )
  }

  const book = getBibleBook(route.bookOrd)
  const verse = scripture?.verses.find((entry) => entry.verseOrd === route.verseOrd)
  const reference = book ? `${book.name} ${route.chapterOrd}:${route.verseOrd}` : `Verse ${route.verseOrd}`

  return (
    <main className="study-shell">
      <section className="study-hero">
        <div className="study-hero__copy">
          <div className="study-hero__meta">
            <p className="study-eyebrow">{book?.name ?? 'Scripture'}</p>
            <button
              type="button"
              className="theme-toggle"
              onClick={() => navigateToChapter(route.bookOrd, route.chapterOrd)}
            >
              Chapter
            </button>
          </div>
          <h1>{reference}</h1>
          <p className="study-hero__subtitle">Write longer notes and prayers on this verse</p>
        </div>

        <div className="study-hero__card verse-detail-hero-card">
          <p className="study-card__label">Scripture</p>
          <p className="verse-detail-hero-card__text">
            {verse?.text ?? 'Loading verse text…'}
          </p>
        </div>
      </section>

      <section className="study-layout">
        <section className="study-panel study-layout__full verse-detail-compose">
          <div className="study-panel__heading">
            <div>
              <h2>New note or prayer</h2>
            </div>
          </div>
          <div className="note-editor note-editor--verse-page">
            <textarea
              className="form-control verse-detail-compose__input"
              rows={8}
              value={draftBody}
              onChange={(event) => setDraftBody(event.target.value)}
              placeholder="Write a longer note, reflection, or prayer on this verse…"
            />
            <div className="verse-note-composer__actions">
              <button type="button" className="btn btn-primary btn-sm" disabled={!draftBody.trim()}>
                Save
              </button>
            </div>
          </div>
        </section>

        {notes.length > 0 ? (
          <section className="study-panel study-layout__full verse-detail-notes">
            <div className="study-panel__heading">
              <div>
                <h2>Your notes</h2>
              </div>
              <span>{notes.length} on this verse</span>
            </div>
            <div className="verse-note-list">
              {notes.map((item) => (
                <VerseStudyNote
                  key={item.id}
                  item={item}
                  bookOrd={route.bookOrd}
                  chapterOrd={route.chapterOrd}
                  verseOrd={parseVerseStart(item.verseRange) ?? route.verseOrd}
                  onDelete={(id) => setHiddenNoteIds((current) => [...current, id])}
                  showFullPage={false}
                />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  )
}
