'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AlertTriangle, Trash2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface DeletePatientDialogProps {
  patientId: string
  patientName: string
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function DeletePatientDialog({
  patientId,
  patientName,
  variant = 'destructive',
  size = 'default',
}: DeletePatientDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao excluir paciente')
      }

      const result = await response.json()

      toast.success('Paciente excluído com sucesso', {
        description:
          'O paciente foi movido para a lixeira e pode ser restaurado.',
      })

      // Redirecionar para a lista de pacientes
      router.push('/dashboard/patients')
      router.refresh()
    } catch (error) {
      console.error('Erro ao excluir paciente:', error)
      toast.error('Erro ao excluir paciente', {
        description:
          error instanceof Error ? error.message : 'Tente novamente.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size} disabled={isDeleting}>
          <Trash2 className='mr-2 h-4 w-4' />
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5 text-amber-500' />
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          </div>
          <AlertDialogDescription className='space-y-2'>
            <p>
              Tem certeza que deseja excluir o paciente{' '}
              <strong>{patientName}</strong>?
            </p>
            <div className='rounded-lg bg-blue-50 p-3 text-sm text-blue-800'>
              <p className='font-medium'>ℹ️ Exclusão Suave</p>
              <p>
                O paciente será movido para a lixeira e não aparecerá mais nas
                listagens. Todos os dados médicos serão preservados e o paciente
                poderá ser restaurado posteriormente.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className='bg-red-600 hover:bg-red-700'
          >
            {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
