<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# Plano de Desenvolvimento Detalhado: Sistema Digital de Anamnese e Gestão Clínica

## Introdução

Com base nas especificações técnicas fornecidas, desenvolvemos um plano abrangente para implementação do sistema de anamnese digital e formulário de queixas estéticas. Este documento apresenta um roteiro detalhado para desenvolvedores júnior, incluindo protótipos visuais, estrutura do projeto, cronograma e padrões de implementação [^1][^2].

O sistema consiste em duas aplicações web integradas que compartilham a mesma base tecnológica: um formulário interativo de queixas estéticas com mapeamento corporal e um sistema completo de anamnese digital com gestão de pacientes, questionários e imagens médicas [^1][^2].

## Visão Geral do Sistema

O projeto utilizará uma stack tecnológica moderna baseada em Next.js 14+ e Supabase para oferecer uma experiência robusta e segura para profissionais da saúde e seus pacientes. O sistema será construído seguindo os padrões da indústria para aplicações médicas, com ênfase em segurança de dados, usabilidade e interatividade [^1][^2][^3].

### Dashboard Principal

A interface principal do sistema apresenta um design limpo e intuitivo, adequado para o ambiente médico, com navegação lateral, busca rápida e acesso fácil às principais funcionalidades [^2][^3].

![Dashboard principal do sistema de gestão clínica](https://pplx-res.cloudinary.com/image/upload/v1750213683/gpt4o_images/eikdvxzhnagserkfmb8p.png)

Dashboard principal do sistema de gestão clínica

### Principais Módulos

O sistema está dividido em módulos principais que atendem às diferentes necessidades dos profissionais de saúde [^1][^2]:

1. **Gestão de Pacientes**: CRM completo com histórico médico, dados pessoais e documentos
2. **Sistema de Questionários**: Criação e envio de formulários personalizados
3. **Formulário de Queixas Estéticas**: Mapeamento corporal interativo
4. **Comparação Temporal**: Análise de evolução entre questionários
5. **Banco de Imagens Médicas**: Gerenciamento de fotos antes/depois
6. **Agenda Integrada**: Sincronização com Google Calendar e iOS Calendar

## Especificações Técnicas

### Stack Tecnológica

A escolha das tecnologias visa equilibrar facilidade de desenvolvimento para uma equipe júnior com robustez para um sistema médico [^1][^2]:


| Camada | Tecnologia | Finalidade |
| :-- | :-- | :-- |
| Frontend | Next.js 14+ | Framework React com SSR |
| UI/UX | Tailwind CSS | Estilização responsiva |
| Backend | Supabase | Banco de dados PostgreSQL + Auth |
| Formulários | React Hook Form + Zod | Validação e gestão de formulários |
| Interatividade | LeaderLine.js | Linhas conectoras interativas |
| Estado | Zustand | Gerenciamento de estado global |

### Estrutura de Pastas

A organização do projeto segue as melhores práticas do Next.js App Router, com separação clara de responsabilidades para facilitar a manutenção [^2][^4][^5]:

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Grupo de autenticação
│   ├── (dashboard)/              # Área logada
│   ├── api/                      # API Routes
├── components/                   # Componentes reutilizáveis
│   ├── ui/                       # Componentes base (Shadcn)
│   ├── form/                     # Componentes de formulário
│   ├── corpo/                    # Mapeamento corporal
│   ├── rosto/                    # Mapeamento facial
├── lib/                          # Bibliotecas e utilitários
├── hooks/                        # Custom hooks
├── types/                        # Definições TypeScript
```


## Implementação do Formulário de Queixas Estéticas

O formulário de queixas estéticas é um dos diferenciais do sistema, permitindo que pacientes selecionem áreas do corpo e rosto com as quais estão insatisfeitos [^1].

### Interface de Mapeamento Corporal

O sistema apresenta uma interface interativa onde os pacientes podem selecionar regiões específicas do corpo e rosto, com checkboxes conectados às regiões por linhas guias. Esta funcionalidade utiliza SVGs interativos e a biblioteca LeaderLine.js [^1][^6].

![Formulário de queixas estéticas com mapeamento corporal interativo](https://pplx-res.cloudinary.com/image/upload/v1750213765/gpt4o_images/v9xshxtil5efjso2i8j9.png)

Formulário de queixas estéticas com mapeamento corporal interativo

### Componentes-Chave do Formulário

A implementação do formulário de queixas estéticas envolve três componentes principais [^1][^7]:

1. **SVGs Interativos**: Representações visuais do corpo (frente/costas) e face
2. **Sistema de Checkboxes**: Elementos posicionados estrategicamente ao redor das imagens
3. **LeaderLine.js**: Biblioteca para conectar visualmente os checkboxes às regiões anatômicas

## Sistema de Questionários Médicos

O sistema de questionários é fundamental para a anamnese digital, permitindo a criação, envio e análise de formulários personalizados [^2][^3].

### Interface do Builder de Questionários

A interface para construção de questionários permite que o profissional selecione perguntas de um banco pré-definido, organize-as em seções e adicione opções de resposta de diferentes tipos [^2][^7].

![Interface de criação de questionários médicos personalizados](https://pplx-res.cloudinary.com/image/upload/v1750213810/gpt4o_images/bv2nxzumeaubw8mv9fhg.png)

Interface de criação de questionários médicos personalizados

### Banco de Perguntas

O sistema conta com um banco de perguntas categorizado por especialidade e finalidade, incluindo diversos tipos de questões [^2][^8]:

- Escolha única
- Texto livre
- Escala numérica
- Escala visual
- Data/hora
- Upload de imagens
- Escolha múltipla
- Sim/Não/Não sei


### Comparação Temporal

Um diferencial do sistema é a capacidade de comparar respostas de diferentes questionários ao longo do tempo, permitindo visualizar a evolução do paciente [^2][^3].

![Interface de comparação temporal de respostas de questionários](https://pplx-res.cloudinary.com/image/upload/v1750213871/gpt4o_images/tcevf0oihgdqg7rbatbw.png)

Interface de comparação temporal de respostas de questionários

## Gerenciamento de Imagens Médicas

O módulo de imagens médicas facilita o upload, organização e comparação de fotos clínicas [^2].

### Interface de Gerenciamento

A interface permite o gerenciamento completo de imagens médicas, com recursos para categorização, anotação e comparação de imagens antes/depois [^2][^9].

![Sistema de gestão e comparação de imagens médicas](https://pplx-res.cloudinary.com/image/upload/v1750213932/gpt4o_images/jzi4zadaxshvehqgjobs.png)

Sistema de gestão e comparação de imagens médicas

### Recursos do Módulo de Imagens

As principais funcionalidades incluem [^2]:

1. **Categorização**: Classificação por tipo (antes, depois, controle, diagnóstico)
2. **Anotações**: Possibilidade de adicionar marcações e comentários às imagens
3. **Organização por Região**: Filtro por área corporal para fácil localização
4. **Comparação Visual**: Interface para analisar mudanças ao longo do tempo

## Agenda Integrada

O sistema oferece um módulo completo para gerenciamento de consultas e compromissos [^2].

### Interface de Calendário

A interface de agenda apresenta uma visualização intuitiva do calendário, com sincronização bidirecional com Google Calendar e iOS Calendar [^2][^10].

![Interface de gestão de agenda médica integrada](https://pplx-res.cloudinary.com/image/upload/v1750214054/gpt4o_images/zfe2uc7eg3nxltsee55g.png)

Interface de gestão de agenda médica integrada

### Funcionalidades da Agenda

O módulo inclui [^2]:

1. **Agendamento Inteligente**: Gestão de horários por médico
2. **Sincronização Externa**: Integração com calendários populares
3. **Notificações**: Alertas automáticos para pacientes e profissionais
4. **Histórico**: Registro completo de atendimentos por paciente

## Plano de Implementação

### Cronograma

O desenvolvimento está estruturado em 9 sprints de 2 semanas cada, com marcos importantes definidos [^1][^11]:


| Sprint | Foco Principal | Entregáveis |
| :-- | :-- | :-- |
| Sprint 0 | Preparação e Setup | Ambiente configurado, repositório |
| Sprint 1-2 | Autenticação e CRM básico | Login, cadastro, listagem de pacientes |
| Sprint 3-4 | Sistema de Questionários | Builder, banco de perguntas |
| Sprint 5-6 | Mapeamento Corporal | Formulário de queixas estéticas |
| Sprint 7-8 | Comparação e Imagens | Comparação temporal, gerenciamento de imagens |
| Sprint 9 | Agenda e Finalização | Integração de calendário, deploy |

### Metodologia

A equipe trabalhará com um processo Scrum adaptado para equipes pequenas, com sprints de duas semanas, dailies (segunda, quarta e sexta) e reviews semanais [^3][^12][^13].

## Segurança e Compliance

O sistema é projetado considerando requisitos de segurança para dados médicos e conformidade com regulamentações [^2][^14][^15]:

1. **Row Level Security (RLS)**: Políticas no Supabase para garantir isolamento de dados
2. **Autenticação Robusta**: Sistema seguro de login e registro
3. **Criptografia**: Dados sensíveis criptografados em trânsito e repouso
4. **Auditoria**: Registro de todas as alterações em dados sensíveis
5. **Preparação para LGPD**: Estrutura preparada para compliance futuro

## Orientações para Desenvolvedores Júnior

### Setup do Ambiente

O plano inclui instruções detalhadas para configuração do ambiente de desenvolvimento [^1][^16]:

```bash
# 1. Instalar Node.js (versão 18+)
# 2. Instalar Git
# 3. IDE recomendada: Visual Studio Code
# 4. Extensões VS Code obrigatórias
# 5. Criar projeto Next.js
npx create-next-app@latest medcare-system --typescript --tailwind --eslint --app
```


### Padrões de Código

Para garantir consistência e qualidade, o plano define padrões claros para componentes React, hooks personalizados, validação com Zod e integração com Supabase [^1][^7][^17].

### Estratégia de Testes

A estratégia de testes inclui [^1][^18][^19]:

1. **Testes Unitários**: Para funções utilitárias e componentes isolados
2. **Testes de Integração**: Para fluxos completos e interações com API
3. **Testes E2E**: Para funcionalidades críticas e fluxos de usuário
4. **Testes de Segurança**: Verificação de políticas de RLS e autenticação

## Conclusão

Este plano fornece um roteiro detalhado para implementação do sistema digital de anamnese e gestão clínica por uma equipe júnior. Com protótipos visuais claros, instruções passo a passo e estrutura bem definida, os desenvolvedores terão todo o suporte necessário para executar o projeto com sucesso [^1][^2][^3].

O sistema resultante oferecerá uma experiência moderna e eficiente tanto para profissionais de saúde quanto para pacientes, com recursos avançados de formulários interativos, gestão de dados e análise comparativa [^1][^2][^3].

<div style="text-align: center">⁂</div>

[^1]: especificacao-unificada-formulario.md

[^2]: medcare-plano-inicial.md

[^3]: https://repositorio.ufsc.br/bitstream/handle/123456789/183827/TCCdaMaira.pdf?sequence=-1

[^4]: https://nextjs.org/docs/app/getting-started/project-structure

[^5]: https://nextjsstarter.com/blog/nextjs-14-project-structure-best-practices/

[^6]: https://stackoverflow.com/questions/50589365/how-to-use-leader-line-an-external-javascript-library-in-react

[^7]: https://openmrs.atlassian.net/wiki/spaces/docs/pages/150930308/Validate+Forms+Using+React+Hook+Form+and+Zod

[^8]: https://www.sciencedirect.com/science/article/abs/pii/S1386505619310883

[^9]: https://docs.google.com/document/d/1iAx2kp03fWXvEr-NjtETJEKxQuoZbKP3ITx1wmcTaMQ/edit

[^10]: https://www.dio.me/articles/do-junior-ao-pleno

[^11]: https://ejemackenzie.com.br/ejem/desenvolvimento-de-softwares-4-etapas/

[^12]: https://www.dio.me/articles/a-importancia-do-conhecimento-em-metodologias-ageis-para-desenvolvedores-iniciantes

[^13]: https://factorybraga.com/agile-for-beginners/

[^14]: https://supabase.com/docs/guides/deployment/going-into-prod

[^15]: https://attractgroup.com/blog/hipaa-penetration-test-hipaa-penetration-testing-requirements/

[^16]: https://supabase.com/docs/guides/getting-started

[^17]: https://github.com/sango-tech/vue3-leaderline

[^18]: https://www.qt.io/quality-assurance/medical-device-software-testing-guide

[^19]: https://luxequality.com/blog/qa-testing-in-healthcare-domain/

[^20]: https://www.somosicev.com/blogs/niveis-de-desenvolvedores-de-software/

[^21]: https://www.alura.com.br/apostila-html-css-javascript/01CA-baixando-os-arquivos-do-curso

[^22]: https://www.reddit.com/r/nextjs/comments/1e4juvk/how_do_you_structure_files_and_directories_in/

[^23]: https://sentry.io/answers/next-js-directory-organisation-best-practices/

[^24]: https://blog.stackademic.com/next-clean-architecture-a-guide-for-scalable-apps-611326d4581b?gi=a37a3ef9c6cc

[^25]: https://arphoenix.com.br/documentacao-tecnica-de-software/

[^26]: https://www.dio.me/articles/fluxos-de-trabalho-workflows-com-git-git-flow-github-flow-e-trunk-based-development-ea1e32993fcd

[^27]: https://document360.com/pt-br/blog/documentacao-tecnica/

[^28]: https://www.reddit.com/r/Supabase/comments/1kbk115/best_practices_for_local_development_production/

[^29]: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs

[^30]: https://www.projectrules.ai/rules/supabase

[^31]: https://nri-na.com/blog/design-patterns-for-software-development-success/

[^32]: https://dribbble.com/tags/medical-ui

[^33]: https://www.emergobyul.com/news/tips-designing-timeless-medical-device-user-interfaces-ui

[^34]: https://aloa.co/blog/user-interface-design-for-healthcare-applications

[^35]: https://www.capiproduct.com/post/designing-healthcare-mobile-apps-best-ui-ux-practices-for-2025

[^36]: https://pdfs.semanticscholar.org/3b8b/882b14243b25b71706ad0bedb6830617165f.pdf

[^37]: https://www.emergobyul.com/news/ui-design-trends-healthcare-and-medical-apps

[^38]: https://addictaco.com/best-practices-for-ui-ux-in-medical-apps/

[^39]: https://pubmed.ncbi.nlm.nih.gov/8281062/

[^40]: https://build.fhir.org/questionnaire.html

[^41]: https://www.mdpi.com/2673-8392/5/2/65

[^42]: https://www.appliedclinicaltrialsonline.com/view/coding-designing-clinical-database

[^43]: https://www.suretysystems.com/insights/understanding-the-fhir-data-model-a-comprehensive-guide/

[^44]: https://www.surfsidemedia.in/post/database-schema-for-hospital-management-system

[^45]: https://ecqi.healthit.gov/fhir

[^46]: https://decode.agency/article/healthcare-software-development-best-practices/

[^47]: https://www.browserstack.com/guide/healthcare-software-testing

[^48]: https://decode.agency/article/healthcare-software-testing/

[^49]: https://www.taazaa.com/compliance-testing-in-healthcare-software-development/

[^50]: https://kms-healthcare.com/blog/healthcare-software-testing/

[^51]: https://www.reddit.com/r/VietNam/comments/1k3i9yz/plan_check_setting_up_a_small_software_dev_team/?tl=pt-br

[^52]: https://awari.com.br/tutorial-de-projeto-de-desenvolvimento-web-front-end/

[^53]: https://www.wisp.blog/blog/the-ultimate-guide-to-organizing-your-nextjs-15-project-structure

[^54]: https://fjorgemota.com/2016/01/22/git-flow-uma-forma-legal-de-organizar-repositorios-git/

[^55]: https://supabase.com/docs/guides/getting-started/architecture

[^56]: https://dev.to/aadarsh-nagrath/simplifying-form-validation-with-zod-and-react-hook-form-24ba

[^57]: https://www.amazon.com.br/Interface-Design-Medical-Devices-Software-ebook/dp/B0DLP5J6LX

[^58]: https://pubmed.ncbi.nlm.nih.gov/36178714/

[^59]: https://dhsprogram.com/Methodology/Survey-Types/DHS-Questionnaires.cfm

[^60]: https://www.blaze.tech/post/how-to-build-a-database

[^61]: https://becker.wustl.edu/news/medical-app-developers-navigating-fda-and-ftc-regulations/

[^62]: https://www.getastra.com/blog/security-audit/hipaa-penetration-testing/

[^63]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/888e073c119e93c8823c8f31e8fc5e24/9857f498-2dbe-410f-ae46-173e388f05f6/036be069.md

