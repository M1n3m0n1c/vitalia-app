import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET /api/patients/[id]/history - Buscar histórico completo do paciente
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type') // 'all', 'responses', 'notes', 'images', 'appointments', 'documents'

    // Verificar se o paciente pertence ao médico
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, full_name')
      .eq('id', id)
      .eq('doctor_id', user.id)
      .single()

    if (patientError) {
      if (patientError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Paciente não encontrado' },
          { status: 404 }
        )
      }
      console.error('Erro ao buscar paciente:', patientError)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    // Buscar histórico baseado no tipo solicitado
    const historyItems: any[] = []

    // 1. Respostas de questionários
    if (!type || type === 'all' || type === 'responses') {
      const { data: responses, error: responsesError } = await supabase
        .from('responses')
        .select(
          `
          id,
          answers,
          completed_at,
          created_at,
          updated_at,
          questionnaire_id,
          questionnaires (
            id,
            title,
            description,
            category
          )
        `
        )
        .eq('patient_id', id)
        .order('created_at', { ascending: false })

      if (responsesError) {
        console.error('Erro ao buscar respostas:', responsesError)
      } else {
        responses?.forEach(response => {
          const questionnaire = Array.isArray(response.questionnaires)
            ? response.questionnaires[0]
            : response.questionnaires

          historyItems.push({
            id: response.id,
            type: 'response',
            title: `Questionário: ${questionnaire?.title || 'Sem título'}`,
            description: questionnaire?.description || '',
            category: questionnaire?.category || 'Geral',
            date: response.completed_at || response.created_at,
            data: {
              questionnaire_id: response.questionnaire_id,
              answers: response.answers,
              questionnaire,
            },
          })
        })
      }
    }

    // 2. Anotações médicas
    if (!type || type === 'all' || type === 'notes') {
      const { data: notes, error: notesError } = await supabase
        .from('medical_notes')
        .select(
          `
          id,
          note_text,
          created_at,
          updated_at,
          response_id,
          question_id
        `
        )
        .eq('patient_id', id)
        .eq('doctor_id', user.id)
        .order('created_at', { ascending: false })

      if (notesError) {
        console.error('Erro ao buscar anotações:', notesError)
      } else {
        notes?.forEach(note => {
          historyItems.push({
            id: note.id,
            type: 'note',
            title: 'Anotação Médica',
            description: note.note_text,
            category: 'Anotações',
            date: note.created_at,
            data: {
              response_id: note.response_id,
              question_id: note.question_id,
            },
          })
        })
      }
    }

    // 3. Imagens médicas
    if (!type || type === 'all' || type === 'images') {
      const { data: images, error: imagesError } = await supabase
        .from('medical_images')
        .select(
          `
          id,
          file_name,
          file_path,
          category,
          tags,
          body_region,
          notes,
          created_at,
          updated_at
        `
        )
        .eq('patient_id', id)
        .eq('doctor_id', user.id)
        .order('created_at', { ascending: false })

      if (imagesError) {
        console.error('Erro ao buscar imagens:', imagesError)
      } else {
        images?.forEach(image => {
          historyItems.push({
            id: image.id,
            type: 'image',
            title: `Imagem: ${image.file_name}`,
            description: image.notes || `Categoria: ${image.category}`,
            category: 'Imagens',
            date: image.created_at,
            data: {
              file_path: image.file_path,
              category: image.category,
              tags: image.tags,
              body_region: image.body_region,
            },
          })
        })
      }
    }

    // 4. Consultas/Compromissos
    if (!type || type === 'all' || type === 'appointments') {
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(
          `
          id,
          title,
          description,
          start_time,
          end_time,
          status,
          created_at,
          updated_at
        `
        )
        .eq('patient_id', id)
        .eq('doctor_id', user.id)
        .order('start_time', { ascending: false })

      if (appointmentsError) {
        console.error('Erro ao buscar compromissos:', appointmentsError)
      } else {
        appointments?.forEach(appointment => {
          historyItems.push({
            id: appointment.id,
            type: 'appointment',
            title: `Consulta: ${appointment.title}`,
            description: appointment.description || '',
            category: 'Consultas',
            date: appointment.start_time,
            data: {
              start_time: appointment.start_time,
              end_time: appointment.end_time,
              status: appointment.status,
            },
          })
        })
      }
    }

    // 5. Documentos
    if (!type || type === 'all' || type === 'documents') {
      const { data: documents, error: documentsError } = await supabase
        .from('patient_documents')
        .select(
          `
          id,
          title,
          description,
          document_type,
          file_name,
          original_name,
          file_size,
          mime_type,
          tags,
          is_sensitive,
          created_at,
          updated_at
        `
        )
        .eq('patient_id', id)
        .eq('doctor_id', user.id)
        .order('created_at', { ascending: false })

      if (documentsError) {
        console.error('Erro ao buscar documentos:', documentsError)
      } else {
        documents?.forEach(document => {
          historyItems.push({
            id: document.id,
            type: 'document',
            title: `Documento: ${document.title}`,
            description: document.description || document.original_name,
            category: 'Documentos',
            date: document.created_at,
            data: {
              document_type: document.document_type,
              file_name: document.file_name,
              original_name: document.original_name,
              file_size: document.file_size,
              mime_type: document.mime_type,
              tags: document.tags,
              is_sensitive: document.is_sensitive,
            },
          })
        })
      }
    }

    // Ordenar por data (mais recente primeiro)
    historyItems.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // Aplicar paginação
    const paginatedItems = historyItems.slice(offset, offset + limit)

    // Estatísticas do histórico
    const stats = {
      total: historyItems.length,
      responses: historyItems.filter(item => item.type === 'response').length,
      notes: historyItems.filter(item => item.type === 'note').length,
      images: historyItems.filter(item => item.type === 'image').length,
      appointments: historyItems.filter(item => item.type === 'appointment')
        .length,
      documents: historyItems.filter(item => item.type === 'document').length,
    }

    return NextResponse.json({
      patient: {
        id: patient.id,
        name: patient.full_name,
      },
      history: paginatedItems,
      stats,
      pagination: {
        limit,
        offset,
        total: historyItems.length,
        hasMore: offset + limit < historyItems.length,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar histórico do paciente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
