import React from 'react'
import { Question, Answer } from '@/types/questionnaire'
import { TextQuestion } from './questions/TextQuestion'
import { RadioQuestion } from './questions/RadioQuestion'
import { CheckboxQuestion } from './questions/CheckboxQuestion'
import { ScaleQuestion } from './questions/ScaleQuestion'
import { SliderQuestion } from './questions/SliderQuestion'
import { DateQuestion } from './questions/DateQuestion'
import { FileQuestion } from './questions/FileQuestion'
import { YesNoQuestion } from './questions/YesNoQuestion'
import { FacialComplaintsQuestion } from './questions/FacialComplaintsQuestion'
import { BodyComplaintsQuestion } from './questions/BodyComplaintsQuestion'

interface QuestionRendererProps {
  question: Question
  value?: Answer
  onChange: (answer: Answer) => void
  error?: string
  disabled?: boolean
  showRequired?: boolean
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  error,
  disabled = false,
  showRequired = true
}: QuestionRendererProps) {
  const commonProps = {
    question,
    value,
    onChange,
    error,
    disabled
  }

  const renderQuestion = () => {
    switch (question.question_type) {
      case 'text':
        return <TextQuestion {...commonProps} question={question as any} value={value as any} />
      
      case 'radio':
        return <RadioQuestion {...commonProps} question={question as any} value={value as any} />
      
      case 'checkbox':
        return <CheckboxQuestion {...commonProps} question={question as any} value={value as any} />
      
      case 'scale':
        return <ScaleQuestion {...commonProps} question={question as any} value={value as any} />
      
      case 'slider':
        return <SliderQuestion {...commonProps} question={question as any} value={value as any} />
      
      case 'date':
        return <DateQuestion {...commonProps} question={question as any} value={value as any} />
      
      case 'file':
        return <FileQuestion {...commonProps} question={question as any} value={value as any} />
      
      case 'yes_no':
        return <YesNoQuestion {...commonProps} question={question as any} value={value as any} />
      
      case 'facial_complaints':
        return <FacialComplaintsQuestion 
          question={question as any} 
          value={(value as any)?.value || []} 
          onChange={(newValue) => onChange({ question_type: 'facial_complaints', value: newValue })}
          error={error}
        />
      
      case 'body_complaints':
        return <BodyComplaintsQuestion 
          question={question as any} 
          value={(value as any)?.value || []} 
          onChange={(newValue) => onChange({ question_type: 'body_complaints', value: newValue })}
          error={error}
        />
      
      default:
        return (
          <div className="p-4 border border-dashed border-muted-foreground/50 rounded-lg text-center">
            <p className="text-muted-foreground">
              Tipo de pergunta não suportado: {(question as any).question_type}
            </p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-3">
      {/* Question Header */}
      <div className="space-y-1">
        <div className="flex items-start gap-2">
          <h3 className="text-base font-medium leading-relaxed flex-1">
            {question.question_text}
          </h3>
          {showRequired && question.required && (
            <span className="text-destructive text-sm font-medium">*</span>
          )}
        </div>
        {question.required && showRequired && (
          <p className="text-xs text-muted-foreground">Campo obrigatório</p>
        )}
      </div>

      {/* Question Component */}
      <div className="space-y-2">
        {renderQuestion()}
        
        {/* Error Message */}
        {error && (
          <p className="text-sm text-destructive font-medium">{error}</p>
        )}
      </div>
    </div>
  )
} 