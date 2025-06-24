import { NextRequest, NextResponse } from 'next/server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET /api/patients/deleted - Listar pacientes excluídos
export async function GET(request: NextRequest) {
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

    // Extrair parâmetros de consulta
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    // Calcular offset para paginação
    const offset = (page - 1) * limit

    // Construir query base
    let query = supabase
      .from('patients')
      .select('*', { count: 'exact' })
      .eq('doctor_id', user.id)
      .not('deleted_at', 'is', null) // Apenas pacientes deletados
      .order('deleted_at', { ascending: false })

    // Adicionar busca se fornecida
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,cpf.ilike.%${search}%`
      )
    }

    // Aplicar paginação
    query = query.range(offset, offset + limit - 1)

    // Executar query
    const { data: patients, error, count } = await query

    if (error) {
      console.error('Erro ao buscar pacientes deletados:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar pacientes' },
        { status: 500 }
      )
    }

    // Calcular metadados de paginação
    const totalPages = Math.ceil((count || 0) / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return NextResponse.json({
      data: patients,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    })
  } catch (error) {
    console.error('Erro na API de pacientes deletados:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
