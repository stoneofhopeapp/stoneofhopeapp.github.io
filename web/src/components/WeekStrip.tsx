import {
  formatDateKey,
  formatWeekdayLetter,
  getActivityKindsForDate,
  getLast7Days,
  calendarMarkerOrder,
  openCalendarPage,
} from '../calendarData'
import { CalendarLegend } from './CalendarLegend'

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
          const markerKinds = calendarMarkerOrder.filter((kind) => kinds.includes(kind))
          const isToday = dateKey === todayKey
          const isWeekend = day.getDay() === 0 || day.getDay() === 6

          return (
            <button
              key={dateKey}
              type="button"
              className={[
                'home-week-strip__day',
                isToday ? 'is-today' : '',
                isWeekend ? 'is-weekend' : '',
                hasSermon ? 'has-sermon' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => openCalendarPage(dateKey)}
              aria-label={`${formatWeekdayLetter(day)} ${day.getDate()}, open calendar`}
            >
              <span className="home-week-strip__weekday">{formatWeekdayLetter(day)}</span>
              <span className="home-week-strip__date">{day.getDate()}</span>
              <span className="calendar-month__markers" aria-hidden={markerKinds.length === 0}>
                {markerKinds.map((kind) => (
                  <span key={kind} className={`calendar-month__marker is-${kind}`} />
                ))}
              </span>
            </button>
          )
        })}
      </div>

      <CalendarLegend className="home-week-strip__legend calendar-month__legend" />
    </div>
  )
}
