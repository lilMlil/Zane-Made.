// ECB euro foreign exchange reference rates, 2026-11-26.
export const ratesDate = '2026-11-26'
const rates = {
  EUR: 1,
  USD: 1.0975,
  GBP: 0.83755,
  CAD: 1.5617,
  AUD: 1.6540,
  CHF: 0.9153,
  JPY: 174.79,
  PLN: 4.4838,
  SEK: 11.2025,
} as const

export type Currency = keyof typeof rates
export const currencies = Object.keys(rates) as Currency[]

export function isCurrency(value: unknown): value is Currency {
  return typeof value === 'string' && Object.hasOwn(rates, value)
}

export function createMoneyFormatter(language: string, currency: Currency) {
  const formatter = new Intl.NumberFormat(language === 'en' ? 'en-IE' : language, {
    style: 'currency',
    currency,
  })
  const factor = 10 ** (formatter.resolvedOptions().maximumFractionDigits ?? 2)
  const unit = (euros: number) => Math.round(euros * rates[currency] * factor)
  return {
    price: (euros: number, quantity = 1) => formatter.format(unit(euros) * quantity / factor),
    total: (lines: { price: number, quantity: number }[]) => formatter.format(
      lines.reduce((sum, line) => sum + unit(line.price) * line.quantity, 0) / factor,
    ),
  }
}
