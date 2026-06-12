import type { VerseLine } from './scriptureDisplay'
import { bibleBooks, getBibleBook, type BibleBookMeta } from './bibleBooks'
import { mockNotesToBrowseItems, mockTagsToBrowseTags } from './mockDataAdapter'
import { countSermonsForChapter } from './sermonMockData'

export type BrowseItemKind = 'note' | 'prayer' | 'verse'

export type BrowseTag = {
  id: string
  name: string
}

export type BrowseItem = {
  id: string
  kind: BrowseItemKind
  title: string
  body: string
  verseText?: string
  verseLines?: VerseLine[]
  tagIds: string[]
  bookOrd?: number
  bookName?: string
  chapterOrd?: number
  verseRange?: string
  dateLabel?: string
  starred?: boolean
}

export type BibleBookOption = BibleBookMeta

export const browseItemKindLabels: Record<BrowseItemKind, string> = {
  note: 'Notes',
  prayer: 'Prayer',
  verse: 'Verse',
}

export const browseKindFilterOrder: BrowseItemKind[] = ['prayer', 'verse', 'note']

export function filterBrowseItemsByKind(
  items: BrowseItem[],
  kind: BrowseItemKind | null,
): BrowseItem[] {
  if (kind == null) return items
  return items.filter((item) => item.kind === kind)
}

export const browseTags: BrowseTag[] = [
  ...mockTagsToBrowseTags(),
  { id: 'living-hope', name: 'Living hope' },
  { id: 'faith', name: 'Faith' },
  { id: 'chapter-study', name: 'Chapter study' },
  { id: 'prayer', name: 'Prayer' },
  { id: 'riverside', name: 'Riverside' },
  { id: 'covenant', name: 'Covenant' },
  { id: 'worship', name: 'Worship' },
]

const personalBrowseItems: BrowseItem[] = [
  {
    id: 'note-living-hope',
    kind: 'note',
    title: '',
    verseText:
      'Blessed be the God and Father of our Lord Jesus Christ, who according to His abundant mercy has begotten us again to a living hope through the resurrection of Jesus Christ from the dead, to an inheritance incorruptible and undefiled and that does not fade away, reserved in heaven for you, who are kept by the power of God through faith for salvation ready to be revealed in the last time.',
    verseLines: [
      {
        number: 3,
        text: 'Blessed be the God and Father of our Lord Jesus Christ, who according to His abundant mercy has begotten us again to a living hope through the resurrection of Jesus Christ from the dead,',
      },
      {
        number: 4,
        text: 'to an inheritance incorruptible and undefiled and that does not fade away, reserved in heaven for you,',
      },
      {
        number: 5,
        text: 'who are kept by the power of God through faith for salvation ready to be revealed in the last time.',
      },
    ],
    body: '“Living hope” is not optimism—it is anchored in resurrection. God keeps the inheritance and keeps us.',
    tagIds: ['living-hope', 'chapter-study'],
    bookOrd: 60,
    bookName: '1 Peter',
    chapterOrd: 1,
    verseRange: '3–5',
    dateLabel: 'Jun 8',
    starred: true,
  },
  {
    id: 'note-trials-faith',
    kind: 'note',
    title: '',
    verseText:
      'In this you greatly rejoice, though now for a little while, if need be, you have been grieved by various trials, that the genuineness of your faith, being much more precious than gold that perishes, though it is tested by fire, may be found to praise, honor, and glory at the revelation of Jesus Christ,',
    verseLines: [
      {
        number: 6,
        text: 'In this you greatly rejoice, though now for a little while, if need be, you have been grieved by various trials,',
      },
      {
        number: 7,
        text: 'that the genuineness of your faith, being much more precious than gold that perishes, though it is tested by fire, may be found to praise, honor, and glory at the revelation of Jesus Christ,',
      },
    ],
    body: 'Peter does not treat suffering as an accident. Trials reveal whether faith is living or only inherited language.',
    tagIds: ['living-hope', 'chapter-study'],
    bookOrd: 60,
    bookName: '1 Peter',
    chapterOrd: 1,
    verseRange: '6–7',
    dateLabel: 'Jun 6',
    starred: true,
  },
  {
    id: 'note-set-hope',
    kind: 'note',
    title: '',
    verseText:
      'Therefore gird up the loins of your mind, be sober, and rest your hope fully upon the grace that is to be brought to you at the revelation of Jesus Christ;',
    body: '“Gird up the loins of your mind” sounds active. Hope in Peter is not passive waiting—it prepares the mind for obedience.',
    tagIds: ['living-hope', 'chapter-study'],
    bookOrd: 60,
    bookName: '1 Peter',
    chapterOrd: 1,
    verseRange: '13',
    dateLabel: 'Jun 4',
    starred: true,
  },
  {
    id: 'note-inheritance',
    kind: 'note',
    title: '',
    verseText:
      'Blessed be the God and Father of our Lord Jesus Christ, who according to His abundant mercy has begotten us again to a living hope through the resurrection of Jesus Christ from the dead, to an inheritance incorruptible and undefiled and that does not fade away, reserved in heaven for you,',
    verseLines: [
      {
        number: 3,
        text: 'Blessed be the God and Father of our Lord Jesus Christ, who according to His abundant mercy has begotten us again to a living hope through the resurrection of Jesus Christ from the dead,',
      },
      {
        number: 4,
        text: 'to an inheritance incorruptible and undefiled and that does not fade away, reserved in heaven for you,',
      },
    ],
    body: 'Peter links resurrection → living hope → inheritance. The inheritance is kept in heaven, but the hope is experienced now through faith.',
    tagIds: ['living-hope', 'chapter-study'],
    bookOrd: 60,
    bookName: '1 Peter',
    chapterOrd: 1,
    verseRange: '3–4',
    dateLabel: 'Jun 7',
  },
  {
    id: 'note-god-keeps',
    kind: 'note',
    title: '',
    verseText:
      'who are kept by the power of God through faith for salvation ready to be revealed in the last time.',
    body: 'God keeps the inheritance and keeps us.',
    tagIds: ['living-hope'],
    bookOrd: 60,
    bookName: '1 Peter',
    chapterOrd: 1,
    verseRange: '5',
    dateLabel: 'Jun 8',
  },
  {
    id: 'prayer-hope-trials',
    kind: 'prayer',
    title: '',
    verseText:
      'In this you greatly rejoice, though now for a little while, if need be, you have been grieved by various trials,',
    body: 'Lord, when the week feels heavy, remind me that my faith is being refined—not abandoned. Help me rejoice in the living hope You have already secured for me.',
    tagIds: ['prayer', 'living-hope'],
    bookOrd: 60,
    bookName: '1 Peter',
    chapterOrd: 1,
    verseRange: '6',
    dateLabel: 'Jun 7',
    starred: true,
  },
  {
    id: 'prayer-before-study',
    kind: 'prayer',
    title: 'Before study',
    body: 'Open my eyes to see Christ in the text. Let my notes become worship, not just information.',
    tagIds: ['prayer', 'chapter-study'],
    dateLabel: 'Jun 3',
    starred: true,
  },
  {
    id: 'prayer-grace-week',
    kind: 'prayer',
    title: 'Grace for the week',
    body: 'Lord, guide my attention before study and worship.',
    tagIds: ['prayer'],
    dateLabel: 'Jun 3',
  },
  {
    id: 'prayer-grace-today',
    kind: 'prayer',
    title: 'Grace for today',
    body: 'Father, give me enough grace for this day only. Keep my heart gentle, my mind clear, and my trust fixed on You.',
    tagIds: ['prayer', 'living-hope'],
    dateLabel: 'Jun 5',
  },
  {
    id: 'prayer-ebenezer',
    kind: 'prayer',
    title: '',
    verseText:
      'Then Samuel took a stone and set it up between Mizpah and Shen, and called its name Ebenezer, saying, “Thus far the LORD has helped us.”',
    body: 'Thus far the LORD has helped us.',
    tagIds: ['prayer', 'covenant'],
    bookOrd: 9,
    bookName: '1 Samuel',
    chapterOrd: 7,
    verseRange: '12',
    dateLabel: 'Jun 22',
  },
  {
    id: 'note-weekly-reflection',
    kind: 'note',
    title: 'Weekly reflection',
    body: 'What trial most needs to be seen through God’s perspective?',
    tagIds: ['chapter-study', 'living-hope'],
    dateLabel: 'Jun 15',
  },
  {
    id: 'verse-peter-1-3-4',
    kind: 'verse',
    title: '',
    verseText:
      'Blessed be the God and Father of our Lord Jesus Christ, who according to His abundant mercy has begotten us again to a living hope through the resurrection of Jesus Christ from the dead, to an inheritance incorruptible and undefiled and that does not fade away, reserved in heaven for you,',
    verseLines: [
      {
        number: 3,
        text: 'Blessed be the God and Father of our Lord Jesus Christ, who according to His abundant mercy has begotten us again to a living hope through the resurrection of Jesus Christ from the dead,',
      },
      {
        number: 4,
        text: 'to an inheritance incorruptible and undefiled and that does not fade away, reserved in heaven for you,',
      },
    ],
    body: '',
    tagIds: ['living-hope'],
    bookOrd: 60,
    bookName: '1 Peter',
    chapterOrd: 1,
    verseRange: '3–4',
    dateLabel: 'Jun 1',
    starred: true,
  },
  {
    id: 'verse-romans-8-28',
    kind: 'verse',
    title: '',
    verseText:
      'And we know that all things work together for good to those who love God, to those who are the called according to His purpose.',
    body: '',
    tagIds: ['living-hope', 'faith'],
    bookOrd: 45,
    bookName: 'Romans',
    chapterOrd: 8,
    verseRange: '28',
    starred: true,
  },
  {
    id: 'verse-psalm-46-10',
    kind: 'verse',
    title: '',
    verseText:
      'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth!',
    body: '',
    tagIds: ['prayer'],
    bookOrd: 19,
    bookName: 'Psalms',
    chapterOrd: 46,
    verseRange: '10',
  },
]

const browseItems: BrowseItem[] = [...mockNotesToBrowseItems(), ...personalBrowseItems]

export const bibleBookOptions: BibleBookOption[] = bibleBooks

export function getBrowseTag(tagId: string): BrowseTag | undefined {
  return browseTags.find((tag) => tag.id === tagId)
}

export function countItemsForTag(tagId: string): number {
  return browseItems.filter((item) => item.tagIds.includes(tagId)).length
}

export function getItemsForTag(tagId: string): BrowseItem[] {
  return browseItems.filter((item) => item.tagIds.includes(tagId))
}

export function getItemsForChapter(bookOrd: number, chapterOrd: number): BrowseItem[] {
  return browseItems.filter(
    (item) => item.bookOrd === bookOrd && item.chapterOrd === chapterOrd,
  )
}

export function countNotesForChapter(bookOrd: number, chapterOrd: number): number {
  return getItemsForChapter(bookOrd, chapterOrd).length
}

export function countChapterContent(bookOrd: number, chapterOrd: number): {
  sermons: number
  notes: number
} {
  return {
    sermons: countSermonsForChapter(bookOrd, chapterOrd),
    notes: countNotesForChapter(bookOrd, chapterOrd),
  }
}

export function getChaptersWithItems(bookOrd: number): number[] {
  const chapters = new Set<number>()
  for (const item of browseItems) {
    if (item.bookOrd === bookOrd && item.chapterOrd != null) {
      chapters.add(item.chapterOrd)
    }
  }
  return [...chapters].sort((a, b) => a - b)
}

export function getBookByOrd(bookOrd: number): BibleBookOption | undefined {
  return getBibleBook(bookOrd)
}

export function formatScriptureRef(item: BrowseItem): string | null {
  if (!item.bookName || item.chapterOrd == null) return null
  if (item.verseRange && item.verseRange.includes('–')) {
    return `${item.bookName} ${item.chapterOrd}:${item.verseRange}`
  }
  if (item.verseRange && /^\d/.test(item.verseRange)) {
    return `${item.bookName} ${item.chapterOrd}:${item.verseRange}`
  }
  if (item.verseRange) {
    return item.verseRange
  }
  return `${item.bookName} ${item.chapterOrd}`
}

export type TagsRoute =
  | { view: 'tags' }
  | { view: 'tags'; tagId: string }
  | { view: 'bible' }
  | { view: 'bible'; bookOrd: number; chapterOrd?: number }

export function readTagsRouteFromHash(): TagsRoute {
  const hash = window.location.hash.replace(/^#/, '')

  const bibleMatch = hash.match(/^tags\/bible\/(\d+)(?:\/(\d+))?$/)
  if (bibleMatch) {
    const bookOrd = Number(bibleMatch[1])
    const chapterOrd = bibleMatch[2] ? Number(bibleMatch[2]) : undefined
    return { view: 'bible', bookOrd, chapterOrd }
  }

  if (hash === 'tags/bible' || hash.startsWith('tags/bible?')) {
    return { view: 'bible' }
  }

  const tagMatch = hash.match(/^tags\/([a-z0-9-]+)$/)
  if (tagMatch?.[1] && tagMatch[1] !== 'bible') {
    return { view: 'tags', tagId: tagMatch[1] }
  }

  return { view: 'tags' }
}

export function openTagsRoute(route: TagsRoute) {
  if (route.view === 'tags') {
    window.location.hash =
      'tagId' in route && route.tagId ? `tags/${route.tagId}` : 'tags'
    return
  }

  if ('bookOrd' in route && route.bookOrd != null) {
    if (route.chapterOrd != null) {
      window.location.hash = `tags/bible/${route.bookOrd}/${route.chapterOrd}`
    } else {
      window.location.hash = `tags/bible/${route.bookOrd}`
    }
    return
  }

  window.location.hash = 'tags/bible'
}
