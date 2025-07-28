'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  Calendar,
  Edit,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
  Copy,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DeletePatientDialog } from '@/components/patients/DeletePatientDialog'
import { DocumentList } from '@/components/patients/DocumentList'
import { PatientHistory } from '@/components/patients/PatientHistory'
import { PatientProfile } from '@/components/patients/PatientProfile'
import { QuestionnaireSelectModal } from '@/components/form/QuestionnaireSelectModal'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { formatDateBrasilia } from '@/lib/utils/date'

interface PatientDetailsClientProps {
  patient: any
  stats: {
    documents: number
    responses: number
    appointments: number
    lastActivity: string
  }
  patientId: string
}

export function PatientDetailsClient({ patient, stats, patientId }: PatientDetailsClientProps) {
  const [selectingQuestionnaire, setSelectingQuestionnaire] = useState(false)
  const [successLink, setSuccessLink] = useState<string | null>(null)

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

  const handleGeneratePublicLink = async (questionnaireId: string) => {
    try {
      const response = await fetch(`/api/questionnaires/${questionnaireId}/public-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patient.id })
      })
      const data = await response.json()
      if (response.ok && data.data) {
        setSuccessLink(window.location.origin + '/public/' + data.data)
      } else {
        alert(data.error || 'Erro ao gerar link público')
      }
    } catch (error) {
      alert('Erro ao gerar link público')
    }
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
                      {formatDateBrasilia(patient.birth_date)} (
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
                  {formatDateBrasilia(patient.created_at)}
                </p>
              </div>

              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Última atualização
                </label>
                <p className='text-gray-900'>
                  {formatDateBrasilia(patient.updated_at)}
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

              <Button variant="secondary" onClick={() => setSelectingQuestionnaire(true)}>
                <Copy className="h-4 w-4 mr-2" />
                Gerar link de questionário
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de seleção de questionário */}
      <QuestionnaireSelectModal
        open={selectingQuestionnaire}
        onClose={() => setSelectingQuestionnaire(false)}
        onSelect={questionnaire => {
          handleGeneratePublicLink(questionnaire.id)
          setSelectingQuestionnaire(false)
        }}
      />

      {/* Modal de sucesso com link gerado */}
      <Dialog open={!!successLink} onOpenChange={() => setSuccessLink(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Link público gerado!</DialogTitle>
          </DialogHeader>
          <Input value={successLink || ''} readOnly className="mb-4 text-xs" />
          <Button onClick={() => { navigator.clipboard.writeText(successLink || ''); alert('Link copiado!') }}>
            <Copy className="h-4 w-4 mr-2" /> Copiar link
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
} 