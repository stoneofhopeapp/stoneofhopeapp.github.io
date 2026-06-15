import type { SessionUser } from '../session'

type SiteHeaderProps = {
  user: SessionUser | null
  appScreen?: 'home' | 'study' | 'calendar' | 'tags' | 'chapter' | 'verse' | 'sermon' | 'series' | 'online-resources'
  onOnlineResourcesClick?: () => void
  onHomeClick?: () => void
  onStudyClick?: () => void
  onCalendarClick?: () => void
  onTagsClick?: () => void
  onLoginClick: () => void
  onSignOut: () => void
}

export function SiteHeader({
  user,
  appScreen = 'home',
  onHomeClick,
  onOnlineResourcesClick,
  onStudyClick,
  onCalendarClick,
  onTagsClick,
  onLoginClick,
  onSignOut,
}: SiteHeaderProps) {
  const displayName =
    user?.displayName || user?.email?.split('@')[0] || 'Account'

  const actions = (
    <div className="soh-nav__actions d-flex align-items-center gap-2">
      {user ? (
        <>
          <button
            type="button"
            className={`btn btn-sm ${appScreen === 'online-resources' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={onOnlineResourcesClick}
          >
            Resources
          </button>
          <button
            type="button"
            className={`btn btn-sm ${appScreen === 'home' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={onHomeClick}
          >
            Home
          </button>
          <button
            type="button"
            className={`btn btn-sm ${appScreen === 'study' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={onStudyClick}
          >
            Study
          </button>
          <button
            type="button"
            className={`btn btn-sm ${appScreen === 'calendar' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={onCalendarClick}
          >
            Calendar
          </button>
          <button
            type="button"
            className={`btn btn-sm ${appScreen === 'tags' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={onTagsClick}
          >
            Tags
          </button>
        </>
      ) : null}
      {user ? (
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary btn-sm dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {displayName}
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <span
                className="dropdown-item-text small text-muted text-truncate"
                style={{ maxWidth: 220 }}
              >
                {user.email ?? user.uid}
              </span>
            </li>
            <li>
              <span className="dropdown-item-text small text-muted">
                {user.authSource === 'demo' ? 'Demo session' : 'Firebase session'}
              </span>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button type="button" className="dropdown-item" onClick={onSignOut}>
                Sign out
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={onLoginClick}
        >
          Log in
        </button>
      )}
      {user ? null : (
        <a className="btn btn-primary" href="#download">
          Learn More
        </a>
      )}
    </div>
  )

  return (
    <nav className="navbar navbar-light soh-nav static-top">
      <div
        className={`container ${user ? 'soh-nav__inner' : 'd-flex flex-wrap align-items-center gap-2'}`}
      >
        {user ? (
          <a
            className="soh-nav__verse"
            href="#home"
            onClick={(event) => {
              if (!onHomeClick) return
              event.preventDefault()
              onHomeClick()
            }}
          >
            Thus far the LORD has helped us. — 1 Samuel 7:12
          </a>
        ) : (
          <a className="navbar-brand me-auto" href="#!">
            Stone Of Hope
          </a>
        )}
        {user ? actions : <div className="d-flex align-items-center gap-2 ms-auto">{actions}</div>}
      </div>
    </nav>
  )
}
