import { useEffect, useState } from 'react'
import {
  calendarActivityLabels,
  formatDateKey,
  formatDayHeading,
  formatMonthLabel,
  getActivitiesForDate,
  getActivityKindsForDate,
  getMonthGrid,
  parseDateKey,
  readCalendarDateFromHash,
  type CalendarActivity,
  type CalendarActivityKind,
} from '../calendarData'

const dotOrder: CalendarActivityKind[] = ['sermon', 'prayer', 'note', 'study']

function ActivityCard({ activity }: { activity: CalendarActivity }) {
  return (
    <article className={`calendar-summary__card is-${activity.kind}`}>
      <p className="calendar-summary__kind">{calendarActivityLabels[activity.kind]}</p>
      <h3>{activity.title}</h3>
      {activity.meta ? <p className="calendar-summary__meta">{activity.meta}</p> : null}
      {activity.body ? <p className="calendar-summary__body">{activity.body}</p> : null}
    </article>
  )
}

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
  const activities = getActivitiesForDate(selectedDate)

  const selectDate = (dateKey: string) => {
    setSelectedDate(dateKey)
    window.location.hash = `calendar/${dateKey}`
  }

  const shiftMonth = (delta: number) => {
    const anchor = new Date(visibleMonth.year, visibleMonth.month + delta, 1, 12, 0, 0, 0)
    setVisibleMonth({ year: anchor.getFullYear(), month: anchor.getMonth() })
  }

  return (
    <main className="calendar-shell">
      <section className="calendar-panel">
        <div className="calendar-panel__header">
          <button type="button" className="calendar-panel__nav" onClick={() => shiftMonth(-1)} aria-label="Previous month">
            <i className="bi bi-chevron-left" aria-hidden />
          </button>
          <h1>{formatMonthLabel(visibleMonth.year, visibleMonth.month)}</h1>
          <button type="button" className="calendar-panel__nav" onClick={() => shiftMonth(1)} aria-label="Next month">
            <i className="bi bi-chevron-right" aria-hidden />
          </button>
        </div>

        <div className="calendar-month__weekdays" aria-hidden>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="calendar-month__grid" role="grid" aria-label="Month view">
          {monthCells.map((day, index) => {
            if (!day) {
              return <span key={`empty-${index}`} className="calendar-month__empty" />
            }

            const dateKey = formatDateKey(day)
            const kinds = getActivityKindsForDate(dateKey)
            const isSelected = dateKey === selectedDate
            const isToday = dateKey === todayKey

            return (
              <button
                key={dateKey}
                type="button"
                role="gridcell"
                className={`calendar-month__day${isSelected ? ' is-selected' : ''}${isToday ? ' is-today' : ''}`}
                onClick={() => selectDate(dateKey)}
                aria-selected={isSelected}
                aria-label={formatDayHeading(dateKey)}
              >
                <span className="calendar-month__daynum">{day.getDate()}</span>
                <span className="calendar-month__dots" aria-hidden={kinds.length === 0}>
                  {dotOrder
                    .filter((kind) => kinds.includes(kind))
                    .map((kind) => (
                      <span key={kind} className={`calendar-month__dot is-${kind}`} />
                    ))}
                </span>
              </button>
            )
          })}
        </div>

        <ul className="calendar-month__legend">
          {dotOrder.map((kind) => (
            <li key={kind}>
              <span className={`calendar-month__dot is-${kind}`} aria-hidden />
              {calendarActivityLabels[kind]}
            </li>
          ))}
        </ul>
      </section>

      <section className="calendar-summary">
        <h2>{formatDayHeading(selectedDate)}</h2>
        {activities.length > 0 ? (
          <div className="calendar-summary__list">
            {activities.map((activity, index) => (
              <ActivityCard key={`${selectedDate}-${activity.kind}-${index}`} activity={activity} />
            ))}
          </div>
        ) : (
          <p className="calendar-summary__empty">Nothing recorded for this day yet.</p>
        )}
      </section>
    </main>
  )
}
