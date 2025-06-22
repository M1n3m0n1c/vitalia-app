# 📋 Tarefas - PRD MVP Sistema Digital de Anamnese

## Arquivos Relevantes

- `web-ui/src/app/(auth)/login/page.tsx` - Página de login com formulário de autenticação
- `web-ui/src/app/(auth)/register/page.tsx` - Página de registro de novos médicos
- `web-ui/src/app/(dashboard)/patients/page.tsx` - Listagem e gestão de pacientes (CRM)
- `web-ui/src/app/(dashboard)/questionnaires/page.tsx` - Builder e gestão de questionários
- `web-ui/src/app/(dashboard)/questionnaires/builder/page.tsx` - Interface drag-and-drop para criação de questionários
- `web-ui/src/app/(dashboard)/facial-complaints/page.tsx` - Formulário de queixas estéticas com SVG interativo
- `web-ui/src/app/(dashboard)/comparison/page.tsx` - Interface de comparação temporal de questionários
- `web-ui/src/app/(dashboard)/images/page.tsx` - Banco de imagens médicas
- `web-ui/src/app/(dashboard)/calendar/page.tsx` - Agenda médica
- `web-ui/src/app/api/questionnaires/[id]/route.ts` - API para CRUD de questionários
- `web-ui/src/app/api/patients/route.ts` - API para gestão de pacientes
- `web-ui/src/app/api/responses/route.ts` - API para respostas de questionários
- `web-ui/src/app/public/[token]/page.tsx` - Página pública para pacientes responderem questionários
- `web-ui/src/components/ui/` - Componentes base do Shadcn/ui (20+ componentes instalados)
- `web-ui/src/components/ui/sonner.tsx` - Componente de notificações toast moderno
- `web-ui/src/components/form/QuestionBuilder.tsx` - Componente para construção de perguntas
- `web-ui/src/components/facial/FacialSVG.tsx` - SVG interativo do rosto com regiões clicáveis
- `web-ui/src/components/facial/ComplaintCheckbox.tsx` - Checkboxes conectados ao SVG com LeaderLine.js
- `web-ui/src/components/comparison/ComparisonView.tsx` - Interface lado a lado para comparar questionários
- `web-ui/src/components/images/ImageGallery.tsx` - Galeria de imagens médicas com categorização
- `web-ui/src/components/calendar/CalendarView.tsx` - Componente de agenda com diferentes visualizações
- `web-ui/src/lib/supabase/client.ts` - Cliente Supabase configurado
- `web-ui/src/lib/supabase/database.types.ts` - Tipos TypeScript gerados do Supabase
- `web-ui/src/lib/validations/questionnaire.ts` - Schemas Zod para validação de questionários
- `web-ui/src/lib/validations/patient.ts` - Schemas Zod para validação de dados de pacientes
- `web-ui/src/lib/utils/leaderline.ts` - Utilitários para configuração do LeaderLine.js
- `web-ui/src/hooks/useAuth.ts` - Hook customizado para autenticação
- `web-ui/src/hooks/useQuestionnaire.ts` - Hook para gestão de questionários
- `web-ui/src/store/authStore.ts` - Store Zustand para estado de autenticação
- `web-ui/src/store/questionnaireStore.ts` - Store Zustand para estado de questionários
- `supabase/migrations/` - Migrações do banco de dados
- `supabase/seed.sql` - Dados iniciais (perguntas pré-definidas)
- `web-ui/.eslintrc.json` - Configuração ESLint com regras médicas e acessibilidade
- `web-ui/.prettierrc` - Configuração Prettier com Tailwind CSS plugin
- `web-ui/.husky/pre-commit` - Hook git para lint-staged
- `web-ui/.husky/pre-push` - Hook git para verificações antes do push

### Notas

- Os testes unitários devem ser colocados ao lado dos arquivos de código que estão testando (ex: `QuestionBuilder.tsx` e `QuestionBuilder.test.tsx` no mesmo diretório).
- Use `npm test` para executar os testes. Executar sem argumentos executa todos os testes encontrados pela configuração do Jest.
- LeaderLine.js requer configuração especial no Next.js para funcionar corretamente no lado do cliente.

## Tarefas

- [ ] 1.0 Configuração do Projeto e Infraestrutura Base
  - [x] 1.1 Criar estrutura de pastas do projeto com web-ui
  - [x] 1.2 Configurar Next.js 14+ com TypeScript na pasta web-ui
  - [x] 1.3 Configurar Tailwind CSS e configurações de estilo
  - [x] 1.4 Instalar e configurar ESLint, Prettier e Husky
  - [x] 1.5 Configurar Shadcn/ui com componentes base
  - [x] 1.6 Criar projeto Supabase e configurar variáveis de ambiente
  - [x] 1.7 Configurar Supabase Storage para imagens e documentos
  - [x] 1.8 Instalar dependências: React Hook Form, Zod, Zustand, LeaderLine.js
  - [x] 1.9 Configurar estrutura de testes com Jest e Testing Library
  - [x] 1.10 Configurar CI/CD básico e scripts de deploy

- [ ] 2.0 Sistema de Autenticação e Gestão de Usuários
  - [ ] 2.1 Criar tabelas de usuários e organizações no Supabase
  - [ ] 2.2 Configurar Row Level Security (RLS) para todas as tabelas
  - [ ] 2.3 Implementar página de login com React Hook Form + Zod
  - [ ] 2.4 Implementar página de registro para novos médicos
  - [ ] 2.5 Configurar Supabase Auth com providers de email
  - [ ] 2.6 Criar hook useAuth para gerenciamento de estado de autenticação
  - [ ] 2.7 Implementar middleware de proteção de rotas
  - [ ] 2.8 Criar componente de layout para área autenticada
  - [ ] 2.9 Implementar recuperação de senha
  - [ ] 2.10 Implementar logout e limpeza de sessão
  - [ ] 2.11 Configurar controle de acesso por perfis (médico, admin)
  - [ ] 2.12 Criar dashboard principal com navegação lateral

- [ ] 3.0 CRM de Pacientes e Gestão de Dados
  - [ ] 3.1 Criar tabela de pacientes com campos obrigatórios
  - [ ] 3.2 Implementar formulário de cadastro de pacientes
  - [ ] 3.3 Criar validação Zod para dados de pacientes
  - [ ] 3.4 Implementar listagem de pacientes com paginação
  - [ ] 3.5 Implementar busca por nome, CPF e telefone
  - [ ] 3.6 Criar filtros avançados (idade, data de cadastro, etc.)
  - [ ] 3.7 Implementar edição de dados do paciente
  - [ ] 3.8 Configurar upload de documentos do paciente
  - [ ] 3.9 Implementar histórico completo do paciente
  - [ ] 3.10 Criar visualização detalhada do perfil do paciente
  - [ ] 3.11 Implementar exclusão suave de pacientes
  - [ ] 3.12 Criar APIs REST para CRUD de pacientes

- [ ] 4.0 Sistema de Questionários e Banco de Perguntas
  - [ ] 4.1 Criar tabela de banco de perguntas categorizadas
  - [ ] 4.2 Implementar CRUD para perguntas personalizadas
  - [ ] 4.3 Criar componentes para 8 tipos de perguntas diferentes
  - [ ] 4.4 Implementar pergunta de escolha única com radio buttons
  - [ ] 4.5 Implementar pergunta de texto livre com textarea
  - [ ] 4.6 Implementar pergunta de escala numérica (1-10)
  - [ ] 4.7 Implementar pergunta de escala visual com slider
  - [ ] 4.8 Implementar pergunta de data/hora com date picker
  - [ ] 4.9 Implementar pergunta de upload de imagem/PDF
  - [ ] 4.10 Implementar pergunta de escolha múltipla com checkboxes
  - [ ] 4.11 Implementar pergunta sim/não/não sei
  - [ ] 4.12 Criar builder drag-and-drop para questionários
  - [ ] 4.13 Implementar preview em tempo real do questionário
  - [ ] 4.14 Criar sistema de categorização por especialidade
  - [ ] 4.15 Implementar busca e filtros no banco de perguntas
  - [ ] 4.16 Criar sistema de geração de links únicos
  - [ ] 4.17 Implementar página pública para resposta sem login
  - [ ] 4.18 Configurar validação e salvamento automático
  - [ ] 4.19 Implementar expiração de links de questionário
  - [ ] 4.20 Criar seed com perguntas pré-definidas por especialidade

- [ ] 5.0 Agenda Médica e Notificações
  - [ ] 5.1 Criar tabela de compromissos e agenda
  - [ ] 5.2 Implementar componente de calendário com visualizações
  - [ ] 5.3 Criar visualização diária da agenda
  - [ ] 5.4 Criar visualização semanal da agenda
  - [ ] 5.5 Criar visualização mensal da agenda
  - [ ] 5.6 Implementar CRUD de compromissos
  - [ ] 5.7 Configurar associação de compromissos com pacientes
  - [ ] 5.8 Implementar sistema de notificações básico
  - [ ] 5.9 Criar lembretes automáticos por email
  - [ ] 5.10 Implementar gestão de horários por médico
  - [ ] 5.11 Configurar conflitos de horário
  - [ ] 5.12 Implementar busca de compromissos

- [ ] 6.0 Comparação Temporal e Anotações Médicas
  - [ ] 6.1 Criar interface de seleção de questionários para comparação
  - [ ] 6.2 Implementar visualização lado a lado (até 3 questionários)
  - [ ] 6.3 Criar sistema de destaque de diferenças entre respostas
  - [ ] 6.4 Implementar navegação entre perguntas na comparação
  - [ ] 6.5 Criar tabela de anotações médicas
  - [ ] 6.6 Implementar sistema de anotações por resposta
  - [ ] 6.7 Configurar consolidação de anotações por paciente/pergunta
  - [ ] 6.8 Implementar histórico de anotações com versionamento
  - [ ] 6.9 Criar editor de texto rico para anotações
  - [ ] 6.10 Implementar busca nas anotações médicas
  - [ ] 6.11 Configurar permissões de visualização de anotações
  - [ ] 6.12 Implementar exportação de comparações

- [ ] 7.0 Banco de Imagens Médicas
  - [ ] 7.1 Criar tabela de imagens médicas categorizadas
  - [ ] 7.2 Implementar upload de imagens com drag-and-drop
  - [ ] 7.3 Configurar categorização automática (antes, depois, controle, diagnóstico)
  - [ ] 7.4 Implementar sistema de tags para imagens
  - [ ] 7.5 Criar otimização automática de imagens
  - [ ] 7.6 Implementar galeria de imagens responsiva
  - [ ] 7.7 Criar visualização de imagem em tela cheia
  - [ ] 7.8 Implementar comparação visual de imagens
  - [ ] 7.9 Configurar busca por tags e região corporal
  - [ ] 7.10 Implementar anotações em imagens
  - [ ] 7.11 Criar sistema de backup automático
  - [ ] 7.12 Implementar validação de formatos de arquivo

- [ ] 8.0 Formulário de Queixas Estéticas com Mapeamento Facial
  - [ ] 8.1 Criar SVG interativo do rosto frontal
  - [ ] 8.2 Definir e mapear 15 regiões faciais clicáveis
  - [ ] 8.3 Configurar responsividade do SVG para diferentes telas
  - [ ] 8.4 Implementar estados visuais (hover, selected) no SVG
  - [ ] 8.5 Posicionar checkboxes estrategicamente ao redor do SVG
  - [ ] 8.6 Configurar LeaderLine.js no Next.js (lado cliente)
  - [ ] 8.7 Implementar linhas conectoras animadas
  - [ ] 8.8 Configurar sincronização entre checkboxes e regiões SVG
  - [ ] 8.9 Implementar campos de texto condicionais
  - [ ] 8.10 Configurar animações suaves de entrada/saída
  - [ ] 8.11 Implementar validação de seleções obrigatórias
  - [ ] 8.12 Criar indicador de progresso do preenchimento
  - [ ] 8.13 Implementar tooltips informativos para cada região
  - [ ] 8.14 Configurar acessibilidade (ARIA labels, navegação por teclado)
  - [ ] 8.15 Otimizar performance das linhas conectoras
  - [ ] 8.16 Implementar salvamento automático do progresso
  - [ ] 8.17 Criar preview final antes do envio
  - [ ] 8.18 Integrar com sistema de questionários existente

---

## 📈 Métricas de Progresso

### 📊 Status Geral do Projeto
- **Início:** 17 de Junho 2025
- **Duração Estimada:** 18 semanas (9 sprints de 2 semanas)
- **Status Atual:** Desenvolvimento - Sprint 0
- **Tempo Trabalhado:** 13,0 horas
- **Data da Última Atualização:** 18 de Junho 2025

### 📋 Contadores de Tarefas
- **Total de Tarefas Principais:** 8
- **Total de Subtarefas:** 123
- **Tarefas Concluídas:** 10
- **Progresso Geral:** 8,1%

### ⏱️ Controle de Tempo por Tarefa
- **1.0 Configuração do Projeto:** 15,0h / ~20h estimadas (CONCLUÍDO)
- **2.0 Autenticação e Usuários:** 0h / ~30h estimadas
- **3.0 CRM de Pacientes:** 0h / ~25h estimadas
- **4.0 Sistema de Questionários:** 0h / ~40h estimadas
- **5.0 Agenda Médica:** 0h / ~20h estimadas
- **6.0 Comparação e Anotações:** 0h / ~25h estimadas
- **7.0 Banco de Imagens:** 0h / ~20h estimadas
- **8.0 Formulário de Queixas Estéticas:** 0h / ~35h estimadas

### 🎯 Progresso por Sprint
- **Sprint 0 (Setup):** 100% - CONCLUÍDO ✅
- **Sprint 1-2 (Auth + CRM):** 0% - Não iniciado
- **Sprint 3-4 (Questionários):** 0% - Não iniciado
- **Sprint 5 (Agenda):** 0% - Não iniciado
- **Sprint 6 (Comparação):** 0% - Não iniciado
- **Sprint 7 (Imagens):** 0% - Não iniciado
- **Sprint 8 (Queixas Estéticas):** 0% - Não iniciado

### 📝 Log de Atividades
```
[2025-06-18] - Criação do PRD e lista de tarefas detalhada
[2025-06-18] - Definição da arquitetura do projeto com pasta web-ui
[2025-06-18] - Estruturação de 123 subtarefas organizadas em 8 módulos principais
[2025-06-18 08:13] - Início do desenvolvimento - Sprint 0
[2025-06-18 08:14] - ✅ Tarefa 1.1 concluída: Estrutura de pastas criada com web-ui/src/{app,components,lib,hooks,store} e supabase/migrations
[2025-06-18 08:25] - ✅ Tarefa 1.2 concluída: Next.js 15.3.3 + TypeScript configurado com App Router, build funcionando
[2025-06-18 08:45] - ✅ Tarefa 1.3 concluída: Tailwind CSS + PostCSS configurado com tema médico, classes customizadas e utilitários
[2025-06-18 09:15] - ✅ Tarefa 1.4 concluída: ESLint + Prettier + Husky configurados com regras médicas, hooks git e formatação automática
[2025-06-18 10:00] - ✅ Tarefa 1.5 concluída: Shadcn/ui configurado com 20+ componentes base (button, form, dialog, table, calendar, etc.) + Sonner para notificações
[2025-06-18 10:30] - ✅ Tarefa 1.6 concluída: Cliente Supabase configurado com tipos TypeScript, cliente server/client, variáveis de ambiente
[2025-06-18 11:30] - ✅ Tarefa 1.7 concluída: Supabase Storage configurado com 3 buckets (medical-images, patient-documents, avatars), políticas RLS, utilitários de upload
[2025-06-18 12:30] - ✅ Tarefa 1.8 concluída: Dependências instaladas - React Hook Form v7.58.1, Zod v3.25.67, Zustand v5.0.5, LeaderLine.js v1.0.8, @hookform/resolvers v5.1.1, tipos customizados para LeaderLine.js
[2025-06-18 13:30] - ✅ Tarefa 1.9 concluída: Estrutura de testes configurada com Jest + Testing Library, testes de exemplo passando.
[2025-06-22 16:40] - ✅ Tarefa 1.10 concluída: CI/CD completo configurado - Pipeline GitHub Actions com testes/segurança/deploy automático, scripts de deploy robustos, documentação DEPLOY.md, configuração Vercel staging/produção.
```

### 🔄 Instruções para Atualização
1. **Após completar uma subtarefa:** Marcar como `[x]` e atualizar contador
2. **Registro de tempo:** Anotar horas trabalhadas em cada tarefa principal
3. **Log de atividades:** Adicionar entrada com data e descrição do trabalho realizado
4. **Atualização semanal:** Revisar progresso e ajustar estimativas se necessário

---

**Responsável:** Agente IA
**Próxima Revisão:** Início do Sprint 0 