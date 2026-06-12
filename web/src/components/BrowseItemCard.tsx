import { formatScriptureRef, browseItemKindLabels, type BrowseItem } from '../browseData'
import { resolveVerseLines } from '../scriptureDisplay'
import { BrowseKindBadge } from './ContentKindBadge'
import { CardTitleRow, NumberedVerseText, ScriptureReference } from './ScriptureBlock'

type BrowseItemCardProps = {
  item: BrowseItem
  showTags?: boolean
  tagNames?: Record<string, string>
}

export function BrowseItemCard({ item, showTags = false, tagNames = {} }: BrowseItemCardProps) {
  const scriptureRef = formatScriptureRef(item)
  const verseText = item.verseText?.trim()
  const userContent = item.body?.trim()
  const showTitle = !verseText && Boolean(item.title.trim())
  const verseLines = verseText ? resolveVerseLines(verseText, item.verseRange, item.verseLines) : []
  const showVerseContent = verseLines.length > 0
  const showRefInKindBadge = showVerseContent && Boolean(scriptureRef)
  const kindBadgeLabel = showRefInKindBadge
    ? scriptureRef!
    : browseItemKindLabels[item.kind]
  const showRefInTitle = Boolean(scriptureRef) && !showRefInKindBadge
  const showHeaderRow = showTitle || showRefInTitle || Boolean(item.starred)

  return (
    <article
      className={`browse-item-card is-${item.kind}`}
      aria-label={item.title.trim() || scriptureRef || undefined}
    >
      <BrowseKindBadge
        kind={item.kind}
        label={kindBadgeLabel}
        className={`browse-item-card__kind${showRefInKindBadge ? ' browse-item-card__kind--ref' : ''}`}
      />
      {showHeaderRow ? (
        <CardTitleRow starred={item.starred}>
          {showTitle ? <h3>{item.title}</h3> : null}
          {showRefInTitle ? <ScriptureReference reference={scriptureRef} inline /> : null}
        </CardTitleRow>
      ) : null}
      {verseLines.length > 0 ? (
        <>
          <NumberedVerseText lines={verseLines} className="browse-item-card__verse" />
          {userContent ? <p className="browse-item-card__body">{userContent}</p> : null}
        </>
      ) : (
        <>
          {userContent ? <p className="browse-item-card__body">{userContent}</p> : null}
        </>
      )}
      <div className="browse-item-card__footer">
        {item.dateLabel ? <span className="browse-item-card__date">{item.dateLabel}</span> : null}
        {showTags && item.tagIds.length > 0 ? (
          <div className="browse-item-card__tags">
            {item.tagIds.map((tagId) => (
              <span key={tagId} className="browse-item-card__tag">
                {tagNames[tagId] ?? tagId}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}
