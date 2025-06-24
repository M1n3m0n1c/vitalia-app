'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

import { PatientForm } from '@/components/patients/PatientForm'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { CreatePatientInput } from '@/lib/validations/patient'

interface Patient {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  cpf: string | null
  birth_date: string | null
  gender: 'male' | 'female' | 'other' | null
  address: any
  medical_history: string | null
  created_at: string
  updated_at: string
}

export default function EditPatientPage() {
  const router = useRouter()
  const params = useParams()
  const patientId = params?.id as string

  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar dados do paciente
  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return

      try {
        const response = await fetch(`/api/patients/${patientId}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Erro ao carregar paciente')
        }

        const data = await response.json()
        setPatient(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchPatient()
  }, [patientId])

  const handleSubmit = async (data: CreatePatientInput) => {
    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar paciente')
      }

      // Redirecionar para a lista de pacientes
      router.push('/patients')

      // Você pode adicionar uma notificação de sucesso aqui
      // toast.success('Paciente atualizado com sucesso!')
    } catch (error) {
      // Re-throw para que o PatientForm possa lidar com o erro
      throw error
    }
  }

  const handleCancel = () => {
    router.push('/patients')
  }

  if (loading) {
    return (
      <div className='container mx-auto max-w-4xl py-6'>
        {/* Cabeçalho Skeleton */}
        <div className='mb-6 flex items-center gap-4'>
          <Skeleton className='h-9 w-20' />
          <div>
            <Skeleton className='mb-2 h-8 w-48' />
            <Skeleton className='h-4 w-64' />
          </div>
        </div>

        {/* Formulário Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className='mb-2 h-6 w-48' />
            <Skeleton className='h-4 w-96' />
          </CardHeader>
          <CardContent className='space-y-6'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-10 w-full' />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div className='container mx-auto max-w-4xl py-6'>
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
            <h1 className='text-2xl font-bold text-gray-900'>
              Editar Paciente
            </h1>
          </div>
        </div>

        <Alert variant='destructive'>
          <AlertDescription>
            {error || 'Paciente não encontrado'}
          </AlertDescription>
        </Alert>
      </div>
    )
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
          <h1 className='text-2xl font-bold text-gray-900'>Editar Paciente</h1>
          <p className='text-gray-600'>
            Atualize as informações de {patient.full_name}
          </p>
        </div>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Paciente</CardTitle>
          <CardDescription>
            Edite as informações do paciente. Os campos marcados com * são
            obrigatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientForm
            mode='edit'
            initialData={{
              full_name: patient.full_name,
              email: patient.email || '',
              phone: patient.phone || '',
              cpf: patient.cpf || '',
              birth_date: patient.birth_date || '',
              gender: patient.gender || undefined,
              address: patient.address || undefined,
              medical_history: patient.medical_history || '',
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  )
}
