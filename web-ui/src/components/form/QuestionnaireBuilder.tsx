'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'
import { Plus, Database, Search, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Question } from '@/types/questionnaire'
import { QuestionItem } from './QuestionItem'
import { NewQuestionModal } from './NewQuestionModal'
import { QuestionnairePreview } from './QuestionnairePreview'
import { QuestionnaireData } from '@/types/questionnaire'
import { useRouter } from 'next/navigation'

interface QuestionnaireBuilderProps {
  questions: Question[]
  onQuestionsChange: (questions: Question[]) => void
  title?: string
  description?: string
}

export function QuestionnaireBuilder({ questions, onQuestionsChange, title = 'Questionário sem título', description }: QuestionnaireBuilderProps) {
  const [showQuestionBank, setShowQuestionBank] = useState(false)
  const [showNewQuestion, setShowNewQuestion] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const router = useRouter()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id)
      const newIndex = questions.findIndex((q) => q.id === over.id)

      const reorderedQuestions = arrayMove(questions, oldIndex, newIndex).map((q, index) => ({
        ...q,
        order: index
      }))

      onQuestionsChange(reorderedQuestions)
      toast.success('Pergunta reordenada!')
    }
  }

  const handleAddQuestion = (question: Question) => {
    const newQuestion = {
      ...question,
      id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      order: questions.length
    }
    
    onQuestionsChange([...questions, newQuestion])
    toast.success('Pergunta adicionada!')
  }

  const handleUpdateQuestion = (questionId: string, updatedQuestion: Partial<Question>) => {
    const updatedQuestions = questions.map(q =>
      q.id === questionId ? { ...q, ...updatedQuestion } as Question : q
    )
    onQuestionsChange(updatedQuestions)
    toast.success('Pergunta atualizada!')
  }

  const handleDeleteQuestion = (questionId: string) => {
    const filteredQuestions = questions
      .filter(q => q.id !== questionId)
      .map((q, index) => ({ ...q, order: index }))
    
    onQuestionsChange(filteredQuestions)
    toast.success('Pergunta removida!')
  }

  const handleDuplicateQuestion = (questionId: string) => {
    const questionToDuplicate = questions.find(q => q.id === questionId)
    if (questionToDuplicate) {
      const duplicatedQuestion = {
        ...questionToDuplicate,
        id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        question_text: `${questionToDuplicate.question_text} (Cópia)`,
        order: questions.length
      }
      
      onQuestionsChange([...questions, duplicatedQuestion])
      toast.success('Pergunta duplicada!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Perguntas do Questionário</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/questionnaires/builder/question-bank')}
              >
                <Database className="h-4 w-4 mr-2" />
                Banco de Perguntas
              </Button>
              <Button
                size="sm"
                onClick={() => setShowNewQuestion(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Pergunta
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Nenhuma pergunta adicionada</h3>
                  <p className="text-muted-foreground">
                    Comece adicionando perguntas do banco ou criando novas perguntas personalizadas.
                  </p>
                </div>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard/questionnaires/builder/question-bank')}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Banco de Perguntas
                  </Button>
                  <Button onClick={() => setShowNewQuestion(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Pergunta
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {questions.length} pergunta(s) • Arraste para reordenar
                </p>
                <Badge variant="outline">
                  {questions.filter(q => q.required).length} obrigatória(s)
                </Badge>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
              >
                <SortableContext
                  items={questions.map(q => q.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {questions
                      .sort((a, b) => a.order - b.order)
                      .map((question) => (
                        <QuestionItem
                          key={question.id}
                          question={question}
                          onUpdate={(updatedQuestion: Partial<Question>) => handleUpdateQuestion(question.id, updatedQuestion)}
                          onDelete={() => handleDeleteQuestion(question.id)}
                          onDuplicate={() => handleDuplicateQuestion(question.id)}
                        />
                      ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {showNewQuestion && (
        <NewQuestionModal
          onClose={() => setShowNewQuestion(false)}
          onAddQuestion={handleAddQuestion}
        />
      )}

      {/* Preview Modal */}
      {showPreview && (
        <QuestionnairePreview
          questionnaire={{
            title,
            description,
            questions: questions.sort((a, b) => a.order - b.order)
          } as QuestionnaireData}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
} 