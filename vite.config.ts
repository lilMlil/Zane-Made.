import { defineConfig } from 'vite'
import { showPhotography } from './src/storefront'
import { products } from './src/catalog'
import { legalPages } from './src/legal-content'

export default defineConfig(({ mode }) => {
  const base = mode === 'github-pages' ? process.env.ZANE_PAGES_BASE ?? '/Zane-Made/' : '/'
  const site = process.env.ZANE_SITE_URL ?? 'https://lilmlil.github.io/Zane-Made./'
  const routes = ['', 'shop', 'collections', 'about', 'custom', 'contact', 'shipping',
    ...Object.keys(legalPages).map(path => path.slice(1)), ...products.map(product => 'product/' + product.id)]
  const urls = routes.map(route => new URL(route, site).href.replaceAll('&', '&amp;'))
  return {
    base,
    publicDir: showPhotography ? 'public' : false,
    plugins: [{
      name: 'storefront-search-metadata',
      apply: 'build',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', site)}\n` })
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls.map(url => `  <url><loc>${url}</loc></url>`),
          '</urlset>',
        ].join('\n') })
      },
    }],
  }
})
