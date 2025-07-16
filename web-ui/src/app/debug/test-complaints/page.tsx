"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface QuestionBankItem {
  id: string
  question_text: string
  question_type: string
  category?: string
  specialty?: string
  is_default: boolean
}

export default function TestComplaintsPage() {
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
        console.log('Perguntas carregadas:', data.data)
      } else {
        setError(`Erro da API: ${data.error}`)
      }
    } catch (err) {
      setError(`Erro de rede: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testCreateComplaintQuestion = async (type: 'facial_complaints' | 'body_complaints') => {
    try {
      const response = await fetch('/api/questions-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_text: `Teste de pergunta ${type === 'facial_complaints' ? 'facial' : 'corporal'}`,
          question_type: type,
          category: 'estetica-facial',
          specialty: 'dermatologia'
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        toast.success('Pergunta criada com sucesso!')
        fetchQuestions()
      } else {
        toast.error(`Erro ao criar pergunta: ${result.error}`)
      }
    } catch (err) {
      toast.error(`Erro: ${err}`)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const complaintsQuestions = questions.filter(q => 
    q.question_type === 'facial_complaints' || q.question_type === 'body_complaints'
  )

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Teste de Perguntas de Queixa</h1>
        <div className="flex gap-4 mb-4">
          <Button onClick={fetchQuestions} disabled={loading}>
            {loading ? 'Carregando...' : 'Recarregar Perguntas'}
          </Button>
          <Button onClick={() => testCreateComplaintQuestion('facial_complaints')}>
            Criar Pergunta Facial
          </Button>
          <Button onClick={() => testCreateComplaintQuestion('body_complaints')}>
            Criar Pergunta Corporal
          </Button>
        </div>
        
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            {error}
          </div>
        )}
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{questions.length}</div>
                <div className="text-sm text-muted-foreground">Total de Perguntas</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{complaintsQuestions.length}</div>
                <div className="text-sm text-muted-foreground">Perguntas de Queixa</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{questions.filter(q => q.is_default).length}</div>
                <div className="text-sm text-muted-foreground">Perguntas Padrão</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perguntas de Queixa Encontradas</CardTitle>
          </CardHeader>
          <CardContent>
            {complaintsQuestions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma pergunta de queixa encontrada
              </p>
            ) : (
              <div className="space-y-4">
                {complaintsQuestions.map((question) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{question.question_text}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          {question.question_type}
                        </Badge>
                        {question.is_default && (
                          <Badge variant="secondary">Padrão</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Categoria: {question.category || 'N/A'}</p>
                      <p>Especialidade: {question.specialty || 'N/A'}</p>
                      <p>ID: {question.id}</p>
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
            {questions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma pergunta encontrada
              </p>
            ) : (
              <div className="space-y-2">
                {questions.map((question) => (
                  <div key={question.id} className="flex items-center justify-between p-2 border rounded">
                    <span className="truncate mr-4">{question.question_text}</span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {question.question_type}
                      </Badge>
                      {question.is_default && (
                        <Badge variant="secondary" className="text-xs">Padrão</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 