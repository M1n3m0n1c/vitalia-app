import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { questionBankSchema, questionBankFiltersSchema } from '@/lib/validations/questionnaire'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Verificar autenticação (temporariamente desabilitado para teste)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    // if (authError || !user) {
    //   return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    // }
    
    // Para teste, usar um user_id fictício se não estiver autenticado
    const userId = user?.id || 'test-user-id'

    // Obter parâmetros de busca
    const { searchParams } = new URL(request.url)
    const filters = questionBankFiltersSchema.parse({
      search: searchParams.get('search') || undefined,
      question_type: searchParams.get('question_type') || undefined,
      category: searchParams.get('category') || undefined,
      specialty: searchParams.get('specialty') || undefined,
      is_default: searchParams.get('is_default') ? searchParams.get('is_default') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    })

    // Construir query - incluir apenas perguntas padrão para teste
    let query = supabase
      .from('questions_bank')
      .select('*')
      .eq('is_default', true)
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (filters.search) {
      query = query.ilike('question_text', `%${filters.search}%`)
    }

    if (filters.question_type) {
      query = query.eq('question_type', filters.question_type)
    }

    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    if (filters.specialty) {
      query = query.eq('specialty', filters.specialty)
    }

    if (filters.is_default !== undefined) {
      query = query.eq('is_default', filters.is_default)
    }

    // Aplicar paginação
    const from = (filters.page - 1) * filters.limit
    const to = from + filters.limit - 1
    query = query.range(from, to)

    const { data: questions, error, count } = await query

    if (error) {
      console.error('Erro ao buscar perguntas:', error)
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }

    // Obter contagem total para paginação
    const { count: totalCount } = await supabase
      .from('questions_bank')
      .select('*', { count: 'exact', head: true })
      .eq('is_default', true)

    return NextResponse.json({
      data: questions,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / filters.limit)
      }
    })

  } catch (error) {
    console.error('Erro na API do banco de perguntas:', error)
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
    const questionData = questionBankSchema.parse(body)

    // Inserir pergunta
    const { data: question, error } = await supabase
      .from('questions_bank')
      .insert([{
        question_text: questionData.question_text,
        question_type: questionData.question_type,
        options: questionData.options,
        category: questionData.category,
        specialty: questionData.specialty,
        is_default: false, // Perguntas criadas por médicos nunca são padrão
        doctor_id: user.id
      }])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar pergunta:', error)
      return NextResponse.json({ error: 'Erro ao criar pergunta' }, { status: 500 })
    }

    return NextResponse.json({ data: question }, { status: 201 })

  } catch (error) {
    console.error('Erro na API do banco de perguntas:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 