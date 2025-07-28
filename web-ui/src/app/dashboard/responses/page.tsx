'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Eye, Calendar, User, FileText } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import type { QuestionnaireResponse, ResponsesListResponse } from '@/types/responses'

export default function ResponsesPage() {
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  const fetchResponses = async (page = 1, searchTerm = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/responses?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar respostas')
      }

      setResponses(data.data)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Erro ao carregar respostas:', error)
      toast.error('Erro ao carregar respostas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResponses(1, search)
  }, [search])

  const handleSearch = () => {
    setSearch(searchInput)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    fetchResponses(newPage, search)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryBadgeColor = (category?: string) => {
    const colors: Record<string, string> = {
      'anamnese-geral': 'bg-blue-100 text-blue-800',
      'estetica-facial': 'bg-pink-100 text-pink-800',
      'dermatologia': 'bg-green-100 text-green-800',
      'cirurgia-plastica': 'bg-purple-100 text-purple-800',
      'odontologia': 'bg-yellow-100 text-yellow-800',
      'pos-operatorio': 'bg-orange-100 text-orange-800',
      'satisfacao': 'bg-emerald-100 text-emerald-800'
    }
    return colors[category || ''] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryLabel = (category?: string) => {
    const labels: Record<string, string> = {
      'anamnese-geral': 'Anamnese Geral',
      'estetica-facial': 'Estética Facial',
      'dermatologia': 'Dermatologia',
      'cirurgia-plastica': 'Cirurgia Plástica',
      'odontologia': 'Odontologia',
      'pos-operatorio': 'Pós-Operatório',
      'satisfacao': 'Satisfação'
    }
    return labels[category || ''] || category || 'Sem categoria'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Respostas dos Questionários</h1>
          <p className="text-muted-foreground">
            Visualize e analise as respostas dos seus pacientes
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <FileText className="h-3 w-3" />
            <span>{pagination.total} respostas</span>
          </Badge>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Buscar Respostas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Buscar por nome do paciente..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Respostas Encontradas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Carregando...</div>
            </div>
          ) : responses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma resposta encontrada</h3>
              <p className="text-muted-foreground">
                {search ? 'Tente ajustar os filtros de busca' : 'Ainda não há respostas de questionários'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Questionário</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Data de Resposta</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response) => (
                      <TableRow key={response.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{response.patients.full_name}</div>
                              {response.patients.email && (
                                <div className="text-sm text-muted-foreground">{response.patients.email}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{response.questionnaires.title}</div>
                            {response.questionnaires.description && (
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {response.questionnaires.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryBadgeColor(response.questionnaires.category)}>
                            {getCategoryLabel(response.questionnaires.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(response.completed_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/responses/${response.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Página {pagination.page} de {pagination.pages} ({pagination.total} total)
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 