type UserRole = 'consumer' | 'shop' | 'distributor' | 'admin'

interface PriceConfig {
  consumer: number
  shop: number
  distributor: number
  admin: number
}

const PRICE_MULTIPLIERS: PriceConfig = {
  consumer: 1.1,     // +10%
  shop: 0.9,         // -10%
  distributor: 0.8,  // -20%
  admin: 1.0         // preço base
}

export function priceByRole(role: UserRole, base: number): number {
  const multiplier = PRICE_MULTIPLIERS[role] || PRICE_MULTIPLIERS.consumer
  return Math.round(base * multiplier * 100) / 100 // Arredondar para 2 casas decimais
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

export function getDiscountPercentage(role: UserRole): number {
  const multiplier = PRICE_MULTIPLIERS[role]
  if (multiplier >= 1) return 0
  return Math.round((1 - multiplier) * 100)
}

export function getPriceWithDiscount(basePrice: number, role: UserRole): {
  originalPrice: number
  finalPrice: number
  discount: number
  discountPercentage: number
} {
  const finalPrice = priceByRole(role, basePrice)
  const discount = basePrice - finalPrice
  const discountPercentage = getDiscountPercentage(role)
  
  return {
    originalPrice: basePrice,
    finalPrice,
    discount,
    discountPercentage
  }
}
