import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const supabase = await createServerSupabaseClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    console.log('🔍 Buscando respostas para usuário:', user.id)

    // VERSÃO SIMPLIFICADA PARA DEBUG
    // Vamos primeiro verificar se há dados básicos
    
    // 1. Verificar questionários do usuário
    const { data: questionnaires, error: questError } = await supabase
      .from('questionnaires')
      .select('id, title, description, questions, doctor_id')
      .eq('doctor_id', user.id)

    console.log('📋 Questionários encontrados:', questionnaires?.length || 0)
    
    if (questError) {
      console.error('❌ Erro ao buscar questionários:', questError)
      return NextResponse.json({ error: 'Erro ao buscar questionários' }, { status: 500 })
    }

    if (!questionnaires || questionnaires.length === 0) {
      console.log('⚠️ Usuário não tem questionários')
      return NextResponse.json({
        data: [],
        pagination: { page, limit, total: 0, pages: 0 },
        debug: 'Nenhum questionário encontrado para este usuário'
      })
    }

    // 2. Buscar respostas para esses questionários (sem JOIN complexo)
    const questionnaireIds = questionnaires.map(q => q.id)
    console.log('🔍 IDs dos questionários para buscar respostas:', questionnaireIds)
    
    const { data: responses, error: respError } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .in('questionnaire_id', questionnaireIds)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    console.log('📊 Respostas encontradas:', responses?.length || 0)
    
    if (respError) {
      console.error('❌ Erro ao buscar respostas:', respError)
      return NextResponse.json({ error: 'Erro ao buscar respostas' }, { status: 500 })
    }

    if (!responses || responses.length === 0) {
      console.log('⚠️ Nenhuma resposta encontrada')
      return NextResponse.json({
        data: [],
        pagination: { page, limit, total: 0, pages: 0 },
        debug: 'Nenhuma resposta encontrada para os questionários deste usuário'
      })
    }

    // 3. Buscar dados complementares separadamente
    console.log('🔄 Criando mapa de questionários...')
    const questionnaireMap = new Map(questionnaires.map(q => [q.id, q]))
    console.log('📋 Mapa de questionários criado:', questionnaireMap.size)
    
    console.log('🔄 Extraindo IDs de pacientes...')
    const patientIds = Array.from(new Set(responses.map(r => r.patient_id)))
    console.log('👥 IDs de pacientes únicos:', patientIds)
    
    console.log('🔄 Buscando dados de pacientes...')
    const { data: patients, error: patientError } = await supabase
      .from('patients')
      .select('id, full_name, email, phone')
      .in('id', patientIds)

    if (patientError) {
      console.error('❌ Erro ao buscar pacientes:', patientError)
      return NextResponse.json({ error: 'Erro ao buscar dados de pacientes' }, { status: 500 })
    }

    console.log('👥 Pacientes encontrados:', patients?.length || 0)
    const patientMap = new Map(patients?.map(p => [p.id, p]) || [])

    // 4. Combinar os dados manualmente
    console.log('🔄 Combinando dados...')
    const enrichedResponses = responses.map(response => {
      const questionnaire = questionnaireMap.get(response.questionnaire_id)
      const patient = patientMap.get(response.patient_id)
      
      console.log(`📝 Resposta ${response.id}:`, {
        questionnaire: questionnaire ? 'encontrado' : 'NÃO ENCONTRADO',
        patient: patient ? 'encontrado' : 'NÃO ENCONTRADO',
        answersType: typeof response.answers,
        answersIsArray: Array.isArray(response.answers)
      })
      
      // Garantir que answers seja um array
      let answers = response.answers
      if (typeof answers === 'string') {
        try {
          answers = JSON.parse(answers)
        } catch (e) {
          console.error('❌ Erro ao fazer parse de answers:', e)
          answers = []
        }
      }
      if (!Array.isArray(answers)) {
        answers = []
      }
      
      return {
        ...response,
        answers,
        questionnaires: questionnaire,
        patients: patient
      }
    })
    
    console.log('✅ Dados combinados com sucesso:', enrichedResponses.length)

    const result = {
      data: enrichedResponses,
      pagination: {
        page,
        limit,
        total: responses.length, // Simplificado por enquanto
        pages: Math.ceil(responses.length / limit)
      },
      debug: 'Busca simplificada funcionando'
    }

    console.log('🎯 Retornando resultado final:', {
      totalRespostas: result.data.length,
      pagination: result.pagination
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ Erro no servidor (stack completo):', error)
    console.error('❌ Erro stack:', error instanceof Error ? error.stack : 'Sem stack trace')
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
} 