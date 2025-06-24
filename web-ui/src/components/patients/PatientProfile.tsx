'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Activity,
  AlertCircle,
  Calendar,
  FileText,
  Heart,
  Mail,
  MapPin,
  Phone,
  Shield,
  Stethoscope,
  TrendingUp,
  User,
  Users,
} from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PatientProfileProps {
  patient: any
  stats?: {
    totalDocuments: number
    totalResponses: number
    totalAppointments: number
    lastActivity: string | null
  }
}

export function PatientProfile({ patient, stats }: PatientProfileProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    })
  }

  const formatDateShort = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
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

  const getGenderColor = (gender: string) => {
    const colors = {
      male: 'bg-blue-100 text-blue-800',
      female: 'bg-pink-100 text-pink-800',
      other: 'bg-purple-100 text-purple-800',
    }
    return colors[gender as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const calculateProfileCompleteness = () => {
    const fields = [
      patient.full_name,
      patient.email,
      patient.phone,
      patient.cpf,
      patient.birth_date,
      patient.gender,
      patient.address,
      patient.medical_history,
    ]
    const completed = fields.filter(Boolean).length
    return Math.round((completed / fields.length) * 100)
  }

  const getTimeRegistered = () => {
    const created = new Date(patient.created_at)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '1 dia'
    if (diffDays < 30) return `${diffDays} dias`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`
    return `${Math.floor(diffDays / 365)} anos`
  }

  const profileCompleteness = calculateProfileCompleteness()

  return (
    <div className='space-y-6'>
      {/* Header com foto e informações principais */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6'>
            {/* Avatar */}
            <div className='flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white'>
              <User className='h-12 w-12' />
            </div>

            {/* Informações principais */}
            <div className='flex-1 space-y-2 text-center sm:text-left'>
              <div className='flex flex-col items-center gap-2 sm:flex-row'>
                <h1 className='text-2xl font-bold text-gray-900'>
                  {patient.full_name}
                </h1>
                {patient.gender && (
                  <Badge className={getGenderColor(patient.gender)}>
                    {getGenderLabel(patient.gender)}
                  </Badge>
                )}
              </div>

              <div className='flex flex-wrap justify-center gap-4 text-sm text-gray-600 sm:justify-start'>
                {patient.birth_date && (
                  <div className='flex items-center gap-1'>
                    <Calendar className='h-4 w-4' />
                    {calculateAge(patient.birth_date)} anos
                  </div>
                )}
                <div className='flex items-center gap-1'>
                  <Users className='h-4 w-4' />
                  Paciente há {getTimeRegistered()}
                </div>
                {stats?.lastActivity && (
                  <div className='flex items-center gap-1'>
                    <Activity className='h-4 w-4' />
                    Última atividade: {formatDateShort(stats.lastActivity)}
                  </div>
                )}
              </div>

              {/* Contatos */}
              <div className='flex flex-wrap justify-center gap-4 sm:justify-start'>
                {patient.email && (
                  <div className='flex items-center gap-2 text-sm text-gray-700'>
                    <Mail className='h-4 w-4' />
                    {patient.email}
                  </div>
                )}
                {patient.phone && (
                  <div className='flex items-center gap-2 text-sm text-gray-700'>
                    <Phone className='h-4 w-4' />
                    {patient.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Estatísticas rápidas */}
            {stats && (
              <div className='grid grid-cols-3 gap-4 text-center'>
                <div>
                  <div className='text-2xl font-bold text-blue-600'>
                    {stats.totalDocuments}
                  </div>
                  <div className='text-xs text-gray-500'>Documentos</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-green-600'>
                    {stats.totalResponses}
                  </div>
                  <div className='text-xs text-gray-500'>Questionários</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-purple-600'>
                    {stats.totalAppointments}
                  </div>
                  <div className='text-xs text-gray-500'>Consultas</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs com informações detalhadas */}
      <Tabs defaultValue='personal' className='w-full'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='personal'>Pessoal</TabsTrigger>
          <TabsTrigger value='medical'>Médico</TabsTrigger>
          <TabsTrigger value='contact'>Contato</TabsTrigger>
          <TabsTrigger value='system'>Sistema</TabsTrigger>
        </TabsList>

        {/* Informações Pessoais */}
        <TabsContent value='personal' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='h-5 w-5' />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div>
                  <div className='text-sm font-medium text-gray-500'>
                    Nome Completo
                  </div>
                  <p className='text-gray-900'>{patient.full_name}</p>
                </div>

                {patient.cpf && (
                  <div>
                    <div className='text-sm font-medium text-gray-500'>CPF</div>
                    <p className='font-mono text-gray-900'>{patient.cpf}</p>
                  </div>
                )}

                {patient.birth_date && (
                  <div>
                    <div className='text-sm font-medium text-gray-500'>
                      Data de Nascimento
                    </div>
                    <p className='text-gray-900'>
                      {formatDate(patient.birth_date)}
                    </p>
                  </div>
                )}

                {patient.gender && (
                  <div>
                    <div className='text-sm font-medium text-gray-500'>
                      Gênero
                    </div>
                    <p className='text-gray-900'>
                      {getGenderLabel(patient.gender)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5' />
                  Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <div className='mb-2 flex items-center justify-between'>
                    <span className='text-sm font-medium text-gray-500'>
                      Completude do Perfil
                    </span>
                    <span className='text-sm font-bold text-gray-900'>
                      {profileCompleteness}%
                    </span>
                  </div>
                  <Progress value={profileCompleteness} className='h-2' />
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-gray-500'>Status</span>
                    <Badge variant='outline' className='text-green-600'>
                      <Shield className='mr-1 h-3 w-3' />
                      Ativo
                    </Badge>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-gray-500'>Cadastrado em</span>
                    <span className='text-gray-900'>
                      {formatDateShort(patient.created_at)}
                    </span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-gray-500'>Última atualização</span>
                    <span className='text-gray-900'>
                      {formatDateShort(patient.updated_at)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Informações Médicas */}
        <TabsContent value='medical' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Stethoscope className='h-5 w-5' />
                Histórico Médico
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.medical_history ? (
                <div className='rounded-lg bg-gray-50 p-4'>
                  <p className='whitespace-pre-wrap text-gray-900'>
                    {patient.medical_history}
                  </p>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>
                    Nenhum histórico médico registrado ainda.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Alergias e observações (se existirem) */}
          {patient.allergies && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Heart className='h-5 w-5 text-red-500' />
                  Alergias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='rounded-lg bg-red-50 p-4'>
                  <p className='text-red-900'>{patient.allergies}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Informações de Contato */}
        <TabsContent value='contact' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {patient.email && (
                  <div className='flex items-center gap-3'>
                    <Mail className='h-5 w-5 text-gray-400' />
                    <div>
                      <p className='text-sm font-medium text-gray-500'>Email</p>
                      <p className='text-gray-900'>{patient.email}</p>
                    </div>
                  </div>
                )}

                {patient.phone && (
                  <div className='flex items-center gap-3'>
                    <Phone className='h-5 w-5 text-gray-400' />
                    <div>
                      <p className='text-sm font-medium text-gray-500'>
                        Telefone
                      </p>
                      <p className='text-gray-900'>{patient.phone}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {patient.address && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <MapPin className='h-5 w-5' />
                    Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-1 text-gray-900'>
                    {patient.address.street && (
                      <p>
                        {patient.address.street}
                        {patient.address.number &&
                          `, ${patient.address.number}`}
                        {patient.address.complement &&
                          `, ${patient.address.complement}`}
                      </p>
                    )}
                    {patient.address.neighborhood && (
                      <p>{patient.address.neighborhood}</p>
                    )}
                    {patient.address.city && patient.address.state && (
                      <p>
                        {patient.address.city} - {patient.address.state}
                      </p>
                    )}
                    {patient.address.zip_code && (
                      <p className='font-mono text-sm'>
                        {patient.address.zip_code}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Informações do Sistema */}
        <TabsContent value='system' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    ID do Paciente
                  </label>
                  <p className='font-mono text-xs break-all text-gray-900'>
                    {patient.id}
                  </p>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Médico Responsável
                  </label>
                  <p className='font-mono text-xs text-gray-900'>
                    {patient.doctor_id}
                  </p>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Data de Criação
                  </label>
                  <p className='text-gray-900'>
                    {formatDate(patient.created_at)}
                  </p>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Última Modificação
                  </label>
                  <p className='text-gray-900'>
                    {formatDate(patient.updated_at)}
                  </p>
                </div>
              </div>

              {profileCompleteness < 80 && (
                <Alert>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>
                    O perfil do paciente está {profileCompleteness}% completo.
                    Considere adicionar mais informações para um atendimento
                    mais eficaz.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
