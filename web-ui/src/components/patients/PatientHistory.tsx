'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar,
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  File,
  FileText,
  Filter,
  Image,
  StickyNote,
} from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

import {
  HISTORY_TYPE_COLORS,
  HISTORY_TYPE_LABELS,
  type HistoryItem,
  type HistoryItemType,
  type HistoryResponse,
} from '@/types/patient-history'

interface PatientHistoryProps {
  patientId: string
  patientName: string
}

const ICON_MAP = {
  response: FileText,
  note: StickyNote,
  image: Image,
  appointment: Calendar,
  document: File,
}

export function PatientHistory({
  patientId,
  patientName,
}: PatientHistoryProps) {
  const [history, setHistory] = useState<HistoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<HistoryItemType | 'all'>('all')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const fetchHistory = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        limit: '50',
        offset: '0',
      })

      if (filter !== 'all') {
        params.append('type', filter)
      }

      const response = await fetch(
        `/api/patients/${patientId}/history?${params}`
      )

      if (!response.ok) {
        throw new Error('Erro ao carregar histórico')
      }

      const data: HistoryResponse = await response.json()
      setHistory(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [patientId, filter])

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR,
    })
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffInDays === 0) return 'Hoje'
    if (diffInDays === 1) return 'Ontem'
    if (diffInDays < 7) return `${diffInDays} dias atrás`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} meses atrás`
    return `${Math.floor(diffInDays / 365)} anos atrás`
  }

  const renderHistoryItem = (item: HistoryItem) => {
    const Icon = ICON_MAP[item.type]
    const isExpanded = expandedItems.has(item.id)

    return (
      <div key={item.id} className='relative'>
        <div className='absolute top-12 left-6 h-full w-0.5 bg-gray-200' />

        <div className='flex gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-sm'>
            <Icon className='h-5 w-5 text-gray-600' />
          </div>

          <div className='flex-1 pb-8'>
            <Card>
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='mb-1 flex items-center gap-2'>
                      <Badge
                        variant='secondary'
                        className={HISTORY_TYPE_COLORS[item.type]}
                      >
                        {HISTORY_TYPE_LABELS[item.type]}
                      </Badge>
                      <Badge variant='outline'>{item.category}</Badge>
                    </div>
                    <h3 className='font-semibold text-gray-900'>
                      {item.title}
                    </h3>
                    <div className='mt-1 flex items-center gap-2 text-sm text-gray-500'>
                      <Clock className='h-4 w-4' />
                      <span>{formatDate(item.date)}</span>
                      <span>•</span>
                      <span>{formatRelativeDate(item.date)}</span>
                    </div>
                  </div>

                  {item.description && (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => toggleExpanded(item.id)}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </Button>
                      </CollapsibleTrigger>
                    </Collapsible>
                  )}
                </div>
              </CardHeader>

              {item.description && (
                <Collapsible open={isExpanded}>
                  <CollapsibleContent>
                    <CardContent className='pt-0'>
                      <Separator className='mb-4' />
                      <div className='space-y-3'>
                        <p className='whitespace-pre-wrap text-gray-700'>
                          {item.description}
                        </p>

                        {/* Detalhes específicos por tipo */}
                        {item.type === 'response' &&
                          item.data?.questionnaire && (
                            <div className='rounded-lg bg-blue-50 p-3'>
                              <h4 className='mb-2 font-medium text-blue-900'>
                                Questionário: {item.data.questionnaire.title}
                              </h4>
                              {item.data.questionnaire.description && (
                                <p className='text-sm text-blue-700'>
                                  {item.data.questionnaire.description}
                                </p>
                              )}
                              <Button
                                variant='outline'
                                size='sm'
                                className='mt-2'
                              >
                                <ExternalLink className='mr-2 h-4 w-4' />
                                Ver Respostas
                              </Button>
                            </div>
                          )}

                        {item.type === 'document' && item.data && (
                          <div className='rounded-lg bg-gray-50 p-3'>
                            <div className='flex items-center justify-between'>
                              <div>
                                <p className='font-medium text-gray-900'>
                                  {item.data.original_name}
                                </p>
                                <p className='text-sm text-gray-500'>
                                  {(item.data.file_size / 1024 / 1024).toFixed(
                                    2
                                  )}{' '}
                                  MB
                                </p>
                              </div>
                              <Button variant='outline' size='sm'>
                                <Download className='mr-2 h-4 w-4' />
                                Download
                              </Button>
                            </div>
                          </div>
                        )}

                        {item.type === 'appointment' && item.data && (
                          <div className='rounded-lg bg-orange-50 p-3'>
                            <div className='flex items-center justify-between'>
                              <div>
                                <p className='font-medium text-orange-900'>
                                  {format(
                                    new Date(item.data.start_time),
                                    'HH:mm',
                                    { locale: ptBR }
                                  )}{' '}
                                  -{' '}
                                  {format(
                                    new Date(item.data.end_time),
                                    'HH:mm',
                                    { locale: ptBR }
                                  )}
                                </p>
                                <Badge
                                  variant={
                                    item.data.status === 'completed'
                                      ? 'default'
                                      : 'secondary'
                                  }
                                  className='mt-1'
                                >
                                  {item.data.status === 'completed'
                                    ? 'Concluída'
                                    : item.data.status === 'cancelled'
                                      ? 'Cancelada'
                                      : 'Agendada'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}

                        {item.type === 'image' && item.data && (
                          <div className='rounded-lg bg-purple-50 p-3'>
                            <div className='flex items-center justify-between'>
                              <div>
                                <p className='font-medium text-purple-900'>
                                  Categoria: {item.data.category}
                                </p>
                                {item.data.body_region && (
                                  <p className='text-sm text-purple-700'>
                                    Região: {item.data.body_region}
                                  </p>
                                )}
                                {item.data.tags &&
                                  item.data.tags.length > 0 && (
                                    <div className='mt-2 flex gap-1'>
                                      {item.data.tags.map(
                                        (tag: string, index: number) => (
                                          <Badge
                                            key={index}
                                            variant='outline'
                                            className='text-xs'
                                          >
                                            {tag}
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                  )}
                              </div>
                              <Button variant='outline' size='sm'>
                                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                                <Image className='mr-2 h-4 w-4' />
                                Ver Imagem
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Clock className='h-5 w-5' />
            Histórico do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='flex gap-4'>
                <Skeleton className='h-12 w-12 rounded-full' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-4 w-1/2' />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Clock className='h-5 w-5' />
            Histórico do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Clock className='h-5 w-5' />
            Histórico do Paciente
          </CardTitle>

          <div className='flex items-center gap-2'>
            <Select
              value={filter}
              onValueChange={value =>
                setFilter(value as HistoryItemType | 'all')
              }
            >
              <SelectTrigger className='w-40'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos</SelectItem>
                <SelectItem value='response'>Questionários</SelectItem>
                <SelectItem value='note'>Anotações</SelectItem>
                <SelectItem value='appointment'>Consultas</SelectItem>
                <SelectItem value='document'>Documentos</SelectItem>
                <SelectItem value='image'>Imagens</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Estatísticas */}
        {history?.stats && (
          <div className='flex gap-4 text-sm text-gray-600'>
            <span>Total: {history.stats.total}</span>
            {history.stats.responses > 0 && (
              <span>Questionários: {history.stats.responses}</span>
            )}
            {history.stats.notes > 0 && (
              <span>Anotações: {history.stats.notes}</span>
            )}
            {history.stats.appointments > 0 && (
              <span>Consultas: {history.stats.appointments}</span>
            )}
            {history.stats.documents > 0 && (
              <span>Documentos: {history.stats.documents}</span>
            )}
            {history.stats.images > 0 && (
              <span>Imagens: {history.stats.images}</span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {!history?.history.length ? (
          <div className='py-8 text-center'>
            <Clock className='mx-auto mb-4 h-12 w-12 text-gray-400' />
            <h3 className='mb-2 text-lg font-medium text-gray-900'>
              Nenhum histórico encontrado
            </h3>
            <p className='text-gray-500'>
              {filter === 'all'
                ? 'Este paciente ainda não possui histórico médico.'
                : `Nenhum item do tipo "${HISTORY_TYPE_LABELS[filter as HistoryItemType]}" encontrado.`}
            </p>
          </div>
        ) : (
          <div className='space-y-0'>
            {history.history.map(renderHistoryItem)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
