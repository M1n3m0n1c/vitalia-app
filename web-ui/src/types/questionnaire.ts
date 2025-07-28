import { QuestionType } from '@/lib/supabase/database.types'

// Tipos para as opções de perguntas
export interface QuestionOption {
  id: string
  label: string
  value: string
}

// Tipos para diferentes tipos de perguntas
export interface BaseQuestion {
  id: string
  question_text: string
  question_type: QuestionType
  required: boolean
  order: number
}

export interface TextQuestion extends BaseQuestion {
  question_type: 'text'
  placeholder?: string
  max_length?: number
}

export interface RadioQuestion extends BaseQuestion {
  question_type: 'radio'
  options: QuestionOption[]
}

export interface CheckboxQuestion extends BaseQuestion {
  question_type: 'checkbox'
  options: QuestionOption[]
  max_selections?: number
}

export interface ScaleQuestion extends BaseQuestion {
  question_type: 'scale'
  min_value: number
  max_value: number
  step?: number
  labels?: {
    min?: string
    max?: string
  }
}

export interface SliderQuestion extends BaseQuestion {
  question_type: 'slider'
  min_value: number
  max_value: number
  step?: number
  labels?: {
    min?: string
    max?: string
  }
}

export interface DateQuestion extends BaseQuestion {
  question_type: 'date'
  min_date?: string
  max_date?: string
}

export interface FileQuestion extends BaseQuestion {
  question_type: 'file'
  accepted_types: string[]
  max_size_mb: number
  max_files?: number
}

export interface YesNoQuestion extends BaseQuestion {
  question_type: 'yes_no'
  labels?: {
    yes?: string
    no?: string
    unknown?: string
  }
}

export interface FacialComplaintsQuestion extends BaseQuestion {
  question_type: 'facial_complaints'
}

export interface BodyComplaintsQuestion extends BaseQuestion {
  question_type: 'body_complaints'
}

// Union type para todos os tipos de perguntas
export type Question = 
  | TextQuestion 
  | RadioQuestion 
  | CheckboxQuestion 
  | ScaleQuestion 
  | SliderQuestion 
  | DateQuestion 
  | FileQuestion 
  | YesNoQuestion
  | FacialComplaintsQuestion
  | BodyComplaintsQuestion

// Tipos para respostas
export interface BaseAnswer {
  question_id: string
  question_type: QuestionType
}

export interface TextAnswer extends BaseAnswer {
  question_type: 'text'
  value: string
}

export interface RadioAnswer extends BaseAnswer {
  question_type: 'radio'
  selected_option: string
}

export interface CheckboxAnswer extends BaseAnswer {
  question_type: 'checkbox'
  selected_options: string[]
}

export interface ScaleAnswer extends BaseAnswer {
  question_type: 'scale'
  value: number
}

export interface SliderAnswer extends BaseAnswer {
  question_type: 'slider'
  value: number
}

export interface DateAnswer extends BaseAnswer {
  question_type: 'date'
  value: string
}

export interface FileAnswer extends BaseAnswer {
  question_type: 'file'
  files: {
    name: string
    url: string
    size: number
    type: string
  }[]
}

export interface YesNoAnswer extends BaseAnswer {
  question_type: 'yes_no'
  value: 'yes' | 'no' | 'unknown'
}

export interface FacialComplaintsAnswer extends BaseAnswer {
  question_type: 'facial_complaints'
  value: string[]
}

export interface BodyComplaintsAnswer extends BaseAnswer {
  question_type: 'body_complaints'
  value: string[]
}

// Union type para todas as respostas
export type Answer = 
  | TextAnswer 
  | RadioAnswer 
  | CheckboxAnswer 
  | ScaleAnswer 
  | SliderAnswer 
  | DateAnswer 
  | FileAnswer 
  | YesNoAnswer
  | FacialComplaintsAnswer
  | BodyComplaintsAnswer

// Tipos para questionário completo
export interface QuestionnaireData {
  id?: string
  title: string
  description?: string
  category?: string
  specialty?: MedicalSpecialty
  questions: Question[]
  is_active?: boolean
  expires_at?: string
}

// Tipos para resposta completa
export interface ResponseData {
  id?: string
  questionnaire_id: string
  patient_id: string
  answers: Answer[]
  completed_at?: string
}

// Tipos para categorias predefinidas
export const QUESTIONNAIRE_CATEGORIES = [
  'anamnese-geral',
  'estetica-facial',
  'dermatologia',
  'cirurgia-plastica',
  'odontologia',
  'pos-operatorio',
  'satisfacao',
  'outros'
] as const

export type QuestionnaireCategory = typeof QUESTIONNAIRE_CATEGORIES[number]

// Tipos para especialidades médicas
export const MEDICAL_SPECIALTIES = [
  'dermatologia',
  'cirurgia-plastica',
  'medicina-estetica',
  'odontologia',
  'oftalmologia',
  'ortopedia',
  'cardiologia',
  'ginecologia',
  'outros'
] as const

export type MedicalSpecialty = typeof MEDICAL_SPECIALTIES[number] 