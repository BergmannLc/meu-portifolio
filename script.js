// utilitários
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

// Navbar burger
const burger = $('.burger');
const menu = $('.menu');

if (burger && menu) {
  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    burger.classList.toggle('open');
    menu.classList.toggle('open');
  });

  // fecha o menu quando clica em qualquer link (mobile)
  $$('.menu a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Ano no rodapé
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Toggle de tema (claro / escuro) com persistência
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function applyTheme(t) {
  if (t === 'light') {
    body.classList.add('light');
    themeToggle && (themeToggle.textContent = '☀️');
    themeToggle && themeToggle.setAttribute('aria-pressed', 'true');
  } else {
    body.classList.remove('light');
    themeToggle && (themeToggle.textContent = '🌙');
    themeToggle && themeToggle.setAttribute('aria-pressed', 'false');
  }
}

function loadTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

let currentTheme = loadTheme();
applyTheme(currentTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
  });
}

// Animação das barras de skill quando entram em view (opcional)
const bars = $$('.bar > span');
if (bars.length && 'IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const el = en.target;
        const level = el.dataset.level || 0;
        el.style.width = level + '%';
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(b => obs.observe(b));
}

// Validação simples do formulário (exemplo)
const form = document.getElementById('contactForm');
if (form) {
  const statusEl = form.querySelector('.form-status');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    let ok = true;

    function showError(input, show, txt) {
      const small = input.closest('.field').querySelector('.error');
      if (show) { small.style.display = 'block'; small.textContent = txt || small.textContent; }
      else small.style.display = 'none';
    }

    if (!name.value.trim()) { showError(name, true, 'Informe seu nome.'); ok = false } else showError(name, false);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showError(email, true, 'E-mail inválido.'); ok = false } else showError(email, false);
    if (!message.value.trim()) { showError(message, true, 'Escreva uma mensagem.'); ok = false } else showError(message, false);

    if (!ok) return;
    statusEl.textContent = 'Enviando…';

    setTimeout(() => {
      statusEl.textContent = 'Mensagem enviada! Obrigado pelo contato.';
      form.reset();
    }, 800);
  });
}
