import { CANONICAL_STUDY_ROUTE } from './studyData'

export type AppScreen =
  | 'home'
  | 'study'
  | 'calendar'
  | 'tags'
  | 'chapter'
  | 'verse'
  | 'sermon'
  | 'series'
  | 'online-resources'

let syncAppScreen: ((screen: AppScreen) => void) | null = null

export function registerAppScreenSync(fn: ((screen: AppScreen) => void) | null) {
  syncAppScreen = fn
}

export function readAppScreenFromHash(): AppScreen {
  const hash = window.location.hash
  if (/^#chapter\/\d+\/\d+\/verse\/\d+$/.test(hash)) return 'verse'
  if (hash.startsWith('#sermon/')) return 'sermon'
  if (hash.startsWith('#series/')) return 'series'
  if (hash === '#online-resources') return 'online-resources'
  if (hash.startsWith('#chapter/')) return 'chapter'
  if (hash === '#study' || hash === '#study-workspace' || hash.startsWith('#study/')) {
    return 'study'
  }
  if (hash === '#calendar' || hash.startsWith('#calendar/')) return 'calendar'
  if (hash === '#tags' || hash.startsWith('#tags/')) return 'tags'
  return 'home'
}

function setAppHash(hashWithoutPrefix: string, screen: AppScreen) {
  syncAppScreen?.(screen)

  const current = window.location.hash.replace(/^#/, '')
  if (current === hashWithoutPrefix) return

  window.location.hash = hashWithoutPrefix
}

export function navigateToStudyChapter(_bookOrd: number, _chapterOrd: number) {
  const { bookOrd, chapterOrd } = CANONICAL_STUDY_ROUTE
  setAppHash(`study/${bookOrd}/${chapterOrd}`, 'study')
}

export function navigateToChapter(bookOrd: number, chapterOrd: number) {
  setAppHash(`chapter/${bookOrd}/${chapterOrd}`, 'chapter')
}

export function navigateToVerse(bookOrd: number, chapterOrd: number, verseOrd: number) {
  setAppHash(`chapter/${bookOrd}/${chapterOrd}/verse/${verseOrd}`, 'verse')
}

export function navigateToStudyHome() {
  setAppHash('study', 'study')
}

export function navigateToHome() {
  syncAppScreen?.('home')
  window.location.hash = ''
}

export function navigateToTags() {
  setAppHash('tags', 'tags')
}

export function navigateToOnlineResources() {
  setAppHash('online-resources', 'online-resources')
}

export function readSermonIdFromHash(): string | null {
  const match = window.location.hash.match(/^#sermon\/([^/?#]+)$/)
  return match?.[1] ?? null
}

export function navigateToSermonDetails(sermonId: string) {
  setAppHash(`sermon/${sermonId}`, 'sermon')
}

export function readSeriesIdFromHash(): string | null {
  const match = window.location.hash.match(/^#series\/([^/?#]+)$/)
  return match?.[1] ?? null
}

export function navigateToSeriesDetails(seriesId: string) {
  setAppHash(`series/${seriesId}`, 'series')
}

export function navigateToBibleBook(bookOrd: number) {
  const hash = `tags/bible/${bookOrd}`
  syncAppScreen?.('tags')

  const current = window.location.hash.replace(/^#/, '')
  if (current === hash) {
    window.dispatchEvent(new CustomEvent('soh:scroll-to-bible-book', { detail: { bookOrd } }))
    return
  }

  window.location.hash = hash
}

export function redirectLegacyTagsChapterFromHash(): boolean {
  const hash = window.location.hash.replace(/^#/, '')
  const match = hash.match(/^tags\/bible\/(\d+)\/(\d+)$/)
  if (!match) return false

  const bookOrd = Number(match[1])
  const chapterOrd = Number(match[2])
  navigateToChapter(bookOrd, chapterOrd)
  return true
}
