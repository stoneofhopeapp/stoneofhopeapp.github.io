/** Locale-aware date formatting for sermon `preachedOn` (`YYYYMMDD`). */

export function getAppLocale(): string {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language
  }
  return 'en-US'
}

export function parsePreachedOn(preachedOn: string): Date {
  if (preachedOn.length === 8 && /^\d{8}$/.test(preachedOn)) {
    return new Date(
      `${preachedOn.slice(0, 4)}-${preachedOn.slice(4, 6)}-${preachedOn.slice(6, 8)}T12:00:00`,
    )
  }
  return new Date(`${preachedOn}T12:00:00`)
}

/** en-US → "May 21, 2026"; en-GB → "21 May 2026"; zh-CN → "2026年5月21日" */
export function formatPreachedOnDate(preachedOn: string, locale = getAppLocale()): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsePreachedOn(preachedOn))
}
