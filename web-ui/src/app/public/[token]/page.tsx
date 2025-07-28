"use client"

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuestionnaireForm } from '@/components/form/QuestionnaireForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

// Observação: Este componente foi implementado como Client Component para permitir uso de hooks (useState, useEffect) e fetch dinâmico do questionário via token.
// Alternativa: Poderia ser Server Component (async), fazendo o fetch no server e passando os dados para um Client Component filho, mas perderíamos interatividade direta com hooks aqui.

export default function PublicQuestionnairePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [questionnaire, setQuestionnaire] = useState<any>(null)
  const [patient, setPatient] = useState<any>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [alreadyAnswered, setAlreadyAnswered] = useState<null | { completed_at: string }> (null)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/public-link/${token}`)
        if (!res.ok) {
          setError('Link inválido ou expirado.')
          setLoading(false)
          return
        }
        const { data } = await res.json()
        setQuestionnaire(data.questionnaire)
        setPatient(data.patient)
        if (data.response) {
          setAlreadyAnswered({ completed_at: data.response.completed_at })
        }
      } catch (e) {
        setError('Erro ao carregar dados.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  if (loading) {
    return <div>Carregando...</div>
  }
  if (error) {
    return <Alert variant="destructive">{error}</Alert>
  }
  if (!questionnaire || !patient) {
    return <Alert variant="destructive">Dados não encontrados.</Alert>
  }

  // Função para submissão das respostas
  const handleSubmit = async (answers: any) => {
    try {
      const response = await fetch(`/api/public-link/${token}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      })
      if (response.ok) {
        setShowSuccess(true)
      } else if (response.status === 409) {
        // Já respondido
        const data = await response.json()
        setAlreadyAnswered({ completed_at: data.response?.completed_at })
      } else {
        setError('Erro ao enviar respostas. Tente novamente.')
      }
    } catch {
      setError('Erro ao enviar respostas. Tente novamente.')
    }
  }

  // Modal de sucesso
  if (showSuccess) {
    return (
      <Dialog open>
        <DialogContent className="max-w-md mx-auto text-center">
          <DialogHeader>
            <DialogTitle>Respostas enviadas com sucesso!</DialogTitle>
            <DialogDescription>
              Obrigado por responder o questionário.<br />
              Suas respostas foram registradas.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  // Modal de já respondido
  if (alreadyAnswered) {
    return (
      <Dialog open>
        <DialogContent className="max-w-md mx-auto text-center">
          <DialogHeader>
            <DialogTitle>Questionário já respondido</DialogTitle>
            <DialogDescription>
              Você já respondeu este questionário.<br />
              <span>Data da resposta: <b>{new Date(alreadyAnswered.completed_at).toLocaleString('pt-BR')}</b></span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  // Modal de erro
  if (error) {
    return (
      <Dialog open>
        <DialogContent className="max-w-md mx-auto text-center">
          <DialogHeader>
            <DialogTitle>Erro</DialogTitle>
            <DialogDescription>{error}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{questionnaire.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionnaireForm
            title={questionnaire.title}
            description={questionnaire.description}
            questions={questionnaire.questions}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  )
} 