(() => {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lb-img');
  const titleEl = document.getElementById('lb-title');
  const subEl = document.getElementById('lb-sub');
  const btnClose = lb.querySelector('.lb-close');
  const btnPrev  = lb.querySelector('.lb-prev');
  const btnNext  = lb.querySelector('.lb-next');
  const btnFull  = lb.querySelector('.lb-full');
  const backdrop = lb.querySelector('[data-close]');

  let items = [];   // [{src,title,sub}]
  let idx = 0;

  function collectItems() {
    items = Array.from(document.querySelectorAll('.gallery .zoom')).map(b => ({
      src: b.dataset.src,
      title: b.dataset.title || '',
      sub: b.dataset.sub || ''
    }));
  }

  function openAt(i) {
    if (!items.length) collectItems();
    idx = (i + items.length) % items.length;
    const it = items[idx];
    img.classList.remove('zoom');
    img.src = it.src;
    img.alt = it.title || '';
    titleEl.textContent = it.title || '';
    subEl.textContent = it.sub || '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
  }
  function close() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
    img.src = '';
  }
  function next(n=1){ openAt(idx + n); }

  // Open from grid
  document.addEventListener('click', e => {
    const b = e.target.closest('.gallery .zoom');
    if (!b) return;
    e.preventDefault();
    collectItems();
    openAt(parseInt(b.dataset.idx || '0', 10));
  });

  // Controls
  btnClose.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  btnPrev.addEventListener('click', () => next(-1));
  btnNext.addEventListener('click', () => next(1));
  btnFull.addEventListener('click', () => img.classList.toggle('zoom'));

  // Keyboard
  window.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next(1);
    if (e.key === 'ArrowLeft')  next(-1);
  });
})();
