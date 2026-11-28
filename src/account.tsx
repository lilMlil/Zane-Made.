import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabaseClient } from './supabase'
import { usePreferences, type Language, type Theme } from './preferences'
import { CurrencyNote, CurrencySelect, PageMeta } from './ui'

const authClient = supabaseClient?.then(client => client.auth) ?? null
const profileKey = 'zane-preview-profile'

export function Settings() {
  const { language, theme, setLanguage, setTheme, t } = usePreferences()
  return <div className="container page account-page">
    <PageMeta title={t('Settings')} />
    <div className="page-heading"><h1>{t('Settings')}</h1></div>
    <div className="form settings-panel">
      <label>{t('Appearance')}<select value={theme} onChange={event => setTheme(event.target.value as Theme)}>
        <option value="light">{t('Light')}</option><option value="dark">{t('Dark')}</option><option value="system">{t('Follow device')}</option>
      </select></label>
      <label>{t('Store language')}<select value={language} onChange={event => setLanguage(event.target.value as Language)}>
        <option value="en" lang="en">English</option><option value="ru" lang="ru">Русский</option><option value="lv" lang="lv">Latviešu</option>
      </select></label>
      <label>{t("Currency")}<CurrencySelect /></label>
      <CurrencyNote />
      <Link className="text-link" to="/profile">{t('Your profile')}</Link>
      <Link className="text-link" to="/edit-text">{t("Edit website text")}</Link>
    </div>
  </div>
}

function readPreviewProfile() {
  try { return localStorage.getItem(profileKey) ?? '' } catch { return '' }
}

export function Account() {
  const { t } = usePreferences()
  const [profile, setProfile] = useState(readPreviewProfile)
  const [session, setSession] = useState<Session | null>(null)
  const [auth, setAuth] = useState<Awaited<NonNullable<typeof authClient>> | null>(null)
  const [ready, setReady] = useState(!authClient)
  const [mode, setMode] = useState<'register' | 'login'>('register')
  const [pending, setPending] = useState(false)
  const [feedback, setFeedback] = useState<{ message: string, error?: boolean } | null>(null)

  useEffect(() => {
    if (!authClient) return
    let active = true
    let unsubscribe: (() => void) | undefined
    authClient.then(client => {
      if (!active) return
      setAuth(client)
      const { data } = client.onAuthStateChange((_event, current) => {
        setSession(current)
        setReady(true)
      })
      unsubscribe = () => data.subscription.unsubscribe()
    }).catch(() => {
      if (active) setFeedback({ message: 'Something went wrong. Please try again.', error: true })
    })
    return () => {
      active = false
      unsubscribe?.()
    }
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    setFeedback(null)
    if (mode === 'register' && !name) {
      setFeedback({ message: 'Enter a display name.', error: true })
      return
    }
    if (!auth) {
      try {
        localStorage.setItem(profileKey, name)
        setProfile(name)
      } catch { setFeedback({ message: 'Could not save your profile on this device.', error: true }) }
      return
    }
    setPending(true)
    try {
      const email = String(data.get('email') ?? '').trim()
      const password = String(data.get('password') ?? '')
      if (mode === 'register') {
        const result = await auth.signUp({ email, password, options: {
          data: { display_name: name },
          emailRedirectTo: new URL(import.meta.env.BASE_URL + 'profile', window.location.origin).href,
        } })
        if (result.error) throw result.error
        if (!result.data.session) setFeedback({ message: 'Check your inbox to confirm your email.' })
      } else {
        const { error } = await auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch {
      setFeedback({ message: mode === 'register'
        ? 'Could not register. Check your details or try signing in.'
        : 'Could not sign in. Check your email and password.', error: true })
    } finally { setPending(false) }
  }

  async function signOut() {
    setFeedback(null)
    setPending(true)
    try {
      if (auth) {
        const { error } = await auth.signOut()
        if (error) throw error
        setSession(null)
      } else {
        localStorage.removeItem(profileKey)
        setProfile('')
      }
    } catch { setFeedback({ message: 'Could not update your profile. Try again.', error: true }) }
    finally { setPending(false) }
  }

  const name = auth ? String(session?.user.user_metadata.display_name || '') : profile
  const signedIn = auth ? !!session : !!profile
  return <div className="container page account-page">
    <PageMeta title={t('Your profile')} />
    <div className="page-heading"><h1>{t('Your profile')}</h1>
      {!authClient && <p>{t('Preview profile. Your display name is saved only on this device.')}</p>}
    </div>
    <div className="settings-panel">
      {!ready ? !feedback && <p role="status">{t('Please wait…')}</p> : signedIn ?
        <div className="form">
          {name && <h2>{name}</h2>}
          {session?.user.email && <p>{session.user.email}</p>}
          <Link className="text-link" to="/settings">{t('Settings')}</Link>
          <button type="button" disabled={pending} className="button outline" onClick={signOut}>{t(auth ? 'Sign out' : 'Remove local profile')}</button>
        </div> :
        <form className="form" onSubmit={submit}>
          {mode === 'register' && <label>{t('Display name')}<input name="name" autoComplete="nickname" required maxLength={60} /></label>}
          {auth && <>
            <label>{t('Email address')}<input name="email" type="email" autoComplete="email" required /></label>
            <label>{t('Password')}<input name="password" type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required minLength={mode === 'register' ? 8 : undefined} /></label>
          </>}
          <button className="button" disabled={pending}>{t(pending ? 'Please wait…' : auth ? mode === 'register' ? 'Register' : 'Sign in' : 'Create local profile')}</button>
          {auth && <button type="button" className="text-button" disabled={pending} onClick={() => {
            setFeedback(null)
            setMode(mode === 'register' ? 'login' : 'register')
          }}>{t(mode === 'register' ? 'Already registered? Sign in' : 'Create an account')}</button>}
        </form>}
      {feedback && <p className={feedback.error ? 'form-feedback error' : 'form-feedback'} role={feedback.error ? 'alert' : 'status'}>{t(feedback.message)}</p>}
    </div>
  </div>
}
