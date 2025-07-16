"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useQuestionnaireBuilderStore } from '@/store/questionnaireBuilderStore'
import { Question } from '@/types/questionnaire'
import { QuestionRenderer } from '@/components/form/QuestionRenderer'

export default function TestAddComplaintsPage() {
  const { questions, addQuestions, setQuestions, clearQuestions } = useQuestionnaireBuilderStore()
  const [loading, setLoading] = useState(false)

  const testAddFacialComplaint = () => {
    const facialQuestion: Question = {
      id: `question_${Date.now()}_facial`,
      question_text: 'Teste de queixa facial',
      question_type: 'facial_complaints',
      required: false,
      order: questions.length
    }
    
    addQuestions([facialQuestion])
    toast.success('Pergunta facial adicionada!')
  }

  const testAddBodyComplaint = () => {
    const bodyQuestion: Question = {
      id: `question_${Date.now()}_body`,
      question_text: 'Teste de queixa corporal',
      question_type: 'body_complaints',
      required: false,
      order: questions.length
    }
    
    addQuestions([bodyQuestion])
    toast.success('Pergunta corporal adicionada!')
  }

  const testAddFromBank = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/questions-bank')
      const data = await response.json()
      
      if (response.ok) {
        const complaintsQuestions = data.data.filter((q: any) => 
          q.question_type === 'facial_complaints' || q.question_type === 'body_complaints'
        )
        
        if (complaintsQuestions.length > 0) {
          const questionsToAdd = complaintsQuestions.map((bankQuestion: any, index: number) => ({
            id: `question_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
            question_text: bankQuestion.question_text,
            question_type: bankQuestion.question_type as any,
            required: false,
            order: 0,
            options: bankQuestion.options || undefined
          }))
          
          addQuestions(questionsToAdd)
          toast.success(`${questionsToAdd.length} pergunta(s) do banco adicionada(s)!`)
        } else {
          toast.error('Nenhuma pergunta de queixa encontrada no banco')
        }
      } else {
        toast.error(`Erro ao carregar perguntas: ${data.error}`)
      }
    } catch (err) {
      toast.error(`Erro: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Teste de Adição de Perguntas de Queixa</h1>
        <div className="flex gap-4 mb-4">
          <Button onClick={testAddFacialComplaint}>
            Adicionar Queixa Facial
          </Button>
          <Button onClick={testAddBodyComplaint}>
            Adicionar Queixa Corporal
          </Button>
          <Button onClick={testAddFromBank} disabled={loading}>
            {loading ? 'Carregando...' : 'Adicionar do Banco'}
          </Button>
          <Button onClick={clearQuestions} variant="destructive">
            Limpar Todas
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Perguntas no Store ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma pergunta no store
              </p>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{question.question_text}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          {question.question_type}
                        </Badge>
                        {question.required && (
                          <Badge variant="secondary">Obrigatória</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>ID: {question.id}</p>
                      <p>Ordem: {question.order}</p>
                      {(question as any).options && (
                        <p>Opções: {JSON.stringify((question as any).options)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teste de Renderização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{question.question_text}</h4>
                  <div className="text-sm text-muted-foreground mb-2">
                    Tipo: {question.question_type}
                  </div>
                  
                  {question.question_type === 'facial_complaints' && (
                    <div className="p-4 bg-blue-50 rounded mb-4">
                      <p className="text-sm">✅ Pergunta de queixa facial detectada</p>
                      <p className="text-xs text-muted-foreground">
                        Esta pergunta deveria renderizar o componente FacialComplaintsQuestion
                      </p>
                    </div>
                  )}
                  
                  {question.question_type === 'body_complaints' && (
                    <div className="p-4 bg-green-50 rounded mb-4">
                      <p className="text-sm">✅ Pergunta de queixa corporal detectada</p>
                      <p className="text-xs text-muted-foreground">
                        Esta pergunta deveria renderizar o componente BodyComplaintsQuestion
                      </p>
                    </div>
                  )}

                  {/* Renderizar a pergunta usando o QuestionRenderer */}
                  <div className="mt-4 border-t pt-4">
                    <h5 className="text-sm font-medium mb-2">Renderização Real:</h5>
                    <QuestionRenderer
                      question={question}
                      value={undefined}
                      onChange={(answer) => {
                        console.log('Resposta:', answer)
                      }}
                      error={undefined}
                      disabled={false}
                      showRequired={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 