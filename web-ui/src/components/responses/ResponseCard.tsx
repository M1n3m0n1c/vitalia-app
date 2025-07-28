'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, User, Eye } from 'lucide-react'
import Link from 'next/link'
import type { QuestionnaireResponse } from '@/types/responses'

interface ResponseCardProps {
  response: QuestionnaireResponse
}

export function ResponseCard({ response }: ResponseCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{response.questionnaires.title}</CardTitle>
            <Badge className={getCategoryBadgeColor(response.questionnaires.category)}>
              {getCategoryLabel(response.questionnaires.category)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{response.patients.full_name}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Respondido em: {formatDate(response.completed_at)}</span>
        </div>

        {response.questionnaires.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {response.questionnaires.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            {response.answers.length} respostas
          </div>
          
          <Link href={`/dashboard/responses/${response.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalhes
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 