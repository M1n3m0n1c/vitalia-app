import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { TextQuestion as TextQuestionType, TextAnswer } from '@/types/questionnaire'

interface TextQuestionProps {
  question: TextQuestionType
  value?: TextAnswer
  onChange: (answer: TextAnswer) => void
  error?: string
  disabled?: boolean
}

export function TextQuestion({
  question,
  value,
  onChange,
  error,
  disabled = false
}: TextQuestionProps) {
  const handleChange = (newValue: string) => {
    onChange({
      question_id: question.id,
      question_type: 'text',
      value: newValue
    })
  }

  // Determinar se deve usar textarea ou input baseado no comprimento esperado
  const isLongText = question.max_length && question.max_length > 100
  const currentValue = value?.value || ''

  const commonProps = {
    value: currentValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
      handleChange(e.target.value),
    placeholder: question.placeholder || 'Digite sua resposta...',
    disabled,
    maxLength: question.max_length,
    className: error ? 'border-destructive' : undefined
  }

  return (
    <div className="space-y-2">
      {isLongText ? (
        <Textarea 
          {...commonProps}
          rows={4}
          className={`resize-none ${error ? 'border-destructive' : ''}`}
        />
      ) : (
        <Input 
          {...commonProps}
          type="text"
        />
      )}
      
      {/* Character count */}
      {question.max_length && (
        <div className="flex justify-end">
          <span className={`text-xs ${
            currentValue.length > question.max_length 
              ? 'text-destructive' 
              : 'text-muted-foreground'
          }`}>
            {currentValue.length}/{question.max_length} caracteres
          </span>
        </div>
      )}
    </div>
  )
} 