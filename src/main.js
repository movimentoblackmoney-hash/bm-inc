import './styles/main.css';
import Lenis from 'lenis';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover)').matches;

/* 1. Scroll suave (Lenis) */
if (!reduceMotion) {
  const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
  const raf = (t) => {
    lenis.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  // âncoras internas usam o scroll do Lenis (respeitando o header)
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -72 });
    history.pushState(null, '', a.getAttribute('href'));
  });
}

/* 1b. Portas de entrada: o CTA escolhido pré-seleciona "Eu quero" no formulário final */
document.addEventListener(
  'click',
  (e) => {
    const a = e.target.closest?.('[data-intent]');
    const select = document.querySelector('#lead-intencao');
    if (!a || !select) return;
    const opt = [...select.options].find((o) => o.textContent.trim() === a.dataset.intent);
    if (opt) select.value = opt.value;
  },
  true
);

/* 2. Header: ganha fundo com blur depois de 24px de scroll + menu mobile */
const header = document.querySelector('[data-header]');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = header.querySelector('[data-nav-toggle]');
  const nav = header.querySelector('[data-nav]');
  const setMenu = (open) => {
    toggle?.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('is-open', open);
  };
  const toggleLabel = toggle?.querySelector('.sr-only');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setMenu(open);
    if (toggleLabel) toggleLabel.textContent = open ? 'Fechar menu' : 'Abrir menu';
  });
  nav?.addEventListener('click', (e) => e.target.closest('a') && setMenu(false));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

  // Brilho que segue o cursor no menu (igual ao do Afreektech): só desktop com mouse
  const glowMq = window.matchMedia('(hover: hover) and (min-width: 1101px)');
  const pill = header.querySelector('[data-nav-pill]');
  const glowItems = [...header.querySelectorAll('.nav-link, [data-nav-cta]')];
  const inner = header.querySelector('.site-header__inner');
  const setGlow = () => header.classList.toggle('has-nav-glow', glowMq.matches);
  setGlow();
  glowMq.addEventListener('change', setGlow);
  inner?.addEventListener('mousemove', (e) => {
    if (!glowMq.matches) return;
    pill?.classList.toggle('is-lit', pill.contains(e.target));
    glowItems.forEach((el) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--px', `${(e.clientX - r.left).toFixed(1)}px`);
      el.style.setProperty('--py', `${(e.clientY - r.top).toFixed(1)}px`);
    });
  });
  inner?.addEventListener('mouseleave', () => {
    pill?.classList.remove('is-lit');
    glowItems.forEach((el) => el.style.setProperty('--px', '-200px'));
  });

  const active = header.dataset.active;
  header.querySelector(`[data-nav-id="${active}"]`)?.setAttribute('aria-current', 'page');
}

/* 3. Botões primários: luz que segue o cursor */
if (canHover) {
  document.addEventListener('pointermove', (e) => {
    const b = e.target.closest?.('.btn--primary');
    if (!b) return;
    const r = b.getBoundingClientRect();
    b.style.setProperty('--px', `${e.clientX - r.left}px`);
    b.style.setProperty('--py', `${e.clientY - r.top}px`);
  });
}

/* 4. Big numbers: contam de 0 ao valor quando entram na tela (uma vez) */
const fmt = (n, dec) => n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const counters = [...document.querySelectorAll('[data-count-to]')];
if (counters.length && !reduceMotion) {
  const DUR = 1800;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const run = (el) => {
    const to = parseFloat(el.dataset.countTo);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const pre = el.dataset.prefix || '';
    const suf = el.dataset.suffix || '';
    const final = el.textContent;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / DUR);
      el.textContent = k >= 1 ? final : pre + fmt(to * easeOut(k), dec) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    el.textContent = pre + fmt(0, dec) + suf;
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        run(e.target);
      }),
    { threshold: 0.4 }
  );
  counters.forEach((el) => io.observe(el));
}

/* 4b. Cases: carrossel automático em loop (pausa só no foco do teclado) */
const casesTrack = document.querySelector('[data-cases-track]');
if (casesTrack && !reduceMotion) {
  [...casesTrack.children].forEach((li) => {
    const clone = li.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelector('a')?.setAttribute('tabindex', '-1');
    casesTrack.appendChild(clone);
  });
  casesTrack.classList.add('is-running');
}

/* 4c. Cards empilhados: o card anterior recua (escala/brilho) quando o próximo o cobre */
const stack = document.querySelector('[data-stack]');
if (stack && !reduceMotion) {
  const cards = [...stack.children];
  let ticking = false;
  const update = () => {
    ticking = false;
    cards.forEach((card, i) => {
      let depth = 0;
      const top = card.getBoundingClientRect().top;
      for (let j = i + 1; j < cards.length; j++) {
        if (cards[j].getBoundingClientRect().top < top + 140) depth += 1;
      }
      card.style.setProperty('--depth', String(Math.min(depth, 3)));
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

/* 5. Home — número ativo destaca o guia correspondente no gráfico radial */
const numbers = document.querySelector('[data-numbers]');
if (numbers) {
  const stats = [...numbers.querySelectorAll('[data-stat]')];
  const setActive = (i) => (numbers.dataset.active = String(i));
  setActive(0);
  stats.forEach((s, i) => s.addEventListener('mouseenter', () => setActive(i)));
  const io = new IntersectionObserver(
    (entries) => {
      const vis = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top - innerHeight * 0.46) - Math.abs(b.boundingClientRect.top - innerHeight * 0.46));
      if (vis.length) setActive(stats.indexOf(vis[0].target));
    },
    { rootMargin: '-38% 0px -46% 0px', threshold: 0 }
  );
  stats.forEach((s) => io.observe(s));
}

/* 6. Hero em vídeo: pausa fora da tela e para quem prefere menos movimento */
const heroVideo = document.querySelector('[data-hero-video]');
if (heroVideo) {
  heroVideo.loop = true;
  // garante o loop mesmo que o navegador ignore o atributo (reinicia ao terminar)
  heroVideo.addEventListener('ended', () => {
    heroVideo.currentTime = 0;
    heroVideo.play().catch(() => {});
  });
  if (reduceMotion) {
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
  } else {
    new IntersectionObserver(([e]) => (e.isIntersecting ? heroVideo.play().catch(() => {}) : heroVideo.pause())).observe(heroVideo);
  }
}

/* 7. Formulários
   - Se VITE_FORM_ENDPOINT estiver definido, envia JSON por POST.
   - Senão, abre o e-mail do usuário com a mensagem pronta (mailto), sem simular envio. */
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT;
const FORM_TO = import.meta.env.VITE_FORM_TO || 'contato@movimentoblackmoney.com.br';
const FORM_LABELS = { diagnostico: 'Diagnóstico estratégico', relatorio: 'Relatório completo', territorial: 'Expansão territorial', estudo: 'Estudo — Sem o Negro, o Brasil não Cresce' };

document.querySelectorAll('form[data-form]').forEach((form) => {
  const status = form.querySelector('.form__status');
  const say = (msg, state = 'ok') => {
    if (!status) return;
    status.dataset.state = state;
    status.textContent = msg;
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // validação inline: erro visível, associado ao campo (aria-describedby) e foco no primeiro inválido
    form.querySelectorAll('.field__error').forEach((n) => n.remove());
    form.querySelectorAll('[aria-invalid]').forEach((n) => n.removeAttribute('aria-invalid'));
    const invalid = [...form.elements].filter((el) => el.willValidate && !el.checkValidity());
    if (invalid.length) {
      invalid.forEach((el, i) => {
        const msg = el.validity.valueMissing ? 'Preencha este campo.' : el.type === 'email' ? 'Informe um e-mail válido, como nome@empresa.com.br.' : 'Confira este campo.';
        const err = document.createElement('p');
        err.className = 'field__error';
        err.id = (el.id || 'campo') + '-erro';
        err.textContent = msg;
        el.setAttribute('aria-invalid', 'true');
        el.setAttribute('aria-describedby', err.id);
        el.insertAdjacentElement('afterend', err);
        el.addEventListener('input', () => { el.removeAttribute('aria-invalid'); err.remove(); }, { once: true });
        if (i === 0) el.focus();
      });
      say('Revise os campos destacados.', 'error');
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    const assunto = FORM_LABELS[form.dataset.form] || 'Contato pelo site';
    if (FORM_ENDPOINT) {
      try {
        const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ formulario: form.dataset.form, ...data }) });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        say('Recebemos sua solicitação. Em breve entraremos em contato.');
      } catch {
        say('Não foi possível enviar agora. Tente novamente em instantes.', 'error');
      }
      return;
    }
    const corpo = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
    location.href = `mailto:${FORM_TO}?subject=${encodeURIComponent(`[Site BM.inc] ${assunto}`)}&body=${encodeURIComponent(corpo)}`;
    say('Abrimos seu e-mail com a mensagem pronta. É só enviar.');
  });
});
