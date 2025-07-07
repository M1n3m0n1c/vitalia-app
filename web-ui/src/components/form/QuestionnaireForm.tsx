import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { QuestionRenderer } from './QuestionRenderer'
import { Question, Answer } from '@/types/questionnaire'

interface QuestionnaireFormProps {
  title: string
  description?: string
  questions: Question[]
  onSubmit: (answers: Answer[]) => void
  onCancel?: () => void
  disabled?: boolean
}

export function QuestionnaireForm({
  title,
  description,
  questions,
  onSubmit,
  onCancel,
  disabled = false
}: QuestionnaireFormProps) {
  const [answers, setAnswers] = useState<Answer[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const handleAnswerChange = (answer: Answer) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.question_id === answer.question_id)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = answer
        return updated
      }
      return [...prev, answer]
    })
    
    // Limpar erro da pergunta
    if (errors[answer.question_id]) {
      setErrors(prev => {
        const updated = { ...prev }
        delete updated[answer.question_id]
        return updated
      })
    }
  }

  const validateAnswers = () => {
    const newErrors: Record<string, string> = {}
    
    questions.forEach(question => {
      if (question.required) {
        const answer = answers.find(a => a.question_id === question.id)
        if (!answer) {
          newErrors[question.id] = 'Esta pergunta é obrigatória'
        } else {
          // Validações específicas por tipo
          switch (question.question_type) {
            case 'text':
              if (answer.question_type === 'text' && (!answer.value || answer.value.trim() === '')) {
                newErrors[question.id] = 'Resposta não pode estar vazia'
              }
              break
            case 'radio':
              if (answer.question_type === 'radio' && !answer.selected_option) {
                newErrors[question.id] = 'Selecione uma opção'
              }
              break
            case 'checkbox':
              if (answer.question_type === 'checkbox' && (!answer.selected_options || answer.selected_options.length === 0)) {
                newErrors[question.id] = 'Selecione pelo menos uma opção'
              }
              break
            case 'scale':
              if (answer.question_type === 'scale' && (answer.value === undefined || answer.value === null)) {
                newErrors[question.id] = 'Selecione um valor'
              }
              break
            case 'slider':
              if (answer.question_type === 'slider' && (answer.value === undefined || answer.value === null)) {
                newErrors[question.id] = 'Selecione um valor'
              }
              break
            case 'date':
              if (answer.question_type === 'date' && !answer.value) {
                newErrors[question.id] = 'Selecione uma data'
              }
              break
            case 'file':
              if (answer.question_type === 'file' && (!answer.files || answer.files.length === 0)) {
                newErrors[question.id] = 'Faça upload de pelo menos um arquivo'
              }
              break
            case 'yes_no':
              if (answer.question_type === 'yes_no' && !answer.value) {
                newErrors[question.id] = 'Selecione uma opção'
              }
              break
          }
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateAnswers()) {
      onSubmit(answers)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const isFirstQuestion = currentQuestionIndex === 0

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Nenhuma pergunta encontrada neste questionário.</p>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = answers.find(a => a.question_id === currentQuestion.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      </Card>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Pergunta {currentQuestionIndex + 1} de {questions.length}</span>
          <span>{Math.round(progress)}% concluído</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Question */}
      <Card>
        <CardContent className="p-6">
          <QuestionRenderer
            question={currentQuestion}
            value={currentAnswer}
            onChange={handleAnswerChange}
            error={errors[currentQuestion.id]}
            disabled={disabled}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstQuestion || disabled}
        >
          Anterior
        </Button>

        <div className="flex gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={disabled}
            >
              Cancelar
            </Button>
          )}
          
          {isLastQuestion ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={disabled}
            >
              Finalizar
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              disabled={disabled}
            >
              Próxima
            </Button>
          )}
        </div>
      </div>

      {/* Question counter */}
      <div className="text-center text-xs text-muted-foreground">
        {questions.filter(q => q.required).length} pergunta(s) obrigatória(s) • {answers.length} respondida(s)
      </div>
    </div>
  )
} 