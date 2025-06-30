export function priceByRole(role: string, base: number): number {
  switch (role) {
    case 'shop':
      return base * 0.9
    case 'distributor':
      return base * 0.8
    case 'admin':
      return base
    default:
      return base * 1.1
  }
}
