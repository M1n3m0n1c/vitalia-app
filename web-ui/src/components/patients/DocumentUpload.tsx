'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Upload, FileText, X, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

import { 
  createPatientDocumentSchema,
  CreatePatientDocumentData,
} from '@/lib/validations/patient-documents'
import {
  DocumentType,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_TYPE_ICONS,
} from '@/types/patient-documents'
import { formatFileSize } from '@/lib/utils/storage'

interface DocumentUploadProps {
  patientId: string
  onSuccess?: () => void
  onCancel?: () => void
}

interface FileWithPreview extends File {
  preview?: string
}

export function DocumentUpload({
  patientId,
  onSuccess,
  onCancel,
}: DocumentUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')

  const form = useForm<CreatePatientDocumentData>({
    resolver: zodResolver(createPatientDocumentSchema),
    defaultValues: {
      document_type: 'other',
      title: '',
      description: '',
      tags: [],
      is_sensitive: false,
    },
  })

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map(file =>
        Object.assign(file, {
          preview: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : undefined,
        })
      )
      setFiles(prev => [...prev, ...newFiles])

      // Se for o primeiro arquivo, usar o nome como título padrão
      if (files.length === 0 && acceptedFiles[0]) {
        const fileName = acceptedFiles[0].name.replace(/\.[^/.]+$/, '')
        form.setValue('title', fileName)
      }
    },
    [files.length, form]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  })

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev]
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!)
      }
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      const newTags = [...tags, currentTag.trim()]
      setTags(newTags)
      form.setValue('tags', newTags)
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    setTags(newTags)
    form.setValue('tags', newTags)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const onSubmit = async (data: CreatePatientDocumentData) => {
    if (files.length === 0) {
      toast.error('Selecione pelo menos um arquivo')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Upload cada arquivo
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()

        formData.append('file', file)
        formData.append(
          'metadata',
          JSON.stringify({
            ...data,
            title: files.length > 1 ? `${data.title} (${i + 1})` : data.title,
          })
        )

        const response = await fetch(`/api/patients/${patientId}/documents`, {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Erro no upload')
        }

        // Atualizar progresso
        setUploadProgress(((i + 1) / files.length) * 100)
      }

      toast.success(`${files.length} documento(s) enviado(s) com sucesso!`)

      // Reset form
      form.reset()
      setFiles([])
      setTags([])
      setUploadProgress(0)

      onSuccess?.()
    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error(error instanceof Error ? error.message : 'Erro no upload')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className='mx-auto w-full max-w-2xl'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Upload className='h-5 w-5' />
          Upload de Documentos
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-6'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {/* Área de Drop */}
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/10'
                : 'hover:border-primary border-gray-300 hover:bg-gray-50'
            } `}
          >
            <input {...getInputProps()} />
            <Upload className='mx-auto mb-4 h-12 w-12 text-gray-400' />
            {isDragActive ? (
              <p className='text-primary'>Solte os arquivos aqui...</p>
            ) : (
              <div>
                <p className='mb-2 text-gray-600'>
                  Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className='text-sm text-gray-500'>
                  PDF, imagens (JPEG, PNG, WebP) ou documentos Word - máximo
                  10MB
                </p>
              </div>
            )}
          </div>

          {/* Arquivos Selecionados */}
          {files.length > 0 && (
            <div className='space-y-2'>
              <Label>Arquivos Selecionados ({files.length})</Label>
              <div className='max-h-40 space-y-2 overflow-y-auto'>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-3 rounded-lg bg-gray-50 p-2'
                  >
                    <FileText className='h-4 w-4 text-gray-500' />
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium'>
                        {file.name}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tipo de Documento */}
          <div className='space-y-2'>
            <Label htmlFor='document_type'>Tipo de Documento *</Label>
            <Select
              value={form.watch('document_type')}
              onValueChange={(value: DocumentType) =>
                form.setValue('document_type', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    <span className='flex items-center gap-2'>
                      <span>{DOCUMENT_TYPE_ICONS[value as DocumentType]}</span>
                      {label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Título */}
          <div className='space-y-2'>
            <Label htmlFor='title'>Título *</Label>
            <Input
              {...form.register('title')}
              placeholder='Ex: RG do paciente, Exame de sangue...'
              disabled={isUploading}
            />
            {form.formState.errors.title && (
              <p className='text-sm text-red-600'>
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div className='space-y-2'>
            <Label htmlFor='description'>Descrição</Label>
            <Textarea
              {...form.register('description')}
              placeholder='Informações adicionais sobre o documento...'
              rows={3}
              disabled={isUploading}
            />
          </div>

          {/* Tags */}
          <div className='space-y-2'>
            <Label>Tags</Label>
            <div className='flex gap-2'>
              <Input
                value={currentTag}
                onChange={e => setCurrentTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Adicionar tag...'
                disabled={isUploading}
              />
              <Button type='button' onClick={addTag} disabled={isUploading}>
                Adicionar
              </Button>
            </div>
            {tags.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {tags.map(tag => (
                  <Badge
                    key={tag}
                    variant='secondary'
                    className='flex items-center gap-1'
                  >
                    {tag}
                    <button
                      type='button'
                      onClick={() => removeTag(tag)}
                      className='ml-1 hover:text-red-600'
                      disabled={isUploading}
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Documento Sensível */}
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='is_sensitive'
              checked={form.watch('is_sensitive')}
              onCheckedChange={checked =>
                form.setValue('is_sensitive', !!checked)
              }
              disabled={isUploading}
            />
            <Label htmlFor='is_sensitive' className='text-sm'>
              Documento sensível (requer autenticação extra)
            </Label>
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Enviando...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Botões */}
          <div className='flex gap-3 pt-4'>
            <Button
              type='submit'
              disabled={files.length === 0 || isUploading}
              className='flex-1'
            >
              {isUploading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className='mr-2 h-4 w-4' />
                  Enviar {files.length > 0 && `(${files.length})`}
                </>
              )}
            </Button>

            {onCancel && (
              <Button
                type='button'
                variant='outline'
                onClick={onCancel}
                disabled={isUploading}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
