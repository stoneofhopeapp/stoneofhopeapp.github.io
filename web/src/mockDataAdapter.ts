import { getBibleBook } from './bibleBooks'
import type { BrowseItem, BrowseItemKind, BrowseTag } from './browseData'
import type { CalendarActivity, CalendarActivityKind } from './calendarData'
import type { RecentSermon, ReviewItem, ReviewItemKind } from './homeData'
import {
  mockNotes,
  mockRiversideSermons,
  mockTags,
  type MockNote,
  type MockNoteType,
} from './mockData'
import { preachedOnToDateLabel } from './sermonMockData'

function isoToDateKey(iso: string): string {
  return iso.slice(0, 10)
}

function formatDateLabel(iso: string): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

function noteCalendarDay(note: MockNote): string {
  if (note.calendarDay) return note.calendarDay
  return isoToDateKey(note.createdAt)
}

function mockNoteToBrowseKind(noteType: MockNoteType): BrowseItemKind {
  switch (noteType) {
    case 'prayer':
      return 'prayer'
    case 'bibleVerse':
      return 'verse'
    default:
      return 'note'
  }
}

function verseRangeFromNote(note: MockNote): string | undefined {
  if (note.verseStart == null) return undefined
  if (note.verseEnd != null && note.verseEnd !== note.verseStart) {
    return `${note.verseStart}–${note.verseEnd}`
  }
  return String(note.verseStart)
}

function refKeyDisplay(note: MockNote): string | undefined {
  if (!note.bookOrd || !note.chapterOrd) return undefined
  const book = getBibleBook(note.bookOrd)
  const range = verseRangeFromNote(note)
  if (!book) return undefined
  return range ? `${book.name} ${note.chapterOrd}:${range}` : `${book.name} ${note.chapterOrd}`
}

function stripVersionSuffix(content: string): string {
  return content.replace(/\s*\[[A-Z]+\]\s*$/, '').trim()
}

function noteTitle(note: MockNote): string {
  switch (note.noteType) {
    case 'prayer':
      if (note.isOngoing) return 'Ongoing prayer'
      if (note.isAnswered) return 'Answered prayer'
      return 'Prayer'
    case 'sermonNote':
      return 'Sermon note'
    case 'personalGrowth':
      return 'Personal growth'
    case 'bibleVerse':
      return refKeyDisplay(note) ?? 'Bible verse'
    default:
      return ''
  }
}

export function mockNoteToBrowseItem(note: MockNote): BrowseItem {
  const book = note.bookOrd ? getBibleBook(note.bookOrd) : undefined
  const isVerse = note.noteType === 'bibleVerse'
  const verseText = isVerse ? stripVersionSuffix(note.content) : undefined
  const commentBody = note.comments?.[0]?.content?.trim()

  return {
    id: note.id,
    kind: mockNoteToBrowseKind(note.noteType),
    title: noteTitle(note),
    body: isVerse ? (commentBody ?? '') : note.content,
    verseText,
    tagIds: note.tagIds ?? [],
    bookOrd: note.bookOrd,
    bookName: book?.name,
    chapterOrd: note.chapterOrd,
    verseRange: verseRangeFromNote(note),
    dateLabel: formatDateLabel(note.updatedAt),
    starred: (note.starLevel ?? 0) > 0,
  }
}

export function mockNotesToBrowseItems(): BrowseItem[] {
  return mockNotes.map((note) => mockNoteToBrowseItem(note))
}

export function getBrowseItemsForSermon(sermonId: string): BrowseItem[] {
  return mockNotes
    .filter((note) => note.linkedSermonId === sermonId && note.noteType !== 'image')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((note) => mockNoteToBrowseItem(note))
}

export function mockTagsToBrowseTags(): BrowseTag[] {
  return mockTags.map((tag) => ({ id: tag.id, name: tag.name }))
}

function calendarKindForNote(note: MockNote): CalendarActivityKind {
  switch (note.noteType) {
    case 'prayer':
      return 'prayer'
    case 'bibleVerse':
      return 'study'
    case 'sermonNote':
      return 'note'
    default:
      return 'note'
  }
}

export function mockNoteToCalendarActivity(note: MockNote): CalendarActivity {
  const kind = calendarKindForNote(note)
  const ref = refKeyDisplay(note)
  let title = noteTitle(note)
  if (kind === 'note' && !title) title = 'Note'

  return {
    kind,
    title,
    meta: ref ?? (note.noteType === 'sermonNote' ? 'Sermon note' : undefined),
    body:
      note.noteType === 'bibleVerse' ? stripVersionSuffix(note.content) : note.content,
  }
}

export function mockNotesToCalendarDayRecords(): Map<string, CalendarActivity[]> {
  const byDate = new Map<string, CalendarActivity[]>()

  for (const note of mockNotes) {
    const dateKey = noteCalendarDay(note)
    const existing = byDate.get(dateKey) ?? []
    byDate.set(dateKey, [...existing, mockNoteToCalendarActivity(note)])
  }

  return byDate
}

export function mockStarredToReviewItems(): ReviewItem[] {
  return mockNotes
    .filter((note) => (note.starLevel ?? 0) > 0)
    .map((note) => {
      const kind: ReviewItemKind =
        note.noteType === 'prayer'
          ? 'prayer'
          : note.noteType === 'bibleVerse'
            ? 'verse'
            : 'note'

      const title = refKeyDisplay(note) ?? (noteTitle(note) || 'Note')
      const body =
        note.noteType === 'bibleVerse'
          ? stripVersionSuffix(note.content)
          : (note.comments?.[0]?.content ?? note.content)

      return {
        id: `star-${note.id}`,
        kind,
        starLevel: Math.min(3, Math.max(1, note.starLevel ?? 1)) as 1 | 2 | 3,
        title,
        body,
        meta: note.versionAbbr ?? formatDateLabel(note.updatedAt),
      }
    })
}

export function mockSermonsToRecentSermons(): RecentSermon[] {
  return [...mockRiversideSermons]
    .sort((a, b) => b.preachedOn.localeCompare(a.preachedOn))
    .map((sermon) => ({
      id: sermon.id,
      title: sermon.title,
      speaker: sermon.preacher,
      church: 'Riverside Calvary Chapel',
      preachedOn: preachedOnToDateLabel(sermon.preachedOn),
      passage: sermon.chapterRange,
      excerpt: sermon.intro,
      bookOrd: sermon.bookOrd ?? 1,
      chapterOrd: sermon.chapters[0] ?? 1,
      media: {
        video: sermon.videoUrl,
        audio: sermon.audioUrl,
        pdf: sermon.pdfUrl,
      },
    }))
}
