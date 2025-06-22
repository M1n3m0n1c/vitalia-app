
# 🧾 Especificação Técnica Unificada: Formulário de Queixas Estéticas (Corpo + Face)

## 1. 📌 Objetivo
Desenvolver uma aplicação web para que pacientes possam selecionar áreas do corpo e do rosto com as quais estejam insatisfeitos, descrevendo suas queixas de maneira estruturada. As informações serão utilizadas por profissionais da saúde estética para análise personalizada.

---

## 2. 👤 Usuários
- **Paciente**: Preenche o formulário com suas queixas.
- **Profissional da Saúde**: Acessa os dados via painel de administração.

---

## 3. 📸 Tabela de Regiões e Imagens Associadas

| Região                   | Imagem Associada   |
|:-------------------------|:-------------------|
| Papada                   | Corpo (frente)     |
| Pescoço                  | Corpo (frente)     |
| Colo                     | Corpo (frente)     |
| Mama                     | Corpo (frente)     |
| Abdômen                  | Corpo (frente)     |
| Umbigo caído             | Corpo (frente)     |
| Íntimo                   | Corpo (frente)     |
| Mãos                     | Corpo (frente)     |
| Coxa                     | Corpo (frente)     |
| Joelho                   | Corpo (frente)     |
| Braço                    | Corpo (costas)     |
| Costas                   | Corpo (costas)     |
| Flancos                  | Corpo (costas)     |
| Culote                   | Corpo (costas)     |
| Celulite                 | Corpo (costas)     |
| Glúteos                  | Corpo (costas)     |
| Bananinha                | Corpo (costas)     |
| Região interna das coxas | Corpo (costas)     |
| Braveza                  | Face (frontal)     |
| Linhas periorbitais      | Face (frontal)     |
| Rugas pálpebra inferior  | Face (frontal)     |
| Lóbulo orelha            | Face (frontal)     |
| Bigode chinês            | Face (frontal)     |
| Rugas marionete          | Face (frontal)     |
| Sulco mentolabial        | Face (frontal)     |
| Celulite de queixo       | Face (frontal)     |
| Rugas na testa           | Face (frontal)     |
| Pés de galinha           | Face (frontal)     |
| Linha nasal              | Face (frontal)     |
| Cicatriz de acne         | Face (frontal)     |
| Região perioral          | Face (frontal)     |
| Lábios                   | Face (frontal)     |
| Mento                    | Face (frontal)     |

---

## 4. 🎯 Funcionalidades

### 4.1 Formulário Interativo (Corpo + Face)
- Mostrar imagens em SVG do corpo (frente e costas) e rosto (frontal).
- Checkboxes ao lado de cada imagem permitem seleção de regiões incômodas.
- Cada checkbox:
  - Ativa uma linha guia visual conectando-se à imagem.
  - Exibe campo de texto condicional para detalhamento da queixa.

---

## 5. 🔗 Mapeamento com LeaderLine.js

- Imagens SVG inline com IDs por região.
- Checkboxes posicionados com CSS ao redor da imagem.
- Uso de **[LeaderLine.js](https://anseki.github.io/leader-line/)** para desenhar linhas interativas entre checkboxes e SVG.
- Campos ativados dinamicamente com React + useRef.

---

## 6. 🧪 Tecnologias

| Camada            | Tecnologias                                                                 |
|-------------------|------------------------------------------------------------------------------|
| **Frontend Web**  | Next.js 14+, React 18, TypeScript, Tailwind CSS                             |
| **Backend**       | Supabase (PostgreSQL + Edge Functions)                                      |
| **Autenticação**  | Supabase Auth com RLS                                                       |
| **Storage**       | Supabase Storage (documentos/imagens médicas)                               |
| **Estado Global** | Zustand ou Redux Toolkit                                                    |
| **Formulários**   | React Hook Form + Zod                                                       |
| **UI Components** | Shadcn/ui ou Mantine                                                        |

---

## 7. 📂 Estrutura de Pastas

```
src/
├── components/
│   ├── BodyMapFront.tsx
│   ├── BodyMapBack.tsx
│   ├── FaceMap.tsx
│   └── BodyCheckbox.tsx
├── forms/
│   └── ComplaintForm.tsx
├── lib/
│   └── supabaseClient.ts
├── pages/
│   └── questionario.tsx
├── schemas/
│   └── complaintSchema.ts
└── types/
    └── Region.ts
```

---

## 8. 📋 Estrutura de Dados

### Tabela: `avaliacoes_corporais`
- `id`, `paciente_id`, `data_envio`, `regiao`, `descricao`, `imagem_tipo` (ex: "frente", "costas")

### Tabela: `avaliacoes_faciais`
- `id`, `paciente_id`, `data_envio`, `regiao`, `descricao`

---

## 9. ✅ Checklist Geral

- [ ] Implementar autenticação com Supabase Auth.
- [ ] Criar SVGs do corpo e rosto com pontos identificáveis.
- [ ] Criar componentes visuais interativos com checkboxes e linhas.
- [ ] Utilizar LeaderLine.js para interatividade.
- [ ] Criar formulários com React Hook Form + Zod.
- [ ] Validar e enviar dados ao Supabase.
- [ ] Proteger dados com RLS.
