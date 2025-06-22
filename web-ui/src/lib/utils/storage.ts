import { supabase } from '../supabase/client'

export type StorageBucket = 'medical-images' | 'patient-documents' | 'avatars'

export interface UploadOptions {
  bucket: StorageBucket
  folder?: string
  fileName?: string
  upsert?: boolean
}

export interface UploadResult {
  success: boolean
  data?: {
    path: string
    fullPath: string
    publicUrl?: string
  }
  error?: string
}

/**
 * Faz upload de um arquivo para o Supabase Storage
 */
export async function uploadFile(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  try {
    // Validar arquivo
    const validation = validateFile(file, options.bucket)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Gerar nome único do arquivo
    const fileName = options.fileName || generateUniqueFileName(file.name)
    const filePath = options.folder ? `${options.folder}/${fileName}` : fileName

    // Fazer upload
    const { data, error } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, file, {
        upsert: options.upsert || false,
        contentType: file.type,
      })

    if (error) {
      return { success: false, error: error.message }
    }

    // Obter URL pública (apenas para buckets públicos)
    let publicUrl: string | undefined
    if (options.bucket === 'avatars') {
      const { data: urlData } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(filePath)
      publicUrl = urlData.publicUrl
    }

    return {
      success: true,
      data: {
        path: data.path,
        fullPath: data.fullPath,
        publicUrl,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

/**
 * Remove um arquivo do Supabase Storage
 */
export async function deleteFile(
  bucket: StorageBucket,
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

/**
 * Obtém URL assinada para arquivo privado
 */
export async function getSignedUrl(
  bucket: StorageBucket,
  filePath: string,
  expiresIn: number = 3600 // 1 hora por padrão
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, url: data.signedUrl }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

/**
 * Lista arquivos em um bucket
 */
export async function listFiles(
  bucket: StorageBucket,
  folder?: string,
  options?: {
    limit?: number
    offset?: number
    sortBy?: { column: string; order: 'asc' | 'desc' }
  }
) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit: options?.limit,
        offset: options?.offset,
        sortBy: options?.sortBy,
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

/**
 * Valida arquivo antes do upload
 */
function validateFile(
  file: File,
  bucket: StorageBucket
): { valid: boolean; error?: string } {
  // Configurações por bucket
  const bucketConfig = {
    'medical-images': {
      maxSize: 50 * 1024 * 1024, // 50MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    'patient-documents': {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    },
    avatars: {
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
  }

  const config = bucketConfig[bucket]

  // Validar tamanho
  if (file.size > config.maxSize) {
    const maxSizeMB = Math.round(config.maxSize / (1024 * 1024))
    return {
      valid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`,
    }
  }

  // Validar tipo
  if (!config.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido. Tipos aceitos: ${config.allowedTypes.join(', ')}`,
    }
  }

  return { valid: true }
}

/**
 * Gera nome único para arquivo
 */
function generateUniqueFileName(originalName: string): string {
  const extension = originalName.split('.').pop()
  const baseName = originalName.replace(/\.[^/.]+$/, '')
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)

  return `${baseName}_${timestamp}_${random}.${extension}`
}

/**
 * Converte bytes para formato legível
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Obtém ícone baseado no tipo de arquivo
 */
export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType === 'application/pdf') return '��'
  return '📁'
} 