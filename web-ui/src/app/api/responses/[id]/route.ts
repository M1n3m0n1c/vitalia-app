import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const resolvedParams = await params
    const { data: response, error } = await supabase
      .from('questionnaire_responses')
      .select(`
        id,
        questionnaire_id,
        patient_id,
        answers,
        completed_at,
        created_at,
        questionnaires!inner(
          id,
          title,
          description,
          questions,
          category,
          doctor_id
        ),
        patients!inner(
          id,
          full_name,
          email,
          phone,
          cpf,
          birth_date,
          gender
        )
      `)
      .eq('id', resolvedParams.id)
      .eq('questionnaires.doctor_id', user.id)
      .single()

    if (error) {
      console.error('Erro ao buscar resposta:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Resposta não encontrada' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Erro ao buscar resposta' }, { status: 500 })
    }

    return NextResponse.json({ data: response })
  } catch (error) {
    console.error('Erro no servidor:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 