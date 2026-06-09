import type { SessionUser } from '../session'

type SiteHeaderProps = {
  user: SessionUser | null
  onLoginClick: () => void
  onSignOut: () => void
}

export function SiteHeader({ user, onLoginClick, onSignOut }: SiteHeaderProps) {
  const displayName =
    user?.displayName || user?.email?.split('@')[0] || 'Account'

  return (
    <nav className="navbar navbar-light bg-light static-top">
      <div className="container d-flex flex-wrap align-items-center gap-2">
        <a className="navbar-brand me-auto" href="#!">
          Stone Of Hope
        </a>
        <div className="d-flex align-items-center gap-2 ms-auto">
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
          <a className="btn btn-primary" href={user ? '#study-workspace' : '#download'}>
            {user ? 'Open Study' : 'Learn More'}
          </a>
        </div>
      </div>
    </nav>
  )
}
