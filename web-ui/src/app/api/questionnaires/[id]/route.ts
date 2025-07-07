import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { questionnaireSchema } from '@/lib/validations/questionnaire'
import { z } from 'zod'

export async function GET(
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

    const { data: questionnaire, error } = await supabase
      .from('questionnaires')
      .select('*')
      .eq('id', id)
      .eq('doctor_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Questionário não encontrado' }, { status: 404 })
      }
      console.error('Erro ao buscar questionário:', error)
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }

    return NextResponse.json({ data: questionnaire })

  } catch (error) {
    console.error('Erro na API de questionário:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(
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

    // Validar dados de entrada
    const body = await request.json()
    const questionnaireData = questionnaireSchema.parse(body)

    // Verificar se o questionário existe e pertence ao médico
    const { data: existingQuestionnaire, error: checkError } = await supabase
      .from('questionnaires')
      .select('id')
      .eq('id', id)
      .eq('doctor_id', user.id)
      .single()

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Questionário não encontrado' }, { status: 404 })
      }
      console.error('Erro ao verificar questionário:', checkError)
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }

    // Atualizar questionário
    const { data: questionnaire, error } = await supabase
      .from('questionnaires')
      .update({
        title: questionnaireData.title,
        description: questionnaireData.description,
        questions: questionnaireData.questions,
        category: questionnaireData.category,
        is_active: questionnaireData.is_active,
        expires_at: questionnaireData.expires_at
      })
      .eq('id', id)
      .eq('doctor_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar questionário:', error)
      return NextResponse.json({ error: 'Erro ao atualizar questionário' }, { status: 500 })
    }

    return NextResponse.json({ data: questionnaire })

  } catch (error) {
    console.error('Erro na API de questionário:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(
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

    // Verificar se existem respostas para este questionário
    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select('id')
      .eq('questionnaire_id', id)
      .limit(1)

    if (responsesError) {
      console.error('Erro ao verificar respostas:', responsesError)
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }

    if (responses && responses.length > 0) {
      // Se existem respostas, apenas desativar o questionário
      const { data: questionnaire, error } = await supabase
        .from('questionnaires')
        .update({ is_active: false })
        .eq('id', id)
        .eq('doctor_id', user.id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Questionário não encontrado' }, { status: 404 })
        }
        console.error('Erro ao desativar questionário:', error)
        return NextResponse.json({ error: 'Erro ao desativar questionário' }, { status: 500 })
      }

      return NextResponse.json({ 
        data: questionnaire, 
        message: 'Questionário desativado (possui respostas associadas)' 
      })
    } else {
      // Se não existem respostas, deletar completamente
      const { error } = await supabase
        .from('questionnaires')
        .delete()
        .eq('id', id)
        .eq('doctor_id', user.id)

      if (error) {
        console.error('Erro ao deletar questionário:', error)
        return NextResponse.json({ error: 'Erro ao deletar questionário' }, { status: 500 })
      }

      return NextResponse.json({ message: 'Questionário deletado com sucesso' })
    }

  } catch (error) {
    console.error('Erro na API de questionário:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; duplicate?: string }> }
) {
  // Handler para duplicação: só executa se a URL terminar com /duplicate
  const url = request.url;
  if (!url.endsWith('/duplicate')) return;
  const { id } = await params;
  try {
    const supabase = await createServerSupabaseClient();
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    // Buscar questionário original
    const { data: original, error: fetchError } = await supabase
      .from('questionnaires')
      .select('*')
      .eq('id', id)
      .eq('doctor_id', user.id)
      .single();
    if (fetchError || !original) {
      return NextResponse.json({ error: 'Questionário não encontrado' }, { status: 404 });
    }
    // Buscar quantas cópias já existem
    const baseTitle = original.title.replace(/( Cópia( \d+)?)$/, '');
    const { data: copies } = await supabase
      .from('questionnaires')
      .select('id')
      .ilike('title', `${baseTitle} Cópia%`)
      .eq('doctor_id', user.id);
    const copyNumber = (copies?.length || 0) + 1;
    const newTitle = `${baseTitle} Cópia ${copyNumber}`;
    // Criar nova instância
    const { data: newQuestionnaire, error: insertError } = await supabase
      .from('questionnaires')
      .insert([{
        title: newTitle,
        description: original.description,
        questions: original.questions,
        category: original.category,
        is_active: original.is_active,
        expires_at: original.expires_at,
        doctor_id: user.id,
        specialty: original.specialty || null
      }])
      .select()
      .single();
    if (insertError) {
      return NextResponse.json({ error: 'Erro ao duplicar questionário' }, { status: 500 });
    }
    return NextResponse.json({ data: newQuestionnaire }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno ao duplicar questionário' }, { status: 500 });
  }
} 