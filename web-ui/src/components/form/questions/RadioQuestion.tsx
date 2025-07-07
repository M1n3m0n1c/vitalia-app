import React from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { RadioQuestion as RadioQuestionType, RadioAnswer } from '@/types/questionnaire'

interface RadioQuestionProps {
  question: RadioQuestionType
  value?: RadioAnswer
  onChange: (answer: RadioAnswer) => void
  error?: string
  disabled?: boolean
}

export function RadioQuestion({
  question,
  value,
  onChange,
  error,
  disabled = false
}: RadioQuestionProps) {
  const handleChange = (selectedValue: string) => {
    onChange({
      question_id: question.id,
      question_type: 'radio',
      selected_option: selectedValue
    })
  }

  const currentValue = value?.selected_option || ''

  return (
    <div className="space-y-3">
      <RadioGroup
        value={currentValue}
        onValueChange={handleChange}
        disabled={disabled}
        className="space-y-2"
      >
        {question.options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option.value} 
              id={`${question.id}-${option.id}`}
              className={error ? 'border-destructive' : undefined}
            />
            <Label 
              htmlFor={`${question.id}-${option.id}`}
              className={`text-sm font-normal cursor-pointer ${
                disabled ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {/* Show selection count for debugging/admin */}
      {currentValue && (
        <div className="text-xs text-muted-foreground">
          Selecionado: {question.options.find(opt => opt.value === currentValue)?.label}
        </div>
      )}
    </div>
  )
} 