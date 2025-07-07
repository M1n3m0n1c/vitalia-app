import React from 'react'
import { Button } from '@/components/ui/button'
import { Check, X, HelpCircle } from 'lucide-react'
import { YesNoQuestion as YesNoQuestionType, YesNoAnswer } from '@/types/questionnaire'

interface YesNoQuestionProps {
  question: YesNoQuestionType
  value?: YesNoAnswer
  onChange: (answer: YesNoAnswer) => void
  error?: string
  disabled?: boolean
}

export function YesNoQuestion({
  question,
  value,
  onChange,
  error,
  disabled = false
}: YesNoQuestionProps) {
  const handleChange = (selectedValue: 'yes' | 'no' | 'unknown') => {
    onChange({
      question_id: question.id,
      question_type: 'yes_no',
      value: selectedValue
    })
  }

  const currentValue = value?.value

  const options = [
    {
      value: 'yes' as const,
      label: question.labels?.yes || 'Sim',
      icon: Check,
      className: 'text-green-600 hover:text-green-700',
      variant: currentValue === 'yes' ? 'default' : 'outline' as const
    },
    {
      value: 'no' as const,
      label: question.labels?.no || 'Não',
      icon: X,
      className: 'text-red-600 hover:text-red-700',
      variant: currentValue === 'no' ? 'default' : 'outline' as const
    },
    {
      value: 'unknown' as const,
      label: question.labels?.unknown || 'Não sei',
      icon: HelpCircle,
      className: 'text-amber-600 hover:text-amber-700',
      variant: currentValue === 'unknown' ? 'default' : 'outline' as const
    }
  ]

  return (
    <div className="space-y-4">
      {/* Option buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((option) => {
          const Icon = option.icon
          const isSelected = currentValue === option.value
          
          return (
            <Button
              key={option.value}
              type="button"
              variant={isSelected ? 'default' : 'outline'}
              size="lg"
              onClick={() => handleChange(option.value)}
              disabled={disabled}
              className={`
                h-auto p-4 flex flex-col items-center gap-2 transition-all
                ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                ${error && isSelected ? 'border-destructive' : ''}
                ${!isSelected ? option.className : ''}
              `}
            >
              <Icon className={`h-6 w-6 ${isSelected ? 'text-primary-foreground' : ''}`} />
              <span className={`text-sm font-medium ${isSelected ? 'text-primary-foreground' : ''}`}>
                {option.label}
              </span>
            </Button>
          )
        })}
      </div>

      {/* Selected value display */}
      {currentValue && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm">
            <span className="text-muted-foreground">Resposta:</span>
            <span className="font-medium">
              {options.find(opt => opt.value === currentValue)?.label}
            </span>
          </div>
        </div>
      )}

      {/* Help text */}
      <p className="text-xs text-muted-foreground text-center">
        Selecione uma das opções acima para responder à pergunta
      </p>
    </div>
  )
} 