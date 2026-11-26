import { defineConfig } from 'vite'
import { showPhotography } from './src/storefront'

export default defineConfig({
  publicDir: showPhotography ? 'public' : false,
})
