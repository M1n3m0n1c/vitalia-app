-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum para tipos de usuário
CREATE TYPE user_role AS ENUM ('doctor', 'admin');

-- Enum para gênero
CREATE TYPE gender AS ENUM ('male', 'female', 'other');

-- Enum para tipos de pergunta
CREATE TYPE question_type AS ENUM (
  'text',
  'radio',
  'checkbox',
  'scale',
  'date',
  'file',
  'yes_no',
  'slider'
);

-- Tabela de usuários/médicos
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  crm TEXT,
  specialty TEXT,
  phone TEXT,
  organization_id UUID,
  role user_role DEFAULT 'doctor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de organizações/clínicas
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  address JSONB,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pacientes
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  cpf TEXT UNIQUE,
  birth_date DATE,
  gender gender,
  address JSONB,
  medical_history TEXT,
  doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de banco de perguntas
CREATE TABLE questions_bank (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL,
  options JSONB, -- Para perguntas de múltipla escolha
  category TEXT,
  specialty TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  doctor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de questionários
CREATE TABLE questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL, -- Array de perguntas estruturadas
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de respostas
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  answers JSONB NOT NULL, -- Respostas estruturadas
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(questionnaire_id, patient_id, created_at)
);

-- Tabela de anotações médicas
CREATE TABLE medical_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  response_id UUID REFERENCES responses(id) ON DELETE CASCADE,
  question_id UUID, -- Referência à pergunta específica
  note_text TEXT NOT NULL,
  doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de imagens médicas
CREATE TABLE medical_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  category TEXT, -- 'before', 'after', 'diagnosis', 'control'
  tags TEXT[],
  body_region TEXT,
  notes TEXT,
  doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de agenda/compromissos
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de links públicos para questionários
CREATE TABLE public_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_bank_updated_at BEFORE UPDATE ON questions_bank FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questionnaires_updated_at BEFORE UPDATE ON questionnaires FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_responses_updated_at BEFORE UPDATE ON responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_notes_updated_at BEFORE UPDATE ON medical_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_images_updated_at BEFORE UPDATE ON medical_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_public_links_updated_at BEFORE UPDATE ON public_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_patients_doctor_id ON patients(doctor_id);
CREATE INDEX idx_patients_cpf ON patients(cpf);
CREATE INDEX idx_questionnaires_doctor_id ON questionnaires(doctor_id);
CREATE INDEX idx_responses_questionnaire_id ON responses(questionnaire_id);
CREATE INDEX idx_responses_patient_id ON responses(patient_id);
CREATE INDEX idx_medical_notes_patient_id ON medical_notes(patient_id);
CREATE INDEX idx_medical_images_patient_id ON medical_images(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_public_links_token ON public_links(token);
CREATE INDEX idx_public_links_expires_at ON public_links(expires_at);

-- Adicionar foreign key para organizations
ALTER TABLE users ADD CONSTRAINT users_organization_id_fkey 
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL; 