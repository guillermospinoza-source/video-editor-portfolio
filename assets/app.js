const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function formatTime(seconds){
  const s = Math.floor(seconds);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/* ---------- Reel del hero ---------- */
const reelFrame = document.querySelector('.reel-frame');
const reel = document.getElementById('reelVideo');
const reelCta = document.querySelector('.reel-cta');
const reelDuration = document.querySelector('[data-duration-for="reelVideo"]');

reel.addEventListener('loadedmetadata', () => {
  if (reelDuration && Number.isFinite(reel.duration)) reelDuration.textContent = formatTime(reel.duration);
});

// La portada (último fotograma) se queda visible hasta que el visitante da play.
reelCta.addEventListener('click', () => {
  reel.controls = true;
  reelFrame.dataset.state = 'playing';
  reel.play().catch(() => {});
  reel.focus({ preventScroll: true });
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
    reel.pause();
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
