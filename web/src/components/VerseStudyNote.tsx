import { useState } from 'react'
import { openTagsRoute, type BrowseItem } from '../browseData'
import { copyNoteToClipboard } from '../noteActions'
import { formatNoteVerseRangeLabel, parseVerseStart } from '../chapterNotes'
import { navigateToVerse } from '../verseNavigation'
import { NoteActionBar } from './NoteActionBar'
import { CardTitleRow } from './ScriptureBlock'

type VerseStudyNoteProps = {
  item: BrowseItem
  bookOrd: number
  chapterOrd: number
  verseOrd: number
  onDelete?: (id: string) => void
  showFullPage?: boolean
}

export function VerseStudyNote({
  item,
  bookOrd,
  chapterOrd,
  verseOrd,
  onDelete,
  showFullPage = true,
}: VerseStudyNoteProps) {
  const [copied, setCopied] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [starred, setStarred] = useState(Boolean(item.starred))

  const rangeLabel = formatNoteVerseRangeLabel(item.verseRange)
  const userContent = item.body?.trim()
  const showTitle = Boolean(item.title.trim())
  const showHeader = Boolean(rangeLabel || starred || showTitle)

  const handleCopy = async () => {
    const ok = await copyNoteToClipboard(item)
    if (!ok) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  const handleTag = () => {
    const firstTag = item.tagIds[0]
    if (firstTag) {
      openTagsRoute({ view: 'tags', tagId: firstTag })
    }
  }

  const handleFullPage = () => {
    navigateToVerse(bookOrd, chapterOrd, verseOrd)
  }

  return (
    <article className={`verse-note-card is-${item.kind}`}>
      {showHeader ? (
        <CardTitleRow starred={starred}>
          {rangeLabel ? (
            <span className="verse-note-card__range" aria-label={`Verses ${rangeLabel}`}>
              {rangeLabel}
            </span>
          ) : null}
          {!rangeLabel && showTitle ? (
            <h3 className="verse-note-card__title">{item.title}</h3>
          ) : null}
        </CardTitleRow>
      ) : null}

      {userContent ? <p className="note-card__body">{userContent}</p> : null}

      {commentsOpen ? (
        <div className="comment-thread comment-thread--placeholder">
          <p className="comment-thread__hint">Comments will sync with your app notes soon.</p>
        </div>
      ) : null}

      <div className="verse-note-card__footer">
        {item.dateLabel ? (
          <span className="verse-note-card__date">{item.dateLabel}</span>
        ) : (
          <span className="verse-note-card__date" />
        )}
        <NoteActionBar
          tagCount={item.tagIds.length}
          starred={starred}
          copied={copied}
          commentsOpen={commentsOpen}
          onCopy={handleCopy}
          onDelete={onDelete ? () => onDelete(item.id) : undefined}
          onComment={() => setCommentsOpen((open) => !open)}
          onStar={() => setStarred((value) => !value)}
          onTag={item.tagIds.length > 0 ? handleTag : undefined}
          onFullPage={showFullPage ? handleFullPage : undefined}
          showFullPage={showFullPage}
        />
      </div>
    </article>
  )
}

export function verseOrdForItem(item: BrowseItem, fallback: number): number {
  return parseVerseStart(item.verseRange) ?? fallback
}
