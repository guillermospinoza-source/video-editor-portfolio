const modal = document.getElementById('videoModal');
const video = document.getElementById('modalVideo');
const title = document.getElementById('modalTitle');
const subtitle = document.getElementById('modalSubtitle');
const close = document.querySelector('.modal-close');

document.querySelectorAll('.work-card').forEach(card => {
  card.querySelector('.poster-button').addEventListener('click', () => {
    video.src = card.dataset.video;
    title.textContent = card.dataset.title;
    subtitle.textContent = card.dataset.subtitle;
    modal.showModal();
    video.play().catch(() => {});
  });
});

function closeModal(){
  video.pause();
  video.removeAttribute('src');
  video.load();
  modal.close();
}

close.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
modal.addEventListener('cancel', e => { e.preventDefault(); closeModal(); });