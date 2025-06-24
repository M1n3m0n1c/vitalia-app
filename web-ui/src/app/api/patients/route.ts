import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import {
  createPatientSchema,
  patientFiltersSchema,
} from '@/lib/validations/patient'

// GET /api/patients - Listar pacientes com filtros e paginação
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

    // Extrair e validar parâmetros de query
    const searchParams = request.nextUrl.searchParams
    const queryParams = {
      search: searchParams.get('search') || undefined,
      gender: searchParams.get('gender') || undefined,
      ageMin: searchParams.get('ageMin')
        ? parseInt(searchParams.get('ageMin')!)
        : undefined,
      ageMax: searchParams.get('ageMax')
        ? parseInt(searchParams.get('ageMax')!)
        : undefined,
      createdAfter: searchParams.get('createdAfter') || undefined,
      createdBefore: searchParams.get('createdBefore') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit')
        ? parseInt(searchParams.get('limit')!)
        : 20,
      sortBy: searchParams.get('sortBy') || 'created_at',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    }

    // Validar parâmetros
    const validatedParams = patientFiltersSchema.parse(queryParams)

    // Construir query base
    let query = supabase
      .from('patients')
      .select('*', { count: 'exact' })
      .eq('doctor_id', user.id)

    // Aplicar filtros
    if (validatedParams.search) {
      query = query.or(
        `full_name.ilike.%${validatedParams.search}%,cpf.ilike.%${validatedParams.search}%,phone.ilike.%${validatedParams.search}%`
      )
    }

    if (validatedParams.gender) {
      query = query.eq('gender', validatedParams.gender)
    }

    if (validatedParams.createdAfter) {
      query = query.gte('created_at', validatedParams.createdAfter)
    }

    if (validatedParams.createdBefore) {
      query = query.lte('created_at', validatedParams.createdBefore)
    }

    // Filtros de idade (calculados com base na data de nascimento)
    if (validatedParams.ageMin || validatedParams.ageMax) {
      const today = new Date()

      if (validatedParams.ageMax) {
        const minBirthDate = new Date(
          today.getFullYear() - validatedParams.ageMax - 1,
          today.getMonth(),
          today.getDate()
        )
        query = query.gte(
          'birth_date',
          minBirthDate.toISOString().split('T')[0]
        )
      }

      if (validatedParams.ageMin) {
        const maxBirthDate = new Date(
          today.getFullYear() - validatedParams.ageMin,
          today.getMonth(),
          today.getDate()
        )
        query = query.lte(
          'birth_date',
          maxBirthDate.toISOString().split('T')[0]
        )
      }
    }

    // Aplicar ordenação
    query = query.order(validatedParams.sortBy, {
      ascending: validatedParams.sortOrder === 'asc',
    })

    // Aplicar paginação
    const from = (validatedParams.page - 1) * validatedParams.limit
    const to = from + validatedParams.limit - 1
    query = query.range(from, to)

    // Executar query
    const { data: patients, error, count } = await query

    if (error) {
      console.error('Erro ao buscar pacientes:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    // Calcular metadados de paginação
    const totalPages = Math.ceil((count || 0) / validatedParams.limit)
    const hasNextPage = validatedParams.page < totalPages
    const hasPreviousPage = validatedParams.page > 1

    return NextResponse.json({
      data: patients,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        total: count || 0,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Parâmetros inválidos',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    console.error('Erro na API de pacientes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/patients - Criar novo paciente
export async function POST(request: NextRequest) {
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

    // Extrair e validar dados do corpo da requisição
    const body = await request.json()
    const validatedData = createPatientSchema.parse(body)

    // Verificar se CPF já existe (se fornecido)
    if (validatedData.cpf) {
      const { data: existingPatient } = await supabase
        .from('patients')
        .select('id')
        .eq('cpf', validatedData.cpf)
        .single()

      if (existingPatient) {
        return NextResponse.json(
          {
            error: 'CPF já cadastrado para outro paciente',
          },
          { status: 409 }
        )
      }
    }

    // Criar paciente
    const { data: patient, error } = await supabase
      .from('patients')
      .insert({
        ...validatedData,
        doctor_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar paciente:', error)
      return NextResponse.json(
        { error: 'Erro ao criar paciente' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: patient }, { status: 201 })
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

    console.error('Erro na API de pacientes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
