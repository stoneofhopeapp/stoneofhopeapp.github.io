import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { getFirebaseAuth } from './firebase'
import { clearDemoUser, loadInitialDemoUser, mapFirebaseUser, type SessionUser } from './session'
import { SiteHeader } from './components/SiteHeader'
import { LandingPage } from './components/LandingPage'
import { AuthPage } from './components/AuthPage'
import { HomeDashboard } from './components/HomeDashboard'
import { StudyWorkspace } from './components/StudyWorkspace'
import { CalendarPage } from './components/CalendarPage'

type Screen = 'landing' | 'auth'
type AppScreen = 'home' | 'study' | 'calendar'
type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'stone-of-hope.theme'

function readScreenFromHash(): Screen {
  return window.location.hash === '#auth' ? 'auth' : 'landing'
}

function readAppScreenFromHash(): AppScreen {
  const hash = window.location.hash
  if (hash === '#study' || hash === '#study-workspace') return 'study'
  if (hash === '#calendar' || hash.startsWith('#calendar/')) return 'calendar'
  return 'home' // default and #home
}

function App() {
  const [firebaseUser, setFirebaseUser] = useState<SessionUser | null>(null)
  const [demoUser, setDemoUser] = useState<SessionUser | null>(() => loadInitialDemoUser())
  const [screen, setScreen] = useState<Screen>(() => readScreenFromHash())
  const [appScreen, setAppScreen] = useState<AppScreen>(() => readAppScreenFromHash())
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    return saved === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) return

    return onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user ? mapFirebaseUser(user) : null)
    })
  }, [])

  useEffect(() => {
    const syncScreen = () => {
      setScreen(readScreenFromHash())
      setAppScreen(readAppScreenFromHash())
    }
    window.addEventListener('hashchange', syncScreen)
    return () => window.removeEventListener('hashchange', syncScreen)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const currentUser = firebaseUser ?? demoUser

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode)
    window.location.hash = 'auth'
  }

  const openHome = () => {
    window.location.hash = ''
    setAppScreen('home')
  }

  const openStudy = () => {
    window.location.hash = 'study'
    setAppScreen('study')
  }

  const openCalendar = () => {
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    window.location.hash = `calendar/${y}-${m}-${d}`
    setAppScreen('calendar')
  }

  const handleSignOut = async () => {
    if (firebaseUser) {
      const auth = getFirebaseAuth()
      if (auth) await signOut(auth)
      return
    }

    clearDemoUser()
    setDemoUser(null)
    window.location.hash = ''
  }

  return (
    <>
      {currentUser ? (
        <>
          <SiteHeader
            user={currentUser}
            appScreen={appScreen}
            onHomeClick={openHome}
            onStudyClick={openStudy}
            onCalendarClick={openCalendar}
            onLoginClick={() => openAuth('login')}
            onSignOut={handleSignOut}
          />
          {appScreen === 'study' ? (
            <div id="study-workspace">
              <StudyWorkspace
                key={currentUser.uid}
                user={currentUser}
                theme={theme}
                onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
              />
            </div>
          ) : appScreen === 'calendar' ? (
            <CalendarPage />
          ) : (
            <HomeDashboard user={currentUser} />
          )}
        </>
      ) : screen === 'auth' ? (
        <AuthPage
          mode={authMode}
          onModeChange={setAuthMode}
          onBack={() => {
            window.location.hash = ''
          }}
          onSignedIn={(user) => {
            if (user.authSource === 'demo') {
              setDemoUser(user)
            } else {
              clearDemoUser()
              setDemoUser(null)
            }
            window.location.hash = ''
          }}
        />
      ) : (
        <>
          <SiteHeader
            user={null}
            onLoginClick={() => openAuth('login')}
            onSignOut={handleSignOut}
          />
          <LandingPage onLoginClick={() => openAuth('login')} />
        </>
      )}
    </>
  )
}

export default App
