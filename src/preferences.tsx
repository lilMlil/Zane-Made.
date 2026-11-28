import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createMoneyFormatter, isCurrency, type Currency } from './currency'
import { baseCopy, defaultCopy, readDraft, saveDraft, type CopyOverrides } from './copy'

export type Language = 'en' | 'ru' | 'lv'
export type Theme = 'light' | 'dark' | 'system'
const defaults = { language: 'lv' as Language, theme: 'light' as Theme, currency: 'EUR' as Currency }

export function readPreferences(): typeof defaults {
  try {
    const saved = JSON.parse(localStorage.getItem('zane-preferences') ?? '{}')
    return {
      language: ['en', 'ru', 'lv'].includes(saved.language) ? saved.language : defaults.language,
      currency: isCurrency(saved.currency) ? saved.currency : defaults.currency,
      theme: ['light', 'dark', 'system'].includes(saved.theme) ? saved.theme : defaults.theme,
    }
  } catch {
    return defaults
  }
}

const Context = createContext({
  ...defaults,
  setLanguage: (_language: Language) => {},
  setTheme: (_theme: Theme) => {},
  setCurrency: (_currency: Currency) => {},
  money: createMoneyFormatter(defaults.language, defaults.currency),
  draft: {} as CopyOverrides,
  updateDraft: (_draft: CopyOverrides) => {},
  t: (message: string, _required = false) => message,
})

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(readPreferences)
  const [draft, setDraft] = useState(readDraft)
  useEffect(() => {
    const { language, theme } = preferences
    document.documentElement.lang = language
    const scheme = window.matchMedia?.('(prefers-color-scheme: dark)')
    function applyTheme() {
      document.documentElement.dataset.theme = theme === 'system' ? (scheme?.matches ? 'dark' : 'light') : theme
    }
    applyTheme()
    scheme?.addEventListener('change', applyTheme)
    try { localStorage.setItem('zane-preferences', JSON.stringify(preferences)) } catch { /* Storage is optional. */ }
    return () => scheme?.removeEventListener('change', applyTheme)
  }, [preferences])
  return <Context.Provider value={{
    ...preferences,
    money: createMoneyFormatter(preferences.language, preferences.currency),
    setCurrency: currency => setPreferences(current => ({ ...current, currency })),
    setLanguage: language => setPreferences(current => ({ ...current, language })),
    setTheme: theme => setPreferences(current => ({ ...current, theme })),
    draft,
    updateDraft: next => {
      saveDraft(next)
      setDraft(next)
    },
    t: (message, required = false) => {
      const value = draft[preferences.language]?.[message] ?? defaultCopy(message, preferences.language)
      return required && !value.trim() ? baseCopy(message, preferences.language) : value
    },
  }}>{children}</Context.Provider>
}

export const usePreferences = () => useContext(Context)
