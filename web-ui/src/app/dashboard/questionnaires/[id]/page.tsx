"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateBrasilia } from "@/lib/utils/date"
import Link from "next/link"
import { Tables } from "@/lib/supabase/database.types"

type Questionnaire = Tables<'questionnaires'>
import { Question } from '@/types/questionnaire'

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

const QUESTION_TYPE_LABELS: Record<string, string> = {
  text: 'Texto aberto',
  radio: 'Múltipla escolha (uma opção)',
  checkbox: 'Múltipla escolha (várias opções)',
  scale: 'Escala',
  slider: 'Slider',
  date: 'Data',
  file: 'Arquivo',
  yes_no: 'Sim/Não',
}

function getCategoryLabel(category: string | null | undefined) {
  if (!category) return 'Sem categoria'
  const cat = CATEGORIES.find(c => c.value === category)
  return cat?.label || category
}

export default function QuestionnaireDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/questionnaires/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Questionário não encontrado")
        }
        const data = await res.json()
        setQuestionnaire(data.data)
      })
      .catch(() => {
        setError("Questionário não encontrado.")
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>
  }

  if (error || !questionnaire) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">{error || "Questionário não encontrado."}</h2>
        <Link href="/dashboard/questionnaires">
          <Button>Voltar para lista</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{questionnaire.title}</CardTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant={questionnaire.is_active ? 'default' : 'secondary'}>
              {questionnaire.is_active ? 'Ativo' : 'Inativo'}
            </Badge>
            <Badge variant="outline">{getCategoryLabel(questionnaire.category)}</Badge>
          </div>
          {questionnaire.description && (
            <p className="text-muted-foreground mt-2">{questionnaire.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-muted-foreground">
            <div><b>Criado em:</b> {questionnaire.created_at ? formatDateBrasilia(questionnaire.created_at) : 'Data desconhecida'}</div>
            <div><b>Atualizado em:</b> {questionnaire.updated_at ? formatDateBrasilia(questionnaire.updated_at) : 'Data desconhecida'}</div>
          </div>
          <div className="mb-4">
            <b>Perguntas:</b>
            <ul className="list-disc ml-6 mt-2">
              {(() => {
                let questions: Question[] = [];
                if (Array.isArray(questionnaire.questions)) {
                  questions = questionnaire.questions as unknown as Question[];
                } else if (typeof questionnaire.questions === 'string') {
                  try {
                    questions = JSON.parse(questionnaire.questions) as Question[];
                  } catch {}
                }
                if (questions.length === 0) {
                  return <li>Nenhuma pergunta cadastrada.</li>;
                }
                return questions.map((q, idx) => (
                  <li key={q.id ?? idx} className="mb-2">
                    <div className="font-medium">{q.question_text}</div>
                    <div className="text-xs text-muted-foreground">
                      {QUESTION_TYPE_LABELS[q.question_type] || q.question_type}
                    </div>
                  </li>
                ));
              })()}
            </ul>
          </div>
          <div className="flex gap-2 mt-6">
            <Link href={`/dashboard/questionnaires/builder?id=${questionnaire.id}`}>
              <Button variant="outline">Editar</Button>
            </Link>
            <Link href="/dashboard/questionnaires">
              <Button 
                className="bg-[#F5F5F4] text-gray-700 hover:bg-[#E7E5E4] border border-gray-300"
              >
                Voltar
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 