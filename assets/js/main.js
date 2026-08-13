document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('[data-menu]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const themeToggle = document.querySelector('[data-theme-toggle]');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const dark = document.documentElement.classList.toggle('dark');
      try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (error) { /* storage unavailable */ }
    });
  }

  const revealItems = document.querySelectorAll('[data-reveal]');
  revealItems.forEach((item) => item.classList.add('reveal-ready'));
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));

  const form = document.querySelector('[data-contact-form]');
  const formStatus = document.querySelector('[data-form-status]');
  if (form) form.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = form.querySelector('button');
    const data = Object.fromEntries(new FormData(form));
    if (!window.emailjs) { if (formStatus) formStatus.textContent = 'Please email tech.swarupdas@gmail.com directly.'; return; }
    button.disabled = true;
    if (formStatus) formStatus.textContent = 'Sending…';
    window.emailjs.send('service_5hjs7h9', 'template_y1pg2tv', { from_name: data.name, from_email: data.email, message: data.message, to_email: 'swaruptechranjan@gmail.com' }).then(() => {
      form.reset(); if (formStatus) formStatus.textContent = 'Message sent. I’ll get back to you soon.';
    }).catch(() => { if (formStatus) formStatus.textContent = 'Could not send the message. Please email directly.'; }).finally(() => { button.disabled = false; });
  });

  const wave = document.querySelector('#wave');
  if (!wave || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const context = wave.getContext('2d');
  let offset = 0;
  const draw = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = wave.getBoundingClientRect();
    wave.width = width * ratio; wave.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    context.lineWidth = 1;
    for (let line = 0; line < 4; line += 1) {
      context.globalAlpha = 0.12 - line * 0.018;
      context.beginPath();
      for (let x = 0; x <= width; x += 8) {
        const y = height * (0.18 + line * 0.16) + Math.sin(x * 0.014 + offset + line) * (18 + line * 5);
        if (x === 0) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.stroke();
    }
    offset += 0.012;
    requestAnimationFrame(draw);
  };
  draw();
});
