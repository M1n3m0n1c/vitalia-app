'use client'

import { useState, useEffect } from 'react'
import { useQuestionnaireBuilderStore } from '@/store/questionnaireBuilderStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Trash2 } from 'lucide-react'

export default function DebugPage() {
  const { questions, questionnaire, setQuestions, setQuestionnaire, addQuestions, clearQuestions, clearAll } = useQuestionnaireBuilderStore()
  const [isHydrated, setIsHydrated] = useState(false)
  const [localStorageData, setLocalStorageData] = useState<string>('')

  useEffect(() => {
    setIsHydrated(true)
    // Verificar dados no localStorage
    const storageData = localStorage.getItem('questionnaire-builder-storage')
    setLocalStorageData(storageData || 'Nenhum dado encontrado')
  }, [])

  const refreshLocalStorage = () => {
    const storageData = localStorage.getItem('questionnaire-builder-storage')
    setLocalStorageData(storageData || 'Nenhum dado encontrado')
  }

  const testAddQuestions = () => {
    const testQuestions = [
      {
        id: 'test-1',
        question_text: 'Pergunta de teste 1',
        question_type: 'text' as any,
        required: false,
        order: 0
      },
      {
        id: 'test-2', 
        question_text: 'Pergunta de teste 2 - Facial',
        question_type: 'facial_complaints' as any,
        required: false,
        order: 1,
        regions: [],
        allow_multiple: true
      }
    ]
    
    addQuestions(testQuestions)
  }

  if (!isHydrated) {
    return <div>Aguardando hidratação...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Debug - Store do Questionário</h1>
        <p className="text-muted-foreground">Verificar estado do Zustand Store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estado Atual */}
        <Card>
          <CardHeader>
            <CardTitle>Estado Atual do Store</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Badge variant="outline">
                {questions.length} pergunta(s) no store
              </Badge>
            </div>
            
            <div>
              <h4 className="font-semibold">Perguntas:</h4>
              {questions.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma pergunta no store</p>
              ) : (
                <ul className="space-y-1">
                  {questions.map((q, idx) => (
                    <li key={q.id} className="text-sm">
                      {idx + 1}. {q.question_text} ({q.question_type})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h4 className="font-semibold">Questionário:</h4>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                {JSON.stringify(questionnaire, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* LocalStorage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              LocalStorage
              <Button size="sm" variant="outline" onClick={refreshLocalStorage}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap">
              {localStorageData}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Ações de Teste */}
      <Card>
        <CardHeader>
          <CardTitle>Ações de Teste</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testAddQuestions}>
              Adicionar Perguntas de Teste
            </Button>
            <Button variant="outline" onClick={clearQuestions}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Perguntas
            </Button>
            <Button variant="destructive" onClick={clearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Tudo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
