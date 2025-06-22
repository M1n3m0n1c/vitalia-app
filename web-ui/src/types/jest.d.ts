import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAccessible(): R
      toHaveMedicalValidation(): R
    }
  }
} 