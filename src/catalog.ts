export const brand = {
  announcement: 'Handmade with love · Shipping worldwide',
  email: 'hello@zanemade.example',
  founderStory: '[Add the founder’s story here, including what first drew them to knitting or weaving.]',
}

export const categories = [
  { name: 'Scarves', label: 'Scarves', image: 'sunday' },
  { name: 'Shawls', label: 'Shawls', image: 'winter' },
  { name: 'Hats', label: 'Hats', image: 'beanie' },
  { name: 'Blankets', label: 'Blankets', image: 'cloud' },
] as const

type Category = typeof categories[number]['name']
export interface Product {
  id: string
  name: string
  category?: Category
  price: number
  material: string
  dimensions: string
  colors: string[]
  description: string
  leadTime: string
  images: string[]
}

export const products: Product[] = [
  { id: 'sunday', name: 'The Sunday Scarf', category: 'Scarves', price: 68, material: 'Merino wool', dimensions: '26 × 180 cm', colors: ['Oat Milk', 'Warm Sand'], description: 'A generous scarf with an easy drape and a soft, tactile stitch. Finished with a hand-tied fringe for a little movement.', leadTime: '1–2 weeks', images: ['sunday', 'sunday-detail'] },
  { id: 'morning', name: 'Soft Morning Wrap', price: 112, material: 'Alpaca and wool blend', dimensions: '55 × 175 cm', colors: ['Warm Taupe', 'Natural Cream'], description: 'An airy shoulder wrap for cool mornings and the last hours of daylight. The brushed yarn gives it a soft halo.', leadTime: '2–3 weeks', images: ['morning', 'morning-detail'] },
  { id: 'beanie', name: 'The Everyday Beanie', category: 'Hats', price: 44, material: 'Merino wool', dimensions: '54–59 cm circumference', colors: ['Cocoa', 'Oat Milk'], description: 'A soft ribbed cap with a turn-up brim. The stretchy knit makes it an easy layer for everyday wear.', leadTime: '1–2 weeks', images: ['beanie', 'beanie-detail'] },
  { id: 'cloud', name: 'Cloud Blanket', category: 'Blankets', price: 168, material: 'Undyed wool blend', dimensions: '110 × 150 cm', colors: ['Natural Cream'], description: 'A weighty, textured throw with a simple border, designed to stay within reach on colder days.', leadTime: '3–4 weeks', images: ['cloud', 'cloud-detail'] },
  { id: 'warmth', name: 'Warmth No. 01', category: 'Scarves', price: 76, material: 'Lambswool', dimensions: '28 × 190 cm', colors: ['Dried Olive'], description: 'A deep green scarf worked in a dense, softly ridged stitch. Long enough to wrap twice.', leadTime: '1–2 weeks', images: ['warmth', 'warmth-detail'] },
  { id: 'winter', name: 'The Slow Winter Shawl', category: 'Shawls', price: 128, material: 'Wool and alpaca', dimensions: '165 × 72 cm', colors: ['Rose Oat'], description: 'An openwork triangular shawl with a light feel and a scalloped edge. Wear it over the shoulders or loosely around the neck.', leadTime: '2–3 weeks', images: ['winter', 'winter-detail'] },
]

export const image = (key: string) => '/images/' + key + '.webp'
export const findProduct = (id: string) => products.find(product => product.id === id)
