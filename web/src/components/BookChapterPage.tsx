import { useEffect, useState } from 'react'
import { loadBibleChapter } from '../bibleChapterLoader'
import { getBibleBook } from '../bibleBooks'
import { browseTags, getItemsForChapter } from '../browseData'
import { navigateToHome } from '../appNavigation'
import { readChapterRouteFromHash } from '../chapterNavigation'
import { getSermonsForChapter } from '../sermonMockData'
import type { ScriptureChapter } from '../studyData'
import { ChapterContextPanel } from './ChapterContextPanel'
import { ChapterVerseStudy } from './ChapterVerseStudy'

const tagNameMap = Object.fromEntries(browseTags.map((tag) => [tag.id, tag.name]))

export function BookChapterPage() {
  const [route, setRoute] = useState(() => readChapterRouteFromHash())
  const [scripture, setScripture] = useState<ScriptureChapter | null>(null)
  const [loadingScripture, setLoadingScripture] = useState(true)

  useEffect(() => {
    const sync = () => setRoute(readChapterRouteFromHash())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => {
    if (!route) return

    let cancelled = false
    setLoadingScripture(true)

    loadBibleChapter(route.bookOrd, route.chapterOrd).then((chapter) => {
      if (cancelled) return
      setScripture(chapter)
      setLoadingScripture(false)
    })

    return () => {
      cancelled = true
    }
  }, [route?.bookOrd, route?.chapterOrd])

  if (!route) {
    return (
      <main className="study-shell">
        <section className="study-panel" style={{ width: 'min(1180px, 100%)', margin: '0 auto' }}>
          <div className="empty-state">
            <h2>Chapter not found</h2>
            <p>Pick a sermon from Home or browse Bible books to open a chapter page.</p>
            <button type="button" className="btn btn-primary" onClick={navigateToHome}>
              Back to Home
            </button>
          </div>
        </section>
      </main>
    )
  }

  const book = getBibleBook(route.bookOrd)
  const sermons = getSermonsForChapter(route.bookOrd, route.chapterOrd)
  const notes = getItemsForChapter(route.bookOrd, route.chapterOrd)
  const chapterTitle = book ? `${book.name} ${route.chapterOrd}` : `Chapter ${route.chapterOrd}`

  return (
    <main className="study-shell">
      <section className="study-hero">
        <div className="study-hero__copy">
          <div className="study-hero__meta">
            <p className="study-eyebrow">{book?.testament === 'OT' ? 'Old Testament' : 'New Testament'}</p>
            <button type="button" className="theme-toggle" onClick={navigateToHome}>
              Home
            </button>
          </div>
          <h1>{chapterTitle}</h1>
          <p className="study-hero__subtitle">Connected teaching and chapter study</p>
        </div>

        <div className="study-hero__card">
          <p className="study-card__label">This chapter</p>
          <strong>
            {sermons.length} sermon{sermons.length === 1 ? '' : 's'}
          </strong>
          <div className="study-progress mt-3">
            <p>
              {notes.length} saved note{notes.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
      </section>

      <section className="study-layout">
        <section className="study-main study-layout__full">
          <ChapterContextPanel
            bookOrd={route.bookOrd}
            chapterOrd={route.chapterOrd}
            tagNames={tagNameMap}
            showNotes={false}
          />
        </section>

        <section className="study-panel scripture-panel study-layout__full">
          {loadingScripture ? (
            <div className="empty-state">
              <p>Loading scripture…</p>
            </div>
          ) : scripture ? (
            <ChapterVerseStudy scripture={scripture} notes={notes} />
          ) : (
            <div className="empty-state">
              <div className="study-panel__heading">
                <div>
                  <h2>{chapterTitle}</h2>
                </div>
                <div className="study-panel__heading-aside">
                  <span className="study-chapter-study-label">Chapter study</span>
                </div>
              </div>
              <h3>Scripture coming soon</h3>
              <p>Verse text for this chapter is not bundled yet.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}
