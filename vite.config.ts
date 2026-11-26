import { defineConfig } from 'vite'
import { showPhotography } from './src/storefront'

export default defineConfig(({ mode }) => ({
  base: mode === 'github-pages' ? process.env.ZANE_PAGES_BASE ?? '/Zane-Made/' : '/',
  publicDir: showPhotography ? 'public' : false,
}))
