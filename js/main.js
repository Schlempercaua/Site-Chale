// Lightweight presentation enhancement; no content is generated or rewritten.
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const heroBg = document.getElementById('heroBg');
document.documentElement.classList.add('js');

if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => navbar.classList.toggle('scrolled', !entry.isIntersecting)).observe(document.getElementById('navSentinel'));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('reveal-pending');
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), {threshold:0, rootMargin:'0px 0px 40px 0px'});
  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    if (!motion.matches && el.getBoundingClientRect().top > innerHeight) el.classList.add('reveal-pending');
    observer.observe(el);
  });
}
motion.addEventListener('change', () => {
  if (motion.matches) {
    document.querySelectorAll('.reveal-pending').forEach(el=>el.classList.remove('reveal-pending'));
    heroBg.style.removeProperty('--depth');
  }
});
// Restrained photographic depth, fine pointers only, no scroll repaint loop.
document.getElementById('inicio').addEventListener('pointermove', e => {
  if (motion.matches || !matchMedia('(hover:hover) and (pointer:fine) and (min-width:801px)').matches) return;
  const r=heroBg.getBoundingClientRect();
  heroBg.style.setProperty('--depth', (Math.max(0, Math.min(1, (e.clientX-r.left)/r.width))-.5)*1.2+'deg');
});
document.getElementById('inicio').addEventListener('pointerleave',()=>heroBg.style.removeProperty('--depth'));

function setMenu(open, restore=false) {
  navLinks.classList.toggle('open',open);
  navToggle.classList.toggle('active',open);
  navToggle.setAttribute('aria-expanded',String(open));
  if (open) navLinks.querySelector('a').focus();
  else if (restore) navToggle.focus();
}
navToggle.addEventListener('click',()=>setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  setMenu(false);
  const section=document.querySelector(a.getAttribute('href'));
  if(section){section.tabIndex=-1;section.focus({preventScroll:true});}
}));
document.addEventListener('click',e=>{if(!navbar.contains(e.target))setMenu(false);});
document.addEventListener('keydown',e=>{
  if(!navLinks.classList.contains('open'))return;
  if(e.key==='Escape'){setMenu(false,true);return;}
  if(e.key==='Tab'){
    const first=navLinks.querySelector('a');
    if(e.shiftKey && document.activeElement===first){e.preventDefault();navToggle.focus();}
    else if(!e.shiftKey && document.activeElement===navToggle){e.preventDefault();first.focus();}
  }
});
matchMedia('(max-width:800px)').addEventListener('change',()=>setMenu(false));

const galItems=Array.from(document.querySelectorAll('.gal-item img'));
const galleryTriggers=Array.from(document.querySelectorAll('.gal-item'));
const lightbox=document.getElementById('lightbox');
const lightboxImg=document.getElementById('lightboxImg');
const closeButton=document.getElementById('lightboxClose');
let currentIndex=0;
let returnFocus;
let priorOverflow='';
let inerted=[];
function showImage(){
  lightboxImg.src=galItems[currentIndex].currentSrc || galItems[currentIndex].src;
  lightboxImg.alt=galItems[currentIndex].alt;
}
function openLightbox(index){
  currentIndex=index;returnFocus=document.activeElement;showImage();
  priorOverflow=document.body.style.overflow;
  lightbox.inert=false;lightbox.classList.add('open');
  inerted=Array.from(document.body.children).filter(el=>el!==lightbox && el.tagName!=='SCRIPT' && !el.inert);
  inerted.forEach(el=>el.inert=true);
  document.body.style.overflow='hidden';closeButton.focus();
}
function closeLightbox(){
  lightbox.classList.remove('open');lightbox.inert=true;
  inerted.forEach(el=>el.inert=false);inerted=[];
  document.body.style.overflow=priorOverflow;
  returnFocus?.focus({preventScroll:true});
}
function navLightbox(dir){currentIndex=(currentIndex+dir+galItems.length)%galItems.length;showImage();}
galleryTriggers.forEach((item,i)=>{
  // Preserve the list semantics while exposing the actual keyboard action.
  item.setAttribute('role','button');
  item.setAttribute('aria-haspopup','dialog');
  item.addEventListener('click',()=>openLightbox(i));
  item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(i);}});
});
// Buttons form a labelled group rather than malformed ARIA lists.
document.querySelectorAll('.galeria-grid,.recantos-grid,.lazer-grid').forEach(el=>el.setAttribute('role','group'));
closeButton.addEventListener('click',closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click',()=>navLightbox(-1));
document.getElementById('lightboxNext').addEventListener('click',()=>navLightbox(1));
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
lightbox.addEventListener('keydown',e=>{
  if(e.key==='Escape')closeLightbox();
  if(e.key==='ArrowLeft'){e.preventDefault();navLightbox(-1);}
  if(e.key==='ArrowRight'){e.preventDefault();navLightbox(1);}
  if(e.key==='Tab'){
    const last=document.getElementById('lightboxNext');
    if(e.shiftKey && document.activeElement===closeButton){e.preventDefault();last.focus();}
    else if(!e.shiftKey && document.activeElement===last){e.preventDefault();closeButton.focus();}
  }
});
let touchStart=null;
lightboxImg.addEventListener('touchstart',e=>{touchStart=e.touches.length===1?e.touches[0].clientX:null;},{passive:true});
lightboxImg.addEventListener('touchend',e=>{
  if(touchStart!==null){const dx=e.changedTouches[0].clientX-touchStart;if(Math.abs(dx)>60)navLightbox(dx<0?1:-1);}
  touchStart=null;
},{passive:true});

// ─── FORM VALIDATION & SUBMIT ─────────────────────────────────────────────
function showError(fieldId, show) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + '-error');
  if (!field || !error) return;
  field.classList.toggle('error', show);
  field.setAttribute('aria-invalid', String(show));
  field.setAttribute('aria-describedby', error.id);
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
  if (!validateForm()) {
    this.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

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
  // wa.me corrompe emoji (4-byte UTF-8) na redirect 302 → vai direto ao destino final
  const waUrl = `https://api.whatsapp.com/send/?phone=5548984276280&text=${texto}&type=phone_number&app_absent=0`;


  document.getElementById('formSuccess').classList.add('show');

  // Deve ser chamado imediatamente (sem setTimeout) para preservar o gesto
  // do usuário — iOS e Android só disparam o deep link do WhatsApp nativo
  // quando window.open ocorre dentro do evento de clique.
  window.open(waUrl, '_blank', 'noopener,noreferrer');
});

// ─── SET MIN DATE ─────────────────────────────────────────────────────────
(function () {
  const localNow = new Date();
  const today = [localNow.getFullYear(), String(localNow.getMonth() + 1).padStart(2, '0'), String(localNow.getDate()).padStart(2, '0')].join('-');
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
