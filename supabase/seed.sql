-- Dados iniciais para o banco de perguntas
-- Perguntas gerais de anamnese

INSERT INTO questions_bank (question_text, question_type, category, specialty, is_default) VALUES
-- Identificação e dados pessoais
('Qual é a sua idade?', 'text', 'Identificação', 'Geral', true),
('Qual é o seu estado civil?', 'radio', 'Identificação', 'Geral', true),
('Qual é a sua profissão?', 'text', 'Identificação', 'Geral', true),
('Possui filhos? Quantos?', 'text', 'Identificação', 'Geral', true),

-- História médica geral
('Possui alguma doença crônica?', 'yes_no', 'História Médica', 'Geral', true),
('Faz uso de medicamentos regularmente?', 'yes_no', 'História Médica', 'Geral', true),
('Possui alergias conhecidas?', 'yes_no', 'História Médica', 'Geral', true),
('Já passou por cirurgias anteriores?', 'yes_no', 'História Médica', 'Geral', true),
('Possui histórico familiar de doenças?', 'text', 'História Médica', 'Geral', true),
('Pratica atividades físicas regularmente?', 'yes_no', 'Estilo de Vida', 'Geral', true),

-- Medicina Estética
('Qual é a sua principal queixa estética?', 'text', 'Queixa Principal', 'Estética', true),
('Há quanto tempo você tem essa preocupação?', 'radio', 'Queixa Principal', 'Estética', true),
('Já realizou algum procedimento estético anteriormente?', 'yes_no', 'História Estética', 'Estética', true),
('Qual é o resultado que você espera alcançar?', 'text', 'Expectativas', 'Estética', true),
('Como você classifica sua autoestima em relação à aparência?', 'scale', 'Psicológico', 'Estética', true),

-- Dermatologia
('Possui histórico de câncer de pele na família?', 'yes_no', 'História Familiar', 'Dermatologia', true),
('Faz uso de protetor solar diariamente?', 'yes_no', 'Cuidados', 'Dermatologia', true),
('Já teve alguma lesão de pele suspeita?', 'yes_no', 'História Dermatológica', 'Dermatologia', true),
('Possui pintas que mudaram de cor ou tamanho?', 'yes_no', 'Sintomas', 'Dermatologia', true),
('Qual é o seu tipo de pele?', 'radio', 'Características', 'Dermatologia', true),

-- Ginecologia
('Data da última menstruação?', 'date', 'Ciclo Menstrual', 'Ginecologia', true),
('Ciclo menstrual é regular?', 'yes_no', 'Ciclo Menstrual', 'Ginecologia', true),
('Já esteve grávida?', 'yes_no', 'História Obstétrica', 'Ginecologia', true),
('Faz uso de métodos contraceptivos?', 'yes_no', 'Contracepção', 'Ginecologia', true),
('Data do último exame preventivo?', 'date', 'Exames', 'Ginecologia', true),

-- Ortopedia
('Sente dores nas articulações?', 'yes_no', 'Sintomas', 'Ortopedia', true),
('Já sofreu alguma fratura?', 'yes_no', 'História Traumática', 'Ortopedia', true),
('Pratica esportes regularmente?', 'yes_no', 'Atividade Física', 'Ortopedia', true),
('Sente limitação de movimento em alguma articulação?', 'yes_no', 'Funcionalidade', 'Ortopedia', true),
('Classifique sua dor atual de 0 a 10', 'scale', 'Dor', 'Ortopedia', true),

-- Cardiologia
('Possui histórico familiar de problemas cardíacos?', 'yes_no', 'História Familiar', 'Cardiologia', true),
('Sente dor no peito?', 'yes_no', 'Sintomas', 'Cardiologia', true),
('Tem falta de ar ao fazer esforços?', 'yes_no', 'Sintomas', 'Cardiologia', true),
('Possui pressão alta?', 'yes_no', 'Fatores de Risco', 'Cardiologia', true),
('É fumante ou ex-fumante?', 'radio', 'Fatores de Risco', 'Cardiologia', true);

-- Atualizar as perguntas com opções para radio buttons
UPDATE questions_bank SET options = jsonb_build_array(
  jsonb_build_object('value', 'solteiro', 'label', 'Solteiro(a)'),
  jsonb_build_object('value', 'casado', 'label', 'Casado(a)'),
  jsonb_build_object('value', 'divorciado', 'label', 'Divorciado(a)'),
  jsonb_build_object('value', 'viuvo', 'label', 'Viúvo(a)')
) WHERE question_text = 'Qual é o seu estado civil?';

UPDATE questions_bank SET options = jsonb_build_array(
  jsonb_build_object('value', 'menos_6_meses', 'label', 'Menos de 6 meses'),
  jsonb_build_object('value', '6_meses_1_ano', 'label', '6 meses a 1 ano'),
  jsonb_build_object('value', '1_3_anos', 'label', '1 a 3 anos'),
  jsonb_build_object('value', 'mais_3_anos', 'label', 'Mais de 3 anos')
) WHERE question_text = 'Há quanto tempo você tem essa preocupação?';

UPDATE questions_bank SET options = jsonb_build_array(
  jsonb_build_object('value', 'oleosa', 'label', 'Oleosa'),
  jsonb_build_object('value', 'seca', 'label', 'Seca'),
  jsonb_build_object('value', 'mista', 'label', 'Mista'),
  jsonb_build_object('value', 'normal', 'label', 'Normal'),
  jsonb_build_object('value', 'sensivel', 'label', 'Sensível')
) WHERE question_text = 'Qual é o seu tipo de pele?';

UPDATE questions_bank SET options = jsonb_build_array(
  jsonb_build_object('value', 'nunca_fumou', 'label', 'Nunca fumou'),
  jsonb_build_object('value', 'fumante_atual', 'label', 'Fumante atual'),
  jsonb_build_object('value', 'ex_fumante', 'label', 'Ex-fumante')
) WHERE question_text = 'É fumante ou ex-fumante?';

-- Configurar escalas para perguntas tipo scale
UPDATE questions_bank SET options = jsonb_build_object(
  'min', 1,
  'max', 10,
  'step', 1,
  'labels', jsonb_build_object('1', 'Muito baixa', '10', 'Muito alta')
) WHERE question_text = 'Como você classifica sua autoestima em relação à aparência?';

UPDATE questions_bank SET options = jsonb_build_object(
  'min', 0,
  'max', 10,
  'step', 1,
  'labels', jsonb_build_object('0', 'Sem dor', '10', 'Dor insuportável')
) WHERE question_text = 'Classifique sua dor atual de 0 a 10';

-- Inserir uma organização exemplo
INSERT INTO organizations (name, cnpj, address, phone, email) VALUES
('Clínica Exemplo', '12.345.678/0001-90', 
 jsonb_build_object(
   'street', 'Rua das Flores, 123',
   'city', 'São Paulo',
   'state', 'SP',
   'zip_code', '01234-567'
 ), 
 '(11) 1234-5678', 'contato@clinicaexemplo.com.br');

-- Comentários para facilitar a manutenção
COMMENT ON TABLE questions_bank IS 'Banco de perguntas pré-definidas e personalizadas';
COMMENT ON COLUMN questions_bank.is_default IS 'Indica se a pergunta é padrão do sistema (true) ou personalizada pelo médico (false)';
COMMENT ON COLUMN questions_bank.options IS 'Configurações específicas do tipo de pergunta (opções para radio/checkbox, configurações para scale, etc.)';
COMMENT ON TABLE public_links IS 'Links únicos gerados para pacientes responderem questionários sem login';
COMMENT ON COLUMN public_links.token IS 'Token único e seguro para acesso ao questionário';
COMMENT ON COLUMN public_links.expires_at IS 'Data/hora de expiração do link';
COMMENT ON COLUMN public_links.is_used IS 'Indica se o link já foi utilizado (para links de uso único)'; 