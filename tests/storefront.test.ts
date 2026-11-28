import { describe, expect, it } from 'vitest'
import { filterStoredItems, updateCart } from '../src/cart'
import { copyKeys, validCopy } from '../src/copy'
import { createMoneyFormatter } from '../src/currency'
import { translations } from '../src/translations'

const line = { productId: 'sunday', color: 'Oat Milk', quantity: 2 }
const update = (items: typeof line[], quantity: number, add = false) =>
  updateCart(items, line.productId, line.color, quantity, add)

describe('cart', () => {
  it('adds items and combines quantities for the same color', () => {
    expect(update([], 2, true)).toEqual([line])
    expect(update([line], 3, true)).toEqual([{ ...line, quantity: 5 }])
    expect(updateCart([line], 'sunday', 'Warm Sand', 1, true)).toHaveLength(2)
  })
  it('changes quantities and removes a line at zero', () => {
    expect(update([line], 1)).toEqual([{ ...line, quantity: 1 }])
    expect(update([line], 0)).toEqual([])
  })
  it('caps additions and changes at 99', () => {
    expect(update([line], 100, true)[0].quantity).toBe(99)
    expect(update([line], 100)[0].quantity).toBe(99)
  })
  it('filters invalid stored lines', () => {
    expect(filterStoredItems([null, {}, line, { ...line, productId: 'missing' }, { ...line, color: 'unknown' },
      ...[0, -1, 100, 1.5, '2'].map(quantity => ({ ...line, quantity })),
    ])).toEqual([line])
    expect(filterStoredItems({})).toEqual([])
  })
})

describe('currency', () => {
  it('formats prices and rounds converted units', () => {
    expect(createMoneyFormatter('en', 'EUR').price(68)).toBe('€68.00')
    expect(createMoneyFormatter('en', 'USD').price(68)).toMatch(/74\.63$/)
  })
  it('sums per-unit rounding instead of rounding after multiplication', () => {
    const formatter = createMoneyFormatter('en', 'USD')
    expect(formatter.price(68, 2)).toMatch(/149\.26$/)
    expect(formatter.total([{ price: 68, quantity: 2 }])).toBe(formatter.price(68, 2))
  })
  it('uses zero decimal places for JPY', () => {
    const formatter = createMoneyFormatter('en', 'JPY')
    expect(formatter.price(1)).toMatch(/175$/)
    expect(formatter.price(1, 2)).toMatch(/350$/)
  })
})

it('has Latvian and Russian copy with intact placeholders', () => {
  const missing = copyKeys.filter(key => !translations[key]?.every(value => value && validCopy(key, value)))
  expect(missing).toEqual([])
})
