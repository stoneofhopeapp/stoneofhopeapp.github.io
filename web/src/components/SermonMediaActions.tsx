import { getSermonById, sermonVideoUrl } from '../sermonDetailsData'
import { navigateToSermonDetails } from '../appNavigation'
import type { RiversideSermonMock } from '../sermonMockData'

type SermonMediaActionsProps = {
  sermonId: string
  showNotesButton?: boolean
  className?: string
}

const mediaLinks = [
  { key: 'video', label: 'Video', icon: 'bi-play-fill', getHref: sermonVideoUrl },
  { key: 'audio', label: 'Audio', icon: 'bi-volume-up-fill', getHref: (s: RiversideSermonMock) => s.audioUrl },
  { key: 'pdf', label: 'PDF', icon: 'bi-file-earmark-pdf', getHref: (s: RiversideSermonMock) => s.pdfUrl },
] as const

export function SermonMediaActions({
  sermonId,
  showNotesButton = true,
  className = 'home-sermon-card__actions',
}: SermonMediaActionsProps) {
  const sermon = getSermonById(sermonId)
  if (!sermon) return null

  const links = mediaLinks
    .map(({ key, label, icon, getHref }) => {
      const href = getHref(sermon)
      return href ? { key, label, icon, href } : null
    })
    .filter(Boolean) as { key: string; label: string; icon: string; href: string }[]

  if (links.length === 0 && !showNotesButton) return null

  return (
    <div className={className}>
      {links.map((link) => (
        <a
          key={link.key}
          className="home-sermon-chip"
          href={link.href}
          target="_blank"
          rel="noreferrer"
        >
          <i className={`bi ${link.icon}`} aria-hidden />
          {link.label}
        </a>
      ))}
      {showNotesButton ? (
        <a
          className="home-sermon-chip"
          href={`#sermon/${sermon.id}`}
          onClick={(event) => {
            event.preventDefault()
            navigateToSermonDetails(sermon.id)
          }}
        >
          <i className="bi bi-journal-text" aria-hidden />
          Notes
        </a>
      ) : null}
    </div>
  )
}
