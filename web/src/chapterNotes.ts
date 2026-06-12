import type { BrowseItem } from './browseData'

export function parseVerseStart(verseRange?: string): number | null {
  if (!verseRange) return null
  const match = verseRange.match(/^(\d+)/)
  return match ? Number(match[1]) : null
}

export function isMultiVerseRange(verseRange?: string): boolean {
  if (!verseRange?.trim()) return false
  return /[–\-,]/.test(verseRange)
}

/** Verse range only (e.g. "3–5") — shown on the starting verse when note spans multiple verses. */
export function formatNoteVerseRangeLabel(verseRange?: string): string | null {
  if (!isMultiVerseRange(verseRange)) return null
  return verseRange!.trim()
}

export function formatChapterStudyReference(bookName: string, chapterOrd: number): string {
  return `${bookName} ${chapterOrd}`.toUpperCase()
}

export function groupBrowseItemsByVerse(items: BrowseItem[]): {
  byVerse: Map<number, BrowseItem[]>
  unassigned: BrowseItem[]
} {
  const byVerse = new Map<number, BrowseItem[]>()
  const unassigned: BrowseItem[] = []

  for (const item of items) {
    const verseStart = parseVerseStart(item.verseRange)
    if (verseStart == null) {
      unassigned.push(item)
      continue
    }

    const current = byVerse.get(verseStart) ?? []
    current.push(item)
    byVerse.set(verseStart, current)
  }

  return { byVerse, unassigned }
}
