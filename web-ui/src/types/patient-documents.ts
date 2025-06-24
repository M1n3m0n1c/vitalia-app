// Tipos para documentos de pacientes
export type DocumentType =
  | 'identity' // RG, CNH, etc.
  | 'medical' // Exames, laudos médicos
  | 'insurance' // Plano de saúde
  | 'consent' // Termos de consentimento
  | 'prescription' // Receitas médicas
  | 'report' // Relatórios
  | 'other' // Outros documentos

export interface PatientDocument {
  id: string
  patient_id: string
  doctor_id: string

  // Informações do arquivo
  file_name: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string

  // Metadados do documento
  document_type: DocumentType
  title: string
  description?: string
  tags?: string[]

  // Controle de acesso
  is_sensitive: boolean

  // Timestamps
  created_at: string
  updated_at: string
}

export interface CreatePatientDocumentData {
  patient_id: string
  document_type: DocumentType
  title: string
  description?: string
  tags?: string[]
  is_sensitive?: boolean
}

export interface UpdatePatientDocumentData {
  document_type?: DocumentType
  title?: string
  description?: string
  tags?: string[]
  is_sensitive?: boolean
}

// Mapeamento de tipos de documento para labels em português
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  identity: 'Documento de Identidade',
  medical: 'Documento Médico',
  insurance: 'Plano de Saúde',
  consent: 'Termo de Consentimento',
  prescription: 'Receita Médica',
  report: 'Relatório',
  other: 'Outros',
}

// Cores para cada tipo de documento (para UI)
export const DOCUMENT_TYPE_COLORS: Record<DocumentType, string> = {
  identity: 'bg-blue-100 text-blue-800',
  medical: 'bg-green-100 text-green-800',
  insurance: 'bg-purple-100 text-purple-800',
  consent: 'bg-orange-100 text-orange-800',
  prescription: 'bg-pink-100 text-pink-800',
  report: 'bg-yellow-100 text-yellow-800',
  other: 'bg-gray-100 text-gray-800',
}

// Ícones para cada tipo de documento
export const DOCUMENT_TYPE_ICONS: Record<DocumentType, string> = {
  identity: '🆔',
  medical: '🏥',
  insurance: '🛡️',
  consent: '📝',
  prescription: '💊',
  report: '📊',
  other: '📄',
}
