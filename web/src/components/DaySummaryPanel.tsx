import { useState } from 'react'
import {
  buildDaySummarySections,
  formatSummaryHeading,
  type DaySummaryListItem,
  type DaySummarySection,
} from '../daySummaryData'
import { contentKindIcons } from '../contentTypeIcons'

type DaySummaryPanelProps = {
  dateKey: string
}

function MediaRow({ item }: { item: DaySummaryListItem }) {
  const links = [
    { key: 'audio', label: 'Audio', icon: 'bi-headphones', href: item.audioUrl },
    { key: 'video', label: 'Video', icon: 'bi-play-btn-fill', href: item.videoUrl },
    { key: 'pdf', label: 'PDF', icon: 'bi-file-earmark-pdf', href: item.pdfUrl },
  ].filter((link) => Boolean(link.href))

  if (links.length === 0) return null

  return (
    <div className="day-summary__media">
      {links.map((link) => (
        <a
          key={link.key}
          className={`day-summary__media-btn is-${link.key}`}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={link.label}
        >
          <i className={`bi ${link.icon}`} aria-hidden />
        </a>
      ))}
    </div>
  )
}

function SummaryListRow({ item }: { item: DaySummaryListItem }) {
  return (
    <div className="day-summary__row">
      <div className="day-summary__row-main">
        <p className="day-summary__row-title">{item.title}</p>
        {item.subtitle ? <p className="day-summary__row-subtitle">{item.subtitle}</p> : null}
        <MediaRow item={item} />
      </div>
      {item.noteCount != null && item.noteCount > 0 ? (
        <span className="day-summary__row-notes">{item.noteCount} Notes</span>
      ) : null}
    </div>
  )
}

function SummarySectionCard({ section }: { section: DaySummarySection }) {
  const [expanded, setExpanded] = useState(section.id === 'sermons' && section.items.length > 0)
  const expandable = section.items.length > 0

  return (
    <article className={`day-summary__section is-${section.id}`}>
      {expandable ? (
        <>
          <button
            type="button"
            className="day-summary__header"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
          >
            <span className="day-summary__icon" aria-hidden>
              {contentKindIcons[section.iconKind]}
            </span>
            <span className="day-summary__header-text">
              <span className="day-summary__header-line">
                <span className="day-summary__header-title">{section.title}</span>
                <span className="day-summary__header-count">{section.count}</span>
              </span>
            </span>
            <i className={`bi bi-chevron-down day-summary__chevron${expanded ? ' is-open' : ''}`} aria-hidden />
          </button>
          {expanded ? (
            <div className="day-summary__items">
              {section.items.map((item, index) => (
                <div key={item.id}>
                  {index > 0 ? <div className="day-summary__divider" role="separator" /> : null}
                  <SummaryListRow item={item} />
                </div>
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <div className="day-summary__header day-summary__header--static">
          <span className="day-summary__icon" aria-hidden>
            {contentKindIcons[section.iconKind]}
          </span>
          <span className="day-summary__header-text">
            <span className="day-summary__header-line">
              <span className="day-summary__header-title">{section.title}</span>
              <span className="day-summary__header-count">{section.count}</span>
            </span>
          </span>
        </div>
      )}
    </article>
  )
}

export function DaySummaryPanel({ dateKey }: DaySummaryPanelProps) {
  const sections = buildDaySummarySections(dateKey)

  return (
    <section className="day-summary">
      <div className="day-summary__heading-row">
        <h2>{formatSummaryHeading(dateKey)}</h2>
      </div>

      {sections.length > 0 ? (
        <div className="day-summary__sections">
          {sections.map((section) => (
            <SummarySectionCard key={section.id} section={section} />
          ))}
        </div>
      ) : (
        <p className="day-summary__empty">Nothing recorded for this day yet.</p>
      )}
    </section>
  )
}
