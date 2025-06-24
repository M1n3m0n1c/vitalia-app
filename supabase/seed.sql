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

-- Seed de pacientes de exemplo
-- Nota: Este seed deve ser executado apenas após ter um médico cadastrado no sistema
-- Para usar este seed, substitua 'SEU_DOCTOR_ID_AQUI' pelo ID real do médico
/*
INSERT INTO patients (
  full_name, 
  email, 
  phone, 
  cpf, 
  birth_date, 
  gender, 
  address, 
  medical_history, 
  doctor_id
) VALUES 
-- Paciente 1 - Ana Silva
(
  'Ana Silva Santos',
  'ana.silva@email.com',
  '(11) 98765-4321',
  '123.456.789-10',
  '1985-03-15',
  'female',
  jsonb_build_object(
    'street', 'Rua das Palmeiras, 456',
    'city', 'São Paulo',
    'state', 'SP',
    'zip_code', '01234-567',
    'neighborhood', 'Vila Madalena'
  ),
  'Paciente com histórico de hipertensão controlada. Faz uso de Losartana 50mg/dia. Sem alergias conhecidas.',
  'SEU_DOCTOR_ID_AQUI'
),

-- Paciente 2 - João Oliveira
(
  'João Carlos Oliveira',
  'joao.oliveira@gmail.com',
  '(11) 99876-5432',
  '987.654.321-00',
  '1978-07-22',
  'male',
  jsonb_build_object(
    'street', 'Av. Paulista, 1000 - Apto 15B',
    'city', 'São Paulo',
    'state', 'SP',
    'zip_code', '01310-100',
    'neighborhood', 'Bela Vista'
  ),
  'Histórico de diabetes tipo 2. Controle glicêmico adequado com Metformina. Pratica caminhada regularmente.',
  'SEU_DOCTOR_ID_AQUI'
),

-- Paciente 3 - Maria Fernanda
(
  'Maria Fernanda Costa',
  'mariafernanda@hotmail.com',
  '(11) 97654-3210',
  '456.789.123-45',
  '1992-11-08',
  'female',
  jsonb_build_object(
    'street', 'Rua Augusta, 789',
    'city', 'São Paulo',
    'state', 'SP',
    'zip_code', '01305-000',
    'neighborhood', 'Consolação'
  ),
  'Paciente jovem, sem comorbidades. Busca procedimentos estéticos preventivos. Histórico familiar de melasma.',
  'SEU_DOCTOR_ID_AQUI'
),

-- Paciente 4 - Carlos Eduardo
(
  'Carlos Eduardo Mendes',
  'carlos.mendes@empresa.com.br',
  '(11) 96543-2109',
  '789.123.456-78',
  '1970-05-30',
  'male',
  jsonb_build_object(
    'street', 'Rua Oscar Freire, 321',
    'city', 'São Paulo',
    'state', 'SP',
    'zip_code', '01426-001',
    'neighborhood', 'Jardins'
  ),
  'Executivo, 54 anos. Histórico de estresse e insônia. Interesse em tratamentos anti-aging. Ex-fumante há 5 anos.',
  'SEU_DOCTOR_ID_AQUI'
),

-- Paciente 5 - Beatriz Almeida
(
  'Beatriz Almeida Rodrigues',
  'bia.almeida@outlook.com',
  '(11) 95432-1098',
  '321.654.987-12',
  '1988-12-03',
  'female',
  jsonb_build_object(
    'street', 'Rua Haddock Lobo, 567',
    'city', 'São Paulo',
    'state', 'SP',
    'zip_code', '01414-001',
    'neighborhood', 'Cerqueira César'
  ),
  'Mãe de 2 filhos. Pós-gestacional, busca tratamentos para flacidez abdominal. Amamentou até recentemente.',
  'SEU_DOCTOR_ID_AQUI'
),

-- Paciente 6 - Roberto Santos
(
  'Roberto Santos Lima',
  'roberto.lima@yahoo.com.br',
  '(11) 94321-0987',
  '654.987.321-34',
  '1965-09-18',
  'male',
  jsonb_build_object(
    'street', 'Rua Teodoro Sampaio, 890',
    'city', 'São Paulo',
    'state', 'SP',
    'zip_code', '05405-000',
    'neighborhood', 'Pinheiros'
  ),
  'Aposentado, 59 anos. Histórico de câncer de pele (carcinoma basocelular) tratado. Acompanhamento dermatológico regular.',
  'SEU_DOCTOR_ID_AQUI'
),

-- Paciente 7 - Juliana Martins
(
  'Juliana Martins Pereira',
  'ju.martins@gmail.com',
  '(11) 93210-9876',
  '159.753.486-20',
  '1995-04-12',
  'female',
  jsonb_build_object(
    'street', 'Rua Consolação, 1234',
    'city', 'São Paulo',
    'state', 'SP',
    'zip_code', '01302-000',
    'neighborhood', 'Consolação'
  ),
  'Estudante de medicina, 29 anos. Acne adulta persistente. Já utilizou isotretinoína com boa resposta.',
  'SEU_DOCTOR_ID_AQUI'
),

-- Paciente 8 - Fernando Souza
(
  'Fernando Souza Barbosa',
  'fernando.sb@uol.com.br',
  '(11) 92109-8765',
  '753.159.486-57',
  '1982-01-25',
  'male',
  jsonb_build_object(
    'street', 'Av. Faria Lima, 2000 - Conj 45',
    'city', 'São Paulo',
    'state', 'SP',
    'zip_code', '01452-000',
    'neighborhood', 'Jardim Paulistano'
  ),
  'Advogado, 42 anos. Alopecia androgenética progressiva. Interesse em transplante capilar. Sem outras comorbidades.',
  'SEU_DOCTOR_ID_AQUI'
),

-- Paciente 9 - Camila Torres
(
  'Camila Torres Ribeiro',
  'camila.torres@designer.com',
  '(11) 91098-7654',
  '486.159.753-91',
  '1990-08-07',
  'female',
  jsonb_build_object(
    'street', 'Rua Bela Cintra, 678',
    'city', 'São Paulo',
    'state', 'SP',
    'zip_code', '01415-000',
    'neighborhood', 'Consolação'
  ),
  'Designer gráfica, 34 anos. Rosácea facial leve a moderada. Pele sensível. Evita exposição solar excessiva.',
  'SEU_DOCTOR_ID_AQUI'
),

-- Paciente 10 - Antônio Ferreira
(
  'Antônio Ferreira Neto',
  'antonio.neto@construcao.com.br',
  '(11) 90987-6543',
  '357.951.486-24',
  '1975-06-14',
  'male',
  jsonb_build_object(
    'street', 'Rua da Consolação, 2345',
    'city', 'São Paulo',
    'state', 'SP',
    'zip_code', '01301-000',
    'neighborhood', 'Centro'
  ),
  'Engenheiro civil, 49 anos. Exposição solar ocupacional intensa. Múltiplas queratoses actínicas. Histórico familiar de melanoma.',
  'SEU_DOCTOR_ID_AQUI'
);
*/

-- Comentários para facilitar a manutenção
COMMENT ON TABLE questions_bank IS 'Banco de perguntas pré-definidas e personalizadas';
COMMENT ON COLUMN questions_bank.is_default IS 'Indica se a pergunta é padrão do sistema (true) ou personalizada pelo médico (false)';
COMMENT ON COLUMN questions_bank.options IS 'Configurações específicas do tipo de pergunta (opções para radio/checkbox, configurações para scale, etc.)';
COMMENT ON TABLE public_links IS 'Links únicos gerados para pacientes responderem questionários sem login';
COMMENT ON COLUMN public_links.token IS 'Token único e seguro para acesso ao questionário';
COMMENT ON COLUMN public_links.expires_at IS 'Data/hora de expiração do link';
COMMENT ON COLUMN public_links.is_used IS 'Indica se o link já foi utilizado (para links de uso único)'; 