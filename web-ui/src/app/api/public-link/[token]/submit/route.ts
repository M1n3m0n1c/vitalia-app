import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  try {
    console.log('[API][submit] Token recebido:', token)
    const supabase = await createServerSupabaseClient()
    const body = await request.json()
    const { answers } = body
    console.log('[API][submit] Body recebido:', body)

    // Buscar link público válido (não expirado)
    const now = new Date().toISOString()
    const { data: link, error: linkError } = await supabase
      .from('public_links')
      .select('*, questionnaire:questionnaire_id(*), patient:patient_id(*)')
      .eq('token', token)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .single()
    if (linkError || !link) {
      console.error('[API][submit] Erro ao buscar link público:', linkError)
      return NextResponse.json({ error: 'Link inválido ou expirado.' }, { status: 404 })
    }
    console.log('[API][submit] Link público encontrado:', link)

    // Verificar se já existe resposta para este link
    const { data: existing, error: existingError } = await supabase
      .from('questionnaire_responses')
      .select('id, completed_at')
      .eq('public_link_id', link.id)
      .maybeSingle()
    if (existingError) {
      console.error('[API][submit] Erro ao verificar resposta existente:', existingError)
    }
    if (existing) {
      console.warn('[API][submit] Resposta já enviada para este link:', existing)
      return NextResponse.json({ 
        error: 'Respostas já enviadas para este link.',
        response: {
          id: existing.id,
          completed_at: existing.completed_at
        }
      }, { status: 409 })
    }

    // Salvar respostas
    const { error: insertError } = await supabase
      .from('questionnaire_responses')
      .insert({
        public_link_id: link.id,
        questionnaire_id: link.questionnaire_id,
        patient_id: link.patient_id,
        answers,
        completed_at: new Date().toISOString()
      })
    if (insertError) {
      console.error('[API][submit] Erro ao salvar respostas:', insertError)
      return NextResponse.json({ error: 'Erro ao salvar respostas.' }, { status: 500 })
    }

    console.log('[API][submit] Respostas salvas com sucesso!')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API][submit] Erro inesperado:', error)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
} 