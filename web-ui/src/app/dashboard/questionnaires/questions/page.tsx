'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'

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

const SPECIALTIES = [
  { value: 'dermatologia', label: 'Dermatologia' },
  { value: 'cirurgia-plastica', label: 'Cirurgia Plástica' },
  { value: 'medicina-estetica', label: 'Medicina Estética' },
  { value: 'odontologia', label: 'Odontologia' },
  { value: 'fisioterapia', label: 'Fisioterapia' },
  { value: 'psicologia', label: 'Psicologia' },
  { value: 'nutricao', label: 'Nutrição' },
  { value: 'endocrinologia', label: 'Endocrinologia' },
  { value: 'geral', label: 'Geral' }
]

const QUESTION_TYPES = [
  { value: 'text', label: 'Texto Livre' },
  { value: 'radio', label: 'Escolha Única' },
  { value: 'checkbox', label: 'Múltipla Escolha' },
  { value: 'scale', label: 'Escala Numérica' },
  { value: 'slider', label: 'Escala Visual' },
  { value: 'date', label: 'Data' },
  { value: 'file', label: 'Upload de Arquivo' },
  { value: 'yes_no', label: 'Sim/Não/Não Sei' }
]

const questionSchema = z.object({
  question_text: z.string().min(5, 'A pergunta deve ter pelo menos 5 caracteres'),
  question_type: z.enum(['text', 'radio', 'checkbox', 'scale', 'slider', 'date', 'file', 'yes_no']),
  category: z.string().min(1, 'Selecione uma categoria'),
  specialty: z.string().min(1, 'Selecione uma especialidade'),
  options: z.string().optional()
})

type QuestionFormData = z.infer<typeof questionSchema>

interface QuestionBankItem {
  id: string
  question_text: string
  question_type: string
  options?: any
  category?: string
  specialty?: string
  created_at: string
  updated_at: string
  doctor_id: string
  is_default: boolean
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuestionBankItem | null>(null)

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question_text: '',
      question_type: 'text',
      category: '',
      specialty: '',
      options: ''
    }
  })

  const watchedType = form.watch('question_type')

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      })

      if (search) params.append('search', search)
      if (categoryFilter !== 'all') params.append('category', categoryFilter)
      if (specialtyFilter !== 'all') params.append('specialty', specialtyFilter)
      if (typeFilter !== 'all') params.append('question_type', typeFilter)

      const response = await fetch(`/api/questions-bank?${params}`)
      const data = await response.json()

      if (response.ok) {
        setQuestions(data.data)
        setTotalPages(data.pagination.totalPages)
      } else {
        toast.error(data.error || 'Erro ao carregar perguntas')
      }
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error)
      toast.error('Erro ao carregar perguntas')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: QuestionFormData) => {
    try {
      const requestData = {
        question_text: data.question_text,
        question_type: data.question_type,
        category: data.category,
        specialty: data.specialty,
        options: data.options ? data.options.split('\n').filter(opt => opt.trim()) : undefined
      }

      const url = editingQuestion 
        ? `/api/questions-bank/${editingQuestion.id}` 
        : '/api/questions-bank'
      
      const method = editingQuestion ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(editingQuestion ? 'Pergunta atualizada!' : 'Pergunta criada!')
        setDialogOpen(false)
        setEditingQuestion(null)
        form.reset()
        fetchQuestions()
      } else {
        toast.error(result.error || 'Erro ao salvar pergunta')
      }
    } catch (error) {
      console.error('Erro ao salvar pergunta:', error)
      toast.error('Erro ao salvar pergunta')
    }
  }

  const handleEdit = (question: QuestionBankItem) => {
    setEditingQuestion(question)
    form.reset({
      question_text: question.question_text,
      question_type: question.question_type as any,
      category: question.category || '',
      specialty: question.specialty || '',
      options: Array.isArray(question.options) ? question.options.join('\n') : ''
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/questions-bank/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Pergunta removida com sucesso')
        fetchQuestions()
      } else {
        toast.error(data.error || 'Erro ao remover pergunta')
      }
    } catch (error) {
      console.error('Erro ao deletar pergunta:', error)
      toast.error('Erro ao remover pergunta')
    }
  }

  const getCategoryLabel = (category: string | null | undefined) => {
    if (!category) return 'Sem categoria'
    const cat = CATEGORIES.find(c => c.value === category)
    return cat?.label || category
  }

  const getSpecialtyLabel = (specialty: string | null | undefined) => {
    if (!specialty) return 'Sem especialidade'
    const spec = SPECIALTIES.find(s => s.value === specialty)
    return spec?.label || specialty
  }

  const getTypeLabel = (type: string) => {
    const typeObj = QUESTION_TYPES.find(t => t.value === type)
    return typeObj?.label || type
  }

  useEffect(() => {
    fetchQuestions()
  }, [currentPage, search, categoryFilter, specialtyFilter, typeFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/questionnaires">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Banco de Perguntas</h1>
            <p className="text-muted-foreground">
              Gerencie suas perguntas reutilizáveis para questionários
            </p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingQuestion(null)
              form.reset()
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Pergunta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? 'Editar Pergunta' : 'Nova Pergunta'}
              </DialogTitle>
              <DialogDescription>
                {editingQuestion 
                  ? 'Edite os dados da pergunta'
                  : 'Crie uma nova pergunta para usar em seus questionários'
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="question_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto da Pergunta</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Digite sua pergunta..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="question_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Pergunta</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {QUESTION_TYPES.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map(category => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialidade</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a especialidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SPECIALTIES.map(specialty => (
                            <SelectItem key={specialty.value} value={specialty.value}>
                              {specialty.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(watchedType === 'radio' || watchedType === 'checkbox') && (
                  <FormField
                    control={form.control}
                    name="options"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opções (uma por linha)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingQuestion ? 'Atualizar' : 'Criar'} Pergunta
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar perguntas..."
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
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas especialidades</SelectItem>
                {SPECIALTIES.map(specialty => (
                  <SelectItem key={specialty.value} value={specialty.value}>
                    {specialty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {QUESTION_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearch('')
              setCategoryFilter('all')
              setSpecialtyFilter('all')
              setTypeFilter('all')
              setCurrentPage(1)
            }}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
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
      ) : questions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Nenhuma pergunta encontrada</h3>
                <p className="text-muted-foreground">
                  {search || categoryFilter !== 'all' || specialtyFilter !== 'all' || typeFilter !== 'all'
                    ? 'Tente ajustar os filtros ou criar uma nova pergunta'
                    : 'Comece criando sua primeira pergunta'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((question) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base line-clamp-2">
                      {question.question_text}
                    </CardTitle>
                    <div className="flex gap-1 ml-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!question.is_default && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta pergunta? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(question.id)}>
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {getTypeLabel(question.question_type)}
                      </Badge>
                      <Badge variant="outline">
                        {getCategoryLabel(question.category)}
                      </Badge>
                      <Badge variant="outline">
                        {getSpecialtyLabel(question.specialty)}
                      </Badge>
                      {question.is_default && (
                        <Badge variant="default">Padrão</Badge>
                      )}
                    </div>
                    {question.options && Array.isArray(question.options) && question.options.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">{question.options.length} opções:</span>
                        <span className="ml-1">
                          {question.options.slice(0, 2).join(', ')}
                          {question.options.length > 2 && '...'}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
} 