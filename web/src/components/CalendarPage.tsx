import { useEffect, useState } from 'react'
import {
  formatDateKey,
  formatDayHeading,
  formatMonthLabel,
  getActivityKindsForDate,
  getMonthGrid,
  calendarMarkerOrder,
  parseDateKey,
  readCalendarDateFromHash,
} from '../calendarData'
import { CalendarLegend } from './CalendarLegend'
import { DaySummaryPanel } from './DaySummaryPanel'

const weekdayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const

export function CalendarPage() {
  const todayKey = formatDateKey(new Date())
  const [selectedDate, setSelectedDate] = useState(() => readCalendarDateFromHash(todayKey))
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const seed = parseDateKey(readCalendarDateFromHash(todayKey))
    return { year: seed.getFullYear(), month: seed.getMonth() }
  })

  useEffect(() => {
    const syncFromHash = () => {
      const nextDate = readCalendarDateFromHash(todayKey)
      setSelectedDate(nextDate)
      const parsed = parseDateKey(nextDate)
      setVisibleMonth({ year: parsed.getFullYear(), month: parsed.getMonth() })
    }

    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [todayKey])

  const monthCells = getMonthGrid(visibleMonth.year, visibleMonth.month)
  const monthLabel = formatMonthLabel(visibleMonth.year, visibleMonth.month)

  const selectDate = (dateKey: string) => {
    setSelectedDate(dateKey)
    window.location.hash = `calendar/${dateKey}`
  }

  const goToToday = () => {
    selectDate(todayKey)
    const parsed = parseDateKey(todayKey)
    setVisibleMonth({ year: parsed.getFullYear(), month: parsed.getMonth() })
  }

  const shiftMonth = (delta: number) => {
    const anchor = new Date(visibleMonth.year, visibleMonth.month + delta, 1, 12, 0, 0, 0)
    setVisibleMonth({ year: anchor.getFullYear(), month: anchor.getMonth() })
  }

  return (
    <main className="calendar-shell">
      <section className="calendar-panel">
        <div className="calendar-panel__header">
          <div className="calendar-panel__header-leading">
            <button type="button" className="calendar-panel__nav" onClick={() => shiftMonth(-1)} aria-label="Previous month">
              <i className="bi bi-chevron-left" aria-hidden />
            </button>
            <button type="button" className="calendar-panel__today" onClick={goToToday}>
              Today
            </button>
          </div>
          <h1 className="calendar-panel__header-title">{monthLabel}</h1>
          <button type="button" className="calendar-panel__nav" onClick={() => shiftMonth(1)} aria-label="Next month">
            <i className="bi bi-chevron-right" aria-hidden />
          </button>
        </div>

        <div className="calendar-month__weekdays" aria-hidden>
          {weekdayLetters.map((label, index) => (
            <span key={`${label}-${index}`}>{label}</span>
          ))}
        </div>

        <div className="calendar-month__grid" role="grid" aria-label="Month view">
          {monthCells.map((day, index) => {
            if (!day) {
              return <span key={`empty-${index}`} className="calendar-month__empty" />
            }

            const dateKey = formatDateKey(day)
            const kinds = getActivityKindsForDate(dateKey)
            const hasSermon = kinds.includes('sermon')
            const markerKinds = calendarMarkerOrder.filter((kind) => kinds.includes(kind))
            const isSelected = dateKey === selectedDate
            const isToday = dateKey === todayKey
            const isWeekend = day.getDay() === 0 || day.getDay() === 6

            return (
              <button
                key={dateKey}
                type="button"
                role="gridcell"
                className={[
                  'calendar-month__day',
                  isSelected ? 'is-selected' : '',
                  isToday ? 'is-today' : '',
                  isWeekend ? 'is-weekend' : '',
                  hasSermon ? 'has-sermon' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => selectDate(dateKey)}
                aria-selected={isSelected}
                aria-label={formatDayHeading(dateKey)}
              >
                <span className="calendar-month__daynum">{day.getDate()}</span>
                <span className="calendar-month__markers" aria-hidden={markerKinds.length === 0}>
                  {markerKinds.map((kind) => (
                    <span key={kind} className={`calendar-month__marker is-${kind}`} />
                  ))}
                </span>
              </button>
            )
          })}
        </div>

        <CalendarLegend />
      </section>

      <DaySummaryPanel dateKey={selectedDate} />
    </main>
  )
}
