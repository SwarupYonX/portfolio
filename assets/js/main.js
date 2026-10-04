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

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const termCmd = document.querySelector('[data-term-cmd]');
  const termOut = document.querySelector('[data-term-out]');
  if (termCmd && termOut && !reduceMotion) {
    const script = [
      ['terraform plan -out=tfplan', 'Plan: 20 to add, 0 to change, 0 to destroy.'],
      ['az pipelines run --name deploy-prod', '✓ SonarQube · Snyk · approval gate passed'],
      ['terraform apply tfplan', 'Apply complete! Resources: 20 added, 0 destroyed.'],
      ['kubectl rollout status deploy/api', 'deployment "api" successfully rolled out'],
      ['az policy state summarize --resource-group rg-prod', '✓ Compliant · 0 non-compliant resources']
    ];
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    (async () => {
      for (let step = 0; ; step = (step + 1) % script.length) {
        const [cmd, out] = script[step];
        termOut.classList.remove('is-shown');
        termCmd.textContent = '';
        await wait(step === 0 ? 1600 : 350);
        for (const char of cmd) { termCmd.textContent += char; await wait(32 + Math.random() * 34); }
        await wait(380);
        termOut.textContent = out;
        termOut.classList.add('is-shown');
        await wait(2900);
      }
    })();
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && !reduceMotion) {
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = Number(el.dataset.decimals || 0);
      const { prefix = '', suffix = '' } = el.dataset;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / 1400, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const countObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { run(entry.target); countObserver.unobserve(entry.target); }
    }), { threshold: 0.6 });
    counters.forEach((el) => { el.textContent = `${el.dataset.prefix || ''}${(0).toFixed(Number(el.dataset.decimals || 0))}${el.dataset.suffix || ''}`; countObserver.observe(el); });
  }

  const roleList = document.querySelector('.role-list');
  const firstRole = roleList && roleList.querySelector('.role-entry');
  if (firstRole) firstRole.classList.add('is-current');
  if (roleList && !reduceMotion) {
    let ticking = false;
    const update = () => {
      const rect = roleList.getBoundingClientRect();
      const progress = (window.innerHeight * 0.6 - rect.top) / rect.height;
      roleList.style.setProperty('--progress', Math.min(Math.max(progress, 0), 1).toFixed(3));
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  const wave = document.querySelector('#wave');
  if (!wave || reduceMotion) return;
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
