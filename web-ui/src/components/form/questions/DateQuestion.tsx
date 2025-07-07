import React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DateQuestion as DateQuestionType, DateAnswer } from '@/types/questionnaire'
import { cn } from '@/lib/utils'

interface DateQuestionProps {
  question: DateQuestionType
  value?: DateAnswer
  onChange: (answer: DateAnswer) => void
  error?: string
  disabled?: boolean
}

export function DateQuestion({
  question,
  value,
  onChange,
  error,
  disabled = false
}: DateQuestionProps) {
  const handleChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onChange({
        question_id: question.id,
        question_type: 'date',
        value: selectedDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
      })
    }
  }

  const currentDate = value?.value ? new Date(value.value) : undefined
  const minDate = question.min_date ? new Date(question.min_date) : undefined
  const maxDate = question.max_date ? new Date(question.max_date) : undefined

  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !currentDate && 'text-muted-foreground',
              error && 'border-destructive'
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {currentDate ? (
              format(currentDate, 'PPP', { locale: ptBR })
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={handleChange}
            disabled={(date) => {
              if (disabled) return true
              if (minDate && date < minDate) return true
              if (maxDate && date > maxDate) return true
              return false
            }}
            initialFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>

      {/* Date constraints info */}
      {(minDate || maxDate) && (
        <div className="text-xs text-muted-foreground">
          {minDate && maxDate && (
            <>Entre {format(minDate, 'dd/MM/yyyy')} e {format(maxDate, 'dd/MM/yyyy')}</>
          )}
          {minDate && !maxDate && (
            <>A partir de {format(minDate, 'dd/MM/yyyy')}</>
          )}
          {!minDate && maxDate && (
            <>Até {format(maxDate, 'dd/MM/yyyy')}</>
          )}
        </div>
      )}

      {/* Selected date display */}
      {currentDate && (
        <div className="text-sm text-muted-foreground">
          Data selecionada: <span className="font-medium">{format(currentDate, 'dd/MM/yyyy')}</span>
        </div>
      )}
    </div>
  )
} 