import { currencies, isCurrency, ratesDate } from './currency'
import { productPlaceholders, showPhotography, showProductPlaceholders } from './storefront'
import { usePreferences } from './preferences'
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Menu, Minus, Plus, Search, Settings2, ShoppingBag, UserRound, X } from 'lucide-react'
import { brand, categories, findProduct, image, type Product } from './catalog'
import { useCart } from './cart'
import { submitForm, type FormKind } from './services'

export function PageMeta({ title, description }: { title?: string, description?: string }) {
  const { t } = usePreferences()
  useEffect(() => {
    document.title = title ? title + ' | ' + t('Zane Made') : t('Zane Made') + ' | ' + t('Handmade knitwear from Latvia')
    document.querySelector('meta[name="description"]')?.setAttribute('content', description ?? t('Explore handmade knitwear from Zane Made, a small textile project in Latvia.'))
  }, [title, description, t])
  return null
}

const links = [
  ['/shop', 'Shop'], ['/collections', 'Collections'], ['/about', 'Our Story'],
  ['/custom', 'Custom Orders'], ['/contact', 'Contact'],
]

export function Wordmark() {
  const { t } = usePreferences()
  return <Link className="wordmark" to="/" aria-label={t("Zane Made home")}>{t('Zane')}<span>{t('Made')}</span></Link>
}

export function Header({ openCart }: { openCart: () => void }) {
  const { t } = usePreferences()
  const [panel, setPanel] = useState<'menu' | 'search' | null>(null)
  const [term, setTerm] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { count } = useCart()
  useEffect(() => { setPanel(null) }, [location])
  function search(event: FormEvent) {
    event.preventDefault()
    navigate('/shop?q=' + encodeURIComponent(term.trim()))
    setPanel(null)
  }
  const nav = links.map(([url, label]) => <NavLink key={url} to={url}>{t(label)}</NavLink>)
  return <header className="header" onKeyDown={event => { if (event.key === 'Escape') setPanel(null) }}>
    <div className="announcement">{t(brand.announcement)}</div>
    <div className="nav-shell">
      <button type="button" className="icon-button mobile-menu" aria-label={t("Menu")} aria-expanded={panel === 'menu'} onClick={() => setPanel(panel === 'menu' ? null : 'menu')}><Menu size={21} /></button>
      <Wordmark />
      <nav className="desktop-nav" aria-label={t("Main navigation")}>{nav}</nav>
      <div className="nav-actions">
        <Link className="icon-button desktop-account" to="/settings" aria-label={t('Settings')} title={t('Settings')}><Settings2 size={19} /></Link>
        <Link className="icon-button desktop-account" to="/profile" aria-label={t('Your profile')} title={t('Your profile')}><UserRound size={19} /></Link>
        <button type="button" className="icon-button" aria-label={t("Search")} aria-expanded={panel === 'search'} onClick={() => setPanel(panel === 'search' ? null : 'search')}><Search size={19} /></button>
        <button type="button" className="icon-button bag-button" aria-label={t('Open bag') + ' (' + count + ')'} onClick={() => {setPanel(null); openCart()}}><ShoppingBag size={19} /><span>{count}</span></button>
      </div>
    </div>
    {panel === 'menu' && <nav className="mobile-panel" aria-label={t("Mobile navigation")}>{nav}<NavLink to="/settings">{t("Settings")}</NavLink><NavLink to="/profile">{t("Your profile")}</NavLink></nav>}
    {panel === 'search' && <form className="search-panel" role="search" onSubmit={search}>
      <input autoFocus type="search" aria-label={t("Search products")} placeholder={t("Search the collection")} value={term} onChange={event => setTerm(event.target.value)} />
      <button className="button">{t("Search")}</button>
    </form>}
  </header>
}

export function ProductGrid({ products }: { products: Product[] }) {
  const { t, money } = usePreferences()
  const { add } = useCart()
  const [feedback, setFeedback] = useState('')
  return <><p className="visually-hidden" role="status">{t(feedback)}</p><div className="product-grid">{products.map(product => {
    const name = t(product.name)
    const url = '/product/' + product.id
    const quickAction = product.colors.length === 1
      ? <button className="quick-link" type="button" aria-label={t('Quick add') + ' ' + t(product.name)} onClick={() => {
          add(product.id, product.colors[0], 1)
          setFeedback('Added to your bag.')
        }}><Plus size={18} /></button>
      : <Link className="quick-link" to={url} aria-label={t('Choose options for') + ' ' + t(product.name)}><Plus size={18} /></Link>
    return <article className={showPhotography ? "product-card" : "product-card without-photos"} key={product.id}>
      {showPhotography && <div className="product-frame">
        <Link to={url} aria-label={t(product.name)}>
          <img src={image(product.images[0])} alt={t(product.name) + ' · ' + t(product.colors[0])} loading="lazy" />
          <img className="hover-photo" src={image(product.images[1])} alt="" loading="lazy" />
        </Link>
        {quickAction}
      </div>}
      <div className="product-caption">{!showProductPlaceholders && <Link to={url}>{name}</Link>}<span>{showProductPlaceholders ? t(productPlaceholders.price) : money.price(product.price)}</span></div>
      <p>{showProductPlaceholders ? <Link to={url} aria-label={name}>{t(productPlaceholders.description)}</Link> : t(product.colors[0]) + " · " + t(product.material)}</p>
      {!showPhotography && quickAction}
    </article>
  })}</div></>
}

export function CategoryGrid() {
  const { t } = usePreferences()
  return <div className="category-grid">{categories.map(category =>
    <Link className="category" to={'/shop?category=' + category.name} key={category.name}>
      {showPhotography && <img src={image(category.image)} alt="" loading="lazy" />}
      <span>{t(category.label)}<ArrowUpRight size={16} aria-hidden="true" /></span>
    </Link>,
  )}</div>
}

export function Quantity({ value, change }: { value: number, change: (value: number) => void }) {
  const { t } = usePreferences()
  return <div className="quantity">
    <button type="button" aria-label={t("Decrease quantity")} disabled={value <= 1} onClick={() => change(value - 1)}><Minus size={15} /></button>
    <output aria-label={t("Quantity")}>{value}</output>
    <button type="button" aria-label={t("Increase quantity")} disabled={value >= 99} onClick={() => change(value + 1)}><Plus size={15} /></button>
  </div>
}

export function CartDrawer({ close }: { close: () => void }) {
  const { t, money } = usePreferences()
  const { items, count, change } = useCart()
  const drawer = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = drawer.current
    element?.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      element?.close()
      document.body.style.overflow = previous
    }
  }, [])
  return <dialog className="cart-drawer" ref={drawer} aria-labelledby="bag-title"
    onClick={event => { if (event.target === event.currentTarget) close() }}
    onCancel={event => { event.preventDefault(); close() }}>
    <div className="cart-content">
      <div className="cart-head"><h2 id="bag-title">{t("Your bag")}{" "}<small>({count})</small></h2><button className="icon-button" onClick={close} aria-label={t("Close bag")}><X /></button></div>
      {items.length ? <>
        <div className="cart-items">{items.map(({ productId, color, quantity }) => {
          const product = findProduct(productId)!
          return <article className={showPhotography ? "cart-item" : "cart-item without-photos"} key={productId + color}>
            {showPhotography && <img src={image(product.images[0])} alt="" />}
            <div>{showProductPlaceholders
              ? <p><Link to={'/product/' + productId} onClick={close} aria-label={t(product.name)}>{t(productPlaceholders.description)}</Link></p>
              : <><Link to={'/product/' + productId} onClick={close}>{t(product.name)}</Link><p>{t(color)}</p></>}
              <Quantity value={quantity} change={value => change(productId, color, value)} />
              <button className="text-button" onClick={() => change(productId, color, 0)}>{t("Remove")}</button>
            </div><span>{showProductPlaceholders ? t(productPlaceholders.price) : money.price(product.price, quantity)}</span>
          </article>
        })}</div>
        <div className="cart-total"><p><strong>{t("Subtotal")}</strong><strong>{showProductPlaceholders ? t(productPlaceholders.price) : money.total(items.map(item => ({ price: findProduct(item.productId)!.price, quantity: item.quantity })))}</strong></p><p className="muted">{t("Shipping and applicable taxes depend on destination.")}</p>{!showProductPlaceholders && <CurrencyNote />}
          <Link className="button" to="/checkout" onClick={close}>{t("Checkout")}</Link>
          <button className="text-button" onClick={close}>{t("Continue shopping")}</button>
        </div>
      </> : <div className="empty cart-empty"><ShoppingBag size={30} strokeWidth={1} /><h3>{t("Your bag is empty.")}</h3>
        <Link className="button" to="/shop" onClick={close}>{t("Continue shopping")}</Link></div>}
    </div>
  </dialog>
}

export function Form({ kind, children, button, className = '' }: { kind: FormKind, children: ReactNode, button: string, className?: string }) {
  const { t } = usePreferences()
  const [pending, setPending] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setFeedback('')
    setError(false)
    const form = event.currentTarget
    const data = new FormData(form)
    const file = data.get('inspiration')
    if (file instanceof File && file.size && (file.size > 5_000_000 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))) {
      setError(true)
      setFeedback('Choose a JPG, PNG or WebP image under 5 MB.')
      return
    }
    setPending(true)
    try {
      setFeedback(await submitForm(kind, data))
      if (import.meta.env.VITE_FORM_ENDPOINT) form.reset()
    } catch {
      setError(true)
      setFeedback('Something went wrong. Please try again.')
    } finally {
      setPending(false)
    }
  }
  return <form className={'form ' + className} onSubmit={submit}>
    {children}
    <button className="button" disabled={pending}>{pending ? t('Please wait…') : button}</button>
    {feedback && <p className={'form-feedback ' + (error ? 'error' : '')} role={error ? 'alert' : 'status'}>{t(feedback)}</p>}
  </form>
}

export function Footer() {
  const { t } = usePreferences()
  return <footer className="footer">
    <div className="footer-grid">
      <div><Wordmark /><p>{t("Handmade knitwear and textiles from Latvia.")}</p></div>
      <div><h3>{t("Shop")}</h3><Link to="/shop">{t("All pieces")}</Link>{categories.map(({ name }) => <Link key={name} to={'/shop?category=' + name}>{t(name)}</Link>)}</div>
      <div><h3>{t('Zane Made')}</h3><Link to="/about">{t("Our Story")}</Link><Link to="/custom">{t("Custom Orders")}</Link><Link to="/shipping">{t("Shipping &amp; Returns")}</Link><Link to="/contact">{t("Contact")}</Link></div>
      <div>
        <h3>{t("Find us")}</h3>
        <ul className="footer-social">
          {['Facebook', 'TikTok', 'YouTube'].map(name => <li key={name}>{t(name)}</li>)}
        </ul>
        <Link className="footer-question" to="/contact#question">{t("Ask a question")}</Link>
      </div>
    </div>
    <div className="footer-bottom">© {new Date().getFullYear()}{" "}{t("Zane Made")}</div>
  </footer>
}

export function CurrencySelect({ compact = false }: { compact?: boolean }) {
  const { currency, setCurrency, language, t } = usePreferences()
  const names = new Intl.DisplayNames([language], { type: 'currency' })
  return <select className="currency-select" aria-label={t('Currency')} title={t('Currency')} value={currency} onChange={event => {
    if (isCurrency(event.target.value)) setCurrency(event.target.value)
  }}>
    {currencies.map(code => <option key={code} value={code}>{compact ? code : code + ' · ' + names.of(code)}</option>)}
  </select>
}

export function CurrencyNote() {
  const { currency, language, t } = usePreferences()
  if (currency === 'EUR') return null
  const date = new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(ratesDate))
  return <p className="muted currency-note">{t('Estimated prices · ECB reference rates from {date}').replace('{date}', date)}</p>
}
