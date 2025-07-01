export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface ValidationRule<T> {
  test: (value: T) => boolean
  message: string
}

export class Validator<T> {
  private rules: ValidationRule<T>[] = []

  addRule(rule: ValidationRule<T>): this {
    this.rules.push(rule)
    return this
  }

  validate(value: T): ValidationResult {
    const errors: string[] = []
    
    for (const rule of this.rules) {
      if (!rule.test(value)) {
        errors.push(rule.message)
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Validadores específicos
export const emailValidator = new Validator<string>()
  .addRule({
    test: (email) => !!email.trim(),
    message: 'Email é obrigatório'
  })
  .addRule({
    test: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    message: 'Email deve ter um formato válido'
  })

export const passwordValidator = new Validator<string>()
  .addRule({
    test: (password) => !!password,
    message: 'Senha é obrigatória'
  })
  .addRule({
    test: (password) => password.length >= 6,
    message: 'Senha deve ter pelo menos 6 caracteres'
  })

export const nameValidator = new Validator<string>()
  .addRule({
    test: (name) => !!name.trim(),
    message: 'Nome é obrigatório'
  })
  .addRule({
    test: (name) => name.trim().length >= 2,
    message: 'Nome deve ter pelo menos 2 caracteres'
  })

export const priceValidator = new Validator<number>()
  .addRule({
    test: (price) => !isNaN(price),
    message: 'Preço deve ser um número válido'
  })
  .addRule({
    test: (price) => price > 0,
    message: 'Preço deve ser maior que zero'
  })

// Funções de validação simples
export function isValidEmail(email: string): boolean {
  return emailValidator.validate(email).isValid
}

export function isValidPassword(password: string): boolean {
  return passwordValidator.validate(password).isValid
}

export function isValidName(name: string): boolean {
  return nameValidator.validate(name).isValid
}

export function isValidPrice(price: number): boolean {
  return priceValidator.validate(price).isValid
}

// Sanitização
export function sanitizeString(str: string): string {
  return str.trim().replace(/\s+/g, ' ')
}

export function sanitizePrice(price: string | number): number {
  if (typeof price === 'number') return price
  
  const cleaned = price.replace(/[^\d.,]/g, '').replace(',', '.')
  const parsed = parseFloat(cleaned)
  
  return isNaN(parsed) ? 0 : parsed
}
