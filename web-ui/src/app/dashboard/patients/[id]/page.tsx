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
  Copy,
} from 'lucide-react'

import { createServerSupabaseClient } from '@/lib/supabase/server'
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
import { PatientDetailsClient } from './PatientDetailsClient'

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
        .from('questionnaire_responses')
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
      .from('questionnaire_responses')
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

  const lastActivity = validDates.length > 0 
    ? validDates.reduce((latest, current) => current > latest ? current : latest)
    : null

  const stats = {
    totalDocuments: documentsResult.count || 0,
    totalResponses: responsesResult.count || 0,
    totalAppointments: appointmentsResult.count || 0,
    lastActivity: lastActivity ? formatDateBrasilia(lastActivity) : null
  }

  return (
    <PatientDetailsClient 
      patient={patient} 
      stats={stats} 
      patientId={resolvedParams.id}
    />
  )
}
