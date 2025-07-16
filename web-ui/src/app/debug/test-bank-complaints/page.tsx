"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface QuestionBankItem {
  id: string
  question_text: string
  question_type: string
  category?: string
  specialty?: string
  is_default: boolean
}

export default function TestBankComplaintsPage() {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  const fetchQuestions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/questions-bank-debug')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      setQuestions(data.questions || [])
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error)
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const filteredQuestions = questions.filter(q => 
    q.question_text.toLowerCase().includes(filter.toLowerCase()) ||
    q.question_type.toLowerCase().includes(filter.toLowerCase())
  )

  const complaintQuestions = questions.filter(q => 
    q.question_type === 'facial_complaints' || q.question_type === 'body_complaints'
  )

  const facialQuestions = questions.filter(q => q.question_type === 'facial_complaints')
  const bodyQuestions = questions.filter(q => q.question_type === 'body_complaints')

  const testAddComplaintToQuestionnaire = async (question: QuestionBankItem) => {
    try {
      // Simular adição ao questionário
      console.log('Adicionando pergunta ao questionário:', question)
      toast.success(`Pergunta "${question.question_text}" adicionada ao questionário`)
    } catch (error) {
      console.error('Erro ao adicionar pergunta:', error)
      toast.error('Erro ao adicionar pergunta')
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Teste do Banco de Perguntas - Queixas</h1>
        <div className="flex gap-4 mb-4">
          <Button onClick={fetchQuestions} disabled={loading}>
            {loading ? 'Carregando...' : 'Recarregar Perguntas'}
          </Button>
          <Input
            placeholder="Filtrar perguntas..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total de Perguntas</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{questions.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Perguntas de Queixa</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{complaintQuestions.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Queixas Faciais</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{facialQuestions.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Queixas Corporais</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{bodyQuestions.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Erro */}
        {error && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Erro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Perguntas de Queixa */}
        {complaintQuestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Perguntas de Queixa ({complaintQuestions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaintQuestions.map((question) => (
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
                    <div className="text-sm text-muted-foreground mb-3">
                      <p>ID: {question.id}</p>
                      {question.category && <p>Categoria: {question.category}</p>}
                      {question.specialty && <p>Especialidade: {question.specialty}</p>}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => testAddComplaintToQuestionnaire(question)}
                    >
                      Testar Adição ao Questionário
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Todas as perguntas filtradas */}
        <Card>
          <CardHeader>
            <CardTitle>Todas as Perguntas ({filteredQuestions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredQuestions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {loading ? 'Carregando...' : 'Nenhuma pergunta encontrada'}
              </p>
            ) : (
              <div className="space-y-2">
                {filteredQuestions.map((question) => (
                  <div key={question.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{question.question_text}</span>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {question.question_type}
                        </Badge>
                        {question.is_default && (
                          <Badge variant="secondary" className="text-xs">Padrão</Badge>
                        )}
                      </div>
                    </div>
                    {(question.category || question.specialty) && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {question.category && `Categoria: ${question.category}`}
                        {question.category && question.specialty && ' • '}
                        {question.specialty && `Especialidade: ${question.specialty}`}
                      </div>
                    )}
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