'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { PatientForm } from '@/components/patients/PatientForm'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { CreatePatientInput } from '@/lib/validations/patient'

export default function NewPatientPage() {
  const router = useRouter()

  const handleSubmit = async (data: CreatePatientInput) => {
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar paciente')
      }

      const result = await response.json()

      // Redirecionar para a lista de pacientes
      router.push('/dashboard/patients')

      // Você pode adicionar uma notificação de sucesso aqui
      // toast.success('Paciente cadastrado com sucesso!')
    } catch (error) {
      // Re-throw para que o PatientForm possa lidar com o erro
      throw error
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/patients')
  }

  return (
    <div className='container mx-auto max-w-4xl py-6'>
      {/* Cabeçalho */}
      <div className='mb-6 flex items-center gap-4'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => router.back()}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' />
          Voltar
        </Button>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Novo Paciente</h1>
          <p className='text-gray-600'>Cadastre um novo paciente no sistema</p>
        </div>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Paciente</CardTitle>
          <CardDescription>
            Preencha as informações básicas do paciente. Os campos marcados com
            * são obrigatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientForm
            mode='create'
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  )
}
