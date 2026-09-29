/* Curvas Estética — cenas por scroll (GSAP + ScrollTrigger + Lenis + SplitType) */
(() => {
  const doc = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const cenas = $$('.cena');
  let pos = [];
  let irY = (y) => window.scrollTo({ top: y });
  let parar = () => {};
  let andar = () => {};

  /* Fotos ainda não enviadas viram um espaço reservado com legenda */
  $$('.frame img').forEach((img) => {
    const f = img.closest('.frame');
    img.addEventListener('error', () => f.classList.add('vazio'));
    img.addEventListener('load', () => f.classList.remove('vazio'));
    if (img.complete && img.naturalWidth === 0) f.classList.add('vazio');
  });

  menu();

  if (!doc.classList.contains('motion') || !(window.gsap && window.ScrollTrigger && window.Lenis)) {
    doc.classList.remove('motion');
    doc.classList.add('calmo');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  const lenis = new Lenis({ lerp: 0.07, wheelMultiplier: 0.85 });
  lenis.stop();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  irY = (y) => lenis.scrollTo(y, { duration: 2, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) });
  parar = () => lenis.stop();
  andar = () => lenis.start();
  window.__irY = irY;

  const desenhavel = (el) => {
    const L = el.getTotalLength();
    gsap.set(el, { strokeDasharray: L, strokeDashoffset: L });
    return L;
  };

  /* ---------- Preloader: a linha do C acompanha o carregamento ---------- */
  const traco = $('.pre-traco');
  const L = desenhavel(traco);
  const num = $('.pre-num span');
  const est = { p: 0 };
  const pinta = () => {
    traco.style.strokeDashoffset = L * (1 - est.p);
    num.textContent = Math.round(est.p * 100);
  };
  const limite = (p) => Promise.race([p, new Promise((ok) => setTimeout(ok, 7000))]);
  const foto = (img) => new Promise((ok) => {
    if (!img || img.complete) return ok();
    img.addEventListener('load', ok, { once: true });
    img.addEventListener('error', ok, { once: true });
  });
  const fontes = document.fonts ? document.fonts.ready : Promise.resolve();
  const tarefas = [
    fontes,
    foto($('.hero-foto img')),
    new Promise((ok) => (document.readyState === 'complete' ? ok() : addEventListener('load', ok, { once: true }))),
  ].map(limite);
  let prontas = 0;
  let tw = gsap.to(est, { p: 0.1, duration: 0.8, onUpdate: pinta });
  tarefas.forEach((t) => t.then(() => {
    prontas++;
    tw.kill();
    tw = gsap.to(est, { p: prontas / tarefas.length, duration: 1, ease: 'sine.out', onUpdate: pinta });
  }));

  fontes.then(() => {
    if (window.SplitType) {
      $$('[data-split]').forEach((el) => new SplitType(el, { types: 'lines,words' }));
      $$('[data-chars]').forEach((el) => new SplitType(el, { types: 'chars' }));
    }
    cenasScroll();
  });

  Promise.all(tarefas).then(() => gsap.delayedCall(0.9, abrir));

  function abrir() {
    ScrollTrigger.refresh();
    gsap.timeline({ onComplete: () => { $('.pre').remove(); andar(); } })
      .to(est, { p: 1, duration: 0.3, onUpdate: pinta })
      .to('.pre-num', { opacity: 0, duration: 0.3 })
      // a câmera atravessa o miolo do C
      .to('.pre-c', { scale: 16, duration: 1.3, ease: 'power3.in', transformOrigin: '47% 52%' }, '-=0.1')
      .to('.pre', { opacity: 0, duration: 0.45 }, '-=0.45')
      .from('.hero-nome .char', { yPercent: 70, opacity: 0, rotation: 6, stagger: 0.05, duration: 1.1, ease: 'expo.out' }, '-=0.35')
      .from('.hero-sub', { opacity: 0, y: 12, duration: 0.8 }, '-=0.8')
      .from('.hero-linha .word', { opacity: 0, stagger: 0.04, duration: 0.6 }, '-=0.6')
      .to(['.topo', '.prog', '.zap'], { opacity: 1, duration: 0.6 }, '-=0.6');
  }

  /* ---------- Cenas ---------- */
  function cenasScroll() {
    gsap.matchMedia().add({ desk: '(min-width: 769px)', mob: '(max-width: 768px)' }, (ctx) => {
      const { desk } = ctx.conditions;
      abertura();
      jozzy();
      procedimentos(desk);
      frase();
      espaco(desk);
      comoFunciona();
    });
    progresso();
  }

  const pin = (alvo, fim) => ({ trigger: alvo, start: 'top top', end: fim, scrub: 1.2, pin: true, invalidateOnRefresh: true });

  // 1 · Uma bolha orgânica recorta a foto e cresce até ocupar a tela.
  // Saída: uma onda cor de leite sobe e cobre tudo.
  function abertura() {
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: pin('#abertura', '+=260%') })
      .fromTo('.bolha-forma', { scale: 0.6, rotation: -10, svgOrigin: '0.5 0.5' },
        { scale: 1.95, rotation: 8, svgOrigin: '0.5 0.5', duration: 1.4, ease: 'sine.inOut' }, 0)
      .fromTo('.hero-foto img', { scale: 1.12 }, { scale: 1, duration: 1.4 }, 0)
      .to('.hero-linha', { opacity: 0, duration: 0.3 }, 0.8)
      .to('.hero-nome .char', { yPercent: -18, stagger: { each: 0.02, from: 'center' }, duration: 0.6 }, 0.9)
      .fromTo('.onda', { y: 0 }, { y: () => -$('.onda').offsetHeight, duration: 1, ease: 'sine.inOut' }, 1.5);
  }

  // 2 · Foto da Jozzy sobe dentro de um arco, o contorno se desenha e a fala aparece.
  // Saída: o fundo muda de leite para ameixa.
  function jozzy() {
    const contorno = $('.arco-linha path');
    desenhavel(contorno);
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: pin('#jozzy', '+=260%') })
      .fromTo('.arco-foto', { clipPath: 'inset(100% 0% 0% 0% round 50% 50% 0% 0% / 34% 34% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0% round 50% 50% 0% 0% / 34% 34% 0% 0%)', duration: 1, ease: 'power2.out' }, 0)
      .fromTo('.arco-foto img', { scale: 1.25 }, { scale: 1, duration: 1.4 }, 0)
      .to(contorno, { strokeDashoffset: 0, duration: 1.3, ease: 'sine.inOut' }, 0.1)
      .from('.jozzy-tit .word', { yPercent: 110, stagger: 0.08, duration: 0.5 }, 0.3)
      .to('.jozzy-nome', { opacity: 1, duration: 0.3 }, 0.8)
      .to('.jozzy-fala', { clipPath: 'inset(0 0 0% 0)', duration: 0.1 }, 1)
      .from('.jozzy-fala .word', { opacity: 0.1, stagger: 0.025, duration: 0.2 }, 1)
      .to('.jozzy-extra', { opacity: 1, duration: 0.3 }, 1.8)
      .to({}, { duration: 0.4 })
      .to('.escurece', { opacity: 1, duration: 0.6 });
  }

  // 3 · Um procedimento por vez; o fio curvo percorre a cena inteira.
  // Saída: um horizonte lilás se abre a partir do meio.
  function procedimentos(desk) {
    const fio = $('.proc-fio path');
    desenhavel(fio);
    const itens = $$('.proc');
    const passo = 1.7;
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: pin('#procedimentos', `+=${itens.length * 110 + 80}%`) });
    tl.from('.proc-tit', { opacity: 0, duration: 0.3 }, 0)
      .to(fio, { strokeDashoffset: 0, duration: itens.length * passo }, 0);
    itens.forEach((it, i) => {
      const t = i * passo + 0.1;
      const fotoEl = $('.proc-foto', it);
      const palavras = $$('.proc-nome .word', it);
      const meta = [$('.proc-n', it), $('.proc-dados', it)];
      tl.fromTo(fotoEl, { clipPath: 'ellipse(0% 0% at 50% 50%)' }, { clipPath: 'ellipse(50% 50% at 50% 50%)', duration: 0.8, ease: 'power2.out' }, t)
        .fromTo($('img', fotoEl), { scale: 1.3 }, { scale: 1, duration: 1.2 }, t)
        .fromTo(palavras, { yPercent: 110, opacity: 1 }, { yPercent: 0, opacity: 1, stagger: 0.07, duration: 0.5, ease: 'power2.out' }, t + 0.25)
        .fromTo(meta, { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 }, t + 0.45);
      if (i < itens.length - 1) {
        tl.to(fotoEl, { opacity: 0, y: desk ? -50 : -30, duration: 0.45, ease: 'power1.in' }, t + 1.25)
          .to(palavras, { yPercent: -110, opacity: 0, stagger: 0.04, duration: 0.4, ease: 'power1.in' }, t + 1.25)
          .to(meta, { opacity: 0, duration: 0.3 }, t + 1.25);
      }
    });
    tl.to({}, { duration: 0.3 })
      .fromTo('.horizonte', { clipPath: 'inset(50% 0% 50% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power2.inOut' });
  }

  // 4 · Momento principal: curvas atravessam a tela devagar e a frase acende palavra por palavra.
  // Saída: a frase desliza para o lado, puxando o scroll horizontal do espaço.
  function frase() {
    const svg = $('.curvas-fundo');
    const linhas = $$('.curvas-fundo path');
    linhas.forEach(desenhavel);
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: pin('#frase', '+=300%') })
      .to(linhas, { strokeDashoffset: 0, stagger: 0.35, duration: 2.2, ease: 'sine.inOut' }, 0)
      .fromTo(svg, { x: 0 }, { x: () => -(svg.getBoundingClientRect().width - innerWidth), duration: 3.4 }, 0)
      .fromTo('.frase-txt .word', { opacity: 0.12 }, { opacity: 1, stagger: 0.14, duration: 0.3 }, 0.4)
      .to('.frase', { xPercent: -110, duration: 0.9, ease: 'power2.in' }, 2.5);
  }

  // 5 · O espaço: horizontal no computador, empilhado no celular. Fotos abrem em formas curvas.
  function espaco(desk) {
    const trilho = $('.trilho');
    const molduras = $$('.sala .frame');
    if (desk) {
      const dist = () => trilho.scrollWidth - innerWidth;
      const anda = gsap.to(trilho, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: '#espaco', start: 'top top', end: () => `+=${dist()}`, scrub: 1, pin: true, invalidateOnRefresh: true },
      });
      molduras.forEach((m) => {
        gsap.fromTo(m, { clipPath: 'ellipse(0% 0% at 50% 50%)' }, {
          clipPath: 'ellipse(72% 72% at 50% 50%)', ease: 'none',
          scrollTrigger: { trigger: m, containerAnimation: anda, start: 'left 95%', end: 'left 45%', scrub: true },
        });
      });
      gsap.from('.espaco-tit, .espaco-abre p', {
        x: 80, opacity: 0, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: '#espaco', start: 'top 90%', end: 'top 20%', scrub: 1 },
      });
    } else {
      molduras.forEach((m) => {
        gsap.fromTo(m, { clipPath: 'ellipse(30% 20% at 50% 50%)' }, {
          clipPath: 'ellipse(72% 72% at 50% 50%)', ease: 'none',
          scrollTrigger: { trigger: m, start: 'top 95%', end: 'top 35%', scrub: 1 },
        });
      });
    }
  }

  // 6 · Uma pincelada larga pinta a tela; depois o fio liga avaliação → plano → sessões.
  // Saída: a seção de agendamento sobe por cima desta.
  function comoFunciona() {
    const pincel = $('.pincel path');
    const fio = $('.passos-fio path');
    desenhavel(pincel);
    desenhavel(fio);
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: pin('#como-funciona', '+=300%') });
    tl.to(pincel, { strokeDashoffset: 0, duration: 1, ease: 'power1.inOut' }, 0)
      .from('.como-tit .word', { yPercent: 110, stagger: 0.1, duration: 0.4 }, 0.85)
      .to(fio, { strokeDashoffset: 0, duration: 1.4 }, 1.1);
    $$('.passo').forEach((p, i) => {
      const t = 1.15 + i * 0.5;
      tl.to($('.passo-n', p), { scale: 1, duration: 0.25, ease: 'back.out(2)' }, t)
        .to([$('h3', p), $('p', p)], { opacity: 1, stagger: 0.08, duration: 0.3 }, t + 0.1);
    });
    tl.to({}, { duration: 1.7 });
  }

  /* ---------- Progresso em linha curva ---------- */
  function inicio(sec) {
    const el = sec.parentElement.classList.contains('pin-spacer') ? sec.parentElement : sec;
    return el.getBoundingClientRect().top + window.scrollY;
  }

  function progresso() {
    const nav = $('.prog');
    const svg = $('.prog-svg');
    const base = $('.prog-base');
    const cheio = $('.prog-cheio');
    const pontos = $$('.prog-pontos li');
    let comp = 1;
    let fracao = [];

    const tracar = () => {
      const w = nav.offsetWidth;
      const h = nav.offsetHeight;
      const deitado = w > h;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      const pts = [];
      for (let k = 0; k <= 80; k++) {
        const t = k / 80;
        pts.push(deitado
          ? [t * w, h / 2 + (h / 2 - 2) * Math.sin(t * Math.PI * 8)]
          : [w / 2 + (w / 2 - 4) * Math.sin(t * Math.PI * 5), t * h]);
      }
      const d = `M${pts.map((p) => p.map((n) => n.toFixed(1)).join(' ')).join(' L')}`;
      base.setAttribute('d', d);
      cheio.setAttribute('d', d);
      comp = cheio.getTotalLength();
      cheio.style.strokeDasharray = comp;
      const max = ScrollTrigger.maxScroll(window) || 1;
      pos = cenas.map(inicio);
      fracao = pos.map((p) => Math.min(p / max, 1));
      pontos.forEach((li, i) => {
        const pt = cheio.getPointAtLength(comp * fracao[i]);
        li.style.left = `${pt.x}px`;
        li.style.top = `${pt.y}px`;
      });
    };
    ScrollTrigger.addEventListener('refresh', tracar);
    tracar();

    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        cheio.style.strokeDashoffset = comp * (1 - self.progress);
        const y = window.scrollY + innerHeight * 0.45;
        let atual = 0;
        pos.forEach((p, i) => { if (y >= p) atual = i; });
        marcar(atual);
      },
    });
  }

  /* ---------- Menu ---------- */
  function marcar(i) {
    $$('.prog-pontos li').forEach((li, j) => li.classList.toggle('atual', j === i));
    $$('.mapa-lista li').forEach((li, j) => {
      $('.aqui', li).hidden = j !== i;
      $('a', li).toggleAttribute('aria-current', j === i);
    });
  }

  function ir(i) {
    irY(pos[i] ?? inicio(cenas[i]));
  }

  function menu() {
    const lista = $('.mapa-lista');
    const pontos = $('.prog-pontos');
    cenas.forEach((sec, i) => {
      const nome = sec.dataset.nome;
      lista.insertAdjacentHTML('beforeend',
        `<li><a href="#${sec.id}"><span class="mapa-n">${i + 1}</span><span class="mapa-nome">${nome}</span><span class="aqui"${i ? ' hidden' : ''}>você está aqui</span></a></li>`);
      pontos.insertAdjacentHTML('beforeend',
        `<li${i ? '' : ' class="atual"'}><button type="button" aria-label="Ir para ${nome}"><span class="rotulo">${nome}</span></button></li>`);
    });

    const mapa = $('#mapa');
    const btn = $('.menu-btn');
    const animado = () => doc.classList.contains('motion');
    const abrirMapa = () => {
      mapa.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      parar();
      if (window.gsap && animado()) {
        gsap.fromTo('.mapa-lista li', { opacity: 0, x: -16 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out' });
      }
      $('.mapa-fechar').focus();
    };
    const fecharMapa = (foco = true) => {
      mapa.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      andar();
      if (foco) btn.focus();
    };
    btn.addEventListener('click', abrirMapa);
    $('.mapa-fechar').addEventListener('click', () => fecharMapa());
    mapa.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') fecharMapa();
      if (e.key !== 'Tab') return;
      const f = $$('button, a', mapa);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    $$('.mapa-lista a').forEach((a, i) => a.addEventListener('click', (e) => {
      fecharMapa(false);
      if (!animado()) return;
      e.preventDefault();
      ir(i);
    }));
    $$('.prog-pontos button').forEach((b, i) => b.addEventListener('click', () => ir(i)));
    $('.marca').addEventListener('click', (e) => {
      if (!animado()) return;
      e.preventDefault();
      ir(0);
    });
  }
})();
