import { productPlaceholders, showPhotography, showProductPlaceholders } from './storefront'
import { usePreferences } from './preferences'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from './cart'
import { priceThresholds, brand, categories, findProduct, image } from './catalog'
import { CurrencyNote, Form, PageMeta } from './ui'

const faq = [
  ['Can I request a different color or size?', 'Yes. Use the custom order form to describe the piece and any measurements or shades you have in mind.'],
  ['Where are the pieces made?', 'Zane Made is based in Latvia.'],
  ['Can I order from the sample collection?', 'The catalog illustrates the styles the shop can offer. Checkout is in preview and orders are currently unavailable.'],
]

export function CustomOrders() {
  const { t, money } = usePreferences()
  return <div className="container page">
    <PageMeta title={t("Custom Orders")} description={t("Plan a custom scarf, wrap, hat or blanket with Zane Made.")} />
    <div className="page-heading"><p className="eyebrow">{t("Custom orders")}</p><h1>{t("Dream it.")}{" "}<em>{t("We’ll make it.")}</em></h1><p>{t("Tell us about a textile you’d love to wear, gift, or keep close at home.")}</p></div>
    <div className="form-layout">
      <div className="form-aside">{showPhotography && <img src={image('process')} alt={t("Yarn and knitting on a worktable")} />}<h2>{t("Make it yours.")}</h2><p>{t("Think of a longer scarf in a favorite color, a shoulder wrap sized for you, or a blanket that fits your reading chair.")}</p></div>
      <Form kind="custom" button={t("Submit inquiry")}>
        <label>{t("Email address")}<input type="email" required name="email" autoComplete="email" /></label>
        <label>{t("Product type")}<select name="product" required defaultValue=""><option value="" disabled>{t("Choose a piece")}</option>{categories.map(category => <option key={category.name} value={category.name}>{t(category.label)}</option>)}<option value="other">{t("Something else")}</option></select></label>
        <div className="fields-two"><label>{t("Color preferences")}<input name="colors" required placeholder={t("e.g. Oatmeal and olive")} maxLength={150} /></label><label>{t("Desired dimensions")}<input name="dimensions" required placeholder={t("e.g. 30 × 180 cm")} maxLength={150} /></label></div>
        <label>{t("Budget range (optional)")}<select name="budget" defaultValue=""><option value="">{t("Select a range")}</option><option value="under-low">{t("Under {price}").replace("{price}", money.price(priceThresholds.low))}</option><option value="low-middle">{t("{low} – {high}").replace("{low}", money.price(priceThresholds.low)).replace("{high}", money.price(priceThresholds.middle))}</option><option value="middle-high">{t("{low} – {high}").replace("{low}", money.price(priceThresholds.middle)).replace("{high}", money.price(priceThresholds.high))}</option><option value="over-high">{t("Over {price}").replace("{price}", money.price(priceThresholds.high))}</option></select></label>
        <label>{t("Tell us about your idea")}<textarea name="description" rows={5} required maxLength={3000} /></label>
        <label>{t("Inspiration image (optional)")}<input type="file" name="inspiration" accept="image/jpeg,image/png,image/webp" /><small>{t("JPG, PNG or WebP, up to 5 MB.")}</small></label>
        <p className="muted">{!import.meta.env.VITE_FORM_ENDPOINT && t('Preview form. Inquiries are not sent.')}</p>
      </Form>
    </div>
  </div>
}

export function Contact() {
  const { t } = usePreferences()
  return <div className="container page">
    <PageMeta title={t("Contact")} description={t("Get in touch with Zane Made or find answers to common questions about handmade knitwear.")} />
    <div className="page-heading"><h1>{t("Get in touch.")}</h1><p>{t("Questions about a piece, the making process, or a gift idea?")}</p></div>
    <div className="form-layout contact-layout">
      <div><h2>{t("Contact details")}</h2><p>{t(brand.email).endsWith('.example') ? t(brand.email) + ' (' + t('placeholder') + ')' : <a className="text-link" href={'mailto:' + t(brand.email)}>{t(brand.email)}</a>}</p>
        <Link to="/custom" className="text-link">{t("Request a Custom Piece", true)}</Link></div>
      <section id="question" aria-labelledby="question-title">
        <h2 id="question-title">{t("Ask a question")}</h2>
        <Form kind="contact" button={t("Send message")}>
          <label>{t("Name")}<input name="name" autoComplete="name" required maxLength={150} /></label>
          <label>{t("Email")}<input type="email" name="email" autoComplete="email" required /></label>
          <label>{t("Message")}<textarea name="message" required rows={5} maxLength={3000} /></label>
          {!import.meta.env.VITE_FORM_ENDPOINT && <p className="muted">{t("Preview form. Messages are not sent.")}</p>}
        </Form>
      </section>
    </div>
    <section className="faq"><h2>{t("Common questions")}</h2>{faq.map(([question, answer]) => <details key={t(question)}><summary>{t(question)}</summary><p>{t(answer)}</p></details>)}</section>
  </div>
}

const draftPolicies = [
  ['Shipping from Latvia', 'Confirm the dispatch location, packaging, carriers, and shipping options before launch.'],
  ['International shipping', 'Add the countries and regions served, any restrictions, and the rates for each destination.'],
  ['Processing and production time', 'Set separate processing windows for ready pieces and pieces made to order.'],
  ['Delivery estimates', 'Add estimated transit times by destination and carrier, separate from handmade production time.'],
  ['Tracking', 'Confirm which shipping options include tracking and how customers will get updates.'],
  ['Customs duties', 'Confirm how import taxes, duties, and handling fees are shown and collected for each market.'],
  ['EU right of withdrawal', 'For most EU distance sales, consumers have 14 days from receiving the goods to notify the seller that they are withdrawing. [Confirm the notice process, return costs and any exception for goods made to the customer’s specifications or clearly personalised.]'],
  ['Returns', 'Review applicable consumer rights and finalize return windows, conditions, costs, and custom-order terms.'],
  ['Damaged items', 'Specify the contact process, supporting photos, and the remedies available to customers.'],
  ['Contacting Zane Made', 'Add the monitored support address and expected response time.'],
]

export function Shipping() {
  const { t } = usePreferences()
  return <div className="container page policy">
    <PageMeta title={t("Shipping & Returns")} />
    <div className="page-heading"><h1>{t("Shipping &amp; Returns")}</h1><p className="placeholder">{t("Draft policies. Review and finalize before launch.")}</p></div>
    {draftPolicies.map(([heading, content]) => <section key={t(heading)}><h2>{t(heading)}</h2><p>{t(content)}</p></section>)}
    <Link to="/contact" className="text-link">{t("Contact Zane Made")}</Link>
  </div>
}

export function Checkout() {
  const { t, money } = usePreferences()
  const { items } = useCart()
  const [checked, setChecked] = useState(false)
  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setChecked(true)
  }
  return <div className="container page">
    <PageMeta title={t("Checkout Preview")} />
    <div className="page-heading"><h1>{t("Checkout")}</h1><p>{t("Preview only. Payments and orders are unavailable.")}</p></div>
    {!items.length ? <div className="empty"><h2>{t("Your bag is empty.")}</h2><Link className="button" to="/shop">{t("Continue shopping")}</Link></div> :
      <div className="checkout-layout">
        <form className="form" onSubmit={review} onChange={() => setChecked(false)}>
          <h2>{t("Delivery details")}</h2>
          <div className="fields-two"><label>{t("Full name")}<input name="name" autoComplete="name" required /></label><label>{t("Email")}<input name="email" type="email" autoComplete="email" required /></label></div>
          <label>{t("Country or region")}<input name="country" autoComplete="country-name" required /></label>
          <label>{t("Street address")}<textarea name="address" rows={2} autoComplete="street-address" required /></label>
          <div className="fields-two"><label>{t("City")}<input name="city" autoComplete="address-level2" required /></label><label>{t("Postal code (if applicable)")}<input name="postalCode" autoComplete="postal-code" /></label></div>
          <label>{t("Phone (optional)")}<input type="tel" name="phone" autoComplete="tel" /></label>
          <button className="button">{t("Validate delivery details")}</button>
          {checked && <p className="form-feedback" role="status">{t("Delivery fields are filled in. Shipping and payment services are still pending. No order was placed.")}</p>}
        </form>
        <section className="checkout-summary"><h2>{t("Order summary")}</h2>
          {items.map(item => {
            const product = findProduct(item.productId)!
            return <div className="summary-line" key={item.productId + item.color}><span>{!showProductPlaceholders && t(product.name)}<small>{showProductPlaceholders ? t(productPlaceholders.description) : t(item.color)}{" "}{t("· Qty")}{" "}{item.quantity}</small></span><span>{showProductPlaceholders ? t(productPlaceholders.price) : money.price(product.price, item.quantity)}</span></div>
          })}
          <div className="summary-line"><strong>{t("Subtotal")}</strong><strong>{showProductPlaceholders ? t(productPlaceholders.price) : money.total(items.map(item => ({ price: findProduct(item.productId)!.price, quantity: item.quantity })))}</strong></div>
          {!showProductPlaceholders && <CurrencyNote />}<p className="muted">{t("Shipping, taxes and duties are pending configuration.")}</p>
        </section>
      </div>}
  </div>
}
