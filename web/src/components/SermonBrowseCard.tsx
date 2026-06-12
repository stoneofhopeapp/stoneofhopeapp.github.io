import type { RiversideSermonMock } from '../sermonMockData'
import { formatPreachedOnDate } from '../dateFormat'
import { SermonMediaActions } from './SermonMediaActions'

type SermonBrowseCardProps = {
  sermon: RiversideSermonMock
}

export function SermonBrowseCard({ sermon }: SermonBrowseCardProps) {
  return (
    <article className="sermon-browse-card">
      <div className="sermon-browse-card__head">
        <p className="sermon-browse-card__passage">{sermon.chapterRange}</p>
        {sermon.preachedOn ? (
          <span className="sermon-browse-card__date">{formatPreachedOnDate(sermon.preachedOn)}</span>
        ) : null}
      </div>
      <h3>{sermon.title}</h3>
      {sermon.preacher ? <p className="sermon-browse-card__preacher">{sermon.preacher}</p> : null}
      <p className="sermon-browse-card__intro">{sermon.intro}</p>
      <SermonMediaActions sermonId={sermon.id} className="sermon-browse-card__actions" />
    </article>
  )
}
