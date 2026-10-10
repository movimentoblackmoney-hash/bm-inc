# MBM Tokens — Referência de Fundações

> Tokens oficiais do Movimento Black Money. Utilize este arquivo como fonte única de verdade para todas as decisões visuais de fundação — cores, tipografia, espaçamento, arredondamentos, sombras, z-index e motion. Sempre use tokens em vez de valores hardcoded.

---

## Índice

- [Cores](#1-cores)
- [Tipografia](#2-tipografia)
- [Espaçamento](#3-espaçamento)
- [Formatos e Arredondamentos](#4-formatos-e-arredondamentos)
- [Elevações (Sombras)](#5-elevações-sombras)
- [Z-index](#6-z-index)
- [Motion (Animação)](#7-motion-animação)

---

## 1. Cores

**Contraste mínimo exigido (WCAG AA):** 4.5:1 para texto normal, 3:1 para texto grande e elementos de UI interativos.

O sistema de cores do MBM é organizado em seis categorias semânticas: **Neutral** (base estrutural), **Primary** (ação), **Highlight** (apoio e novidades), **Success**, **Warning** e **Danger**. Cada categoria possui tokens para borda, ícone, superfície e texto — com variações de ênfase e estado.

---

### Neutral

Os dois pólos neutros da identidade MBM: **Abismo** (`#02131F`) e **Linho** (`#D5D5BE`). Toda a base estrutural do sistema parte deles — fundos, superfícies, textos, bordas e ícones.

Não devem carregar significado semântico de ação ou estado. São a linguagem do espaço, não do conteúdo.

| Token | Hex | Uso |
|---|---|---|
| `--neutral-border` | `#D5D5BE` | Bordas padrão no light mode (inputs, cards, divisores) |
| `--neutral-border-interactive` | `#C2C2A8` | Bordas de elementos interativos em foco |
| `--neutral-border-interactive-hover` | `#A8A88E` | Borda interativa no hover |
| `--neutral-border-disabled` | `#E4E4D2` | Borda de elementos desabilitados |
| `--neutral-icon-high-emphasis` | `#02131F` | Ícones com máximo destaque sobre fundo claro |
| `--neutral-icon-low-emphasis` | `#3A5263` | Ícones secundários/de apoio sobre fundo claro |
| `--neutral-icon-disabled` | `#9AADA0` | Ícones desabilitados |
| `--neutral-icon-inverse` | `#D5D5BE` | Ícones sobre fundos escuros (Abismo) — cor base Linho |
| `--neutral-surface` | `#FFFFFF` | Background padrão de superfícies (cards, modais, inputs) no light mode |
| `--neutral-surface-page` | `#D5D5BE` | Background de página no modo light — fundo base do layout |
| `--neutral-surface-high-emphasis` | `#C2C2A8` | Superfícies com maior contraste no light (zebra de tabela, hover de linha) |
| `--neutral-surface-low-emphasis` | `#E4E4D2` | Superfícies com menor contraste no light (seções de apoio) |
| `--neutral-surface-hover` | `#CACAB2` | Fundo de elementos no estado hover (light mode) |
| `--neutral-surface-disabled` | `#EBEBD8` | Fundo de elementos desabilitados |
| `--neutral-surface-inverse` | `#02131F` | Fundo escuro — background principal do modo dark, tooltips escuros |
| `--neutral-surface-inverse-raised` | `#0D2535` | Superfície elevada sobre o fundo escuro (cards e modais no dark mode) |
| `--neutral-surface-inverse-high-emphasis` | `#163347` | Superfície escura de alto contraste (headers de tabela no dark, seções de destaque) |
| `--neutral-text-high-emphasis` | `#02131F` | Textos principais no light mode — cor base Abismo |
| `--neutral-text-low-emphasis` | `#3A5263` | Textos secundários, descrições, placeholders |
| `--neutral-text-disabled` | `#9AADA0` | Textos de elementos desabilitados |
| `--neutral-text-inverse` | `#FFFFFF` | Textos sobre fundos escuros (Abismo) |
| `--neutral-text-inverse-low-emphasis` | `#8BAAB8` | Textos secundários sobre fundo escuro — descrições, labels no dark mode |

---

### Primary — Terracota

Cor de ação. Usada em CTAs, elementos interativos principais, marcadores de progresso e qualquer coisa que comunique "faça isso agora".

**Regra:** Nunca use Primary de forma decorativa. Se o elemento não é clicável ou não representa uma ação do usuário, use Neutral ou Highlight.

| Token | Hex | Uso |
|---|---|---|
| `--primary-border` | `#E96731` | Bordas de elementos com destaque primário |
| `--primary-border-hover` | `#C4521A` | Borda primária no estado hover |
| `--primary-icon` | `#E96731` | Ícones com cor primária |
| `--primary-icon-hover` | `#C4521A` | Ícones primários no estado hover |
| `--primary-icon-on-color` | `#E96731` | Ícones sobre fundos escuros (Abismo) — mesma cor, contraste garantido pelo fundo |
| `--primary-icon-on-color-hover` | `#F08A5C` | Ícones on-color no estado hover |
| `--primary-surface-high-emphasis` | `#E96731` | Fundo de botões primários e elementos de máximo destaque |
| `--primary-surface-low-emphasis` | `#FAD5C2` | Fundo sutil de áreas primárias (chip selecionado, alerta primário suave) |
| `--primary-surface-hover` | `#C4521A` | Fundo de botões/elementos primários no estado hover |
| `--primary-text` | `#E96731` | Textos com cor primária |
| `--primary-text-hover` | `#C4521A` | Textos primários no estado hover |
| `--primary-text-on-color` | `#FFFFFF` | Textos sobre o próprio fundo primário (botão preenchido) |
| `--primary-text-on-color-hover` | `#F5E6DF` | Textos on-color no estado hover |

---

### Highlight — Verde Lima

Informações de apoio, ajuda, novidades de produto, dicas contextuais e badges informativos. Não usar para feedback de ação (sucesso, erro, atenção) nem como substituto de Primary.

**Exceção permitida:** o componente Avatar pode usar esta cor como identidade visual de perfil.

| Token | Hex | Uso |
|---|---|---|
| `--highlight-border` | `#D5F57A` | Bordas de elementos de destaque/apoio |
| `--highlight-border-hover` | `#C3ED5A` | Borda highlight no hover |
| `--highlight-icon` | `#D5F57A` | Ícones de destaque/apoio |
| `--highlight-icon-hover` | `#C3ED5A` | Ícones highlight no hover |
| `--highlight-icon-on-color` | `#D5F57A` | Ícones sobre fundos escuros (Abismo) — mesma cor, contraste garantido pelo fundo |
| `--highlight-icon-on-color-hover` | `#E8FBA8` | Ícones on-color no hover |
| `--highlight-surface-high-emphasis` | `#D5F57A` | Fundo de elementos de destaque com forte ênfase (badge "novo", tag de feature) |
| `--highlight-surface-low-emphasis` | `#EEFBB8` | Fundo sutil de áreas de destaque (tooltip de ajuda, fundo de dica) |
| `--highlight-surface-hover` | `#C3ED5A` | Fundo de elementos highlight no hover |
| `--highlight-text` | `#D5F57A` | Textos highlight sobre fundos escuros (Abismo) |
| `--highlight-text-on-color` | `#506812` | Textos highlight sobre o próprio fundo verde (high-emphasis surface) |
| `--highlight-text-on-color-hover` | `#3A4D0E` | Textos on-color no hover |

---

### Success — Verde Musgo

Feedback positivo: ação bem-sucedida, salvo com sucesso, validação OK. **Não deve ser usada de forma decorativa.**

| Token | Hex | Uso |
|---|---|---|
| `--success-border` | `#15803D` | Borda de elementos de sucesso |
| `--success-icon` | `#15803D` | Ícones de sucesso sobre fundos claros |
| `--success-icon-on-color` | `#4ADE80` | Ícones de sucesso sobre fundos escuros |
| `--success-surface-high-emphasis` | `#22C55E` | Fundo de elementos de sucesso com forte destaque |
| `--success-surface-low-emphasis` | `#DCFCE7` | Fundo sutil de áreas de sucesso (input válido, alerta suave) |
| `--success-surface-hover` | `#15803D` | Fundo de sucesso no hover |
| `--success-text` | `#15803D` | Textos de sucesso sobre fundos claros |
| `--success-text-on-color` | `#4ADE80` | Textos de sucesso sobre fundos escuros |

---

### Warning — Âmbar

Situações de atenção não-críticas: avisos reversíveis, dados incompletos, prazos próximos, ações que merecem revisão antes de prosseguir. **Não deve ser usada de forma decorativa.**

| Token | Hex | Uso |
|---|---|---|
| `--warning-border` | `#B45309` | Borda de elementos de atenção |
| `--warning-icon` | `#B45309` | Ícones de atenção sobre fundos claros |
| `--warning-icon-on-color` | `#FCD34D` | Ícones de atenção sobre fundos escuros |
| `--warning-surface-high-emphasis` | `#F59E0B` | Fundo de elementos de atenção com forte destaque |
| `--warning-surface-low-emphasis` | `#FEF3C7` | Fundo sutil de áreas de atenção (input com dado incompleto) |
| `--warning-surface-hover` | `#B45309` | Fundo de atenção no hover |
| `--warning-text` | `#B45309` | Textos de atenção sobre fundos claros |
| `--warning-text-on-color` | `#FCD34D` | Textos de atenção sobre fundos escuros |

---

### Danger — Vermelho

Situações críticas: exclusão de dados, saída do sistema, ações irreversíveis, erros graves. Usar em Botão Danger, Alert de alto risco, Dialog de ações sensíveis. **Não deve ser usada de forma decorativa.**

| Token | Hex | Uso |
|---|---|---|
| `--danger-border` | `#B91C1C` | Borda de elementos de erro |
| `--danger-icon` | `#B91C1C` | Ícones de erro/perigo sobre fundos claros |
| `--danger-icon-on-color` | `#F87171` | Ícones de erro sobre fundos escuros |
| `--danger-surface-high-emphasis` | `#EF4444` | Fundo de elementos críticos com forte destaque |
| `--danger-surface-low-emphasis` | `#FEE2E2` | Fundo sutil de áreas de erro (input inválido, alerta suave) |
| `--danger-surface-hover` | `#B91C1C` | Fundo de elementos de perigo no hover |
| `--danger-text` | `#B91C1C` | Textos de erro sobre fundos claros |
| `--danger-text-on-color` | `#F87171` | Textos de erro sobre fundos escuros |

---

### Nomenclatura dos Tokens de Cor

Nem todas as categorias têm a mesma quantidade de tokens — as variações dependem das aplicações previstas. **Evite usar cores diferentes para o estado default e hover de um mesmo elemento.**

| Sufixo | Significado |
|---|---|
| `on-color` | Alto contraste para textos/ícones sobre fundos escuros (Abismo) ou sobre a própria cor da categoria |
| `high-emphasis` | Tom de maior destaque dentro da paleta |
| `low-emphasis` | Tom de menor destaque — mais suave, uso em fundos e estados secundários |
| `surface` | Preenchimento de elementos acima do background (exceto ícones, textos e bordas) |
| `inverse` | Versão oposta ao modo atual — claro no dark, escuro no light |
| `raised` | Superfície levemente elevada sobre o fundo imediatamente abaixo |
| `disabled` | Estado desabilitado — sem interação possível |
| `hover` | Estado de cursor sobre o elemento |

---

## 2. Tipografia

**Família:** Archivo  
**Import (Google Fonts):** `@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;700;900&display=swap');`  
**Pesos disponíveis:** Regular (400), Bold (700), Extra Bold (900)  
**Sistema:** Os tokens são **agnósticos de elemento HTML** — não estão atrelados a `h1`, `h2`, `p`, etc. A escolha do elemento semântico correto é responsabilidade de quem implementa.

---

### Escala Web (Desktop)

Base: 16px. Escala de 8 pontos.

| Token | Font-size | Line-height | Letter-spacing | Peso recomendado | Quando usar |
|---|---|---|---|---|---|
| `--text-display` | 48px | 56px / 117% | -0.03em | Extra Bold (900) | Headlines de hero, números de impacto em dashboards, métricas principais |
| `--text-xxl` | 40px | 48px / 120% | -0.02em | Extra Bold (900) | Títulos de seção de alta hierarquia, big numbers |
| `--text-xl` | 32px | 40px / 125% | -0.02em | Bold (700) | Títulos principais de página |
| `--text-lg` | 24px | 32px / 133% | -0.01em | Bold (700) | Títulos secundários, subtítulos, nomes de blocos, títulos de modal |
| `--text-md` | 16px | 24px / 150% | -0.01em | Regular (400) / Bold (700) | Textos comuns, labels, inputs, botões, links — **tamanho padrão de interface** |
| `--text-sm` | 14px | 20px / 143% | -0.01em | Regular (400) | Textos secundários, descrições, mensagens de validação, componentes menores |
| `--text-xs` | 12px | 16px / 133% | 0em | Regular (400) | Legendas, rótulos de eixo em gráficos, rodapés, cabeçalhos de coluna de tabela |

---

### Escala Mobile (iOS / Android)

Base: 16px (body). Ajustes para densidade de tela e legibilidade em polegar.

| Token | Font-size | Line-height | Letter-spacing | Peso recomendado | Quando usar |
|---|---|---|---|---|---|
| `--text-display` | 36px | 44px / 122% | -0.02em | Extra Bold (900) | Headlines de destaque máximo — telas de boas-vindas, onboarding |
| `--text-xxl` | 28px | 36px / 129% | -0.02em | Extra Bold (900) | Títulos de seção em dashboards mobile |
| `--text-xl` | 24px | 32px / 133% | -0.01em | Bold (700) | Títulos principais de tela |
| `--text-lg` | 20px | 28px / 140% | -0.01em | Bold (700) | Títulos de card, subtítulos de tela, títulos de bottom sheet |
| `--text-md` | 16px | 24px / 150% | -0.01em | Regular (400) / Bold (700) | Textos de corpo, labels, botões — **tamanho padrão mobile** |
| `--text-sm` | 14px | 20px / 143% | -0.01em | Regular (400) | Descrições, textos de apoio, inputs menores |
| `--text-xs` | 12px | 16px / 133% | 0em | Regular (400) | Legendas, badges de status, carimbos de data/hora |

> **Regra mobile:** Nunca use `--text-xs` para texto interativo ou de leitura corrida. Tamanho mínimo para texto de ação em mobile é `--text-sm` (14px).

---

### Regras de peso por contexto

| Situação | Peso |
|---|---|
| Títulos e hierarquia principal | Extra Bold (900) |
| Subtítulos, labels de destaque, botão primário | Bold (700) |
| Corpo de texto, descrições, placeholders | Regular (400) |
| **Nunca use pesos intermediários** | Archivo não tem Medium — o salto é direto de 400 para 700 |

---

## 3. Espaçamento

Base: **Escala de 8 pontos**. Todos os valores seguem múltiplos de 8px (com exceção do menor, 4px, usado apenas em gaps internos mínimos).

Aplique às propriedades CSS `margin`, `padding` e `gap`.

| Token | Valor | Uso típico |
|---|---|---|
| `--size-spacing-01` | 4px | Gap mínimo interno de componentes muito compactos (ex: entre ícone e badge) |
| `--size-spacing-02` | 8px | Gap entre ícone e label dentro de botão, padding de chip/tag |
| `--size-spacing-03` | 16px | Padding interno de inputs, gap padrão entre elementos de um grupo |
| `--size-spacing-04` | 24px | Padding interno de cards, separação entre grupos de campos em formulário |
| `--size-spacing-05` | 32px | Margem entre cards em lista, separação entre seções dentro de componente |
| `--size-spacing-06` | 40px | Separação entre seções de página, margem vertical de blocos de conteúdo |
| `--size-spacing-07` | 48px | Margens de seções maiores, padding de containers de página |
| `--size-spacing-08` | 64px | Separações estruturais de layout, espaço entre grandes blocos |
| `--size-spacing-09` | 80px | Espaços entre seções de landing page |
| `--size-spacing-10` | 96px | Margens de seções de alta hierarquia |
| `--size-spacing-11` | 128px | Grandes espaços de layout, seções hero |
| `--size-spacing-12` | 160px | Espaçamentos de tela completa, separações máximas de layout |

**Regra:** `--size-spacing-01` a `--size-spacing-04` → estruturas pequenas (componentes internos). A partir de `--size-spacing-05` → composições maiores (patterns, seções, telas).

**Escala mobile:** Use os mesmos tokens. Para espaços acima de `--size-spacing-05`, reduza em ~25% na implementação mobile via `@media`. Os tokens menores permanecem idênticos entre plataformas.

---

## 4. Formatos e Arredondamentos

| Token | Valor | Quando usar |
|---|---|---|
| `--border-radius-none` | 0px | Elementos com estética severa, bordas retas intencionais |
| `--border-radius-xs` | 4px | Chips, tags compactas, badges pequenos |
| `--border-radius-sm` | 8px | Inputs, botões, cards compactos |
| `--border-radius-md` | 12px | Cards médios, painéis, dropdowns |
| `--border-radius-lg` | 16px | Cards grandes, modais, bottom sheets |
| `--border-radius-xl` | 24px | Componentes de destaque, drawers, painéis laterais |
| `--border-radius-pill` | 999px | Botões pill, avatares, progress bars |
| `--border-radius-circle` | 50% | Avatares circulares, ícones em container redondo |

---

## 5. Elevações (Sombras)

A elevação define hierarquia visual entre elementos. As sombras usam o Abismo (`#02131F`) como cor base — isso garante coerência tanto sobre Linho quanto sobre superfícies escuras.

| Token | Nível | CSS Value | Casos de uso |
|---|---|---|---|
| *(sem sombra)* | 1 | — | Nível base: textos, botões flat, formulários |
| `--shadow-xs` | 2 | `0 1px 3px rgba(2,19,31,.12), 0 1px 2px rgba(2,19,31,.08)` | Cards levemente elevados, navbar, hover em card |
| `--shadow-sm` | 3 | `0 4px 6px rgba(2,19,31,.10), 0 2px 4px rgba(2,19,31,.08)` | Dropdown, Popover, DatePicker |
| `--shadow-md` | 4 | `0 10px 15px rgba(2,19,31,.10), 0 4px 6px rgba(2,19,31,.08)` | Toast, elementos flutuantes |
| `--shadow-lg` | 5 | `0 20px 25px rgba(2,19,31,.12), 0 8px 10px rgba(2,19,31,.06)` | Drawer sobre fundo claro |
| `--shadow-xl` | 6 | `0 25px 50px rgba(2,19,31,.25)` | Modal, Dialog, Drawer sobre overlay |

**Regra:** Quanto maior o nível, maior o destaque e mais isolado o elemento deve estar do restante da interface.

---

## 6. Z-index

Controla a sobreposição visual de componentes.

| Token | Valor | Casos de uso |
|---|---|---|
| `--zindex-back` | -1 | Enviar elemento para trás após interação |
| `--zindex-auto` | auto | Posição padrão conforme ordenação no DOM |
| `--zindex-0` | 1 | Elementos selecionados: botões, cards, inputs |
| `--zindex-1` | 1000 | Dropdown e Popover |
| `--zindex-2` | 1010 | Elementos fixados: Navbar, header sticky, Tooltip |
| `--zindex-3` | 1020 | Overlays de Drawer, Modal e Dialog |
| `--zindex-4` | 1030 | Drawer, Dialog e Modal |
| `--zindex-5` | 1040 | Overlays que precisam ficar acima de tudo |
| `--zindex-6` | 1050 | Toast — sempre acima de tudo, inclusive Modal |

---

## 7. Motion (Animação)

Movimentos devem ter propósito claro: destacar mudança de estado, mostrar novo conteúdo ou guiar a atenção do usuário. O MBM tem uma identidade de movimento **precisa e econômica** — sem excessos.

**Princípios:**
- Movimentos não devem fazer o usuário esperar.
- Respeitar metáforas físicas: elemento que entra pela direita sai pela direita.
- Elementos menores se movem mais rápido que elementos maiores.

### Duração

| Token | Valor | Quando usar |
|---|---|---|
| `--motion-duration-extra-fast` | 100ms | Mudanças de estado em elementos pequenos: botões, toggles, checkboxes, inputs |
| `--motion-duration-fast` | 200ms | Microinterações, expansões curtas, dropdowns, selects |
| `--motion-duration-normal` | 300ms | Expansão de elementos médios, alertas, toasts |
| `--motion-duration-slow` | 400ms | Modais, drawers, transições de página |

### Aceleração (Timing Functions)

| Token | Curva CSS | Uso |
|---|---|---|
| `--motion-timing-ease-in` | `cubic-bezier(0.55, 0.055, 0.675, 0.19)` | **Remover** elementos: fechar modal, esconder alerta, recolher sidebar |
| `--motion-timing-ease-out` | `cubic-bezier(0.215, 0.61, 0.355, 1)` | **Apresentar** elementos: abrir modal, mostrar dropdown, expandir card |
| `--motion-timing-ease-in-out` | `cubic-bezier(0.645, 0.045, 0.355, 1)` | Transições de estado: hover, focus, selected, mudança de tema |

---

*MBM Tokens — Versão 1.0 — Maio/2026.*
