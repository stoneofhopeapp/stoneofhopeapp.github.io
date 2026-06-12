import { useEffect, useRef } from 'react'
import {
  bibleBookOptions,
  countChapterContent,
  openTagsRoute,
} from '../browseData'
import { chapterNumbersForBook } from '../bibleBooks'
import { openStudyChapter } from '../studyNavigation'

type BibleBooksPanelProps = {
  bookOrd?: number
}

function ChapterGridInline({ bookOrd }: { bookOrd: number }) {
  const chapters = chapterNumbersForBook(bookOrd)

  return (
    <div className="library-bible-book-item__chapters">
      <p className="library-panel__hint">Pick a chapter to open its book chapter page.</p>
      <div className="library-bible-chapter-grid">
        {chapters.map((chapter) => {
          const { sermons, notes } = countChapterContent(bookOrd, chapter)
          const hasContent = sermons + notes > 0

          return (
            <button
              key={chapter}
              type="button"
              className={`library-bible-chapter-cell${hasContent ? ' has-content' : ''}`}
              onClick={(event) => {
                event.stopPropagation()
                openStudyChapter(bookOrd, chapter)
              }}
            >
              <span className="library-bible-chapter-cell__num">{chapter}</span>
              {hasContent ? (
                <span className="library-bible-chapter-cell__counts">
                  {sermons > 0 ? `${sermons} sermon${sermons === 1 ? '' : 's'}` : null}
                  {sermons > 0 && notes > 0 ? ' · ' : null}
                  {notes > 0 ? `${notes} note${notes === 1 ? '' : 's'}` : null}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function scrollBookIntoView(node: HTMLDivElement | null) {
  node?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function BookAccordionList({ expandedBookOrd }: { expandedBookOrd?: number }) {
  const activeBookRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (expandedBookOrd == null) return

    const timer = window.setTimeout(() => {
      scrollBookIntoView(activeBookRef.current)
    }, 80)

    return () => window.clearTimeout(timer)
  }, [expandedBookOrd])

  useEffect(() => {
    const handleScrollRequest = (event: Event) => {
      const bookOrd = (event as CustomEvent<{ bookOrd: number }>).detail?.bookOrd
      if (bookOrd == null || bookOrd !== expandedBookOrd) return

      window.setTimeout(() => {
        scrollBookIntoView(activeBookRef.current)
      }, 80)
    }

    window.addEventListener('soh:scroll-to-bible-book', handleScrollRequest)
    return () => window.removeEventListener('soh:scroll-to-bible-book', handleScrollRequest)
  }, [expandedBookOrd])

  return (
    <div className="library-bible__books">
      <p className="library-panel__hint">
        All 66 books — tap a chapter to see sermons and Bible study.
      </p>
      <div className="library-bible-book-list" role="list">
        {bibleBookOptions.map((book) => {
          const isExpanded = book.bookOrd === expandedBookOrd

          return (
            <div
              key={book.bookOrd}
              ref={isExpanded ? activeBookRef : undefined}
              id={isExpanded ? `bible-book-${book.bookOrd}` : undefined}
              role="listitem"
              className={`library-bible-book-item${isExpanded ? ' is-expanded' : ''}`}
            >
              <button
                type="button"
                className={`library-bible-book-row${isExpanded ? ' is-active' : ''}`}
                aria-expanded={isExpanded}
                onClick={() => {
                  if (isExpanded) {
                    openTagsRoute({ view: 'bible' })
                    return
                  }
                  openTagsRoute({ view: 'bible', bookOrd: book.bookOrd })
                }}
              >
                <span className="library-bible-book-row__testament">{book.testament}</span>
                <span className="library-bible-book-row__name">{book.name}</span>
                <span className="library-bible-book-row__meta">{book.chapterCount} chapters</span>
              </button>
              {isExpanded ? <ChapterGridInline bookOrd={book.bookOrd} /> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function BibleBooksPanel({ bookOrd }: BibleBooksPanelProps) {
  return <BookAccordionList expandedBookOrd={bookOrd} />
}
