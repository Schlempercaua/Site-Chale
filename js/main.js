// ─── LOADER ──────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 600);
  }
});

// ─── NAVBAR SCROLL ────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── HERO BG ANIMATION ───────────────────────────────────────────────────
setTimeout(() => {
  const heroBg = document.getElementById('heroBg');
  if (heroBg) heroBg.classList.add('loaded');
}, 100);

// ─── HAMBURGUER ──────────────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ─── INTERSECTION OBSERVER (FADE IN) ─────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right')
  .forEach(el => observer.observe(el));

// ─── COUNTER ANIMATION ───────────────────────────────────────────────────
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current  = Math.floor(eased * target);
    el.textContent = current.toLocaleString('pt-BR');
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target.toLocaleString('pt-BR');
    }
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-count').forEach(el => counterObserver.observe(el));

// ─── LIGHTBOX ────────────────────────────────────────────────────────────
const galItems    = Array.from(document.querySelectorAll('.gal-item img'));
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let currentIndex  = 0;

function openLightbox(index) {
  currentIndex = index;
  const img = galItems[index];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightbox.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function navLightbox(dir) {
  currentIndex = (currentIndex + dir + galItems.length) % galItems.length;
  const img = galItems[currentIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
}

document.querySelectorAll('.gal-item').forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(i);
    }
  });
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => navLightbox(-1));
document.getElementById('lightboxNext').addEventListener('click', () => navLightbox(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  navLightbox(-1);
  if (e.key === 'ArrowRight') navLightbox(1);
});

// ─── FORM VALIDATION & SUBMIT ─────────────────────────────────────────────
function showError(fieldId, show) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + '-error');
  if (!field || !error) return;
  field.classList.toggle('error', show);
  error.classList.toggle('show', show);
}

function validateForm() {
  const nome     = document.getElementById('nome').value.trim();
  const checkin  = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;
  const hospedes = document.getElementById('hospedes').value;
  const telefone = document.getElementById('telefone').value.trim();

  showError('nome',     !nome);
  showError('checkin',  !checkin);
  showError('checkout', !checkout || (checkin && checkout && checkout <= checkin));
  showError('hospedes', !hospedes);
  showError('telefone', !telefone);

  if (!nome || !checkin || !checkout || !hospedes || !telefone) return false;
  if (checkin && checkout && checkout <= checkin) return false;
  return true;
}

document.getElementById('reservaForm').addEventListener('submit', function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  const nome     = document.getElementById('nome').value.trim();
  const checkin  = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;
  const hospedes = document.getElementById('hospedes').value;
  const telefone = document.getElementById('telefone').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  const formatarData = (iso) => {
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const formatarTelefone = (tel) => {
    const d = tel.replace(/\D/g, '');
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return tel;
  };

  const EMOJI_SORRISO = String.fromCodePoint(128522); // 😊
  const EMOJI_FOLHA   = String.fromCodePoint(127807);  // 🌿

  const linhas = [
    `Olá! ${EMOJI_SORRISO}`,
    'Gostaria de solicitar uma reserva no *Chalé Amanhecer da Serra*.',
    '',
    'Segue abaixo minhas informações:',
    '',
    `- *Nome:* ${nome}`,
    `- *Check-in:* ${formatarData(checkin)}`,
    `- *Check-out:* ${formatarData(checkout)}`,
    `- *Número de hóspedes:* ${hospedes}`,
    `- *Telefone para contato:* ${formatarTelefone(telefone)}`,
  ];
  if (mensagem) linhas.push(`- *Observações:* ${mensagem}`);
  linhas.push('', `Fico no aguardo da confirmação e de mais orientações. Desde já, muito obrigado! ${EMOJI_FOLHA}`);

  const mensagemFinal = linhas.join('\n');
  const texto = encodeURIComponent(mensagemFinal);
  const waUrl = `https://wa.me/5548984276280?text=${texto}`;

  console.log('[WA] Mensagem:\n', mensagemFinal);
  console.log('[WA] URL:', waUrl);

  document.getElementById('formSuccess').classList.add('show');

  // Deve ser chamado imediatamente (sem setTimeout) para preservar o gesto
  // do usuário — iOS e Android só disparam o deep link do WhatsApp nativo
  // quando window.open ocorre dentro do evento de clique.
  const waJanela = window.open(waUrl, '_blank', 'noopener,noreferrer');
  if (!waJanela) {
    window.location.href = waUrl;
  }
});

// ─── SET MIN DATE ─────────────────────────────────────────────────────────
(function () {
  const today = new Date().toISOString().split('T')[0];
  const checkinEl  = document.getElementById('checkin');
  const checkoutEl = document.getElementById('checkout');
  checkinEl.min  = today;
  checkoutEl.min = today;
  checkinEl.addEventListener('change', function () {
    checkoutEl.min = this.value || today;
    if (checkoutEl.value && checkoutEl.value <= this.value) {
      checkoutEl.value = '';
    }
  });
})();
