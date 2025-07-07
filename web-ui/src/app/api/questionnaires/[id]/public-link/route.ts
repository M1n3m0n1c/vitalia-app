import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = await createServerSupabaseClient()
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { patient_id } = body
    if (!patient_id) {
      return NextResponse.json({ error: 'Selecione um paciente' }, { status: 400 })
    }

    // Verificar se já existe link público para este questionário e paciente
    const { data: existing, error: existingError } = await supabase
      .from('public_links')
      .select('*')
      .eq('questionnaire_id', id)
      .eq('patient_id', patient_id)
      .is('expires_at', null)
      .single()

    if (existingError && existingError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Erro ao buscar link público' }, { status: 500 })
    }

    if (existing) {
      return NextResponse.json({ data: existing.token }, { status: 200 })
    }

    // Gerar novo link público
    const { data: link, error } = await supabase
      .from('public_links')
      .insert({
        questionnaire_id: id,
        patient_id,
        token: undefined, // gerado automaticamente pelo banco
        expires_at: '2099-12-31T23:59:59Z',
        is_used: false
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Erro ao criar link público' }, { status: 500 })
    }

    return NextResponse.json({ data: link.token }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 