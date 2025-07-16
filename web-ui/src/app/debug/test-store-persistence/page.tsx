"use client"

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuestionnaireBuilderStore } from '@/store/questionnaireBuilderStore'
import { useRouter } from 'next/navigation'

export default function TestStorePersistencePage() {
  const { questions, setQuestions, addQuestions, clearQuestions } = useQuestionnaireBuilderStore()
  const router = useRouter()

  useEffect(() => {
    // Hidratar o store
    useQuestionnaireBuilderStore.persist.rehydrate()
  }, [])

  const addTestQuestion = () => {
    const testQuestion = {
      id: `test_${Date.now()}`,
      question_text: 'Pergunta de teste para persistência',
      question_type: 'text' as const,
      required: false,
      order: questions.length
    }
    
    addQuestions([testQuestion])
  }

  const addFacialQuestion = () => {
    const facialQuestion = {
      id: `facial_${Date.now()}`,
      question_text: 'Queixas faciais - teste de persistência',
      question_type: 'facial_complaints' as const,
      required: true,
      order: questions.length
    }
    
    addQuestions([facialQuestion])
  }

  const navigateToBuilder = () => {
    router.push('/dashboard/questionnaires/builder')
  }

  const navigateToQuestionBank = () => {
    router.push('/dashboard/questionnaires/builder/question-bank')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Teste de Persistência do Store</h1>
        <p className="text-muted-foreground">
          Teste se o store do Zustand está persistindo entre navegações
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estado Atual do Store</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Perguntas no store:</span>
                <span className="text-lg font-bold">{questions.length}</span>
              </div>
              
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div key={question.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{question.question_text}</span>
                      <span className="text-sm text-muted-foreground">
                        {question.question_type}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ID: {question.id} | Ordem: {question.order}
                    </div>
                  </div>
                ))}
              </div>
              
              {questions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma pergunta no store
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações de Teste</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={addTestQuestion}>
                  Adicionar Pergunta Texto
                </Button>
                <Button onClick={addFacialQuestion}>
                  Adicionar Pergunta Facial
                </Button>
                <Button onClick={clearQuestions} variant="destructive">
                  Limpar Store
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Navegação (para testar persistência):</h3>
                <div className="flex gap-2">
                  <Button onClick={navigateToBuilder} variant="outline">
                    Ir para Builder
                  </Button>
                  <Button onClick={navigateToQuestionBank} variant="outline">
                    Ir para Banco de Perguntas
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instruções de Teste</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>1.</strong> Adicione algumas perguntas usando os botões acima</p>
              <p><strong>2.</strong> Navegue para o Builder ou Banco de Perguntas</p>
              <p><strong>3.</strong> Volte para esta página</p>
              <p><strong>4.</strong> Verifique se as perguntas ainda estão no store</p>
              <p><strong>5.</strong> Se as perguntas persistirem, a correção funcionou!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 