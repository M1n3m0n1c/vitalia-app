import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CheckboxQuestion as CheckboxQuestionType, CheckboxAnswer } from '@/types/questionnaire'

interface CheckboxQuestionProps {
  question: CheckboxQuestionType
  value?: CheckboxAnswer
  onChange: (answer: CheckboxAnswer) => void
  error?: string
  disabled?: boolean
}

export function CheckboxQuestion({
  question,
  value,
  onChange,
  error,
  disabled = false
}: CheckboxQuestionProps) {
  const currentSelections = value?.selected_options || []

  const handleChange = (optionValue: string, checked: boolean) => {
    let newSelections: string[]
    
    if (checked) {
      // Adicionar seleção
      newSelections = [...currentSelections, optionValue]
    } else {
      // Remover seleção
      newSelections = currentSelections.filter(val => val !== optionValue)
    }

    // Verificar limites
    if (question.max_selections && newSelections.length > question.max_selections) {
      return // Não permitir mais seleções que o máximo
    }

    onChange({
      question_id: question.id,
      question_type: 'checkbox',
      selected_options: newSelections
    })
  }

  const isMaxReached = question.max_selections && 
    currentSelections.length >= question.max_selections

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {question.options.map((option) => {
          const isChecked = currentSelections.includes(option.value)
          const isDisabledOption = Boolean(disabled || (isMaxReached && !isChecked))

          return (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${question.id}-${option.id}`}
                checked={isChecked}
                onCheckedChange={(checked) => 
                  handleChange(option.value, Boolean(checked))
                }
                disabled={isDisabledOption}
                className={error ? 'border-destructive' : undefined}
              />
              <Label
                htmlFor={`${question.id}-${option.id}`}
                className={`text-sm font-normal cursor-pointer ${
                  isDisabledOption ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                {option.label}
              </Label>
            </div>
          )
        })}
      </div>

      {/* Selection info */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {currentSelections.length} selecionado{currentSelections.length !== 1 ? 's' : ''}
        </span>
        {question.max_selections && (
          <span>
            Máximo: {question.max_selections}
          </span>
        )}
      </div>

      {/* Max validation message */}
      {isMaxReached && (
        <p className="text-xs text-amber-600">
          Máximo de {question.max_selections} opções atingido
        </p>
      )}
    </div>
  )
} 