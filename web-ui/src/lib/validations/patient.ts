import { z } from 'zod'

// Schema para validação de CPF
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
const cpfValidation = z
  .string()
  .regex(cpfRegex, 'CPF deve estar no formato 000.000.000-00')
  .refine(cpf => {
    // Remove pontos e hífen para validação
    const cleanCpf = cpf.replace(/[.-]/g, '')

    // Verifica se tem 11 dígitos
    if (cleanCpf.length !== 11) return false

    // Verifica se não são todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false

    // Validação dos dígitos verificadores
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i)
    }
    let remainder = 11 - (sum % 11)
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCpf.charAt(9))) return false

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i)
    }
    remainder = 11 - (sum % 11)
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCpf.charAt(10))) return false

    return true
  }, 'CPF inválido')

// Schema para validação de telefone
const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/
const phoneValidation = z
  .string()
  .regex(
    phoneRegex,
    'Telefone deve estar no formato (00) 00000-0000 ou (00) 0000-0000'
  )

// Schema para endereço
const addressSchema = z.object({
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z
    .string()
    .min(2, 'Estado deve ter pelo menos 2 caracteres')
    .max(2, 'Estado deve ter no máximo 2 caracteres'),
  zipCode: z
    .string()
    .regex(/^\d{5}-\d{3}$/, 'CEP deve estar no formato 00000-000'),
})

// Schema principal para cadastro de paciente
export const createPatientSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),

  email: z.string().email('Email inválido').optional().or(z.literal('')),

  phone: phoneValidation.optional().or(z.literal('')),

  cpf: cpfValidation.optional().or(z.literal('')),

  birth_date: z.string().refine(date => {
    if (!date) return true // Campo opcional
    const parsedDate = new Date(date)
    const today = new Date()
    const minDate = new Date('1900-01-01')

    return parsedDate <= today && parsedDate >= minDate
  }, 'Data de nascimento deve ser válida e não pode ser futura'),

  gender: z.enum(['male', 'female', 'other']).optional(),

  address: addressSchema.optional(),

  medical_history: z
    .string()
    .max(2000, 'Histórico médico deve ter no máximo 2000 caracteres')
    .optional(),
})

// Schema para edição de paciente (todos os campos opcionais exceto ID)
export const updatePatientSchema = createPatientSchema.partial().extend({
  id: z.string().uuid('ID deve ser um UUID válido'),
})

// Schema para busca/filtros de pacientes
export const patientFiltersSchema = z.object({
  search: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  ageMin: z.number().min(0).max(150).optional(),
  ageMax: z.number().min(0).max(150).optional(),
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z
    .enum(['full_name', 'created_at', 'birth_date'])
    .default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Tipos TypeScript derivados dos schemas
export type CreatePatientInput = z.infer<typeof createPatientSchema>
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>
export type PatientFilters = z.infer<typeof patientFiltersSchema>
export type PatientAddress = z.infer<typeof addressSchema>

// Função utilitária para formatar CPF
export const formatCpf = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '')
  if (cleanValue.length <= 11) {
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
  }
  return value
}

// Função utilitária para formatar telefone
export const formatPhone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '')
  if (cleanValue.length <= 11) {
    if (cleanValue.length <= 10) {
      return cleanValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    } else {
      return cleanValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
    }
  }
  return value
}

// Função utilitária para formatar CEP
export const formatZipCode = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '')
  if (cleanValue.length <= 8) {
    return cleanValue.replace(/(\d{5})(\d)/, '$1-$2')
  }
  return value
}
