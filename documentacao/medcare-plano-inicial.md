# PLANO_DETALHADO - Sistema Digital de Anamnese e Gestão Clínica


---

## 1. VISÃO GERAL

Plataforma web para médicos e clínicas, focada em anamnese digital, CRM de pacientes, gestão de agenda integrada, geração e comparação de questionários médicos, e banco de imagens clínicas. Preparada para compliance com LGPD em fase futura. Arquitetura escalável e flexível para diferentes portes de clínicas e especialidades médicas.

---

## 2. REQUISITOS_DE_NEGÓCIO

### 2.1. Modelo de Negócio e Licenciamento

**Estrutura Organizacional:**

- **Licenciamento Individual:** Cada médico possui uma licença própria
- **Clínicas Multi-profissionais:** Médicos de uma mesma clínica podem compartilhar base de pacientes
- **Isolamento de Dados:** Consultas e anotações médicas são privadas por médico
- **Escalabilidade:** Estrutura preparada para facilitar venda futura da startup


### 2.2. Tipos de Usuários e Responsabilidades

| Papel | Responsabilidades | Permissões |
| :-- | :-- | :-- |
| **Administrador do Sistema** | Gerenciar licenças e faturamento, configurar integrações globais, monitorar uso e performance, suporte técnico avançado | Acesso total ao sistema |
| **Administrador da Clínica** | Gerenciar médicos da clínica, configurar dados da clínica, relatórios consolidados (sem dados sensíveis), gerenciar secretárias | Gestão da organização |
| **Médico Principal** | Todas as funcionalidades médicas, gerenciar questionários personalizados, acesso total aos próprios pacientes, configurar agenda e integrações | Dados próprios + compartilhados |
| **Secretária/Assistente** | Gerenciar agenda dos médicos, cadastrar pacientes (dados básicos), enviar questionários para pacientes, visualizar agenda e contatos (sem dados médicos) | Acesso administrativo limitado |
| **Paciente** | Responder questionários via link único | Acesso via token único, sem login |

### 2.3. Funcionalidades Principais

**1. CRM de Pacientes Avançado**

- Cadastro completo com dados pessoais, histórico médico e documentos
- Histórico médico completo e cronológico
- Alertas de medicamentos e alergias

**2. Sistema de Anamnese Digital**

- Criação de questionários personalizados
- Banco de perguntas categorizadas por especialidade/finalidade
- Envio via link único (sem necessidade de login do paciente)

**3. Gestão de Consultas**

- Anotações médicas organizadas por data e tipo de consulta
- Upload de arquivos e documentos
- Histórico completo de consultas por paciente

**4. Agenda Inteligente**

- Sincronização bidirecional com Google Calendar e iOS Calendar
- Gestão de horários por médico
- Notificações automáticas

**5. Comparação Temporal**

- Visualização lado a lado de até 3 questionários do mesmo paciente
- Análise de evolução temporal
- Anotações médicas em cada resposta
- As anotações devem ser consolidas por paciente/pergunta e não por questionario

**6. Banco de Imagens Médicas**

- Upload categorizado (antes, depois, controle, diagnóstico)
- Anotações em imagens
- Comparação temporal de imagens
- Busca por tags e região corporal


### 2.4. Sistema de Questionários Detalhado

**Tipos de Perguntas Suportadas:**


| Tipo | Usabilidade | Exemplo |
| :-- | :-- | :-- |
| **Escolha Única** | Sintomas, histórico familiar, medicamentos | "Qual tipo de dor de cabeça?" (Enxaqueca, Tensional, Sinusite) |
| **Texto Livre** | Descrição de sintomas, histórico detalhado | "Descreva como iniciaram os sintomas" |
| **Escala Numérica (1-10)** | Intensidade da dor, qualidade do sono | "De 1 a 10, qual a intensidade da dor?" |
| **Escala Visual (VAS)** | Dor, ansiedade, satisfação | Slider visual com emojis ou cores |
| **Data/Hora** | Início dos sintomas, última medicação | "Quando iniciaram os sintomas?" |
| **Upload de Imagens** | Lesões de pele, exames, receitas | Upload JPG/PNG com compressão automática |
| **Escolha Múltipla** | Sintomas simultâneos, medicamentos em uso | "Quais sintomas você apresenta?" (várias opções) |
| **Sim/Não/Não Sei** | Histórico familiar, alergias | "Tem histórico de diabetes na família?" |

**Banco de Perguntas Pré-definidas:**

- Categorização por especialidade médica/finalidade (Geral, Sintomas, dermatologia, cardiologia, ortopedia, etc.)
- Sistema de tags para facilitar busca
- Médicos podem criar perguntas personalizadas
- Sistema de favoritos para perguntas mais utilizadas


### 2.5. APIs para Integração Externa

**APIs REST Disponibilizadas:**

```
# API de Agendamento
POST /api/appointments - Criar agendamento
GET /api/appointments/{doctor_id} - Listar agenda
PUT /api/appointments/{id} - Atualizar agendamento
DELETE /api/appointments/{id} - Cancelar agendamento

# API de CRM
POST /api/patients - Cadastrar paciente
GET /api/patients/{doctor_id} - Listar pacientes
PUT /api/patients/{id} - Atualizar dados
GET /api/patients/{id}/history - Histórico médico

# API de Questionários
POST /api/questionnaires - Criar questionário
GET /api/questionnaires/{id}/responses - Respostas
POST /api/questionnaires/{id}/send - Enviar para paciente
GET /api/responses/{patient_id} - Respostas do paciente

# API de Relatórios
GET /api/reports/patient/{id} - Relatório do paciente
GET /api/reports/questionnaire/{id} - Análise questionário
POST /api/reports/custom - Relatório personalizado
```


---

## 3. REQUISITOS_DE_DESENVOLVIMENTO

### 3.1. Stack Tecnológica

| Camada | Tecnologias |
| :-- | :-- |
| **Frontend Web** | Next.js 14+, React 18, TypeScript, Tailwind CSS |
| **Backend** | Supabase (PostgreSQL + Edge Functions) |
| **Autenticação** | Supabase Auth com Row Level Security (RLS) |
| **Storage** | Supabase Storage para documentos e imagens médicas |
| **Estado Global** | Zustand ou Redux Toolkit |
| **Formulários** | React Hook Form com Zod para validação |
| **UI Components** | Shadcn/ui ou Mantine |
| **Calendário** | React Big Calendar com integração Google Calendar API |
| **Monitoramento** | Sentry para erros, Analytics anonimizadas |
| **Performance** | Redis para cache, CDN para assets |

### 3.2. Arquitetura de Banco de Dados (ERD)

```sql
-- Organizações/Clínicas
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cnpj VARCHAR(14) UNIQUE,
  address JSONB,
  license_plan VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Usuários do Sistema
CREATE TABLE users (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) CHECK (user_type IN ('admin', 'medico', 'secretaria')),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Especialidades Médicas
CREATE TABLE specialties (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Médicos
CREATE TABLE doctors (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  crm VARCHAR(15) NOT NULL,
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Relação Médico-Especialidade (Many-to-Many)
CREATE TABLE doctor_specialties (
  doctor_id UUID REFERENCES doctors(id),
  specialty_id UUID REFERENCES specialties(id),
  PRIMARY KEY (doctor_id, specialty_id)
);

-- Pacientes
CREATE TABLE patients (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  full_name VARCHAR(255) NOT NULL,
  birth_date DATE,
  gender VARCHAR(20),
  cpf VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(255),
  address JSONB,
  health_insurance_number VARCHAR(50),
  lgpd_consent BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Banco de Perguntas
CREATE TABLE question_bank (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  question_type VARCHAR(30) CHECK (question_type IN ('multipla_escolha', 'texto_livre', 'escala_numerica', 'escala_visual', 'data_hora', 'upload_imagem', 'selecao_multipla', 'sim_nao')),
  options JSONB,
  category VARCHAR(100),
  tags VARCHAR(100)[],
  created_by UUID REFERENCES users(id),
  public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Relação Pergunta-Especialidade (Many-to-Many)
CREATE TABLE question_specialties (
  question_id UUID REFERENCES question_bank(id),
  specialty_id UUID REFERENCES specialties(id),
  PRIMARY KEY (question_id, specialty_id)
);

-- Questionários
CREATE TABLE questionnaires (
  id UUID PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  questions UUID[], -- array de question_bank.id
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Respostas dos Questionários
CREATE TABLE questionnaire_responses (
  id UUID PRIMARY KEY,
  questionnaire_id UUID REFERENCES questionnaires(id),
  patient_id UUID REFERENCES patients(id),
  doctor_id UUID REFERENCES doctors(id),
  access_token VARCHAR(100) UNIQUE NOT NULL,
  answers JSONB NOT NULL,
  doctor_notes JSONB,
  response_date TIMESTAMP,
  ip_origin VARCHAR(45),
  device_fingerprint VARCHAR(64),
  user_agent TEXT,
  status VARCHAR(20) CHECK (status IN ('pendente', 'completo', 'expirado')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Consultas Médicas
CREATE TABLE consultations (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  doctor_id UUID REFERENCES doctors(id),
  appointment_date TIMESTAMP,
  consultation_type VARCHAR(50),
  doctor_notes TEXT,
  attached_files VARCHAR(500)[],
  status VARCHAR(20) CHECK (status IN ('agendada', 'realizada', 'cancelada')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Imagens Médicas
CREATE TABLE medical_images (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  doctor_id UUID REFERENCES doctors(id),
  category VARCHAR(50) CHECK (category IN ('antes', 'depois', 'controle', 'diagnóstico')),
  body_part VARCHAR(100),
  description TEXT,
  tags VARCHAR(100)[],
  storage_path VARCHAR(500) NOT NULL,
  capture_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Anotações em Imagens
CREATE TABLE image_annotations (
  id UUID PRIMARY KEY,
  image_id UUID REFERENCES medical_images(id),
  coordinates JSONB NOT NULL,
  annotation_text TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agenda/Agendamentos
CREATE TABLE appointments (
  id UUID PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id),
  patient_id UUID REFERENCES patients(id),
  title VARCHAR(255),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  google_event_id VARCHAR(100),
  status VARCHAR(20) CHECK (status IN ('agendada', 'realizada', 'cancelada')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Logs de Auditoria (para LGPD futura)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100),
  affected_table VARCHAR(50),
  previous_data JSONB,
  new_data JSONB,
  ip_origin VARCHAR(45),
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chaves de API para Integrações
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  name VARCHAR(100),
  key_hash VARCHAR(255),
  permissions VARCHAR(50)[],
  active BOOLEAN DEFAULT TRUE,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```


### 3.3. Segurança e Compliance (Backlog LGPD)

**Medidas de Segurança Planejadas:**

**1. Criptografia (Fase Pós-MVP)**

- Dados em trânsito: TLS 1.3
- Dados em repouso: AES-256
- Chaves gerenciadas pelo Supabase Vault

**2. Controle de Acesso**

- Row Level Security (RLS) no PostgreSQL
- Autenticação multi-fator (planejada)
- Sessões com timeout automático

**3. Auditoria e Logs**

- Log de todos os acessos a dados sensíveis
- Rastreabilidade de modificações
- Backup automático com retenção configurável

**4. Compliance LGPD (Backlog)**

- Consentimento explícito para coleta de dados
- Direito ao esquecimento (exclusão de dados)
- Portabilidade de dados (exportação)
- Relatório de impacto à proteção de dados

**Justificativa do Campo ip_origin:**

- Detecção de acesso suspeito (geolocalização incomum)
- Rastreabilidade de acesso a dados sensíveis para compliance
- Correlação com logs de auditoria para investigações

---

## 4. FLUXOS DE TRABALHO PRINCIPAIS

### 4.1. Criação de Questionário personalizado

```
Médico → Seleciona questões do banco → Personaliza → Salva Questionário. 
```

### 4.2. Envio de Questionário
```
Seleciona questinario já criado → Gera link único → Envia para paciente → Paciente responde → Dados armazenados
```
### 4.3. Comparação Temporal de Respostas

```
Médico → Seleciona paciente → Escolhe até 3 questionários → Sistema exibe lado a lado → Médico faz anotações → Anotações salvas
```


### 4.4. Gestão de Imagens Médicas

```
Upload de imagem → Categorização automática → Adição de tags → Anotações → Comparação temporal → Relatórios visuais
```


### 4.5. Integração de Agenda

```
Evento criado no sistema → Sincronização com Google/iOS → Notificações automáticas → Atualização bidirecional
```

### 4.5. Fluxo de Trabalho de Extração informaçoes de exames
```
Upload do exame pelo paciente → Processamento OCR → Extração e validação automática de dados → Armazenamento no perfil do paciente
```

---

## 5. ROADMAP DE IMPLEMENTAÇÃO

| Fase | Funcionalidades | Prazo Estimado |
| :-- | :-- | :-- |
| **MVP (Fase 1)** | Cadastro de usuários e pacientes, questionários básicos, agenda, comparação de respostas, sistema de imagens médicas, APIs externas, integrações Google/iOS | 9 meses |
| **Funcionalidade Avançada: Extração de Dados Clínicos por OCR (Fase 2)** | Processamento automático de exames, extração de dados estruturados, validação de informações, integração com prontuário | +3 meses |
| **LGPD e Segurança (Fase 3)** | Criptografia, consentimento digital, auditoria completa, anonimização | +3 meses |
| **Expansão (Fase 4)** | Marketplace de templates, telemedicina, analytics avançados, IA | Contínuo |


### 6.1. Funcionalidade Avançada: Extração de Dados Clínicos por OCR
Permitir aos pacientes fazer upload de exames médicos em formatos JPG, PNG ou PDF. A aplicação extrairá automaticamente dados clínicos específicos configurados previamente pelos médicos.

### 6.2. Requisitos
- Suporte aos formatos: JPG, PNG, PDF
- Extração automática utilizando OCR (Reconhecimento Óptico de Caracteres)
- Capacidade de definir parâmetros específicos por profissional médico (ex.: níveis de Zinco, Cálcio, Testosterona, Selênio, etc.)
- Configuração flexível no painel administrativo para definir quais elementos devem ser extraídos de cada exame

### 6.3. Tecnologias e Ferramentas Sugeridas
- **OCR:** Tesseract OCR, Google Vision API ou AWS Textract
- **Análise Semântica:** OpenAI GPT API ou Hugging Face Transformers
- **Pré-processamento:** OpenCV ou Pillow para manipulação e melhoria de imagens
- **Armazenamento:** Supabase Storage e PostgreSQL

### 6.4. Validação e Confirmação Humana
- Implementar interface para validação manual de resultados automáticos (especialmente relevante para dados críticos)
- Notificações automáticas para os médicos quando novos exames forem processados e precisarem de validação manual