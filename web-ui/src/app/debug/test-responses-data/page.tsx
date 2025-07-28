'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function TestResponsesDataPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const checkData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/responses/debug')
      const data = await response.json()
      setResult(data)
      console.log('Debug data:', data)
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao verificar dados')
    } finally {
      setLoading(false)
    }
  }

  const createTestData = async () => {
    try {
      setLoading(true)
      
      // 1. Criar um paciente de teste
      const patientResponse = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: 'Paciente Teste',
          email: 'teste@exemplo.com',
          phone: '(11) 99999-9999',
          cpf: '123.456.789-00'
        })
      })
      
      if (!patientResponse.ok) {
        throw new Error('Erro ao criar paciente')
      }
      
      const patient = await patientResponse.json()
      console.log('Paciente criado:', patient)

      // 2. Criar um questionário de teste
      const questionnaireResponse = await fetch('/api/questionnaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Questionário de Teste',
          description: 'Questionário para testar respostas',
          category: 'anamnese-geral',
          questions: [
            {
              id: 'q1',
              question_text: 'Qual é o seu nome?',
              question_type: 'text',
              required: true
            },
            {
              id: 'q2', 
              question_text: 'Como você se sente hoje?',
              question_type: 'radio',
              options: [
                { id: 'opt1', label: 'Muito bem', value: 'muito_bem' },
                { id: 'opt2', label: 'Bem', value: 'bem' },
                { id: 'opt3', label: 'Regular', value: 'regular' }
              ],
              required: true
            }
          ],
          is_active: true
        })
      })

      if (!questionnaireResponse.ok) {
        throw new Error('Erro ao criar questionário')
      }

      const questionnaire = await questionnaireResponse.json()
      console.log('Questionário criado:', questionnaire)

      // 3. Criar uma resposta de teste
      const responseData = {
        questionnaire_id: questionnaire.data.id,
        patient_id: patient.data.id,
        answers: [
          {
            question_id: 'q1',
            value: 'João da Silva'
          },
          {
            question_id: 'q2', 
            value: 'bem'
          }
        ]
      }

      const testResponseResult = await fetch('/api/responses/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData)
      })

      if (!testResponseResult.ok) {
        const errorData = await testResponseResult.json()
        throw new Error(errorData.error || 'Erro ao criar resposta de teste')
      }

      const testResponse = await testResponseResult.json()
      console.log('Resposta de teste criada:', testResponse)

      toast.success('Dados de teste criados com sucesso!')
      
      // Verificar novamente os dados
      await checkData()
      
    } catch (error) {
      console.error('Erro ao criar dados de teste:', error)
      toast.error('Erro ao criar dados de teste')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Debug: Dados de Respostas</h1>
      
      <div className="flex space-x-4">
        <Button onClick={checkData} disabled={loading}>
          {loading ? 'Verificando...' : 'Verificar Dados'}
        </Button>
        
        <Button onClick={createTestData} disabled={loading} variant="outline">
          {loading ? 'Criando...' : 'Criar Dados de Teste'}
        </Button>
      </div>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado da Verificação</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 