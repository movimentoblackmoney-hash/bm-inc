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

/* 1c. Modal do formulário: portas de entrada e CTAs abrem o <dialog> */
const contactDialog = document.querySelector('#contact-dialog');
if (contactDialog) {
  document.addEventListener('click', (e) => {
    if (e.target.closest?.('[data-open-form]')) {
      if (!contactDialog.open) contactDialog.showModal();
      contactDialog.querySelector('#lead-nome')?.focus();
    }
    if (e.target.closest?.('[data-close-dialog]')) contactDialog.close();
    if (e.target === contactDialog) contactDialog.close(); // clique no backdrop
  });
}

/* 2. Header: ganha fundo com blur depois de 24px de scroll + menu mobile */
const header = document.querySelector('[data-header]');
if (header) {
  // Passou do topo: o menu some e só volta quando a página estiver de novo no começo
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    const menuOpen = header.querySelector('[data-nav]')?.classList.contains('is-open');
    if (y <= 24) header.classList.remove('is-hidden');
    else if (y > 160 && !menuOpen && !header.matches(':focus-within')) header.classList.add('is-hidden');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  onScroll();

  // Sem tarja: o menu muda de tom conforme o fundo que passa por baixo dele (claro → texto escuro)
  const lum = (m) => {
    const c = m.slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const backdropIsLight = () => {
    const r = header.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= window.innerHeight) return false;
    const x = Math.round(window.innerWidth / 2);
    const y = Math.min(window.innerHeight - 1, Math.max(1, Math.round(r.top + r.height / 2)));
    const under = document.elementsFromPoint(x, y).find((el) => !header.contains(el) && !el.closest('dialog'));
    for (let el = under; el && el !== document.documentElement; el = el.parentElement) {
      if (/^(VIDEO|IMG|CANVAS|PICTURE)$/.test(el.tagName)) return false;
      const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
      if (m && (m.length < 4 || Number(m[3]) > 0.6)) return lum(m.map(Number)) > 0.5;
    }
    return false;
  };
  let probing = false;
  const probe = () => {
    if (probing) return;
    probing = true;
    requestAnimationFrame(() => { probing = false; header.classList.toggle('is-on-light', backdropIsLight()); });
  };
  window.addEventListener('scroll', probe, { passive: true });
  window.addEventListener('resize', probe);
  probe();

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
const FORM_TO = import.meta.env.VITE_FORM_TO || 'movimentoblackmoney@gmail.com';
const FORM_SUBJECT = 'Contato - Site bminc';
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
    const payload = { formulario: assunto, ...data };
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    // 1) endpoint próprio (Vercel /api/contato) ou externo (VITE_FORM_ENDPOINT)
    try {
      const res = await fetch(FORM_ENDPOINT || '/api/contato', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        form.reset();
        form.dispatchEvent(new Event('bm:reset'));
        say('Recebemos sua mensagem. Em breve entraremos em contato.');
        if (submitBtn) submitBtn.disabled = false;
        return;
      }
    } catch { /* cai no e-mail */ }
    if (submitBtn) submitBtn.disabled = false;
    // 2) alternativa: abre o e-mail do usuário já preenchido
    const corpo = Object.entries(payload).map(([k, v]) => `${k}: ${v}`).join('\n');
    location.href = `mailto:${FORM_TO}?subject=${encodeURIComponent(FORM_SUBJECT)}&body=${encodeURIComponent(corpo)}`;
    say('Abrimos seu e-mail com a mensagem pronta. É só enviar.');
  });
});


/* 9. Revelação de texto ao rolar (uma vez). Hero: palavras do título sobem em sequência. */
(() => {
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('reveal-ready');

  // Hero: título palavra a palavra
  const heroTitle = document.querySelector('.home-hero h1');
  if (heroTitle && !heroTitle.dataset.split) {
    heroTitle.dataset.split = '1';
    const words = heroTitle.textContent.trim().split(/\s+/);
    heroTitle.setAttribute('aria-label', words.join(' '));
    heroTitle.innerHTML = words.map((w, i) => `<span class="hero-word" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join(' ');
  }

  const groups = [
    '.home-hero .lead-text, .home-hero__ctas',
    'main h2:not(.sr-only), .section-head > p, .numbers__lead, .tese2__lead, .tese2__note, .fund__head p, .routing__head p, .cases__head .btn, .next__intro p',
  ];
  const stagger = ['.tese2__list li', '.stat', '.fund__grid .info-card', '.routing__grid .rot-card', '.next__doors li'];
  const mark = (el, delay = 0) => {
    if (el.hasAttribute('data-reveal') || el.closest('.sr-only')) return;
    el.setAttribute('data-reveal', '');
    el.style.setProperty('--d', delay + 'ms');
  };
  document.querySelectorAll(groups[0]).forEach((el, i) => mark(el, 650 + i * 120));
  document.querySelectorAll(groups[1]).forEach((el) => mark(el));
  stagger.forEach((sel) => {
    const items = [...document.querySelectorAll(sel)];
    items.forEach((el, i) => mark(el, Math.min(i, 4) * 90));
  });

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      e.target.classList.add('is-in');
      // devolve o elemento ao CSS normal (hover etc.) depois da entrada
      setTimeout(() => { e.target.removeAttribute('data-reveal'); e.target.style.removeProperty('--d'); e.target.classList.remove('is-in'); }, 1400);
    }),
    { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
  );
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
})();


/* 10. BM Solutions: a dobra das 4 etapas fica fixa e os cards correm na horizontal ao rolar */
(() => {
  const section = document.querySelector('[data-steps]');
  if (!section) return;
  const stage = section.querySelector('[data-steps-stage]');
  const viewport = section.querySelector('.steps2__viewport');
  const track = section.querySelector('[data-steps-track]');
  const mq = window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)');
  let shift = 0;

  const update = () => {
    if (!mq.matches || shift <= 0) return;
    const top = section.getBoundingClientRect().top;
    const progress = Math.min(1, Math.max(0, -top / shift));
    track.style.transform = `translate3d(${(-progress * shift).toFixed(1)}px, 0, 0)`;
  };
  const measure = () => {
    if (!mq.matches) {
      section.classList.remove('is-pinned');
      section.style.removeProperty('height');
      track.style.removeProperty('transform');
      return;
    }
    section.classList.add('is-pinned');
    section.style.removeProperty('height');
    shift = Math.max(0, track.scrollWidth - viewport.clientWidth);
    section.style.height = `${stage.offsetHeight + shift}px`;
    update();
  };

  measure();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', measure);
  mq.addEventListener('change', measure);
  if (document.fonts?.ready) document.fonts.ready.then(measure);
})();

/* 11. Evidência: encolhe a composição (números + radial + cartão) para caber entre 1101 e 1440px */
(() => {
  const stage = document.querySelector('.numbers__stage');
  if (!stage) return;
  const fit = () => {
    if (window.innerWidth <= 1100) { stage.style.removeProperty('--stage-zoom'); return; }
    const inner = stage.closest('.numbers__inner');
    const left = parseFloat(getComputedStyle(inner).paddingLeft) || 0;
    const needed = 1128 + 73; // composição + parte do cartão que passa da coluna
    const avail = document.documentElement.clientWidth - left - 16;
    stage.style.setProperty('--stage-zoom', Math.min(1, avail / needed).toFixed(3));
  };
  fit();
  window.addEventListener('resize', fit);
})();

/* 12. Afreektech: a câmera avança pela cena 3D enquanto a primeira dobra fica fixa */
(() => {
  const stage = document.querySelector('[data-afk-stage]');
  if (!stage || reduceMotion) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const total = stage.offsetHeight - window.innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -stage.getBoundingClientRect().top / total)) : 0;
    stage.style.setProperty('--p', p.toFixed(4));
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* 13. Títulos com "luz" que segue o mouse (mesmo efeito do menu, em escala grande) */
document.querySelectorAll('[data-spotlight]').forEach((el) => {
  if (!window.matchMedia('(hover: hover)').matches) return;
  const host = el.closest('section') || el;
  host.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--hx', `${(e.clientX - r.left).toFixed(0)}px`);
    el.style.setProperty('--hy', `${(e.clientY - r.top).toFixed(0)}px`);
  });
  host.addEventListener('mouseleave', () => {
    el.style.setProperty('--hx', '-600px');
  });
});


/* 14. Formulários: dropdown próprio, CTA que muda com a escolha e campo para "outro assunto" */
(() => {
  const CTA_BY_INTENT = {
    'Contratar um projeto': 'Estruturar meu projeto',
    'Financiar uma frente': 'Quero apoiar uma frente',
    'Acessar conteúdo': 'Receber o conteúdo',
    'Falar sobre outro assunto': 'Enviar mensagem',
  };

  // Dropdown acessível (botão + listbox) sincronizado com o <select> original
  const enhance = (select) => {
    if (select.dataset.dd) return;
    select.dataset.dd = '1';
    const wrap = document.createElement('div');
    wrap.className = 'dd';
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');

    const label = document.querySelector(`label[for="${select.id}"]`);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dd__btn';
    btn.id = `${select.id}-btn`;
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    if (label) {
      label.id ||= `${select.id}-label`;
      btn.setAttribute('aria-labelledby', `${label.id} ${btn.id}`);
    }
    const list = document.createElement('ul');
    list.className = 'dd__list';
    list.id = `${select.id}-list`;
    list.setAttribute('role', 'listbox');
    if (label) list.setAttribute('aria-labelledby', label.id);
    btn.setAttribute('aria-controls', list.id);
    wrap.append(btn, list);

    [...select.options].filter((o) => !o.disabled).forEach((o, i) => {
      const li = document.createElement('li');
      li.className = 'dd__opt';
      li.setAttribute('role', 'option');
      li.id = `${select.id}-opt-${i}`;
      li.textContent = o.textContent;
      li._o = o;
      list.appendChild(li);
    });
    const items = () => [...list.children];
    let active = 0;
    const setActive = (i) => {
      active = Math.max(0, Math.min(items().length - 1, i));
      items().forEach((li, k) => {
        if (k === active) {
          li.setAttribute('data-active', '');
          list.setAttribute('aria-activedescendant', li.id);
          li.scrollIntoView({ block: 'nearest' });
        } else li.removeAttribute('data-active');
      });
    };
    const sync = () => {
      const o = select.selectedOptions[0];
      btn.textContent = o ? o.textContent : '';
      if (!select.value) btn.setAttribute('data-empty', '');
      else btn.removeAttribute('data-empty');
      items().forEach((li) => li.setAttribute('aria-selected', String(!!select.value && li._o.value === select.value)));
    };
    const open = () => {
      wrap.setAttribute('data-open', '');
      btn.setAttribute('aria-expanded', 'true');
      setActive(Math.max(0, items().findIndex((li) => li._o.value === select.value)));
    };
    const close = (focus = true) => {
      wrap.removeAttribute('data-open');
      btn.setAttribute('aria-expanded', 'false');
      if (focus) btn.focus();
    };
    const choose = (i) => {
      select.value = items()[i]._o.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      btn.removeAttribute('aria-invalid');
      sync();
      close();
    };
    btn.addEventListener('click', () => (wrap.hasAttribute('data-open') ? close(false) : open()));
    btn.addEventListener('keydown', (e) => {
      const isOpen = wrap.hasAttribute('data-open');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen) open();
        else setActive(active + (e.key === 'ArrowDown' ? 1 : -1));
      } else if ((e.key === 'Enter' || e.key === ' ') && isOpen) {
        e.preventDefault();
        choose(active);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        e.stopPropagation();
        close();
      } else if (e.key === 'Tab' && isOpen) close(false);
    });
    list.addEventListener('mousedown', (e) => e.preventDefault());
    list.addEventListener('click', (e) => {
      const li = e.target.closest('.dd__opt');
      if (li) choose(items().indexOf(li));
    });
    document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) close(false); });
    select.addEventListener('change', sync);
    select.form?.addEventListener('reset', () => setTimeout(sync));
    select.form?.addEventListener('bm:reset', sync);
    sync();
  };
  document.querySelectorAll('form[data-form] select').forEach(enhance);

  // CTA e campo "outro assunto"
  document.querySelectorAll('form[data-form]').forEach((form) => {
    const intent = form.querySelector('#lead-intencao');
    if (!intent) return;
    const label = form.querySelector('[data-submit-label]');
    const other = form.querySelector('[data-other-field]');
    const otherInput = other?.querySelector('textarea');
    const update = () => {
      const v = intent.value;
      if (label) label.textContent = CTA_BY_INTENT[v] || 'Abrir conversa';
      if (other) {
        const show = v === 'Falar sobre outro assunto';
        other.hidden = !show;
        if (otherInput) otherInput.required = show;
      }
    };
    intent.addEventListener('change', update);
    form.addEventListener('bm:reset', update);
    form.addEventListener('reset', () => setTimeout(update));
    // portas de entrada preenchem o campo por script: atualiza CTA e campo extra depois do clique
    document.addEventListener('click', (e) => {
      if (e.target.closest?.('[data-intent]')) setTimeout(() => { intent.dispatchEvent(new Event('change')); }, 0);
    });
    update();
  });
})();


/* 15. Linhas empilhadas (serviços da BM Solutions e estudos do Afreektech).
   Um palco fixo no topo; cada linha sobe por cima da anterior conforme a rolagem e, no fim, o bloco inteiro sai junto
   (nada some "do nada" como acontecia com sticky individual). */
(() => {
  const lists = [...document.querySelectorAll('.stack-list:not([data-no-stack])')];
  if (!lists.length) return;
  const mq = window.matchMedia('(min-width: 901px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)');
  const PITCH = 96;   // quanto cada linha recolhida deixa à mostra
  const STEP = 320;   // rolagem necessária para cada linha chegar
  const TOP = 24;

  const setups = lists.map((list) => {
    const rows = [...list.children];
    const scroller = document.createElement('div');
    scroller.className = 'stack-scroll';
    list.parentNode.insertBefore(scroller, list);
    scroller.appendChild(list);
    return { list, rows, scroller, active: false, H: 0, W: 0 };
  });

  const layout = (s) => {
    const n = s.rows.length;
    s.list.classList.add('is-stacked');
    s.rows.forEach((r) => { r.style.transform = ''; r.style.height = 'auto'; });
    s.H = Math.ceil(Math.max(...s.rows.map((r) => r.scrollHeight)));
    s.W = s.H + (n - 1) * PITCH;
    s.rows.forEach((r) => { r.style.height = `${s.H}px`; });
    s.list.style.height = `${s.W}px`;
    s.scroller.style.height = `${s.W + (n - 1) * STEP + TOP}px`;
    s.active = true;
  };
  const unlayout = (s) => {
    s.list.classList.remove('is-stacked');
    s.list.style.height = '';
    s.scroller.style.height = '';
    s.rows.forEach((r) => { r.style.transform = ''; r.style.height = ''; });
    s.active = false;
  };
  const paint = (s) => {
    if (!s.active) return;
    const n = s.rows.length;
    const top = s.scroller.getBoundingClientRect().top;
    const p = Math.min(n - 1, Math.max(0, (TOP - top) / STEP));
    s.rows.forEach((r, i) => {
      let y = 0;
      if (i > 0) {
        const t = Math.min(1, Math.max(0, p - (i - 1)));
        y = s.W - (s.W - i * PITCH) * t;
      }
      r.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    });
  };
  const refresh = () => {
    setups.forEach((s) => {
      if (mq.matches) layout(s); else unlayout(s);
      paint(s);
    });
  };
  refresh();
  window.addEventListener('scroll', () => setups.forEach(paint), { passive: true });
  window.addEventListener('resize', refresh);
  mq.addEventListener('change', refresh);
  if (document.fonts?.ready) document.fonts.ready.then(refresh);
})();
