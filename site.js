/* Page behaviour: nav menu, current-section highlight, reveals, hero fade,
   and the pinned "Research focus" panels on wide screens. */
(function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');

  // ---- mobile menu ----
  const menuBtn = document.querySelector('.menu-btn');
  const navList = document.getElementById('nav-links');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    header.classList.toggle('menu-open', open);
  }
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  navList.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // ---- highlight the section currently in view ----
  const links = [...navList.querySelectorAll('a[href^="#"]')];
  const byId = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.removeAttribute('aria-current'));
      const link = byId.get(entry.target.id);
      if (link) link.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  byId.forEach((_, id) => { const el = document.getElementById(id); if (el) spy.observe(el); });

  // ---- one clean reveal per element ----
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, #about-img').forEach(el => io.observe(el));

  // ---- header background once the page scrolls; hero fades out ----
  const heroInner = document.querySelector('.hero-inner');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
    if (reduceMotion) return;
    const progress = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
    heroInner.style.opacity = 1 - progress;
    heroInner.style.transform = `translateY(${-progress * 30}px)`;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- research focus: pinned crossfade on wide screens, stacked on small ----
  const capWrap = document.getElementById('research');
  const capPanels = capWrap.querySelectorAll('.cap-panel');
  const capDots = capWrap.querySelectorAll('.dot-row');
  const wide = window.matchMedia('(min-width: 821px)');
  let lastIndex = -1;

  function updateCapabilities() {
    if (!wide.matches) return;
    const rect = capWrap.getBoundingClientRect();
    const total = capWrap.offsetHeight - window.innerHeight;
    const progress = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
    const index = Math.min(capPanels.length - 1, Math.floor(progress * capPanels.length));
    if (index === lastIndex) return;
    capPanels.forEach((p, k) => {
      p.classList.toggle('active', k === index);
      p.toggleAttribute('inert', k !== index);
    });
    capDots.forEach((d, k) => d.classList.toggle('active', k === index));
    lastIndex = index;
  }
  wide.addEventListener('change', () => {
    lastIndex = -1;
    if (!wide.matches) capPanels.forEach(p => { p.classList.remove('active'); p.removeAttribute('inert'); });
    updateCapabilities();
  });
  window.addEventListener('scroll', updateCapabilities, { passive: true });
  updateCapabilities();
})();
