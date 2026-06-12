import type { BrowseItemKind } from '../browseData'
import type { CalendarActivityKind } from '../calendarData'
import {
  browseKindIcon,
  calendarActivityIcon,
  contentKindIcons,
  contentKindLabels,
  reviewKindIcon,
  type ContentKind,
} from '../contentTypeIcons'
import type { ReviewItemKind } from '../homeData'

type ContentKindBadgeProps = {
  kind: ContentKind
  label?: string
  showLabel?: boolean
  className?: string
}

export function ContentKindBadge({
  kind,
  label,
  showLabel = true,
  className = '',
}: ContentKindBadgeProps) {
  const text = label ?? contentKindLabels[kind]

  return (
    <span className={`content-kind-badge${className ? ` ${className}` : ''}`}>
      <span className="content-kind-badge__icon" aria-hidden>
        {contentKindIcons[kind]}
      </span>
      {showLabel ? <span className="content-kind-badge__label">{text}</span> : null}
    </span>
  )
}

export function BrowseKindBadge({
  kind,
  label,
  showLabel = true,
  className = '',
}: {
  kind: BrowseItemKind
  label?: string
  showLabel?: boolean
  className?: string
}) {
  const contentKind = kind === 'verse' ? 'verse' : kind

  return (
    <ContentKindBadge
      kind={contentKind}
      label={label}
      showLabel={showLabel}
      className={className}
    />
  )
}

export function ReviewKindBadge({
  kind,
  label,
  showLabel = true,
  className = '',
}: {
  kind: ReviewItemKind
  label?: string
  showLabel?: boolean
  className?: string
}) {
  const contentKind = kind === 'verse' ? 'verse' : kind

  return (
    <ContentKindBadge
      kind={contentKind}
      label={label}
      showLabel={showLabel}
      className={className}
    />
  )
}

export function CalendarActivityBadge({
  kind,
  label,
  showLabel = true,
  className = '',
}: {
  kind: CalendarActivityKind
  label?: string
  showLabel?: boolean
  className?: string
}) {
  const contentKind: ContentKind =
    kind === 'study' ? 'study' : kind === 'sermon' ? 'sermon' : kind

  return (
    <ContentKindBadge
      kind={contentKind}
      label={label}
      showLabel={showLabel}
      className={className}
    />
  )
}

export { browseKindIcon, calendarActivityIcon, reviewKindIcon }
