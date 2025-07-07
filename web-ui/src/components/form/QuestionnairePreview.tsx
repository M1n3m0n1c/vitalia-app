'use client'

import { useState } from 'react'
import { X, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { QuestionnaireData, Answer } from '@/types/questionnaire'
import { QuestionnaireForm } from './QuestionnaireForm'

interface QuestionnairePreviewProps {
  questionnaire: QuestionnaireData
  onClose: () => void
}

export function QuestionnairePreview({ questionnaire, onClose }: QuestionnairePreviewProps) {
  const [previewAnswers, setPreviewAnswers] = useState<Answer[]>([])

  const handlePreviewSubmit = (answers: Answer[]) => {
    console.log('Preview answers:', answers)
    // No preview, apenas logamos as respostas
  }

  const handlePreviewCancel = () => {
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <Eye className="h-5 w-5" />
            <div>
              <DialogTitle>Preview do Questionário</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Visualize como o questionário aparecerá para os pacientes
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {questionnaire.questions.length} pergunta(s)
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-1">
            <QuestionnaireForm
              title={questionnaire.title}
              description={questionnaire.description}
              questions={questionnaire.questions}
              onSubmit={handlePreviewSubmit}
              onCancel={handlePreviewCancel}
              disabled={false}
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              Este é apenas um preview. As respostas não serão salvas.
            </span>
            <Button variant="outline" onClick={onClose}>
              Fechar Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 