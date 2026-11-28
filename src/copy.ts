import { brand, categories, materialCare, products, sizeGuide } from './catalog'
import published from './published-copy.json'
import { legalPages } from './legal-content'
import { productPlaceholders } from './storefront'
import { translations } from './translations'

export const languages = ['en', 'ru', 'lv'] as const
export type CopyLanguage = typeof languages[number]
export type CopyOverrides = Partial<Record<CopyLanguage, Record<string, string>>>

export const copyKeys = [...new Set([
  ...Object.keys(translations),
  ...Object.values(materialCare),
  ...Object.values(sizeGuide),
  ...Object.values(legalPages).flatMap(page => [page.title, ...page.sections.flat()]),
  ...Object.values(productPlaceholders),
  brand.announcement, brand.founderStory, brand.email,
  ...categories.flatMap(({ name, label }) => [name, label]),
  ...products.flatMap(product => [
    product.name, product.material, product.dimensions, product.description,
    product.leadTime, ...product.colors,
  ]),
  'Zane', 'Made', 'Zane Made', 'Facebook', 'TikTok', 'YouTube',
  '{low} – {high}',
])]
const allowed = new Set([...copyKeys, 'Instagram', 'Instagram profile coming soon.'])
const storageKey = 'zane-copy-draft'
const maxLength = 12000

function placeholders(text: string) {
  return text.match(/\{[a-z]+\}/g)?.sort().join(',') ?? ''
}

export function validCopy(key: string, value: unknown): value is string {
  return allowed.has(key) && typeof value === 'string' && value.length <= maxLength &&
    placeholders(key) === placeholders(value)
}

export function parseOverrides(value: unknown): CopyOverrides {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid text file')
  const parsed: CopyOverrides = {}
  for (const [language, entries] of Object.entries(value)) {
    if (!languages.some(code => code === language) || !entries || typeof entries !== 'object' || Array.isArray(entries)) {
      throw new Error('Invalid language')
    }
    parsed[language as CopyLanguage] = Object.fromEntries(Object.entries(entries).map(([key, text]) => {
      if (!validCopy(key, text)) throw new Error('Invalid text entry')
      return [key, text]
    }))
  }
  return parsed
}

const publishedCopy = parseOverrides(published)

export function baseCopy(key: string, language: CopyLanguage) {
  const localized = language === 'en' ? undefined : translations[key]?.[language === 'ru' ? 0 : 1]
  return localized ?? key.replaceAll('&amp;', '&')
}

export function defaultCopy(key: string, language: CopyLanguage) {
  return publishedCopy[language]?.[key] ?? baseCopy(key, language)
}

export function readDraft() {
  try { return parseOverrides(JSON.parse(localStorage.getItem(storageKey) ?? '{}')) } catch { return {} }
}

export function saveDraft(draft: CopyOverrides) {
  localStorage.setItem(storageKey, JSON.stringify(draft))
}
