import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // 1. Verificar se há respostas no sistema
    const { data: allResponses, error: responseError } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .limit(10)

    // 2. Verificar se há questionários do usuário
    const { data: userQuestionnaires, error: questError } = await supabase
      .from('questionnaires')
      .select('*')
      .eq('doctor_id', user.id)
      .limit(10)

    // 3. Verificar se há pacientes do usuário  
    const { data: userPatients, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('doctor_id', user.id)
      .limit(10)

    // 4. Verificar respostas para questionários do usuário
    const { data: userResponses, error: userRespError } = await supabase
      .from('questionnaire_responses')
      .select(`
        *,
        questionnaires!inner(*)
      `)
      .eq('questionnaires.doctor_id', user.id)
      .limit(10)

    return NextResponse.json({
      user_id: user.id,
      debug_info: {
        total_responses_in_system: allResponses?.length || 0,
        user_questionnaires: userQuestionnaires?.length || 0,
        user_patients: userPatients?.length || 0,
        user_responses: userResponses?.length || 0,
      },
      data: {
        all_responses: allResponses,
        user_questionnaires: userQuestionnaires,
        user_patients: userPatients,
        user_responses: userResponses,
      },
      errors: {
        responseError,
        questError,
        patientError,
        userRespError,
      }
    })
  } catch (error) {
    console.error('Erro no debug:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
} 