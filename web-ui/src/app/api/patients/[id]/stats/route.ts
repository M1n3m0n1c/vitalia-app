import { NextRequest, NextResponse } from 'next/server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET /api/patients/[id]/stats - Buscar estatísticas do paciente
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verificar autenticação
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    // Verificar se o paciente pertence ao médico
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('id', id)
      .eq('doctor_id', user.id)
      .single()

    if (patientError || !patient) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      )
    }

    // Buscar estatísticas em paralelo
    const [documentsResult, responsesResult, appointmentsResult] =
      await Promise.all([
        // Total de documentos
        supabase
          .from('patient_documents')
          .select('id', { count: 'exact' })
          .eq('patient_id', id),

        // Total de respostas de questionários
        supabase
          .from('responses')
          .select('id', { count: 'exact' })
          .eq('patient_id', id),

        // Total de consultas/compromissos
        supabase
          .from('appointments')
          .select('id', { count: 'exact' })
          .eq('patient_id', id),
      ])

    // Buscar última atividade (mais recente entre documentos, respostas e consultas)
    const lastActivities = await Promise.all([
      // Último documento
      supabase
        .from('patient_documents')
        .select('created_at')
        .eq('patient_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),

      // Última resposta
      supabase
        .from('responses')
        .select('created_at')
        .eq('patient_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),

      // Última consulta
      supabase
        .from('appointments')
        .select('created_at')
        .eq('patient_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),
    ])

    // Encontrar a data mais recente
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

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas do paciente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
