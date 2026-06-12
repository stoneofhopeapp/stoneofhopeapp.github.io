export type VerseLine = {
  number: number
  text: string
}

export function parseVerseRange(verseRange?: string): number[] {
  if (!verseRange?.trim()) return []

  const normalized = verseRange.replace(/[–—]/g, '-').trim()
  if (normalized.includes('-')) {
    const [startRaw, endRaw] = normalized.split('-')
    const start = Number.parseInt(startRaw.trim(), 10)
    const end = Number.parseInt(endRaw.trim(), 10)
    if (Number.isNaN(start) || Number.isNaN(end) || end < start) return []

    const numbers: number[] = []
    for (let n = start; n <= end; n += 1) numbers.push(n)
    return numbers
  }

  const single = Number.parseInt(normalized, 10)
  return Number.isNaN(single) ? [] : [single]
}

export function resolveVerseLines(
  verseText: string,
  verseRange?: string,
  verseLines?: VerseLine[],
): VerseLine[] {
  if (verseLines?.length) return verseLines

  const text = verseText.trim()
  if (!text) return []

  const numbers = parseVerseRange(verseRange)
  if (numbers.length === 1) {
    return [{ number: numbers[0], text }]
  }

  if (numbers.length > 1) {
    return [{ number: numbers[0], text }]
  }

  return [{ number: 0, text }]
}
