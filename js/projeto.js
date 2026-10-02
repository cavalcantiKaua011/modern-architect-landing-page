/* ==========================================================================
   THAIS MACENNA — ARQUITETURA
   js/projeto.js · Página individual de projeto (?slug=...)
   Banner · Galeria · Vídeo 3D · Conceito · Soluções · Antes e depois
   ========================================================================== */
(function () {
  'use strict';

  var C = window.TM || {};
  var CONFIG = C.config || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function waLink(msg) {
    return 'https://wa.me/' + (CONFIG.whatsapp || '') + '?text=' + encodeURIComponent(msg || '');
  }
  function getSlug() {
    var p = new URLSearchParams(window.location.search);
    var fromQuery = p.get('slug') || p.get('projeto');
    if (fromQuery) return fromQuery;
    /* Fallback: #slug=... permite links diretos e pré-render */
    var h = String(window.location.hash || '').replace(/^#/, '');
    var fromHash = new URLSearchParams(h).get('slug');
    if (fromHash) return fromHash;
    var host = document.querySelector('[data-projeto]');
    return (host && host.getAttribute('data-slug')) || '';
  }

  function loadProjetos() {
    return fetch('tables/projetos?limit=100&sort=ordem', { headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (j) {
        var rows = j && (j.data || j.rows);
        if (Array.isArray(rows) && rows.length) return rows;
        throw new Error('vazio');
      })
      .catch(function () { return (window.TM_PROJETOS || []).slice(); });
  }

  /* Normaliza separadores: aceita quebra de linha real ou a sequência "\n" */
  var BS = String.fromCharCode(92);
  var NL = String.fromCharCode(10);
  function normalizeList(raw) {
    var s = String(raw == null ? '' : raw);
    s = s.split(BS + BS + 'n').join(NL);   // \\n -> newline
    s = s.split(BS + 'n').join(NL);         // \n  -> newline
    s = s.replace(/\r/g, '');
    return s.split(NL).join('•').split('•');
  }

  function renderBullets(raw) {
    var parts = normalizeList(raw)
      .map(function (s) { return s.replace(/^[•\-*]\s*/, '').trim(); })
      .filter(Boolean);
    if (!parts.length) return '';
    return '<ul class="proj-bullets">' + parts.map(function (t) {
      return '<li>' + esc(t) + '</li>';
    }).join('') + '</ul>';
  }

  function videoEmbed(url) {
    if (!url) return '';
    var id = '';
    var yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
    var vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (yt) id = 'https://www.youtube-nocookie.com/embed/' + yt[1] + '?rel=0&modestbranding=1';
    else if (vm) id = 'https://player.vimeo.com/video/' + vm[1];
    else return '';
    return '<div class="proj-video"><iframe src="' + esc(id) + '" title="Tour 3D do projeto" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>';
  }

  function notFound() {
    var host = document.querySelector('[data-projeto]');
    if (!host) return;
    host.innerHTML =
      '<section class="section" style="padding-top:calc(var(--header-h) + 5rem)">' +
        '<div class="wrap wrap--narrow" style="text-align:center">' +
          '<span class="eyebrow">Projeto não encontrado</span>' +
          '<h1>Este projeto saiu do ar <em class="italic-accent">ou nunca existiu</em>.</h1>' +
          '<p class="lead" style="margin:1.5rem auto 2rem">Explore o portfólio completo ou fale direto com a Thais para conhecer outros trabalhos.</p>' +
          '<div style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap">' +
            '<a class="btn" href="index.html#portfolio">Ver portfólio</a>' +
            '<a class="btn btn--ghost" href="index.html#orcamento">Solicitar orçamento</a>' +
          '</div>' +
        '</div>' +
      '</section>';
  }

  function render(p, all, index) {
    var host = document.querySelector('[data-projeto]');
    if (!host || !p) return;

    document.title = p.titulo + ' · Projeto de ' + p.categoria + ' — Thais Macenna Arquitetura';
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', (p.resumo || '') + ' Projeto de arquitetura em ' + (p.local || 'São Paulo') + ' por Thais Macenna.');
    var ogi = document.querySelector('meta[property="og:image"]');
    if (ogi && p.capa) ogi.setAttribute('content', p.capa);
    var crumb = document.querySelector('[data-crumb]');
    if (crumb) crumb.textContent = p.titulo;

    var galeria = Array.isArray(p.galeria) ? p.galeria.filter(Boolean) : [];
    if (!galeria.length && p.capa) galeria = [p.capa];

    var prev = all[(index - 1 + all.length) % all.length];
    var next = all[(index + 1) % all.length];

    var antesDepois = (p.antes && p.depois) ? '' +
      '<section class="section section--warm" id="antes-depois">' +
        '<div class="wrap">' +
          '<div class="section-head section-head--center" data-reveal>' +
            '<span class="eyebrow">Transformação</span>' +
            '<h2>Antes e <em class="italic-accent">depois</em></h2>' +
            '<p class="lead">Arraste a linha central para comparar o estado original e o resultado final.</p>' +
          '</div>' +
          '<div class="compare" data-compare data-reveal="scale">' +
            '<img class="compare__after" src="' + esc(p.depois) + '" alt="Depois — ' + esc(p.titulo) + '">' +
            '<div class="compare__before-wrap"><img class="compare__before" src="' + esc(p.antes) + '" alt="Antes — ' + esc(p.titulo) + '"></div>' +
            '<div class="compare__handle" data-compare-handle aria-hidden="true"><span></span></div>' +
            '<input class="compare__range" data-compare-range type="range" min="0" max="100" value="50" aria-label="Comparar antes e depois">' +
            '<span class="compare__tag compare__tag--l">Antes</span>' +
            '<span class="compare__tag compare__tag--r">Depois</span>' +
          '</div>' +
        '</div>' +
      '</section>' : '';

    host.innerHTML = '' +
      /* ---------- Banner ---------- */
      '<section class="proj-hero">' +
        '<img src="' + esc(p.capa) + '" alt="' + esc(p.titulo) + ' — banner do projeto" data-parallax="0.08">' +
        '<div class="proj-hero__scrim"></div>' +
        '<div class="wrap proj-hero__inner">' +
          '<nav class="breadcrumb" aria-label="Trilha de navegação">' +
            '<a href="index.html">Início</a><span>/</span>' +
            '<a href="index.html#portfolio">Portfólio</a><span>/</span>' +
            '<span aria-current="page" data-crumb>' + esc(p.titulo) + '</span>' +
          '</nav>' +
          '<span class="badge">' + esc(p.categoria) + '</span>' +
          '<h1>' + esc(p.titulo) + '</h1>' +
          '<p class="proj-hero__sub">' + esc(p.resumo || '') + '</p>' +
        '</div>' +
      '</section>' +

      /* ---------- Ficha técnica ---------- */
      '<section class="section section--tight">' +
        '<div class="wrap">' +
          '<div class="proj-facts" data-reveal>' +
            '<div class="proj-fact"><span>Local</span><strong>' + esc(p.local || '—') + '</strong></div>' +
            '<div class="proj-fact"><span>Ano</span><strong>' + esc(p.ano || '—') + '</strong></div>' +
            '<div class="proj-fact"><span>Área</span><strong>' + (p.area_m2 ? esc(p.area_m2) + ' m²' : '—') + '</strong></div>' +
            '<div class="proj-fact"><span>Categoria</span><strong>' + esc(p.categoria) + '</strong></div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* ---------- Conceito + Soluções ---------- */
      '<section class="section">' +
        '<div class="wrap">' +
          '<div class="proj-two-col">' +
            '<div data-reveal="left">' +
              '<span class="eyebrow">Conceito</span>' +
              '<h2 style="margin-bottom:1.25rem">A ideia por trás do projeto</h2>' +
              '<p class="proj-text">' + esc(p.conceito || '') + '</p>' +
            '</div>' +
            '<div data-reveal="right">' +
              '<span class="eyebrow">Soluções aplicadas</span>' +
              '<h2 style="margin-bottom:1.25rem">Decisões que mudaram a experiência</h2>' +
              renderBullets(p.solucoes) +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* ---------- Galeria ---------- */
      '<section class="section section--alt" id="galeria">' +
        '<div class="wrap">' +
          '<div class="section-head section-head--center" data-reveal>' +
            '<span class="eyebrow">Galeria</span>' +
            '<h2>Ambientes do <em class="italic-accent">projeto</em></h2>' +
          '</div>' +
          '<div class="proj-gallery" data-gallery>' +
            galeria.map(function (src, i) {
              return '<button type="button" class="proj-gallery__item' + (i % 5 === 0 ? ' is-wide' : '') + '" data-gallery-item data-index="' + i + '" data-reveal aria-label="Ampliar imagem ' + (i + 1) + '">' +
                '<img src="' + esc(src) + '" alt="' + esc(p.titulo) + ' — ambiente ' + (i + 1) + '" loading="lazy" decoding="async">' +
              '</button>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</section>' +

      /* ---------- Vídeo 3D ---------- */
      (videoEmbed(p.video_url) ? '' +
      '<section class="section" id="video">' +
        '<div class="wrap">' +
          '<div class="section-head section-head--center" data-reveal>' +
            '<span class="eyebrow">Tour 3D</span>' +
            '<h2>Caminhe pelo projeto <em class="italic-accent">antes de construir</em></h2>' +
            '<p class="lead">Visualização tridimensional usada para validar materiais, luz e proporções com os clientes.</p>' +
          '</div>' +
          '<div data-reveal="scale">' + videoEmbed(p.video_url) + '</div>' +
        '</div>' +
      '</section>' : '') +

      antesDepois +

      /* ---------- CTA projeto ---------- */
      '<section class="section">' +
        '<div class="wrap">' +
          '<div class="proj-cta" data-reveal>' +
            '<div>' +
              '<span class="eyebrow">Gostou deste resultado?</span>' +
              '<h2>Seu projeto pode ser o <em class="italic-accent">próximo</em>.</h2>' +
              '<p class="lead">Conte o que você imagina e receba uma orientação clara sobre escopo, prazos e investimento.</p>' +
            '</div>' +
            '<div class="proj-cta__actions">' +
              '<a class="btn" href="index.html#orcamento">Solicitar orçamento</a>' +
              '<a class="btn btn--wa" data-wa="Olá, Thais! Vi o projeto ' + esc(p.titulo) + ' no seu site e gostaria de algo parecido."><svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2A9.9 9.9 0 002.1 11.9c0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.9 9.9 0 004.74 1.2h.01A9.9 9.9 0 0022 11.9 9.87 9.87 0 0012.04 2zm5.8 14.03c-.24.68-1.4 1.3-1.93 1.35-.53.05-1.03.24-3.46-.72-2.93-1.16-4.79-4.17-4.93-4.36-.14-.19-1.18-1.57-1.18-3s.75-2.13 1.01-2.42c.26-.29.58-.36.77-.36l.55.01c.18.01.42-.07.65.5l.89 2.15c.07.15.12.32.02.51-.1.19-.15.31-.29.48l-.44.51c-.14.14-.28.3-.12.58.16.29.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.61-.07l.87-1.01c.19-.24.36-.17.6-.08l1.72.81c.24.12.4.17.46.27.06.1.06.58-.18 1.26z"/></svg> Falar no WhatsApp</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* ---------- Navegação entre projetos ---------- */
      '<section class="section section--tight section--warm">' +
        '<div class="wrap">' +
          '<div class="proj-nav">' +
            '<a class="proj-nav__link" href="projeto.html?slug=' + esc(prev.slug) + '">' +
              '<span class="proj-nav__dir">← Projeto anterior</span>' +
              '<span class="proj-nav__title">' + esc(prev.titulo) + '</span>' +
            '</a>' +
            '<a class="proj-nav__link proj-nav__link--r" href="projeto.html?slug=' + esc(next.slug) + '">' +
              '<span class="proj-nav__dir">Próximo projeto →</span>' +
              '<span class="proj-nav__title">' + esc(next.titulo) + '</span>' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</section>';

    /* WhatsApp dinâmico + reveal dos novos elementos */
    document.querySelectorAll('[data-wa]').forEach(function (a) {
      a.href = waLink(a.getAttribute('data-wa'));
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });

    initReveal(); initLightbox(galeria, p.titulo); initCompare(); initParallax();

    if (window.TM && window.TM.refreshFloating) window.TM.refreshFloating();
  }

  /* ---------- Reveal local ---------- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]:not(.is-in)');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Parallax local ---------- */
  function initParallax() {
    if (reduceMotion) return;
    var els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;
    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var s = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - vh / 2) * s).toFixed(2) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Lightbox da galeria ---------- */
  function initLightbox(galeria, titulo) {
    var lb = document.querySelector('[data-lightbox]');
    if (!lb || !galeria.length) return;
    var img = lb.querySelector('[data-lb-img]');
    var cap = lb.querySelector('[data-lb-cap]');
    var thumbs = lb.querySelector('[data-lb-thumbs]');
    var current = 0;

    function buildThumbs() {
      if (!thumbs) return;
      thumbs.innerHTML = galeria.map(function (src, i) {
        return '<button type="button" class="lightbox__thumb' + (i === 0 ? ' is-active' : '') + '" data-lb-thumb="' + i + '" aria-label="Imagem ' + (i + 1) + '"><img src="' + esc(src) + '" alt=""></button>';
      }).join('');
    }
    function show(i) {
      current = (i + galeria.length) % galeria.length;
      if (img) img.src = galeria[current];
      if (cap) cap.innerHTML = esc(titulo) + '<small>Ambiente ' + (current + 1) + ' de ' + galeria.length + '</small>';
      if (thumbs) {
        thumbs.querySelectorAll('[data-lb-thumb]').forEach(function (t) {
          t.classList.toggle('is-active', parseInt(t.getAttribute('data-lb-thumb'), 10) === current);
        });
      }
    }
    function open(i) {
      show(i);
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lb.setAttribute('aria-hidden', 'false');
    }
    function close() {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      lb.setAttribute('aria-hidden', 'true');
    }

    buildThumbs();

    document.querySelectorAll('[data-gallery-item]').forEach(function (btn) {
      btn.addEventListener('click', function () { open(parseInt(btn.getAttribute('data-index'), 10) || 0); });
    });
    if (thumbs) {
      thumbs.addEventListener('click', function (e) {
        var t = e.target.closest('[data-lb-thumb]');
        if (t) show(parseInt(t.getAttribute('data-lb-thumb'), 10));
      });
    }
    lb.querySelectorAll('[data-lb-close]').forEach(function (b) { b.addEventListener('click', close); });
    var prevB = lb.querySelector('[data-lb-prev]');
    var nextB = lb.querySelector('[data-lb-next]');
    if (prevB) prevB.addEventListener('click', function () { show(current - 1); });
    if (nextB) nextB.addEventListener('click', function () { show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------- Comparador antes/depois ---------- */
  function initCompare() {
    document.querySelectorAll('[data-compare]').forEach(function (box) {
      var range = box.querySelector('[data-compare-range]');
      var before = box.querySelector('.compare__before-wrap');
      var handle = box.querySelector('[data-compare-handle]');
      if (!range || !before) return;
      function set(v) {
        before.style.width = v + '%';
        if (handle) handle.style.left = v + '%';
      }
      range.addEventListener('input', function () { set(range.value); });
      set(range.value || 50);
    });
  }

  /* ---------- Bootstrap ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    var slug = getSlug();
    loadProjetos().then(function (all) {
      if (!all.length) { notFound(); return; }
      var idx = 0;
      var found = null;
      all.forEach(function (p, i) {
        if (found) return;
        if (String(p.slug) === String(slug) || String(p.id) === String(slug)) { found = p; idx = i; }
      });
      if (!found) { notFound(); return; }
      render(found, all, idx);
    });
  });
})();
