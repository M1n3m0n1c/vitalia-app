import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, File, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { FileQuestion as FileQuestionType, FileAnswer } from '@/types/questionnaire'

interface FileQuestionProps {
  question: FileQuestionType
  value?: FileAnswer
  onChange: (answer: FileAnswer) => void
  error?: string
  disabled?: boolean
}

export function FileQuestion({
  question,
  value,
  onChange,
  error,
  disabled = false
}: FileQuestionProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const currentFiles = value?.files || []
  const maxFiles = question.max_files || 1
  const maxSizeMB = question.max_size_mb
  const acceptedTypes = question.accepted_types

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled) return

    // Verificar se não excede o número máximo de arquivos
    const totalFiles = currentFiles.length + acceptedFiles.length
    if (totalFiles > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivo(s) permitido(s)`)
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Simular upload (substituir por upload real para Supabase Storage)
      const newFiles = await Promise.all(
        acceptedFiles.map(async (file, index) => {
          // Simular progresso
          const progressStep = 100 / acceptedFiles.length
          setUploadProgress((index + 1) * progressStep)

          // Simular delay de upload
          await new Promise(resolve => setTimeout(resolve, 1000))

          return {
            name: file.name,
            url: URL.createObjectURL(file), // Temporary URL - replace with actual upload
            size: file.size,
            type: file.type
          }
        })
      )

      onChange({
        question_id: question.id,
        question_type: 'file',
        files: [...currentFiles, ...newFiles]
      })
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload dos arquivos')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [currentFiles, question, onChange, disabled, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxSize: maxSizeMB * 1024 * 1024, // Convert MB to bytes
    disabled: disabled || uploading || currentFiles.length >= maxFiles
  })

  const removeFile = (index: number) => {
    const newFiles = currentFiles.filter((_, i) => i !== index)
    onChange({
      question_id: question.id,
      question_type: 'file',
      files: newFiles
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      {currentFiles.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            ${error ? 'border-destructive' : ''}
            ${disabled || uploading ? 'cursor-not-allowed opacity-50' : 'hover:border-primary hover:bg-primary/5'}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          {isDragActive ? (
            <p className="text-sm text-primary">Solte os arquivos aqui...</p>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Clique para selecionar ou arraste arquivos aqui
              </p>
              <p className="text-xs text-muted-foreground">
                {acceptedTypes.join(', ')} • Máximo {maxSizeMB}MB por arquivo
              </p>
              {maxFiles > 1 && (
                <p className="text-xs text-muted-foreground">
                  Até {maxFiles} arquivos
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Fazendo upload...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* File List */}
      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            Arquivos selecionados ({currentFiles.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {currentFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 