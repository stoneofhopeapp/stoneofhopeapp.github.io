import { useEffect, useState } from 'react'
import type { SessionUser } from '../session'
import { WeekStrip } from './WeekStrip'
import { formatMonthLabel, getLast7Days } from '../calendarData'
import {
  formatTodayDate,
  greetingForHour,
  pickHomeFlowerImage,
  pickStarredReviewItems,
  recentSermons,
  recentStudyBooks,
  pickStudyAccentImage,
  resolveStudyHighlight,
  reviewKindName,
  type RecentSermon,
  type RecentStudyBook,
  type ReviewItem,
  type StudyHighlight,
} from '../homeData'
import { resolveVerseLines } from '../scriptureDisplay'
import { chapterHash } from '../chapterNavigation'
import { navigateToBibleBook } from '../appNavigation'
import { CardTitleRow, NumberedVerseText, ScriptureReference } from './ScriptureBlock'
import { ContentKindBadge, ReviewKindBadge } from './ContentKindBadge'
import { SermonMediaActions } from './SermonMediaActions'

type HomeDashboardProps = {
  user: SessionUser
}

const CAROUSEL_MS = 5500

function StarRow({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="home-review__stars" aria-label={`${level} star${level === 1 ? '' : 's'}`}>
      {'🌟'.repeat(level)}
    </span>
  )
}

function SermonCard({ sermon }: { sermon: RecentSermon }) {
  const chapterLink = chapterHash(sermon.bookOrd, sermon.chapterOrd)

  return (
    <article className="home-sermon-card">
      <a className="home-sermon-card__link" href={chapterLink}>
        <p className="home-sermon-card__date">{sermon.preachedOn.toUpperCase()}</p>
        <h3>{sermon.title}</h3>
        <p className="home-sermon-card__body">{sermon.excerpt}</p>
        <p className="home-sermon-card__passage">{sermon.passage}</p>
      </a>
      <SermonMediaActions sermonId={sermon.id} />
    </article>
  )
}

function StudyHighlightBlock({ highlight }: { highlight: StudyHighlight }) {
  if (highlight.kind === 'note') {
    const reference = `${highlight.bookName} ${highlight.chapterOrd}:${highlight.verseRange}`
    const verseLines = resolveVerseLines(
      highlight.verseText,
      highlight.verseRange,
      highlight.verseLines,
    )

    return (
      <div className="home-study-book-card__highlight">
        <ContentKindBadge kind="note" label="Study note" className="home-study-book-card__kind" />
        <CardTitleRow starred={highlight.starred}>
          <ScriptureReference reference={reference} inline />
        </CardTitleRow>
        <NumberedVerseText
          lines={verseLines}
          className="home-study-book-card__highlight-verse"
        />
        <p className="home-study-book-card__highlight-note">{highlight.body}</p>
      </div>
    )
  }

  const label = highlight.starred ? 'Starred verse' : 'Verse'

  return (
    <div className="home-study-book-card__highlight">
      <ContentKindBadge kind="verse" label={label} className="home-study-book-card__kind" />
      <CardTitleRow starred={highlight.starred}>
        <ScriptureReference reference={highlight.reference} inline />
      </CardTitleRow>
      <p className="home-study-book-card__highlight-body">{highlight.body}</p>
      {highlight.translation ? (
        <p className="home-study-book-card__highlight-translation">{highlight.translation}</p>
      ) : null}
    </div>
  )
}

function StudyBookCard({ book }: { book: RecentStudyBook }) {
  const highlight = resolveStudyHighlight(book)
  const [accentSrc] = useState(() => pickStudyAccentImage())
  const isChildAccent = accentSrc.includes('study-child-')

  return (
    <article className="home-study-book-card">
      <div className="home-study-book-card__book">
        <h3>{book.title}</h3>
        {book.subtitle ? (
          <p className="home-study-book-card__subtitle">{book.subtitle}</p>
        ) : null}
      </div>
      <div className="home-study-book-card__panel">
        <div className="home-study-book-card__panel-main">
          <StudyHighlightBlock highlight={highlight} />
        </div>
        <figure
          className={`home-study-book-card__flower${isChildAccent ? ' is-child' : ''}`}
          aria-hidden
        >
          <img src={accentSrc} alt="" />
        </figure>
      </div>
    </article>
  )
}

function ReviewSlide({ item }: { item: ReviewItem }) {
  return (
    <article className="home-review__slide" aria-live="polite">
      <div className="home-review__meta-row">
        <StarRow level={item.starLevel} />
        <ReviewKindBadge kind={item.kind} label={reviewKindName[item.kind]} />
      </div>
      <h2 className="home-review__title">{item.title}</h2>
      <p className="home-review__body">{item.body}</p>
      {item.meta ? <p className="home-review__meta">{item.meta}</p> : null}
    </article>
  )
}

export function HomeDashboard({ user }: HomeDashboardProps) {
  const displayName = user.displayName || user.email?.split('@')[0] || 'friend'
  const greeting = greetingForHour(new Date().getHours())
  const [greetingFirst, ...greetingTail] = greeting.split(' ')
  const todayLabel = formatTodayDate()
  const [flowerSrc] = useState(() => pickHomeFlowerImage())
  const [starredItems] = useState(() => pickStarredReviewItems())

  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || starredItems.length === 0) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % starredItems.length)
    }, CAROUSEL_MS)

    return () => window.clearInterval(timer)
  }, [paused, starredItems.length])

  const activeItem = starredItems[activeIndex]
  const weekDays = getLast7Days()
  const weekMonthLabel = weekDays[0]
    ? formatMonthLabel(weekDays[0].getFullYear(), weekDays[0].getMonth())
    : ''
  const latestSermon = recentSermons[0]

  return (
    <main className="home-shell">
      <section className="home-hero-card">
        <div className="home-welcome">
          <div className="home-welcome__top">
            <p className="home-welcome__date">{todayLabel}</p>
            <h1 className="home-welcome__greeting">
              <span className="home-welcome__greeting-line">{greetingFirst}</span>
              <span className="home-welcome__greeting-line">{greetingTail.join(' ')},</span>
              <span className="home-welcome__greeting-line">{displayName}.</span>
            </h1>
          </div>
          <figure className="home-welcome__flower">
            <img src={flowerSrc} alt="" />
          </figure>
        </div>

        <aside
          className="home-review"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="home-review__header">
            <p className="home-review__heading">My Starred</p>
            <button
              type="button"
              className="home-review__pause"
              onClick={() => setPaused((value) => !value)}
              aria-pressed={paused}
              aria-label={paused ? 'Resume starred carousel' : 'Pause starred carousel'}
            >
              <i className={`bi ${paused ? 'bi-play-fill' : 'bi-pause-fill'}`} aria-hidden />
            </button>
          </div>

          <div className="home-review__stage">
            {activeItem ? <ReviewSlide key={activeItem.id} item={activeItem} /> : null}
          </div>

          <div className="home-review__dots" role="tablist" aria-label="Starred items">
            {starredItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                className={`home-review__dot${index === activeIndex ? ' is-active' : ''}`}
                aria-selected={index === activeIndex}
                aria-label={`${reviewKindName[item.kind]}: ${item.title}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="home-section__heading">
          <h2>Last 7 days</h2>
          <span className="home-section__heading-title">{weekMonthLabel}</span>
        </div>
        <WeekStrip />
      </section>

      <section className="home-section">
        <div className="home-section__heading">
          <h2>Recent sermons</h2>
          {latestSermon ? (
            <a
              className="home-section__heading-link"
              href={`#tags/bible/${latestSermon.bookOrd}`}
              onClick={(event) => {
                event.preventDefault()
                navigateToBibleBook(latestSermon.bookOrd)
              }}
            >
              Browse by Books
            </a>
          ) : (
            <span>Browse by Books</span>
          )}
        </div>
        <div className="home-sermon-row">
          {recentSermons.map((sermon) => (
            <SermonCard key={sermon.id} sermon={sermon} />
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section__heading">
          <h2>Current Study</h2>
        </div>
        <div className="home-study-books">
          {recentStudyBooks.map((book) => (
            <StudyBookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </main>
  )
}
