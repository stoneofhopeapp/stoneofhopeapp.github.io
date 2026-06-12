import type { BrowseItemKind } from './browseData'
import type { CalendarActivityKind } from './calendarData'
import type { ReviewItemKind } from './homeData'

export type ContentKind =
  | 'sermon'
  | 'prayer'
  | 'note'
  | 'verse'
  | 'study'
  | 'starred'
  | 'ongoingPrayer'

export const contentKindIcons: Record<ContentKind, string> = {
  sermon: '📖',
  prayer: '🌿',
  note: '📝',
  verse: '✝️',
  study: '✝️',
  starred: '⭐️',
  ongoingPrayer: '✨',
}

export const contentKindLabels: Record<ContentKind, string> = {
  sermon: 'Sermon',
  prayer: 'Prayer',
  note: 'Note',
  verse: 'Verse',
  study: 'Study',
  starred: 'Starred',
  ongoingPrayer: 'Ongoing Prayer',
}

export function browseKindIcon(kind: BrowseItemKind): string {
  return contentKindIcons[kind === 'verse' ? 'verse' : kind]
}

export function reviewKindIcon(kind: ReviewItemKind): string {
  return contentKindIcons[kind === 'verse' ? 'verse' : kind]
}

export function calendarActivityIcon(kind: CalendarActivityKind): string {
  if (kind === 'study') return contentKindIcons.study
  return contentKindIcons[kind]
}
