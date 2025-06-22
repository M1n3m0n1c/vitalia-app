# 🏥 PRD - MVP Sistema Digital de Anamnese e Gestão Clínica

## 1. 📋 Introdução/Visão Geral

O Sistema Digital de Anamnese e Gestão Clínica é uma plataforma web desenvolvida para médicos e clínicas que visa digitalizar e otimizar o processo de coleta de informações dos pacientes. O sistema combina um formulário interativo de queixas estéticas com mapeamento facial e um sistema completo de questionários médicos personalizáveis.

**Problema que resolve:** Atualmente, a coleta de informações de pacientes é feita de forma manual e fragmentada, dificultando a análise comparativa, o acompanhamento da evolução do paciente e a padronização dos dados coletados.

**Objetivo:** Criar uma solução digital que permita aos profissionais da saúde coletar, organizar e analisar informações dos pacientes de forma estruturada, com foco especial em queixas estéticas faciais e questionários médicos personalizados.

## 2. 🎯 Objetivos

1. **Digitalizar o processo de anamnese médica** - Substituir formulários em papel por uma solução digital interativa
2. **Facilitar a coleta de queixas estéticas** - Permitir que pacientes identifiquem visualmente suas preocupações faciais
3. **Padronizar a coleta de dados** - Criar um banco de perguntas organizadas por especialidade
4. **Permitir análise temporal** - Comparar respostas de questionários ao longo do tempo
5. **Centralizar informações do paciente** - Integrar dados pessoais, questionários, imagens e anotações médicas
6. **Otimizar o tempo de consulta** - Pré-coleta de informações antes da consulta presencial

## 3. 👥 Histórias de Usuário

### Médico/Profissional da Saúde

**HU001:** Como médico, eu quero cadastrar meus pacientes com dados completos para ter um CRM organizado e acessível.

**HU002:** Como médico, eu quero criar questionários personalizados usando um banco de perguntas para padronizar minha coleta de dados.

**HU003:** Como médico, eu quero enviar questionários para meus pacientes via link único para que eles respondam antes da consulta.

**HU004:** Como médico, eu quero comparar respostas de questionários do mesmo paciente em diferentes datas para acompanhar sua evolução.

**HU005:** Como médico, eu quero fazer anotações médicas nas respostas dos pacientes para registrar minhas observações e diagnósticos.

**HU006:** Como médico, eu quero gerenciar imagens médicas dos meus pacientes organizadas por categoria e data.

**HU007:** Como médico, eu quero ter uma agenda digital para gerenciar meus compromissos e consultas.

### Paciente

**HU008:** Como paciente, eu quero responder questionários online sem precisar criar conta para facilitar meu acesso.

**HU009:** Como paciente, eu quero selecionar visualmente as regiões do meu rosto que me incomodam para comunicar melhor minhas queixas estéticas.

**HU010:** Como paciente, eu quero descrever detalhadamente minhas queixas para cada região selecionada.

**HU011:** Como paciente, eu quero fazer upload de imagens relacionadas às minhas queixas quando solicitado.

## 4. 📋 Requisitos Funcionais

### 4.1 Sistema de Autenticação e Usuários
**RF001:** O sistema deve permitir registro e login de médicos com email e senha
**RF002:** O sistema deve suportar múltiplos médicos por organização/clínica
**RF003:** O sistema deve implementar controle de acesso baseado em perfis (médico, administrador)
**RF004:** O sistema deve manter sessões seguras com timeout automático

### 4.2 Gestão de Pacientes (CRM)
**RF005:** O sistema deve permitir cadastro completo de pacientes com dados pessoais
**RF006:** O sistema deve permitir busca e filtro de pacientes por nome, CPF ou telefone
**RF007:** O sistema deve manter histórico completo de cada paciente
**RF008:** O sistema deve permitir upload de documentos do paciente

### 4.3 Banco de Perguntas
**RF009:** O sistema deve ter um banco de perguntas categorizadas por especialidade
**RF010:** O sistema deve suportar 8 tipos de perguntas: escolha única, texto livre, escala numérica, escala visual, data/hora, upload de imagem/pdf, escolha múltipla, sim/não/não sei
**RF011:** O sistema deve permitir que médicos criem perguntas personalizadas
**RF012:** O sistema deve permitir busca de perguntas por categoria ou palavra-chave

### 4.4 Sistema de Questionários
**RF013:** O sistema deve permitir criação de questionários personalizados selecionando perguntas do banco
**RF014:** O sistema deve gerar links únicos para envio de questionários aos pacientes
**RF015:** O sistema deve permitir que pacientes respondam questionários sem login
**RF016:** O sistema deve validar respostas obrigatórias antes do envio
**RF017:** O sistema deve salvar automaticamente respostas em progresso

### 4.5 Formulário de Queixas Estéticas Faciais
**RF018:** O sistema deve exibir uma imagem SVG interativa do rosto frontal
**RF019:** O sistema deve permitir seleção de regiões faciais através de checkboxes
**RF020:** O sistema deve conectar visualmente checkboxes às regiões usando linhas guias (LeaderLine.js)
**RF021:** O sistema deve exibir campos de texto condicionais para detalhamento das queixas
**RF022:** O sistema deve suportar as seguintes regiões faciais:
- Braveza, Linhas periorbitais, Rugas pálpebra inferior, Lóbulo orelha
- Bigode chinês, Rugas marionete, Sulco mentolabial, Celulite de queixo
- Rugas na testa, Pés de galinha, Linha nasal, Cicatriz de acne
- Região perioral, Lábios, Mento

### 4.6 Comparação Temporal
**RF023:** O sistema deve permitir seleção de até 3 questionários do mesmo paciente
**RF024:** O sistema deve exibir respostas lado a lado para comparação
**RF025:** O sistema deve destacar diferenças entre as respostas
**RF026:** O sistema deve permitir navegação entre perguntas na comparação

### 4.7 Anotações Médicas
**RF027:** O sistema deve permitir anotações médicas em cada resposta de questionário
**RF028:** O sistema deve consolidar anotações por paciente e pergunta (não por questionário)
**RF029:** O sistema deve manter histórico de anotações com data e médico responsável
**RF030:** O sistema deve permitir busca nas anotações médicas

### 4.8 Banco de Imagens Médicas
**RF031:** O sistema deve permitir upload de imagens médicas categorizadas
**RF032:** O sistema deve suportar categorias: antes, depois, controle, diagnóstico
**RF033:** O sistema deve permitir adição de tags e descrições às imagens
**RF034:** O sistema deve permitir comparação visual de imagens do mesmo paciente
**RF035:** O sistema deve otimizar automaticamente o tamanho das imagens

### 4.9 Agenda Médica
**RF036:** O sistema deve permitir criação e edição de compromissos
**RF037:** O sistema deve exibir agenda em visualizações diária, semanal e mensal
**RF038:** O sistema deve permitir associação de compromissos a pacientes
**RF039:** O sistema deve enviar notificações de lembrete
**RF040:** O sistema deve permitir gestão de horários por médico

## 5. 🚫 Não Objetivos (Fora do Escopo do MVP)

1. **Integração com calendários externos** (Google Calendar, iOS) - Será implementada na Fase 2
2. **Mapeamento corporal** (frente e costas) - Apenas facial no MVP
3. **Sistema de telemedicina** - Não inclui videochamadas ou consultas remotas
4. **Compliance LGPD completo** - Estrutura preparada, implementação completa na Fase 3
5. **APIs externas para terceiros** - Apenas APIs internas no MVP
6. **Sistema de faturamento** - Não inclui cobrança ou pagamentos
7. **Relatórios avançados** - Apenas visualizações básicas
8. **OCR para extração de dados de exames** - Funcionalidade da Fase 2
9. **Aplicativo mobile** - Apenas versão web responsiva
10. **Múltiplas linguagens** - Apenas português brasileiro

## 6. 🎨 Considerações de Design

### 6.1 Interface do Usuário
- Design limpo e profissional adequado ao ambiente médico
- Interface responsiva para desktop, tablet e mobile
- Navegação intuitiva com menu lateral
- Cores neutras com destaque para ações importantes
- Tipografia legível e acessível

### 6.2 Experiência do Usuário
- Fluxo simplificado para criação de questionários
- Feedback visual imediato para ações do usuário
- Loading states para operações demoradas
- Mensagens de erro claras e orientativas
- Confirmações para ações destrutivas

### 6.3 Formulário de Queixas Estéticas
- SVG interativo do rosto com regiões claramente demarcadas
- Checkboxes posicionados estrategicamente ao redor da imagem
- Linhas conectoras animadas usando LeaderLine.js
- Campos de texto que aparecem suavemente ao selecionar regiões
- Indicadores visuais de progresso do preenchimento

## 7. 🔧 Considerações Técnicas

### 7.1 Stack Tecnológica
- **Frontend:** Next.js 14+, React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Autenticação:** Supabase Auth com Row Level Security
- **Storage:** Supabase Storage para imagens e documentos
- **Formulários:** React Hook Form + Zod para validação
- **UI Components:** Shadcn/ui
- **Estado Global:** Zustand
- **Interatividade:** LeaderLine.js para linhas conectoras

### 7.2 Segurança
- Row Level Security (RLS) no PostgreSQL
- Autenticação segura com tokens JWT
- Validação de dados no frontend e backend
- Sanitização de uploads de arquivos
- Logs de auditoria para ações sensíveis

### 7.3 Performance
- Otimização de imagens automática
- Lazy loading de componentes pesados
- Paginação para listagens extensas
- Cache inteligente de dados frequentes
- Compressão de assets estáticos

## 8. 📊 Métricas de Sucesso

### 8.1 Métricas de Funcionalidade
- **Taxa de conclusão de questionários:** % de questionários enviados que foram completamente respondidos
- **Tempo médio de resposta:** Tempo que pacientes levam para completar questionários
- **Taxa de uso do mapeamento facial:** % de pacientes que utilizam a funcionalidade de queixas estéticas
- **Número de anotações médicas:** Quantidade de anotações feitas por médico

### 8.2 Métricas de Usabilidade
- **Taxa de abandono:** % de usuários que começam mas não completam o cadastro
- **Tempo de criação de questionário:** Tempo que médicos levam para criar um questionário
- **Frequência de uso:** Número de logins por médico por semana
- **Satisfação do usuário:** Feedback qualitativo coletado via formulário

### 8.3 Métricas Técnicas
- **Tempo de carregamento:** Páginas devem carregar em menos de 3 segundos
- **Disponibilidade:** Sistema deve ter 99% de uptime
- **Taxa de erro:** Menos de 1% de erros em transações críticas
- **Performance mobile:** Funcionalidade completa em dispositivos móveis

## 9. ❓ Questões em Aberto

1. **Integração com sistemas existentes:** Como o sistema se integrará com prontuários eletrônicos já utilizados pelas clínicas?

2. **Backup e recuperação:** Qual será a estratégia de backup dos dados médicos sensíveis?

3. **Customização por especialidade:** Como permitir que diferentes especialidades médicas tenham templates específicos sem complicar a interface?

4. **Limites de armazenamento:** Qual será o limite de armazenamento por médico/clínica para imagens e documentos?

5. **Notificações:** Quais tipos de notificações (email, SMS, push) devem ser implementadas e quando?

6. **Relatórios:** Que tipos de relatórios básicos são essenciais para os médicos no MVP?

7. **Versionamento de questionários:** Como lidar com alterações em questionários que já foram respondidos por pacientes?

8. **Migração de dados:** Como facilitar a migração de dados de sistemas existentes para a nova plataforma?

---

## 📅 Cronograma Sugerido (9 Sprints de 2 semanas)

| Sprint | Funcionalidades Principais |
|--------|---------------------------|
| **Sprint 0** | Setup do projeto, configuração do ambiente, Supabase |
| **Sprint 1-2** | Autenticação, cadastro de usuários, CRM básico de pacientes |
| **Sprint 3-4** | Banco de perguntas, sistema de questionários, builder |
| **Sprint 5-6** | Formulário de queixas estéticas faciais com LeaderLine.js |
| **Sprint 7-8** | Comparação temporal, anotações médicas, banco de imagens |
| **Sprint 9** | Agenda médica básica, testes finais, deploy |

---

**Data de Criação:** Janeiro 2025  
**Versão:** 1.0  
**Status:** Aprovado para Desenvolvimento