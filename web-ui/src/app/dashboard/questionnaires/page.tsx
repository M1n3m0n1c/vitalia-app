'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Eye, Edit, Trash2, Copy, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { Questionnaire } from '@/lib/supabase/database.types'
import Link from 'next/link'
import { PatientSelectModal } from '@/components/patients/PatientSelectModal'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDateBrasilia } from '@/lib/utils/date'

const CATEGORIES = [
  { value: 'anamnese-geral', label: 'Anamnese Geral' },
  { value: 'estetica-facial', label: 'Estética Facial' },
  { value: 'dermatologia', label: 'Dermatologia' },
  { value: 'cirurgia-plastica', label: 'Cirurgia Plástica' },
  { value: 'odontologia', label: 'Odontologia' },
  { value: 'pos-operatorio', label: 'Pós-Operatório' },
  { value: 'satisfacao', label: 'Satisfação' },
  { value: 'outros', label: 'Outros' }
]

export default function QuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [publicLinks, setPublicLinks] = useState<Record<string, string>>({})
  const [selectingQuestionnaireId, setSelectingQuestionnaireId] = useState<string | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [successLink, setSuccessLink] = useState<string | null>(null)

  const fetchQuestionnaires = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })

      if (search) params.append('search', search)
      if (categoryFilter !== 'all') params.append('category', categoryFilter)
      if (statusFilter !== 'all') params.append('is_active', statusFilter === 'active' ? 'true' : 'false')

      const response = await fetch(`/api/questionnaires?${params}`)
      const data = await response.json()

      if (response.ok) {
        setQuestionnaires(data.data)
        setTotalPages(data.pagination.totalPages)
      } else {
        toast.error(data.error || 'Erro ao carregar questionários')
      }
    } catch (error) {
      console.error('Erro ao buscar questionários:', error)
      toast.error('Erro ao carregar questionários')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/questionnaires/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Questionário removido com sucesso')
        fetchQuestionnaires()
      } else {
        toast.error(data.error || 'Erro ao remover questionário')
      }
    } catch (error) {
      console.error('Erro ao deletar questionário:', error)
      toast.error('Erro ao remover questionário')
    }
  }

  const handleGeneratePublicLink = async (id: string, patientId: string) => {
    try {
      const response = await fetch(`/api/questionnaires/${id}/public-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId })
      })
      const data = await response.json()
      if (response.ok && data.data) {
        setSuccessLink(window.location.origin + '/public/' + data.data)
        toast.success('Link público gerado!')
      } else {
        toast.error(data.error || 'Erro ao gerar link público')
      }
    } catch (error) {
      toast.error('Erro ao gerar link público')
    }
  }

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast.success('Link copiado!')
  }

  const getCategoryLabel = (category: string | null) => {
    if (!category) return 'Sem categoria'
    const cat = CATEGORIES.find(c => c.value === category)
    return cat?.label || category
  }

  const getQuestionCount = (questions: any) => {
    if (Array.isArray(questions)) return questions.length
    return 0
  }

  const handleDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/questionnaires/${id}/duplicate`, {
        method: 'POST'
      })
      const data = await response.json()
      if (response.ok) {
        toast.success('Questionário duplicado com sucesso!')
        fetchQuestionnaires()
      } else {
        toast.error(data.error || 'Erro ao duplicar questionário')
      }
    } catch (error) {
      toast.error('Erro ao duplicar questionário')
    }
  }

  useEffect(() => {
    fetchQuestionnaires()
  }, [currentPage, search, categoryFilter, statusFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Questionários</h1>
          <p className="text-muted-foreground">
            Gerencie seus questionários de anamnese e avaliação
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/questionnaires/questions">
            <Button variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Banco de Perguntas
            </Button>
          </Link>
          <Link href="/dashboard/questionnaires/builder">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Questionário
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar questionários..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {CATEGORIES.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearch('')
              setCategoryFilter('all')
              setStatusFilter('all')
              setCurrentPage(1)
            }}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : questionnaires.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Nenhum questionário encontrado</h3>
                <p className="text-muted-foreground">
                  {search || categoryFilter !== 'all' || statusFilter !== 'all'
                    ? 'Tente ajustar os filtros ou'
                    : 'Comece'
                  } criando seu primeiro questionário.
                </p>
              </div>
              <Link href="/dashboard/questionnaires/builder">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Questionário
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questionnaires.map((questionnaire) => (
            <Card key={questionnaire.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {questionnaire.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={questionnaire.is_active ? 'default' : 'secondary'}>
                        {questionnaire.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Badge variant="outline">
                        {getCategoryLabel(questionnaire.category)}
                      </Badge>
                    </div>
                  </div>
                </div>
                {questionnaire.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {questionnaire.description}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{getQuestionCount(questionnaire.questions)} pergunta(s)</span>
                    <span>
                      {questionnaire.created_at ? formatDateBrasilia(questionnaire.created_at) : 'Data desconhecida'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={`/dashboard/questionnaires/${questionnaire.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Button>
                    </Link>
                    <Link href={`/dashboard/questionnaires/builder?id=${questionnaire.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </Link>
                  </div>

                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o questionário "{questionnaire.title}"?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(questionnaire.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  {/* Botão sempre visível */}
                  <div className="mt-2 flex justify-center">
                    <Button size="sm" variant="secondary" onClick={() => setSelectingQuestionnaireId(questionnaire.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Gerar link público
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

      {/* Modal de seleção de paciente */}
      <PatientSelectModal
        open={!!selectingQuestionnaireId}
        onClose={() => { setSelectingQuestionnaireId(null); setSelectedPatient(null); }}
        onSelect={patient => {
          setSelectedPatient(patient)
          if (selectingQuestionnaireId) {
            handleGeneratePublicLink(selectingQuestionnaireId, patient.id)
            setSelectingQuestionnaireId(null)
          }
        }}
      />

      {/* Modal de sucesso com link gerado */}
      <Dialog open={!!successLink} onOpenChange={() => setSuccessLink(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Link público gerado!</DialogTitle>
          </DialogHeader>
          <Input value={successLink || ''} readOnly className="mb-4 text-xs" />
          <Button onClick={() => { navigator.clipboard.writeText(successLink || ''); toast.success('Link copiado!') }}>
            <Copy className="h-4 w-4 mr-2" /> Copiar link
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
} 