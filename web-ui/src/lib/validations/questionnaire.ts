import { z } from 'zod'

// Constantes para categorias e especialidades
const QUESTIONNAIRE_CATEGORIES = [
  'anamnese-geral',
  'estetica-facial',
  'dermatologia',
  'cirurgia-plastica',
  'odontologia',
  'pos-operatorio',
  'satisfacao',
  'outros'
] as const

const MEDICAL_SPECIALTIES = [
  'dermatologia',
  'cirurgia-plastica',
  'medicina-estetica',
  'odontologia',
  'fisioterapia',
  'psicologia',
  'nutricao',
  'endocrinologia',
  'geral',
  'outros'
] as const

// Schema para opções de perguntas
export const questionOptionSchema = z.object({
  id: z.string().min(1, 'ID da opção é obrigatório'),
  label: z.string().min(1, 'Label da opção é obrigatório'),
  value: z.string().min(1, 'Valor da opção é obrigatório')
})

// Schema base para perguntas
const baseQuestionSchema = z.object({
  id: z.string().min(1, 'ID da pergunta é obrigatório'),
  question_text: z.string().min(1, 'Texto da pergunta é obrigatório'),
  required: z.boolean().default(false),
  order: z.number().min(0, 'Ordem deve ser maior ou igual a 0')
})

// Schemas específicos para cada tipo de pergunta
export const textQuestionSchema = baseQuestionSchema.extend({
  question_type: z.literal('text'),
  placeholder: z.string().optional(),
  max_length: z.number().min(1).optional()
})

export const radioQuestionSchema = baseQuestionSchema.extend({
  question_type: z.literal('radio'),
  options: z.array(questionOptionSchema).min(2, 'Pelo menos 2 opções são necessárias')
})

export const checkboxQuestionSchema = baseQuestionSchema.extend({
  question_type: z.literal('checkbox'),
  options: z.array(questionOptionSchema).min(2, 'Pelo menos 2 opções são necessárias'),
  max_selections: z.number().min(1).optional()
})

export const scaleQuestionSchema = baseQuestionSchema.extend({
  question_type: z.literal('scale'),
  min_value: z.number(),
  max_value: z.number(),
  step: z.number().min(0.1).optional(),
  labels: z.object({
    min: z.string().optional(),
    max: z.string().optional()
  }).optional()
}).refine(data => data.max_value > data.min_value, {
  message: 'Valor máximo deve ser maior que o mínimo',
  path: ['max_value']
})

export const sliderQuestionSchema = baseQuestionSchema.extend({
  question_type: z.literal('slider'),
  min_value: z.number(),
  max_value: z.number(),
  step: z.number().min(0.1).optional(),
  labels: z.object({
    min: z.string().optional(),
    max: z.string().optional()
  }).optional()
}).refine(data => data.max_value > data.min_value, {
  message: 'Valor máximo deve ser maior que o mínimo',
  path: ['max_value']
})

export const dateQuestionSchema = baseQuestionSchema.extend({
  question_type: z.literal('date'),
  min_date: z.string().optional(),
  max_date: z.string().optional()
})

export const fileQuestionSchema = baseQuestionSchema.extend({
  question_type: z.literal('file'),
  accepted_types: z.array(z.string()).min(1, 'Pelo menos um tipo de arquivo deve ser aceito'),
  max_size_mb: z.number().min(0.1, 'Tamanho máximo deve ser maior que 0'),
  max_files: z.number().min(1).optional()
})

export const yesNoQuestionSchema = baseQuestionSchema.extend({
  question_type: z.literal('yes_no'),
  labels: z.object({
    yes: z.string().optional(),
    no: z.string().optional(),
    unknown: z.string().optional()
  }).optional()
})

// Union schema para qualquer tipo de pergunta
export const questionSchema = z.union([
  textQuestionSchema,
  radioQuestionSchema,
  checkboxQuestionSchema,
  scaleQuestionSchema,
  sliderQuestionSchema,
  dateQuestionSchema,
  fileQuestionSchema,
  yesNoQuestionSchema
])

// Schema para questionário completo
export const questionnaireSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  description: z.string().max(1000, 'Descrição muito longa').optional(),
  category: z.enum(QUESTIONNAIRE_CATEGORIES).optional(),
  questions: z.array(questionSchema).min(1, 'Pelo menos uma pergunta é necessária'),
  is_active: z.boolean().default(true),
  expires_at: z.string().optional()
}).refine(data => {
  // Validar que os IDs das perguntas são únicos
  const questionIds = data.questions.map(q => q.id)
  return new Set(questionIds).size === questionIds.length
}, {
  message: 'IDs das perguntas devem ser únicos',
  path: ['questions']
}).refine(data => {
  // Validar que as ordens das perguntas são únicas
  const orders = data.questions.map(q => q.order)
  return new Set(orders).size === orders.length
}, {
  message: 'Ordens das perguntas devem ser únicas',
  path: ['questions']
})

// Schema para banco de perguntas
export const questionBankSchema = z.object({
  id: z.string().optional(),
  question_text: z.string().min(1, 'Texto da pergunta é obrigatório'),
  question_type: z.enum(['text', 'radio', 'checkbox', 'scale', 'date', 'file', 'yes_no', 'slider', 'facial_complaints', 'body_complaints']),
  options: z.any().optional(), // JSON field
  category: z.string().optional(),
  specialty: z.enum(MEDICAL_SPECIALTIES).optional(),
  is_default: z.boolean().default(false),
  doctor_id: z.string().optional()
})

// Schema para filtros de questionários
export const questionnaireFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.enum(QUESTIONNAIRE_CATEGORIES).optional(),
  is_active: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10)
})

// Schema para filtros do banco de perguntas
export const questionBankFiltersSchema = z.object({
  search: z.string().optional(),
  question_type: z.enum(['text', 'radio', 'checkbox', 'scale', 'date', 'file', 'yes_no', 'slider', 'facial_complaints', 'body_complaints']).optional(),
  category: z.string().optional(),
  specialty: z.enum(MEDICAL_SPECIALTIES).optional(),
  is_default: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10)
})

// Tipos inferidos dos schemas
export type QuestionnaireFormData = z.infer<typeof questionnaireSchema>
export type QuestionBankFormData = z.infer<typeof questionBankSchema>
export type QuestionnaireFilters = z.infer<typeof questionnaireFiltersSchema>
export type QuestionBankFilters = z.infer<typeof questionBankFiltersSchema> 