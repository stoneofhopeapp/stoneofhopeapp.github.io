import { mockNotesLinkedToSermon, mockRiversideSeries, type MockNote, type MockSeries } from './mockData'
import { allSermonMocks, type RiversideSermonMock } from './sermonMockData'

export function getSermonById(sermonId: string): RiversideSermonMock | undefined {
  return allSermonMocks.find((sermon) => sermon.id === sermonId)
}

export function getSeriesForSermon(sermon: RiversideSermonMock): MockSeries | undefined {
  return mockRiversideSeries.find((series) => series.id === sermon.seriesId)
}

export function getLinkedNotesForSermon(sermonId: string): MockNote[] {
  return mockNotesLinkedToSermon(sermonId).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )
}

export function sermonVideoUrl(sermon: RiversideSermonMock): string | undefined {
  if (sermon.youtubeId?.trim()) {
    return `https://www.youtube.com/watch?v=${sermon.youtubeId.trim()}`
  }
  return sermon.videoUrl
}
