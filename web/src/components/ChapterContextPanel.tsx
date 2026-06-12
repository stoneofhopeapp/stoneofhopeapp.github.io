import { getItemsForChapter } from '../browseData'
import { getBibleBook } from '../bibleBooks'
import { getSermonsForChapter } from '../sermonMockData'
import { BrowseItemCard } from './BrowseItemCard'
import { SermonBrowseCard } from './SermonBrowseCard'

type ChapterContextPanelProps = {
  bookOrd: number
  chapterOrd: number
  tagNames?: Record<string, string>
  showNotes?: boolean
}

export function ChapterContextPanel({
  bookOrd,
  chapterOrd,
  tagNames = {},
  showNotes = true,
}: ChapterContextPanelProps) {
  const book = getBibleBook(bookOrd)
  const sermons = getSermonsForChapter(bookOrd, chapterOrd)
  const notes = getItemsForChapter(bookOrd, chapterOrd)

  if (!book) return null

  return (
    <section className="study-panel chapter-context-panel">
      <div className="study-panel__heading">
        <div>
          <p className="chapter-card__eyebrow">{book.name}</p>
          <h2>Chapter {chapterOrd}</h2>
        </div>
      </div>

      {sermons.length > 0 ? (
        <div className="chapter-context-panel__block">
          <h3>Sermons on this chapter</h3>
          <div className="library-item-list">
            {sermons.map((sermon) => (
              <SermonBrowseCard key={sermon.id} sermon={sermon} />
            ))}
          </div>
        </div>
      ) : null}

      {showNotes && notes.length > 0 ? (
        <div className="chapter-context-panel__block">
          <h3>Your notes &amp; prayers</h3>
          <div className="library-item-list">
            {notes.map((item) => (
              <BrowseItemCard key={item.id} item={item} showTags tagNames={tagNames} />
            ))}
          </div>
        </div>
      ) : null}

      {sermons.length === 0 && (!showNotes || notes.length === 0) ? (
        <p className="library-empty chapter-context-panel__empty">
          No sermons or saved notes for this chapter yet.
        </p>
      ) : null}
    </section>
  )
}
