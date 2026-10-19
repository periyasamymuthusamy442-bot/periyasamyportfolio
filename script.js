(function () {
  var root = document.documentElement;
  root.classList.remove('no-js'); root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches; // mouse / trackpad devices
  document.getElementById('yr').textContent = new Date().getFullYear();

  /* =====================================================================
     Animation styles (kept here so this one file adds every effect)
     ===================================================================== */
  var css = [
    /* cards: 3D tilt + moving spotlight */
    '.fx{position:relative;transition:transform .2s ease-out,box-shadow .3s,border-color .2s,background .2s;will-change:transform}',
    '.fx::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(280px circle at var(--mx,50%) var(--my,50%),rgba(240,210,138,.18),transparent 65%)}',
    '.fx.lit::after{opacity:1}',
    '.fx.lit{box-shadow:0 22px 44px rgba(11,58,47,.32)}',
    /* reveal directions */
    '.js .reveal.from-left{transform:translateX(-44px)}',
    '.js .reveal.from-right{transform:translateX(44px)}',
    '.js .reveal.zoom{transform:scale(.92) translateY(18px)}',
    '.js .reveal.from-left.in,.js .reveal.from-right.in,.js .reveal.zoom.in{transform:none}',
    'html,body{overflow-x:clip}',
    '@media (max-width:700px){.js .reveal.from-left{transform:translateX(-22px)}.js .reveal.from-right{transform:translateX(22px)}}',
    /* headings: gold underline draws itself */
    'main section>h2{position:relative}',
    'main section>h2::after{content:"";display:block;height:3px;width:0;margin-top:8px;border-radius:3px;background:linear-gradient(90deg,#c9972f,#f0d28a);transition:width .8s .25s cubic-bezier(.2,.8,.2,1)}',
    'main section>h2.h-in::after{width:64px}',
    /* chips pop in one by one */
    '.chips.pre span{opacity:0;transform:scale(.6)}',
    '.chips.pop span{animation:chipPop .55s cubic-bezier(.34,1.56,.64,1) both;animation-delay:calc(var(--i,0)*55ms)}',
    '@keyframes chipPop{from{opacity:0;transform:scale(.6) translateY(8px)}to{opacity:1;transform:none}}',
    /* click: ripple, ring, sparks */
    '.fx-rip{position:absolute;border-radius:50%;background:rgba(255,255,255,.5);transform:scale(0);pointer-events:none;animation:rip .65s ease-out forwards}',
    '@keyframes rip{to{transform:scale(1);opacity:0}}',
    '.click-ring{position:fixed;left:0;top:0;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;border:2px solid rgba(201,151,47,.85);pointer-events:none;z-index:89;transform:translate(var(--x),var(--y));animation:ring .6s ease-out forwards}',
    '@keyframes ring{to{transform:translate(var(--x),var(--y)) scale(6);opacity:0}}',
    '.spark{position:fixed;left:0;top:0;width:var(--s);height:var(--s);margin:calc(var(--s)/-2) 0 0 calc(var(--s)/-2);border-radius:50%;background:var(--c);pointer-events:none;z-index:90;animation:spark .8s cubic-bezier(.15,.8,.3,1) forwards}',
    '.spark.sq{border-radius:2px;rotate:45deg}',
    '@keyframes spark{from{transform:translate(var(--x),var(--y)) scale(1);opacity:1}to{transform:translate(calc(var(--x) + var(--dx)),calc(var(--y) + var(--dy))) scale(0);opacity:0}}',
    /* magnetic buttons + cursor glow */
    '.mag{transition:transform .25s cubic-bezier(.2,.8,.2,1)}',
    '.cursor-glow{position:fixed;left:0;top:0;width:420px;height:420px;margin:-210px 0 0 -210px;border-radius:50%;background:radial-gradient(circle,rgba(240,210,138,.4),rgba(110,200,170,.14) 45%,transparent 70%);pointer-events:none;z-index:-1;opacity:0;transition:opacity .4s;will-change:transform}',
    '.cursor-glow.on{opacity:1}',
    /* hero */
    '.hero h1 .gold{background:linear-gradient(90deg,#d9ac52 0%,#fff0b8 45%,#d9ac52 90%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;animation:shine 5s linear infinite}',
    '@keyframes shine{to{background-position:-220% 0}}',
    '.hero .gold-btn{animation:ctaGlow 3s ease-in-out infinite}',
    '@keyframes ctaGlow{0%,100%{box-shadow:0 0 0 0 rgba(240,210,138,.55)}60%{box-shadow:0 0 0 14px rgba(240,210,138,0)}}',
    '.hero .ring{animation:floaty 6s ease-in-out infinite}',
    '@keyframes floaty{50%{transform:translateY(-8px)}}',
    /* mobile menu items slide in */
    '.nav nav.open a{animation:navIn .35s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0)*45ms)}',
    '@keyframes navIn{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:none}}',
    '.to-top.show:hover{transform:translateY(-5px)}',
    /* form feedback */
    '.shake{animation:shake .45s}',
    '@keyframes shake{20%{transform:translateX(-7px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}}',
    '.gold-btn.sending{pointer-events:none;opacity:.9}',
    '.gold-btn.sending::before{content:"";display:inline-block;width:14px;height:14px;margin-right:9px;vertical-align:-2px;border:2px solid rgba(27,23,8,.3);border-top-color:#1b1708;border-radius:50%;animation:spin .7s linear infinite}',
    '@keyframes spin{to{transform:rotate(360deg)}}',
    '.gold-btn.sent{background:linear-gradient(135deg,#a8e6c3,#4aae7a);color:#06301c}',
    '.copy.ok{background:rgba(110,200,170,.25);border-color:#6ec8aa;color:#fff}',
    /* internship cards open the certificate viewer */
    '.job2[data-cert]{cursor:pointer}',
    '.view-cert{display:inline-block;margin-top:12px;padding:5px 16px;border:1px solid var(--gold);border-radius:999px;color:var(--gold2);font-size:.9rem;transition:background .2s,letter-spacing .2s}',
    '.job2[data-cert]:hover .view-cert,.job2[data-cert]:focus-visible .view-cert{background:rgba(217,172,82,.2);letter-spacing:.03em}',
    '.job2[data-cert]:focus-visible{outline:2px solid var(--gold2);outline-offset:3px}',
    'body.lb-lock{overflow:hidden}',
    '.lb{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(4,22,17,.8);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;transition:opacity .25s}',
    '.lb[hidden]{display:none}',
    '.lb.open{opacity:1}',
    '.lb-shell{position:relative;display:flex;align-items:center;gap:14px;max-width:min(980px,100%);max-height:100%;transform:scale(.94) translateY(14px);transition:transform .3s cubic-bezier(.2,.8,.2,1)}',
    '.lb.open .lb-shell{transform:none}',
    '.lb-fig{margin:0;position:relative;display:flex;flex-direction:column;align-items:center;gap:12px;min-width:0}',
    '.lb-img{display:block;max-width:100%;max-height:calc(100vh - 150px);border-radius:12px;background:#fff;border:1px solid var(--gold);box-shadow:0 30px 70px rgba(0,0,0,.55);transition:opacity .2s}',
    '.lb.loading .lb-img{opacity:0}',
    '.lb-load{position:absolute;top:40%;width:34px;height:34px;border:3px solid rgba(240,210,138,.3);border-top-color:#f0d28a;border-radius:50%;animation:spin .8s linear infinite;opacity:0;pointer-events:none}',
    '.lb.loading .lb-load{opacity:1}',
    '.lb figcaption{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px 16px;color:var(--ink);text-align:center}',
    '.lb-title{font-size:1.05rem}',
    '.lb-sub,.lb-count{color:var(--mute);font-size:.92rem}',
    '.lb-x,.lb-nav{border:1px solid var(--gold);background:linear-gradient(160deg,var(--dk2),var(--dk));color:var(--gold2);border-radius:50%;cursor:pointer;line-height:1;transition:transform .2s,background .2s}',
    '.lb-x{position:absolute;top:-16px;right:-8px;z-index:2;width:42px;height:42px;font-size:1.6rem}',
    '.lb-nav{flex:none;width:46px;height:46px;font-size:1.8rem}',
    '.lb-x:hover,.lb-nav:hover{transform:scale(1.1)}',
    '.lb-shell,.lb-fig,.lb figcaption{max-width:100%}',
    '@media (max-width:700px){.lb figcaption{flex-direction:column;gap:4px}.lb-sub{overflow-wrap:anywhere}.lb-x{top:-14px;right:6px}}',
    '@media (max-width:700px){.lb{padding:12px}.lb-nav{position:absolute;top:calc(50% - 70px);z-index:2;width:40px;height:40px;background:rgba(11,58,47,.82)}.lb-prev{left:-4px}.lb-next{right:-4px}.lb-img{max-height:calc(100vh - 190px)}}',
    '@media (prefers-reduced-motion:reduce){.lb,.lb-shell{transition:none}}',
    '@media (prefers-reduced-motion:reduce){.hero h1 .gold,.hero .gold-btn,.hero .ring,.nav nav.open a{animation:none}.chips.pre span{opacity:1;transform:none}.fx,.mag{transition:none}.cursor-glow{display:none}}'
  ].join('\n');
  var styleTag = document.createElement('style');
  styleTag.id = 'fx-styles';
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* ---- Sticky header, progress bar, back-to-top ---- */
  var bar = document.getElementById('bar'), prog = document.getElementById('progress'), top = document.getElementById('toTop');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.classList.toggle('scrolled', y > 10);
    prog.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    top.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---- Mobile menu ---- */
  var btn = document.getElementById('menuBtn'), menu = document.getElementById('menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  btn.addEventListener('click', function (e) { e.stopPropagation(); setMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('click', function (e) { if (!bar.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); btn.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 980) setMenu(false); });

  /* ---- Highlight current section in the menu ---- */
  var links = menu.querySelectorAll('a'), map = {};
  links.forEach(function (a, i) { a.style.setProperty('--i', i); map[a.getAttribute('href').slice(1)] = a; });
  var spy = new IntersectionObserver(function (list) {
    list.forEach(function (en) {
      if (en.isIntersecting && map[en.target.id]) {
        links.forEach(function (a) { a.classList.remove('on'); });
        map[en.target.id].classList.add('on');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach(function (s) { spy.observe(s); });

  /* ---- Reveal on scroll (slides in from left / right / zoom) ---- */
  var items = document.querySelectorAll('main section > h2, main section .panel, main section .tile, main .hero');
  if ('IntersectionObserver' in window && !reduce) {
    var rev = new IntersectionObserver(function (list) {
      list.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        if (el.tagName === 'H2') el.classList.add('h-in');
        rev.unobserve(el);
        // once the entrance has finished, hand the element back so hover/tilt effects can use transform
        setTimeout(function () {
          el.classList.remove('reveal', 'in', 'from-left', 'from-right', 'zoom');
          el.style.transitionDelay = '';
        }, 1300);
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) {
      el.classList.add('reveal');
      var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
      var inGrid = el.parentNode.classList.contains('grid2');
      if (el.tagName === 'H2') el.classList.add('from-left');
      else if (inGrid) el.classList.add(sib % 2 === 0 ? 'from-left' : 'from-right');
      else if (el.classList.contains('tile') || el.classList.contains('job2') || el.classList.contains('hero')) el.classList.add('zoom');
      el.style.transitionDelay = Math.min(sib, 4) * 80 + 'ms';
      rev.observe(el);
    });
  }

  /* ---- Chips pop in one by one ---- */
  if ('IntersectionObserver' in window && !reduce) {
    var cio = new IntersectionObserver(function (list) {
      list.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.remove('pre'); en.target.classList.add('pop');
        cio.unobserve(en.target);
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.chips').forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); });
      g.classList.add('pre'); cio.observe(g);
    });
  }

  /* ---- Click effects: ring everywhere, ripple on buttons, sparks on key items ---- */
  var RIPPLE_SEL = '.gold-btn, .live, .copy, .menu-btn, .to-top, .nav nav a';
  var BURST_SEL = '.gold-btn, .live, .link, .copy, .tile, .chips span, .badge, .yr-tag, .edu-tag, .mark';
  var COLORS = ['#f0d28a', '#c9972f', '#ffe9a8', '#6ec8aa', '#ffffff'];
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function clickPoint(e, el) {
    if (e.detail === 0) { // keyboard "click": use the element's centre
      var r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    return { x: e.clientX, y: e.clientY };
  }
  function ring(x, y) {
    var r = document.createElement('i');
    r.className = 'click-ring';
    r.style.setProperty('--x', x + 'px'); r.style.setProperty('--y', y + 'px');
    document.body.appendChild(r);
    r.addEventListener('animationend', function () { this.remove(); });
  }
  function burst(x, y, n) {
    if (reduce) return;
    for (var i = 0; i < n; i++) {
      var s = document.createElement('i'), a = Math.random() * Math.PI * 2, d = rnd(36, 96);
      s.className = 'spark' + (i % 3 === 0 ? ' sq' : '');
      s.style.setProperty('--x', x + 'px'); s.style.setProperty('--y', y + 'px');
      s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d + 'px');
      s.style.setProperty('--s', rnd(5, 10) + 'px');
      s.style.setProperty('--c', COLORS[(Math.random() * COLORS.length) | 0]);
      document.body.appendChild(s);
      s.addEventListener('animationend', function () { this.remove(); });
    }
  }
  function ripple(el, pt) {
    var cs = getComputedStyle(el);
    if (cs.position === 'static') el.style.position = 'relative';
    if (cs.display === 'inline') el.style.display = 'inline-block';
    el.style.overflow = 'hidden';
    var r = el.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2, s = document.createElement('span');
    s.className = 'fx-rip';
    s.style.width = s.style.height = d + 'px';
    s.style.left = (pt.x - r.left - d / 2) + 'px';
    s.style.top = (pt.y - r.top - d / 2) + 'px';
    el.appendChild(s);
    s.addEventListener('animationend', function () { this.remove(); });
  }
  if (!reduce) {
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t.closest || t.closest('input, textarea, select, label')) return;
      var pt = clickPoint(e, t);
      ring(pt.x, pt.y);
      var rip = t.closest(RIPPLE_SEL);
      if (rip) ripple(rip, clickPoint(e, rip));
      if (t.closest(BURST_SEL)) burst(pt.x, pt.y, 14);
    });
  }

  /* ---- Card tilt + spotlight, magnetic buttons, cursor glow (mouse devices only) ---- */
  if (fine && !reduce) {
    document.querySelectorAll('.proj, .job2, .edu, .tile').forEach(function (el) {
      el.classList.add('fx');
      el.addEventListener('mousemove', function (e) {
        if (el.classList.contains('reveal')) return;
        var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        var k = el.offsetWidth > 420 ? 3 : 6; // wide cards tilt a little less
        el.style.setProperty('--mx', (px * 100) + '%'); el.style.setProperty('--my', (py * 100) + '%');
        el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * k * 2) + 'deg) rotateY(' + ((px - 0.5) * k * 2) + 'deg) translateY(-4px)';
        el.classList.add('lit');
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; el.classList.remove('lit'); });
    });

    document.querySelectorAll('.gold-btn, .live').forEach(function (b) {
      b.classList.add('mag');
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + (e.clientX - (r.left + r.width / 2)) * 0.28 + 'px,' + (e.clientY - (r.top + r.height / 2)) * 0.4 + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });

    var glow = document.createElement('div'); glow.className = 'cursor-glow'; document.body.appendChild(glow);
    var gx = window.innerWidth / 2, gy = window.innerHeight / 2, tx = gx, ty = gy, raf = 0;
    var follow = function () {
      gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
      glow.style.transform = 'translate(' + gx + 'px,' + gy + 'px)';
      raf = (Math.abs(tx - gx) > 0.5 || Math.abs(ty - gy) > 0.5) ? requestAnimationFrame(follow) : 0;
    };
    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY; glow.classList.add('on');
      if (!raf) raf = requestAnimationFrame(follow);
    }, { passive: true });
    document.addEventListener('mouseleave', function () { glow.classList.remove('on'); });
  }

  /* ---- Certificate viewer: click an internship to see its certificate ---- */
  var certCards = Array.prototype.slice.call(document.querySelectorAll('[data-cert]'));
  if (certCards.length) {
    var box = document.createElement('div');
    box.className = 'lb'; box.hidden = true;
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Internship certificate');
    box.innerHTML =
      '<div class="lb-shell">' +
        '<button class="lb-x" type="button" aria-label="Close">&times;</button>' +
        '<button class="lb-nav lb-prev" type="button" aria-label="Previous certificate">&#8249;</button>' +
        '<figure class="lb-fig"><div class="lb-load"></div><img class="lb-img" alt="">' +
          '<figcaption><b class="lb-title"></b><span class="lb-sub"></span><span class="lb-count"></span>' +
          '<a class="lb-open gold-btn small" target="_blank" rel="noopener"></a></figcaption></figure>' +
        '<button class="lb-nav lb-next" type="button" aria-label="Next certificate">&#8250;</button>' +
      '</div>';
    document.body.appendChild(box);

    var lbImg = box.querySelector('.lb-img'), lbTitle = box.querySelector('.lb-title'), lbSub = box.querySelector('.lb-sub'),
        lbCount = box.querySelector('.lb-count'), lbOpen = box.querySelector('.lb-open'), lbClose = box.querySelector('.lb-x');
    var lbIdx = 0, lbFrom = null, lbTimer = 0;

    function show(i) {
      lbIdx = (i + certCards.length) % certCards.length;
      var c = certCards[lbIdx], src = c.getAttribute('data-cert'), file = c.getAttribute('data-file') || src;
      box.classList.add('loading');
      lbImg.onload = function () { box.classList.remove('loading'); };
      lbImg.onerror = function () { box.classList.remove('loading'); };
      lbImg.src = src;
      lbImg.alt = 'Certificate: ' + c.getAttribute('data-title');
      lbTitle.textContent = c.getAttribute('data-title');
      lbSub.textContent = c.querySelector('.sub').textContent;
      lbCount.textContent = (lbIdx + 1) + ' / ' + certCards.length;
      lbOpen.href = file;
      lbOpen.textContent = /\.pdf$/i.test(file) ? 'Download PDF' : 'Open full size';
      new Image().src = certCards[(lbIdx + 1) % certCards.length].getAttribute('data-cert'); // preload next
    }
    function openViewer(i, from) {
      clearTimeout(lbTimer);
      lbFrom = from || document.activeElement;
      show(i);
      box.hidden = false;
      document.body.classList.add('lb-lock');
      requestAnimationFrame(function () { box.classList.add('open'); lbClose.focus(); });
    }
    function closeViewer() {
      if (box.hidden) return;
      box.classList.remove('open');
      document.body.classList.remove('lb-lock');
      lbTimer = setTimeout(function () { box.hidden = true; }, 260);
      if (lbFrom && lbFrom.focus) lbFrom.focus();
    }

    certCards.forEach(function (c, i) {
      c.addEventListener('click', function () { openViewer(i, c); });
      c.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openViewer(i, c); }
      });
    });
    lbClose.addEventListener('click', closeViewer);
    box.querySelector('.lb-prev').addEventListener('click', function () { show(lbIdx - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(lbIdx + 1); });
    box.addEventListener('click', function (e) { if (e.target === box || e.target.classList.contains('lb-shell')) closeViewer(); });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') closeViewer();
      else if (e.key === 'ArrowLeft') show(lbIdx - 1);
      else if (e.key === 'ArrowRight') show(lbIdx + 1);
      else if (e.key === 'Tab') { // keep keyboard focus inside the viewer
        var f = box.querySelectorAll('button, a[href]');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    var sx = 0; // swipe left / right on touch screens
    box.addEventListener('touchstart', function (e) { sx = e.changedTouches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 55) show(lbIdx + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ---- Resume viewer: read first, download from inside the viewer ---- */
  var rvBtns = document.querySelectorAll('.resume-open');
  if (rvBtns.length) {
    var rv = document.createElement('div');
    rv.className = 'rv'; rv.hidden = true;
    rv.setAttribute('role', 'dialog'); rv.setAttribute('aria-modal', 'true'); rv.setAttribute('aria-label', 'Resume');
    rv.innerHTML =
      '<div class="rv-card">' +
        '<div class="rv-head"><b>Resume \u2013 Periyasamy M</b><button class="rv-x" type="button" aria-label="Close">&times;</button></div>' +
        '<div class="rv-body"><img src="resume.jpg" alt="Resume of Periyasamy M" width="1075" height="1521"></div>' +
        '<div class="rv-foot"><span>Like what you see? Save a copy.</span>' +
        '<a class="gold-btn" href="resume.pdf" download="Periyasamy_M_Resume.pdf">Download Resume (PDF)</a></div>' +
      '</div>';
    document.body.appendChild(rv);
    var rvClose = rv.querySelector('.rv-x'), rvFrom = null, rvTimer;
    function openRv(from) {
      clearTimeout(rvTimer); rvFrom = from;
      rv.hidden = false; document.body.classList.add('lb-lock');
      requestAnimationFrame(function () { rv.classList.add('open'); rvClose.focus(); });
    }
    function closeRv() {
      if (rv.hidden) return;
      rv.classList.remove('open'); document.body.classList.remove('lb-lock');
      rvTimer = setTimeout(function () { rv.hidden = true; }, 260);
      if (rvFrom && rvFrom.focus) rvFrom.focus();
    }
    rvBtns.forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openRv(b); }); });
    rvClose.addEventListener('click', closeRv);
    rv.addEventListener('click', function (e) { if (e.target === rv) closeRv(); });
    document.addEventListener('keydown', function (e) {
      if (rv.hidden) return;
      if (e.key === 'Escape') closeRv();
      else if (e.key === 'Tab') {
        var f = rv.querySelectorAll('button, a[href]'), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---- Toast + copy buttons ---- */
  var toast = document.getElementById('toast'), tt;
  function say(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }
  document.querySelectorAll('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      function done() {
        say('Copied: ' + text);
        var old = b.getAttribute('data-label') || b.textContent;
        b.setAttribute('data-label', old);
        b.textContent = 'Copied \u2713'; b.classList.add('ok');
        setTimeout(function () { b.textContent = old; b.classList.remove('ok'); }, 1500);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { say('Press and hold to copy: ' + text); });
      } else {
        var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (err) { say(text); }
        document.body.removeChild(ta);
      }
    });
  });

  /* ---- Contact form: saves every message as a row in your Google Sheet ---- */
  // Paste your Google Apps Script Web app URL below (it ends with /exec)
  var FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwT99q-jZAZxSwldP0G8ppOoMFdvicFJqZ6pkGSQceRmxVbr8Lih0S0MVfJMRbDiSnRmQ/exec';
  var MY_EMAIL = 'periyasamymcse@gmail.com';

  var form = document.getElementById('form'), note = document.getElementById('note');
  var sendBtn = form.querySelector('button[type="submit"]');
  form.addEventListener('input', function (e) { e.target.classList.remove('bad'); });
  ['name', 'email', 'msg'].forEach(function (n) {
    form[n].addEventListener('animationend', function () { this.classList.remove('shake'); });
  });
  function resetBtn() {
    sendBtn.disabled = false; sendBtn.classList.remove('sending', 'sent'); sendBtn.textContent = 'Send message';
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = null;
    ['name', 'email', 'msg'].forEach(function (n) {
      var f = form[n], ok = f.value.trim() && (n !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value.trim()));
      f.classList.toggle('bad', !ok);
      if (!ok) { f.classList.remove('shake'); void f.offsetWidth; if (!reduce) f.classList.add('shake'); }
      if (!ok && !bad) bad = f;
    });
    if (bad) { note.textContent = 'Please fill in every field with a valid email.'; bad.focus(); return; }

    // Web app URL not pasted yet: fall back to the visitor's email app
    if (FORM_ENDPOINT.indexOf('PASTE_YOUR') !== -1) {
      var body = form.msg.value + '\n\nFrom: ' + form.name.value + ' (' + form.email.value + ')';
      location.href = 'mailto:' + MY_EMAIL + '?subject=' + encodeURIComponent('Portfolio message from ' + form.name.value) + '&body=' + encodeURIComponent(body);
      note.textContent = 'Opening your email app to send the message.';
      return;
    }

    var data = new URLSearchParams(new FormData(form));
    sendBtn.disabled = true; sendBtn.classList.add('sending'); sendBtn.textContent = 'Sending...'; note.textContent = '';
    // Google Apps Script does not allow reading the reply from another site, so no-cors is used:
    // the request is sent, and only a network failure counts as an error.
    fetch(FORM_ENDPOINT, { method: 'POST', mode: 'no-cors', body: data })
      .then(function () {
        form.reset();
        note.textContent = 'Thank you! Your message was sent. I will reply soon.';
        say('Message sent');
        sendBtn.classList.remove('sending'); sendBtn.classList.add('sent'); sendBtn.textContent = '\u2713 Sent';
        var r = sendBtn.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, 28);
        setTimeout(resetBtn, 2600);
      })
      .catch(function () {
        note.textContent = 'Could not send right now. Please email me at ' + MY_EMAIL + '.';
        resetBtn();
      });
  });
})();