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

    console.log('👤 Usuário logado:', user.id)

    // Versão ultra-simplificada - apenas retornar dados mock por enquanto
    const mockData = [
      {
        id: 'mock-1',
        questionnaire_id: 'q-1',
        patient_id: 'p-1',
        answers: [{ question_id: 'q1', value: 'Teste' }],
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        questionnaires: {
          id: 'q-1',
          title: 'Questionário de Teste',
          description: 'Teste',
          questions: [],
          doctor_id: user.id
        },
        patients: {
          id: 'p-1',
          full_name: 'Paciente Teste',
          email: 'teste@teste.com',
          phone: '11999999999'
        }
      }
    ]

    return NextResponse.json({
      data: mockData,
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        pages: 1
      },
      debug: 'API simplificada com dados mock'
    })
  } catch (error) {
    console.error('❌ Erro na API simplificada:', error)
    return NextResponse.json({ 
      error: 'Erro interno',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
} 