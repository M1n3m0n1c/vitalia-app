import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  try {
    const supabase = await createServerSupabaseClient()
    // Buscar link público válido (não expirado)
    const now = new Date().toISOString()
    const { data: link, error } = await supabase
      .from('public_links')
      .select('*, questionnaire:questionnaire_id(*), patient:patient_id(*)')
      .eq('token', token)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .single()
    if (error || !link) {
      return NextResponse.json({ error: 'Link inválido ou expirado.' }, { status: 404 })
    }
    // Buscar resposta já existente para este link
    const { data: existing } = await supabase
      .from('questionnaire_responses')
      .select('id, completed_at')
      .eq('public_link_id', link.id)
      .maybeSingle()
    // Retornar questionário, paciente e resposta (se houver)
    return NextResponse.json({ data: { questionnaire: link.questionnaire, patient: link.patient, response: existing || null } })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
} 