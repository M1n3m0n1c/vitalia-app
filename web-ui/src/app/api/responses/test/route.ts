import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { questionnaire_id, patient_id, answers } = body

    console.log('🧪 Criando resposta de teste:', { questionnaire_id, patient_id, answers })

    // Verificar se o questionário pertence ao usuário
    const { data: questionnaire, error: questError } = await supabase
      .from('questionnaires')
      .select('id, doctor_id')
      .eq('id', questionnaire_id)
      .eq('doctor_id', user.id)
      .single()

    if (questError || !questionnaire) {
      return NextResponse.json({ error: 'Questionário não encontrado' }, { status: 404 })
    }

    // Verificar se o paciente pertence ao usuário
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, doctor_id')
      .eq('id', patient_id)
      .eq('doctor_id', user.id)
      .single()

    if (patientError || !patient) {
      return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
    }

    // Inserir a resposta
    const { data: response, error: insertError } = await supabase
      .from('questionnaire_responses')
      .insert({
        questionnaire_id,
        patient_id,
        answers, // Supabase automaticamente converte para JSONB
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Erro ao inserir resposta:', insertError)
      return NextResponse.json({ error: 'Erro ao criar resposta de teste' }, { status: 500 })
    }

    console.log('✅ Resposta de teste criada:', response)

    return NextResponse.json({ 
      data: response,
      message: 'Resposta de teste criada com sucesso' 
    })
  } catch (error) {
    console.error('❌ Erro no servidor:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 