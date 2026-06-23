# AUDIT — Anti-IA / Anti-Template — Magia Capilar

> Auditoria **crítica e somente-leitura** (2026-06-23). Nada foi editado.
> Objetivo: achar o que tem "cara de IA" / template genérico em **copy** e **visual**.
> Onde um trecho é concreto, específico e humano, ele **não** foi listado — o foco é o problema.
> Escopo: `index.html` (prioridade máxima), `produto/*/index.html`, `sobre/`, `resultados/`, `guia/.../`.
> Fora de escopo (ignorados): `checkout.html`, `pages/*.html`.

**Nota de contexto:** boa parte do site já fugiu do genérico — há copy genuinamente humana ("Kit de farmácia te entrega um frasco e boa sorte", "menos que um cafezinho", "R$ 3,55 por dia", "sem letra miúda", "A Magia Capilar não nasceu no marketing. Ela nasceu da minha dor."). O problema não é o site inteiro: é um **conjunto de bolsões template** que destoam e denunciam geração/colagem, concentrados em (1) a bio da fundadora na home, (2) a fórmula de headline repetida em toda seção, (3) o resumo do Kit Completo, (4) os cards de benefício/depoimento das PDPs, e (5) a paleta editorial padrão.

---

## PARTE A — COPY (ordenada por gravidade: o que mais grita IA primeiro)

### 🔴 Gravidade ALTA — grita IA

**A1 · `produto/kit-completo-magia-grow` → `.pdp-resumo`** — bloco inteiro com cara de copy de anúncio gerada/colada.
- "transformar não só o seu cabelo, mas também a sua autoestima" → fórmula clássica "não só X, mas também Y" + benefício abstrato "autoestima".
- "Menos queda. Mais crescimento. Mais confiança." → tríade-slogan com paralelismo sintático perfeito, sem prova.
- "Com uma combinação **poderosa** de..." / "ativos naturais de **alta performance**" → adjetivos empilhados sem mecanismo.
- "é um dos **tratamentos mais completos do mercado**... laboratório especializado que **realmente entende de saúde capilar**" → claim comparativo sem fonte + preenchimento coloquial-IA.
- Emojis decorativos no corpo ("✨ O Kit...", "💡 Além disso...", "Garanta logo seu kit ✨") → marca de copy colada de redes sociais, destoa do tom editorial do resto do site.

**A2 · `index.html` → `#historia` (bio da fundadora)** — a versão "polida/marketing" da história, que destoa da versão humana em `/sobre`.
- "Paixão e *ciência*: a mente por trás da Magia Capilar" → "Paixão e ciência" + "a mente por trás de" é headline-molde de IA.
- "apaixonada por transformar vidas" / "cada fio de cabelo guarda uma história de autoestima e bem-estar" → frases motivacionais vazias.
- "une ciência de ponta a tratamentos naturais" / "pensados para devolver força, brilho e confiança" → "ciência de ponta" + tríade "força, brilho e confiança".
- Contraste revelador: em `/sobre` a mesma fundadora fala "não nasceu no marketing, nasceu da minha dor" (humano). Na home virou texto de catálogo.

**A3 · `index.html` → `.hero-slide` (headlines do hero)**
- "Mais do que cabelo. *Autoestima renovada*." → "Autoestima renovada" é exatamente o benefício abstrato de manual de IA; padrão "Mais do que X".
- "Não é um kit. É um *plano completo*." → antítese mecânica "não é X, é Y".

**A4 · `index.html` → `.reviews-grid` (depoimentos fracos/fabricados)**
- 3 dos 6 cards: autor "**Cliente Magia**", origem "via direct", avatar inicial "M" → sem nome real, sem especificidade.
- "Vale cada centavo pago, super indico." / "Vocês são maravilhosas demais 💖" → elogio genérico que **não cita o produto**.
- "Melhor kit para crescimento capilar que já usei." → superlativo sem especificidade.
- Cabeçalho "4,9 · de 247 avaliações verificadas" mas só 6 mostradas, sem plataforma/fonte → métrica fabricada-aparente.

**A5 · `index.html` → fórmula de headline repetida em TODA seção (tell estrutural-de-copy)**
Mesma construção "Frase curta. *Uma-palavra-em-itálico*." em ~11 títulos: "Quem usa, *mostra*" · "Tudo que um ciclo capilar *pede*" · "Uma rotina simples, *de verdade*" · "Nossa *linha*" · "Produtos por *necessidade*" · "O que elas *dizem*" · "Tem fases em que o cabelo *sente junto*" · "A transformação que dá pra ver" (+ A2/A3). A repetição mecânica do mesmo molde editorial é, por si só, assinatura de geração em lote.

### 🟠 Gravidade MÉDIA

**A6 · PDPs (transversal) → depoimentos em molde único.** Todos seguem "gatilho pessoal → prazo em meses → fecho elogioso", com o nome do produto dito dentro da fala:
- Máscara: "Antes, meu cabelo era opaco e quebrava... Depois de 4 semanas... Me sinto renovada!" — Juliana Reis, São Paulo, SP.
- Máscara: "A máscara ultra hidratante é viciante..." — Patrícia, Curitiba, PR (pessoa real raramente repete o nome completo do produto).
- Shampoo: "Depois do pós-parto meu cabelo afinou muito... Produto sensacional" — Fernanda, Fortaleza, CE.
- Vitamina: "Comecei a Vitamina Magia Grow há 3 meses... Recomendo demais!" — Juliana, RJ.
Cara de review gerado em lote (nome+UF / "Compra verificada" / prazo + elogio).

**A7 · `index.html` → `.how-it-works` (paralelismo mecânico).** 4 passos com títulos de estrutura idêntica "verbo + complemento": "Nutra de dentro" / "Limpe sem agredir" / "Trate e hidrate" / "Estimule a raiz" + eyebrow "Uma rotina simples, *de verdade*".

**A8 · `produto/tonico-antiqueda` → cards de benefício com número inventado.** "Ação prolongada 24h" e "Resultado em 30 dias" → claims numéricos sem estudo citado, cara de card preenchido por gerador.

**A9 · `sobre/index.html` → "método exclusivo".** "Idealizadora do método **exclusivo** de Recuperação Integrativa Capilar, que une ciência e tratamentos naturais." → "exclusivo" + "une ciência e X" é molde de claim de marca; repete na FAQ e no JSON-LD.

**A10 · `resultados/index.html` → CTA/legendas vazias.**
- "Pronto pra começar *sua história*?" → cliché motivacional de template, não promete nada.
- "...o que mudou na rotina, no cabelo e na autoestima." → tríade mecânica terminando em "autoestima".
- Legendas "Cliente Magia" (sem nome) e "Gaby · Resultado real" → a palavra "real" colada como rótulo defensivo em vez de demonstrada.

**A11 · `guia/.../index.html` → antíteses-molde.** "cada um funciona sozinho, juntos se completam" (repetida 2x) → variante de "não é apenas X, é Y". Tríade "raiz · fio · de dentro pra fora" repetida ~4x vira cadência mecânica.

### 🟡 Gravidade BAIXA

**A12 · `index.html` → `#categorias`.** "Nossa *linha*" / "Tratamento capilar completo" → diz o óbvio, conteúdo nulo.
**A13 · `index.html` → `#resultados` title.** "A transformação que dá pra ver" → "transformação" genérico (salvo parcialmente pelo subtítulo concreto).
**A14 · `produto/vitamina` → card "17 ativos essenciais" como *benefício*.** É especificação, não benefício; soa preenchimento de grid de 5 cards.
**A15 · `sobre` → "preservam os nutrientes dos ativos".** Benefício abstrato sem número, marketing de rótulo.

---

### ⚠️ CLAIM TERAPÊUTICO — RISCO ANVISA (sinalizado SEPARADO da qualidade de copy)

Cosmético/suplemento não pode alegar tratar/curar/garantir crescimento. Catalogados à parte porque são **risco regulatório**, não só copy ruim.

| # | Arquivo / local | Texto | Por quê |
|---|---|---|---|
| R1 | `kit-completo` `.pdp-resumo` | "atua diretamente na **causa da queda, tratando** o cabelo de dentro para fora e de fora para dentro" | claim de medicamento (tratar a causa) |
| R2 | `kit-completo` `.pdp-resumo` | "auxilia no **bloqueio do DHT** (hormônio ligado à queda e calvície)... **estimula o crescimento de novos fios**" | associação a calvície + crescimento garantido |
| R3 | `tonico-antiqueda` cards/resumo | "**Combate a queda** dos fios" / "**Estimula novos fios**" / "Resultado em 30 dias" | eficácia terapêutica + prazo |
| R4 | `vitamina` card/resumo | "fortalecem os fios desde a raiz e **reduzem a queda**" | suplemento alegando função não permitida |
| R5 | `shampoo-dht` cards/resumo | "**Bloqueia DHT**" / "**Estimula o crescimento**" / "Shampoo **antiqueda**" | claim forte p/ cosmético de enxágue |
| R6 | `guia` cards de produto | "estimulam o crescimento e combatem a queda" / "reduzem a queda" | cards crus contradizem o corpo do artigo (que é cauteloso) |
| R7 | `index.html` `#protocolo` / `.how-step` | "estimula a circulação", "nutre o folículo **onde o crescimento começa**", "cuidar do crescimento" | claim implícito de crescimento |

**Inconsistência reveladora:** o texto longo do guia e a FAQ da home são cuidadosos ("não faz milagre", "não substitui diagnóstico", "ajudar a controlar o DHT"), mas os **cards de produto** usam a versão crua ("combate a queda"). Os cards parecem importados do catálogo sem passar pelo mesmo filtro editorial.

---

## PARTE B — VISUAL / ESTRUTURA

**B1 · Paleta cai no clichê de IA nº 1 (cream + serif de alto contraste + acento terracota).**
`--cream:#F9F5EF` de fundo (`body{background:var(--cream)}`) + **Fraunces** serif em todos os títulos (`h1` até `clamp(...,4.1rem)`, `letter-spacing` negativo = alto contraste editorial) + acentos terracota/dourado (`--gold:#C4956A`, `--gold-d:#A0774C`, `--warn:#B4531B`). É exatamente o default "editorial premium" que geradores de LP cospem. **Mitigado parcialmente** pela cor primária vinho/bordô (`--wine:#6E1F2A`) no header/botões, que dá alguma personalidade — mas a moldura (cream + Fraunces + dourado) é a do template. (NÃO caiu nos clichês nº 2 quase-preto+verde-ácido nem nº 3 broadsheet — há `border-radius:14px`.)

**B2 · Eyebrow uppercase + h2 serif com uma palavra em `<em>` itálico, repetido em TODA seção.** `.eyebrow`/`.bfeat-eyebrow` em caixa-alta com `letter-spacing:0.22em` acima de cada título. Combinado com a fórmula de headline (A5), todo bloco tem a mesma silhueta tipográfica — previsibilidade que denuncia template.

**B3 · Blocos de 3–6 cards idênticos (ícone/título/parágrafo) repetidos.**
- `.selos`: 4 selos idênticos (ícone SVG + strong + span).
- `.prods-grid`: 6 prod-cards idênticos.
- `.needs-grid`: 6 need-cards idênticos.
- PDPs: grids de **5 cards de benefício com o MESMO ícone SVG** (círculo+check) repetido 5x — decorativo, sem diferenciação.

**B4 · `index.html` `.needs-section` — 6 "necessidades" diferentes, TODAS apontando para a mesma URL** (`/guia/produtos-para-queda-de-cabelo/`). "Produtos por necessidade" promete segmentação que não existe; é grade de preenchimento.

**B5 · Numeração decorativa 01–04 em `.how-it-works`.** Os passos são de fato uma sequência (ok-ish), mas o tratamento "01/02/03/04" grande é o ornamento padrão de gerador de "como funciona".

**B6 · Reuso da mesma foto empobrecendo o visual (confirmado no HTML):**
- `img/banners/kit-completo-magia-grow.webp` → hero slide 1 **+** `#protocolo` (foto) **+** data-img do CTA do protocolo **+** "compre junto". A mesma foto do kit em 4 lugares.
- `img/WhatsApp_..._21.22.48.jpg` → card do Massageador (`#produtos`) **+** combo do `#protocolo`.
- Nas PDPs: a "galeria" tem 1 única imagem repetida em main+thumb (placeholder, não galeria real); ex. `Frame_27` aparece em galeria + compre-junto + "Combine com" na mesma página.

**B7 · `resultados/index.html` — diz o óbvio sem entregar a prova prometida.** Eyebrow "Sem filtro" + h1 "resultados reais" + meta "antes e depois", mas a página tem só 4 fotos únicas com legenda de 2–3 palavras, **sem antes/depois rotulado e sem um único texto de cliente**.

**B8 · `guia/.../` — conteúdo placeholder de scaffold SEO.** Seção "Continue lendo" com 4 cards `href="#" aria-disabled="true"` (links mortos) + 5 tag-pills idem. Promete um cluster de conteúdo que não existe — marca registrada de scaffold gerado.

**B9 · Avatares-placeholder nas reviews.** 3 de 6 review-cards usam `.review-avatar--initial` ("M") em vez de rosto — buraco visual que parece auto-preenchido.

**B10 · Hierarquia/ordem previsível de gerador de LP, em escala maior.** Sequência hero(carrossel) → selos(4) → resultados → origem → protocolo → produtos(6) → how(4 passos) → categorias → história → needs(6) → faq → reviews. A home é mais rica que o esqueleto mínimo, mas os **sub-blocos** (4 selos de confiança, 4 passos numerados, grids de 6) são todos peças de catálogo de template; nada quebra o padrão (nenhum bloco assimétrico, editorial-foto-cheia, ou interativo fora do molde).

---

## PARTE C — INVENTÁRIO DE PROVA REAL

O redesign deve puxar o foco para o que é genuíno e enterrar o genérico.

### ✅ O que o site TEM (prova genuína)
- **Foto real e identidade da fundadora:** `berenice_fundadora.webp`; Berenice Reis, esteticista/tricologista, 16+ anos, registro **ATH**, clínica física em **Conselheiro Lafaiete/MG**, **Método RIC**. Reforçada por JSON-LD `Person` em `/sobre`. Prova de E-E-A-T real e subutilizada.
- **História humana autêntica em `/sobre`** ("não nasceu no marketing, nasceu da minha dor" / "Quem já sentiu essa dor não brinca com a esperança de ninguém").
- **Antes/depois reais** (`ba_1/2/3_{antes,depois}.jpg`) com slider funcional no `#resultados`.
- **Vídeos/reels de clientes** (4 vídeos) no carrossel de resultados.
- **Fotos reais de clientes** com primeiro nome nas reviews (`isa-kit`, `vanilza-card`, `gaby-resultado`).
- **Especificidade verificável de produto:** 17 ativos (biotina, zinco, complexo B), 60 cápsulas, volumes (60ml/250ml/250g), preços com/sem desconto, R$ 3,55/dia.
- **Disclaimers honestos** (forte sinal anti-IA): "sem promessa irreal", FAQ que reconhece alopecia clínica e encaminha a dermatologista, "Resultados variam de pessoa pra pessoa".
- **Sinais de marca:** 100% vegano, cruelty-free, registro ANVISA (mencionado), garantia de 7 dias.

### ❌ O que FALTA (lacunas que o genérico está tapando)
- **Nenhum texto de depoimento verbatim com nome+sobrenome verificável.** As reviews da home são frases de 1 linha; 3 são "Cliente Magia". `/resultados` não tem **uma única frase** de cliente.
- **"247 avaliações verificadas" sem fonte/plataforma** e só 6 exibidas → número não comprovável.
- **Antes/depois sem rótulo** (nome, tempo de uso, o que mudou) — vira foto solta.
- **Sem CNPJ, razão social ou endereço** no footer — lacuna de confiança/legal para e-commerce BR.
- **Sem número de registro ANVISA exibido** — exatamente a prova que mitigaria os claims de R1–R7.
- **Sem rosto/marca real nos pontos de confiança** (3 avatares "M" de placeholder; nenhuma foto da equipe/clínica além da fundadora).
- **Cluster editorial inexistente** (`/guia` relacionados + tags = links mortos).

---

## TOP 10 PRIORIDADES (o que, se mudado, mais tira a cara de IA)

1. **Reescrever o `.pdp-resumo` do Kit Completo** — concentra "não só X mas Y", tríade-slogan, "poderosa/alta performance", "mais completos do mercado" e emojis colados (também é o pior foco de risco ANVISA: R1, R2).
2. **Reescrever a bio da fundadora na home `#historia`** ("Paixão e ciência: a mente por trás de...", "transformar vidas", "força, brilho e confiança") usando o tom humano que já existe em `/sobre`.
3. **Quebrar a fórmula de headline "Frase. *palavra-em-itálico*."** repetida em ~11 seções da home — variar a construção dos títulos.
4. **Substituir os 3 depoimentos "Cliente Magia / via direct / avatar M"** por reviews reais com nome, rosto e menção concreta ao produto (ou removê-los).
5. **Trocar a hero h2 "Mais do que cabelo. Autoestima renovada."** — é o exemplo-livro de benefício abstrato de IA.
6. **Sanear os claims terapêuticos dos cards de produto (R3–R6)** — "combate a queda / estimula o crescimento / reduz a queda" → alinhar ao tom cauteloso já usado na FAQ e no corpo do guia.
7. **Refazer a `.needs-section`**: 6 "necessidades" apontando todas para a mesma URL — dar destino real a cada uma ou reduzir/transformar o bloco.
8. **Encher `/resultados` com prova de verdade** (texto de cliente, antes/depois rotulado com nome+tempo) — hoje promete "resultados reais/sem filtro" e entrega 4 fotos com legenda de 2 palavras.
9. **Padronizar/reescrever os depoimentos das PDPs** que seguem o molde "gatilho → prazo em meses → elogio" com o nome do produto dentro da fala (A6).
10. **Diferenciar o visual do default "cream + Fraunces + dourado" (B1)** e parar de reusar a mesma foto do kit em 4 blocos (B6) — dois sinais visuais que, juntos, dizem "template".

---

## CONTAGEM TOTAL DE OCORRÊNCIAS

- **Parte A — copy:** **15 ocorrências** de qualidade (A1–A15) + **7 claims de risco ANVISA** sinalizados à parte (R1–R7) = **22 itens**.
- **Parte B — visual/estrutura:** **10 ocorrências** (B1–B10).
- **Parte C — prova real:** **8 ativos genuínos** catalogados + **7 lacunas** identificadas = **15 itens**.

> Concentração: a home (`index.html`) e o resumo do **Kit Completo** somam a maior densidade de copy-IA; `/sobre` e o corpo do `/guia` são as áreas mais humanas; `/resultados` é a mais fraca em prova real (vazia, não fabricada).
