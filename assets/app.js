const modal = document.getElementById('videoModal');
const player = document.getElementById('modalVideo');
const title = document.getElementById('modalTitle');
const subtitle = document.getElementById('modalSubtitle');
const close = document.querySelector('.modal-close');

document.querySelectorAll('.work-card').forEach(card => {
  card.querySelector('.poster-button').addEventListener('click', () => {
    player.src = card.dataset.video;
    title.textContent = card.dataset.title;
    subtitle.textContent = card.dataset.subtitle;
    modal.showModal();
  });
});

function closeModal(){
  player.removeAttribute('src');
  modal.close();
}

close.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
modal.addEventListener('cancel', e => { e.preventDefault(); closeModal(); });