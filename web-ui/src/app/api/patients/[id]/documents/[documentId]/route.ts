import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { deleteFile, getSignedUrl } from '@/lib/utils/storage'
import { updatePatientDocumentSchema } from '@/lib/validations/patient-documents'
import { PatientDocument } from '@/types/patient-documents'

// GET - Obter documento específico (com URL assinada se necessário)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id: patientId, documentId } = await params
    const { searchParams } = new URL(request.url)
    const includeUrl = searchParams.get('include_url') === 'true'

    // Buscar documento
    const { data: document, error } = await supabase
      .from('patient_documents')
      .select('*')
      .eq('id', documentId)
      .eq('patient_id', patientId)
      .single()

    if (error || !document) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o paciente pertence ao médico
    const { data: patient } = await supabase
      .from('patients')
      .select('id')
      .eq('id', patientId)
      .eq('doctor_id', user.id)
      .single()

    if (!patient) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const documentWithUrl = document as PatientDocument & {
      download_url?: string
    }

    // Gerar URL assinada se solicitado
    if (includeUrl) {
      const urlResult = await getSignedUrl(
        'patient-documents',
        document.file_path,
        3600 // 1 hora
      )

      if (urlResult.success) {
        documentWithUrl.download_url = urlResult.url
      }
    }

    return NextResponse.json({ document: documentWithUrl })
  } catch (error) {
    console.error('Erro ao buscar documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar metadados do documento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id: patientId, documentId } = await params
    const body = await request.json()

    // Validar dados
    const validatedData = updatePatientDocumentSchema.parse(body)

    // Verificar se o documento existe e pertence ao médico
    const { data: document, error: docError } = await supabase
      .from('patient_documents')
      .select('*')
      .eq('id', documentId)
      .eq('patient_id', patientId)
      .single()

    if (docError || !document) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o paciente pertence ao médico
    const { data: patient } = await supabase
      .from('patients')
      .select('id')
      .eq('id', patientId)
      .eq('doctor_id', user.id)
      .single()

    if (!patient) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Atualizar documento
    const { data: updatedDocument, error: updateError } = await supabase
      .from('patient_documents')
      .update(validatedData)
      .eq('id', documentId)
      .select()
      .single()

    if (updateError) {
      console.error('Erro ao atualizar documento:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar documento' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Documento atualizado com sucesso',
      document: updatedDocument as PatientDocument,
    })
  } catch (error) {
    console.error('Erro ao atualizar documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir documento
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id: patientId, documentId } = await params

    // Buscar documento para obter o file_path
    const { data: document, error: docError } = await supabase
      .from('patient_documents')
      .select('*')
      .eq('id', documentId)
      .eq('patient_id', patientId)
      .single()

    if (docError || !document) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o paciente pertence ao médico
    const { data: patient } = await supabase
      .from('patients')
      .select('id')
      .eq('id', patientId)
      .eq('doctor_id', user.id)
      .single()

    if (!patient) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Excluir arquivo do storage
    const deleteResult = await deleteFile(
      'patient-documents',
      document.file_path
    )

    if (!deleteResult.success) {
      console.error('Erro ao excluir arquivo do storage:', deleteResult.error)
      // Continuar mesmo se falhar, pois o registro no banco deve ser removido
    }

    // Excluir registro do banco
    const { error: deleteError } = await supabase
      .from('patient_documents')
      .delete()
      .eq('id', documentId)

    if (deleteError) {
      console.error('Erro ao excluir documento do banco:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao excluir documento' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Documento excluído com sucesso',
    })
  } catch (error) {
    console.error('Erro ao excluir documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
