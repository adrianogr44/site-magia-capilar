# Auditoria QA Sênior — Magia Capilar / Magia Grow

Data: 2026-06-19 · Escopo: site estático (home + subpáginas + PDPs + institucionais)
Arquivos: `index.html`, `assets/css/magia.css` (2850→linhas), `assets/js/magia.js`,
`sobre/`, `resultados/`, `guia/produtos-para-queda-de-cabelo/`, `produto/*` (6),
`pages/*` (5), `checkout.html`, `lp/nova-landing/`.

> **FASE 2 (padronização visual) JÁ FOI APLICADA** — ver seção final "FASE 2 — aplicado".
> FASE 1 (este relatório) e FASE 3 (humanização) **não alteram o site** — são plano.

---

## Sumário executivo

| Prioridade | Qtde | Definição |
|---|---|---|
| **P0** (crítico) | 3 | Quebra conversão/SEO/segurança séria; corrigir já |
| **P1** (alto) | 6 | Impacto real em SEO/UX/a11y; corrigir nesta sprint |
| **P2** (médio) | 9 | Polimento/consistência; corrigir quando der |
| **P3** (baixo) | 6 | Nice-to-have / editorial |

**Top 3 (P0):**
1. **Home sem `<h1>`** — o maior heading da home é `<h2>` (slides do hero). Prejudica SEO e leitura por leitor de tela.
2. **Duas seções duplicadas de tema** — "dor/fases" (`#bfeat-origem` + `#historia-cabelo`) e "como funciona" (`.how-it-works` + `#como-funciona`) dizem quase a mesma coisa. Diluem a mensagem e empurram a oferta pra baixo.
3. **Sem cabeçalhos de segurança / CSP** (nível servidor) e **sem SRI** nos scripts de terceiros — exposição a injeção/clickjacking. (Mitigar no Nginx — checklist abaixo.)

Estado geral: **base sólida e coesa** (tokens, tracking com Consent Mode v2, carrinho funcional, fontes editoriais Fraunces+DM Sans). Os problemas são de **hierarquia/ordem e consistência**, não de fundação.

---

## 1. Lista priorizada (Onde / O que / Impacto / Correção)

### P0
1. **Onde:** `index.html` (hero). **O que:** nenhum `<h1>` na home (headlines do hero são `h2.bfeat-h`). **Impacto:** SEO (sinal de tópico principal ausente) + a11y (hierarquia). **Correção:** promover a headline do slide ativo do hero a `<h1>` (ou adicionar um `<h1>` visualmente integrado). *Decisão de conteúdo → não aplicado.*
2. **Onde:** home, seções 2/4 e 8/12. **O que:** temas duplicados (origem/dor e como-funciona). **Impacto:** conversão (mensagem diluída, página longa demais). **Correção:** fundir cada par em uma seção só (ver Reorg). *Estrutural → não aplicado.*
3. **Onde:** servidor + `<head>` de todas as páginas. **O que:** sem HSTS/CSP/XFO/nosniff e sem SRI nos `<script>` de GTM/GA/Pixel/Fonts. **Impacto:** segurança. **Correção:** headers no Nginx (checklist §8) + SRI onde aplicável.

### P1
4. **Onde:** `sitemap.xml`. **O que:** faltam `/sobre/`, `/guia/produtos-para-queda-de-cabelo/`, `/resultados/`. **Impacto:** descoberta/indexação das páginas novas. **Correção:** adicionar os 3 `<url>`.
5. **Onde:** home FAQ (`#faq`, 6×`.faq-q`). **O que:** botões sem `aria-expanded` (subpáginas têm; o JS não alterna esse atributo em lugar nenhum). **Impacto:** a11y (estado do acordeão não anunciado). **Correção:** adicionar `aria-expanded` no HTML e alternar no `magia.js` (JS fora de escopo desta tarefa).
6. **Onde:** `#protocolo` está na posição ~10 da home. **O que:** oferta-âncora muito abaixo da dobra. **Impacto:** conversão. **Correção:** subir (ver Reorg).
7. **Onde:** `.needs-section` depois da newsletter. **O que:** navegação por necessidade enterrada após o CTA de e-mail. **Impacto:** descoberta/UX. **Correção:** mover pra antes do FAQ (ver Reorg).
8. **Onde:** larguras de container. **O que:** `--container:1240px` (`.container`) convive com `max-width:1200px` literal em `.needs-section`/`.guia-related`/`.how-it-works`/`.prods-grid`. **Impacto:** leve desalinhamento de borda entre seções. **Correção:** padronizar tudo em `var(--container)` ou criar `--container-grid:1200px` consciente. *(decisão de design → não apliquei pra não mexer em layout)*
9. **Onde:** breakpoints. **O que:** mistura de 640/700/900/1000/1200px entre componentes. **Impacto:** comportamento responsivo inconsistente em faixas intermediárias. **Correção:** consolidar numa escala (ex.: 600/900/1200).

### P2
10. **CSS órfão** (sem uso em nenhum HTML): `.video-wrap`+filhos, `.prods-grid-center`, e remanescentes do hero antigo `.hero-seal`, `.hero-content`/`.hero-content .eyebrow/h1/p`. **Correção:** remover (deixei documentado, não removi — `.video-wrap` ainda é referenciado por `initVideos()` no JS; confirmar antes).
11. **Alt vazio** em avatares de avaliações (`alt=""`) — aceitável como decorativo, mas como são fotos de pessoas com nome ao lado, um alt curto ("Foto de Patrícia") seria melhor. P2/P3.
12. **`#historia-cabelo`** reusa `.fundadora-wrap` mas é infográfico — ok; só citar na fusão com `#bfeat-origem`.
13. **JSON-LD Product** ausente nas PDPs (`produto/*`) — verificar/adicionar `Product` + `Offer` + `AggregateRating`. (Não auditei o interior de cada PDP a fundo.)
14. **Cores fallback divergentes**: `var(--ok, #2d7a3e)` (fallback ≠ `--ok` #2F7D4F) e `#FFF9F0`/`#F4EFE6` one-off. Baixo impacto.
15. **`loading="lazy"`** em imagens "above-the-fold" nas subpáginas (ex.: foto da Berenice em `/sobre/` usa `eager` ✓; conferir hero de cada PDP).
16. **Consistência de radius**: cards usam 12/14/18px misturados. Padronizar por tipo de card.
17. **Sombra**: `--shadow-sm/--shadow/--shadow-lg` coexistem com sombras rgba inline iguais em vários blocos novos — poderiam usar os tokens.
18. **`aria-disabled="true"` + `pointer-events:auto`** nos placeholders (`.need-card--placeholder`, related/tags) — o link `#` ainda navega pro topo. Trocar para `pointer-events:none` ou `<span>`/`<button disabled>`.

### P3
19. Microcopy genérica (ver §Anti-IA 3.3).
20. Ritmo visual repetitivo (mesmo cream + grid 4 col) — ver §Anti-IA 3.2.
21. Falta de itálico editorial em alguns títulos — ver §Anti-IA 3.1.
22. `lp/nova-landing/index.html` é stub (32 linhas, `background:#fff`) — confirmar propósito ou remover.
23. `checkout.html` tem CSS próprio inline (tokens `--serif/--sans` já = Fraunces/DM Sans ✓) — ok, mas duplica paleta; poderia importar `magia.css`.
24. Falta `font-display: swap`? — **presente** em todos os links de fonte (`&display=swap`). OK. ✅

---

## 2. Reorganização das seções da home (proposta — NÃO aplicada)

### Ordem ATUAL
| # | Seletor | Conteúdo |
|---|---|---|
| 1 | `.hero#inicio` | Carrossel (Autoestima / Protocolo / Rotina) |
| 2 | `#bfeat-origem` | "Tem fases em que o cabelo sente junto" (dor) |
| 3 | `.selos` | 4 selos (frete/vegano/tricologista/cruelty) |
| 4 | `#historia-cabelo` | "Tem fases…" / por que importa (**dor duplicada**) |
| 5 | `#categorias` | Carrossel de categorias |
| 6 | `#resultados` | Reels + antes/depois |
| 7 | `.results-wall` | Parede de resultados (preview) + CTA |
| 8 | `.how-it-works` | Rotina simples (4 cards + 2 fotos) |
| 9 | `#historia` | Berenice (autoridade) |
| 10 | `#protocolo` | Protocolo 90 dias (oferta principal) |
| 11 | `#produtos` | Grade de produtos |
| 12 | `#como-funciona` | "Sua rotina em 4 passos" (**how-funciona duplicado**) |
| 13 | `#faq` | FAQ |
| 14 | `.section.bg-ivory` | Avaliações |
| 15 | `.section` | Newsletter |
| 16 | `.needs-section` | Produtos por necessidade |

### Ordem PROPOSTA
| # | Seção | Razão (1-2 linhas) |
|---|---|---|
| 1 | Hero (`#inicio`) | CTA primário acima da dobra — mantém. |
| 2 | Selos (`.selos`) | Barra de confiança imediata logo após o hero. |
| 3 | Prova social (`#resultados` + `.results-wall`) | Mostrar gente real cedo aumenta credibilidade antes do pitch. |
| 4 | Dor/origem (**fundir** `#bfeat-origem` + `#historia-cabelo` em 1) | Uma única seção de dor, mais forte; elimina repetição. |
| 5 | Oferta (`#protocolo`) | Subir a oferta-âncora — hoje está muito fundo. |
| 6 | Produtos (`#produtos`) | Logo após a oferta, pra quem quer montar à la carte. |
| 7 | Como funciona (**fundir** `.how-it-works` + `#como-funciona`) | Uma rotina só (cards visuais + passos), sem duplicar. |
| 8 | Categorias (`#categorias`) | Navegação ampla depois do core de conversão. |
| 9 | Autoridade (`#historia` — Berenice) | Reforça confiança perto da decisão. |
| 10 | Necessidade (`.needs-section`) | Tirar de depois da newsletter; vira hub interno. |
| 11 | FAQ (`#faq`) | Quebra de objeção antes do CTA final. |
| 12 | Avaliações | Última leva de prova social. |
| 13 | Newsletter (CTA final) | Captura quem não comprou — fecha a página. |

**Decisão humana** (não apliquei): a fusão das duplicatas remove conteúdo; precisa do seu OK item a item.

---

## 3. Acessibilidade (A11Y)
- ❌ **Home sem `<h1>`** (P0 #1).
- ⚠️ FAQ da home sem `aria-expanded` (P1 #5). Subpáginas têm o atributo, mas **nenhuma** página o alterna no JS (o `initFaq` só troca a classe `.open`). Recomendado: `btn.setAttribute('aria-expanded', ...)` no toggle.
- ✅ `<button>` vs `<a>`: corretos (CTA de compra = `<button data-add-cart>`; navegação = `<a>`).
- ✅ Cart drawer (`aside aria-label`), consent banner (`role="dialog" aria-live`).
- ⚠️ Alt: hero/produtos descritivos ✓; avatares de avaliação com `alt=""` (decorativo — tolerável).
- ⚠️ Foco visível: não há `:focus-visible` custom — depende do default do browser. Recomendado outline wine consistente.
- Contraste: wine (#6E1F2A) sobre cream ✓; texto `--ink-muted` (#6A5D63) sobre cream ≈ 4.6:1 (passa AA pra texto normal, no limite). `--smoke` sobre cream em textos pequenos: verificar.

## 4. SEO técnico
- ✅ `<title>`/`<meta description>` únicos por página; canonical em todas.
- ✅ OG/Twitter presentes.
- ✅ JSON-LD: home (Store), `/guia/` (Breadcrumb+Article+FAQ), `/sobre/` (Breadcrumb+Person+FAQ), `/resultados/` (Breadcrumb).
- ⚠️ **PDPs**: confirmar `Product`/`Offer` JSON-LD (P2 #13).
- ❌ **sitemap.xml** desatualizado (P1 #4) — faltam sobre/guia/resultados.
- ✅ `robots.txt` presente.

## 5. Performance
- ✅ Hero LCP: `loading="eager" fetchpriority="high"` no 1º slide.
- ✅ `font-display: swap` em todos os links de fonte.
- ✅ `magia.js` com `defer`; GA `async`.
- ✅ `<picture>`+webp nas imagens de produto; `width/height` declarados (CLS baixo).
- ⚠️ CSS sem cache-bust em algumas páginas antigas (home/guia/sobre têm `?v=20260619`; PDPs e `pages/*` ainda sem versão). Recomendado padronizar `?v=` em todos.
- ⚠️ Fontes: o link pede muitos pesos/ital de Fraunces (opsz 9..144, 5 pesos + ital) — peso de download. Avaliar reduzir aos pesos realmente usados (400/500/600/700 + ital 400).

## 6. Conversão e carrinho
- ✅ `data-add-cart` com `data-prod-id/nome/preco/img` completos; preços batem com o exibido (cat. 1/2/3/4/5/7).
- ✅ Slugs consistentes (`/produto/<slug>/`).
- ⚠️ Âncora **`#kit` não existe** — a seção é `#protocolo`. Já corrigi os CTAs de `/guia/` e `/sobre/` pra `/#protocolo`; **conferir** se algum criativo/anúncio aponta pra `/#kit`.
- ✅ Estados de hover/foco nos botões.

## 7. Tracking
- ✅ GTM (`GTM-WTJPZFP9`) script no head + `noscript` no body, em todas as páginas.
- ✅ GA4 (`G-8GNVTQLY7F`) + Consent Mode v2 (default denied → update on grant).
- ✅ Meta Pixel (`1513052463085684`) consent-gated.
- ✅ `view_item_list` só na home (vitrine); ausente nas páginas de conteúdo (correto).
- ✅ Sem secrets/tokens privados no client (IDs de GTM/GA/Pixel são públicos por natureza).

## 8. Segurança

### Checklist de headers (aplicar no Nginx — não dá pra setar via HTML)
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### CSP inicial proposta (restritiva mas funcional p/ a stack atual)
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://www.google-analytics.com https://www.facebook.com https://www.googletagmanager.com;
  connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://connect.facebook.net https://magia-capilar.pay.yampi.com.br;
  frame-src https://www.googletagmanager.com;
  base-uri 'self';
  form-action 'self' https://magia-capilar.pay.yampi.com.br;
```
> `'unsafe-inline'` em script é necessário porque GTM/Consent/Pixel são inline. Para endurecer depois: migrar pra nonce/hash. Testar em `Content-Security-Policy-Report-Only` antes de enforce.

### No código
- ⚠️ **Sem SRI** em `<script src>` de terceiros (GTM/GA/Pixel mudam de conteúdo — SRI é inviável neles; aplicar SRI só se hospedar libs estáticas próprias).
- ✅ Sem mixed content (tudo `https://`).
- ⚠️ `innerHTML` usado no `magia.js` (toast removido; carrinho monta itens). Conteúdo é interno (nomes/preços do próprio catálogo) — baixo risco; ainda assim, escapar valores antes de injetar.
- ✅ `localStorage`: só `magia_consent` e carrinho — sem dado sensível/token.
- ✅ iframe GTM noscript: oculto, sem interação.
- ✅ Sem libs de terceiros com CVE (vanilla JS, sem jQuery/bootstrap).

## 9. HTML/CSS/JS quality
- ✅ Sem `console.log`/`debugger` em `magia.js`.
- ✅ `!important`: só 3 ocorrências, **todas legítimas** (`.hide` utilitário; 2 em `prefers-reduced-motion` pra forçar override de animação). Nada a remover.
- ⚠️ CSS órfão (P2 #10).
- ⚠️ IDs duplicados entre páginas (`#inicio`, `#nav`, `#magia-consent-banner`) — ok porque são páginas separadas.

## 10. Consistência visual (foco)
- ✅ **Fontes**: agora 100% `var(--f-serif)`/`var(--f-sans)` (Fraunces+DM Sans) no CSS principal **e** nas 5 institucionais (eram Montserrat/Open Sans não-carregadas). Zero Playfair/Montserrat/Open Sans no projeto.
- ✅ **Cores**: hex disperso consolidado em tokens (ver FASE 2).
- ⚠️ **Espaçamento entre seções**: varia (`padding:64/96` em `.bfeat`/`.how`/`.needs` vs `--section-y` clamp em `.section`). Unificar.
- ⚠️ **Radius/Sombra**: leve mistura (12/14/18px). Padronizar por tipo.
- ✅ **Botões**: `.btn` primary/outline/ghost padronizados.

---

## FASE 2 — Aplicado (padronização visual, sem mexer em layout/conteúdo)

### Fontes
- `magia.css` já estava 100% em `var(--f-serif)`/`var(--f-sans)` (tokens definidos em `:root`: Fraunces + DM Sans). **Nada a migrar lá.**
- **5 páginas institucionais** (`pages/*.html`): `:root` trocado de `--serif:'Montserrat'`/`--sans:'Open Sans'` (que **não estavam carregadas** → caíam em fallback de sistema) para **`Fraunces`/`DM Sans`** (que essas páginas já carregavam via Google Fonts). Resultado: passam a renderizar na tipografia da marca. Verificado por screenshot — sem quebra, melhora visual.
- `checkout.html`: já estava em Fraunces/DM Sans. Sem mudança.

### Cores (consolidação de hex disperso → tokens)
Novos tokens em `:root`:
```css
--border:     #E8E2DC;   /* antes via var(--border,#E8E2DC) em 12 lugares */
--ink-muted:  #6A5D63;   /* texto secundário — 13 ocorrências */
--cream-deep: #F5EDE6;   /* cream profundo (boxes/foto bg) — 6 ocorrências */
```
Substituições aplicadas em `magia.css`:
- `var(--border, #E8E2DC)` → `var(--border)` (×12)
- `#FAF4EE` → `var(--cream)` (×7) — diferença ≤1/canal vs `--cream`, imperceptível; elimina o "segundo cream".
- `#F5EDE6` → `var(--cream-deep)` (×6)
- `#6A5D63` → `var(--ink-muted)` (×13)

### Tokens de espaçamento/radius/sombra
**Não criei `--space-*`/`--radius-*`/`--shadow-*` novos**: já existem equivalentes (`--sp-1..24`, `--r`/`--r-sm`/`--r-lg`/`--pill`, `--shadow-sm`/`--shadow`/`--shadow-lg`). Criar paralelos só aumentaria a duplicação que a auditoria critica. Recomendação: migrar os valores px soltos dos blocos novos pra esses tokens (item de polimento, não apliquei pra não alterar espaçamentos).

### Limpeza
- `!important`: nenhum removido (os 3 são legítimos).
- CSS órfão: **documentado, não removido** (`.video-wrap` ainda é alvo de `initVideos()` no JS; `.prods-grid-center`/`.hero-seal`/`.hero-content*` são resíduos seguros de remover numa próxima passada com confirmação).

### Validação visual
Home e `/pages/envio-e-entrega.html` renderizados em Chrome headless após as mudanças: **sem quebra**. Consolidações de cor são imperceptíveis (Δ ≤ ~9 num canal, em tons já escuros/claros).

---

## FASE 3 — Anti-IA: Recomendações de humanização (NÃO aplicadas)

### 3.1 Itálicos editoriais (Fraunces ital)
- `#bfeat-origem` h2: "Tem fases em que o cabelo *sente junto*" (já tem `<em>` ✓ — manter padrão).
- `#historia` (Berenice): "Paixão e *ciência*".
- `.needs-section`: "Produtos por *necessidade*" (já tem ✓).
- `#protocolo`: "Tudo que um ciclo capilar *pede*" (já tem ✓).
- Adicionar em: Avaliações → "O que elas *dizem*"; Categorias → "Nossa *linha*".

### 3.2 Variação de ritmo
- Hoje muitas seções compartilham fundo cream + grid de 4 colunas → monótono. Propor:
  - Alternar fundos: cream → ivory → **wine-deep** (1 seção escura, ex.: o CTA do Protocolo ou uma faixa de depoimento) pra criar respiro.
  - Variar densidade: uma seção em **banner único full-bleed**, outra em **lista editorial** (não tudo card-grid).
  - `#historia` (Berenice) poderia ser full-bleed com foto sangrando até a borda.

### 3.3 Microcopy (voz de marca > genérico)
| Genérico atual | Sugestão com voz |
|---|---|
| "Resultados reais" | "Clientes da Magia, sem filtro" |
| "Como funciona" | "Como a rotina entra na vida real" |
| "Escolha por onde começar" | "Começa por onde fizer sentido pra você" |
| "Produtos por necessidade" | "Acha pelo que tá te incomodando" |
| "A transformação que dá pra ver" | "O antes e depois que ninguém editou" |

### 3.4 Detalhes editoriais
- Usar números grandes em **Fraunces ital** como grafismo: os "01–04" do `.how-step`/`.sobre-bagagem` (já existem ✓) e o "16+ anos" da bagagem como display gigante.
- Variar border-radius: nem tudo 14px — cards de produto 12px, cards focais 18-22px, foto hero com um canto reto (assimetria editorial).
- Uma sombra mais dramática **só** no card da oferta (Protocolo) pra hierarquia — não a mesma sombra em tudo.
- Uma seção full-bleed (sem `.container`) pra quebrar o ritmo — ex.: faixa de depoimento em vídeo.

### 3.5 Imperfeição intencional
- Headline do hero com **quebra manual** (`<br>`) num ponto escolhido, em vez de deixar o browser decidir.
- 1-2 seções com largura **mais estreita** (`--container-narrow`, ~720px) pra dar cara de revista (a `/guia/` já faz isso ✓ — trazer pra home na seção de história).
- Ornamento minúsculo: um separador com traço/floreio entre o fim do conteúdo editorial e o CTA (SVG pequeno wine), do tipo que gerador automático não coloca.

---

## Apêndice — Tokens de cor canônicos (pós-consolidação)
`--cream #F9F5EF` · `--cream-deep #F5EDE6` · `--ivory #FFFDF8` · `--ink #1C1018` ·
`--ink-soft #3A2E34` · `--ink-muted #6A5D63` · `--smoke #8E8783` · `--border #E8E2DC` ·
`--mist #D5CFC9` · `--blush #ECDDD3` · `--wine #6E1F2A` (+ h/d/soft) ·
`--gold #C4956A` (+ lt/d) · `--sage #6B7F5E` · `--ok #2F7D4F` · `--warn #B4531B`.
Fontes: `--f-serif: Fraunces` · `--f-sans: DM Sans`.
