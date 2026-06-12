import flashcardsJson from './data/flashcards.mock.json'
import notesJson from './data/notes.mock.json'
import riversideSeriesJson from './data/riverside-series.mock.json'
import riversideSermonsJson from './data/riverside-sermons.mock.json'
import tagsJson from './data/tags.mock.json'

/** Firestore / app-shaped note types for UI prototyping. */
export type MockNoteType =
  | 'note'
  | 'prayer'
  | 'flashCard'
  | 'bibleVerse'
  | 'personalGrowth'
  | 'sermonNote'
  | 'starred'
  | 'image'

export type MockNoteComment = {
  content: string
  createdAt: string
}

export type MockNote = {
  id: string
  noteType: MockNoteType
  content: string
  bookOrd?: number
  chapterOrd?: number
  chapterKey?: string
  verseStart?: number
  verseEnd?: number
  versionAbbr?: string
  refKey?: string
  createdAt: string
  updatedAt: string
  starLevel?: number
  isOngoing?: boolean
  isAnswered?: boolean
  answeredAt?: string
  calendarDay?: string
  linkedSermonId?: string
  tagIds?: string[]
  comments?: MockNoteComment[]
}

export type MockTag = {
  id: string
  name: string
}

export type MockFlashCard = {
  id: string
  bookOrd?: number
  chapterOrd?: number
  verseStart?: number
  verseEnd?: number
  versionAbbr?: string
  refKey?: string
  topic?: string
  content: string
  createdAt: string
  updatedAt: string
  isArchived?: boolean
}

export type MockSeries = {
  id: string
  churchKey: string
  title: string
  bookOrd: number | null
  startedOn: string
  isFinished: boolean
}

export const mockNotes = notesJson as MockNote[]
export const mockTags = tagsJson as MockTag[]
export const mockFlashcards = flashcardsJson as MockFlashCard[]
export const mockRiversideSeries = riversideSeriesJson as MockSeries[]
export { riversideSermonsJson as mockRiversideSermons }

export function mockTagById(tagId: string): MockTag | undefined {
  return mockTags.find((tag) => tag.id === tagId)
}

export function mockNotesForCalendarDay(calendarDay: string): MockNote[] {
  return mockNotes.filter((note) => note.calendarDay === calendarDay)
}

export function mockNotesLinkedToSermon(sermonId: string): MockNote[] {
  return mockNotes.filter((note) => note.linkedSermonId === sermonId)
}
