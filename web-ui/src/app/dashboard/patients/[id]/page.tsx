import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Activity,
  Calendar,
  Edit,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DeletePatientDialog } from '@/components/patients/DeletePatientDialog'
import { DocumentList } from '@/components/patients/DocumentList'
import { PatientHistory } from '@/components/patients/PatientHistory'
import { PatientProfile } from '@/components/patients/PatientProfile'

interface PatientDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function PatientDetailsPage({
  params,
}: PatientDetailsPageProps) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const resolvedParams = await params
  
  // Buscar dados do paciente
  const { data: patient, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('doctor_id', user.id)
    .single()

  if (error || !patient) {
    notFound()
  }

  // Buscar estatísticas do paciente diretamente no servidor
  const [documentsResult, responsesResult, appointmentsResult] =
    await Promise.all([
      supabase
        .from('patient_documents')
        .select('id', { count: 'exact' })
        .eq('patient_id', resolvedParams.id),
      supabase
        .from('responses')
        .select('id', { count: 'exact' })
        .eq('patient_id', resolvedParams.id),
      supabase
        .from('appointments')
        .select('id', { count: 'exact' })
        .eq('patient_id', resolvedParams.id),
    ])

  // Buscar última atividade
  const lastActivities = await Promise.all([
    supabase
      .from('patient_documents')
      .select('created_at')
      .eq('patient_id', resolvedParams.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('responses')
      .select('created_at')
      .eq('patient_id', resolvedParams.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('appointments')
      .select('created_at')
      .eq('patient_id', resolvedParams.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
  ])

  const validDates = lastActivities
    .filter(result => result.data?.created_at)
    .map(result => new Date(result.data!.created_at))

  const lastActivity =
    validDates.length > 0
      ? new Date(Math.max(...validDates.map(date => date.getTime())))
      : null

  const stats = {
    totalDocuments: documentsResult.count || 0,
    totalResponses: responsesResult.count || 0,
    totalAppointments: appointmentsResult.count || 0,
    lastActivity: lastActivity ? lastActivity.toISOString() : null,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--
    }

    return age
  }

  const getGenderLabel = (gender: string) => {
    const labels = {
      male: 'Masculino',
      female: 'Feminino',
      other: 'Outro',
    }
    return labels[gender as keyof typeof labels] || gender
  }

  return (
    <div className='container mx-auto space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            {patient.full_name}
          </h1>
          <p className='mt-1 text-gray-600'>Perfil Detalhado do Paciente</p>
        </div>

        <div className='flex gap-3'>
          <Link href={`/dashboard/patients/${patient.id}/edit`}>
            <Button>
              <Edit className='mr-2 h-4 w-4' />
              Editar
            </Button>
          </Link>
          <DeletePatientDialog
            patientId={patient.id}
            patientName={patient.full_name}
            variant='outline'
          />
        </div>
      </div>

      {/* Perfil detalhado */}
      <PatientProfile patient={patient} stats={stats} />

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Coluna principal */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Informações básicas */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='h-5 w-5' />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Nome Completo
                  </label>
                  <p className='text-gray-900'>{patient.full_name}</p>
                </div>

                {patient.email && (
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Email
                    </label>
                    <p className='flex items-center gap-2 text-gray-900'>
                      <Mail className='h-4 w-4' />
                      {patient.email}
                    </p>
                  </div>
                )}

                {patient.phone && (
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Telefone
                    </label>
                    <p className='flex items-center gap-2 text-gray-900'>
                      <Phone className='h-4 w-4' />
                      {patient.phone}
                    </p>
                  </div>
                )}

                {patient.cpf && (
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      CPF
                    </label>
                    <p className='text-gray-900'>{patient.cpf}</p>
                  </div>
                )}

                {patient.birth_date && (
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Data de Nascimento
                    </label>
                    <p className='flex items-center gap-2 text-gray-900'>
                      <Calendar className='h-4 w-4' />
                      {formatDate(patient.birth_date)} (
                      {calculateAge(patient.birth_date)} anos)
                    </p>
                  </div>
                )}

                {patient.gender && (
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Gênero
                    </label>
                    <Badge variant='secondary'>
                      {getGenderLabel(patient.gender)}
                    </Badge>
                  </div>
                )}
              </div>

              {patient.address && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Endereço
                  </label>
                  <p className='flex items-start gap-2 text-gray-900'>
                    <MapPin className='mt-1 h-4 w-4' />
                    <span>
                      {patient.address.street && `${patient.address.street}, `}
                      {patient.address.number && `${patient.address.number}`}
                      {patient.address.complement &&
                        `, ${patient.address.complement}`}
                      {patient.address.neighborhood &&
                        `<br/>${patient.address.neighborhood}`}
                      {patient.address.city &&
                        patient.address.state &&
                        `<br/>${patient.address.city} - ${patient.address.state}`}
                      {patient.address.zip_code &&
                        ` - ${patient.address.zip_code}`}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Histórico médico */}
          {patient.medical_history && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Activity className='h-5 w-5' />
                  Histórico Médico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='whitespace-pre-wrap text-gray-900'>
                  {patient.medical_history}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Documentos */}
          <DocumentList
            patientId={patient.id}
            patientName={patient.full_name}
          />

          {/* Histórico completo */}
          <div data-history-section>
            <PatientHistory
              patientId={patient.id}
              patientName={patient.full_name}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Resumo */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Cadastrado em
                </label>
                <p className='text-gray-900'>
                  {formatDate(patient.created_at)}
                </p>
              </div>

              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Última atualização
                </label>
                <p className='text-gray-900'>
                  {formatDate(patient.updated_at)}
                </p>
              </div>

              <div>
                <label className='text-sm font-medium text-gray-500'>
                  ID do Paciente
                </label>
                <p className='font-mono text-xs text-gray-500'>{patient.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Ações rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <Button variant='outline' className='w-full justify-start'>
                <Calendar className='mr-2 h-4 w-4' />
                Agendar Consulta
              </Button>

              <Button variant='outline' className='w-full justify-start'>
                <FileText className='mr-2 h-4 w-4' />
                Criar Questionário
              </Button>

              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => {
                  const historyElement = document.querySelector(
                    '[data-history-section]'
                  )
                  historyElement?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <Activity className='mr-2 h-4 w-4' />
                Ver Histórico
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
