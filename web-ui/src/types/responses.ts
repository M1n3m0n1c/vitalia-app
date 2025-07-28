export interface QuestionnaireResponse {
  id: string
  questionnaire_id: string
  patient_id: string
  answers: Answer[]
  completed_at: string
  created_at: string
  questionnaires: {
    id: string
    title: string
    description?: string
    questions: Question[]
    category?: string
    doctor_id: string
  }
  patients: {
    id: string
    full_name: string
    email?: string
    phone?: string
    cpf?: string
    birth_date?: string
    gender?: 'male' | 'female' | 'other'
  }
}

export interface Answer {
  question_id: string
  value: any
  question_text?: string
  question_type?: string
}

export interface Question {
  id: string
  question_text: string
  question_type: string
  options?: Array<{
    id: string
    label: string
    value: string
  }>
  required?: boolean
}

export interface ResponsesListResponse {
  data: QuestionnaireResponse[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ResponseDetailResponse {
  data: QuestionnaireResponse
} 