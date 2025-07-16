import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Pular verificação de autenticação para debug
    console.log('DEBUG: Buscando perguntas do banco...')

    // Buscar todas as perguntas do banco
    const { data: questions, error } = await supabase
      .from('questions_bank')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar perguntas:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`DEBUG: Encontradas ${questions?.length || 0} perguntas`)
    
    // Filtrar apenas perguntas de queixa para debug
    const complaintQuestions = questions?.filter(q => 
      q.question_type === 'facial_complaints' || q.question_type === 'body_complaints'
    ) || []
    
    console.log(`DEBUG: Perguntas de queixa: ${complaintQuestions.length}`)
    
    return NextResponse.json({
      questions: questions || [],
      complaintQuestions,
      stats: {
        total: questions?.length || 0,
        facial: questions?.filter(q => q.question_type === 'facial_complaints').length || 0,
        body: questions?.filter(q => q.question_type === 'body_complaints').length || 0
      }
    })
  } catch (error) {
    console.error('Erro na API debug:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 