import { getActivitiesForDate, type CalendarActivity, type CalendarActivityKind } from './calendarData'
import type { ContentKind } from './contentTypeIcons'
import { mockNotes, mockNotesLinkedToSermon } from './mockData'
import { allSermonMocks, preachedOnToDateKey, type RiversideSermonMock } from './sermonMockData'

export type DaySummaryListItem = {
  id: string
  title: string
  subtitle?: string
  noteCount?: number
  audioUrl?: string
  videoUrl?: string
  pdfUrl?: string
}

export type DaySummarySection = {
  id: string
  iconKind: ContentKind
  title: string
  count: number
  items: DaySummaryListItem[]
}

function sermonDisplayTitle(sermon: RiversideSermonMock): string {
  const passage = sermon.chapterRange.trim()
  const name = sermon.title.trim()
  if (passage && name) return `${passage} — ${name}`
  return passage || name
}

function sermonVideoUrl(sermon: RiversideSermonMock): string | undefined {
  if (sermon.youtubeId?.trim()) {
    return `https://www.youtube.com/watch?v=${sermon.youtubeId.trim()}`
  }
  return sermon.videoUrl
}

function noteMatchesDate(noteCreatedAt: string, dateKey: string): boolean {
  return noteCreatedAt.slice(0, 10) === dateKey
}

function starredNotesOnDate(dateKey: string) {
  return mockNotes.filter(
    (note) => (note.starLevel ?? 0) > 0 && noteMatchesDate(note.updatedAt, dateKey),
  )
}

function ongoingPrayersOnDate(dateKey: string) {
  return mockNotes.filter(
    (note) =>
      note.noteType === 'prayer' &&
      note.isOngoing === true &&
      (note.calendarDay === dateKey || noteMatchesDate(note.createdAt, dateKey)),
  )
}

function activitiesOfKind(activities: CalendarActivity[], kind: CalendarActivityKind) {
  return activities.filter((activity) => activity.kind === kind)
}

function activityToListItem(activity: CalendarActivity, index: number, kind: string): DaySummaryListItem {
  return {
    id: `${kind}-${index}-${activity.title}`,
    title: activity.title,
    subtitle: activity.meta ?? activity.body,
  }
}

export function buildDaySummarySections(dateKey: string): DaySummarySection[] {
  const activities = getActivitiesForDate(dateKey)
  const sections: DaySummarySection[] = []

  const sermons = allSermonMocks.filter((sermon) => preachedOnToDateKey(sermon.preachedOn) === dateKey)
  if (sermons.length > 0) {
    sections.push({
      id: 'sermons',
      iconKind: 'sermon',
      title: 'Sermons',
      count: sermons.length,
      items: sermons.map((sermon) => ({
        id: sermon.id,
        title: sermonDisplayTitle(sermon),
        noteCount: mockNotesLinkedToSermon(sermon.id).length,
        audioUrl: sermon.audioUrl,
        videoUrl: sermonVideoUrl(sermon),
        pdfUrl: sermon.pdfUrl,
      })),
    })
  }

  const starred = starredNotesOnDate(dateKey)
  if (starred.length > 0) {
    sections.push({
      id: 'starred',
      iconKind: 'starred',
      title: 'Starred',
      count: starred.length,
      items: starred.map((note) => ({
        id: note.id,
        title: note.content.slice(0, 72),
        subtitle: note.refKey ?? undefined,
      })),
    })
  }

  const studyActivities = activitiesOfKind(activities, 'study')
  if (studyActivities.length > 0) {
    sections.push({
      id: 'bibleVerses',
      iconKind: 'study',
      title: 'Bible Verses',
      count: studyActivities.length,
      items: studyActivities.map((activity, index) => activityToListItem(activity, index, 'study')),
    })
  }

  const prayerActivities = activitiesOfKind(activities, 'prayer')
  if (prayerActivities.length > 0) {
    sections.push({
      id: 'prayers',
      iconKind: 'prayer',
      title: 'Prayers',
      count: prayerActivities.length,
      items: prayerActivities.map((activity, index) => activityToListItem(activity, index, 'prayer')),
    })
  }

  const ongoing = ongoingPrayersOnDate(dateKey)
  if (ongoing.length > 0) {
    sections.push({
      id: 'ongoingPrayers',
      iconKind: 'ongoingPrayer',
      title: 'Ongoing Prayers',
      count: ongoing.length,
      items: ongoing.map((note) => ({
        id: note.id,
        title: note.content.slice(0, 80),
      })),
    })
  }

  const noteActivities = activitiesOfKind(activities, 'note')
  if (noteActivities.length > 0) {
    sections.push({
      id: 'notes',
      iconKind: 'note',
      title: 'Notes',
      count: noteActivities.length,
      items: noteActivities.map((activity, index) => activityToListItem(activity, index, 'note')),
    })
  }

  return sections
}

export function formatSummaryHeading(dateKey: string): string {
  const date = new Date(`${dateKey}T12:00:00`)
  const label = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
  return `Summary for ${label}`
}
