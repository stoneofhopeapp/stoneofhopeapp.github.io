import {
  calendarActivityLabels,
  formatDateKey,
  formatWeekdayShort,
  getActivityKindsForDate,
  getLast7Days,
  openCalendarPage,
  type CalendarActivityKind,
} from '../calendarData'

const markerOrder: CalendarActivityKind[] = ['prayer', 'note', 'study']

type WeekStripProps = {
  now?: Date
}

export function WeekStrip({ now = new Date() }: WeekStripProps) {
  const days = getLast7Days(now)
  const todayKey = formatDateKey(now)

  return (
    <div className="home-week-strip">
      <div className="home-week-strip__days">
        {days.map((day) => {
          const dateKey = formatDateKey(day)
          const kinds = getActivityKindsForDate(dateKey)
          const hasSermon = kinds.includes('sermon')
          const markerKinds = markerOrder.filter((kind) => kinds.includes(kind))
          const isToday = dateKey === todayKey

          return (
            <button
              key={dateKey}
              type="button"
              className={`home-week-strip__day${isToday ? ' is-today' : ''}${hasSermon ? ' has-sermon' : ''}`}
              onClick={() => openCalendarPage(dateKey)}
              aria-label={`${formatWeekdayShort(day)} ${day.getDate()}, open calendar`}
            >
              <span className="home-week-strip__weekday">{formatWeekdayShort(day)}</span>
              <span className="home-week-strip__date">{day.getDate()}</span>
              <span className="home-week-strip__dots" aria-hidden={markerKinds.length === 0}>
                {markerKinds.map((kind) => (
                  <span key={kind} className={`home-week-strip__dot is-${kind}`} />
                ))}
              </span>
            </button>
          )
        })}
      </div>

      <ul className="home-week-strip__legend">
        <li>
          <span className="home-week-strip__swatch" aria-hidden />
          {calendarActivityLabels.sermon}
        </li>
        {markerOrder.map((kind) => (
          <li key={kind}>
            <span className={`home-week-strip__dot is-${kind}`} aria-hidden />
            {calendarActivityLabels[kind]}
          </li>
        ))}
      </ul>
    </div>
  )
}
