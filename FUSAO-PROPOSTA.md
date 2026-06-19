# Proposta de fusão das seções duplicadas — home

> **NÃO aplicado.** Este documento descreve o conteúdo atual de cada par
> duplicado (agora adjacentes na home após a reordenação) + uma versão
> fundida proposta. Aprovar item a item antes de aplicar na próxima rodada.

Após a reordenação, os pares ficaram lado a lado:
- **Par 1 (origem/dor):** `#bfeat-origem` (pos. 5) ↔ `#historia-cabelo` (pos. 6)
- **Par 2 (rotina):** `.how-it-works` (pos. 9) ↔ `#como-funciona` (pos. 10)

---

## PAR 1 — Origem / Dor

### Atual A — `#bfeat-origem` (`.bfeat.bfeat--reverse`)
- **Eyebrow:** "A gente sabe como começa"
- **Headline:** "Tem fases em que o cabelo *sente junto*"
- **Copy:**
  1. "Pós-parto, anemia, estresse, rotina pesada. O ralo do banheiro conta uma história que o espelho confirma — e que mexe com a autoestima de qualquer mulher."
  2. "Foi exatamente assim que a Magia Capilar nasceu: da dor de uma tricologista que viveu isso na pele e decidiu criar a rotina que ela mesma precisava — produtos pensados pra agir **de dentro pra fora e de fora pra dentro**, no conforto de casa."
- **CTA:** nenhum
- **Imagem:** `/img/WhatsApp_Image_2026-02-23_at_18.45.59.jpg` (cliente segurando a Máscara — foto real)
- **Layout:** split invertido (foto esq. / texto dir.)

### Atual B — `#historia-cabelo` (`.section.bg-ivory` + `.fundadora-wrap`)
- **Eyebrow:** "Por que isso importa"
- **Headline:** "Tem fases em que o cabelo sente junto" *(headline idêntica à de A)*
- **Copy:**
  1. "Pós-parto, estresse, mudança de estação, alimentação, hormônios. O cabelo é um dos primeiros lugares onde o corpo mostra que algo mudou — e ver os fios no ralo ou na escova mexe com a autoestima de um jeito que poucas pessoas entendem."
  2. "A Magia Capilar nasceu exatamente aí: na clínica da Berenice, atendendo mulheres reais que já tinham tentado de tudo. Não é fórmula de prateleira — é tricologia aplicada, com ativos frescos e respeito ao couro cabeludo, para acompanhar você justamente nas fases em que o cabelo precisa de mais cuidado."
- **CTA:** "Ver como tratar" → `#protocolo`
- **Imagem:** `/img/modelo2.jpg` (mulher cuidando dos cabelos)
- **Layout:** `.fundadora-wrap` (texto esq. / foto dir.)

### Sobreposição
Mesma headline, mesma dor (lista de causas), mesma narrativa de origem (nasceu da dor / clínica da Berenice / tricologia aplicada). São a **mesma seção contada duas vezes**.

### Proposta de FUSÃO (1 seção)
- **Manter:** o layout `.bfeat--reverse` de A (mais editorial e com a foto real da cliente) + o CTA de B.
- **Eyebrow:** "A gente sabe como começa"
- **Headline:** "Tem fases em que o cabelo *sente junto*"
- **Copy (3 parágrafos, mesclando o melhor):**
  1. "Pós-parto, anemia, estresse, mudança de estação, hormônios. O cabelo é um dos primeiros lugares onde o corpo mostra que algo mudou — e ver os fios no ralo mexe com a autoestima de um jeito que poucas pessoas entendem."
  2. "A Magia Capilar nasceu exatamente aí: da dor de uma tricologista que viveu isso na pele, na clínica da Berenice, atendendo mulheres que já tinham tentado de tudo. Não é fórmula de prateleira — é **tricologia aplicada**, com ativos frescos e respeito ao couro cabeludo."
  3. "Produtos pensados pra agir **de dentro pra fora e de fora pra dentro**, no conforto de casa."
- **CTA:** "Ver como tratar" → `#protocolo`
- **Imagem:** `/img/WhatsApp_Image_2026-02-23_at_18.45.59.jpg` (a foto real vende mais que a de banco `modelo2.jpg`).
- **Implementação sugerida:** manter o bloco `#bfeat-origem` (id + classes), inserir o CTA dentro do `.bfeat-text`, ajustar a copy; **remover** `#historia-cabelo`. (Atenção: o id `#historia-cabelo` não é alvo de âncora no nav/rodapé — seguro remover. Confirmar criativos externos.)

---

## PAR 2 — Como funciona / Rotina

### Atual A — `.how-it-works`
- **Eyebrow:** "Como funciona"
- **Headline:** "Uma rotina simples, *de verdade*"
- **Sub:** "Quatro passos que cabem na vida real — sem salão, sem complicação."
- **4 cards numerados (`.how-step`):**
  1. **01 · Nutra de dentro** — "2 cápsulas da Vitamina por dia. Os 17 ativos trabalham na raiz, onde o fio nasce." · *Todo dia · 10 segundos*
  2. **02 · Limpe sem agredir** — "Shampoo DHT na lavagem: limpa o couro cabeludo sem ressecar nem pesar." · *No banho · uso diário liberado*
  3. **03 · Trate e hidrate** — "Máscara Ultra Hidratante 1x por semana pra devolver brilho e maciez ao comprimento." · *1x por semana · 15 minutos*
  4. **04 · Estimule a raiz** — "Tônico no couro cabeludo + massageador pra ativar a circulação e potencializar a absorção." · *Toda noite · 3 minutos*
- **Imagens:** `/img/resultados/real-mascara-sorriso.webp` + `/img/banners/rotina-massageador.webp` (com legendas pill)
- **Layout:** cards 4-up + 2 fotos lado a lado

### Atual B — `#como-funciona` (`.section`)
- **Eyebrow:** "Como funciona"
- **Headline:** "Sua rotina em 4 passos"
- **Sub:** "Um protocolo simples, pensado para caber na sua noite"
- **Lista (`ol.modo-uso-list`, 4 itens):**
  1. **Limpe e prepare o couro cabeludo.** "O Shampoo DHT remove o excesso de oleosidade e bloqueia a ação do DHT, criando o ambiente certo para o fio nascer forte."
  2. **Trate na raiz.** "Algumas gotas do Tônico Antiqueda massageadas no couro cabeludo estimulam a circulação e nutrem o folículo onde o crescimento começa."
  3. **Nutra os fios.** "Duas vezes por semana, a Máscara Ultra Hidratante repõe nutrientes, devolve brilho e reduz a quebra ao longo do comprimento."
  4. **Fortaleça por dentro.** "A Vitamina Magia Grow age de dentro para fora, dando ao seu corpo os nutrientes que sustentam fios mais densos a cada ciclo."

### Sobreposição
Mesmo título ("Como funciona"), mesma promessa ("rotina simples em 4 passos") e os **mesmos 4 produtos/etapas** (shampoo, tônico, máscara, vitamina) — só que A usa cards visuais + fotos e B usa lista numerada de texto. Conteúdo redundante.

### Proposta de FUSÃO (1 seção)
- **Manter:** o layout de A (`.how-it-works` — cards + fotos é mais rico e editorial).
- **Headline:** "Uma rotina simples, *de verdade*" (sub: "Quatro passos que cabem na vida real — sem salão, sem complicação.")
- **Enriquecer cada card** com o detalhe técnico de B (que explica o *porquê* de cada passo). Sugestão de copy fundida por card:
  1. **01 · Nutra de dentro** — "2 cápsulas da Vitamina Magia Grow por dia: 17 ativos que sustentam fios mais densos a cada ciclo, agindo de dentro pra fora." · *Todo dia*
  2. **02 · Limpe sem agredir** — "Shampoo DHT na lavagem: remove o excesso de oleosidade e ajuda a controlar o DHT, sem ressecar nem pesar." · *No banho*
  3. **03 · Trate e hidrate** — "Máscara Ultra Hidratante 2x por semana: repõe nutrientes, devolve brilho e reduz a quebra no comprimento." · *2x por semana*
  4. **04 · Estimule a raiz** — "Tônico Antiqueda + massageador no couro cabeludo: ativa a circulação e nutre o folículo onde o crescimento começa." · *Toda noite · 3 min*
- **Manter** as 2 fotos com legenda.
- **Implementação sugerida:** manter `.how-it-works`, atualizar a copy dos 4 cards; **remover** `#como-funciona`.
  - ⚠️ **Atenção:** `#como-funciona` **não** parece ser alvo de âncora no nav/rodapé (confirmar), mas a **classe `.modo-uso-list`** é reutilizada nas PDPs (`produto/*`) — **não remover o CSS** de `.modo-uso-list`, só o HTML desta seção da home.

---

## Resumo da decisão pendente (humana)
| Par | Manter | Remover | Risco |
|---|---|---|---|
| 1 — origem/dor | `#bfeat-origem` (com CTA + copy mesclada) | `#historia-cabelo` | Baixo — verificar âncora `#historia-cabelo` em anúncios |
| 2 — rotina | `.how-it-works` (cards enriquecidos) | `#como-funciona` (HTML) | Baixo — **manter CSS `.modo-uso-list`** (usado nas PDPs) |

Ganho: −2 seções, página mais curta e sem repetição, mensagem mais forte. Nenhuma fusão aplicada nesta rodada.
