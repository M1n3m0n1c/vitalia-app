import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { uploadFile } from '@/lib/utils/storage'
import {
  createPatientDocumentSchema,
  documentFiltersSchema,
} from '@/lib/validations/patient-documents'
import { PatientDocument } from '@/types/patient-documents'

// GET - Listar documentos de um paciente
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: patientId } = await params
    const { searchParams } = new URL(request.url)

    // Validar parâmetros de busca
    const filters = documentFiltersSchema.parse({
      patient_id: patientId,
      document_type: searchParams.get('document_type') || undefined,
      search: searchParams.get('search') || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      is_sensitive:
        searchParams.get('is_sensitive') === 'true'
          ? true
          : searchParams.get('is_sensitive') === 'false'
            ? false
            : undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    })

    // Verificar se o paciente pertence ao médico
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('id', patientId)
      .eq('doctor_id', user.id)
      .single()

    if (patientError || !patient) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      )
    }

    // Construir query
    let query = supabase
      .from('patient_documents')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (filters.document_type) {
      query = query.eq('document_type', filters.document_type)
    }

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      )
    }

    if (filters.is_sensitive !== undefined) {
      query = query.eq('is_sensitive', filters.is_sensitive)
    }

    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from)
    }

    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to)
    }

    // Paginação
    const from = (filters.page - 1) * filters.limit
    const to = from + filters.limit - 1
    query = query.range(from, to)

    const { data: documents, error, count } = await query

    if (error) {
      console.error('Erro ao buscar documentos:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      documents: documents as PatientDocument[],
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / filters.limit),
      },
    })
  } catch (error) {
    console.error('Erro na API de documentos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Fazer upload de documento para um paciente
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: patientId } = await params

    // Verificar se o paciente pertence ao médico
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, full_name')
      .eq('id', patientId)
      .eq('doctor_id', user.id)
      .single()

    if (patientError || !patient) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      )
    }

    // Processar FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    const metadataStr = formData.get('metadata') as string

    if (!file || !metadataStr) {
      return NextResponse.json(
        { error: 'Arquivo e metadados são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar metadados
    const metadata = JSON.parse(metadataStr)
    const validatedMetadata = createPatientDocumentSchema.parse({
      ...metadata,
      patient_id: patientId,
    })

    // Fazer upload do arquivo
    const uploadResult = await uploadFile(file, {
      bucket: 'patient-documents',
      folder: `patient-${patientId}`,
      fileName: `${Date.now()}-${file.name}`,
    })

    if (!uploadResult.success) {
      return NextResponse.json({ error: uploadResult.error }, { status: 400 })
    }

    // Salvar metadados no banco
    const { data: document, error: dbError } = await supabase
      .from('patient_documents')
      .insert({
        patient_id: patientId,
        doctor_id: user.id,
        file_name: uploadResult.data!.path.split('/').pop()!,
        original_name: file.name,
        file_path: uploadResult.data!.path,
        file_size: file.size,
        mime_type: file.type,
        document_type: validatedMetadata.document_type,
        title: validatedMetadata.title,
        description: validatedMetadata.description,
        tags: validatedMetadata.tags,
        is_sensitive: validatedMetadata.is_sensitive || false,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Erro ao salvar documento:', dbError)
      return NextResponse.json(
        { error: 'Erro ao salvar documento' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Documento enviado com sucesso',
        document: document as PatientDocument,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro no upload de documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
