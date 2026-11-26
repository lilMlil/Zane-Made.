import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { copyKeys, defaultCopy, parseOverrides, validCopy } from './copy'
import { usePreferences, type Language } from './preferences'
import { PageMeta } from './ui'

const pageSize = 20

export function CopyEditor() {
  const { language, setLanguage, draft, updateDraft, t } = usePreferences()
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(pageSize)
  const [changedOnly, setChangedOnly] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState<{ message: string, error?: boolean } | null>(null)
  const languageDraft = draft[language] ?? {}
  const search = query.trim().toLocaleLowerCase(language)
  const entries = copyKeys.filter(key => {
    if (changedOnly && !Object.hasOwn(languageDraft, key)) return false
    return !search || [key, t(key), defaultCopy(key, language)].some(value => value.toLocaleLowerCase(language).includes(search))
  })
  const hasDraft = Object.values(draft).some(entries => Object.keys(entries).length > 0)

  function commit(next: typeof draft, message: string) {
    try {
      updateDraft(next)
      setActive(null)
      setFeedback({ message })
    } catch {
      setFeedback({ message: 'Could not save changes in this browser.', error: true })
    }
  }

  function save(event: FormEvent) {
    event.preventDefault()
    if (!active) return
    if (!validCopy(active, text)) {
      setFeedback({ message: 'Keep any placeholders in braces, such as {price}.', error: true })
      return
    }
    const next = { ...languageDraft, [active]: text }
    if (text === defaultCopy(active, language)) delete next[active]
    commit({ ...draft, [language]: next }, 'Text saved in this browser.')
  }

  function reset(key: string) {
    const next = { ...languageDraft }
    delete next[key]
    commit({ ...draft, [language]: next }, 'Published text restored.')
  }

  function download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'zane-made-text.json'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async function importDraft(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return
    try {
      if (file.size > 2_000_000) throw new Error('File too large')
      const imported = parseOverrides(JSON.parse(await file.text()))
      updateDraft({
        en: { ...draft.en, ...imported.en },
        ru: { ...draft.ru, ...imported.ru },
        lv: { ...draft.lv, ...imported.lv },
      })
      setActive(null)
      setFeedback({ message: 'Changes imported into this browser.' })
    } catch {
      setFeedback({ message: 'Could not import this text file.', error: true })
    }
  }

  return <div className="container page copy-page">
    <PageMeta title={t('Edit website text')} />
    <div className="page-heading">
      <h1>{t('Edit website text')}</h1>
      <p>{t('Find a phrase, choose a language and save your edit. The store will show it in this browser.')}</p>
    </div>
    <div className="form copy-controls">
      <label>{t('Store language')}<select value={language} onChange={event => {
        setLanguage(event.target.value as Language)
        setActive(null)
        setLimit(pageSize)
        setFeedback(null)
      }}>
        <option value="en" lang="en">English</option>
        <option value="ru" lang="ru">Русский</option>
        <option value="lv" lang="lv">Latviešu</option>
      </select></label>
      <label>{t('Search website text')}<input type="search" value={query} onChange={event => {
        setQuery(event.target.value)
        setLimit(pageSize)
      }} /></label>
      <label className="copy-checkbox"><input type="checkbox" checked={changedOnly} onChange={event => {
        setChangedOnly(event.target.checked)
        setLimit(pageSize)
      }} />{t('Show changed text only')}</label>
      <div className="copy-actions">
        <button type="button" className="button" onClick={download} disabled={!hasDraft}>{t('Download changes')}</button>
        <Link className="button outline" to="/">{t('Open store preview')}</Link>
      </div>
      <label>{t('Import changes')}<input type="file" accept=".json,application/json" onChange={importDraft} /></label>
      <p className="muted">{t('To publish for everyone, download the changes and attach the file in this chat.')}</p>
    </div>
    {feedback && <p className={feedback.error ? 'form-feedback error' : 'form-feedback'} role={feedback.error ? 'alert' : 'status'}>{t(feedback.message)}</p>}
    <p className="results" aria-live="polite">{t('Results')}: {entries.length}</p>
    <ul className="copy-list">
      {entries.slice(0, limit).map(key => <li key={key}>
        <p lang={language}>{t(key) || t('Empty text')}</p>
        {languageDraft[key] !== undefined && <small>{t('Changed')}</small>}
        {key === active ? <form className="form" onSubmit={save}>
          <label>{t('New text')}<textarea rows={4} autoFocus maxLength={12000} value={text} onChange={event => setText(event.target.value)} /></label>
          <div className="copy-actions"><button className="button">{t('Save text')}</button>
            <button type="button" className="text-button" onClick={() => setActive(null)}>{t('Cancel')}</button>
            {Object.hasOwn(languageDraft, key) && <button type="button" className="text-button" onClick={() => reset(key)}>{t('Restore published text')}</button>}
          </div>
        </form> : <button type="button" className="text-button" onClick={() => {
          setFeedback(null)
          setText(t(key))
          setActive(key)
        }}>{t('Edit')}</button>}
      </li>)}
    </ul>
    {limit < entries.length && <button type="button" className="button outline" onClick={() => setLimit(limit + pageSize)}>{t('Show more')}</button>}
  </div>
}
