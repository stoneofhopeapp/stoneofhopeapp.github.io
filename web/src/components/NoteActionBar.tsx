type NoteActionBarProps = {
  tagCount?: number
  starred?: boolean
  starLevel?: 0 | 1 | 2 | 3
  copied?: boolean
  commentsOpen?: boolean
  onCopy?: () => void
  onDelete?: () => void
  onComment?: () => void
  onStar?: () => void
  onTag?: () => void
  onFullPage?: () => void
  showFullPage?: boolean
}

export function NoteActionBar({
  tagCount = 0,
  starred = false,
  starLevel = 0,
  copied = false,
  commentsOpen = false,
  onCopy,
  onDelete,
  onComment,
  onStar,
  onTag,
  onFullPage,
  showFullPage = true,
}: NoteActionBarProps) {
  const effectiveStars = starLevel > 0 ? starLevel : starred ? 1 : 0

  return (
    <div className="note-action-bar" role="toolbar" aria-label="Note actions">
      {onCopy ? (
        <button
          type="button"
          className={`note-action-btn note-action-btn--copy${copied ? ' is-active' : ''}`}
          aria-label={copied ? 'Copied' : 'Copy note'}
          title={copied ? 'Copied' : 'Copy'}
          onClick={onCopy}
        >
          <i className={`bi ${copied ? 'bi-files' : 'bi-files'}`} aria-hidden />
        </button>
      ) : null}

      {onDelete ? (
        <button
          type="button"
          className="note-action-btn note-action-btn--danger"
          aria-label="Delete note"
          title="Delete"
          onClick={onDelete}
        >
          <i className="bi bi-trash" aria-hidden />
        </button>
      ) : null}

      {onComment ? (
        <button
          type="button"
          className="note-action-btn note-action-btn--comment"
          aria-label={commentsOpen ? 'Hide comments' : 'Comments'}
          title={commentsOpen ? 'Hide comments' : 'Comments'}
          onClick={onComment}
        >
          <i className={`bi ${commentsOpen ? 'bi-chat-left-fill' : 'bi-chat-left'}`} aria-hidden />
        </button>
      ) : null}

      {onStar ? (
        <button
          type="button"
          className="note-action-btn note-action-btn--star"
          aria-label={effectiveStars > 0 ? `${effectiveStars} stars` : 'Star note'}
          title="Star"
          onClick={onStar}
        >
          {effectiveStars > 0 ? (
            <span className="note-action-btn__stars" aria-hidden>
              {'★'.repeat(effectiveStars)}
            </span>
          ) : (
            <i className="bi bi-star" aria-hidden />
          )}
        </button>
      ) : null}

      {onTag ? (
        <button
          type="button"
          className="note-action-btn note-action-btn--tag"
          aria-label={tagCount > 0 ? `${tagCount} tags` : 'Tags'}
          title="Tags"
          onClick={onTag}
        >
          <span className="note-action-btn__tag-icon">
            <i className={`bi ${tagCount > 0 ? 'bi-tag-fill' : 'bi-tag'}`} aria-hidden />
            {tagCount > 1 ? (
              <span className="note-action-btn__badge">{tagCount}</span>
            ) : null}
          </span>
        </button>
      ) : null}

      {showFullPage && onFullPage ? (
        <button
          type="button"
          className="note-action-btn note-action-btn--full-page"
          aria-label="Open full page"
          title="Full page"
          onClick={onFullPage}
        >
          <i className="bi bi-box-arrow-up-right" aria-hidden />
        </button>
      ) : null}
    </div>
  )
}
