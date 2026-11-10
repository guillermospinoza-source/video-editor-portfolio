const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function formatTime(seconds){
  const s = Math.floor(seconds);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/* ---------- Videos en línea (reel y presentación) ---------- */
const inlineVideos = [...document.querySelectorAll('.reel-frame video')];
const reel = document.getElementById('reelVideo');

document.querySelectorAll('.reel-frame').forEach(frame => {
  const video = frame.querySelector('video');
  const cta = frame.querySelector('.reel-cta');
  const duration = document.querySelector(`[data-duration-for="${video.id}"]`);

  video.addEventListener('loadedmetadata', () => {
    if (duration && Number.isFinite(video.duration)) duration.textContent = formatTime(video.duration);
  });

  // La portada se queda visible hasta que el visitante da play.
  cta.addEventListener('click', () => {
    inlineVideos.forEach(v => { if (v !== video) v.pause(); });
    video.controls = true;
    frame.dataset.state = 'playing';
    video.play().catch(() => {});
    video.focus({ preventScroll: true });
  });

  // Solo un video sonando a la vez.
  video.addEventListener('play', () => {
    inlineVideos.forEach(v => { if (v !== video) v.pause(); });
  });
});

/* ---------- Modal de trabajos ---------- */
const modal = document.getElementById('videoModal');
const player = document.getElementById('modalVideo');
const title = document.getElementById('modalTitle');
const subtitle = document.getElementById('modalSubtitle');
const closeButton = document.querySelector('.modal-close');
let lastTrigger = null;

document.querySelectorAll('.work-card').forEach(card => {
  const trigger = card.querySelector('.poster-button');
  trigger.addEventListener('click', () => {
    lastTrigger = trigger;
    inlineVideos.forEach(v => v.pause());
    player.poster = card.dataset.poster;
    player.src = card.dataset.video;
    title.textContent = card.dataset.title;
    subtitle.textContent = card.dataset.subtitle;
    modal.classList.remove('is-closing');
    modal.showModal();
    player.play().catch(() => {});
  });
});

function finishClose(){
  modal.classList.remove('is-closing');
  modal.close();
  player.removeAttribute('src');
  player.load();
  lastTrigger?.focus({ preventScroll: true });
}

function closeModal(){
  if (!modal.open || modal.classList.contains('is-closing')) return;
  player.pause();
  if (reducedMotion.matches) return finishClose();
  modal.classList.add('is-closing');
  const done = () => { clearTimeout(fallback); finishClose(); };
  const fallback = setTimeout(done, 250);
  modal.addEventListener('animationend', done, { once: true });
}

closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
modal.addEventListener('cancel', e => { e.preventDefault(); closeModal(); });

/* ---------- Entrada y aparición al hacer scroll ---------- */
requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove('is-loading')));

const revealItems = document.querySelectorAll('[data-reveal]');
if (reducedMotion.matches || !('IntersectionObserver' in window)) {
  revealItems.forEach(el => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  revealItems.forEach(el => io.observe(el));
}

// Escalonado de las tarjetas de trabajo
document.querySelectorAll('.work-card').forEach((card, i) => {
  card.style.setProperty('--delay', `${(i % 2) * 90}ms`);
});
