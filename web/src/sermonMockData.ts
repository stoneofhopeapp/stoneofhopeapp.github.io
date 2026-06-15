import riversideSermonsJson from './data/riverside-sermons.mock.json'
import { mockRiversideSeries, type MockSeries } from './mockData'
import type { CalendarActivity } from './calendarData'
import { formatPreachedOnDate } from './dateFormat'

export type RiversideSermonMock = {
  id: string
  churchKey: string
  preachedOn: string
  seriesId: string
  title: string
  preacher: string
  intro: string
  audioUrl?: string
  videoUrl?: string
  youtubeId?: string
  pdfUrl?: string
  book: string
  bookOrd: number | null
  chapterRange: string
  chapters: number[]
}

export const riversideSermonMocks = riversideSermonsJson as RiversideSermonMock[]

/** Home dashboard sermons shown on chapter pages alongside imported teaching. */
const connectedTeachingSermons: RiversideSermonMock[] = [
  {
    id: 'sermon-1',
    churchKey: 'riverside',
    preachedOn: '20260601',
    seriesId: 'home-living-hope',
    title: 'A Living Hope',
    preacher: 'Pastor John',
    intro:
      'Peter writes to scattered believers and begins with praise—not circumstances. The living hope flows from Christ’s resurrection.',
    book: '1 Peter',
    bookOrd: 60,
    chapterRange: '1 Peter 1:1–9',
    chapters: [1],
  },
  {
    id: 'sermon-2',
    churchKey: 'riverside',
    preachedOn: '20260525',
    seriesId: 'home-living-hope',
    title: 'Faith Tested by Fire',
    preacher: 'Pastor John',
    intro:
      'Trials are not a sign of abandonment. They reveal the genuineness of faith and prepare us for glory.',
    book: '1 Peter',
    bookOrd: 60,
    chapterRange: '1 Peter 1:6–9',
    chapters: [1],
  },
  {
    id: 'sermon-3',
    churchKey: 'riverside',
    preachedOn: '20260518',
    seriesId: 'home-ebenezer',
    title: 'Ebenezer: Thus Far',
    preacher: 'Guest Speaker',
    intro:
      'Samuel raises a stone of remembrance. Spiritual memory strengthens present obedience.',
    book: '1 Samuel',
    bookOrd: 9,
    chapterRange: '1 Samuel 7:12',
    chapters: [7],
  },
]

export const allSermonMocks = [...riversideSermonMocks, ...connectedTeachingSermons]

export function filterSermonsByChurchKeys(
  sermons: RiversideSermonMock[],
  churchKeys: string[],
): RiversideSermonMock[] {
  if (churchKeys.length === 0) return []
  const allowed = new Set(churchKeys)
  return sermons.filter((sermon) => allowed.has(sermon.churchKey))
}

/** Calendar-day keys (`yyyy-MM-dd`) that have at least one sermon activity. */
export function sermonCalendarDateKeys(): string[] {
  const dates = new Set(allSermonMocks.map((sermon) => preachedOnToDateKey(sermon.preachedOn)))
  return [...dates].sort()
}

export function preachedOnToDateKey(preachedOn: string): string {
  if (preachedOn.length !== 8) return preachedOn
  return `${preachedOn.slice(0, 4)}-${preachedOn.slice(4, 6)}-${preachedOn.slice(6, 8)}`
}

export function preachedOnToDateLabel(preachedOn: string): string {
  return formatPreachedOnDate(preachedOn)
}

export function sermonTagIds(sermon: RiversideSermonMock): string[] {
  const tags = new Set<string>(['riverside'])

  if (/covenant/i.test(sermon.title) || /samuel 7/i.test(sermon.chapterRange)) {
    tags.add('covenant')
  }
  if (/leader|deacon|church gets it right|requires/i.test(`${sermon.title} ${sermon.intro}`)) {
    tags.add('leadership')
  }
  if (/worship|order in/i.test(sermon.title)) {
    tags.add('worship')
  }
  if (/church/i.test(`${sermon.title} ${sermon.intro}`)) {
    tags.add('church')
  }

  return [...tags]
}

export function sermonToCalendarActivity(sermon: RiversideSermonMock): CalendarActivity {
  const preacher = sermon.preacher ? ` · ${sermon.preacher}` : ''
  return {
    kind: 'sermon',
    title: sermon.title,
    meta: `${sermon.chapterRange}${preacher}`,
    body: sermon.intro,
  }
}

export function sermonChapterOrd(sermon: RiversideSermonMock): number | undefined {
  return sermon.chapters[0]
}

export function sermonVerseRange(sermon: RiversideSermonMock): string | undefined {
  if (!sermon.chapterRange.includes(':')) return undefined
  return sermon.chapterRange.split(':').slice(1).join(':').trim()
}

export function getSermonsForChapter(
  bookOrd: number,
  chapterOrd: number,
  importedChurchKeys?: string[],
): RiversideSermonMock[] {
  const seen = new Set<string>()

  let sermons = allSermonMocks.filter(
    (sermon) => sermon.bookOrd === bookOrd && sermon.chapters.includes(chapterOrd),
  )

  if (importedChurchKeys) {
    sermons = filterSermonsByChurchKeys(sermons, importedChurchKeys)
  }

  return sermons
    .filter((sermon) => {
      if (seen.has(sermon.id)) return false
      seen.add(sermon.id)
      return true
    })
    .sort((a, b) => b.preachedOn.localeCompare(a.preachedOn))
}

export function getSeriesForChapter(
  bookOrd: number,
  chapterOrd: number,
  importedChurchKeys: string[],
): MockSeries[] {
  const sermons = getSermonsForChapter(bookOrd, chapterOrd, importedChurchKeys)
  const seriesIds = new Set(sermons.map((sermon) => sermon.seriesId))
  return mockRiversideSeries.filter((series) => seriesIds.has(series.id))
}

export function countSermonsForChapter(
  bookOrd: number,
  chapterOrd: number,
  importedChurchKeys?: string[],
): number {
  return getSermonsForChapter(bookOrd, chapterOrd, importedChurchKeys).length
}
