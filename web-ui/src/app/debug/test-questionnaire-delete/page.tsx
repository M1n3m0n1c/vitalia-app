'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

interface TestQuestionnaire {
  id: string
  title: string
  created_at: string
}

export default function TestQuestionnaireDeletePage() {
  const [questionnaires, setQuestionnaires] = useState<TestQuestionnaire[]>([])
  const [loading, setLoading] = useState(true)

  const fetchQuestionnaires = async () => {
    try {
      setLoading(true)
      console.log('🔍 Buscando questionários para teste...')
      
      const response = await fetch('/api/questionnaires?limit=3')
      const data = await response.json()
      
      console.log('📊 Resposta da busca:', { status: response.status, data })
      
      if (response.ok) {
        setQuestionnaires(data.data || [])
        console.log('✅ Questionários carregados para teste:', data.data?.length || 0)
      } else {
        console.error('❌ Erro ao carregar questionários:', data)
        toast.error(data.error || 'Erro ao carregar questionários')
      }
    } catch (error) {
      console.error('❌ Erro ao buscar questionários:', error)
      toast.error('Erro ao carregar questionários')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    console.log('🗑️ Teste handleDelete chamado:', { id, title })
    
    try {
      console.log('🔄 Fazendo requisição DELETE para:', `/api/questionnaires/${id}`)
      
      const response = await fetch(`/api/questionnaires/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('📥 Status da resposta:', response.status, response.statusText)
      
      const data = await response.json()
      console.log('📥 Dados da resposta:', data)

      if (response.ok) {
        console.log('✅ Delete bem-sucedido')
        toast.success(data.message || 'Questionário removido com sucesso')
        fetchQuestionnaires() // Recarregar lista
      } else {
        console.error('❌ Delete falhou:', data)
        toast.error(data.error || 'Erro ao remover questionário')
      }
    } catch (error) {
      console.error('❌ Erro ao deletar questionário:', error)
      toast.error('Erro ao remover questionário')
    }
  }

  useEffect(() => {
    fetchQuestionnaires()
  }, [])

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Teste de Delete de Questionários</h1>
        <p className="text-muted-foreground">
          Esta página testa especificamente a funcionalidade de deletar questionários.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800">Instruções:</h3>
        <ol className="text-sm text-yellow-700 mt-2 space-y-1">
          <li>1. Abra o console do navegador (F12)</li>
          <li>2. Teste ambos os botões (AlertDialog e Direto)</li>
          <li>3. Observe os logs no console</li>
          <li>4. Verifique se o delete funciona</li>
        </ol>
      </div>

      {loading ? (
        <div className="text-center">Carregando questionários...</div>
      ) : questionnaires.length === 0 ? (
        <div className="text-center text-muted-foreground">
          Nenhum questionário encontrado para teste.
        </div>
      ) : (
        <div className="grid gap-4">
          {questionnaires.map((questionnaire) => (
            <Card key={questionnaire.id}>
              <CardHeader>
                <CardTitle className="text-lg">{questionnaire.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  ID: {questionnaire.id} | Criado em: {new Date(questionnaire.created_at).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {/* Teste com AlertDialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete (AlertDialog)
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o questionário "{questionnaire.title}"?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            console.log('🎯 AlertDialog - Botão Excluir clicado:', questionnaire.id)
                            handleDelete(questionnaire.id, questionnaire.title)
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {/* Teste direto */}
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      console.log('🎯 Botão Direto - Clicado:', questionnaire.id)
                      if (window.confirm(`Tem certeza que deseja excluir "${questionnaire.title}"?`)) {
                        handleDelete(questionnaire.id, questionnaire.title)
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete (Direto)
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Logs esperados no console:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 🔍 Buscando questionários para teste...</li>
          <li>• 📊 Resposta da busca: {`{status: 200, data: {...}}`}</li>
          <li>• 🎯 Botão clicado: [ID do questionário]</li>
          <li>• 🗑️ Teste handleDelete chamado: {`{id: "...", title: "..."}`}</li>
          <li>• 🔄 Fazendo requisição DELETE para: /api/questionnaires/[ID]</li>
          <li>• 📥 Status da resposta: 200 OK</li>
          <li>• ✅ Delete bem-sucedido</li>
        </ul>
      </div>
    </div>
  )
} 