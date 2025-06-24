-- Migração para criar tabela de documentos de pacientes
-- Criada em: 2025-01-01
-- Autor: Sistema de Anamnese Digital

-- Enum para tipos de documento
CREATE TYPE document_type AS ENUM (
  'identity',      -- RG, CNH, etc.
  'medical',       -- Exames, laudos médicos
  'insurance',     -- Plano de saúde
  'consent',       -- Termos de consentimento
  'prescription',  -- Receitas médicas
  'report',        -- Relatórios
  'other'          -- Outros documentos
);

-- Tabela de documentos de pacientes
CREATE TABLE patient_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Informações do arquivo
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  
  -- Metadados do documento
  document_type document_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  
  -- Controle de acesso
  is_sensitive BOOLEAN DEFAULT FALSE, -- Documentos sensíveis requerem autenticação extra
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_patient_documents_updated_at 
  BEFORE UPDATE ON patient_documents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_patient_documents_patient_id ON patient_documents(patient_id);
CREATE INDEX idx_patient_documents_doctor_id ON patient_documents(doctor_id);
CREATE INDEX idx_patient_documents_type ON patient_documents(document_type);
CREATE INDEX idx_patient_documents_created_at ON patient_documents(created_at);

-- Comentários para documentação
COMMENT ON TABLE patient_documents IS 'Documentos associados aos pacientes (RG, exames, laudos, etc.)';
COMMENT ON COLUMN patient_documents.is_sensitive IS 'Documentos sensíveis requerem autenticação adicional para acesso';
COMMENT ON COLUMN patient_documents.tags IS 'Tags para categorização e busca de documentos'; 