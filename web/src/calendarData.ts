import { mockNotesToCalendarDayRecords } from './mockDataAdapter'
import {
  allSermonMocks,
  preachedOnToDateKey,
  sermonCalendarDateKeys,
  sermonToCalendarActivity,
} from './sermonMockData'

export { sermonCalendarDateKeys }

export type CalendarActivityKind = 'sermon' | 'prayer' | 'note' | 'study'

export type CalendarActivity = {
  kind: CalendarActivityKind
  title: string
  body?: string
  meta?: string
}

export type DayRecord = {
  date: string
  activities: CalendarActivity[]
}

export const calendarActivityLabels: Record<CalendarActivityKind, string> = {
  sermon: 'Sermon',
  prayer: 'Prayer',
  note: 'Note',
  study: 'Study',
}

export const calendarMarkerOrder: CalendarActivityKind[] = ['prayer', 'note', 'study']

export const calendarWeekdayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const

export function formatWeekdayLetter(date: Date): string {
  return calendarWeekdayLetters[date.getDay()]
}

const personalDayRecords: DayRecord[] = [
  {
    date: '2026-06-03',
    activities: [
      { kind: 'prayer', title: 'Grace for the week', body: 'Lord, guide my attention before study and worship.' },
    ],
  },
  {
    date: '2026-06-04',
    activities: [
      { kind: 'study', title: '1 Peter 1', meta: 'vv. 13', body: 'Gird up the mind for action—hope should change how I think.' },
      { kind: 'note', title: 'Set hope fully', body: 'Hope in Peter is active preparation, not passive waiting.' },
    ],
  },
  {
    date: '2026-06-05',
    activities: [
      { kind: 'prayer', title: 'Before study', body: 'Open my eyes to see Christ in the text.' },
    ],
  },
  {
    date: '2026-06-06',
    activities: [
      { kind: 'study', title: '1 Peter 1', meta: 'v. 7', body: 'Faith more precious than gold. Trials expose what is genuine.' },
      { kind: 'note', title: 'Trials prove faith', body: 'Suffering reveals whether faith is living or inherited language.' },
    ],
  },
  {
    date: '2026-06-07',
    activities: [
      { kind: 'prayer', title: 'Hope in trials', body: 'Remind me that faith is being refined—not abandoned.' },
      { kind: 'note', title: 'Living hope', body: 'Resurrection → living hope → inheritance kept in heaven.' },
    ],
  },
  {
    date: '2026-06-08',
    activities: [
      { kind: 'study', title: '1 Peter 1', meta: 'vv. 3–5', body: 'Living hope is anchored in resurrection, not optimism.' },
      { kind: 'note', title: 'God keeps us', body: 'God keeps the inheritance and keeps us.' },
    ],
  },
  {
    date: '2026-06-02',
    activities: [{ kind: 'prayer', title: 'Sunday gratitude', body: 'Thank You for the living hope secured in Christ.' }],
  },
  {
    date: '2026-06-09',
    activities: [
      { kind: 'study', title: '1 Peter 1', meta: 'Chapter 1', body: 'Continue chapter study and starred review.' },
      { kind: 'prayer', title: 'Morning quiet', body: 'Let today’s study become worship, not only information.' },
    ],
  },
  {
    date: '2026-06-15',
    activities: [{ kind: 'note', title: 'Weekly reflection', body: 'What trial most needs to be seen through God’s perspective?' }],
  },
  {
    date: '2026-06-22',
    activities: [
      { kind: 'prayer', title: 'Mid-month prayer', body: 'Thus far the LORD has helped us.' },
      { kind: 'study', title: '1 Peter 2', meta: 'Preview', body: 'Living stones and priestly identity.' },
    ],
  },
]

function buildDayRecords(): DayRecord[] {
  const byDate = new Map<string, CalendarActivity[]>()

  for (const record of personalDayRecords) {
    byDate.set(record.date, [...record.activities])
  }

  for (const [dateKey, activities] of mockNotesToCalendarDayRecords()) {
    const existing = byDate.get(dateKey) ?? []
    byDate.set(dateKey, [...existing, ...activities])
  }

  for (const sermon of allSermonMocks) {
    const dateKey = preachedOnToDateKey(sermon.preachedOn)
    const existing = byDate.get(dateKey) ?? []
    byDate.set(dateKey, [...existing, sermonToCalendarActivity(sermon)])
  }

  return [...byDate.entries()]
    .map(([date, activities]) => ({ date, activities }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

const dayRecords = buildDayRecords()
const recordsByDate = new Map(dayRecords.map((record) => [record.date, record]))

export function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function getLast7Days(now = new Date()): Date[] {
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(now)
    day.setHours(12, 0, 0, 0)
    day.setDate(now.getDate() - (6 - index))
    return day
  })
}

export function getActivitiesForDate(dateKey: string): CalendarActivity[] {
  return recordsByDate.get(dateKey)?.activities ?? []
}

export function getActivityKindsForDate(dateKey: string): CalendarActivityKind[] {
  const kinds = getActivitiesForDate(dateKey).map((item) => item.kind)
  return [...new Set(kinds)]
}

export function getMonthGrid(year: number, month: number): Array<Date | null> {
  const first = new Date(year, month, 1)
  const startOffset = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: Array<Date | null> = []

  for (let i = 0; i < startOffset; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day, 12, 0, 0, 0))
  }

  return cells
}

export function formatMonthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    new Date(year, month, 1),
  )
}

export function formatDayHeading(dateKey: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(parseDateKey(dateKey))
}

export function formatWeekdayShort(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)
}

export function readCalendarDateFromHash(fallback = formatDateKey(new Date())): string {
  const match = window.location.hash.match(/^#calendar\/(\d{4}-\d{2}-\d{2})$/)
  return match?.[1] ?? fallback
}

export function openCalendarPage(dateKey: string) {
  window.location.hash = `calendar/${dateKey}`
}
