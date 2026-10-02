/* ==========================================================================
   THAIS MACENNA — ARQUITETURA
   js/main.js · Interatividade, animações, portfólio e captação de leads
   --------------------------------------------------------------------------
   Índice:
   1.  Configuração global
   2.  Tema (dark mode)
   3.  Header: estado de scroll, drawer mobile, scrollspy
   4.  Scroll reveal + contadores
   5.  Parallax leve
   6.  Progresso de leitura / voltar ao topo / WhatsApp flutuante
   7.  Portfólio: carregamento, render, filtros
   8.  Depoimentos
   9.  Formulário de orçamento (validação, upload, envio, WhatsApp)
   10. Diversos (ano no footer, smooth anchor)
   ========================================================================== */
(function () {
  'use strict';

  /* ========================================================================
     1. CONFIGURAÇÃO GLOBAL  (ponto único de edição da marca)
     ======================================================================== */
  var CONFIG = {
    whatsapp: '5511912345678',            // somente dígitos, com DDI
    whatsappLabel: '(11) 91234-5678',
    email: 'contato@thaismacenna.com.br',
    instagram: 'thaismacenna.arq',
    cidade: 'São Paulo · SP',
    atendimento: 'Seg a Sex · 9h às 18h'
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function waLink(message) {
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(message || '');
  }

  function igLink() {
    return 'https://instagram.com/' + CONFIG.instagram;
  }

  /* Dados de reserva: garantem que o portfólio sempre renderize,
     mesmo se a API de tabelas estiver indisponível. */
  var FALLBACK_PROJETOS = window.TM_PROJETOS || [];
  var FALLBACK_DEPOIMENTOS = window.TM_DEPOIMENTOS || [];

  /* Exposto para as páginas internas */
  window.TM = {
    config: CONFIG,
    waLink: waLink,
    igLink: igLink,
    projetos: FALLBACK_PROJETOS
  };

  /* ========================================================================
     2. TEMA (DARK MODE)
     ======================================================================== */
  function initTheme() {
    var toggle = document.querySelectorAll('[data-theme-toggle]');
    if (!toggle.length) return;

    var stored = null;
    try { stored = localStorage.getItem('tm-theme'); } catch (e) { stored = null; }
    if (stored) document.documentElement.setAttribute('data-theme', stored);

    Array.prototype.forEach.call(toggle, function (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('tm-theme', next); } catch (e) {}
        btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
      });
    });
  }

  /* ========================================================================
     3. HEADER: SCROLL, DRAWER, SCROLLSPY
     ======================================================================== */
  function initHeader() {
    var header = document.querySelector('.site-header');
    var burger = document.querySelector('[data-burger]');
    var drawer = document.querySelector('.nav-drawer');
    var scrim = document.querySelector('[data-scrim]');
    var closeBtn = document.querySelector('[data-drawer-close]');

    function openDrawer() {
      if (!drawer) return;
      drawer.classList.add('is-open');
      if (scrim) scrim.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      drawer.setAttribute('aria-hidden', 'false');
      if (burger) burger.setAttribute('aria-expanded', 'true');
    }
    function closeDrawer() {
      if (!drawer) return;
      drawer.classList.remove('is-open');
      if (scrim) scrim.classList.remove('is-open');
      document.body.style.overflow = '';
      drawer.setAttribute('aria-hidden', 'true');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    }

    if (burger) burger.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (scrim) scrim.addEventListener('click', closeDrawer);
    if (drawer) {
      Array.prototype.forEach.call(drawer.querySelectorAll('a'), function (a) {
        a.addEventListener('click', closeDrawer);
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });

    /* Estado de scroll */
    var ticking = false;
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('is-stuck', y > 40);

      /* Progresso de leitura */
      var bar = document.querySelector('.read-progress');
      if (bar) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }

      /* Botão topo + WhatsApp flutuante */
      var top = document.querySelector('.to-top');
      if (top) top.classList.toggle('is-visible', y > 620);
      var wa = document.querySelector('.wa-float');
      if (wa) wa.classList.toggle('is-visible', y > 420);

      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    /* Scrollspy simples */
    var links = document.querySelectorAll('.nav__link[href^="#"], .nav-drawer__link[href^="#"]');
    var sections = [];
    Array.prototype.forEach.call(links, function (l) {
      var id = l.getAttribute('href');
      if (id && id.length > 1) {
        var el = document.querySelector(id);
        if (el && sections.indexOf(el) === -1) sections.push(el);
      }
    });
    if (sections.length && 'IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          Array.prototype.forEach.call(links, function (l) {
            l.classList.toggle('is-current', l.getAttribute('href') === '#' + en.target.id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { spy.observe(s); });
    }
  }

  /* ========================================================================
     4. SCROLL REVEAL + CONTADORES
     ======================================================================== */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1500;
    var start = null;

    if (reduceMotion) {
      el.textContent = target.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      return;
    }
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = val.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  function initCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(nums, animateCount);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call(nums, function (n) { io.observe(n); });
  }

  /* ========================================================================
     5. PARALLAX LEVE
     ======================================================================== */
  function initParallax() {
    if (reduceMotion) return;
    var els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;
    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      Array.prototype.forEach.call(els, function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        var offset = (rect.top + rect.height / 2 - vh / 2) * speed;
        el.style.transform = 'translate3d(0,' + offset.toFixed(2) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ========================================================================
     6. WHATSAPP FLUTUANTE / VOLTAR AO TOPO / LINKS DINÂMICOS
     ======================================================================== */
  function initFloating() {
    var wa = document.querySelector('.wa-float');
    if (wa) {
      wa.href = waLink('Olá, Thais! Vi seu site e gostaria de conversar sobre um projeto de arquitetura.');
      wa.setAttribute('target', '_blank');
      wa.setAttribute('rel', 'noopener');
    }
    document.querySelectorAll('[data-wa]').forEach(function (a) {
      var msg = a.getAttribute('data-wa') || '';
      a.href = waLink(msg);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
    document.querySelectorAll('[data-ig]').forEach(function (a) {
      a.href = igLink();
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
    document.querySelectorAll('[data-email]').forEach(function (a) {
      a.href = 'mailto:' + CONFIG.email;
    });
    var label = document.querySelector('[data-wa-label]');
    if (label) label.textContent = CONFIG.whatsappLabel;

    var top = document.querySelector('.to-top');
    if (top) {
      top.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
  }

  /* ========================================================================
     7. PORTFÓLIO
     ======================================================================== */
  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function loadProjetos() {
    return fetch('tables/projetos?limit=100&sort=ordem', { headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (json) {
        var rows = json && (json.data || json.rows);
        if (Array.isArray(rows) && rows.length) return rows;
        throw new Error('vazio');
      })
      .catch(function () {
        return FALLBACK_PROJETOS.slice();
      });
  }

  function cardMarkup(p, index) {
    var layout = 'card';
    if (index === 0) layout += ' card--wide';
    else if (index % 5 === 3) layout += ' card--tall';

    var delay = 'data-reveal-delay="' + ((index % 3) + 1) + '"';
    var href = 'projeto.html?slug=' + encodeURIComponent(p.slug || p.id);

    return '' +
      '<a class="' + layout + '" href="' + escapeHtml(href) + '" data-cat="' + escapeHtml(p.categoria) + '" data-reveal ' + delay + ' aria-label="Ver projeto ' + escapeHtml(p.titulo) + '">' +
        '<div class="card__media">' +
          '<img src="' + escapeHtml(p.capa) + '" alt="' + escapeHtml(p.titulo) + ' — projeto de arquitetura" loading="lazy" decoding="async">' +
          '<div class="card__overlay"></div>' +
          '<span class="card__cat">' + escapeHtml(p.categoria) + '</span>' +
          '<div class="card__body">' +
            '<h3 class="card__title">' + escapeHtml(p.titulo) + '</h3>' +
            '<div class="card__meta">' +
              '<span>' + escapeHtml(p.local || '') + '</span>' +
              (p.area_m2 ? '<span class="sep">·</span><span>' + escapeHtml(p.area_m2) + ' m²</span>' : '') +
              (p.ano ? '<span class="sep">·</span><span>' + escapeHtml(p.ano) + '</span>' : '') +
            '</div>' +
            '<div class="card__reveal"><p>' + escapeHtml(p.resumo || '') + '</p></div>' +
          '</div>' +
        '</div>' +
      '</a>';
  }

  function renderPortfolio(projetos) {
    var grid = document.querySelector('[data-portfolio]');
    if (!grid) return;

    if (!projetos.length) {
      grid.innerHTML = '<p class="portfolio-empty">Nenhum projeto publicado ainda. Fale com a Thais para conhecer o portfólio completo.</p>';
      return;
    }
    var order = { 'Apartamentos': 1, 'Casas': 2, 'Comerciais': 3, 'Reformas': 4 };
    projetos.sort(function (a, b) {
      var oa = a.ordem != null ? a.ordem : 99;
      var ob = b.ordem != null ? b.ordem : 99;
      return oa - ob;
    });

    grid.innerHTML = projetos.map(cardMarkup).join('');

    /* Contagem de categorias nos filtros */
    var counters = {};
    projetos.forEach(function (p) { counters[p.categoria] = (counters[p.categoria] || 0) + 1; });
    document.querySelectorAll('[data-filter]').forEach(function (btn) {
      var cat = btn.getAttribute('data-filter');
      var badge = btn.querySelector('[data-count-cat]');
      if (!badge) return;
      badge.textContent = cat === 'todos' ? projetos.length : (counters[cat] || 0);
    });

    /* Re-observa os novos cards para animação */
    if ('IntersectionObserver' in window && !reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      grid.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
    } else {
      grid.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); });
    }

    window.TM.projetos = projetos;
  }

  function initFilters() {
    var buttons = document.querySelectorAll('[data-filter]');
    if (!buttons.length) return;

    function apply(cat) {
      var shown = 0;
      document.querySelectorAll('[data-portfolio] .card').forEach(function (card) {
        var match = cat === 'todos' || card.getAttribute('data-cat') === cat;
        card.classList.toggle('is-hidden', !match);
        if (match) {
          shown++;
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = '';
        }
      });
      var label = document.querySelector('[data-filter-result]');
      if (label) label.textContent = shown + (shown === 1 ? ' projeto' : ' projetos');

      /* Layout: primeiro card visível recebe destaque largo */
      var visible = document.querySelectorAll('[data-portfolio] .card:not(.is-hidden)');
      Array.prototype.forEach.call(visible, function (c, i) {
        c.classList.toggle('card--wide', i === 0);
      });
    }

    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(buttons, function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        apply(btn.getAttribute('data-filter'));
      });
    });

    /* Filtro por âncora (?categoria=Casas) — permite links de campanha */
    var params = new URLSearchParams(window.location.search);
    var inicial = params.get('categoria');
    if (inicial) {
      var target = document.querySelector('[data-filter="' + inicial + '"]');
      if (target) { target.click(); return; }
    }
    apply('todos');
  }

  /* ========================================================================
     8. DEPOIMENTOS
     ======================================================================== */
  function stars(n) {
    var out = '';
    for (var i = 0; i < (n || 5); i++) {
      out += '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45L2.6 9.45l6.5-.95L12 2.6z"/></svg>';
    }
    return out;
  }

  function initials(name) {
    return String(name || '')
      .split(' ').filter(Boolean).slice(0, 2)
      .map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
  }

  function renderDepoimentos(list) {
    var wrap = document.querySelector('[data-depoimentos]');
    if (!wrap || !list.length) return;
    wrap.innerHTML = list.map(function (d, i) {
      return '' +
        '<article class="quote" data-reveal data-reveal-delay="' + ((i % 3) + 1) + '">' +
          '<span class="quote__mark" aria-hidden="true">&ldquo;</span>' +
          '<p class="quote__text">' + escapeHtml(d.texto) + '</p>' +
          '<div class="quote__stars" aria-label="' + (d.nota || 5) + ' de 5">' + stars(d.nota || 5) + '</div>' +
          '<div class="quote__who">' +
            '<span class="quote__avatar" aria-hidden="true">' + escapeHtml(initials(d.nome)) + '</span>' +
            '<span><strong>' + escapeHtml(d.nome) + '</strong><span>' + escapeHtml(d.projeto || d.cidade || '') + '</span></span>' +
          '</div>' +
        '</article>';
    }).join('');
  }

  function loadDepoimentos() {
    return fetch('tables/depoimentos?limit=50', { headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (json) {
        var rows = json && (json.data || json.rows);
        if (Array.isArray(rows) && rows.length) return rows;
        throw new Error('vazio');
      })
      .catch(function () { return FALLBACK_DEPOIMENTOS.slice(); });
  }

  /* ========================================================================
     9. FORMULÁRIO DE ORÇAMENTO
     ======================================================================== */
  function initForm() {
    var form = document.querySelector('[data-quote-form]');
    if (!form) return;

    var feedback = form.querySelector('[data-feedback]');
    var fileInput = form.querySelector('input[type="file"]');
    var fileBox = form.querySelector('[data-upload-file]');
    var fileName = form.querySelector('[data-upload-name]');
    var fileMeta = form.querySelector('[data-upload-meta]');
    var removeBtn = form.querySelector('[data-upload-remove]');
    var dropzone = form.querySelector('[data-upload]');
    var submitBtn = form.querySelector('button[type="submit"]');
    var currentFile = null;

    var MAX_MB = 25;
    var OK_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/tiff'];

    function humanSize(bytes) {
      if (!bytes) return '';
      var mb = bytes / 1048576;
      return mb >= 1 ? mb.toFixed(1) + ' MB' : Math.max(1, Math.round(bytes / 1024)) + ' KB';
    }

    function setFile(file) {
      if (!file) return;
      if (file.size > MAX_MB * 1048576) {
        showFeedback('err', 'O arquivo tem ' + humanSize(file.size) + '. O limite é ' + MAX_MB + ' MB — você também pode enviar a planta pelo WhatsApp.');
        return;
      }
      if (file.type && OK_TYPES.indexOf(file.type) === -1) {
        showFeedback('err', 'Formato não aceito. Envie PDF, PNG, JPG ou WEBP.');
        return;
      }
      currentFile = file;
      if (fileName) fileName.textContent = file.name;
      if (fileMeta) fileMeta.textContent = humanSize(file.size) + ' · anexo registrado';
      if (fileBox) fileBox.classList.add('is-visible');
    }

    if (fileInput) {
      fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files[0]) setFile(fileInput.files[0]);
      });
    }
    if (removeBtn) {
      removeBtn.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        currentFile = null;
        if (fileInput) fileInput.value = '';
        if (fileBox) fileBox.classList.remove('is-visible');
      });
    }
    if (dropzone) {
      ['dragenter', 'dragover'].forEach(function (ev) {
        dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add('is-drag'); });
      });
      ['dragleave', 'drop'].forEach(function (ev) {
        dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove('is-drag'); });
      });
      dropzone.addEventListener('drop', function (e) {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
      });
    }

    function showFeedback(kind, msg) {
      if (!feedback) return;
      feedback.className = 'form-feedback form-feedback--' + (kind === 'ok' ? 'ok' : 'err') + ' is-visible';
      feedback.innerHTML = (kind === 'ok'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>') +
        '<span>' + msg + '</span>';
      feedback.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }

    function fieldOf(el) { return el.closest('.field'); }
    function clearErrors() {
      form.querySelectorAll('.field.has-error').forEach(function (f) { f.classList.remove('has-error'); });
    }
    function markError(el, msg) {
      var f = fieldOf(el);
      if (!f) return;
      f.classList.add('has-error');
      var err = f.querySelector('.err');
      if (err && msg) err.textContent = msg;
    }

    function validate() {
      clearErrors();
      var ok = true;
      var first = null;

      var required = form.querySelectorAll('[required]');
      Array.prototype.forEach.call(required, function (el) {
        var val = (el.value || '').trim();
        if (!val) {
          markError(el, 'Campo obrigatório.');
          ok = false; first = first || el;
          return;
        }
        if (el.type === 'tel') {
          var digits = val.replace(/\D/g, '');
          if (digits.length < 10) { markError(el, 'Informe um WhatsApp válido com DDD.'); ok = false; first = first || el; }
        }
        if (el.type === 'email') {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) { markError(el, 'Informe um e-mail válido.'); ok = false; first = first || el; }
        }
      });

      var consent = form.querySelector('[name="consentimento"]');
      if (consent && !consent.checked) {
        markError(consent, 'É necessário autorizar o contato.');
        ok = false; first = first || consent;
      }

      if (!ok && first) {
        showFeedback('err', 'Confira os campos destacados para continuar.');
        first.focus({ preventScroll: false });
      }
      return ok;
    }

    /* Máscara leve de telefone brasileiro */
    var tel = form.querySelector('input[type="tel"]');
    if (tel) {
      tel.addEventListener('input', function () {
        var d = tel.value.replace(/\D/g, '').slice(0, 11);
        var out = d;
        if (d.length > 10) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
        else if (d.length > 6) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
        else if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
        else if (d.length > 0) out = '(' + d;
        tel.value = out;
      });
    }

    function buildMessage(data) {
      return [
        'Olá, Thais! Vim pelo seu site e gostaria de solicitar um orçamento.',
        '',
        'Nome: ' + data.nome,
        'WhatsApp: ' + data.whatsapp,
        data.email ? 'E-mail: ' + data.email : '',
        'Tipo de imóvel: ' + data.tipo_imovel,
        data.area_aprox ? 'Área aproximada: ' + data.area_aprox : '',
        data.pacote_interesse ? 'Pacote de interesse: ' + data.pacote_interesse : '',
        currentFile ? 'Planta anexada no site: ' + currentFile.name + ' (envio o arquivo aqui)' : '',
        '',
        'Sobre o projeto: ' + (data.objetivos || '—')
      ].filter(Boolean).join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      var data = {
        nome: (form.nome.value || '').trim(),
        whatsapp: (form.whatsapp.value || '').trim(),
        email: (form.email.value || '').trim(),
        tipo_imovel: form.tipo_imovel.value,
        area_aprox: (form.area_aprox.value || '').trim(),
        pacote_interesse: form.pacote_interesse ? form.pacote_interesse.value : 'Ainda não sei',
        objetivos: (form.objetivos.value || '').trim(),
        arquivo_nome: currentFile ? currentFile.name : '',
        arquivo_tamanho: currentFile ? humanSize(currentFile.size) : '',
        origem: form.getAttribute('data-origem') || 'Formulário de Orçamento',
        status: 'Novo'
      };

      var original = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Enviando…';
      }

      fetch('tables/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (r) {
          if (!r.ok && r.status !== 201) throw new Error('HTTP ' + r.status);
          return r.json().catch(function () { return {}; });
        })
        .then(function () {
          form.reset();
          currentFile = null;
          if (fileBox) fileBox.classList.remove('is-visible');
          if (fileInput) fileInput.value = '';
          showFeedback('ok', '<strong>Recebido, ' + escapeHtml(data.nome.split(' ')[0]) + '!</strong> Seu pedido de orçamento foi registrado. Estou abrindo o WhatsApp para você enviar a planta e conversarmos — retorno em até 1 dia útil.');
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = original; }
          window.setTimeout(function () {
            window.open(waLink(buildMessage(data)), '_blank', 'noopener');
          }, 1200);
        })
        .catch(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = original; }
          showFeedback('err', 'Não conseguimos registrar pelo site agora. Sem problema: clique abaixo e envie seus dados direto pelo WhatsApp.');
          var fallback = document.querySelector('[data-fallback-wa]');
          if (fallback) {
            fallback.href = waLink(buildMessage(data));
            fallback.style.display = 'inline-flex';
          }
        });
    });
  }

  /* ========================================================================
     10. DIVERSOS
     ======================================================================== */
  function initMisc() {
    var year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();

    /* Reveal inicial para blocos que não são renderizados via JS */
    initReveal();
    initCounters();
  }

  /* ========================================================================
     BOOTSTRAP
     ======================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initHeader();
    initFloating();
    initForm();
    initParallax();

    var grid = document.querySelector('[data-portfolio]');
    if (grid) {
      loadProjetos().then(function (projetos) {
        renderPortfolio(projetos);
        initFilters();
        initReveal();
      });
    } else {
      initFilters();
    }

    var quotes = document.querySelector('[data-depoimentos]');
    if (quotes) {
      loadDepoimentos().then(function (list) {
        renderDepoimentos(list);
        initReveal();
      });
    }

    initMisc();
  });
})();
