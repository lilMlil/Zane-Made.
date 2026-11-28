export type FormKind = 'contact' | 'custom' | 'newsletter'

export interface ShippingAddress {
  name: string
  email: string
  country: string
  address: string
  city: string
  postalCode: string
  phone?: string
}

export interface CheckoutItem {
  productId: string
  color: string
  quantity: number
}

export interface CommerceProvider {
  quote(items: CheckoutItem[], address: ShippingAddress, currency: string): Promise<{
    shipping: number
    tax: number
    estimatedDuties?: number
    total: number
    currency: string
  }>
  createCheckout(items: CheckoutItem[], address: ShippingAddress, currency: string): Promise<{ redirectUrl: string }>
}

export async function submitForm(kind: FormKind, data: FormData) {
  const path = import.meta.env.VITE_FORM_ENDPOINT
  if (!path) {
    if (kind === 'newsletter') return 'Preview only. No confirmation email was sent.'
    return 'Your draft passed validation. This preview does not send messages.'
  }
  data.set('kind', kind)
  const response = await fetch(path, { method: 'POST', body: data })
  if (!response.ok) throw new Error('Something went wrong. Please try again.')
  return kind === 'newsletter' ? 'Check your inbox to confirm your subscription.' : 'Your message was sent.'
}
