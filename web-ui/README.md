# 🏥 Sistema Digital de Anamnese - Web UI

Sistema moderno para gestão de questionários médicos, anamnese digital e CRM de pacientes.

## 🚀 Tecnologias

- **Framework:** Next.js 15.3+ com App Router
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Componentes:** Shadcn/ui + Radix UI
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth
- **Formulários:** React Hook Form + Zod
- **Estado:** Zustand
- **Testes:** Jest + Testing Library
- **Linting:** ESLint + Prettier
- **CI/CD:** GitHub Actions

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn
- Conta no Supabase
- Git

## ⚡ Início Rápido

### 1. Clone o repositório

```bash
git clone <repository-url>
cd vitalia-app/web-ui
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações do Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase

### 4. Execute as migrações do banco

```bash
npm run db:migrate
```

### 5. Gere os tipos TypeScript

```bash
npm run db:types
```

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 🛠️ Scripts Disponíveis

### Desenvolvimento

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run type-check` - Verifica tipos TypeScript

### Qualidade de Código

- `npm run lint` - Executa ESLint
- `npm run lint:fix` - Corrige problemas do ESLint automaticamente
- `npm run format` - Formata código com Prettier
- `npm run format:check` - Verifica formatação

### Testes

- `npm test` - Executa todos os testes
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:coverage` - Executa testes com relatório de cobertura
- `npm run test:ci` - Executa testes para CI/CD

### Banco de Dados

- `npm run db:types` - Gera tipos TypeScript do Supabase
- `npm run db:migrate` - Executa migrações
- `npm run db:reset` - Reseta o banco de dados

### Deploy

- `npm run deploy` - Deploy para desenvolvimento
- `npm run deploy:staging` - Deploy para staging
- `npm run deploy:production` - Deploy para produção

## 🧪 Executando Testes

O projeto usa Jest e Testing Library para testes unitários e de integração.

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

### Estrutura de Testes

- Testes unitários ficam ao lado dos arquivos que testam
- Use a extensão `.test.tsx` ou `.spec.tsx`
- Testes de componentes devem verificar acessibilidade
- Mocks estão configurados no `jest.setup.js`

## 📁 Estrutura do Projeto

```
web-ui/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── (auth)/            # Grupo de rotas de autenticação
│   │   ├── (dashboard)/       # Grupo de rotas do dashboard
│   │   ├── api/               # API Routes
│   │   └── public/            # Páginas públicas
│   ├── components/            # Componentes React
│   │   ├── ui/                # Componentes base (Shadcn/ui)
│   │   ├── form/              # Componentes de formulário
│   │   ├── facial/            # Componentes do mapa facial
│   │   └── ...
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilitários e configurações
│   │   ├── supabase/          # Cliente Supabase
│   │   ├── validations/       # Schemas Zod
│   │   └── utils/             # Funções utilitárias
│   ├── store/                 # Estados globais (Zustand)
│   └── types/                 # Definições de tipos
├── public/                    # Arquivos estáticos
├── scripts/                   # Scripts de automação
└── ...
```

## 🔧 Configuração do Supabase

### 1. Crie um novo projeto no Supabase

### 2. Execute as migrações

```bash
npx supabase migration up
```

### 3. Configure Row Level Security (RLS)

As políticas RLS estão definidas nas migrações e garantem:

- Isolamento de dados por organização/médico
- Acesso controlado a informações de pacientes
- Segurança de uploads de arquivos

### 4. Configure Storage

Buckets configurados:

- `medical-images` - Imagens médicas
- `patient-documents` - Documentos de pacientes
- `avatars` - Fotos de perfil

## 🚀 Deploy

### Deploy Automático (CI/CD)

O projeto usa GitHub Actions para CI/CD automático:

- **Push para `develop`**: Deploy para staging
- **Push para `main/master`**: Deploy para produção

### Deploy Manual

```bash
# Staging
npm run deploy:staging

# Produção
npm run deploy:production
```

### Variáveis de Ambiente para Produção

Configure no seu provedor de hosting:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## 🔒 Segurança

- **Autenticação:** Supabase Auth com JWT
- **Autorização:** Row Level Security (RLS)
- **Validação:** Zod schemas em frontend e backend
- **Sanitização:** Inputs sanitizados automaticamente
- **HTTPS:** Obrigatório em produção
- **CORS:** Configurado adequadamente

## 📊 Monitoramento

- **Logging:** Console em desenvolvimento, estruturado em produção
- **Métricas:** Supabase Dashboard
- **Erros:** Sentry (opcional)
- **Analytics:** Google Analytics (opcional)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Convenções

- Use Conventional Commits
- Mantenha cobertura de testes > 70%
- Siga os padrões do ESLint/Prettier
- Documente componentes complexos

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

- **Documentação:** [docs/](./docs/)
- **Issues:** GitHub Issues
- **Discussões:** GitHub Discussions

---

**Desenvolvido com ❤️ para profissionais da saúde**
