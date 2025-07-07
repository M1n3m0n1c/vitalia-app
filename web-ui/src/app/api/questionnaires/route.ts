import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { questionnaireSchema, questionnaireFiltersSchema } from '@/lib/validations/questionnaire'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Obter parâmetros de busca
    const { searchParams } = new URL(request.url)
    const filters = questionnaireFiltersSchema.parse({
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      is_active: searchParams.get('is_active') ? searchParams.get('is_active') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    })

    // Construir query
    let query = supabase
      .from('questionnaires')
      .select('*')
      .eq('doctor_id', user.id)
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }

    // Aplicar paginação
    const from = (filters.page - 1) * filters.limit
    const to = from + filters.limit - 1
    query = query.range(from, to)

    const { data: questionnaires, error, count } = await query

    if (error) {
      console.error('Erro ao buscar questionários:', error)
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }

    // Obter contagem total para paginação
    const { count: totalCount } = await supabase
      .from('questionnaires')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', user.id)

    return NextResponse.json({
      data: questionnaires,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / filters.limit)
      }
    })

  } catch (error) {
    console.error('Erro na API de questionários:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Parâmetros inválidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Validar dados de entrada
    const body = await request.json()
    const questionnaireData = questionnaireSchema.parse(body)

    // Inserir questionário
    const { data: questionnaire, error } = await supabase
      .from('questionnaires')
      .insert([{
        title: questionnaireData.title,
        description: questionnaireData.description,
        questions: questionnaireData.questions,
        category: questionnaireData.category,
        is_active: questionnaireData.is_active ?? true,
        expires_at: questionnaireData.expires_at,
        doctor_id: user.id
      }])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar questionário:', error)
      return NextResponse.json({ error: 'Erro ao criar questionário' }, { status: 500 })
    }

    return NextResponse.json({ data: questionnaire }, { status: 201 })

  } catch (error) {
    console.error('Erro na API de questionários:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 