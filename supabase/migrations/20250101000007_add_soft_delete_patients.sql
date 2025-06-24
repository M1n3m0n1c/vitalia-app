-- Migração para adicionar exclusão suave na tabela de pacientes
-- Criada em: 2025-01-01
-- Autor: Sistema de Anamnese Digital

-- Adicionar campo deleted_at para exclusão suave
ALTER TABLE patients 
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Adicionar índice para melhorar performance nas consultas
CREATE INDEX idx_patients_deleted_at ON patients(deleted_at);

-- Criar índice composto para consultas do médico com pacientes ativos
CREATE INDEX idx_patients_doctor_active ON patients(doctor_id, deleted_at) 
WHERE deleted_at IS NULL;

-- Atualizar políticas RLS para excluir pacientes deletados das consultas normais
DROP POLICY IF EXISTS "Médicos podem visualizar seus pacientes" ON patients;
CREATE POLICY "Médicos podem visualizar seus pacientes" ON patients
  FOR SELECT USING (
    doctor_id = auth.uid() AND deleted_at IS NULL
  );

-- Política específica para visualizar pacientes deletados (para recuperação)
CREATE POLICY "Médicos podem visualizar seus pacientes deletados" ON patients
  FOR SELECT USING (
    doctor_id = auth.uid() AND deleted_at IS NOT NULL
  );

-- Atualizar política de UPDATE para não permitir modificar pacientes deletados
DROP POLICY IF EXISTS "Médicos podem atualizar seus pacientes" ON patients;
CREATE POLICY "Médicos podem atualizar seus pacientes" ON patients
  FOR UPDATE USING (
    doctor_id = auth.uid() AND deleted_at IS NULL
  );

-- Política para permitir "deletar" (soft delete) pacientes
CREATE POLICY "Médicos podem deletar seus pacientes" ON patients
  FOR UPDATE USING (
    doctor_id = auth.uid()
  );

-- Comentários para documentação
COMMENT ON COLUMN patients.deleted_at IS 'Timestamp da exclusão suave. NULL indica que o registro está ativo.';
COMMENT ON INDEX idx_patients_deleted_at IS 'Índice para otimizar consultas de exclusão suave.';
COMMENT ON INDEX idx_patients_doctor_active IS 'Índice otimizado para consultas de pacientes ativos por médico.'; 