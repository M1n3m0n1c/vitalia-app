-- Políticas RLS para tabela patient_documents
-- Criada em: 2025-01-01
-- Autor: Sistema de Anamnese Digital

-- Habilitar RLS na tabela
ALTER TABLE patient_documents ENABLE ROW LEVEL SECURITY;

-- Política para SELECT: Médicos podem ver documentos de seus pacientes
CREATE POLICY "Médicos podem visualizar documentos de seus pacientes" ON patient_documents
  FOR SELECT USING (
    doctor_id = auth.uid() OR
    patient_id IN (
      SELECT id FROM patients WHERE doctor_id = auth.uid()
    )
  );

-- Política para INSERT: Médicos podem inserir documentos para seus pacientes
CREATE POLICY "Médicos podem inserir documentos para seus pacientes" ON patient_documents
  FOR INSERT WITH CHECK (
    doctor_id = auth.uid() AND
    patient_id IN (
      SELECT id FROM patients WHERE doctor_id = auth.uid()
    )
  );

-- Política para UPDATE: Médicos podem atualizar documentos de seus pacientes
CREATE POLICY "Médicos podem atualizar documentos de seus pacientes" ON patient_documents
  FOR UPDATE USING (
    doctor_id = auth.uid() OR
    patient_id IN (
      SELECT id FROM patients WHERE doctor_id = auth.uid()
    )
  ) WITH CHECK (
    doctor_id = auth.uid() AND
    patient_id IN (
      SELECT id FROM patients WHERE doctor_id = auth.uid()
    )
  );

-- Política para DELETE: Médicos podem deletar documentos de seus pacientes
CREATE POLICY "Médicos podem deletar documentos de seus pacientes" ON patient_documents
  FOR DELETE USING (
    doctor_id = auth.uid() OR
    patient_id IN (
      SELECT id FROM patients WHERE doctor_id = auth.uid()
    )
  ); 