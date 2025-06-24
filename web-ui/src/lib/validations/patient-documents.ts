import { z } from 'zod'

import type { DocumentType } from '@/types/patient-documents'

const DOCUMENT_TYPES: DocumentType[] = [
  'identity',
  'medical',
  'insurance',
  'consent',
  'prescription',
  'report',
  'other',
]

// Schema para criação de documento (formulário frontend)
export const createPatientDocumentSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  document_type: z.enum(DOCUMENT_TYPES as [DocumentType, ...DocumentType[]]),
  tags: z
    .array(z.string().max(50, 'Tag deve ter no máximo 50 caracteres'))
    .max(10, 'Máximo 10 tags permitidas')
    .optional(),
  is_sensitive: z.boolean().optional(),
})

// Schema para criação de documento no backend (inclui patient_id)
export const createPatientDocumentWithIdSchema = createPatientDocumentSchema.extend({
  patient_id: z.string().uuid('ID do paciente deve ser um UUID válido'),
})

// Schema para atualização de documento
export const updatePatientDocumentSchema = createPatientDocumentSchema.partial()

// Schema para upload de arquivo
export const uploadFileSchema = z
  .custom<File>(file => file instanceof File, 'Arquivo é obrigatório')
  .refine(
    file => file.size <= 10 * 1024 * 1024, // 10MB
    'Arquivo deve ter no máximo 10MB'
  )
  .refine(file => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    return allowedTypes.includes(file.type)
  }, 'Tipo de arquivo não permitido. Use PDF, imagens (JPEG, PNG, WebP) ou documentos Word')

// Schema para filtros de documentos
export const documentFiltersSchema = z.object({
  document_type: z
    .enum(DOCUMENT_TYPES as [DocumentType, ...DocumentType[]])
    .optional(),
  is_sensitive: z.boolean().optional(),
  search: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

// Tipos TypeScript
export type CreatePatientDocumentData = z.infer<
  typeof createPatientDocumentSchema
>
export type CreatePatientDocumentWithIdData = z.infer<
  typeof createPatientDocumentWithIdSchema
>
export type UpdatePatientDocumentData = z.infer<
  typeof updatePatientDocumentSchema
>
export type DocumentFiltersData = z.infer<typeof documentFiltersSchema>
