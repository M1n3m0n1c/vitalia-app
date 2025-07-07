import React from 'react'
import { Button } from '@/components/ui/button'
import { ScaleQuestion as ScaleQuestionType, ScaleAnswer } from '@/types/questionnaire'

interface ScaleQuestionProps {
  question: ScaleQuestionType
  value?: ScaleAnswer
  onChange: (answer: ScaleAnswer) => void
  error?: string
  disabled?: boolean
}

export function ScaleQuestion({
  question,
  value,
  onChange,
  error,
  disabled = false
}: ScaleQuestionProps) {
  const handleChange = (selectedValue: number) => {
    onChange({
      question_id: question.id,
      question_type: 'scale',
      value: selectedValue
    })
  }

  const currentValue = value?.value
  const minValue = question.min_value || 1
  const maxValue = question.max_value || 10

  // Gerar array de valores da escala
  const scaleValues = Array.from(
    { length: maxValue - minValue + 1 }, 
    (_, i) => minValue + i
  )

  return (
    <div className="space-y-4">
      {/* Scale buttons */}
      <div className="flex flex-wrap gap-2">
        {scaleValues.map((scaleValue) => (
          <Button
            key={scaleValue}
            type="button"
            variant={currentValue === scaleValue ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleChange(scaleValue)}
            disabled={disabled}
            className={`min-w-[40px] h-9 ${
              error && currentValue === scaleValue ? 'border-destructive' : ''
            }`}
          >
            {scaleValue}
          </Button>
        ))}
      </div>

      {/* Scale labels */}
      {question.labels && (
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span>{question.labels.min || `${minValue} (mínimo)`}</span>
          <span>{question.labels.max || `${maxValue} (máximo)`}</span>
        </div>
      )}

      {/* Current selection */}
      {currentValue !== undefined && (
        <div className="text-center">
          <span className="text-sm font-medium">
            Valor selecionado: <span className="text-primary">{currentValue}</span>
          </span>
        </div>
      )}

      {/* Help text */}
      <p className="text-xs text-muted-foreground text-center">
        Clique em um número para selecionar sua resposta na escala de {minValue} a {maxValue}
      </p>
    </div>
  )
} 