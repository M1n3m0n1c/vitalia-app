import React from 'react'
import { Slider } from '@/components/ui/slider'
import { SliderQuestion as SliderQuestionType, SliderAnswer } from '@/types/questionnaire'

interface SliderQuestionProps {
  question: SliderQuestionType
  value?: SliderAnswer
  onChange: (answer: SliderAnswer) => void
  error?: string
  disabled?: boolean
}

export function SliderQuestion({
  question,
  value,
  onChange,
  error,
  disabled = false
}: SliderQuestionProps) {
  const handleChange = (values: number[]) => {
    onChange({
      question_id: question.id,
      question_type: 'slider',
      value: values[0]
    })
  }

  const currentValue = value?.value ?? question.min_value
  const minValue = question.min_value || 0
  const maxValue = question.max_value || 100
  const step = question.step || 1

  return (
    <div className="space-y-6">
      {/* Slider */}
      <div className="px-2">
        <Slider
          value={[currentValue]}
          onValueChange={handleChange}
          min={minValue}
          max={maxValue}
          step={step}
          disabled={disabled}
          className={`w-full ${error ? 'accent-destructive' : ''}`}
        />
      </div>

      {/* Value display */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center min-w-[60px] h-8 px-3 rounded-md bg-muted text-sm font-medium">
          {currentValue}
        </div>
      </div>

      {/* Scale labels */}
      {question.labels && (
        <div className="flex justify-between text-xs text-muted-foreground px-2">
          <span>{question.labels.min || minValue}</span>
          <span>{question.labels.max || maxValue}</span>
        </div>
      )}

      {/* Range info */}
      <div className="text-center text-xs text-muted-foreground">
        Arraste o controle para selecionar um valor entre {minValue} e {maxValue}
        {step !== 1 && ` (incrementos de ${step})`}
      </div>
    </div>
  )
} 