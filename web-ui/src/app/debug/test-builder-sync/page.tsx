'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuestionnaireBuilderStore } from '@/store/questionnaireBuilderStore'
import { Question, QuestionnaireData } from '@/types/questionnaire'
import { toast } from 'sonner'

export default function TestBuilderSyncPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const questionnaireId = searchParams.get('id') || 'b91d419c-4145-4d19-a506-b3da2701b1b4'
  
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData>({
    title: '',
    description: '',
    category: '',
    questions: [],
    is_active: true
  })
  
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({})
  
  const { questions, setQuestions, addQuestions, clearQuestions } = useQuestionnaireBuilderStore()

  useEffect(() => {
    // Hidratar o store
    useQuestionnaireBuilderStore.persist.rehydrate()
    setDebugInfo(prev => ({ ...prev, storeHydrated: true }))
  }, [])

  useEffect(() => {
    if (!questionnaireId) return
    
    setLoading(true)
    setDebugInfo(prev => ({ ...prev, loadingStarted: true }))
    
    fetch(`/api/questionnaires/${questionnaireId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Questionário não encontrado')
        const data = await res.json()
        const q = data.data
        
        let questionsFromDb = []
        if (Array.isArray(q.questions)) {
          questionsFromDb = q.questions
        } else if (typeof q.questions === 'string') {
          try {
            questionsFromDb = JSON.parse(q.questions)
          } catch {}
        }
        
        setDebugInfo(prev => ({
          ...prev,
          questionsFromDb: questionsFromDb.length,
          questionnaireLoaded: true,
          dbData: q
        }))
        
        setQuestionnaire({
          id: q.id,
          title: q.title || '',
          description: q.description || '',
          category: q.category || '',
          specialty: q.specialty || '',
          questions: questionsFromDb || [],
          is_active: q.is_active ?? true,
          expires_at: q.expires_at || undefined,
        })
        
        setQuestions(questionsFromDb || [])
        setDebugInfo(prev => ({ ...prev, storeUpdated: true }))
      })
      .catch((error) => {
        console.error('Erro ao carregar questionário:', error)
        setDebugInfo(prev => ({ ...prev, loadError: error.message }))
        toast.error('Não foi possível carregar o questionário para edição.')
      })
      .finally(() => {
        setLoading(false)
        setDebugInfo(prev => ({ ...prev, loadingFinished: true }))
      })
  }, [questionnaireId, setQuestions])

  const handleQuestionsChange = (newQuestions: Question[]) => {
    setQuestions(newQuestions)
    setQuestionnaire(prev => ({
      ...prev,
      questions: newQuestions
    }))
    setDebugInfo(prev => ({
      ...prev,
      lastUpdate: new Date().toISOString(),
      questionsUpdated: newQuestions.length
    }))
  }

  const addFacialComplaint = () => {
    const newQuestion: Question = {
      id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question_text: 'Selecione suas queixas faciais',
      question_type: 'facial_complaints',
      required: false,
      order: questions.length
    }
    
    const updatedQuestions = [...questions, newQuestion]
    handleQuestionsChange(updatedQuestions)
    toast.success('Pergunta facial adicionada!')
  }

  const addBodyComplaint = () => {
    const newQuestion: Question = {
      id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question_text: 'Selecione suas queixas corporais',
      question_type: 'body_complaints',
      required: false,
      order: questions.length
    }
    
    const updatedQuestions = [...questions, newQuestion]
    handleQuestionsChange(updatedQuestions)
    toast.success('Pergunta corporal adicionada!')
  }

  const simulateQuestionBankAdd = () => {
    const questionsToAdd = [
      {
        id: `question_${Date.now()}_1_${Math.random().toString(36).substr(2, 9)}`,
        question_text: 'Pergunta do banco 1',
        question_type: 'text' as const,
        required: false,
        order: questions.length
      },
      {
        id: `question_${Date.now()}_2_${Math.random().toString(36).substr(2, 9)}`,
        question_text: 'Pergunta do banco 2',
        question_type: 'facial_complaints' as const,
        required: false,
        order: questions.length + 1
      }
    ]
    
    addQuestions(questionsToAdd)
    setDebugInfo(prev => ({
      ...prev,
      bankQuestionsAdded: questionsToAdd.length,
      lastBankAdd: new Date().toISOString()
    }))
    toast.success('Perguntas do banco adicionadas!')
  }

  const goToQuestionBank = () => {
    router.push('/dashboard/questionnaires/builder/question-bank')
  }

  const goToRealBuilder = () => {
    router.push(`/dashboard/questionnaires/builder?id=${questionnaireId}`)
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Debug: Sincronização Builder</h1>
        <p className="text-muted-foreground">
          Teste de sincronização entre store e estado local do builder
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controles */}
        <Card>
          <CardHeader>
            <CardTitle>Controles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button onClick={addFacialComplaint} className="w-full">
                Adicionar Queixa Facial
              </Button>
              <Button onClick={addBodyComplaint} className="w-full">
                Adicionar Queixa Corporal
              </Button>
              <Button onClick={simulateQuestionBankAdd} className="w-full" variant="outline">
                Simular Banco de Perguntas
              </Button>
            </div>
            
            <div className="space-y-2">
              <Button onClick={goToQuestionBank} variant="outline" className="w-full">
                Ir para Banco Real
              </Button>
              <Button onClick={goToRealBuilder} variant="outline" className="w-full">
                Ir para Builder Real
              </Button>
              <Button onClick={clearQuestions} variant="destructive" className="w-full">
                Limpar Store
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="font-mono bg-gray-100 p-2 rounded">
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado Local */}
        <Card>
          <CardHeader>
            <CardTitle>Estado Local (questionnaire)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>ID:</strong> {questionnaire.id || 'N/A'}</p>
              <p><strong>Título:</strong> {questionnaire.title}</p>
              <p><strong>Perguntas:</strong> {questionnaire.questions.length}</p>
              
              {questionnaire.questions.length > 0 && (
                <div className="space-y-1">
                  <h4 className="font-medium">Perguntas:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {questionnaire.questions.map((q, idx) => (
                      <div key={q.id} className="text-xs p-2 bg-gray-50 rounded">
                        {idx + 1}. {q.question_text} ({q.question_type})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estado do Store */}
        <Card>
          <CardHeader>
            <CardTitle>Estado do Store</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Perguntas no Store:</strong> {questions.length}</p>
              
              {questions.length > 0 && (
                <div className="space-y-1">
                  <h4 className="font-medium">Perguntas:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="text-xs p-2 bg-blue-50 rounded">
                        {idx + 1}. {q.question_text} ({q.question_type})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 