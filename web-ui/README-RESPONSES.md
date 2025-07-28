# Funcionalidade: Visualização de Respostas de Questionários

## Visão Geral

Esta funcionalidade permite que os médicos visualizem e analisem as respostas dos questionários respondidos pelos pacientes.

## Funcionalidades Implementadas

### 📋 Listagem de Respostas (`/dashboard/responses`)

- **Lista todas as respostas** dos questionários do médico logado
- **Filtro por nome do paciente** - busca em tempo real
- **Paginação** - 20 respostas por página
- **Informações exibidas:**
  - Nome do paciente
  - Email do paciente (se disponível)
  - Título do questionário
  - Categoria do questionário (com badges coloridos)
  - Data e hora da resposta
  - Link para ver detalhes

### 🔍 Detalhes da Resposta (`/dashboard/responses/[id]`)

- **Informações completas do paciente:**
  - Nome, email, telefone, CPF
  - Data de nascimento e gênero
  
- **Informações do questionário:**
  - Título e descrição
  - Categoria (com badge)
  - Data de resposta
  - Total de perguntas

- **Respostas detalhadas:**
  - Cada pergunta com sua resposta
  - Tipo da pergunta (texto, múltipla escolha, escala, etc.)
  - Formatação específica por tipo de resposta
  - Tratamento especial para queixas faciais e corporais

## Tipos de Pergunta Suportados

| Tipo | Descrição | Como é exibida a resposta |
|------|-----------|---------------------------|
| `text` | Texto livre | Texto completo |
| `radio` | Múltipla escolha (única) | Opção selecionada |
| `checkbox` | Múltiplas opções | Lista de opções separadas por vírgula |
| `scale` | Escala numérica | "Valor/10" |
| `slider` | Deslizador | "Valor/10" |
| `date` | Data | Data formatada (DD/MM/AAAA) |
| `file` | Upload de arquivo | Nome do arquivo |
| `yes_no` | Sim/Não | "Sim" ou "Não" |
| `body_complaints` | Queixas corporais | Lista de regiões selecionadas |
| `facial_complaints` | Queixas faciais | Lista de regiões selecionadas |

## Estrutura de Dados

### Resposta Completa
```typescript
interface QuestionnaireResponse {
  id: string
  questionnaire_id: string
  patient_id: string
  answers: Answer[]
  completed_at: string
  created_at: string
  questionnaires: {
    id: string
    title: string
    description?: string
    questions: Question[]
    category?: string
  }
  patients: {
    id: string
    full_name: string
    email?: string
    phone?: string
    cpf?: string
    birth_date?: string
    gender?: 'male' | 'female' | 'other'
  }
}
```

### Answer
```typescript
interface Answer {
  question_id: string
  value: any
  question_text?: string
  question_type?: string
}
```

## APIs Criadas

### `GET /api/responses`
Lista respostas com filtros e paginação.

**Parâmetros:**
- `search` (opcional) - Nome do paciente para filtrar
- `page` (opcional) - Página atual (padrão: 1)
- `limit` (opcional) - Itens por página (padrão: 20)

### `GET /api/responses/[id]`
Busca uma resposta específica com todos os detalhes.

## Permissões e Segurança

- ✅ **RLS habilitado** - Médicos só veem respostas dos próprios questionários
- ✅ **Autenticação obrigatória** - Apenas usuários logados
- ✅ **Validação de propriedade** - Verificação se o questionário pertence ao médico

## Como Usar

1. **Acesse a página de respostas:**
   - No sidebar, clique em "Respostas"
   - Ou acesse `/dashboard/responses`

2. **Filtre por paciente (opcional):**
   - Digite o nome do paciente na barra de busca
   - Pressione Enter ou clique no botão de busca

3. **Visualize os detalhes:**
   - Clique em "Ver Detalhes" na linha da resposta
   - Navegue pelas perguntas e respostas

4. **Navegação:**
   - Use a paginação na parte inferior
   - Volte para a lista com o botão "Voltar"

## Componentes Criados

- `ResponseCard` - Card reutilizável para exibir respostas
- Páginas principais em `/dashboard/responses/`
- Tipos TypeScript em `/types/responses.ts`

## Próximas Melhorias

- [ ] Exportação de respostas em PDF/Excel
- [ ] Filtros avançados por categoria/data
- [ ] Visualização de estatísticas das respostas
- [ ] Comparação de respostas ao longo do tempo
- [ ] Anotações médicas nas respostas 