/*
 * Atribuicao — captura e persiste a origem da visita.
 *
 * Problema que resolve: o visitante chega pelo anuncio na home com utm_* e
 * fbclid na URL, navega ate a pagina de produto (os parametros somem), e o
 * checkout redireciona para o dominio da Yampi sem nenhum sinal de origem.
 * Resultado: a venda aparece na Yampi como trafego direto e o Meta perde o
 * vinculo entre o clique no anuncio e o pedido.
 *
 * Como funciona: na primeira pagina da sessao, os parametros de origem sao
 * lidos da URL e gravados. Nas paginas seguintes eles continuam disponiveis,
 * e o checkout usa magiaAtribuicao.decorar() para reanexa-los na URL da Yampi
 * antes do redirect.
 *
 * Regra de gravacao: first-touch por sessao. Uma nova visita COM parametros
 * sobrescreve o que estava gravado (o clique mais recente e o que trouxe a
 * pessoa de volta); navegacao interna sem parametros nao apaga nada.
 */
(function (window) {
  'use strict';

  var CHAVE = 'magia_atribuicao';
  var VALIDADE_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias, alinhado a janela de atribuicao

  // Parametros repassados adiante. utm_* alimentam os relatorios da Yampi e do
  // GA4; fbclid e gclid sao os identificadores de clique de Meta e Google Ads.
  var PARAMS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'utm_id',
    'fbclid',
    'gclid'
  ];

  function ler() {
    try {
      var bruto = localStorage.getItem(CHAVE);
      if (!bruto) return null;
      var dados = JSON.parse(bruto);
      if (!dados || !dados.ts) return null;
      if (Date.now() - dados.ts > VALIDADE_MS) {
        localStorage.removeItem(CHAVE);
        return null;
      }
      return dados;
    } catch (e) {
      return null;
    }
  }

  function gravar(params) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify({ ts: Date.now(), params: params }));
    } catch (e) { /* localStorage indisponivel (aba anonima com storage bloqueado) */ }
  }

  function capturar() {
    var busca;
    try {
      busca = new URLSearchParams(window.location.search);
    } catch (e) {
      return;
    }

    var encontrados = {};
    var houve = false;
    for (var i = 0; i < PARAMS.length; i++) {
      var valor = busca.get(PARAMS[i]);
      if (valor) {
        encontrados[PARAMS[i]] = valor;
        houve = true;
      }
    }

    // Sem parametros na URL: navegacao interna ou acesso direto. Preserva o que
    // ja estava gravado em vez de sobrescrever com vazio.
    if (!houve) return;

    // Referrer da entrada ajuda a diagnosticar trafego sem UTM.
    if (document.referrer && document.referrer.indexOf(window.location.hostname) === -1) {
      encontrados.referrer_entrada = document.referrer;
    }

    gravar(encontrados);
  }

  /*
   * Anexa os parametros de origem gravados a uma URL externa (checkout Yampi).
   * Parametro que ja exista na URL de destino e mantido — a origem gravada
   * nunca sobrescreve o que o backend montou.
   */
  function decorar(url) {
    var dados = ler();
    if (!dados || !dados.params) return url;

    try {
      var alvo = new URL(url);
      for (var chave in dados.params) {
        if (!Object.prototype.hasOwnProperty.call(dados.params, chave)) continue;
        if (chave === 'referrer_entrada') continue; // diagnostico interno, nao vai pra Yampi
        if (alvo.searchParams.has(chave)) continue;
        alvo.searchParams.set(chave, dados.params[chave]);
      }
      return alvo.toString();
    } catch (e) {
      return url;
    }
  }

  function obter() {
    var dados = ler();
    return dados && dados.params ? dados.params : {};
  }

  capturar();

  window.magiaAtribuicao = {
    decorar: decorar,
    obter: obter
  };
})(window);
