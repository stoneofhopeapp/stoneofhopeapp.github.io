import { navigateToVerse as navigateToVerseScreen } from './appNavigation'

export type VerseRoute = {
  bookOrd: number
  chapterOrd: number
  verseOrd: number
}

export function readVerseRouteFromHash(): VerseRoute | null {
  const hash = window.location.hash.replace(/^#/, '')
  const match = hash.match(/^chapter\/(\d+)\/(\d+)\/verse\/(\d+)$/)
  if (!match) return null

  return {
    bookOrd: Number(match[1]),
    chapterOrd: Number(match[2]),
    verseOrd: Number(match[3]),
  }
}

export function verseHash(bookOrd: number, chapterOrd: number, verseOrd: number): string {
  return `#chapter/${bookOrd}/${chapterOrd}/verse/${verseOrd}`
}

export function navigateToVerse(bookOrd: number, chapterOrd: number, verseOrd: number) {
  navigateToVerseScreen(bookOrd, chapterOrd, verseOrd)
}
