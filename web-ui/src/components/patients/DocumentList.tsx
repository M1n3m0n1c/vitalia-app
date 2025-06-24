'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  FileText,
  Download,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Search,
  Plus,
  AlertTriangle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'

import {
  PatientDocument,
  DocumentType,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_TYPE_ICONS,
  DOCUMENT_TYPE_COLORS,
} from '@/types/patient-documents'
import { formatFileSize } from '@/lib/utils/storage'
import { DocumentUpload } from './DocumentUpload'

interface DocumentListProps {
  patientId: string
  patientName: string
}

export function DocumentList({ patientId, patientName }: DocumentListProps) {
  const [documents, setDocuments] = useState<PatientDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all')
  const [showUpload, setShowUpload] = useState(false)
  const [documentToDelete, setDocumentToDelete] =
    useState<PatientDocument | null>(null)

  // Carregar documentos
  const loadDocuments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (searchTerm) params.append('search', searchTerm)
      if (typeFilter !== 'all') params.append('document_type', typeFilter)

      const response = await fetch(
        `/api/patients/${patientId}/documents?${params}`
      )

      if (!response.ok) {
        throw new Error('Erro ao carregar documentos')
      }

      const data = await response.json()
      setDocuments(data.documents)
    } catch (error) {
      console.error('Erro ao carregar documentos:', error)
      toast.error('Erro ao carregar documentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [patientId, searchTerm, typeFilter])

  // Download documento
  const downloadDocument = async (document: PatientDocument) => {
    try {
      const response = await fetch(
        `/api/patients/${patientId}/documents/${document.id}?include_url=true`
      )

      if (!response.ok) {
        throw new Error('Erro ao gerar link de download')
      }

      const data = await response.json()

      if (data.document.download_url) {
        // Abrir em nova aba
        window.open(data.document.download_url, '_blank')
      } else {
        toast.error('Não foi possível gerar o link de download')
      }
    } catch (error) {
      console.error('Erro no download:', error)
      toast.error('Erro no download do documento')
    }
  }

  // Excluir documento
  const deleteDocument = async (document: PatientDocument) => {
    try {
      const response = await fetch(
        `/api/patients/${patientId}/documents/${document.id}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Erro ao excluir documento')
      }

      toast.success('Documento excluído com sucesso')
      setDocuments(prev => prev.filter(doc => doc.id !== document.id))
    } catch (error) {
      console.error('Erro ao excluir documento:', error)
      toast.error('Erro ao excluir documento')
    } finally {
      setDocumentToDelete(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch =
      !searchTerm ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === 'all' || doc.document_type === typeFilter

    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='flex items-center space-x-4'>
              <Skeleton className='h-10 w-10' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-3 w-1/2' />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5' />
            Documentos ({documents.length})
          </CardTitle>

          <Dialog open={showUpload} onOpenChange={setShowUpload}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Upload de Documentos</DialogTitle>
                <DialogDescription>
                  Adicionar documentos para {patientName}
                </DialogDescription>
              </DialogHeader>
              <DocumentUpload
                patientId={patientId}
                onSuccess={() => {
                  setShowUpload(false)
                  loadDocuments()
                }}
                onCancel={() => setShowUpload(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Filtros */}
        <div className='flex items-center gap-4'>
          <div className='relative flex-1'>
            <Search className='absolute top-3 left-3 h-4 w-4 text-gray-400' />
            <Input
              placeholder='Buscar documentos...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>

          <Select
            value={typeFilter}
            onValueChange={(value: DocumentType | 'all') =>
              setTypeFilter(value)
            }
          >
            <SelectTrigger className='w-48'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>
                <span className='flex items-center gap-2'>
                  <Filter className='h-4 w-4' />
                  Todos os tipos
                </span>
              </SelectItem>
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

        {/* Lista de documentos */}
        {filteredDocuments.length === 0 ? (
          <div className='py-8 text-center text-gray-500'>
            {documents.length === 0 ? (
              <div>
                <FileText className='mx-auto mb-4 h-12 w-12 text-gray-300' />
                <p>Nenhum documento encontrado</p>
                <p className='text-sm'>
                  Clique em "Adicionar" para enviar o primeiro documento
                </p>
              </div>
            ) : (
              <p>Nenhum documento corresponde aos filtros aplicados</p>
            )}
          </div>
        ) : (
          <div className='space-y-3'>
            {filteredDocuments.map(document => (
              <div
                key={document.id}
                className='flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50'
              >
                {/* Ícone do tipo */}
                <div className='text-2xl'>
                  {DOCUMENT_TYPE_ICONS[document.document_type]}
                </div>

                {/* Informações do documento */}
                <div className='min-w-0 flex-1'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <h3 className='truncate font-medium text-gray-900'>
                        {document.title}
                        {document.is_sensitive && (
                          <AlertTriangle className='ml-2 inline h-4 w-4 text-orange-500' />
                        )}
                      </h3>

                      {document.description && (
                        <p className='mt-1 text-sm text-gray-600'>
                          {document.description}
                        </p>
                      )}

                      <div className='mt-2 flex items-center gap-4 text-xs text-gray-500'>
                        <span>{formatFileSize(document.file_size)}</span>
                        <span>{formatDate(document.created_at)}</span>
                        <span>{document.original_name}</span>
                      </div>

                      {/* Tags e tipo */}
                      <div className='mt-2 flex items-center gap-2'>
                        <Badge
                          variant='secondary'
                          className={
                            DOCUMENT_TYPE_COLORS[document.document_type]
                          }
                        >
                          {DOCUMENT_TYPE_LABELS[document.document_type]}
                        </Badge>

                        {document.tags?.map(tag => (
                          <Badge
                            key={tag}
                            variant='outline'
                            className='text-xs'
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className='ml-4 flex items-center gap-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => downloadDocument(document)}
                        title='Download'
                      >
                        <Download className='h-4 w-4' />
                      </Button>

                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => downloadDocument(document)}
                        title='Visualizar'
                      >
                        <Eye className='h-4 w-4' />
                      </Button>

                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setDocumentToDelete(document)}
                        title='Excluir'
                        className='text-red-600 hover:text-red-700'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Dialog de confirmação para exclusão */}
      <AlertDialog
        open={!!documentToDelete}
        onOpenChange={() => setDocumentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Documento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o documento "
              {documentToDelete?.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                documentToDelete && deleteDocument(documentToDelete)
              }
              className='bg-red-600 hover:bg-red-700'
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
