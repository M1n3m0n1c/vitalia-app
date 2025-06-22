# 🏥 Supabase - Sistema Digital de Anamnese

Este diretório contém todas as configurações e migrações do banco de dados Supabase para o Sistema Digital de Anamnese.

## 📋 Estrutura do Projeto

```
supabase/
├── migrations/
│   ├── 20250101000001_initial_schema.sql    # Schema inicial do banco
│   ├── 20250101000002_setup_rls.sql         # Configuração de RLS
│   └── 20250101000003_setup_storage.sql     # Configuração de Storage
├── seed.sql                                 # Dados iniciais
└── README.md                               # Este arquivo
```

## 🚀 Configuração Inicial

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha um nome para o projeto
5. Defina uma senha segura para o banco
6. Selecione a região mais próxima

### 2. Configurar Variáveis de Ambiente

1. Copie o arquivo `web-ui/env.example.txt` para `web-ui/.env.local`
2. Preencha as variáveis com os dados do seu projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Onde encontrar as chaves:**
- Vá para Settings → API no dashboard do Supabase
- Copie a **Project URL** e as chaves **anon** e **service_role**

### 3. Executar Migrações

Você pode executar as migrações de duas formas:

#### Opção A: Via Dashboard do Supabase
1. Acesse o dashboard do seu projeto
2. Vá para "SQL Editor"
3. Execute os arquivos na ordem:
   - `20250101000001_initial_schema.sql`
   - `20250101000002_setup_rls.sql`
   - `20250101000003_setup_storage.sql`
4. Execute o arquivo `seed.sql` para dados iniciais

#### Opção B: Via CLI (Recomendado)
```bash
# Instalar CLI do Supabase
npm install -g supabase

# Fazer login
supabase login

# Conectar ao projeto
supabase link --project-ref your-project-id

# Executar migrações
supabase db push

# Executar seed
supabase db seed
```

## 🗃️ Estrutura do Banco de Dados

### Tabelas Principais

- **users** - Médicos e administradores
- **organizations** - Clínicas e organizações
- **patients** - Dados dos pacientes
- **questions_bank** - Banco de perguntas pré-definidas
- **questionnaires** - Questionários criados pelos médicos
- **responses** - Respostas dos pacientes
- **medical_notes** - Anotações médicas
- **medical_images** - Imagens médicas
- **appointments** - Agenda médica
- **public_links** - Links públicos para questionários

### Storage Buckets

- **medical-images** - Imagens médicas (privado, 50MB max)
- **patient-documents** - Documentos dos pacientes (privado, 10MB max)
- **avatars** - Fotos de perfil (público, 2MB max)

## 🔐 Segurança (RLS)

Todas as tabelas possuem Row Level Security (RLS) habilitado:

- **Médicos** só podem acessar seus próprios dados
- **Pacientes** só podem responder questionários via links válidos
- **Organizações** são isoladas entre si
- **Storage** possui políticas específicas por bucket

## 📊 Dados Iniciais

O arquivo `seed.sql` inclui:

- **40+ perguntas pré-definidas** organizadas por especialidade:
  - Medicina Geral
  - Medicina Estética
  - Dermatologia
  - Ginecologia
  - Ortopedia
  - Cardiologia
- **Organização exemplo** para testes
- **Configurações de tipos de pergunta** (radio, scale, etc.)

## 🛠️ Scripts Úteis

No diretório `web-ui/`, você pode usar:

```bash
# Gerar tipos TypeScript atualizados
npm run db:types

# Resetar banco (desenvolvimento)
npm run db:reset

# Aplicar migrações
npm run db:migrate
```

## 📝 Tipos de Pergunta Suportados

1. **text** - Texto livre
2. **radio** - Escolha única
3. **checkbox** - Múltipla escolha
4. **scale** - Escala numérica (1-10)
5. **date** - Data/hora
6. **file** - Upload de arquivo
7. **yes_no** - Sim/Não/Não sei
8. **slider** - Escala visual

## 🔄 Atualizações

Para atualizar os tipos TypeScript após mudanças no banco:

```bash
cd web-ui
npm run db:types
```

## 🐛 Troubleshooting

### Erro de Conexão
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto existe no Supabase
- Teste a conexão no dashboard

### Problemas de Permissão
- Verifique se o RLS está configurado corretamente
- Confirme se o usuário está autenticado
- Teste as políticas no SQL Editor

### Storage não Funciona
- Verifique se os buckets foram criados
- Confirme as políticas de storage
- Teste upload via dashboard

## 📞 Suporte

Para problemas específicos:

1. Verifique os logs no dashboard do Supabase
2. Consulte a [documentação oficial](https://supabase.com/docs)
3. Abra uma issue no repositório do projeto

---

**Última atualização:** Janeiro 2025  
**Versão do Schema:** 1.0.0 