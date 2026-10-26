/* ================================================================
   EGA VIRGA YUGANTARA — PORTFOLIO JAVASCRIPT
   Particles · Typed Text · Scroll Animations · Form Validation
   Cursor · Theme Toggle · Skill Filter · Counter Animations
   ================================================================ */

'use strict';

// ── Helpers ──────────────────────────────────────────────────────
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

// ================================================================
// LOADER
// ================================================================
window.addEventListener('load', () => {
  const loader = $('#loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    initAnimations();
  }, 1800);
  document.body.style.overflow = 'hidden';
});

// ================================================================
// CUSTOM CURSOR
// ================================================================
const cursor   = $('#cursor');
const follower = $('#cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left   = mx + 'px';
  cursor.style.top    = my + 'px';
});

(function animateFollower() {
  fx += (mx - fx) * 0.15;
  fy += (my - fy) * 0.15;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animateFollower);
})();

// ================================================================
// NAVBAR — SCROLL + ACTIVE SECTION
// ================================================================
const navbar   = $('#navbar');
const navLinks = $$('.nav-link');
const sections = $$('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Back to top visibility
  const btt = $('#back-to-top');
  if (btt) btt.style.opacity = window.scrollY > 400 ? '1' : '0';

  // Active nav link
  let current = 'hero';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(lnk => {
    lnk.classList.toggle('active', lnk.dataset.section === current);
  });
});

// Smooth-scroll for all anchor links
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  const target = $(link.getAttribute('href'));
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // close mobile drawer
  closeMobileDrawer();
});

// ================================================================
// MOBILE DRAWER
// ================================================================
const hamburger    = $('#hamburger');
const mobileDrawer = $('#mobile-drawer');
const drawerOverlay = $('#drawer-overlay');
const drawerClose  = $('#drawer-close');

function openMobileDrawer() {
  mobileDrawer.classList.add('open');
  drawerOverlay.classList.add('open');
  hamburger.classList.add('open');
}
function closeMobileDrawer() {
  mobileDrawer.classList.remove('open');
  drawerOverlay.classList.remove('open');
  hamburger.classList.remove('open');
}
hamburger?.addEventListener('click', openMobileDrawer);
drawerClose?.addEventListener('click', closeMobileDrawer);
drawerOverlay?.addEventListener('click', closeMobileDrawer);

// ================================================================
// THEME TOGGLE
// ================================================================
const themeBtn = $('#theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
body.dataset.theme = savedTheme;

themeBtn?.addEventListener('click', () => {
  const isDark = body.dataset.theme === 'dark';
  body.dataset.theme = isDark ? 'light' : 'dark';
  localStorage.setItem('portfolio-theme', body.dataset.theme);
});

// ================================================================
// PARTICLES CANVAS
// ================================================================
function initParticles() {
  const canvas = $('#particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 80;
  const particles = Array.from({ length: COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.6 + 0.1
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    particles.forEach((p, i) => {
      particles.slice(i + 1).forEach(q => {
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(124,58,237,${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });
    });

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168,85,247,${p.alpha})`;
      ctx.fill();

      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// ================================================================
// TYPED ROLES
// ================================================================
function initTyped() {
  const el = $('#typed-role');
  if (!el) return;

  const roles = [
    'UI/UX Designer',
    'Front-End Developer',
    'Web Developer',
    'Problem Solver',
    'Staff Administrasi',
    'Informatika Graduate'
  ];

  let ri = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 80, SPEED_DEL = 40, PAUSE = 1800;

  function tick() {
    const word = roles[ri];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);

    if (!deleting && ci > word.length) {
      deleting = true;
      setTimeout(tick, PAUSE);
      return;
    }
    if (deleting && ci < 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
      ci = 0;
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  tick();
}

// ================================================================
// SCROLL REVEAL
// ================================================================
function initReveal() {
  const els = $$('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseFloat(e.target.style.getPropertyValue('--delay') || '0') * 1000;
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => obs.observe(el));
}

// ================================================================
// SKILL BARS ANIMATION
// ================================================================
function initSkillBars() {
  const bars = $$('.skill-progress');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
}

// ================================================================
// SKILL FILTER
// ================================================================
function initSkillFilter() {
  const filterBtns = $$('.filter-btn');
  const skillCards = $$('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      skillCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 200);
        }
      });
    });
  });
}

// ================================================================
// COUNTER ANIMATION (HERO STATS)
// ================================================================
function initCounters() {
  const counters = $$('.stat-num');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix ?? '';
      const isDecimal = target === 334; // special case for 3.34
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        if (isDecimal) {
          el.textContent = (eased * 3.34).toFixed(2);
        } else {
          el.textContent = Math.round(eased * target) + suffix;
        }
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

// ================================================================
// EDUCATION PROGRESS BARS
// ================================================================
function initEduBars() {
  const bars = $$('.edu-progress-bar');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animated');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
}

// ================================================================
// CONTACT FORM VALIDATION & SUBMISSION
// ================================================================
function initContactForm() {
  const form     = $('#contact-form');
  if (!form) return;

  const fields   = { name: 'name', email: 'email', subject: 'subject', message: 'message' };
  const submitBtn   = $('#submit-btn');
  const formSuccess = $('#form-success');

  function showError(field, msg) {
    const input = $(`#${field}`, form);
    const err   = $(`#${field}-error`, form);
    input.classList.add('error');
    if (err) err.textContent = msg;
  }
  function clearError(field) {
    const input = $(`#${field}`, form);
    const err   = $(`#${field}-error`, form);
    input.classList.remove('error');
    if (err) err.textContent = '';
  }

  // Live validation
  Object.keys(fields).forEach(f => {
    $(`#${f}`, form)?.addEventListener('input', () => clearError(f));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name    = $('#name', form).value.trim();
    const email   = $('#email', form).value.trim();
    const subject = $('#subject', form).value.trim();
    const message = $('#message', form).value.trim();

    if (!name)          { showError('name',    'Nama wajib diisi.'); valid = false; }
    if (!email)         { showError('email',   'Email wajib diisi.'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'Format email tidak valid.'); valid = false; }
    if (!subject)       { showError('subject', 'Subjek wajib diisi.'); valid = false; }
    if (!message)       { showError('message', 'Pesan wajib diisi.'); valid = false; }
    else if (message.length < 10) { showError('message', 'Pesan minimal 10 karakter.'); valid = false; }

    if (!valid) return;

    // Simulate send
    const btnText    = $('.btn-text', submitBtn);
    const btnLoading = $('.btn-loading', submitBtn);
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    submitBtn.disabled = true;

    setTimeout(() => {
      btnText.classList.remove('hidden');
      btnLoading.classList.add('hidden');
      submitBtn.disabled = false;
      form.reset();
      formSuccess.classList.remove('hidden');
      setTimeout(() => formSuccess.classList.add('hidden'), 5000);

      // Open default email client as fallback
      const mailBody = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\n${message}`);
      const mailSubject = encodeURIComponent(subject);
      window.location.href = `mailto:egavirga01@gmail.com?subject=${mailSubject}&body=${mailBody}`;
    }, 1600);
  });
}

// ================================================================
// BACK TO TOP
// ================================================================
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;
  btn.style.opacity = '0';
  btn.style.transition = 'opacity 0.3s, transform 0.3s, box-shadow 0.3s';
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ================================================================
// PROJECT CARD TILT EFFECT
// ================================================================
function initTilt() {
  $$('.project-card, .cert-card, .edu-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ================================================================
// FLOATING BADGES PARALLAX
// ================================================================
function initParallax() {
  const badges = $$('.floating-badge');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    badges.forEach((b, i) => {
      b.style.transform = `translateY(${scrolled * (0.05 + i * 0.02)}px)`;
    });
  });
}

// ================================================================
// INIT ALL
// ================================================================
function initAnimations() {
  initParticles();
  initTyped();
  initReveal();
  initSkillBars();
  initSkillFilter();
  initCounters();
  initEduBars();
  initContactForm();
  initBackToTop();
  initTilt();
  initParallax();
}
