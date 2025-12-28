// Main interactions: simple, readable, and easy to extend
(function () {
  const qs = (sel, el = document) => el.querySelector(sel);
  const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  // Mobile nav toggle
  const toggle = qs('.nav-toggle');
  const nav = qs('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.style.display === 'flex';
      nav.style.display = open ? 'none' : 'flex';
    });
  }

  // Smooth scroll for in-page links
  qsa('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      const target = qs(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Scrollspy: highlight active nav link
  const sections = qsa('section[id]');
  const links = qsa('.site-nav .nav-link');

  const onScroll = () => {
    const y = window.scrollY + 120; // offset for header
    let current = null;
    sections.forEach((sec) => {
      if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
        current = sec.id;
      }
    });
    links.forEach((l) => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Basic form handler (demo only)
  const form = qs('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thanks! This demo form does not send emails. Replace the action with your endpoint.');
    });
  }
})();
