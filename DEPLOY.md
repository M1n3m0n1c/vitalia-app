# 🚀 Guia de Deploy - Sistema Digital de Anamnese

## Visão Geral

Este documento descreve o processo de deploy e configuração CI/CD para o Sistema Digital de Anamnese (Vitalia App).

## Ambientes

### 🧪 Staging
- **Branch:** `develop`
- **URL:** https://vitalia-staging.vercel.app
- **Banco:** Supabase Staging
- **Deploy:** Automático via GitHub Actions

### 🌐 Produção
- **Branch:** `main`
- **URL:** https://vitalia-app.vercel.app
- **Banco:** Supabase Production
- **Deploy:** Automático via GitHub Actions

## Configuração de Variáveis de Ambiente

### GitHub Secrets

Configure os seguintes secrets no repositório GitHub:

```bash
# Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_PROJECT_ID=your_project_id

# Supabase Staging
STAGING_SUPABASE_URL=https://your-staging-project.supabase.co
STAGING_SUPABASE_ANON_KEY=your_staging_anon_key

# Supabase Production
PRODUCTION_SUPABASE_URL=https://your-production-project.supabase.co
PRODUCTION_SUPABASE_ANON_KEY=your_production_anon_key

# Notificações (opcional)
SLACK_WEBHOOK=your_slack_webhook_url
```

### Arquivo .env.local (Desenvolvimento)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_local_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Pipeline CI/CD

### Workflow GitHub Actions

O pipeline é executado automaticamente em:
- Push para `main` → Deploy para produção
- Push para `develop` → Deploy para staging
- Pull requests → Testes e verificações

### Etapas do Pipeline

1. **Testes**
   - Verificação de tipos TypeScript
   - Linting do código
   - Execução de testes unitários
   - Build da aplicação

2. **Segurança**
   - Auditoria de dependências
   - Verificação de vulnerabilidades

3. **Deploy**
   - Build otimizado para ambiente
   - Deploy via Vercel
   - Notificações de status

## Deploy Manual

### Pré-requisitos

```bash
# Instalar dependências
cd web-ui
npm install

# Configurar Vercel CLI
npm install -g vercel
vercel login
```

### Deploy para Staging

```bash
npm run deploy:staging
```

### Deploy para Produção

```bash
npm run deploy:production
```

## Verificações Pré-Deploy

O script automaticamente executa:

1. ✅ Verificação de mudanças não commitadas
2. ✅ Verificação de tipos TypeScript
3. ✅ Linting do código
4. ✅ Execução de testes
5. ✅ Build da aplicação

## Estrutura de Branches

```
main (produção)
├── develop (staging)
│   ├── feature/auth-system
│   ├── feature/questionnaire-builder
│   └── feature/patient-management
└── hotfix/critical-bug-fix
```

### Fluxo de Trabalho

1. Desenvolva features em branches `feature/*`
2. Merge para `develop` → Deploy automático para staging
3. Teste no ambiente de staging
4. Merge `develop` → `main` → Deploy para produção

## Monitoramento e Logs

### Vercel Dashboard
- Logs de build e runtime
- Métricas de performance
- Analytics de uso

### Supabase Dashboard
- Logs de banco de dados
- Métricas de API
- Monitoramento de autenticação

### Relatórios de Deploy

Os deploys geram relatórios automáticos em `web-ui/deploy-reports/`:

```json
{
  "environment": "Produção",
  "timestamp": "2025-06-22T16:30:00.000Z",
  "duration": "3.5 minutos",
  "url": "https://vitalia-app.vercel.app",
  "branch": "main",
  "commit": "abc123ef",
  "version": "1.0.0"
}
```

## Rollback

### Rollback via Vercel

```bash
# Listar deployments
vercel ls

# Fazer rollback para deployment anterior
vercel rollback [deployment-url]
```

### Rollback via GitHub

1. Identifique o commit estável anterior
2. Crie um revert commit
3. Push para a branch principal

## Troubleshooting

### Erro de Build

```bash
# Verificar logs localmente
npm run build

# Verificar tipos
npm run type-check

# Executar testes
npm run test
```

### Erro de Deploy

1. Verifique as variáveis de ambiente
2. Confirme que o Vercel token está válido
3. Verifique os logs no dashboard do Vercel

### Problemas de Banco

1. Verifique as migrações do Supabase
2. Confirme as políticas RLS
3. Teste as conexões localmente

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev                 # Servidor local
npm run build              # Build de produção
npm run start              # Servidor de produção

# Qualidade de Código
npm run lint               # Verificar linting
npm run lint:fix           # Corrigir linting
npm run type-check         # Verificar tipos
npm run format             # Formatar código

# Testes
npm run test               # Executar testes
npm run test:watch         # Testes em modo watch
npm run test:coverage      # Testes com coverage

# Deploy
npm run deploy:staging     # Deploy para staging
npm run deploy:production  # Deploy para produção

# Banco de Dados
npm run db:types           # Gerar tipos do Supabase
npm run db:migrate         # Executar migrações
npm run db:reset           # Reset do banco local
```

## Segurança

### Checklist de Segurança

- [ ] Variáveis de ambiente configuradas corretamente
- [ ] Secrets do GitHub protegidos
- [ ] Políticas RLS ativas no Supabase
- [ ] HTTPS habilitado em produção
- [ ] Headers de segurança configurados
- [ ] Auditoria de dependências executada

### Boas Práticas

1. **Nunca** commite secrets no código
2. Use diferentes bancos para staging/produção
3. Monitore logs de segurança regularmente
4. Mantenha dependências atualizadas
5. Execute auditorias de segurança periodicamente

## Suporte

Para problemas relacionados ao deploy:

1. Verifique os logs do GitHub Actions
2. Consulte o dashboard do Vercel
3. Revise este documento
4. Abra uma issue no repositório

---

**Última atualização:** 22 de Junho de 2025
**Versão:** 1.0.0 