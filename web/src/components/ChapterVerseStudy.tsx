import { useState } from 'react'
import { type BrowseItem } from '../browseData'
import { groupBrowseItemsByVerse, formatChapterStudyReference } from '../chapterNotes'
import type { ScriptureChapter } from '../studyData'
import { VerseStudyNote, verseOrdForItem } from './VerseStudyNote'
import { ScriptureReference } from './ScriptureBlock'

type ChapterVerseStudyProps = {
  scripture: ScriptureChapter
  notes: BrowseItem[]
}

export function ChapterVerseStudy({ scripture, notes }: ChapterVerseStudyProps) {
  const [hiddenNoteIds, setHiddenNoteIds] = useState<string[]>([])
  const visibleNotes = notes.filter((item) => !hiddenNoteIds.includes(item.id))
  const { byVerse, unassigned } = groupBrowseItemsByVerse(visibleNotes)
  const chapterReference = formatChapterStudyReference(scripture.bookName, scripture.chapterOrd)

  const handleDelete = (id: string) => {
    setHiddenNoteIds((current) => [...current, id])
  }

  return (
    <div className="verse-study">
      <div className="verse-study__title-row">
        <ScriptureReference reference={chapterReference} inline />
        <div className="verse-study__title-aside">
          <span className="study-chapter-study-label">Chapter study</span>
          <span className="verse-study__version">{scripture.versionAbbr}</span>
        </div>
      </div>

      <div className="verse-study__header">
        <span>Verse</span>
        <span>Scripture</span>
        <span>Notes</span>
      </div>

      <div className="verse-study__rows">
        {scripture.verses.map((verse) => {
          const verseNotes = byVerse.get(verse.verseOrd) ?? []

          return (
            <article key={verse.verseOrd} className="verse-row">
              <div className="verse-row__ord">{verse.verseOrd}</div>
              <div className="verse-row__scripture">
                <p>{verse.text}</p>
              </div>

              <div className="verse-row__notes">
                {verseNotes.length > 0 ? (
                  <div className="verse-note-list">
                    {verseNotes.map((item) => (
                      <VerseStudyNote
                        key={item.id}
                        item={item}
                        bookOrd={scripture.bookOrd}
                        chapterOrd={scripture.chapterOrd}
                        verseOrd={verseOrdForItem(item, verse.verseOrd)}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="verse-row__notes-empty">No notes on this verse yet.</p>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {unassigned.length > 0 ? (
        <div className="chapter-verse-study__unassigned">
          <h3>Chapter notes</h3>
          <div className="verse-note-list">
            {unassigned.map((item) => (
              <VerseStudyNote
                key={item.id}
                item={item}
                bookOrd={scripture.bookOrd}
                chapterOrd={scripture.chapterOrd}
                verseOrd={verseOrdForItem(item, 1)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
