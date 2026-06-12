import { navigateToChapter as navigateToChapterScreen } from './appNavigation'

export type ChapterRoute = {
  bookOrd: number
  chapterOrd: number
}

export function readChapterRouteFromHash(): ChapterRoute | null {
  const hash = window.location.hash.replace(/^#/, '')
  const match = hash.match(/^chapter\/(\d+)\/(\d+)$/)
  if (!match) return null

  return {
    bookOrd: Number(match[1]),
    chapterOrd: Number(match[2]),
  }
}

export function chapterHash(bookOrd: number, chapterOrd: number): string {
  return `#chapter/${bookOrd}/${chapterOrd}`
}

export function navigateToChapter(bookOrd: number, chapterOrd: number) {
  navigateToChapterScreen(bookOrd, chapterOrd)
}

export function openChapterFromHash(hash: string) {
  const match = hash.replace(/^#/, '').match(/^chapter\/(\d+)\/(\d+)$/)
  if (!match) return false
  navigateToChapter(Number(match[1]), Number(match[2]))
  return true
}
