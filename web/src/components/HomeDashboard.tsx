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
  type SermonMediaLinks,
  type StudyHighlight,
} from '../homeData'

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

const sermonActionConfig: {
  key: keyof SermonMediaLinks
  label: string
  icon: string
}[] = [
  { key: 'video', label: 'Video', icon: 'bi-play-fill' },
  { key: 'audio', label: 'Audio', icon: 'bi-volume-up-fill' },
  { key: 'pdf', label: 'PDF', icon: 'bi-file-earmark-pdf' },
  { key: 'notes', label: 'Notes', icon: 'bi-journal-text' },
]

function SermonCard({ sermon }: { sermon: RecentSermon }) {
  const actions = sermonActionConfig.filter(({ key }) => Boolean(sermon.media[key]))

  return (
    <article className="home-sermon-card">
      <p className="home-sermon-card__date">{sermon.preachedOn.toUpperCase()}</p>
      <h3>{sermon.title}</h3>
      <p className="home-sermon-card__body">{sermon.excerpt}</p>
      {actions.length > 0 ? (
        <div className="home-sermon-card__actions">
          {actions.map(({ key, label, icon }) => (
            <a key={key} className="home-sermon-chip" href={sermon.media[key]}>
              <i className={`bi ${icon}`} aria-hidden />
              {label}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  )
}

function StudyHighlightBlock({ highlight }: { highlight: StudyHighlight }) {
  const label =
    highlight.kind === 'note'
      ? 'Note'
      : highlight.starred
        ? 'Starred verse'
        : 'Verse'

  const reference =
    highlight.kind === 'note' ? highlight.passage : highlight.reference

  return (
    <div className="home-study-book-card__highlight">
      <div className="home-study-book-card__highlight-meta">
        {highlight.kind === 'verse' && highlight.starred ? (
          <span className="home-study-book-card__highlight-stars" aria-hidden>
            🌟
          </span>
        ) : null}
        <p className="home-study-book-card__highlight-label">{label}</p>
      </div>
      <p className="home-study-book-card__highlight-ref">{reference}</p>
      <p className="home-study-book-card__highlight-body">{highlight.body}</p>
      {highlight.kind === 'verse' && highlight.translation ? (
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
        <p className="home-study-book-card__chapter">{book.currentChapter}</p>
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
        <span className="home-review__kind">{reviewKindName[item.kind]}</span>
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
          <span>Connected teaching</span>
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
