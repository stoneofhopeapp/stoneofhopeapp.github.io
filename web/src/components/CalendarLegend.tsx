import {
  calendarActivityLabels,
  calendarMarkerOrder,
} from '../calendarData'

type CalendarLegendProps = {
  className?: string
}

export function CalendarLegend({ className = 'calendar-month__legend' }: CalendarLegendProps) {
  return (
    <ul className={className}>
      <li>
        <span className="calendar-month__legend-swatch" aria-hidden />
        {calendarActivityLabels.sermon}
      </li>
      {calendarMarkerOrder.map((kind) => (
        <li key={kind}>
          <span className={`calendar-month__marker is-${kind}`} aria-hidden />
          {calendarActivityLabels[kind]}
        </li>
      ))}
    </ul>
  )
}
