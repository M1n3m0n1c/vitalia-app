"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QuestionnaireBuilder } from '@/components/form/QuestionnaireBuilder'
import { Question } from '@/types/questionnaire'
import { useQuestionnaireBuilderStore } from '@/store/questionnaireBuilderStore'

export default function TestBuilderPage() {
  const { questions, setQuestions } = useQuestionnaireBuilderStore()
  
  const addTestFacialQuestion = () => {
    const facialQuestion: Question = {
      id: `question_${Date.now()}_facial`,
      question_text: 'Selecione as áreas faciais com queixas',
      question_type: 'facial_complaints',
      required: true,
      order: questions.length
    }
    
    setQuestions([...questions, facialQuestion])
  }
  
  const addTestBodyQuestion = () => {
    const bodyQuestion: Question = {
      id: `question_${Date.now()}_body`,
      question_text: 'Selecione as áreas corporais com queixas',
      question_type: 'body_complaints',
      required: true,
      order: questions.length
    }
    
    setQuestions([...questions, bodyQuestion])
  }
  
  const clearAll = () => {
    setQuestions([])
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Teste do Builder de Questionários</h1>
        <div className="flex gap-4 mb-4">
          <Button onClick={addTestFacialQuestion}>
            Adicionar Pergunta Facial
          </Button>
          <Button onClick={addTestBodyQuestion}>
            Adicionar Pergunta Corporal
          </Button>
          <Button onClick={clearAll} variant="destructive">
            Limpar Todas
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estado Atual do Store</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Perguntas no store: {questions.length}
          </p>
          <div className="space-y-2">
            {questions.map((question) => (
              <div key={question.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{question.question_text}</span>
                  <span className="text-sm text-muted-foreground">
                    {question.question_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <QuestionnaireBuilder
        questions={questions}
        onQuestionsChange={setQuestions}
        title="Questionário de Teste"
        description="Teste para verificar se as perguntas de queixa funcionam corretamente"
      />
    </div>
  )
} 