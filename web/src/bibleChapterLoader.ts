import type { ScriptureChapter } from './studyData'
import { getScriptureForBookChapter } from './studyData'

type BibleChapterJson = {
  versionAbbr: string
  bookOrd: number
  bookName: string
  chapterOrd: number
  verses: { verseOrd: number; text: string }[]
}

function normalizeChapter(data: BibleChapterJson): ScriptureChapter {
  return {
    versionAbbr: data.versionAbbr,
    bookOrd: data.bookOrd,
    bookName: data.bookName,
    chapterOrd: data.chapterOrd,
    verses: data.verses,
  }
}

export async function loadBibleChapter(
  bookOrd: number,
  chapterOrd: number,
): Promise<ScriptureChapter | null> {
  try {
    const response = await fetch(`/bible/KJV/${bookOrd}/${chapterOrd}.json`)
    if (response.ok) {
      const data = (await response.json()) as BibleChapterJson
      return normalizeChapter(data)
    }
  } catch {
    // Fall through to bundled draft scripture.
  }

  return getScriptureForBookChapter(bookOrd, chapterOrd)?.primary ?? null
}
