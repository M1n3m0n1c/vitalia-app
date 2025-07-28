'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

export default function TestDeleteButtonPage() {
  const [testId] = useState('test-id-123')

  const handleDelete = async (id: string) => {
    console.log('🗑️ handleDelete chamado com ID:', id)
    try {
      console.log('🔄 Simulando DELETE para:', id)
      
      // Simular uma requisição
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('✅ DELETE simulado com sucesso')
      toast.success('Teste de delete funcionou!')
    } catch (error) {
      console.error('❌ Erro no teste:', error)
      toast.error('Erro no teste')
    }
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Teste do Botão de Deletar</h1>
      
      <div className="space-y-4">
        <p>Esta página testa se o AlertDialog e o botão de deletar funcionam corretamente.</p>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              Testar Deletar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar teste</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja executar o teste de delete?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  console.log('🎯 Botão Excluir clicado para teste:', testId)
                  handleDelete(testId)
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm">
            Abra o console do navegador (F12) para ver os logs quando clicar no botão.
          </p>
        </div>
      </div>
    </div>
  )
} 