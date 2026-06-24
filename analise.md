# Análise técnica — Magia Capilar (briefing para IA)

> Documento gerado por varredura completa do projeto. Objetivo: dar a outra IA todo
> o contexto necessário para **saber o que modificar e o que NÃO quebrar**.
> Estado descrito = arquivos em disco no momento da análise (ver §13 para o que está
> versionado vs. não-commitado).

---

## 1. Visão geral

- **Produto:** e-commerce de cosmético capilar artesanal (marca Magia Capilar). Fundadora real: **Berenice Reis**, tricologista, clínica física em Conselheiro Lafaiete/MG, Método RIC. Linha vegana, registro ANVISA.
- **Tipo de site:** estático (HTML + CSS + JS vanilla). **Sem framework, sem build step, sem package.json.** Tudo é servido como arquivo.
- **Domínio de produção:** `https://growmagiacapilar.com.br/`
- **Deploy:** SFTP para host `31.97.151.184`, `remotePath: /site` (config em `.vscode/sftp.json`, que é **gitignored**). Não há CI/CD.
- **JS único:** `assets/js/magia.js` (IIFE, sem dependências). **CSS único:** `assets/css/magia.css` — exceto `checkout.html` e `pages/*.html`, que têm `<style>` **inline próprio**.

---

## 2. Stack e convenções

- HTML5 semântico, mobile-first. CSS com custom properties (`:root` tokens) em `magia.css`.
- JS: seletores `$`/`$$`, listeners via `on()`, formato BRL via `toLocaleString`. Tudo inicializa em `DOMContentLoaded` (função `init()` no fim de `magia.js`).
- **Codificação: UTF-8 sem BOM.** ⚠️ Há acentos em português em quase todo arquivo. Ferramentas que leem/gravam (ex.: PowerShell `Get-Content -Raw` no Windows) **podem corromper acentos/travessões** (mojibake). Use I/O UTF-8 explícito (`[System.IO.File]::ReadAllText/WriteAllText`) ou editores que preservem UTF-8.
- Idioma do conteúdo e dos commits: português.

---

## 3. Inventário de arquivos

### Páginas HTML
| Arquivo | Papel | CSS |
|---|---|---|
| `index.html` | Landing principal (LP) | usa `magia.css` |
| `produto/{kit-completo-magia-grow,vitamina-magia-grow,tonico-antiqueda,shampoo-dht,mascara-ultra-hidratante,massageador-capilar}/index.html` | 6 PDPs (página de produto) | usa `magia.css` |
| `sobre/index.html` | História/fundadora (E-E-A-T) | usa `magia.css` |
| `guia/produtos-para-queda-de-cabelo/index.html` | Artigo SEO (cluster de conteúdo) | usa `magia.css` |
| `resultados/index.html` | "Parede de resultados" (antes/depois, reels) | usa `magia.css` |
| `pages/{envio-e-entrega,trocas-e-devolucoes,politica-de-pagamento,politica-de-privacidade,termos-e-condicoes}.html` | 5 páginas legais | **CSS inline próprio** |
| `checkout.html` | Carrinho + frete + cupom + pagamento | **CSS inline próprio** |
| `lp/nova-landing/index.html` | LP injetada via Supabase (ver §9), `noindex` | sem CSS local |

### Assets / infra
- `assets/css/magia.css` (~3057 linhas) — design system do site.
- `assets/js/magia.js` (~617 linhas) — toda a interatividade.
- `img/` — centenas de imagens (muitas órfãs/legadas, ver §11). `videos/` — 4 reels + posters. `uploads/produtos/` — 1 imagem de kit.
- `robots.txt`, `sitemap.xml`.
- `.vscode/sftp.json` (deploy, gitignored), `.claude/` (skills/config — não faz parte do site).

---

## 4. Mapa de páginas

### `index.html` (LP) — ordem das seções
1. `announce` (faixa topo: frete grátis / 4x / PIX 5%)
2. `header.site-header` (logo + nav âncora + carrinho)
3. `.hero` — carrossel de 3 slides (`.hero-slide`, autoplay 8s)
4. `.selos` — 4 selos de confiança (faixa inline)
5. `#resultados` — carrossel de reels (vídeo) + `.ad-grid` antes/depois (**hoje 2 sliders**: `ba_1`, `ba_2`)
6. `.results-wall` — "Quem usa, mostra" + CTA `/resultados/`
7. `#bfeat-origem` — bloco história/dor
8. `#protocolo` — kit "Protocolo 90 dias" + lista + **botão "Começar meu Protocolo"** (ver §7)
9. `#produtos` — grid de 6 cards (`.prod-card`) com add-to-cart
10. `<script>` `view_item_list` (dataLayer)
11. `.how-it-works` — 4 passos numerados + 2 fotos
12. `#categorias` — carrossel de categorias
13. `#historia` — fundadora (foto + citação)
14. `.needs-section` — 4 "necessidades" (links para guia/PDPs)
15. `#faq` — acordeão (6 perguntas)
16. `.reviews-section` — 6 reviews
17. `footer.site-footer`
18. `cart-drawer` + `cart-overlay` + banner de consentimento LGPD

### PDPs (`produto/*/index.html`)
Estrutura típica: galeria (`.pdp-gallery` main+thumbs), título, preço (`.pdp-price-now`), `data-add-cart`, qty (`.qty-box`), cards de benefício (`.beneficios-grid`), modo de uso (`.modo-uso-list`), comparação (`.comparacao`), "compre junto" (`.cj-add-btn` / `.cj-items`), oferta progressiva (`.tier-card`), CEP frete (`.pdp-frete-check`), reviews, FAQ. JSON-LD `Product` + `Offer` + `Brand`.

### Outras
- `sobre/`: hero, história, FAQ; JSON-LD `Person` + `Organization` + `PostalAddress` + `FAQPage` + `BreadcrumbList`.
- `guia/...`: artigo longo; JSON-LD `Article` + `FAQPage` + `BreadcrumbList`. Tem "Continue lendo" e tags (alguns links mortos `href="#"`).
- `resultados/`: reels + antes/depois; JSON-LD `BreadcrumbList`.
- `index.html` JSON-LD: apenas `Store`.

---

## 5. Sistema de design

### `magia.css` — tokens `:root` (fonte da verdade visual do site)
```
--cream #F9F5EF   --ivory #FFFDF8   --ink #160C12   --ink-soft #2E2329
--smoke #7C736F   --mist #D5CFC9    --border #E8E2DC --ink-muted #564C52
--wine #6E1F2A    --wine-h #8B2530  --wine-d #4A1219 --wine-soft #A5354A
--gold #C4956A    --gold-lt #DBBFA5 --gold-d #A0774C
--sage #6B7F5E    --blush #ECDDD3   --ok #2F7D4F     --warn #B4531B
--f-serif: "Puritan", system-ui, sans-serif   (display/títulos)
--f-sans:  "Roboto", system-ui, ... (corpo/UI/preços)
raio --r 14px; sombras --shadow*; --ease; --section-y (ritmo vertical)
```
- **Cor de marca:** wine `#6E1F2A` é o acento estrutural. **gold** está reservado a estrelas de review e selo de desconto (não usar em papel estrutural).
- **Títulos:** peso **400** (Puritan regular; Puritan só tem 400/700). `h1/h2` com `letter-spacing` levemente negativo. Preços permanecem 700.

### `checkout.html` (tokens inline próprios — NÃO herda magia.css)
```
--cream #FAF7F2  --ink #2A2420  --wine #6E1F2A  --wine-deep #4A1219  --wine-h #8B2530
--serif:'Puritan'  --sans:'DM Sans'  (atenção: corpo do checkout é DM Sans, não Roboto)
```
- Header `.ck-hdr` em **cream** com logo escura (`img/logo.png`, `filter:brightness(0)`), texto wine/ink. Faixa "Checkout Seguro/Yampi" (`.sec-bar`) em **wine sólido**. Botões "Adicionar" (`.sug-card-btn`) e CTA `.btn-buy` em wine sólido (sem gradiente).

### `pages/*.html` (tokens inline próprios)
`--ink #2A2420`, `--serif:'Puritan'`, `--sans:'DM Sans'`. Carregam Puritan + DM Sans.

---

## 6. Catálogo de produtos

IDs canônicos usados em `data-prod-*` / `data-cj-*` / API:

| id | Produto | Preço (R$) | Imagem principal |
|----|---------|-----------:|---|
| 1 | Vitamina Magia Grow (60 cáps, 17 ativos) | 99,75 | `/img/Frame_26.*` |
| 2 | Tônico Antiqueda (60ml) | 96,95 | `/img/Frame_28.*` |
| 3 | Máscara Ultra Hidratante (250g) | 76,67 | `/img/Frame_29.*` |
| 4 | Shampoo DHT (250ml) | 62,67 | `/img/Frame_27.*` |
| 5 | Massageador Capilar | 20,93 | `/img/WhatsApp_..._21.22.48.jpg` |
| 7 | Kit Completo Magia Grow (vit+tôn+sham+másc) | 299,00 | `/uploads/produtos/galeria_7_*.jpg` / `/img/banners/kit-completo-magia-grow.webp` |

- **Não existe id 6.** Não existe SKU "Protocolo R$ 319,93" — esse valor é a soma Kit (299) + Massageador (20,93) montada via "compre junto".
- ⚠️ **Preço de verdade vem da API**, não do HTML: o `checkout.html` busca `/estoque/api/produtos/loja`, monta `CATALOGO[id]` e **sobrescreve nome/preço/imagem** do que veio no `mc_cart`. Os `data-prod-preco` do front são fallback/UI. Para alterar preço de forma definitiva, mexer no backend de estoque (fora deste repositório).

---

## 7. Carrinho & checkout (lógica crítica — não quebrar)

### localStorage
- **`mc_cart`** — array no formato **compacto** `[{id, n, p, q, img}]` (n=nome, p=preço, q=qtd). É o contrato entre `magia.js` e `checkout.html`. **Não alterar o formato.**
- **`mc_cupom`** — cupom aplicado; o checkout lê e **remove** no load. Campo relevante: `yampi_promocode`.
- **`magia_consent`** — `"granted"`/`"denied"` (LGPD, ver §8).

### `magia.js` — API e mecanismos
- `window.MagiaCart = { add, remove, update, read, total, count, open, close }`.
- `cartWrite()` grava o formato compacto; `cartRead()` normaliza para `{id,nome,preco,qty,img}` na UI.
- **Adicionar 1 item:** botão com `[data-add-cart]` + `data-prod-id/nome/preco/img/qty`.
- **Adicionar vários (compre junto):** `.cj-add-btn` + `data-cj-count="N"` + `data-cj-{id,nome,preco,img}-{i}` (i=0..N-1).
- **Redirecionar após adicionar (opt-in):** `data-cj-redirect="/checkout.html"` no `.cj-add-btn`. Usado **só** no botão "Começar meu Protocolo" (#protocolo). Os outros `.cj-add-btn` (PDPs) só adicionam, sem redirecionar.
- Drawer: `openCart/closeCart`, render em `cartRender`, badge `.cart-badge`.

### Fluxo de pagamento (`checkout.html`)
1. Lê `mc_cart` → renderiza itens, frete (`/api/frete` via `.pdp-frete-check`/CEP), cupom, sugestões.
2. Botão **"Ir para Pagamento Seguro"** (`.btn-buy`) → `POST {API_PAY}/yampi-checkout` → recebe `url` → valida regex `pay.yampi.com.br|yampi.com.br|dooki.com.br` → `window.location.href = url`.
3. Suporte a link direto `?produto=ID` (substitui o carrinho — usado por bot de WhatsApp).

---

## 8. Tracking & consentimento (LGPD)

- **IDs:** GTM `GTM-WTJPZFP9` · GA4 `G-8GNVTQLY7F` · Meta Pixel `1513052463085684`.
- **Consent Mode v2** (default `denied`) + Pixel `consent revoke` até o usuário aceitar. Gate via `localStorage.magia_consent` e banner `#magia-consent-banner` (Aceitar/Recusar).
- **Eventos disparados** (dataLayer + fbq + gtag):
  - `view_item_list` (lista de produtos na index, inline `<script>`).
  - `select_item` (clique em card de produto).
  - `add_to_cart` / `AddToCart` (em todo `cartAdd`).
  - `begin_checkout` / `InitiateCheckout` (clique em `.cart-checkout-btn`).
  - `PageView` (Pixel no head).
- ⚠️ Ao adicionar tracking novo, seguir o mesmo padrão triplo (dataLayer GA4 EE + fbq + gtag) e respeitar o consentimento.

---

## 9. Integrações externas / backend (FORA deste repositório)

Endpoints chamados pelo front (implementados no servidor, **não** versionados aqui):
- `GET /estoque/api/produtos/loja` — catálogo real (preços/nomes/imagens frescos) usado pelo checkout.
- `GET /api/frete?cep=` — cálculo de frete (PDP e checkout).
- `POST /api/yampi-checkout` — cria sessão de pagamento → retorna URL Yampi.
- `POST /api/newsletter` — captura de e-mail.
- **Prefixo por host:** em produção `/api` e `/estoque/api`; em staging/local `/magia/api` e `/magia/estoque/api` (detecção por `window.location.hostname`).
- **Yampi:** gateway de pagamento (`magia-capilar.pay.yampi.com.br`).
- **Supabase:** `lp/nova-landing/index.html` injeta HTML de `adwznhwihslwixqxoyku.supabase.co/functions/v1/serve-product-page?id=...` (página de produto gerada externamente; `noindex,nofollow`).

---

## 10. JavaScript (`magia.js`) — componentes

`initHeader` (scroll + burger), `initHeroSlideshow` (carrossel hero, dots, swipe, autoplay), `initCarousels` (carrosséis genéricos com `data-autoplay` ping-pong), `initFaq` (acordeão), `initAntesDepois` (slider `.ad-slider` via `--pos`), `initVideos`, `initReels` (lightbox de vídeo), `initPdpGallery`, `initPdpQty`, `initCart` (drawer + add-to-cart + cj + checkout tracking), `initSelectItem`, `initNewsletter`, `initFreteCheck`. Tudo idempotente e dependente de classes/`data-*` — **renomear classes/atributos quebra o JS**.

---

## 11. Imagens & assets

- Convenção de produto: `Frame_26..29` (.png + .webp) = frascos; `tonico/shampoo/mascara/suplemento(.webp)` = categorias.
- Antes/depois atuais: `ba_1_*`, `ba_2_*` (.jpg) e `ba_4_*` (.webp, novos). `ba_3_*` foram removidos.
- **Muitos assets órfãos/legados** em `img/` (ex.: `img/_originals/*`, `banner*`, `promo_*`, `hero_desktop_*`, `img/avaliacoes/*` incl. `_old_produtos_err/`, `*.bak`). Candidatos a limpeza — confirmar uso antes de apagar.
- Reuso de foto: `kit-frascos.webp` e `banners/kit-completo-*.webp` aparecem em vários blocos (hero/protocolo/combo).

---

## 12. ⚠️ Inconsistências / bugs atuais (PRIORIDADE)

1. **FONTE quebrada na home.** `index.html` carrega **Fraunces** no `<link>`, mas `magia.css` define `--f-serif: "Puritan"`. Resultado: títulos da home pedem Puritan (não carregado) → caem em `system-ui`/sans genérica, e o Fraunces baixado fica **sem uso**. As outras 9 páginas que usam `magia.css` (sobre, resultados, guia, 6 PDPs) **já carregam Puritan** corretamente. **Correção recomendada:** trocar o `<link>` de fontes da `index.html` para Puritan + Roboto (igual às demais). Origem do bug: um `git restore index.html` anterior reverteu o `<link>` da home sem reverter o `magia.css`.
2. **`--ink` divergente.** `magia.css` usa `#160C12` (quase preto) enquanto `checkout.html` e `pages/*` usam `#2A2420` (mais suave). Padronizar (provável intenção: `#2A2420` em todo lugar).
3. **Corpo do checkout/pages é DM Sans**, não Roboto (o resto do site é Roboto). Se quiser unificar tipografia de corpo, alinhar `--sans` desses arquivos para Roboto e ajustar o `<link>`.
4. **Links mortos no guia** ("Continue lendo" e tags com `href="#"`).
5. **Provas sociais frágeis** (levantado em auditoria anterior, ver §16): 3 de 6 reviews da home são "Cliente Magia"/avatar "M"; "247 avaliações" sem fonte; antes/depois sem rótulo (nome/tempo).
6. **Claims terapêuticos / risco ANVISA** nos cards de produto ("combate a queda", "estimula crescimento", "bloqueia DHT") — contradizem o tom cauteloso da FAQ/guia.

---

## 13. Estado do versionamento (git)

- Último commit: `5503615` ("vai toma no cu"). **Nada commitado depois disso.**
- **Modificados (não commitados):** `magia.css`, `magia.js`, `checkout.html`, `index.html`, os 6 PDPs, `sobre`, `guia`, `resultados`, os 5 `pages/*`.
- **Deletados (não commitados):** `AUDIT-ANTI-IA.md`, `DISCOVERY.md`, `AVISO-SEGURANCA-LEIA-PRIMEIRO.txt`, `img/ba_3_antes.jpg`, `img/ba_3_depois.jpg`.
- **Novos não rastreados:** `img/ba_4_antes.webp`, `img/ba_4_depois.webp`.
- Implica: o working tree tem mudanças recentes (tipografia Puritan, restyle do checkout, redirect do protocolo, remoção do 3º slider antes/depois) que **ainda não foram commitadas nem deployadas**.

---

## 14. O que NÃO tocar (proteções)

- Formato do `mc_cart` (`{id,n,p,q,img}`) e a leitura no `checkout.html`.
- `data-prod-*`, `data-cj-*`, `data-add-cart`, classes que o `magia.js` consome (`.cj-add-btn`, `.ad-slider`, `.hero-slides`, `.carousel-wrap`, `.faq-item`, `.cart-*`, `.prod-card`, etc.).
- Snippets de tracking (GTM/GA4/Pixel) e o gate de consentimento.
- Lógica de pagamento Yampi e os endpoints `/api/*` e `/estoque/api/*` (e o prefixo por host).
- Preços hardcoded sem alinhar com a API de estoque (a API sobrescreve no checkout).

---

## 15. Guia rápido de "onde mexer"

| Quero mudar… | Mexer em… |
|---|---|
| Cores/fontes/espaçamento do site | `assets/css/magia.css` (`:root` + seletores) |
| Visual do checkout | `<style>` inline de `checkout.html` (tokens próprios) |
| Visual das páginas legais | `<style>` inline de cada `pages/*.html` |
| Texto/seções da home | `index.html` |
| Texto/estrutura de um produto | `produto/<slug>/index.html` (+ JSON-LD do mesmo arquivo) |
| Comportamento (carrossel, cart, FAQ…) | `assets/js/magia.js` |
| Adicionar produto ao cart por clique | `data-add-cart` (1 item) ou `.cj-add-btn`+`data-cj-*` (vários) |
| Preço real / catálogo | **backend de estoque** (`/estoque/api`), não o HTML |
| Fonte da home (corrigir bug §12.1) | `<link>` de fontes em `index.html` |
| SEO de uma página | `<title>`, `<meta>`, `<link canonical>`, JSON-LD do próprio arquivo + `sitemap.xml` |
| Publicar | SFTP → `31.97.151.184:/site` (config gitignored) |

---

## 16. Nota sobre documentos removidos

Havia no repositório (agora deletados, não commitados) três documentos úteis:
- **`AUDIT-ANTI-IA.md`** — auditoria de copy/visual "cara de IA" (paleta template, headlines repetidas, reviews fabricadas, claims ANVISA, fotos reusadas). Os itens §12.5 e §12.6 vêm dessa auditoria.
- **`DISCOVERY.md`** — levantamento inicial do projeto.
- **`AVISO-SEGURANCA-LEIA-PRIMEIRO.txt`** — aviso de segurança.

Se forem necessários, recuperar via `git show 5503615:AUDIT-ANTI-IA.md` (idem para os outros), já que ainda existem no último commit.

---

_Fim. Para qualquer alteração: edite o arquivo certo (§15), preserve as proteções (§14), e priorize as correções de §12 — sobretudo a fonte da home (§12.1)._
