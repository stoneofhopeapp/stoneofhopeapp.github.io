import { useEffect, useLayoutEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { getFirebaseAuth } from './firebase'
import {
  navigateToHome,
  navigateToOnlineResources,
  navigateToStudyHome,
  navigateToTags,
  readAppScreenFromHash,
  redirectLegacyTagsChapterFromHash,
  registerAppScreenSync,
  type AppScreen,
} from './appNavigation'
import { clearDemoUser, loadInitialDemoUser, mapFirebaseUser, type SessionUser } from './session'
import { SiteHeader } from './components/SiteHeader'
import { LandingPage } from './components/LandingPage'
import { AuthPage } from './components/AuthPage'
import { HomeDashboard } from './components/HomeDashboard'
import { BookChapterPage } from './components/BookChapterPage'
import { VerseDetailPage } from './components/VerseDetailPage'
import { StudyWorkspace } from './components/StudyWorkspace'
import { CalendarPage } from './components/CalendarPage'
import { TagsPage } from './components/TagsPage'
import { SermonDetailsPage } from './components/SermonDetailsPage'
import { SeriesDetailsPage } from './components/SeriesDetailsPage'
import { OnlineResourcesPage } from './components/OnlineResourcesPage'
import { UserOnlineResourcesProvider } from './context/UserOnlineResourcesContext'

type Screen = 'landing' | 'auth'
type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'stone-of-hope.theme'

function readScreenFromHash(): Screen {
  return window.location.hash === '#auth' ? 'auth' : 'landing'
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
    registerAppScreenSync(setAppScreen)
    return () => registerAppScreenSync(null)
  }, [])

  useLayoutEffect(() => {
    if (redirectLegacyTagsChapterFromHash()) return
    setAppScreen(readAppScreenFromHash())
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
    navigateToHome()
  }

  const openStudy = () => {
    navigateToStudyHome()
  }

  const openCalendar = () => {
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    window.location.hash = `calendar/${y}-${m}-${d}`
    setAppScreen('calendar')
  }

  const openTags = () => {
    navigateToTags()
  }

  const openOnlineResources = () => {
    navigateToOnlineResources()
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
        <UserOnlineResourcesProvider user={currentUser}>
          <>
            <SiteHeader
              user={currentUser}
              appScreen={appScreen}
              onOnlineResourcesClick={openOnlineResources}
              onHomeClick={openHome}
              onStudyClick={openStudy}
              onCalendarClick={openCalendar}
              onTagsClick={openTags}
              onLoginClick={() => openAuth('login')}
              onSignOut={handleSignOut}
            />
          {appScreen === 'online-resources' ? (
            <OnlineResourcesPage />
          ) : appScreen === 'study' ? (
            <div id="study-workspace">
              <StudyWorkspace
                key={currentUser.uid}
                user={currentUser}
                theme={theme}
                onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
              />
            </div>
          ) : appScreen === 'chapter' ? (
            <BookChapterPage />
          ) : appScreen === 'verse' ? (
            <VerseDetailPage />
          ) : appScreen === 'calendar' ? (
            <CalendarPage />
          ) : appScreen === 'tags' ? (
            <TagsPage />
          ) : appScreen === 'sermon' ? (
            <SermonDetailsPage />
          ) : appScreen === 'series' ? (
            <SeriesDetailsPage />
          ) : (
            <HomeDashboard user={currentUser} />
          )}
          </>
        </UserOnlineResourcesProvider>
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
