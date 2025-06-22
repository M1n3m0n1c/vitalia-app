-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_links ENABLE ROW LEVEL SECURITY;

-- Políticas para tabela users
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para tabela organizations
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas para tabela patients
CREATE POLICY "Doctors can view their patients" ON patients
  FOR SELECT USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert their patients" ON patients
  FOR INSERT WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update their patients" ON patients
  FOR UPDATE USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete their patients" ON patients
  FOR DELETE USING (doctor_id = auth.uid());

-- Políticas para tabela questions_bank
CREATE POLICY "Users can view default questions and their own" ON questions_bank
  FOR SELECT USING (
    is_default = true OR doctor_id = auth.uid()
  );

CREATE POLICY "Users can insert their own questions" ON questions_bank
  FOR INSERT WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Users can update their own questions" ON questions_bank
  FOR UPDATE USING (doctor_id = auth.uid());

CREATE POLICY "Users can delete their own questions" ON questions_bank
  FOR DELETE USING (doctor_id = auth.uid());

-- Políticas para tabela questionnaires
CREATE POLICY "Doctors can view their questionnaires" ON questionnaires
  FOR SELECT USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert their questionnaires" ON questionnaires
  FOR INSERT WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update their questionnaires" ON questionnaires
  FOR UPDATE USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete their questionnaires" ON questionnaires
  FOR DELETE USING (doctor_id = auth.uid());

-- Políticas para tabela responses
CREATE POLICY "Doctors can view responses to their questionnaires" ON responses
  FOR SELECT USING (
    questionnaire_id IN (
      SELECT id FROM questionnaires WHERE doctor_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can insert responses to their questionnaires" ON responses
  FOR INSERT WITH CHECK (
    questionnaire_id IN (
      SELECT id FROM questionnaires WHERE doctor_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update responses to their questionnaires" ON responses
  FOR UPDATE USING (
    questionnaire_id IN (
      SELECT id FROM questionnaires WHERE doctor_id = auth.uid()
    )
  );

-- Políticas para tabela medical_notes
CREATE POLICY "Doctors can view their medical notes" ON medical_notes
  FOR SELECT USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert their medical notes" ON medical_notes
  FOR INSERT WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update their medical notes" ON medical_notes
  FOR UPDATE USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete their medical notes" ON medical_notes
  FOR DELETE USING (doctor_id = auth.uid());

-- Políticas para tabela medical_images
CREATE POLICY "Doctors can view their medical images" ON medical_images
  FOR SELECT USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert their medical images" ON medical_images
  FOR INSERT WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update their medical images" ON medical_images
  FOR UPDATE USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete their medical images" ON medical_images
  FOR DELETE USING (doctor_id = auth.uid());

-- Políticas para tabela appointments
CREATE POLICY "Doctors can view their appointments" ON appointments
  FOR SELECT USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert their appointments" ON appointments
  FOR INSERT WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update their appointments" ON appointments
  FOR UPDATE USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete their appointments" ON appointments
  FOR DELETE USING (doctor_id = auth.uid());

-- Políticas para tabela public_links
CREATE POLICY "Doctors can view their public links" ON public_links
  FOR SELECT USING (
    questionnaire_id IN (
      SELECT id FROM questionnaires WHERE doctor_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can insert their public links" ON public_links
  FOR INSERT WITH CHECK (
    questionnaire_id IN (
      SELECT id FROM questionnaires WHERE doctor_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update their public links" ON public_links
  FOR UPDATE USING (
    questionnaire_id IN (
      SELECT id FROM questionnaires WHERE doctor_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can delete their public links" ON public_links
  FOR DELETE USING (
    questionnaire_id IN (
      SELECT id FROM questionnaires WHERE doctor_id = auth.uid()
    )
  );

-- Política especial para acesso público aos questionários via token
CREATE POLICY "Public access to questionnaires via valid token" ON questionnaires
  FOR SELECT USING (
    id IN (
      SELECT questionnaire_id FROM public_links 
      WHERE expires_at > NOW() AND is_used = false
    )
  );

-- Política especial para inserir respostas via link público
CREATE POLICY "Public can insert responses via valid token" ON responses
  FOR INSERT WITH CHECK (
    questionnaire_id IN (
      SELECT questionnaire_id FROM public_links 
      WHERE expires_at > NOW() AND is_used = false
    )
  );

-- Função para sincronizar usuário com auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar usuário automaticamente após registro
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user(); 