export type ReviewItemKind = 'verse' | 'prayer' | 'note'

export type ReviewItem = {
  id: string
  kind: ReviewItemKind
  starLevel: 1 | 2 | 3
  title: string
  body: string
  meta?: string
}

export const reviewKindName: Record<ReviewItemKind, string> = {
  verse: 'Bible verse',
  prayer: 'Prayer',
  note: 'Note',
}

export type SermonMediaLinks = {
  video?: string
  audio?: string
  pdf?: string
  notes?: string
}

export type RecentSermon = {
  id: string
  title: string
  speaker: string
  church: string
  preachedOn: string
  passage: string
  excerpt: string
  media: SermonMediaLinks
}

export type StudyHighlight =
  | {
      kind: 'note'
      passage: string
      body: string
    }
  | {
      kind: 'verse'
      reference: string
      body: string
      starred?: boolean
      translation?: string
    }

export type RecentStudyBook = {
  id: string
  title: string
  subtitle?: string
  currentChapter: string
  highlight?: StudyHighlight
}

export const starredReviewPool: ReviewItem[] = [
  {
    id: 'star-verse-1',
    kind: 'verse',
    starLevel: 3,
    title: '1 Peter 1:3–4',
    body: 'Blessed be the God and Father of our Lord Jesus Christ, who according to His abundant mercy has begotten us again to a living hope through the resurrection of Jesus Christ from the dead, to an inheritance incorruptible and undefiled and that does not fade away, reserved in heaven for you.',
    meta: 'NKJV',
  },
  {
    id: 'star-prayer-1',
    kind: 'prayer',
    starLevel: 2,
    title: 'Hope in trials',
    body: 'Lord, when the week feels heavy, remind me that my faith is being refined—not abandoned. Help me rejoice in the living hope You have already secured for me.',
    meta: 'Prayed on Jun 7',
  },
  {
    id: 'star-note-1',
    kind: 'note',
    starLevel: 1,
    title: 'Inheritance is future, but hope is present',
    body: 'Peter links resurrection → living hope → inheritance. The inheritance is kept in heaven, but the hope is experienced now through faith. That is why trials do not cancel the hope—they prove it.',
    meta: '1 Peter 1 · Chapter study',
  },
  {
    id: 'star-verse-2',
    kind: 'verse',
    starLevel: 2,
    title: '1 Samuel 7:12',
    body: 'Then Samuel took a stone and set it up between Mizpah and Shen, and called its name Ebenezer, saying, “Thus far the LORD has helped us.”',
    meta: 'NKJV',
  },
  {
    id: 'star-verse-3',
    kind: 'verse',
    starLevel: 3,
    title: 'Romans 8:28',
    body: 'And we know that all things work together for good to those who love God, to those who are the called according to His purpose.',
    meta: 'NKJV',
  },
  {
    id: 'star-prayer-2',
    kind: 'prayer',
    starLevel: 3,
    title: 'Grace for today',
    body: 'Father, give me enough grace for this day only. Keep my heart gentle, my mind clear, and my trust fixed on You.',
    meta: 'Prayed on Jun 5',
  },
  {
    id: 'star-note-2',
    kind: 'note',
    starLevel: 2,
    title: 'Trials prove faith',
    body: 'Peter does not treat suffering as an accident. Trials reveal whether faith is living or only inherited language.',
    meta: '1 Peter 1 · v. 7',
  },
  {
    id: 'star-verse-4',
    kind: 'verse',
    starLevel: 1,
    title: 'Psalm 46:10',
    body: 'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth!',
    meta: 'NKJV',
  },
  {
    id: 'star-prayer-3',
    kind: 'prayer',
    starLevel: 1,
    title: 'Before study',
    body: 'Open my eyes to see Christ in the text. Let my notes become worship, not just information.',
    meta: 'Prayed on Jun 3',
  },
  {
    id: 'star-note-3',
    kind: 'note',
    starLevel: 3,
    title: 'Set hope fully',
    body: '“Gird up the loins of your mind” sounds active. Hope in Peter is not passive waiting—it prepares the mind for obedience.',
    meta: '1 Peter 1 · v. 13',
  },
]

const STARRED_CAROUSEL_COUNT = 4

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return hash
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const shuffled = [...items]
  let state = Math.abs(seed) || 1

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    state = (state * 1103515245 + 12345) & 0x7fffffff
    const j = state % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

/** Picks a fresh starred set on each page open, with the day mixed into the shuffle. */
export function pickStarredReviewItems(now = new Date(), count = STARRED_CAROUSEL_COUNT): ReviewItem[] {
  const dateKey = now.toISOString().slice(0, 10)
  const seed = hashString(`${dateKey}:${Math.random().toString(36)}`)
  return seededShuffle(starredReviewPool, seed).slice(0, count)
}

export const recentSermons: RecentSermon[] = [
  {
    id: 'sermon-1',
    title: 'A Living Hope',
    speaker: 'Pastor John',
    church: 'Riverside Calvary Chapel',
    preachedOn: 'June 1, 2026',
    passage: '1 Peter 1:1–9',
    excerpt:
      'Peter writes to scattered believers and begins with praise—not circumstances. The living hope flows from Christ’s resurrection.',
    media: { video: '#', audio: '#', pdf: '#', notes: '#' },
  },
  {
    id: 'sermon-2',
    title: 'Faith Tested by Fire',
    speaker: 'Pastor John',
    church: 'Riverside Calvary Chapel',
    preachedOn: 'May 25, 2026',
    passage: '1 Peter 1:6–9',
    excerpt:
      'Trials are not a sign of abandonment. They reveal the genuineness of faith and prepare us for glory.',
    media: { video: '#', audio: '#', pdf: '#', notes: '#' },
  },
  {
    id: 'sermon-3',
    title: 'Ebenezer: Thus Far',
    speaker: 'Guest Speaker',
    church: 'Riverside Calvary Chapel',
    preachedOn: 'May 18, 2026',
    passage: '1 Samuel 7:12',
    excerpt:
      'Samuel raises a stone of remembrance. Spiritual memory strengthens present obedience.',
    media: { video: '#', notes: '#' },
  },
]

export const recentStudyBooks: RecentStudyBook[] = [
  {
    id: '1-peter',
    title: '彼得前书',
    subtitle: 'A five-chapter journey in hope, holiness, and steady faith',
    currentChapter: 'Chapter 1',
    highlight: {
      kind: 'note',
      passage: 'vv. 3–5',
      body: '“Living hope” is not optimism—it is anchored in resurrection. God keeps the inheritance and keeps us.',
    },
  },
]

const defaultStudyVerse: StudyHighlight = {
  kind: 'verse',
  reference: '1 Peter 1:3',
  body: 'Blessed be the God and Father of our Lord Jesus Christ, who according to His abundant mercy has begotten us again to a living hope through the resurrection of Jesus Christ from the dead.',
  translation: 'NKJV',
}

export function resolveStudyHighlight(book: RecentStudyBook): StudyHighlight {
  return book.highlight ?? defaultStudyVerse
}

export const studyAccentImages = [
  '/assets/img/flowers/study-flower-a.png',
  '/assets/img/flowers/study-flower-d.png',
  '/assets/img/flowers/study-flower-e.png',
  '/assets/img/flowers/study-leaf-b.png',
  '/assets/img/flowers/study-leaf-c.png',
  '/assets/img/flowers/study-leaf-d.png',
  '/assets/img/flowers/study-child-reading.png',
  '/assets/img/flowers/study-child-thinking.png',
] as const

export function pickStudyAccentImage(): string {
  const index = Math.floor(Math.random() * studyAccentImages.length)
  return studyAccentImages[index] ?? studyAccentImages[0]
}

export const homeFlowerImages = [
  '/assets/img/flowers/flower-1.png',
  '/assets/img/flowers/flower-2.png',
  '/assets/img/flowers/flower-3.png',
  '/assets/img/flowers/flower-4.png',
] as const

export function greetingForHour(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function pickHomeFlowerImage(): string {
  const index = Math.floor(Math.random() * homeFlowerImages.length)
  return homeFlowerImages[index] ?? homeFlowerImages[0]
}

export function formatTodayDate(now = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now)
}
