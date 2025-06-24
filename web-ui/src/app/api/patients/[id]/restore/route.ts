import { NextRequest, NextResponse } from 'next/server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

// POST /api/patients/[id]/restore - Restaurar paciente excluído
export async function POST(
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

    // Verificar se o paciente existe e está deletado
    const { data: existingPatient, error: checkError } = await supabase
      .from('patients')
      .select('id, deleted_at, full_name')
      .eq('id', id)
      .eq('doctor_id', user.id)
      .single()

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Paciente não encontrado' },
          { status: 404 }
        )
      }
      console.error('Erro ao verificar paciente:', checkError)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    // Verificar se está realmente deletado
    if (!existingPatient.deleted_at) {
      return NextResponse.json(
        { error: 'Paciente não está excluído' },
        { status: 400 }
      )
    }

    // Restaurar paciente (remover deleted_at)
    const { data: restoredPatient, error: restoreError } = await supabase
      .from('patients')
      .update({ deleted_at: null })
      .eq('id', id)
      .eq('doctor_id', user.id)
      .select()
      .single()

    if (restoreError) {
      console.error('Erro ao restaurar paciente:', restoreError)
      return NextResponse.json(
        { error: 'Erro ao restaurar paciente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Paciente restaurado com sucesso',
      data: restoredPatient,
    })
  } catch (error) {
    console.error('Erro na API de restauração:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
