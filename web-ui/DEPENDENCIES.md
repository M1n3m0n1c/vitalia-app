# 📦 Dependências Instaladas - Tarefa 1.8

Este documento lista as dependências principais instaladas na tarefa 1.8 e como utilizá-las no projeto.

## ✅ Dependências Instaladas

### 1. **React Hook Form** (v7.58.1)

- **Propósito**: Gerenciamento de formulários performático com validação
- **Uso**: Formulários de pacientes, questionários, autenticação
- **Integração**: Funciona perfeitamente com Zod para validação

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { ... }
});
```

### 2. **Zod** (v3.25.67)

- **Propósito**: Validação de schemas TypeScript-first
- **Uso**: Validação de dados de pacientes, questionários, APIs
- **Vantagem**: Type-safe, integração perfeita com React Hook Form

```typescript
import { z } from 'zod'

const patientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  cpf: z.string().length(11),
})
```

### 3. **Zustand** (v5.0.5)

- **Propósito**: Gerenciamento de estado global simples e performático
- **Uso**: Estado de autenticação, questionários, dados temporários
- **Vantagem**: Menos boilerplate que Redux, TypeScript nativo

```typescript
import { create } from 'zustand'

const useAuthStore = create(set => ({
  user: null,
  login: user => set({ user }),
  logout: () => set({ user: null }),
}))
```

### 4. **LeaderLine.js** (v1.0.8)

- **Propósito**: Linhas conectoras animadas para SVG interativo
- **Uso**: Formulário de queixas estéticas com mapeamento facial
- **Configuração**: Requer importação dinâmica para Next.js

```typescript
// Importação dinâmica para evitar erros de SSR
const loadLeaderLine = async () => {
  if (typeof window === 'undefined') return null
  const LeaderLine = (await import('leader-line')).default
  return LeaderLine
}
```

### 5. **@hookform/resolvers** (v5.1.1)

- **Propósito**: Adaptadores para integrar React Hook Form com bibliotecas de validação
- **Uso**: Ponte entre React Hook Form e Zod
- **Essencial**: Para usar Zod como validador nos formulários

## 🔧 Como Usar as Dependências Juntas

### Exemplo: Formulário de Paciente

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const patientSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('Email inválido')
});

export function PatientForm() {
  const form = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: { name: '', email: '' }
  });

  const onSubmit = (data) => {
    // Dados já validados pelo Zod
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Campos do formulário */}
    </form>
  );
}
```

### Exemplo: Store Zustand

```typescript
import { create } from 'zustand'

interface AuthState {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  login: user => set({ user }),
  logout: () => set({ user: null }),
}))
```

## 🎯 Casos de Uso no Projeto

1. **Formulários de Cadastro**: React Hook Form + Zod
2. **Estado Global**: Zustand para autenticação e dados temporários
3. **Validação de APIs**: Zod para validar dados recebidos/enviados
4. **Mapeamento Facial**: LeaderLine.js para conectar regiões do SVG
5. **Formulários Complexos**: Combinação de todas as dependências

## ✅ Status da Instalação

- ✅ React Hook Form: Instalado e funcionando
- ✅ Zod: Instalado e funcionando
- ✅ Zustand: Instalado e funcionando
- ✅ LeaderLine.js: Instalado com tipos customizados
- ✅ @hookform/resolvers: Instalado e funcionando

## 📁 Arquivos Relacionados

- `package.json` - Lista completa de dependências
- `src/types/leader-line.d.ts` - Tipos TypeScript para LeaderLine.js
- `src/lib/validations/` - Schemas Zod (quando criados)
- `src/store/` - Stores Zustand (quando criados)
- `src/hooks/` - Hooks customizados com React Hook Form (quando criados)

---

**Tarefa 1.8 Concluída** ✅  
Todas as dependências foram instaladas com sucesso e estão prontas para uso no desenvolvimento das próximas funcionalidades.
