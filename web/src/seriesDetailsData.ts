import { mockRiversideSeries, type MockSeries } from './mockData'
import { allSermonMocks, type RiversideSermonMock } from './sermonMockData'

export function getSeriesById(seriesId: string): MockSeries | undefined {
  return mockRiversideSeries.find((series) => series.id === seriesId)
}

export function getSermonsForSeries(seriesId: string): RiversideSermonMock[] {
  return allSermonMocks
    .filter((sermon) => sermon.seriesId === seriesId)
    .sort((a, b) => b.preachedOn.localeCompare(a.preachedOn))
}

export function seriesDetailsRoute(seriesId: string): string {
  return `#series/${seriesId}`
}
