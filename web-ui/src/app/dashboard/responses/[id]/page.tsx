'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Calendar, User, FileText, Phone, Mail, IdCard } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import type { QuestionnaireResponse, ResponseDetailResponse, Answer } from '@/types/responses'

export default function ResponseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [response, setResponse] = useState<QuestionnaireResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/responses/${params.id}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Erro ao carregar resposta')
        }

        setResponse(data.data)
      } catch (error) {
        console.error('Erro ao carregar resposta:', error)
        toast.error('Erro ao carregar resposta')
        router.push('/dashboard/responses')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchResponse()
    }
  }, [params.id, router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAnswer = (answer: Answer, question: any) => {
    if (!answer.value && answer.value !== 0) return 'Não respondido'

    switch (question?.question_type) {
      case 'checkbox':
      case 'body_complaints':
      case 'facial_complaints':
        if (Array.isArray(answer.value)) {
          return answer.value.length > 0 ? answer.value.join(', ') : 'Nenhuma opção selecionada'
        }
        return answer.value
      
      case 'radio':
      case 'yes_no':
        return answer.value
      
      case 'scale':
      case 'slider':
        return `${answer.value}/10`
      
      case 'date':
        try {
          return new Date(answer.value).toLocaleDateString('pt-BR')
        } catch {
          return answer.value
        }
      
      case 'file':
        if (Array.isArray(answer.value)) {
          return answer.value.map(file => file.name || file).join(', ')
        }
        return answer.value?.name || answer.value || 'Arquivo enviado'
      
      default:
        return answer.value
    }
  }

  const getCategoryBadgeColor = (category?: string) => {
    const colors: Record<string, string> = {
      'anamnese-geral': 'bg-blue-100 text-blue-800',
      'estetica-facial': 'bg-pink-100 text-pink-800',
      'dermatologia': 'bg-green-100 text-green-800',
      'cirurgia-plastica': 'bg-purple-100 text-purple-800',
      'odontologia': 'bg-yellow-100 text-yellow-800',
      'pos-operatorio': 'bg-orange-100 text-orange-800',
      'satisfacao': 'bg-emerald-100 text-emerald-800'
    }
    return colors[category || ''] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryLabel = (category?: string) => {
    const labels: Record<string, string> = {
      'anamnese-geral': 'Anamnese Geral',
      'estetica-facial': 'Estética Facial',
      'dermatologia': 'Dermatologia',
      'cirurgia-plastica': 'Cirurgia Plástica',
      'odontologia': 'Odontologia',
      'pos-operatorio': 'Pós-Operatório',
      'satisfacao': 'Satisfação'
    }
    return labels[category || ''] || category || 'Sem categoria'
  }

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      text: 'Texto',
      radio: 'Múltipla escolha',
      checkbox: 'Múltiplas opções',
      scale: 'Escala',
      date: 'Data',
      file: 'Arquivo',
      yes_no: 'Sim/Não',
      slider: 'Deslizador',
      body_complaints: 'Queixas Corporais',
      facial_complaints: 'Queixas Faciais'
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Resposta não encontrada</h3>
        <p className="text-muted-foreground mb-4">
          A resposta que você está procurando não foi encontrada.
        </p>
        <Link href="/dashboard/responses">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Respostas
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/responses">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detalhes da Resposta</h1>
            <p className="text-muted-foreground">
              Visualização completa das respostas do questionário
            </p>
          </div>
        </div>
      </div>

      {/* Patient and Questionnaire Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informações do Paciente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="font-medium">{response.patients.full_name}</div>
            </div>
            {response.patients.email && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{response.patients.email}</span>
              </div>
            )}
            {response.patients.phone && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{response.patients.phone}</span>
              </div>
            )}
            {response.patients.cpf && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <IdCard className="h-4 w-4" />
                <span>{response.patients.cpf}</span>
              </div>
            )}
            {response.patients.birth_date && (
              <div className="text-sm text-muted-foreground">
                <strong>Data de Nascimento:</strong> {new Date(response.patients.birth_date).toLocaleDateString('pt-BR')}
              </div>
            )}
            {response.patients.gender && (
              <div className="text-sm text-muted-foreground">
                <strong>Gênero:</strong> {response.patients.gender === 'male' ? 'Masculino' : response.patients.gender === 'female' ? 'Feminino' : 'Outro'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Questionnaire Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Informações do Questionário</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="font-medium">{response.questionnaires.title}</div>
              {response.questionnaires.description && (
                <div className="text-sm text-muted-foreground mt-1">
                  {response.questionnaires.description}
                </div>
              )}
            </div>
            <Badge className={getCategoryBadgeColor(response.questionnaires.category)}>
              {getCategoryLabel(response.questionnaires.category)}
            </Badge>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Respondido em: {formatDate(response.completed_at)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <strong>Total de perguntas:</strong> {response.questionnaires.questions?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Answers */}
      <Card>
        <CardHeader>
          <CardTitle>Respostas do Questionário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {response.questionnaires.questions?.map((question, index) => {
              const answer = response.answers.find(a => a.question_id === question.id)
              
              return (
                <div key={question.id || index}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">
                          Pergunta {index + 1}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {getQuestionTypeLabel(question.question_type)}
                        </p>
                        <p className="font-medium">{question.question_text}</p>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="font-medium text-sm text-muted-foreground mb-1">Resposta:</div>
                      <div className="text-sm">
                        {formatAnswer(answer || { question_id: question.id, value: null }, question)}
                      </div>
                    </div>
                  </div>
                  
                  {index < (response.questionnaires.questions?.length || 0) - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              )
            })}
            
            {(!response.questionnaires.questions || response.questionnaires.questions.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma pergunta encontrada neste questionário.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 