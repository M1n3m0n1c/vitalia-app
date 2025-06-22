import '@testing-library/jest-dom'

// Mock global objects that might not be available in test environment
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock LeaderLine for tests
jest.mock('leader-line', () => {
  return jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn(),
    remove: jest.fn(),
    position: jest.fn(),
  }))
})

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Extend Jest matchers for medical application testing
expect.extend({
  toBeAccessible(received) {
    const hasAriaLabel = received.getAttribute('aria-label')
    const hasAriaLabelledBy = received.getAttribute('aria-labelledby')
    const hasRole = received.getAttribute('role')

    const pass = !!(hasAriaLabel || hasAriaLabelledBy || hasRole)

    if (pass) {
      return {
        message: () => `expected ${received} not to be accessible`,
        pass: true,
      }
    } else {
      return {
        message: () =>
          `expected ${received} to be accessible (have aria-label, aria-labelledby, or role)`,
        pass: false,
      }
    }
  },

  toHaveMedicalValidation(received) {
    const hasRequired = received.hasAttribute('required')
    const hasPattern = received.hasAttribute('pattern')
    const hasMinLength = received.hasAttribute('minlength')
    const hasMaxLength = received.hasAttribute('maxlength')

    const pass = !!(hasRequired || hasPattern || hasMinLength || hasMaxLength)

    if (pass) {
      return {
        message: () => `expected ${received} not to have medical validation`,
        pass: true,
      }
    } else {
      return {
        message: () =>
          `expected ${received} to have medical validation attributes`,
        pass: false,
      }
    }
  },
})

// Global test utilities for medical data
global.testUtils = {
  // Mock patient data
  mockPatient: {
    id: '1',
    name: 'João Silva',
    cpf: '123.456.789-00',
    phone: '(11) 99999-9999',
    email: 'joao@email.com',
    birthDate: '1990-01-01',
    createdAt: new Date().toISOString(),
  },

  // Mock questionnaire data
  mockQuestionnaire: {
    id: '1',
    title: 'Anamnese Geral',
    description: 'Questionário de anamnese geral',
    questions: [
      {
        id: '1',
        type: 'text',
        question: 'Qual sua principal queixa?',
        required: true,
      },
    ],
    createdAt: new Date().toISOString(),
  },

  // CPF validation helper
  isValidCPF: cpf => {
    return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)
  },

  // Phone validation helper
  isValidPhone: phone => {
    return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(phone)
  },
}
