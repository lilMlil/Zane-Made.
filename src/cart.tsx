import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { findProduct } from './catalog'
import type { CheckoutItem } from './services'

type Cart = {
  items: CheckoutItem[]
  count: number
  add: (id: string, color: string, quantity: number) => void
  change: (id: string, color: string, quantity: number) => void
}
const CartContext = createContext<Cart | null>(null)
const storageKey = 'zane-made-cart-v1'

export function filterStoredItems(items: unknown): CheckoutItem[] {
  if (!Array.isArray(items)) return []
  return items.filter(item => item && findProduct(item.productId)?.colors.includes(item.color) &&
    Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99)
}

export function updateCart(items: CheckoutItem[], id: string, color: string, quantity: number, add: boolean): CheckoutItem[] {
  if (!findProduct(id)?.colors.includes(color) || !Number.isInteger(quantity)) return items
  const matches = (item: CheckoutItem) => item.productId === id && item.color === color
  const existing = items.find(matches)
  const next = Math.min(99, quantity + (add ? existing?.quantity ?? 0 : 0))
  if (next <= 0) return items.filter(item => !matches(item))
  return existing
    ? items.map(item => matches(item) ? { ...item, quantity: next } : item)
    : [...items, { productId: id, color, quantity: next }]
}

function initialCart(): CheckoutItem[] {
  try {
    return filterStoredItems(JSON.parse(localStorage.getItem(storageKey) ?? '[]'))
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(initialCart)
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(items)) } catch { /* Storage may be disabled. */ }
  }, [items])

  return <CartContext.Provider value={{
    items,
    count: items.reduce((total, item) => total + item.quantity, 0),
    add: (id, color, quantity) => setItems(current => updateCart(current, id, color, quantity, true)),
    change: (id, color, quantity) => setItems(current => updateCart(current, id, color, quantity, false)),
  }}>{children}</CartContext.Provider>
}

export function useCart() {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('CartProvider is required')
  return cart
}
