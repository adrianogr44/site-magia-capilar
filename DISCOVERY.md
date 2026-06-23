# DISCOVERY — Magia Capilar (varredura de design/front-end)

> Documento **somente de mapeamento**. Não há propostas de solução nem refatoração.
> Gerado em 2026-06-23. Onde uma convenção não existe, está escrito "não há convenção definida".

---

## 1. Estrutura

### Árvore relevante (ignorando .git/node_modules/dist/build/vendor)

```
/
├── index.html                         ← home (LP principal)
├── checkout.html                      ← checkout (CSS e JS próprios, inline)
├── DISCOVERY.md
├── assets/
│   ├── css/magia.css                  ← ÚNICO CSS externo do site
│   └── js/magia.js                    ← ÚNICO JS de front-end compartilhado
├── pages/                             ← 5 páginas legais (template próprio, CSS inline)
│   ├── envio-e-entrega.html
│   ├── politica-de-pagamento.html
│   ├── politica-de-privacidade.html
│   ├── termos-e-condicoes.html
│   └── trocas-e-devolucoes.html
├── produto/                           ← 6 PDPs (mesmo template base)
│   ├── kit-completo-magia-grow/index.html
│   ├── mascara-ultra-hidratante/index.html
│   ├── massageador-capilar/index.html
│   ├── shampoo-dht/index.html
│   ├── tonico-antiqueda/index.html
│   └── vitamina-magia-grow/index.html
├── sobre/index.html
├── resultados/index.html
├── guia/produtos-para-queda-de-cabelo/index.html
├── lp/nova-landing/index.html         ← shell dinâmico (noindex; conteúdo via Supabase)
├── img/                               ← assets de imagem (+ subpastas: avaliacoes/, banners/, resultados/, _originals/)
└── uploads/produtos/                  ← galeria PDP (só 1 arquivo no disco)
```

### Pontos de entrada HTML e ordem de carregamento

| Página | CSS (ordem) | JS (ordem) |
|---|---|---|
| `index.html` | preconnect fonts → preload+`<link>` Google Fonts → preload+`<link>` `/assets/css/magia.css?v=20260623g` | GTM inline → consent inline → Meta Pixel inline → GA4 (gtag) inline → `/assets/js/magia.js?v=1779896075` (defer) |
| `sobre/index.html` | `/assets/css/magia.css?v=20260619` | idem + `magia.js?v=1779896075` |
| `guia/.../index.html` | `/assets/css/magia.css?v=20260619` | idem |
| `resultados/index.html` | `/assets/css/magia.css` (**sem `?v=`**) | idem + JSON-LD breadcrumb inline |
| `produto/*/index.html` | `/assets/css/magia.css` (**sem `?v=`**) | GTM/Pixel/GA4 inline + `magia.js?v=1779896075` |
| `checkout.html` | **`<style>` inline** (não usa magia.css) + Google Fonts | GTM/consent/Pixel inline + **lógica de checkout inline** (sem magia.js) |
| `pages/*.html` (5) | **`<style>` inline** (não usa magia.css) | **apenas GTM inline** |
| `lp/nova-landing/index.html` | nenhum (conteúdo dinâmico) | GTM/consent inline + `<script>` externo Supabase serve a página |

**Tag tipográfica comum:** Google Fonts via `preconnect` (googleapis + gstatic) → `preload as=style` → `<link rel=stylesheet>` com `display=swap`. Presente em todas as páginas "ricas"; checkout e legais também puxam fontes mas com seu próprio CSS.

---

## 2. CSS

### Arquivos CSS e cobertura

- **`assets/css/magia.css`** — único stylesheet externo; cobre **todo** o sistema de design das páginas ricas: reset, tipografia, layout/container, header/nav, hero, selos, carrosséis, antes/depois, reels, PDP, cart drawer, protocolo, produtos, how-it-works, categorias, needs, FAQ, reviews, guia, sobre, resultados, footer, consent.
- **CSS inline em `checkout.html`** — bloco `<style>` próprio (prefixos `ck-*`, `sum-*`, `cart-section`, `frete-section`); **não** reaproveita os tokens de magia.css.
- **CSS inline nos 5 `pages/*.html`** — template legal próprio (`top-bar`, `hero`, `content`, `footer`); **não** reaproveita os tokens.

### Variáveis CSS (`:root` de magia.css)

**Cores**
| Token | Valor | | Token | Valor |
|---|---|---|---|---|
| `--cream` | `#F9F5EF` | | `--gold` | `#C4956A` |
| `--ivory` | `#FFFDF8` | | `--gold-lt` | `#DBBFA5` |
| `--ink` | `#160C12` | | `--gold-d` | `#A0774C` |
| `--ink-soft` | `#2E2329` | | `--sage` | `#6B7F5E` |
| `--smoke` | `#7C736F` | | `--blush` | `#ECDDD3` |
| `--mist` | `#D5CFC9` | | `--ok` | `#2F7D4F` |
| `--wine` | `#6E1F2A` | | `--warn` | `#B4531B` |
| `--wine-h` | `#8B2530` | | `--border` | `#E8E2DC` |
| `--wine-d` | `#4A1219` | | `--ink-muted` | `#564C52` |
| `--wine-soft` | `#A5354A` | | `--cream-deep` | `#F5EDE6` |

**Raios:** `--r:14px` · `--r-sm:8px` · `--r-lg:22px` · `--pill:999px`
**Sombras:** `--shadow-sm:0 2px 10px rgba(28,16,24,.05)` · `--shadow:0 4px 24px rgba(28,16,24,.08)` · `--shadow-lg:0 14px 44px rgba(28,16,24,.12)`
**Easing/durations:** `--ease:cubic-bezier(.4,0,.2,1)` · `--fast:.18s var(--ease)` · `--med:.32s var(--ease)` · `--slow:.5s var(--ease)`
**Espaçamento (escala):** `--sp-1:4` `--sp-2:8` `--sp-3:12` `--sp-4:16` `--sp-5:20` `--sp-6:24` `--sp-8:32` `--sp-10:40` `--sp-12:48` `--sp-16:64` `--sp-20:80` `--sp-24:96` (px)
**Ritmo vertical:** `--section-y: clamp(46px, 5.2vw, 80px)` (único token "novo" do redesign)
**Tipografia:** `--f-serif: "Fraunces","Georgia","Times New Roman",serif` · `--f-sans: "DM Sans",system-ui,-apple-system,"Segoe UI",Arial,sans-serif`
**Container:** `--container:1240px` · `--container-narrow:760px`
**Header:** `--header-h:88px` · `--announce-h:44px`
**Breakpoints / z-index:** **não há tokens** — breakpoints são literais nas media queries; z-index é hardcoded inline (ver abaixo).

### Fontes em uso
- **Fraunces** (serif, títulos/destaques editoriais) — `--f-serif`.
- **DM Sans** (sans, corpo/UI/preços) — `--f-sans`.
- **Carregamento:** Google Fonts via `<link>` (preconnect + preload + stylesheet, `display=swap`). **Sem `@font-face`, sem `@import`.**
- **Pesos pedidos:** DM Sans 400/500/600/700 + itálico 400; Fraunces 400/500/600/700 + itálico 400/600 (eixos `opsz`).

### `!important` (apenas 2 ocorrências, ambas legítimas)
- `magia.css:1655` — `.hide { display: none !important; }`
- `magia.css:1683-1684` — bloco `@media (prefers-reduced-motion: reduce)`: `* { animation-duration:.01ms !important; transition-duration:.01ms !important; }`

### Valores hardcoded que poderiam ser token
- **22 ocorrências** de cores rgba hardcoded em sombras/realces (`rgba(26,15,21,…)`, `rgba(110,31,42,…)` ≈ `--wine`, `rgba(28,16,24,…)` ≈ base das `--shadow*`). Vários hovers de card definem `box-shadow` literal em vez de usar `--shadow`/`--shadow-lg`.
- Durations de transição literais (`.25s`, `.3s`, `.35s`, `.4s`, `.55s`, `.6s`) em vez de `--fast/--med/--slow`.
- **z-index sem token:** valores literais espalhados (`9999` lightbox, `100`/`90` cart drawer/overlay, `7`/`5`/`4` antes-depois). Não há convenção de escala de z-index.

### Duplicação / CSS morto aparente
- String de transição `transform .25s ease, box-shadow .25s ease, border-color .25s ease` repetida em `.prods-grid .prod-card`, `.need-card`/`.related-card`, etc.
- `.need-card--placeholder` (e `:hover`) — **órfã**: nenhum elemento usa mais essa classe (os cards de necessidade voltaram a ser `<a>`); regra `[aria-disabled="true"]{pointer-events:none}` permanece como utilitário genérico.
- `img/_originals/*` e séries `Frame_13..25` (ver seção 5) não têm referência — relacionado a assets, não a CSS.

### Breakpoints reais e orientação
Mistura de **mobile-first e desktop-first** (não é consistente):
- **min-width (mobile-first):** 600, 640, 700, 768, 900, 1000, 1024, 1100 px.
- **max-width (desktop-first):** 560, 640, 760, 860, 899, 900, 960 px.
- Há pares de fronteira `899/900` (hero/PDP antigos usam `max-width`, blocos novos usam `min-width: 900`). O comentário-cabeçalho do arquivo declara "mobile-first nos blocos novos; geometria existente preservada".

---

## 3. HTML / estrutura visual

### Seções por página (na ordem de render)

**`index.html`**
1. `div.announce` · 2. `header.site-header` · 3. `main` → `section.hero#inicio` (carrossel 3 slides) · 4. `section.selos` · 5. `section#resultados.section.bg-ivory` (sliders antes/depois) · 6. `div.results-wall` · 7. `section.bfeat.bfeat--reverse#bfeat-origem` · 8. `section.protocolo-section#protocolo` · 9. `section#produtos.section.bg-ivory` (6 cards) · 10. `section.how-it-works` · 11. `section#categorias.section` · 12. `section#historia.section` · 13. `section.needs-section` · 14. `section#faq.section` · 15. `section.reviews-section` · 16. `footer.site-footer` · 17. `div.cart-overlay` + `aside.cart-drawer` · 18. `div.consent-banner`

**`checkout.html`** — `header.ck-hdr` → `main.ck-wrap` (`div.ck-left`: `#cartSection`, `#sugSection`, `.frete-section`, `#btnBuy`, `#rError` · `div.summary#summary`: `.sum-hd`, `.sum-totals`, `.cupom-section`, `.trust-section`, `.sec-bar`) → `#emptyCart` (hidden) → `#loading` (hidden).

**`sobre/index.html`** — announce/header → `main.sobre-page` (`section.sobre-hero`, `section.sobre-bagagem` [reusa `.how-step`], `section.sobre-faq`, `section.sobre-magia-grow`) → footer/cart/consent.

**`resultados/index.html`** — announce/header → `main.results-page` (`section.results-hero` [breadcrumb], `section.results-page-grid-wrap` [4 fotos], `section.results-page-cta`) → footer/cart/consent.

**`guia/produtos-para-queda-de-cabelo/index.html`** — announce/header → `main.guia-page` (`article.guia-article` [header+curadora], `section.guia-prods` [4 cards], `article.guia-article` [corpo, vários `h2.guia-h2`], `section.guia-cta`, `section.guia-faq`, `section.guia-related` [links desabilitados], `section.guia-tags` [pills desabilitadas]) → footer/cart/consent.

**`produto/*/index.html`** — template base comum: announce/header → `main` (breadcrumb → `div.pdp-main`: `div.pdp-gallery` + `div.pdp-info` → `section.section.bg-ivory` "Combine com"). Variações por produto: massageador tem `pdp-blocks` (benefícios + como usar) e galeria **sem thumbnails**; vitamina tem tiers de preço, "compre junto", reviews.

**`pages/*.html`** (5, template idêntico) — `div.top-bar` → `div.hero` (com `h1`) → `div.content` (`h2`/`h3`/`p`/`ul`) → `div.footer`.

**`lp/nova-landing/index.html`** — shell `noindex,nofollow`; só GTM/consent + `<script>` Supabase que injeta o conteúdo. Sem headings/CSS estáticos.

### Problemas de HTML semântico
- **`index.html`:** `h1` é `visually-hidden`; títulos de seção são `h2`; sub-blocos `h3`. Um único h1 — OK. Imagem do carrossel de categorias **sem `alt`** (≈ linha 551).
- **`checkout.html`:** sem `h1` (página transacional; começa em `h3`). Logo (`img/Group_24.png`) **sem width/height**. SVGs de ícone sem `aria-hidden`.
- **`produto/massageador` e `produto/vitamina`:** **pulo de heading `h2 → h4`** (sem `h3`) nos cards de benefício. Imagem principal da PDP e thumbnails frequentemente **sem `alt`/sem width/height**.
- **`pages/*.html`:** `h1` colocado dentro de `div.hero` (container de estilo); **sem landmarks** `<main>`/`<article>`; logo sem width/height.
- **Imagens sem dimensão (CLS):** os 6 antes/depois (`ba_*`), logo do header, imagens do carrossel de categorias (`shampoo_hd.webp`, `mascara.webp`), `berenice_fundadora.webp`, imagens do results-wall/results-carousel.
- **`lp/nova-landing`:** auditoria semântica não se aplica (conteúdo dinâmico externo).

---

## 4. JavaScript (front-end)

### Arquivos e responsabilidade
- **`assets/js/magia.js`** — IIFE único, `'use strict'`. Inicializa em `DOMContentLoaded`. Componentes:
  - `initHeader` — sombra do header no scroll (`.scrolled`); toggle do menu mobile (`.burger`/`.nav`).
  - `initHeroSlideshow` — carrossel do hero: dots gerados, autoplay (`data-interval`, default 6000), pause no hover, **swipe touch**, setas prev/next. Alterna classe `.active`.
  - `initCarousels` — carrossel genérico `.carousel-wrap`: setas (1 card por clique), autoplay ping-pong opcional (`data-autoplay`, default 5000) que respeita `prefers-reduced-motion`.
  - `initFaq` — acordeão (`.faq-item`/`.faq-q`, fecha irmãos).
  - `initAntesDepois` — slider antes/depois via `input[range]` → `--pos`.
  - `initVideos` / `initReels` + `ensureReelsLightbox` — player lazy e lightbox de reels (cria `#reels-lightbox` no DOM, fecha com Esc/click-fora).
  - `initPdpGallery` / `initPdpQty` — troca de imagem principal por thumb; stepper de quantidade.
  - **Cart** (`cartRead/Write/Add/Remove/UpdateQty/Total/Count/Render`, `openCart/closeCart`, `initCart`) — drawer local; botões `[data-add-cart]` e `.cj-add-btn` ("compre junto"); `.cart-checkout-btn`.
  - `initSelectItem` — tracking `select_item`.
  - `initNewsletter` — POST `/api/newsletter`.
  - `initFreteCheck` — GET `/api/frete?cep=`.
- **`checkout.html`** — lógica de checkout própria, **inline** (não usa magia.js): lê o mesmo carrinho, sugestões, cupom, frete por CEP, botão comprar.

### Componentes visuais/interação
Carrossel do hero (autoplay+swipe+dots), carrossel genérico (autoplay ping-pong), acordeão FAQ, slider antes/depois, lightbox de reels, galeria PDP (thumb→main), stepper de quantidade, cart drawer, micro-interações de hover (definidas em CSS, não em JS).

### ⚠️ Dados que alimentam a UI via JS
- **NÃO HÁ arrays/objetos de dados em `magia.js` que alimentem a UI.** Todo o conteúdo (imagens de carrossel, depoimentos/avatares, cards, "compre junto", preços) está **no HTML**, via atributos `data-*`:
  - Add-to-cart: `data-prod-id`, `data-prod-nome`, `data-prod-preco`, `data-prod-img`, `data-prod-qty`.
  - Compre junto (`.cj-add-btn`): `data-cj-count`, `data-cj-id-{i}`, `data-cj-nome-{i}`, `data-cj-preco-{i}`, `data-cj-img-{i}`.
  - Carrossel/hero/reviews: marcação estática no HTML.
- O único "estado" que o JS materializa é o **carrinho** (localStorage) e o HTML do drawer (gerado em `cartRender`).

### localStorage
- **`mc_cart`** — chave única. Formato **compacto** persistido (compatível com `checkout.html`): `[{ id, n, p, q, img }]`. O drawer normaliza para `{ id, nome, preco, qty, img }` em memória.

### Eventos / listeners
`scroll` (passive), `click`, `touchstart`/`touchend` (passive), `input`, `submit`, `resize`, `keydown` (Esc lightbox), `mouseenter`/`mouseleave` (pause de autoplay), `DOMContentLoaded`.

### Globais / integrações
- `window.MagiaCart` — API mínima exposta (`add/remove/update/read/total/count/open/close`).
- `window.dataLayer` (GTM/GA4 Enhanced Ecommerce): `add_to_cart`, `begin_checkout`, `select_item` (e `view_item_list` inline no index.html).
- `window.fbq` (Meta Pixel): `AddToCart`, `InitiateCheckout`. `window.gtag` (GA4): mesmos eventos.
- Rede: `fetch('/api/newsletter')`, `fetch('/api/frete?cep=…')`. `lp/nova-landing` usa função **Supabase** externa.

---

## 5. Imagens e assets

### Inventário por formato (sweep ~168 arquivos; sem AVIF, sem SVG em arquivo — ícones SVG são inline no HTML)
- **JPG/JPEG** ~67 · **PNG** ~62 · **WebP** ~38 · **GIF** 1 (`sparkle.gif`).
- Distribuição: `img/` (raiz, maioria), `img/_originals/` (14 PNGs de origem), `img/avaliacoes/` (27 avatares JPG), `img/banners/` (4 webp — **verificado**), `img/resultados/` (4 webp — **verificado**), `uploads/produtos/` (**1 arquivo no disco — verificado**: `galeria_7_88aaed0fff98.jpg`).

### Grupos lógicos
- **Produtos `Frame_*`**: pares `.png` + `.webp`. Ativos no HTML: Frame_26 (Vitamina), 27 (Shampoo), 28 (Tônico), 29 (Máscara), 19 (hero). Variantes `*_70x70_crop_center` para thumbnails. **Frame_13/14/18/20/21/23/24/25 sem referência no HTML** (pares png+webp ociosos).
- **Antes/depois**: `ba_1..3_{antes,depois}.jpg` — **6 arquivos (verificado)**, usados nos sliders do `#resultados`.
- **Avatares de avaliação**: `img/avaliacoes/*.jpg` (sp_*, br_*) — usados nas reviews; só ~4 referenciados no index.
- **Banners**: `img/banners/{kit-completo-magia-grow, real-capsula, real-tonico-couro, rotina-massageador}.webp`.
- **Resultados**: `img/resultados/{gaby-resultado, real-mascara-sorriso, isa-kit, vanilza-card}.webp`.
- **Logos/UI**: `logo.png`, `logo_footer.png`, `Group_24.png` (favicon/checkout), `Group_33.*`; `Group_36/37.png` aparentemente ociosos.
- **`img/_originals/*`**: PNGs de origem (backup dos `Frame_*`) — sem referência em produção.

### Referência: HTML vs JS
- **HTML `<picture>` (webp + png fallback):** Frame_26/27/28/29 e `tonico.*` (carrossel de categorias).
- **HTML `<img>` simples:** banners, antes/depois, avatares, logos, lifestyle, results.
- **JS:** nenhuma imagem em array. Imagens só chegam ao JS via `data-prod-img` / `data-cj-img-*` (cart e compre-junto) e são re-renderizadas no drawer.

### Repetições / duplicatas no mesmo contexto
- `img/banners/kit-completo-magia-grow.webp` é reusada em **hero, #protocolo (foto + badge), e compre-junto** (mesma foto do kit em múltiplos blocos).
- `img/WhatsApp_Image_2026-02-23_at_21.22.48.jpg` reusada no card do Massageador e no combo do protocolo.

### Imagens sem dimensão declarada (risco de CLS)
Os 6 `ba_*`, logo do header, `shampoo_hd.webp`/`mascara.webp` (carrossel categorias), `berenice_fundadora.webp`, imagens de results, imagem principal e thumbnails das PDPs (amostragem em kit/massageador).

---

## 6. Convenções existentes

- **Nomenclatura de classe:** ad-hoc/component-based com toques de BEM. Modificadores em `--` (`.bfeat--reverse`, `.review-card--featured`, `.bfeat-badge--tl/--br`, `.need-card--placeholder`); "elementos" via hífen simples (`.protocolo-media`, `.protocolo-list`, `.pdp-gallery`, `.cart-drawer`). **Não é BEM estrito.** Prefixos por bloco/página: `bfeat-`, `protocolo-`, `pdp-`, `guia-`, `sobre-`, `how-`, `ck-` (checkout), `ad-` (antes/depois). Utilitários soltos: `.hide`, `.center`, `.mute`, `.text-sm/.text-xs/.text-lg`, `.bg-ivory`, `.serif`, `.italic`.
- **Nomenclatura de variável CSS:** kebab-case com escalas/prefixos consistentes — espaçamento `--sp-N`, raios `--r/--r-sm/--r-lg/--pill`, sombras `--shadow*`, cores base + variações de matiz (`--wine`, `--wine-h`, `--wine-d`, `--wine-soft`; `--gold`, `--gold-lt`, `--gold-d`), fontes `--f-serif/--f-sans`, timing `--fast/--med/--slow` + `--ease`.
- **Convenção de animação:** durations tokenizadas (`--fast .18s`, `--med .32s`, `--slow .5s`) com `--ease cubic-bezier(.4,0,.2,1)`; **porém** muitas transições usam durations literais. Movimento restrito a `transform`/`opacity`; `prefers-reduced-motion: reduce` neutraliza tudo globalmente. (O antigo sistema de scroll-reveal `animation-timeline: view()` foi removido — não há mais reveal por scroll.)
- **Convenção de z-index:** **não há convenção definida** (valores literais inline).

---

## Pontos de atenção pra refresh de design (só sinalização)

- **Cache-buster do CSS inconsistente entre páginas:** index `?v=20260623g`, sobre/guia `?v=20260619`, resultados/produto **sem `?v=`** — risco de servir CSS velho em parte do site.
- **Dois sistemas de design paralelos:** checkout.html e os 5 `pages/*.html` usam CSS inline próprio e **não** consomem os tokens de magia.css.
- **Pulo de heading `h2 → h4`** nas PDPs de massageador e vitamina (sem `h3`).
- **`pages/*.html` sem landmarks** (`<main>`/`<article>`) e com `h1` dentro de `div.hero`.
- **Imagens sem width/height** em vários pontos (antes/depois, logo, categorias, PDP) → CLS.
- **`alt` ausente** em imagens de carrossel de categorias e thumbnails de PDP.
- **Galeria PDP possivelmente quebrada:** PDPs referenciam caminhos `uploads/produtos/galeria_*` mas só `galeria_7_88aaed0fff98.jpg` existe no disco — verificar imagens faltando.
- **Assets ociosos:** `Frame_13/14/18/20/21/23/24/25` (png+webp), `img/_originals/*`, `Group_36/37.png` sem referência — peso morto no deploy.
- **Reuso da mesma foto do kit** em hero + protocolo + compre-junto (pouca variedade visual nos blocos de oferta).
- **CSS:** `.need-card--placeholder` órfã; sombras/cores rgba hardcoded (22 ocorrências) e durations literais fora dos tokens; strings de transição duplicadas.
- **Sem tokens de breakpoint nem de z-index**, e mistura de media queries `min-width`/`max-width` (mobile-first x desktop-first no mesmo arquivo).
- **`lp/nova-landing`** depende de função externa Supabase (conteúdo não versionado no repo; `noindex`).
- **Conteúdo da UI 100% no HTML** (não há camada de dados em JS) — qualquer refresh que queira data-driven teria que introduzir essa camada do zero.
