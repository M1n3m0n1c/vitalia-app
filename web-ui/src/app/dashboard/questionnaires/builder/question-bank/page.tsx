"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Question, MEDICAL_SPECIALTIES } from '@/types/questionnaire'
import { useQuestionnaireBuilderStore } from '@/store/questionnaireBuilderStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { NewQuestionModal } from '@/components/form/NewQuestionModal'

interface QuestionBankItem {
  id: string
  question_text: string
  question_type: string
  category?: string
  specialty?: string
  options?: any
}

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

const SPECIALTIES = MEDICAL_SPECIALTIES.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ') }))

const QUESTION_TYPES = [
  { value: 'text', label: 'Texto Livre' },
  { value: 'radio', label: 'Escolha Única' },
  { value: 'checkbox', label: 'Múltipla Escolha' },
  { value: 'scale', label: 'Escala Numérica' },
  { value: 'slider', label: 'Escala Visual' },
  { value: 'date', label: 'Data' },
  { value: 'file', label: 'Upload de Arquivo' },
  { value: 'yes_no', label: 'Sim/Não/Não Sei' },
  { value: 'facial_complaints', label: 'Queixas Faciais' },
  { value: 'body_complaints', label: 'Queixas Corporais' }
]

export default function QuestionBankPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<QuestionBankItem[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionBankItem[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showNewQuestion, setShowNewQuestion] = useState(false)
  const { addQuestions } = useQuestionnaireBuilderStore()

  useEffect(() => {
    fetchQuestions()
  }, [])

  useEffect(() => {
    filterQuestions()
  }, [questions, search, categoryFilter, specialtyFilter, typeFilter])

  const fetchQuestions = async () => {
    try {
      // Usar limite maior para carregar mais perguntas
      const response = await fetch('/api/questions-bank?limit=100')
      const data = await response.json()
      
      if (response.ok) {
        setQuestions(data.data || [])
      } else {
        toast.error('Erro ao carregar perguntas')
        console.error('Erro da API:', data)
      }
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error)
      toast.error('Erro ao carregar perguntas')
    } finally {
      setLoading(false)
    }
  }

  const filterQuestions = () => {
    let filtered = questions

    // Filtro por busca
    if (search.trim()) {
      filtered = filtered.filter(q =>
        q.question_text.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filtro por categoria
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(q => q.category === categoryFilter)
    }

    // Filtro por especialidade
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(q => q.specialty === specialtyFilter)
    }

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(q => q.question_type === typeFilter)
    }

    setFilteredQuestions(filtered)
  }

  const handleQuestionToggle = (questionId: string) => {
    const newSelected = new Set(selectedQuestions)
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId)
    } else {
      newSelected.add(questionId)
    }
    setSelectedQuestions(newSelected)
  }

  const handleAddSelected = () => {
    const questionsToAdd = filteredQuestions.filter(q => selectedQuestions.has(q.id))
    
    if (questionsToAdd.length === 0) {
      toast.error('Selecione pelo menos uma pergunta')
      return
    }
    
    // Converter perguntas do banco para formato do questionário
    const questionsForBuilder = questionsToAdd.map((bankQuestion) => {
      const baseQuestion = {
        id: bankQuestion.id, // Será regenerado no store
        question_text: bankQuestion.question_text,
        question_type: bankQuestion.question_type as any,
        required: false,
        order: 0, // será ajustado na store
      }

      // Adicionar campos específicos para cada tipo de pergunta
      switch (bankQuestion.question_type) {
        case 'facial_complaints':
          return {
            ...baseQuestion,
            regions: bankQuestion.options?.regions || [],
            allow_multiple: bankQuestion.options?.allow_multiple ?? true
          }
        case 'body_complaints':
          return {
            ...baseQuestion,
            regions: bankQuestion.options?.regions || [],
            allow_multiple: bankQuestion.options?.allow_multiple ?? true
          }
        case 'radio':
        case 'checkbox':
          return {
            ...baseQuestion,
            options: bankQuestion.options || []
          }
        case 'scale':
        case 'slider':
          return {
            ...baseQuestion,
            min_value: bankQuestion.options?.min_value || 0,
            max_value: bankQuestion.options?.max_value || 10,
            step: bankQuestion.options?.step || 1,
            labels: bankQuestion.options?.labels || {}
          }
        case 'file':
          return {
            ...baseQuestion,
            accepted_types: bankQuestion.options?.accepted_types || ['*'],
            max_size_mb: bankQuestion.options?.max_size_mb || 10,
            max_files: bankQuestion.options?.max_files || 1
          }
        case 'yes_no':
          return {
            ...baseQuestion,
            labels: bankQuestion.options?.labels || {}
          }
        default:
          return {
            ...baseQuestion,
            ...(bankQuestion.options && { options: bankQuestion.options })
          }
      }
    })
    
    addQuestions(questionsForBuilder)
    toast.success(`${questionsToAdd.length} pergunta(s) adicionada(s) ao questionário!`)
    router.back()
  }

  const clearFilters = () => {
    setSearch('')
    setCategoryFilter('all')
    setSpecialtyFilter('all')
    setTypeFilter('all')
  }

  const getTypeLabel = (type: string) => {
    const typeObj = QUESTION_TYPES.find(t => t.value === type)
    return typeObj?.label || type
  }

  const getCategoryLabel = (category: string | undefined) => {
    if (!category) return null
    const categoryObj = CATEGORIES.find(c => c.value === category)
    return categoryObj?.label || category
  }

  const getSpecialtyLabel = (specialty: string | undefined) => {
    if (!specialty) return null
    const specialtyObj = SPECIALTIES.find(s => s.value === specialty)
    return specialtyObj?.label || specialty
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banco de Perguntas</h1>
          <p className="text-muted-foreground">Selecione perguntas do banco para adicionar ao seu questionário</p>
        </div>
        <Button onClick={() => setShowNewQuestion(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Pergunta
        </Button>
      </div>

      {/* Modal de Nova Pergunta */}
      {showNewQuestion && (
        <NewQuestionModal
          onClose={() => setShowNewQuestion(false)}
          onAddQuestion={(question: Question) => {
            // Adicionar pergunta criada ao banco local
            const newBankItem: QuestionBankItem = {
              id: question.id,
              question_text: question.question_text,
              question_type: question.question_type,
              category: undefined,
              specialty: undefined,
              options: (question as any).options
            }
            setQuestions(prev => [newBankItem, ...prev])
            setShowNewQuestion(false)
          }}
        />
      )}

      {/* Filters */}
      <div className="space-y-6 border-b pb-6 px-2">
        {/* Busca */}
        <div className="relative mb-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar perguntas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Filtros em linha */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Categoria</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Todas as categorias" />
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
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Especialidade</label>
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Todas as especialidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as especialidades</SelectItem>
                {SPECIALTIES.map(specialty => (
                  <SelectItem key={specialty.value} value={specialty.value}>
                    {specialty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Tipo</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Todos os tipos" />
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
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
          <div className="text-sm text-muted-foreground">
            {filteredQuestions.length} pergunta(s) disponível(is)
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma pergunta encontrada</p>
              <p className="text-sm">Tente ajustar os filtros</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <Card
                key={question.id}
                className={`cursor-pointer transition-colors ${
                  selectedQuestions.has(question.id) ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => handleQuestionToggle(question.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={selectedQuestions.has(question.id)}
                      onChange={() => handleQuestionToggle(question.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(question.question_type)}
                        </Badge>
                        {getCategoryLabel(question.category) && (
                          <Badge variant="secondary" className="text-xs">
                            {getCategoryLabel(question.category)}
                          </Badge>
                        )}
                        {getSpecialtyLabel(question.specialty) && (
                          <Badge variant="outline" className="text-xs">
                            {getSpecialtyLabel(question.specialty)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-base font-medium leading-relaxed">
                        {question.question_text}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t mt-8">
        <div className="text-sm text-muted-foreground">
          {selectedQuestions.size} pergunta(s) selecionada(s)
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button
            onClick={handleAddSelected}
            disabled={selectedQuestions.size === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Selecionadas
          </Button>
        </div>
      </div>
    </div>
  )
} 