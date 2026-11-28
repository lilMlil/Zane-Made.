import { showPhotography } from './storefront'
import { usePreferences } from './preferences'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Heart, MapPin, Sprout } from 'lucide-react'
import { brand, image, products } from './catalog'
import { CategoryGrid, PageMeta, ProductGrid } from './ui'

const intro = 'Zane Made is a small handmade project built around the beauty of creating things by hand. Every piece takes time, care, and a love for textures, colors, and the little details that make something feel special.'

export function Home() {
  const { t } = usePreferences()
  return <>
    <PageMeta />
    <section className={showPhotography ? "hero" : "hero without-photos"}>
      {showPhotography && <img className="hero-photo" src={image('hero')} fetchPriority="high" alt={t("Woman wrapped in a hand-knit ivory scarf")} />}
      <div className="hero-inner">
        <p className="eyebrow">{t("Handmade textiles from Latvia")}</p>
        <h1>{t("Made slowly.")}<br />{t("Made with love.")}<br /><em>{t("Made to last.")}</em></h1>
        <p className="hero-copy">{t("Handcrafted textile pieces made with care, texture, and a little bit of magic.")}</p>
        <div className="hero-actions"><Link className="button" to="/shop">{t("Shop Collection")}</Link><Link className="button outline" to="/about">{t("Discover Our Story")}</Link></div>
      </div>
    </section>
    <div className="values">
      <span><Heart size={18} />{" "}{t("Made by hand")}</span><span><Sprout size={18} />{" "}{t("Natural textures")}</span><span><MapPin size={18} />{" "}{t("From Latvia")}</span>
    </div>
    <section className="container section featured">
      <div className="section-heading"><div><p className="eyebrow">{t("The collection")}</p><h2>{t("Soft things, made slowly.")}</h2></div><Link className="text-link" to="/shop">{t("View all pieces")}{" "}<ArrowUpRight size={15} /></Link></div>
      <ProductGrid products={products.slice(0, 4)} />
    </section>
    <section className={showPhotography ? "editorial-split" : "editorial-split without-photos"}>
      {showPhotography && <img src={image('process')} alt={t("Hands knitting cream wool at a wooden table")} loading="lazy" />}
      <div><p className="eyebrow">{t("Our story")}</p><h2>{t("A little slower.")}<br /><em>{t("A little more personal.")}</em></h2><p>{t(intro)}</p><Link className="text-link" to="/about">{t("Read our story")}{" "}<ArrowUpRight size={15} /></Link></div>
    </section>
    <section className="container section">
      <div className="section-heading"><h2>{t("Find your fit.")}</h2><Link className="text-link" to="/collections">{t("View collections")}{" "}<ArrowUpRight size={15} /></Link></div>
      <CategoryGrid />
    </section>
    <section className="custom-banner"><p className="eyebrow">{t("Custom orders")}</p><h2>{t("Dream it.")}{" "}<em>{t("We’ll make it.")}</em></h2><p>{t("Have a specific color, size, or idea in mind? Let’s create something made just for you.")}</p><Link className="button" to="/custom">{t("Request a Custom Piece", true)}</Link></section>
  </>
}

export function About() {
  const { t } = usePreferences()
  const founderStory = t(brand.founderStory).replace(/^[|\s]+$|(?:\r?\n)[ \t]*\|[ \t]*$/g, '').trim()
  return <div className="page">
    <PageMeta title={t("Our Story")} description={t("Learn about the materials, making process and philosophy behind Zane Made.")} />
    <div className="container page-heading"><p className="eyebrow">{t("Our story")}</p><h1>{t("Every piece has a story.")}<br /><em>{t("This one begins with yarn.")}</em></h1><p>{t(intro)}</p></div>
    <section className={showPhotography ? "editorial-split" : "editorial-split without-photos"}>
      {showPhotography && <img src={image('process')} alt={t("Cream wool being knit by hand")} />}
      <div><h2>{t("Why handmade matters")}</h2><p>{t("Making a piece by hand leaves room to adjust the stitch, change the edge, and notice how the yarn behaves. These small decisions shape how a piece feels when you wear it.")}</p>{founderStory && !founderStory.startsWith("[") && <p>{founderStory}</p>}</div>
    </section>
    <div className="container section story-grid">
      <section><h2>{t("The process")}</h2><p>{t("A swatch helps settle the stitch and tension. The textile is then knitted or woven, finished, and shaped so it falls as intended.")}</p></section>
      <section><h2>{t("The materials")}</h2><p>{t("Merino, lambswool, and alpaca blends bring different qualities to a piece, from a fine, springy rib to the soft halo of a shoulder wrap.")}</p></section>
      <section><h2>{t("The philosophy")}</h2><p>{t("Make time for the details. Choose a shape that works with everyday clothes. Make pieces people can reach for season after season.")}</p></section>
    </div>
  </div>
}
