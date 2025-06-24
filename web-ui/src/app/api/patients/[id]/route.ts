import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { updatePatientSchema } from '@/lib/validations/patient'

// GET /api/patients/[id] - Obter paciente específico
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

    // Buscar paciente
    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .eq('doctor_id', user.id) // Garantir que o paciente pertence ao médico
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return NextResponse.json(
          { error: 'Paciente não encontrado' },
          { status: 404 }
        )
      }
      console.error('Erro ao buscar paciente:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: patient })
  } catch (error) {
    console.error('Erro na API de paciente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/patients/[id] - Atualizar paciente
export async function PUT(
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

    // Verificar se o paciente existe e pertence ao médico
    const { data: existingPatient, error: checkError } = await supabase
      .from('patients')
      .select('id, cpf')
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

    // Extrair e validar dados do corpo da requisição
    const body = await request.json()
    const validatedData = updatePatientSchema.parse(body)

    // Verificar se CPF já existe em outro paciente (se fornecido e diferente do atual)
    if (validatedData.cpf && validatedData.cpf !== existingPatient.cpf) {
      const { data: duplicatePatient } = await supabase
        .from('patients')
        .select('id')
        .eq('cpf', validatedData.cpf)
        .neq('id', id)
        .single()

      if (duplicatePatient) {
        return NextResponse.json(
          {
            error: 'CPF já cadastrado para outro paciente',
          },
          { status: 409 }
        )
      }
    }

    // Atualizar paciente
    const { data: patient, error } = await supabase
      .from('patients')
      .update(validatedData)
      .eq('id', id)
      .eq('doctor_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar paciente:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar paciente' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: patient })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    console.error('Erro na API de paciente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/patients/[id] - Exclusão suave do paciente
export async function DELETE(
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

    // Verificar se o paciente existe e pertence ao médico (incluindo deletados)
    const { data: existingPatient, error: checkError } = await supabase
      .from('patients')
      .select('id, deleted_at')
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

    // Verificar se já está deletado
    if (existingPatient.deleted_at) {
      return NextResponse.json(
        { error: 'Paciente já foi excluído' },
        { status: 400 }
      )
    }

    // Fazer exclusão suave
    const { error } = await supabase
      .from('patients')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('doctor_id', user.id)

    if (error) {
      console.error('Erro ao excluir paciente:', error)
      return NextResponse.json(
        { error: 'Erro ao excluir paciente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Paciente excluído com sucesso',
      soft_delete: true,
    })
  } catch (error) {
    console.error('Erro na API de paciente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
