# Tracking — growmagiacapilar.com.br

Mapa do que o site mede, onde cada evento nasce e o que ainda falta. Atualize
este arquivo sempre que mexer em tag, pixel ou evento.

## IDs

| Ferramenta | ID | Onde vive |
|---|---|---|
| Meta Pixel | `1164154725893602` | inline no `<head>` de todas as páginas |
| GA4 | `G-8GNVTQLY7F` | inline no `<head>` de todas as páginas |

O pixel `1164154725893602` é o da conta de anúncios `act_27332730003053067` — o
mesmo que o conjunto de vendas usa para otimizar `PURCHASE`. O site media no
pixel `1513052463085684` até 28/07/2026; ele foi **substituído** em todas as
páginas porque não pertencia à BM da agência, e por isso a campanha otimizava
para um evento que nunca chegava.

O container `GTM-WTJPZFP9` foi **removido** do site em 28/07/2026. Ele continha
apenas duas tags — o mesmo pixel Meta disparando `PageView` e o mesmo Google tag
— que já existiam inline no HTML. O resultado era `PageView` contado em dobro e
GA4 carregado duas vezes em toda página. Se o container voltar a ser instalado,
essas duas tags precisam ser desativadas nele antes.

## Eventos Meta

| Evento | Dispara quando | Onde está |
|---|---|---|
| `PageView` | carregamento de qualquer página | `<head>` de cada HTML |
| `ViewContent` | abertura da página de produto | inline nas 6 PDPs, com `value`, `currency`, `content_ids` |
| `AddToCart` | clique em adicionar ao carrinho | `assets/js/magia.js` → `cartAdd()` |
| `InitiateCheckout` | clique no botão de checkout e no finalizar do `checkout.html` | `magia.js` → `initCart()` e `checkout.html` |
| `Purchase` | **não existe** | ver pendências abaixo |

Advanced matching: o `checkout.html` reenvia `fbq('init', ...)` com `zp` (CEP) e
`country` quando o visitante calcula o frete. É o único dado pessoal que o site
coleta antes de entregar o cliente para a Yampi, e o `fbq` o hasheia no browser.

## Eventos GA4

`view_item`, `view_item_list`, `select_item`, `add_to_cart`, `view_cart` e
`begin_checkout`, todos via `gtag()`. Os `dataLayer.push` que acompanham cada um
foram mantidos: hoje não alimentam nada (não há container), mas ficam prontos
caso um GTM próprio seja instalado no futuro.

## Consentimento (LGPD)

O pixel roda `fbq("consent","revoke")` antes do `init` e o GA4 sobe com Consent
Mode v2 em `denied`. **Nenhum evento sai antes do visitante aceitar o banner.**
É a configuração mais conservadora possível e foi mantida por decisão do cliente
— com o custo de o pixel só enxergar a fatia de visitantes que aceita.

O banner em si (`#magia-consent-banner`) existe na home, nas PDPs, no guia, em
`resultados/` e em `sobre/`. **Não existe** no `checkout.html` nem nas cinco
páginas de `pages/`, que têm CSS próprio e não carregam `magia.css`. Quem entra
direto numa dessas páginas — por busca orgânica, por exemplo — não tem como
consentir, e o pixel fica inerte naquela sessão. Quem chega pelo anúncio entra
pela home ou por uma PDP, vê o banner, e a partir daí o consentimento vale para
o site inteiro. Replicar o banner nessas seis páginas é a próxima melhoria.

## Atribuição — `assets/js/atribuicao.js`

O visitante chega pelo anúncio com `utm_*` e `fbclid` na URL, navega até o
produto (os parâmetros somem) e o checkout redireciona para o domínio da Yampi.
Sem tratamento, o pedido chega na Yampi como tráfego direto.

O módulo grava os parâmetros de origem em `localStorage` (chave
`magia_atribuicao`, validade de 30 dias) e o `checkout.html` chama
`magiaAtribuicao.decorar(url)` para reanexá-los à URL da Yampi antes do redirect.

- Parâmetros repassados: `utm_source`, `utm_medium`, `utm_campaign`,
  `utm_content`, `utm_term`, `utm_id`, `fbclid`, `gclid`
- Um novo clique de anúncio sobrescreve a origem gravada; navegação interna não
- Parâmetro que já exista na URL montada pelo backend nunca é sobrescrito
- O `referrer` de entrada é gravado para diagnóstico, mas não vai para a Yampi

## Pendências (fora do alcance do código deste repositório)

1. **`Purchase` não existe.** O pagamento fecha em `*.yampi.com.br`, fora deste
   domínio. Nenhum código daqui alcança a confirmação do pedido. Só há dois
   caminhos: cadastrar o pixel no painel da Yampi, ou disparar o evento pela API
   de Conversões a partir do webhook de pagamento aprovado no backend que serve
   `/api/yampi-checkout`. Enquanto isso não for feito, o Meta não recebe nenhum
   sinal de venda.

2. **Públicos e histórico do pixel antigo ficaram para trás.** Até 28/07/2026 o
   site media no pixel `1513052463085684`, que não pertence à BM da agência. A
   migração para o `1164154725893602` alinhou o site à conta de anúncios, mas o
   novo pixel começa sem histórico: públicos de remarketing e otimização baseados
   no pixel antigo precisam ser reconstruídos, e o aprendizado das campanhas
   recomeça. Se houver públicos salvos valiosos no pixel antigo, o caminho é
   compartilhá-lo com a BM antes de aposentá-lo.

3. **`assets/js/whatsapp-suporte.js` existe em produção mas não neste
   repositório.** Foi publicado direto no servidor. Cuidado para o deploy não
   apagá-lo, e considere versioná-lo.

## Como validar antes de liberar tráfego

Na URL de produção, em aba anônima, pelo celular:

1. Abrir com UTMs de teste: `?utm_source=teste&utm_medium=cpc&utm_campaign=validacao`
2. Aceitar o banner de consentimento (sem isso nada dispara)
3. Confirmar no Meta Pixel Helper: `PageView` **uma vez só** por página
4. Abrir uma PDP e confirmar `ViewContent` com valor correto
5. Adicionar ao carrinho e confirmar `AddToCart`
6. Ir ao checkout, calcular o frete, finalizar e confirmar `InitiateCheckout`
7. Na URL da Yampi que abrir, conferir que as UTMs de teste vieram junto
8. Confirmar os mesmos eventos no Events Manager → Testar eventos
