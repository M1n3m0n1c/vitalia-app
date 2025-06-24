// Tipos para histórico do paciente

export type HistoryItemType =
  | 'response'
  | 'note'
  | 'image'
  | 'appointment'
  | 'document'

export interface HistoryItem {
  id: string
  type: HistoryItemType
  title: string
  description: string
  category: string
  date: string
  data: any // Dados específicos de cada tipo
}

export interface ResponseHistoryData {
  questionnaire_id: string
  answers: any
  questionnaire: {
    id: string
    title: string
    description?: string
    category?: string
  }
}

export interface NoteHistoryData {
  response_id?: string
  question_id?: string
}

export interface ImageHistoryData {
  file_path: string
  category: string
  tags?: string[]
  body_region?: string
}

export interface AppointmentHistoryData {
  start_time: string
  end_time: string
  status: string
}

export interface DocumentHistoryData {
  document_type: string
  file_name: string
  original_name: string
  file_size: number
  mime_type: string
  tags?: string[]
  is_sensitive: boolean
}

export interface HistoryStats {
  total: number
  responses: number
  notes: number
  images: number
  appointments: number
  documents: number
}

export interface HistoryResponse {
  patient: {
    id: string
    name: string
  }
  history: HistoryItem[]
  stats: HistoryStats
  pagination: {
    limit: number
    offset: number
    total: number
    hasMore: boolean
  }
}

export interface HistoryFilters {
  type?: HistoryItemType | 'all'
  limit?: number
  offset?: number
  dateFrom?: string
  dateTo?: string
  category?: string
}

// Labels para exibição
export const HISTORY_TYPE_LABELS: Record<HistoryItemType, string> = {
  response: 'Questionário',
  note: 'Anotação',
  image: 'Imagem',
  appointment: 'Consulta',
  document: 'Documento',
}

// Cores para cada tipo de histórico
export const HISTORY_TYPE_COLORS: Record<HistoryItemType, string> = {
  response: 'bg-blue-100 text-blue-800',
  note: 'bg-green-100 text-green-800',
  image: 'bg-purple-100 text-purple-800',
  appointment: 'bg-orange-100 text-orange-800',
  document: 'bg-gray-100 text-gray-800',
}

// Ícones para cada tipo de histórico
export const HISTORY_TYPE_ICONS: Record<HistoryItemType, any> = {
  response: 'FileText',
  note: 'StickyNote',
  image: 'Image',
  appointment: 'Calendar',
  document: 'File',
}
