import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { usePreferences } from './preferences'
import { supabaseClient } from './supabase'

type Feedback = { id: string, rating: number | null, body: string }
type Feed = { status: 'loading' | 'ready' | 'error', entries: Feedback[], signedIn: boolean }

export function ProductFeedback({ productId }: { productId: string }) {
  const { t } = usePreferences()
  const [feed, setFeed] = useState<Feed>({ status: 'loading', entries: [], signedIn: false })
  const [submission, setSubmission] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    if (!supabaseClient) return
    let active = true
    async function loadFeedback() {
      const client = await supabaseClient!
      const [feedback, auth] = await Promise.all([
        client.from('product_feedback').select('id,rating,body').eq('product_id', productId)
          .order('created_at', { ascending: false }).order('id', { ascending: false }).limit(50),
        client.auth.getSession(),
      ])
      if (active) setFeed({
        status: feedback.error ? 'error' : 'ready',
        entries: feedback.data ?? [],
        signedIn: Boolean(auth.data.session),
      })
    }
    void loadFeedback().catch(() => {
      if (active) setFeed({ status: 'error', entries: [], signedIn: false })
    })
    return () => { active = false }
  }, [productId])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabaseClient || submission === 'sending') return
    const form = event.currentTarget
    const data = new FormData(form)
    const body = String(data.get('body') ?? '').trim()
    const rating = data.get('rating')
    if (!body) {
      const field = form.elements.namedItem('body') as HTMLTextAreaElement
      field.setCustomValidity(t('Write a review or comment.'))
      field.reportValidity()
      return
    }
    setSubmission('sending')
    try {
      const client = await supabaseClient
      const { error } = await client.from('product_feedback').insert({
        product_id: productId, body, rating: rating ? Number(rating) : null,
      })
      if (error) throw error
      form.reset()
      setSubmission('sent')
    } catch {
      setSubmission('error')
    }
  }

  return <section className="product-feedback related" aria-labelledby="product-feedback-title">
    <h2 id="product-feedback-title">{t('Customer reviews and comments')}</h2>
    {!supabaseClient ? <p>{t('Reviews and comments are currently unavailable.')}</p> : <>
      {feed.status === 'loading' && <p role="status">{t('Loading reviews and comments…')}</p>}
      {feed.status === 'error' && <p role="status">{t('Reviews and comments could not be loaded.')}</p>}
      {feed.status === 'ready' && <>
        {feed.entries.length === 0 ? <p>{t('No reviews or comments yet.')}</p> :
          <ul className="feedback-list">{feed.entries.map(entry => <li key={entry.id}>
            <strong>{entry.rating === null ? t('Comment') : t('Rating: {rating} out of 5').replace('{rating}', String(entry.rating))}</strong>
            <p>{entry.body}</p>
          </li>)}</ul>}
        {feed.signedIn ? <form className="form feedback-form" onSubmit={submit}>
          <p>{t('Leave a rating and review, or post a comment without a rating. Entries appear after moderation.')}</p>
          <label>{t('Rating (optional)')}<select name="rating" defaultValue="">
            <option value="">{t('Comment without rating')}</option>
            {[5, 4, 3, 2, 1].map(rating => <option value={rating} key={rating}>{rating}</option>)}
          </select></label>
          <label>{t('Your review or comment')}<textarea name="body" rows={4} required maxLength={1000}
            onInput={event => event.currentTarget.setCustomValidity('')} /></label>
          <button className="button" disabled={submission === 'sending'}>{t('Submit for moderation')}</button>
          {submission === 'sent' && <p role="status">{t('Your entry was sent for moderation.')}</p>}
          {submission === 'error' && <p role="alert">{t('Your entry could not be sent. Please try again.')}</p>}
        </form> : <Link to="/profile" className="text-link">{t('Sign in to leave a review or comment')}</Link>}
      </>}
    </>}
  </section>
}
