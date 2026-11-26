import { PreferencesProvider, usePreferences } from './preferences'
import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { CartProvider } from './cart'
import { About, Home } from './editorial'
import { Checkout, Contact, CustomOrders, Shipping } from './forms'
import { Collections, NotFound, ProductPage, Shop } from './shop'
import { CartDrawer, Footer, Header } from './ui'
import { CopyEditor } from './copy-editor'
import { Account, Settings } from './account'
import './styles.css'

function ProductRoute({ openCart }: { openCart: () => void }) {
  const { id = '' } = useParams()
  return <ProductPage id={id} openCart={openCart} />
}

function App() {
  const { t } = usePreferences()
  const { pathname, hash } = useLocation()
  const [cartOpen, setCartOpen] = useState(false)
  const main = useRef<HTMLElement>(null)
  const previousPath = useRef(pathname)
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1))
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
    if (previousPath.current !== pathname && !target) main.current?.focus({ preventScroll: true })
    previousPath.current = pathname
  }, [pathname, hash])
  const openCart = () => setCartOpen(true)
  return <CartProvider>
    <a className="skip-link" href="#main">{t("Skip to content")}</a>
    <Header openCart={openCart} />
    <main id="main" ref={main} tabIndex={-1}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/product/:id" element={<ProductRoute openCart={openCart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/custom" element={<CustomOrders />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/edit-text" element={<CopyEditor />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Account />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
    {cartOpen && <CartDrawer close={() => setCartOpen(false)} />}
  </CartProvider>
}

createRoot(document.getElementById('root')!).render(<BrowserRouter><PreferencesProvider><App /></PreferencesProvider></BrowserRouter>)
