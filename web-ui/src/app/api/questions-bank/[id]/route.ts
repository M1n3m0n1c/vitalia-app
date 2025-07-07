import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { questionBankSchema } from '@/lib/validations/questionnaire'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabaseClient()
    const { id } = await params
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar pergunta - pode ser padrão ou do médico
    const { data: question, error } = await supabase
      .from('questions_bank')
      .select('*')
      .eq('id', id)
      .or(`is_default.eq.true,doctor_id.eq.${user.id}`)
      .single()

    if (error) {
      console.error('Erro ao buscar pergunta:', error)
      return NextResponse.json({ error: 'Pergunta não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ data: question })

  } catch (error) {
    console.error('Erro na API da pergunta:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabaseClient()
    const { id } = await params
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se a pergunta existe e pertence ao médico
    const { data: existingQuestion, error: fetchError } = await supabase
      .from('questions_bank')
      .select('*')
      .eq('id', id)
      .eq('doctor_id', user.id) // Só pode editar suas próprias perguntas
      .single()

    if (fetchError || !existingQuestion) {
      return NextResponse.json({ error: 'Pergunta não encontrada ou sem permissão' }, { status: 404 })
    }

    // Não permitir edição de perguntas padrão
    if (existingQuestion.is_default) {
      return NextResponse.json({ error: 'Não é possível editar perguntas padrão' }, { status: 403 })
    }

    // Validar dados de entrada
    const body = await request.json()
    const questionData = questionBankSchema.parse(body)

    // Atualizar pergunta
    const { data: question, error } = await supabase
      .from('questions_bank')
      .update({
        question_text: questionData.question_text,
        question_type: questionData.question_type,
        options: questionData.options,
        category: questionData.category,
        specialty: questionData.specialty,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar pergunta:', error)
      return NextResponse.json({ error: 'Erro ao atualizar pergunta' }, { status: 500 })
    }

    return NextResponse.json({ data: question })

  } catch (error) {
    console.error('Erro na API da pergunta:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabaseClient()
    const { id } = await params
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se a pergunta existe e pertence ao médico
    const { data: existingQuestion, error: fetchError } = await supabase
      .from('questions_bank')
      .select('*')
      .eq('id', id)
      .eq('doctor_id', user.id) // Só pode deletar suas próprias perguntas
      .single()

    if (fetchError || !existingQuestion) {
      return NextResponse.json({ error: 'Pergunta não encontrada ou sem permissão' }, { status: 404 })
    }

    // Não permitir exclusão de perguntas padrão
    if (existingQuestion.is_default) {
      return NextResponse.json({ error: 'Não é possível excluir perguntas padrão' }, { status: 403 })
    }

    // Verificar se a pergunta está sendo usada em questionários
    const { data: questionnaires, error: usageError } = await supabase
      .from('questionnaires')
      .select('id, title')
      .contains('questions', [{ id: id }])
      .limit(1)

    if (usageError) {
      console.error('Erro ao verificar uso da pergunta:', usageError)
      return NextResponse.json({ error: 'Erro ao verificar uso da pergunta' }, { status: 500 })
    }

    if (questionnaires && questionnaires.length > 0) {
      return NextResponse.json({ 
        error: 'Esta pergunta está sendo usada em questionários e não pode ser excluída',
        details: { questionnaires }
      }, { status: 409 })
    }

    // Deletar pergunta
    const { error } = await supabase
      .from('questions_bank')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar pergunta:', error)
      return NextResponse.json({ error: 'Erro ao deletar pergunta' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Pergunta removida com sucesso' })

  } catch (error) {
    console.error('Erro na API da pergunta:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 