/* =============================================================================
   Magia Capilar — JS base (M5)
   Componentes: header, hero slideshow, carousel, FAQ, antes/depois,
                video, cart drawer, newsletter, PDP gallery
   ============================================================================= */
(function() {
  'use strict';

  // ---------- helpers ----------
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);
  const fmtBRL = (n) => Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const esc = (s) => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  // ---------- Header scroll ----------
  function initHeader() {
    const h = $('.site-header');
    if (!h) return;
    const onScroll = () => h.classList.toggle('scrolled', window.scrollY > 10);
    on(window, 'scroll', onScroll, { passive: true });
    onScroll();

    const burger = $('.burger');
    const nav = $('.nav');
    on(burger, 'click', () => nav && nav.classList.toggle('open'));
    // Fecha mobile nav ao clicar em qualquer link (ancora ou URL)
    if (nav) {
      $$('a', nav).forEach(a => on(a, 'click', () => nav.classList.remove('open')));
    }
  }

  // ---------- Hero slideshow ----------
  function initHeroSlideshow() {
    const hero = $('.hero-slides');
    if (!hero) return;
    const slides = $$('.hero-slide', hero);
    if (slides.length === 0) return;
    const dotsWrap = $('.hero-dots');
    let idx = 0;
    let timer = null;

    const interval = parseInt(hero.dataset.interval, 10) || 6000;
    const autoplay = hero.dataset.autoplay !== 'false';

    // build dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Slide ${i + 1}`);
        on(b, 'click', () => go(i, true));
        dotsWrap.appendChild(b);
      });
    }

    const dots = dotsWrap ? $$('button', dotsWrap) : [];

    function go(i, user) {
      slides[idx].classList.remove('active');
      if (dots[idx]) dots[idx].classList.remove('active');
      idx = (i + slides.length) % slides.length;
      slides[idx].classList.add('active');
      if (dots[idx]) dots[idx].classList.add('active');
      if (user) restart();
    }
    function next() { go(idx + 1); }
    function prev() { go(idx - 1, true); }
    function start() { if (!autoplay || slides.length < 2) return; timer = setInterval(next, interval); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    go(0);
    start();

    on($('.hero-nav.prev'), 'click', prev);
    on($('.hero-nav.next'), 'click', () => go(idx + 1, true));
    on(hero, 'mouseenter', stop);
    on(hero, 'mouseleave', start);

    // touch swipe
    let tx = null;
    on(hero, 'touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    on(hero, 'touchend', e => {
      if (tx == null) return;
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 40) { if (dx > 0) prev(); else go(idx + 1, true); }
      tx = null;
    });
  }

  // ---------- Carousel generico ----------
  function initCarousels() {
    $$('.carousel-wrap').forEach(wrap => {
      const track = $('.carousel', wrap);
      const prev = $('.carousel-nav.prev', wrap);
      const next = $('.carousel-nav.next', wrap);
      if (!track) return;

      // Carrosseis com data-autoplay tambem dao loop: setas sempre clicaveis,
      // voltando ao inicio/fim em vez de travar (disabled).
      const loop = wrap.hasAttribute('data-autoplay');

      function step() {
        const child = track.firstElementChild;
        if (!child) return 300;
        const cs = getComputedStyle(track);
        const gap = parseFloat(cs.gap || '20');
        return child.getBoundingClientRect().width + gap;
      }
      function maxScroll() { return track.scrollWidth - track.clientWidth - 2; }
      function update() {
        if (loop) return; // setas nunca ficam desabilitadas quando ha loop
        if (prev) prev.classList.toggle('disabled', track.scrollLeft <= 0);
        if (next) next.classList.toggle('disabled', track.scrollLeft >= maxScroll());
      }
      // Clique = avanca/recua exatamente 1 card; o navegador trava nas pontas
      // (sem voltar ao inicio de repente).
      function goNext() { track.scrollBy({ left: step(), behavior: 'smooth' }); }
      function goPrev() { track.scrollBy({ left: -step(), behavior: 'smooth' }); }
      on(prev, 'click', goPrev);
      on(next, 'click', goNext);
      on(track, 'scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();

      // Autoplay opcional: so quando o .carousel-wrap tem data-autoplay.
      // Pausa no hover/touch e ao usar as setas; respeita reduced-motion.
      if (loop) {
        const interval = parseInt(wrap.dataset.interval, 10) || 5000;
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let timer = null, dir = 1;
        // Ping-pong: avanca ate o fim e volta suave (1 card por vez), sem salto.
        const tick = () => {
          const max = maxScroll();
          if (track.scrollLeft >= max - 1) dir = -1;
          else if (track.scrollLeft <= 1) dir = 1;
          track.scrollBy({ left: dir * step(), behavior: 'smooth' });
        };
        const startAuto = () => { if (!timer && !reduce) timer = setInterval(tick, interval); };
        const stopAuto = () => { if (timer) { clearInterval(timer); timer = null; } };
        const restart = () => { stopAuto(); startAuto(); }; // reinicia os 5s apos clicar
        startAuto();
        on(wrap, 'mouseenter', stopAuto);
        on(wrap, 'mouseleave', startAuto);
        on(track, 'touchstart', stopAuto, { passive: true });
        on(prev, 'click', restart);
        on(next, 'click', restart);
      }
    });
  }

  // ---------- FAQ accordion ----------
  function initFaq() {
    $$('.faq-item').forEach(item => {
      const btn = $('.faq-q', item);
      on(btn, 'click', () => {
        const wasOpen = item.classList.contains('open');
        // close all siblings in same .faq group
        const parent = item.parentElement;
        if (parent) $$('.faq-item.open', parent).forEach(sib => sib.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    });
  }

  // ---------- Antes e depois slider ----------
  function initAntesDepois() {
    document.querySelectorAll('.ad-slider').forEach(function(s){
      var r = s.querySelector('input[type=range]');
      if(!r) return;
      function upd(){ s.style.setProperty('--pos', r.value + '%'); }
      r.addEventListener('input', upd);
      upd();
    });
  }

  // ---------- Video player lazy ----------
  function initVideos() {
    $$('.video-wrap').forEach(wrap => {
      const play = $('.video-play', wrap);
      const video = $('video', wrap);
      on(play, 'click', () => {
        wrap.classList.add('playing');
        if (video) { video.controls = true; video.play().catch(() => {}); }
      });
    });
  }

  // ---------- Reels lightbox ----------
  function ensureReelsLightbox() {
    let box = document.getElementById('reels-lightbox');
    if (box) return box;
    box = document.createElement('div');
    box.id = 'reels-lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Reproducao de reel');
    box.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(10,5,8,.92);z-index:9999;align-items:center;justify-content:center;padding:20px;';
    box.innerHTML = `
      <button type="button" aria-label="Fechar" style="position:absolute;top:18px;right:22px;background:rgba(255,255,255,.12);border:0;color:#fff;width:42px;height:42px;border-radius:50%;font-size:24px;cursor:pointer;line-height:1;display:flex;align-items:center;justify-content:center">×</button>
      <video controls playsinline style="max-width:min(92vw,520px);max-height:88vh;border-radius:18px;background:#000;box-shadow:0 24px 80px rgba(0,0,0,.6)"></video>
    `;
    document.body.appendChild(box);
    const close = () => {
      box.style.display = 'none';
      const v = box.querySelector('video');
      if (v) { try { v.pause(); v.removeAttribute('src'); v.load(); } catch(e){} }
      document.body.style.overflow = '';
    };
    box.querySelector('button').addEventListener('click', close);
    box.addEventListener('click', e => { if (e.target === box) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.style.display !== 'none') close(); });
    return box;
  }
  function initReels() {
    $$('.reel-card').forEach(card => {
      const inlineVideo = $('video', card);
      const src = inlineVideo ? inlineVideo.getAttribute('src') : '';
      if (!src) return;
      card.style.cursor = 'pointer';
      const open = (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        const box = ensureReelsLightbox();
        const v = box.querySelector('video');
        v.src = src;
        box.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        v.play().catch(() => {});
      };
      on(card, 'click', open);
      const playOverlay = $('.reel-play', card);
      on(playOverlay, 'click', open);
    });
  }

  // ---------- PDP gallery ----------
  function initPdpGallery() {
    const gal = $('.pdp-gallery');
    if (!gal) return;
    const mainWrap = $('.pdp-gallery-main', gal);
    const main = $('img', mainWrap);
    const thumbs = $$('.pdp-thumb', gal);
    thumbs.forEach(t => {
      on(t, 'click', () => {
        thumbs.forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        const src = t.querySelector('img')?.src;
        if (!src || !main) return;
        const sources = $$('source', mainWrap);
        sources.forEach(s => s.remove());
        main.src = src;
      });
    });
  }

  // ---------- PDP qty ----------
  function initPdpQty() {
    $$('.qty-box').forEach(box => {
      const input = $('input', box);
      const [minus, plus] = $$('button', box);
      if (!input) return;
      on(minus, 'click', () => { input.value = Math.max(1, parseInt(input.value, 10) - 1); });
      on(plus, 'click', () => { input.value = Math.min(99, parseInt(input.value, 10) + 1); });
    });
  }

  // ---------- Cart drawer (simples, local) ----------
  // IMPORTANTE: usa 'mc_cart' no formato compativel com /checkout.html ({id,n,p,q,img})
  // Os getters/setters internos expõem nome/preco/qty pra UI mas persistem como n/p/q.
  const CART_KEY = 'mc_cart';

  function cartRead() {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY)) || [];
      // Normaliza formato curto -> formato extenso pro drawer
      return raw.map(r => ({
        id: String(r.id),
        nome: r.n || r.nome || '',
        preco: Number(r.p || r.preco || 0),
        qty: Number(r.q || r.qty || 1),
        img: r.img || ''
      }));
    } catch { return []; }
  }
  function cartWrite(items) {
    // Persiste no formato curto que checkout.html lê
    const compact = items.map(i => ({
      id: parseInt(i.id, 10) || i.id,
      n: i.nome || '',
      p: Number(i.preco || 0),
      q: Number(i.qty || 1),
      img: i.img || ''
    }));
    localStorage.setItem(CART_KEY, JSON.stringify(compact));
    cartRender();
  }
  function cartAdd(item) {
    const items = cartRead();
    const ex = items.find(i => String(i.id) === String(item.id));
    if (ex) ex.qty += item.qty || 1;
    else items.push({ ...item, id: String(item.id), qty: item.qty || 1 });
    cartWrite(items);
    openCart();
    // Tracking — AddToCart (Meta Pixel + GA4 + GTM dataLayer)
    try {
      const itemValue = Number(item.preco || 0) * (item.qty || 1);
      const itemPayload = {
        item_id: String(item.id),
        item_name: item.nome || '',
        item_brand: 'Magia Capilar',
        price: Number(item.preco || 0),
        quantity: item.qty || 1
      };
      // GTM dataLayer (GA4 Enhanced Ecommerce spec)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          currency: 'BRL',
          value: itemValue,
          items: [itemPayload]
        }
      });
      if (window.fbq) {
        window.fbq('track', 'AddToCart', {
          content_ids: [String(item.id)],
          content_type: 'product',
          content_name: item.nome || '',
          value: itemValue,
          currency: 'BRL'
        });
      }
      if (window.gtag) {
        window.gtag('event', 'add_to_cart', {
          currency: 'BRL',
          value: itemValue,
          items: [itemPayload]
        });
      }
    } catch (e) { /* noop */ }
  }
  function cartRemove(id) {
    cartWrite(cartRead().filter(i => String(i.id) !== String(id)));
  }
  function cartUpdateQty(id, qty) {
    const items = cartRead();
    const it = items.find(i => String(i.id) === String(id));
    if (!it) return;
    it.qty = Math.max(1, qty);
    cartWrite(items);
  }
  function cartTotal() {
    return cartRead().reduce((s, i) => s + (Number(i.preco || 0) * i.qty), 0);
  }
  function cartCount() {
    return cartRead().reduce((s, i) => s + i.qty, 0);
  }

  function cartRender() {
    const badge = $('.cart-badge');
    if (badge) {
      const n = cartCount();
      badge.textContent = n;
      badge.style.display = n > 0 ? '' : 'none';
    }
    const items = cartRead();
    const list = $('.cart-items');
    if (list) {
      if (items.length === 0) {
        list.innerHTML = '<p class="mute center" style="padding:40px 0">Seu carrinho esta vazio.</p>';
      } else {
        list.innerHTML = items.map(i => `
          <div class="cart-item" data-id="${esc(i.id)}" style="display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--mist)">
            <img src="${esc(i.img || '')}" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:8px;background:var(--blush)">
            <div style="flex:1">
              <div style="font-family:var(--f-serif);font-size:1rem;line-height:1.25;margin-bottom:4px">${esc(i.nome)}</div>
              <div class="qty-box" style="max-width:108px">
                <button type="button" data-act="minus">-</button>
                <input type="text" value="${i.qty}" readonly>
                <button type="button" data-act="plus">+</button>
              </div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:700;color:var(--wine)">${fmtBRL(i.preco * i.qty)}</div>
              <button type="button" class="remove" style="color:var(--smoke);font-size:0.75rem;margin-top:8px">Remover</button>
            </div>
          </div>
        `).join('');
        $$('.cart-item').forEach(row => {
          const id = row.dataset.id;
          const minus = row.querySelector('[data-act=minus]');
          const plus = row.querySelector('[data-act=plus]');
          const rm = row.querySelector('.remove');
          const it = items.find(x => x.id === id);
          if (!it) return;
          on(minus, 'click', () => cartUpdateQty(id, it.qty - 1));
          on(plus, 'click', () => cartUpdateQty(id, it.qty + 1));
          on(rm, 'click', () => cartRemove(id));
        });
      }
    }
    const totalEl = $('.cart-total-val');
    if (totalEl) totalEl.textContent = fmtBRL(cartTotal());
  }

  function openCart()  { $('.cart-drawer')?.classList.add('open'); $('.cart-overlay')?.classList.add('open'); }
  function closeCart() { $('.cart-drawer')?.classList.remove('open'); $('.cart-overlay')?.classList.remove('open'); }

  function initCart() {
    on($('.open-cart'), 'click', openCart);
    on($('.close-cart'), 'click', closeCart);
    on($('.cart-overlay'), 'click', closeCart);
    // buttons with data-prod-id (cards, pdp)
    $$('[data-add-cart]').forEach(btn => {
      on(btn, 'click', (e) => {
        e.preventDefault();
        const id   = btn.dataset.prodId;
        const nome = btn.dataset.prodNome;
        const preco = parseFloat(btn.dataset.prodPreco || '0');
        const img  = btn.dataset.prodImg || '';
        const qty  = parseInt(btn.dataset.prodQty || '1', 10);
        if (!id) return;
        cartAdd({ id, nome, preco, img, qty });
      });
    });
    // M9: Compre junto — adiciona varios produtos ao carrinho em um clique
    $$('.cj-add-btn').forEach(btn => {
      on(btn, 'click', () => {
        const count = parseInt(btn.dataset.cjCount || '0', 10);
        for (let i = 0; i < count; i++) {
          const id = btn.dataset[`cjId${i}`];
          const nome = btn.dataset[`cjNome${i}`];
          const preco = parseFloat(btn.dataset[`cjPreco${i}`] || '0');
          const img = btn.dataset[`cjImg${i}`] || '';
          if (id) cartAdd({ id, nome, preco, img, qty: 1 });
        }
      });
    });
    // InitiateCheckout on checkout button click (Meta Pixel + GA4 + GTM dataLayer)
    $$('.cart-checkout-btn').forEach(btn => {
      on(btn, 'click', () => {
        try {
          const items = cartRead();
          const value = cartTotal();
          const ids = items.map(i => String(i.id));
          const contents = items.map(i => ({ id: String(i.id), quantity: i.qty, item_price: Number(i.preco || 0) }));
          const ga4Items = items.map(i => ({
            item_id: String(i.id),
            item_name: i.nome || '',
            item_brand: 'Magia Capilar',
            price: Number(i.preco || 0),
            quantity: i.qty
          }));
          // GTM dataLayer (GA4 Enhanced Ecommerce spec)
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ ecommerce: null });
          window.dataLayer.push({
            event: 'begin_checkout',
            ecommerce: {
              currency: 'BRL',
              value,
              items: ga4Items
            }
          });
          if (window.fbq) {
            window.fbq('track', 'InitiateCheckout', {
              content_ids: ids,
              content_type: 'product',
              contents,
              value,
              currency: 'BRL',
              num_items: cartCount()
            });
          }
          if (window.gtag) {
            window.gtag('event', 'begin_checkout', {
              currency: 'BRL',
              value,
              items: ga4Items
            });
          }
        } catch (e) { /* noop */ }
      });
    });
    cartRender();
  }

  // ---------- select_item tracking (GTM dataLayer) ----------
  function initSelectItem() {
    $$('.prod-card a[href^="/produto/"]').forEach(link => {
      on(link, 'click', () => {
        try {
          const card = link.closest('.prod-card');
          if (!card) return;
          const btn = card.querySelector('[data-add-cart]');
          if (!btn) return;
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ ecommerce: null });
          window.dataLayer.push({
            event: 'select_item',
            ecommerce: {
              items: [{
                item_id: btn.dataset.prodId || '',
                item_name: btn.dataset.prodNome || '',
                item_brand: 'Magia Capilar',
                price: parseFloat(btn.dataset.prodPreco || '0')
              }]
            }
          });
        } catch (e) { /* noop */ }
      });
    });
  }

  // expose minimal cart API
  window.MagiaCart = {
    add: cartAdd, remove: cartRemove, update: cartUpdateQty,
    read: cartRead, total: cartTotal, count: cartCount,
    open: openCart, close: closeCart
  };

  // ---------- Newsletter form ----------
  function initNewsletter() {
    $$('.newsletter-form').forEach(form => {
      on(form, 'submit', async (e) => {
        e.preventDefault();
        const input = $('input[type=email]', form);
        const btn = $('button', form);
        if (!input || !input.value.trim()) return;
        const email = input.value.trim();
        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = 'Enviando...';
        try {
          await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          btn.textContent = 'Obrigado!';
          input.value = '';
        } catch {
          btn.textContent = 'Erro, tente de novo';
        }
        setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 2500);
      });
    });
  }

  // ---------- CEP frete check (PDP) ----------
  function initFreteCheck() {
    $$('.pdp-frete-check').forEach(block => {
      const input = $('input', block);
      const btn = $('button', block);
      on(btn, 'click', async () => {
        const cep = (input.value || '').replace(/\D/g, '');
        if (cep.length !== 8) { input.focus(); return; }
        btn.disabled = true;
        btn.textContent = 'Calculando...';
        try {
          const r = await fetch(`/api/frete?cep=${cep}`);
          const d = await r.json();
          let result = block.querySelector('.frete-result');
          if (!result) {
            result = document.createElement('div');
            result.className = 'frete-result';
            result.style.cssText = 'margin-top:14px;padding:12px;background:var(--ivory);border-radius:8px;font-size:0.88rem';
            block.appendChild(result);
          }
          if (d && d.servicos && d.servicos.length) {
            result.innerHTML = d.servicos.map(s =>
              `<div style="display:flex;justify-content:space-between;padding:4px 0"><span>${s.nome} <small class="mute">(${s.prazo}d)</small></span><strong>${fmtBRL(s.valor)}</strong></div>`
            ).join('');
          } else {
            result.innerHTML = '<span class="mute">Nao foi possivel calcular o frete para este CEP.</span>';
          }
        } catch {
          let result = block.querySelector('.frete-result');
          if (result) result.innerHTML = '<span class="mute">Erro ao consultar frete.</span>';
        }
        btn.disabled = false;
        btn.textContent = 'Calcular';
      });
    });
  }

  // ---------- Init on DOMContentLoaded ----------
  function init() {
    initHeader();
    initHeroSlideshow();
    initCarousels();
    initFaq();
    initAntesDepois();
    initVideos();
    initReels();
    initPdpGallery();
    initPdpQty();
    initCart();
    initSelectItem();
    initNewsletter();
    initFreteCheck();
    initSocialProof();
  }

  function initSocialProof() {
    var el = document.getElementById('sp-toast');
    if (!el) return;
    var people = [
      {n:'Carla M.',c:'São Paulo, SP',p:'Vitamina Magia Grow',img:'/img/avaliacoes/sp_carla.jpg'},
      {n:'Amanda S.',c:'Rio de Janeiro, RJ',p:'Kit Completo',img:'/img/avaliacoes/sp_amanda.jpg'},
      {n:'Renata L.',c:'Belo Horizonte, MG',p:'Tônico Antiqueda',img:'/img/avaliacoes/sp_renata.jpg'},
      {n:'Tatiane O.',c:'Curitiba, PR',p:'Máscara Ultra Hidratante',img:'/img/avaliacoes/sp_tatiane.jpg'},
      {n:'Camila R.',c:'Salvador, BA',p:'Shampoo DHT',img:'/img/avaliacoes/sp_camila.jpg'},
      {n:'Lúcia F.',c:'Fortaleza, CE',p:'Kit Completo',img:'/img/avaliacoes/sp_lucia.jpg'},
      {n:'Mônica A.',c:'Porto Alegre, RS',p:'Vitamina Magia Grow',img:'/img/avaliacoes/sp_monica.jpg'},
      {n:'Adriana P.',c:'Recife, PE',p:'Tônico Antiqueda',img:'/img/avaliacoes/sp_adriana.jpg'},
      {n:'Juliana R.',c:'Campinas, SP',p:'Máscara Ultra Hidratante',img:'/img/avaliacoes/br_juliana_reis.jpg'},
      {n:'Patrícia V.',c:'Goiânia, GO',p:'Shampoo DHT',img:'/img/avaliacoes/br_patricia.jpg'},
      {n:'Fernanda C.',c:'Florianópolis, SC',p:'Kit Completo',img:'/img/avaliacoes/br_fernanda.jpg'},
      {n:'Daniela R.',c:'Manaus, AM',p:'Vitamina Magia Grow',img:'/img/avaliacoes/sp_daniela.jpg'},
      {n:'Isabela M.',c:'Brasília, DF',p:'Tônico Antiqueda',img:'/img/avaliacoes/sp_isabela.jpg'},
      {n:'Larissa T.',c:'Vitória, ES',p:'Kit Completo',img:'/img/avaliacoes/sp_larissa.jpg'},
      {n:'Natália B.',c:'Belém, PA',p:'Máscara Ultra Hidratante',img:'/img/avaliacoes/sp_natalia.jpg'},
      {n:'Priscila O.',c:'São Luís, MA',p:'Shampoo DHT',img:'/img/avaliacoes/sp_priscila.jpg'},
      {n:'Viviane S.',c:'Natal, RN',p:'Vitamina Magia Grow',img:'/img/avaliacoes/sp_viviane.jpg'},
      {n:'Aline G.',c:'João Pessoa, PB',p:'Tônico Antiqueda',img:'/img/avaliacoes/sp_aline.jpg'},
      {n:'Bianca F.',c:'Maceió, AL',p:'Kit Completo',img:'/img/avaliacoes/sp_bianca.jpg'},
      {n:'Carolina D.',c:'Teresina, PI',p:'Máscara Ultra Hidratante',img:'/img/avaliacoes/sp_carolina.jpg'},
      {n:'Débora N.',c:'Campo Grande, MS',p:'Shampoo DHT',img:'/img/avaliacoes/sp_debora.jpg'},
      {n:'Elaine W.',c:'Cuiabá, MT',p:'Vitamina Magia Grow',img:'/img/avaliacoes/sp_elaine.jpg'},
      {n:'Flávia K.',c:'Aracaju, SE',p:'Kit Completo',img:'/img/avaliacoes/sp_flavia.jpg'},
      {n:'Gabriela H.',c:'Ribeirão Preto, SP',p:'Tônico Antiqueda',img:'/img/avaliacoes/sp_gabriela.jpg'},
      {n:'Helena P.',c:'Uberlândia, MG',p:'Máscara Ultra Hidratante',img:'/img/avaliacoes/sp_helena.jpg'},
      {n:'Joana L.',c:'Sorocaba, SP',p:'Shampoo DHT',img:'/img/avaliacoes/sp_joana.jpg'},
      {n:'Kelly A.',c:'Londrina, PR',p:'Vitamina Magia Grow',img:'/img/avaliacoes/sp_kelly.jpg'},
      {n:'Beatriz N.',c:'Santos, SP',p:'Kit Completo',img:'/img/avaliacoes/br_juliana.jpg'},
      {n:'Letícia G.',c:'Niterói, RJ',p:'Tônico Antiqueda',img:'/img/avaliacoes/br_fernanda.jpg'},
      {n:'Mariana D.',c:'Juiz de Fora, MG',p:'Máscara Ultra Hidratante',img:'/img/avaliacoes/br_patricia.jpg'}
    ];
    var times = ['há 2 minutos','há 5 minutos','há 8 minutos','há 12 minutos','há 15 minutos','há 18 minutos','há 23 minutos','há 30 minutos','há 1 hora','há 2 horas'];
    var imgEl = el.querySelector('.sp-toast-img');
    var nameEl = el.querySelector('.sp-toast-name');
    var actEl = el.querySelector('.sp-toast-action');
    var timeEl = el.querySelector('.sp-toast-time');
    var closeBtn = el.querySelector('.sp-toast-close');
    var idx = Math.floor(Math.random() * people.length);
    var showing = false;
    var timer;

    function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
    shuffle(people);

    function show() {
      var p = people[idx % people.length];
      var t = times[Math.floor(Math.random() * times.length)];
      imgEl.src = p.img;
      imgEl.alt = p.n;
      imgEl.hidden = false;
      nameEl.textContent = p.n + ' — ' + p.c;
      actEl.innerHTML = 'comprou <strong>' + p.p + '</strong>';
      timeEl.textContent = t;
      el.classList.add('sp-show');
      showing = true;
      idx++;
      timer = setTimeout(hide, 6000);
    }
    function hide() {
      el.classList.remove('sp-show');
      showing = false;
      timer = setTimeout(show, 12000 + Math.random() * 18000);
    }
    if (closeBtn) closeBtn.addEventListener('click', function(){
      clearTimeout(timer);
      el.classList.remove('sp-show');
      showing = false;
      timer = setTimeout(show, 30000);
    });
    setTimeout(show, 5000 + Math.random() * 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
