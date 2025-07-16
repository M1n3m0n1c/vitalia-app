'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuestionnaireBuilderStore } from '@/store/questionnaireBuilderStore'
import { Question } from '@/types/questionnaire'
import { toast } from 'sonner'

export default function TestExistingQuestionnairePage() {
  const router = useRouter()
  const [questionnaire, setQuestionnaire] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { questions, setQuestions, addQuestions, clearQuestions } = useQuestionnaireBuilderStore()

  // ID do questionário de teste
  const testQuestionnaireId = 'b91d419c-4145-4d19-a506-b3da2701b1b4'

  useEffect(() => {
    // Hidratar o store
    useQuestionnaireBuilderStore.persist.rehydrate()
  }, [])

  const loadQuestionnaire = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/questionnaires/${testQuestionnaireId}`)
      if (!response.ok) throw new Error('Questionário não encontrado')
      
      const data = await response.json()
      const q = data.data
      
      let questionsFromDb = []
      if (Array.isArray(q.questions)) {
        questionsFromDb = q.questions
      } else if (typeof q.questions === 'string') {
        try {
          questionsFromDb = JSON.parse(q.questions)
        } catch {}
      }
      
      setQuestionnaire(q)
      setQuestions(questionsFromDb || [])
      
      toast.success('Questionário carregado!')
    } catch (error) {
      console.error('Erro ao carregar questionário:', error)
      toast.error('Erro ao carregar questionário')
    } finally {
      setLoading(false)
    }
  }

  const addFacialComplaintsQuestion = () => {
    const facialQuestion: Question = {
      id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question_text: 'Selecione suas queixas faciais',
      question_type: 'facial_complaints',
      required: false,
      order: questions.length
    }
    
    addQuestions([facialQuestion])
    toast.success('Pergunta de queixas faciais adicionada!')
  }

  const addBodyComplaintsQuestion = () => {
    const bodyQuestion: Question = {
      id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question_text: 'Selecione suas queixas corporais',
      question_type: 'body_complaints',
      required: false,
      order: questions.length
    }
    
    addQuestions([bodyQuestion])
    toast.success('Pergunta de queixas corporais adicionada!')
  }

  const goToQuestionBank = () => {
    router.push('/dashboard/questionnaires/builder/question-bank')
  }

  const goToBuilder = () => {
    router.push(`/dashboard/questionnaires/builder?id=${testQuestionnaireId}`)
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Teste: Questionário Existente</h1>
        <p className="text-muted-foreground">
          Teste de carregamento de questionário existente e adição de perguntas
        </p>
      </div>

      <div className="space-y-6">
        {/* Controles */}
        <Card>
          <CardHeader>
            <CardTitle>Controles de Teste</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={loadQuestionnaire} 
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Carregando...' : 'Carregar Questionário'}
              </Button>
              <Button onClick={clearQuestions} variant="outline">
                Limpar Store
              </Button>
              <Button onClick={goToQuestionBank} variant="outline">
                Ir para Banco de Perguntas
              </Button>
              <Button onClick={goToBuilder} variant="outline">
                Ir para Builder
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={addFacialComplaintsQuestion}>
                Adicionar Queixas Faciais
              </Button>
              <Button onClick={addBodyComplaintsQuestion}>
                Adicionar Queixas Corporais
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info do Questionário */}
        {questionnaire && (
          <Card>
            <CardHeader>
              <CardTitle>Questionário Carregado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>ID:</strong> {questionnaire.id}</p>
                <p><strong>Título:</strong> {questionnaire.title}</p>
                <p><strong>Descrição:</strong> {questionnaire.description}</p>
                <p><strong>Perguntas no DB:</strong> {Array.isArray(questionnaire.questions) ? questionnaire.questions.length : 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estado do Store */}
        <Card>
          <CardHeader>
            <CardTitle>Estado do Store</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p><strong>Perguntas no Store:</strong> {questions.length}</p>
              
              {questions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Perguntas:</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="p-3 border rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{idx + 1}. {q.question_text}</p>
                            <p className="text-sm text-muted-foreground">
                              Tipo: {q.question_type} | Ordem: {q.order} | Obrigatória: {q.required ? 'Sim' : 'Não'}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">{q.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navegação */}
        <Card>
          <CardHeader>
            <CardTitle>Navegação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => router.push('/debug')}>
                Voltar para Debug
              </Button>
              <Button onClick={() => router.push('/dashboard/questionnaires')}>
                Voltar para Questionários
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 