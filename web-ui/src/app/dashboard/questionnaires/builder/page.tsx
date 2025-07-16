'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Save, Eye, Plus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { QuestionnaireBuilder } from '@/components/form/QuestionnaireBuilder'
import { QuestionnairePreview } from '@/components/form/QuestionnairePreview'
import { Question, QuestionnaireData, MEDICAL_SPECIALTIES } from '@/types/questionnaire'
import Link from 'next/link'
import { useQuestionnaireBuilderStore } from '@/store/questionnaireBuilderStore'

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

export default function QuestionnaireBuilderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const questionnaireId = searchParams.get('id')
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData>({
    title: '',
    description: '',
    category: '',
    questions: [],
    is_active: true
  })
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { questions, setQuestions, clearQuestions } = useQuestionnaireBuilderStore()
  
  // Hidratar o store do localStorage
  useEffect(() => {
    useQuestionnaireBuilderStore.persist.rehydrate()
  }, [])
  
  // Limpar o store ao iniciar um novo questionário
  useEffect(() => {
    if (!questionnaireId) {
      clearQuestions()
    }
  }, [questionnaireId, clearQuestions])

  useEffect(() => {
    if (!questionnaireId) return
    fetch(`/api/questionnaires/${questionnaireId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Questionário não encontrado')
        const data = await res.json()
        const q = data.data
        let questions = []
        if (Array.isArray(q.questions)) {
          questions = q.questions
        } else if (typeof q.questions === 'string') {
          try {
            questions = JSON.parse(q.questions)
          } catch {}
        }
        setQuestionnaire({
          id: q.id,
          title: q.title || '',
          description: q.description || '',
          category: q.category || '',
          specialty: q.specialty || '',
          questions: questions || [],
          is_active: q.is_active ?? true,
          expires_at: q.expires_at || undefined,
        })
        setQuestions(questions || [])
      })
      .catch(() => {
        toast.error('Não foi possível carregar o questionário para edição.')
      })
  }, [questionnaireId, setQuestions])

  const handleQuestionnaireChange = (field: keyof QuestionnaireData, value: any) => {
    setQuestionnaire(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleQuestionsChange = (questions: Question[]) => {
    setQuestions(questions)
    setQuestionnaire(prev => ({
      ...prev,
      questions
    }))
  }

  // Sincronizar o estado local com o store
  useEffect(() => {
    setQuestionnaire(prev => ({
      ...prev,
      questions
    }))
  }, [questions])

  const handleSave = async () => {
    if (!questionnaire.title.trim()) {
      toast.error('Título é obrigatório')
      return
    }

    if (questionnaire.questions.length === 0) {
      toast.error('Adicione pelo menos uma pergunta')
      return
    }

    // --- Normalização das opções ---
    const normalizedQuestions = questionnaire.questions.map((q) => {
      // Se a pergunta tem options e options é array de string, converte para array de objetos
      if (Array.isArray((q as any).options)) {
        const optionsArr = (q as any).options
        if (optionsArr.length > 0 && typeof optionsArr[0] === 'string') {
          return {
            ...q,
            options: optionsArr.map((opt: string, idx: number) => ({
              id: `option_${idx}`,
              label: opt,
              value: opt.toLowerCase().replace(/\s+/g, '_')
            }))
          }
        }
      }
      return q
    })

    setIsSaving(true)
    try {
      let response;
      if (questionnaire.id) {
        // Atualização (PUT)
        response = await fetch(`/api/questionnaires/${questionnaire.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...questionnaire, questions: normalizedQuestions })
        })
      } else {
        // Criação (POST)
        response = await fetch('/api/questionnaires', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...questionnaire, questions: normalizedQuestions })
        })
      }

      const result = await response.json()

      if (response.ok) {
        toast.success('Questionário salvo com sucesso!')
        clearQuestions() // Limpar o store após salvar
        router.push('/dashboard/questionnaires')
      } else {
        toast.error(result.error || 'Erro ao salvar questionário')
      }
    } catch (error) {
      console.error('Erro ao salvar questionário:', error)
      toast.error('Erro ao salvar questionário')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    if (!questionnaire.title.trim()) {
      toast.error('Adicione um título antes de visualizar')
      return
    }
    if (questionnaire.questions.length === 0) {
      toast.error('Adicione pelo menos uma pergunta antes de visualizar')
      return
    }
    setShowPreview(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/questionnaires">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Builder de Questionários</h1>
            <p className="text-muted-foreground">
              Crie questionários personalizados com interface drag-and-drop
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={!questionnaire.title.trim() || questionnaire.questions.length === 0}
          >
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      {/* Questionnaire Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Configurações do Questionário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Ex: Anamnese Estética Facial"
                value={questionnaire.title}
                onChange={(e) => handleQuestionnaireChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={questionnaire.category || ''}
                onValueChange={(value) => handleQuestionnaireChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Especialidade</Label>
              <Select
                value={questionnaire.specialty || ''}
                onValueChange={(value) => handleQuestionnaireChange('specialty', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {MEDICAL_SPECIALTIES.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty.charAt(0).toUpperCase() + specialty.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o objetivo deste questionário..."
              value={questionnaire.description || ''}
              onChange={(e) => handleQuestionnaireChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={questionnaire.is_active}
              onCheckedChange={(checked) => handleQuestionnaireChange('is_active', checked)}
            />
            <Label htmlFor="is_active">Questionário ativo</Label>
          </div>
        </CardContent>
      </Card>

      {/* Builder */}
      <QuestionnaireBuilder
        questions={questions}
        onQuestionsChange={handleQuestionsChange}
        title={questionnaire.title}
        description={questionnaire.description}
      />

      {/* Preview Modal */}
      {showPreview && (
        <QuestionnairePreview
          questionnaire={questionnaire}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
} 