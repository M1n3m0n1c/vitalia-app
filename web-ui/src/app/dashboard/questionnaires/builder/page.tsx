'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Save, Eye, Plus, Settings, RotateCcw } from 'lucide-react'
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
import { Question, QuestionnaireData, MEDICAL_SPECIALTIES, MedicalSpecialty } from '@/types/questionnaire'
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

function QuestionnaireBuilderPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const questionnaireId = searchParams.get('id')
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isStoreReady, setIsStoreReady] = useState(false)
  
  // Store como fonte única da verdade
  const { 
    questions, 
    questionnaire, 
    isInitialized,
    setQuestions, 
    setQuestionnaire, 
    resetStore 
  } = useQuestionnaireBuilderStore()

  // Estado local apenas para campos do formulário
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    specialty: undefined as MedicalSpecialty | undefined,
    is_active: true
  })

  // Aguardar hidratação do store
  useEffect(() => {
    setIsStoreReady(true)
  }, [])

  // Inicializar ou carregar dados existentes
  useEffect(() => {
    if (!isStoreReady) return
    
    if (questionnaireId) {
      // Carregar questionário existente
      setIsLoadingData(true)
      fetch(`/api/questionnaires/${questionnaireId}`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Questionário não encontrado')
          const data = await res.json()
          const q = data.data
          
          let questionsData = []
          if (Array.isArray(q.questions)) {
            questionsData = q.questions
          } else if (typeof q.questions === 'string') {
            try {
              questionsData = JSON.parse(q.questions)
            } catch {}
          }
          
          // Definir dados do formulário
          setFormData({
            title: q.title || '',
            description: q.description || '',
            category: q.category || '',
            specialty: q.specialty || undefined,
            is_active: q.is_active ?? true
          })
          
          // Definir dados no store
          const questionnaireData = {
            id: q.id,
            title: q.title || '',
            description: q.description || '',
            category: q.category || '',
            specialty: q.specialty || '',
            questions: questionsData || [],
            is_active: q.is_active ?? true,
            expires_at: q.expires_at || undefined,
          }
          
          setQuestionnaire(questionnaireData)
          setQuestions(questionsData || [])
        })
        .catch(() => {
          toast.error('Não foi possível carregar o questionário para edição.')
        })
        .finally(() => {
          setIsLoadingData(false)
        })
    } else {
      // Novo questionário - limpar apenas uma vez no carregamento inicial
      if (!isInitialized) {
        resetStore()
        setFormData({
          title: '',
          description: '',
          category: '',
          specialty: undefined,
          is_active: true
        })
      }
    }
  }, [questionnaireId, isStoreReady]) // Adicionar isStoreReady como dependência

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Atualizar também no store
    setQuestionnaire({
      ...questionnaire,
      [field]: value
    })
  }

  const handleQuestionsChange = useCallback((newQuestions: Question[]) => {
    // Apenas atualizar o store - não criar loops de sincronização
    setQuestions(newQuestions)
  }, [setQuestions])

  const getCurrentQuestionnaire = (): QuestionnaireData => {
    return {
      id: questionnaire.id,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      specialty: formData.specialty,
      questions: questions,
      is_active: formData.is_active,
      expires_at: questionnaire.expires_at
    }
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Título é obrigatório')
      return
    }

    if (questions.length === 0) {
      toast.error('Adicione pelo menos uma pergunta')
      return
    }

    // Normalizar perguntas
    const normalizedQuestions = questions.map((q) => {
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

    const payload = {
      ...getCurrentQuestionnaire(),
      questions: normalizedQuestions
    }

    setIsSaving(true)
    try {
      let response;
      if (questionnaire.id) {
        response = await fetch(`/api/questionnaires/${questionnaire.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        response = await fetch('/api/questionnaires', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      const result = await response.json()

      if (response.ok) {
        toast.success('Questionário salvo com sucesso!')
        resetStore() // Limpar store após salvar
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
    if (!formData.title.trim()) {
      toast.error('Adicione um título antes de visualizar')
      return
    }
    if (questions.length === 0) {
      toast.error('Adicione pelo menos uma pergunta antes de visualizar')
      return
    }
    setShowPreview(true)
  }

  const handleResetStore = () => {
    if (confirm('Tem certeza que deseja limpar todas as perguntas? Esta ação não pode ser desfeita.')) {
      resetStore()
             setFormData({
         title: '',
         description: '',
         category: '',
         specialty: undefined,
         is_active: true
       })
       toast.success('Store limpo com sucesso!')
    }
  }

  if (isLoadingData || !isStoreReady) {
    return <div className="flex items-center justify-center p-8">Carregando...</div>
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
            <p className="text-xs text-blue-600">
              Store: {questions.length} pergunta(s) • Inicializado: {isInitialized ? 'Sim' : 'Não'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetStore}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Store
          </Button>
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={!formData.title.trim() || questions.length === 0}
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
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category || 'none'}
                onValueChange={(value) => handleFormChange('category', value === 'none' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma categoria</SelectItem>
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
                value={formData.specialty || 'none'}
                onValueChange={(value) => handleFormChange('specialty', value === 'none' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma especialidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma especialidade</SelectItem>
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
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleFormChange('is_active', checked)}
            />
            <Label htmlFor="is_active">Questionário ativo</Label>
          </div>
        </CardContent>
      </Card>

      {/* Builder */}
      <QuestionnaireBuilder
        questions={questions}
        onQuestionsChange={handleQuestionsChange}
        title={formData.title}
        description={formData.description}
      />

      {/* Preview Modal */}
      {showPreview && (
        <QuestionnairePreview
          questionnaire={getCurrentQuestionnaire()}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}

export default function QuestionnaireBuilderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Carregando...</div>}>
        <QuestionnaireBuilderPageContent />
      </Suspense>
    </div>
  )
} 