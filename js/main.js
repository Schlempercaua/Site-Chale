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
function sanitize(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str)));
  return d.innerHTML;
}

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

  const nome     = sanitize(document.getElementById('nome').value.trim());
  const checkin  = sanitize(document.getElementById('checkin').value);
  const checkout = sanitize(document.getElementById('checkout').value);
  const hospedes = sanitize(document.getElementById('hospedes').value);
  const telefone = sanitize(document.getElementById('telefone').value.trim());
  const mensagem = sanitize(document.getElementById('mensagem').value.trim());

  const texto =
    `Olá! Gostaria de reservar o Chalé Amanhecer da Serra.%0A%0A` +
    `👤 *Nome:* ${encodeURIComponent(nome)}%0A` +
    `📅 *Check-in:* ${encodeURIComponent(checkin)}%0A` +
    `📅 *Check-out:* ${encodeURIComponent(checkout)}%0A` +
    `👥 *Hóspedes:* ${encodeURIComponent(hospedes)}%0A` +
    `📱 *Telefone:* ${encodeURIComponent(telefone)}` +
    (mensagem ? `%0A💬 *Obs:* ${encodeURIComponent(mensagem)}` : '');

  document.getElementById('formSuccess').classList.add('show');
  setTimeout(() => {
    window.open(`https://wa.me/5548999999999?text=${texto}`, '_blank', 'noopener,noreferrer');
  }, 600);
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
