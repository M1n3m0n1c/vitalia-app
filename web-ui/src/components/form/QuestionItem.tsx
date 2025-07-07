'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  GripVertical, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Star,
  Type,
  List,
  CheckSquare,
  BarChart3,
  Sliders,
  Calendar,
  Upload,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Question } from '@/types/questionnaire'
import { QuestionRenderer } from './QuestionRenderer'

interface QuestionItemProps {
  question: Question
  onUpdate: (updatedQuestion: Partial<Question>) => void
  onDelete: () => void
  onDuplicate: () => void
}

const QUESTION_TYPE_ICONS = {
  text: Type,
  radio: List,
  checkbox: CheckSquare,
  scale: BarChart3,
  slider: Sliders,
  date: Calendar,
  file: Upload,
  yes_no: HelpCircle
}

const QUESTION_TYPE_LABELS = {
  text: 'Texto Livre',
  radio: 'Escolha Única',
  checkbox: 'Múltipla Escolha',
  scale: 'Escala Numérica',
  slider: 'Escala Visual',
  date: 'Data',
  file: 'Upload de Arquivo',
  yes_no: 'Sim/Não/Não Sei'
}

export function QuestionItem({ question, onUpdate, onDelete, onDuplicate }: QuestionItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const Icon = QUESTION_TYPE_ICONS[question.question_type] || Type
  const typeLabel = QUESTION_TYPE_LABELS[question.question_type] || question.question_type

  const handleRequiredToggle = (required: boolean) => {
    onUpdate({ required })
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className={`transition-all duration-200 ${
        isDragging ? 'shadow-lg scale-105 rotate-2' : 'hover:shadow-md'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
          >
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs">
                    {typeLabel}
                  </Badge>
                  {question.required && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Obrigatória
                    </Badge>
                  )}
                </div>
                <h4 className="font-medium text-sm leading-relaxed line-clamp-2">
                  {question.question_text}
                </h4>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="h-8 w-8 p-0"
                >
                  {showPreview ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDuplicate}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja remover esta pergunta? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Settings */}
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id={`required-${question.id}`}
                  checked={question.required}
                  onCheckedChange={handleRequiredToggle}
                />
                <Label htmlFor={`required-${question.id}`} className="text-sm">
                  Obrigatória
                </Label>
              </div>
            </div>

            {/* Question Preview */}
            {showPreview && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                <div className="text-xs text-muted-foreground mb-2">Preview:</div>
                <QuestionRenderer
                  question={question}
                  value={undefined}
                  onChange={() => {}}
                  disabled={true}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 