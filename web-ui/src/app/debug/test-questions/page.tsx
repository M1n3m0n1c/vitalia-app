"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QuestionBankItem {
  id: string
  question_text: string
  question_type: string
  category?: string
  specialty?: string
  is_default: boolean
}

export default function TestQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchQuestions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/questions-bank')
      const data = await response.json()
      
      if (response.ok) {
        setQuestions(data.data || [])
      } else {
        setError(`Erro da API: ${data.error}`)
      }
    } catch (err) {
      setError(`Erro de rede: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const complaintsQuestions = questions.filter(q => 
    q.question_type === 'facial_complaints' || q.question_type === 'body_complaints'
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Teste - Perguntas de Queixas</h1>
          <p className="text-muted-foreground">
            Verificando se as perguntas de queixas faciais e corporais estão no banco
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <Button onClick={fetchQuestions} disabled={loading}>
            {loading ? 'Carregando...' : 'Recarregar Perguntas'}
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Perguntas</p>
                  <p className="text-2xl font-bold">{questions.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Queixas Faciais</p>
                  <p className="text-2xl font-bold">
                    {questions.filter(q => q.question_type === 'facial_complaints').length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Queixas Corporais</p>
                  <p className="text-2xl font-bold">
                    {questions.filter(q => q.question_type === 'body_complaints').length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Perguntas Padrão</p>
                  <p className="text-2xl font-bold">
                    {questions.filter(q => q.is_default).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Perguntas de Queixas Encontradas</CardTitle>
            </CardHeader>
            <CardContent>
              {complaintsQuestions.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma pergunta de queixas encontrada</p>
              ) : (
                <div className="space-y-4">
                  {complaintsQuestions.map((question) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{question.question_text}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          question.question_type === 'facial_complaints' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {question.question_type}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>ID: {question.id}</p>
                        <p>Categoria: {question.category}</p>
                        <p>Especialidade: {question.specialty}</p>
                        <p>Padrão: {question.is_default ? 'Sim' : 'Não'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Todas as Perguntas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {questions.map((question) => (
                  <div key={question.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <p className="font-medium truncate">{question.question_text}</p>
                      <p className="text-sm text-muted-foreground">{question.question_type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      question.is_default ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {question.is_default ? 'Padrão' : 'Personalizada'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 