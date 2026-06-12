import { getBibleBook } from './bibleBooks'
import { navigateToChapter, navigateToStudyHome } from './appNavigation'
import {
  normalizeStudyBookOrd,
  normalizeStudyChapterOrd,
  STUDY_CONNECTED_BOOK_ORD,
  STUDY_PLACEHOLDER_CHAPTER_ORD,
  STUDY_PLACEHOLDER_CHAPTER_ID,
} from './studyData'

export type StudyRoute = {
  bookOrd?: number
  chapterOrd?: number
}

export function readStudyRouteFromHash(): StudyRoute {
  const hash = window.location.hash.replace(/^#/, '')
  const match = hash.match(/^study(?:\/(\d+)\/(\d+))?$/)
  if (!match?.[1] || !match[2]) return {}

  return {
    bookOrd: normalizeStudyBookOrd(Number(match[1])),
    chapterOrd: normalizeStudyChapterOrd(Number(match[1]), Number(match[2])),
  }
}

export function openStudyChapter(bookOrd: number, chapterOrd: number) {
  navigateToChapter(bookOrd, chapterOrd)
}

export function openStudyHome() {
  navigateToStudyHome()
}

export function resolveStudyChapterId(_bookOrd: number, _chapterOrd: number): string | null {
  return STUDY_PLACEHOLDER_CHAPTER_ID
}

export function formatStudyChapterLabel(_bookOrd: number, _chapterOrd: number): string {
  const book = getBibleBook(STUDY_CONNECTED_BOOK_ORD)
  return book ? `${book.name} ${STUDY_PLACEHOLDER_CHAPTER_ORD}` : '1 Peter 1'
}

export { STUDY_CONNECTED_BOOK_ORD, STUDY_PLACEHOLDER_CHAPTER_ORD, STUDY_PLACEHOLDER_CHAPTER_ID }
