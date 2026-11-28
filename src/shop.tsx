import { productPlaceholders, showPhotography, showProductPlaceholders } from './storefront'
import { usePreferences } from './preferences'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronRight, Search, ShoppingBag, X } from 'lucide-react'
import { materialCare, sizeGuide, priceThresholds, categories, findProduct, image, products, type Product } from './catalog'
import { useCart } from './cart'
import { CategoryGrid, CurrencyNote, CurrencySelect, PageMeta, ProductGrid, Quantity } from './ui'

function Filters({ count }: { count: number }) {
  const { t, money } = usePreferences()
  const [params, setParams] = useSearchParams()
  function filter(key: string, value: string) {
    setParams(previous => {
      const next = new URLSearchParams(previous)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    }, { replace: true, preventScrollReset: true })
  }
  return <>
    <div className="filters">
      <div className="filter-fields">
        <div className="filter-search">
          <Search size={17} aria-hidden="true" />
          <input type="search" aria-label={t("Search products")} placeholder={t("Search")} value={params.get('q') ?? ''} onChange={event => filter('q', event.target.value)} />
        </div>
        <select aria-label={t("Price")} title={t("Price")} value={params.get('price') ?? ''} onChange={event => filter('price', event.target.value)}>
          <option value="">{t("Price")}</option><option value="under">{t("Under {price}").replace("{price}", money.price(priceThresholds.low))}</option><option value="mid">{t("{low} – {high}").replace("{low}", money.price(priceThresholds.low)).replace("{high}", money.price(priceThresholds.middle))}</option><option value="over">{t("Over {price}").replace("{price}", money.price(priceThresholds.middle))}</option>
        </select>
        <select aria-label={t("Product categories")} title={t("Product categories")} value={params.get('category') ?? ''} onChange={event => filter('category', event.target.value)}>
          <option value="">{t("Categories")}</option>
          {categories.map(({ name }) => <option value={name} key={name}>{t(name)}</option>)}
        </select>
        <button type="button" className="text-button filter-clear" aria-label={t("Clear filters")} title={t("Clear filters")} disabled={!params.size} onClick={() => setParams({})}>
          <X size={18} aria-hidden="true" /><span>{t("Clear filters")}</span>
        </button>
      </div>
    </div>
    <div className="results-bar">
      <p className="results" aria-live="polite">{t('Results')}: {count} {t("· Sample collection")}</p>
      <div className="results-controls"><CurrencySelect compact /><select aria-label={t("Sort by")} title={t("Sort by")} value={params.get('sort') ?? ''} onChange={event => filter('sort', event.target.value)}>
        <option value="">{t("Featured")}</option><option value="asc">{t("Price, low to high")}</option><option value="desc">{t("Price, high to low")}</option><option value="name">{t("Name, A–Z")}</option>
      </select></div>
    </div>
  </>
}

export function Shop() {
  const { t, language } = usePreferences()
  const [params, setParams] = useSearchParams()
  const category = params.get('category')
  const query = params.get('q')?.toLowerCase().trim()
  const price = params.get('price')
  const sort = params.get('sort')
  const results = products.filter(product =>
    (!category || product.category === category) &&
    (!query || [product.name, ...(showProductPlaceholders ? [productPlaceholders.description] : []), product.category ?? "", product.material, ...product.colors].flatMap(value => [value, t(value)]).join(' ').toLowerCase().includes(query)) &&
    (price !== 'under' || product.price < priceThresholds.low) &&
    (price !== 'mid' || (product.price >= priceThresholds.low && product.price <= priceThresholds.middle)) &&
    (price !== 'over' || product.price > priceThresholds.middle),
  )
  if (sort === 'asc') results.sort((a, b) => a.price - b.price)
  if (sort === 'desc') results.sort((a, b) => b.price - a.price)
  if (sort === 'name') results.sort((a, b) => t(a.name).localeCompare(t(b.name), language))
  return <div className="container page">
    <PageMeta title={t("Shop handmade knitwear")} description={t("Browse the Zane Made sample collection of hand-knit scarves, shawls, hats and blankets.")} />
    <div className="page-heading"><h1>{t("The Collection")}</h1><p>{t("Handmade knitwear for cooler days and quiet evenings.")}</p></div>
    <Filters count={results.length} />
    {!showProductPlaceholders && <CurrencyNote />}
    {results.length ? <ProductGrid products={results} /> : <div className="empty"><Search size={30} strokeWidth={1} /><h2>{t("No pieces found.")}</h2><p>{t("Try a different search or clear your filters.")}</p><button className="button" onClick={() => setParams({})}>{t("Clear filters")}</button></div>}
  </div>
}

export function Collections() {
  const { t } = usePreferences()
  return <div className="container page">
    <PageMeta title={t("Collections")} />
    <div className="page-heading"><h1>{t("Shop by Collection")}</h1><p>{t("Find a warm layer to wear or a soft one to bring home.")}</p></div>
    <CategoryGrid />
  </div>
}

export function ProductPage({ id, openCart }: { id: string, openCart: () => void }) {
  const product = findProduct(id)
  if (!product) return <NotFound />
  return <ProductDetail key={id} product={product} openCart={openCart} />
}

function ProductDetail({ product, openCart }: { product: Product, openCart: () => void }) {
  const { t, money } = usePreferences()
  const [photo, setPhoto] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [color, setColor] = useState(product.colors[0])
  const { add } = useCart()
  const name = t(product.name).trim() || t("Product {id}").replace("{id}", product.id)
  const care = materialCare[product.material]
  const sizing = product.category && sizeGuide[product.category]
  const description = t(showProductPlaceholders ? productPlaceholders.description : product.description)
  return <div className="container page product-page">
    <PageMeta title={name} description={description} />
    <nav className="breadcrumb" aria-label={t("Breadcrumb")}><Link to="/shop">{t("Shop")}</Link>{product.category && <><ChevronRight size={13} /><Link to={'/shop?category=' + product.category}>{t(product.category)}</Link></>}</nav>
    <div className={showPhotography ? "product-layout" : "product-layout without-photos"}>
      {showPhotography && <div className="gallery">
        <img className="gallery-main" src={image(product.images[photo])} alt={t(product.name) + ' · ' + (photo ? t('Stitch detail') : t(product.colors[0]))} />
        <div className="gallery-thumbs">{product.images.map((key, index) => <button type="button" key={key} aria-label={t(index ? 'View stitch detail' : 'View full piece')} aria-pressed={photo === index} onClick={() => setPhoto(index)}><img src={image(key)} alt="" /></button>)}</div>
      </div>}
      <div className="product-info">
        <p className="eyebrow">{t("Sample piece")}</p>
        <h1 className={showProductPlaceholders ? "visually-hidden" : undefined}>{name}</h1>
        <p className="price">{showProductPlaceholders ? t(productPlaceholders.price) : money.price(product.price)}</p>
        <p className="product-description">{description}</p>
        <fieldset className="variants"><legend>{t("Color")}</legend>{product.colors.map(option => <label key={option}><input type="radio" name="color" value={option} checked={color === option} onChange={() => setColor(option)} /><span>{t(option)}</span></label>)}</fieldset>
        <div className="purchase"><Quantity value={quantity} change={setQuantity} /><button className="button" onClick={() => { add(product.id, color, quantity); openCart() }}><ShoppingBag size={17} />{" "}{t("Add to Bag")}</button></div>
        <dl className="specs"><div><dt>{t("Materials")}</dt><dd>{t(product.material)}</dd></div>{!showProductPlaceholders && <><div><dt>{t("Dimensions")}</dt><dd>{t(product.dimensions)}</dd></div><div><dt>{t("Sample production time")}</dt><dd>{t(product.leadTime)}</dd></div></>}</dl>
        {showProductPlaceholders && <p className="specs-placeholder">{t(productPlaceholders.description)}</p>}
        {care && <details><summary>{t("Care instructions")}</summary><p>{t(care)}</p></details>}
        {sizing && <details><summary>{t("Size guide")}</summary><p>{t(sizing)}</p></details>}
        <Link className="text-link" to="/shipping">{t("Shipping &amp; Returns")}</Link>
        <div className="handmade-note"><h2>{t("Made by hand, just for you.")}</h2><p>{t("Small variations in stitch, size and texture are part of making each piece by hand.")}</p></div>
      </div>
    </div>
    <div className="related"><h2>{t("Explore more pieces")}</h2><ProductGrid products={products.filter(item => item.id !== product.id).slice(0, 4)} /></div>
  </div>
}

export function NotFound() {
  const { t } = usePreferences()
  return <div className="container page empty"><PageMeta title={t("Page not found")} /><h1>{t("This page is missing.")}</h1><Link className="button" to="/shop">{t("Explore the Collection")}</Link></div>
}
