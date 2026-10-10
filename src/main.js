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
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav?.addEventListener('click', (e) => e.target.closest('a') && setMenu(false));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

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

/* 5. Logos: loop infinito (duplica a lista; pausa no hover) */
const marquee = document.querySelector('[data-marquee]');
if (marquee && !reduceMotion) {
  [...marquee.children].forEach((li) => {
    const clone = li.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelector('img')?.setAttribute('alt', '');
    marquee.appendChild(clone);
  });
  marquee.classList.add('is-looping');
}

/* 6. Home — número ativo destaca o guia correspondente no gráfico radial */
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

/* 7. Hero em vídeo: pausa fora da tela e para quem prefere menos movimento */
const heroVideo = document.querySelector('[data-hero-video]');
if (heroVideo) {
  if (reduceMotion) {
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
  } else {
    new IntersectionObserver(([e]) => (e.isIntersecting ? heroVideo.play().catch(() => {}) : heroVideo.pause())).observe(heroVideo);
  }
}

/* 8. Formulários
   - Se VITE_FORM_ENDPOINT estiver definido, envia JSON por POST.
   - Senão, abre o e-mail do usuário com a mensagem pronta (mailto), sem simular envio. */
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT;
const FORM_TO = import.meta.env.VITE_FORM_TO || 'contato@movimentoblackmoney.com.br';
const FORM_LABELS = { diagnostico: 'Diagnóstico estratégico', relatorio: 'Relatório completo', territorial: 'Expansão territorial', estudo: 'Estudo — Sem o Negro, o Brasil não Cresce' };

document.querySelectorAll('form[data-form]').forEach((form) => {
  const status = form.querySelector('.form__status');
  const say = (msg, state = 'ok') => {
    if (!status) return;
    status.hidden = false;
    status.dataset.state = state;
    status.textContent = msg;
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
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
