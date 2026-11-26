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

function initialCart(): CheckoutItem[] {
  try {
    const items: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    return Array.isArray(items) ? items.filter(item =>
      item && findProduct(item.productId)?.colors.includes(item.color) &&
      Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99,
    ) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(initialCart)
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(items)) } catch { /* Storage may be disabled. */ }
  }, [items])

  function update(id: string, color: string, quantity: number, add: boolean) {
    if (!findProduct(id)?.colors.includes(color) || !Number.isInteger(quantity)) return
    setItems(current => {
      const matches = (item: CheckoutItem) => item.productId === id && item.color === color
      const existing = current.find(matches)
      const next = Math.min(99, quantity + (add ? existing?.quantity ?? 0 : 0))
      if (next <= 0) return current.filter(item => !matches(item))
      return existing
        ? current.map(item => matches(item) ? { ...item, quantity: next } : item)
        : [...current, { productId: id, color, quantity: next }]
    })
  }
  return <CartContext.Provider value={{
    items,
    count: items.reduce((total, item) => total + item.quantity, 0),
    add: (id, color, quantity) => update(id, color, quantity, true),
    change: (id, color, quantity) => update(id, color, quantity, false),
  }}>{children}</CartContext.Provider>
}

export function useCart() {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('CartProvider is required')
  return cart
}
