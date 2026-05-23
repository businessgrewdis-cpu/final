/* ============================================
   GREWDIS - script.js
   All JavaScript for animations & interactions
   ============================================ */

/* =============================================
   1. CUSTOM CURSOR
   ============================================= */
const cursorOuter = document.querySelector('.cursor-outer');
const cursorInner = document.querySelector('.cursor-inner');
let mouseX = 0, mouseY = 0;
let outerX = 0, outerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorInner.style.left = mouseX + 'px';
  cursorInner.style.top  = mouseY + 'px';
});

// Smooth trailing cursor
function animateCursor() {
  outerX += (mouseX - outerX) * 0.12;
  outerY += (mouseY - outerY) * 0.12;
  if (cursorOuter) {
    cursorOuter.style.left = outerX + 'px';
    cursorOuter.style.top  = outerY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Scale cursor on hover over links/buttons
document.querySelectorAll('a, button, .service-card, .creator-card, .gallery-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursorOuter) cursorOuter.style.transform = 'translate(-50%,-50%) scale(1.8)';
    if (cursorInner) cursorInner.style.transform = 'translate(-50%,-50%) scale(0.5)';
  });
  el.addEventListener('mouseleave', () => {
    if (cursorOuter) cursorOuter.style.transform = 'translate(-50%,-50%) scale(1)';
    if (cursorInner) cursorInner.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

/* =============================================
   2. PARTICLE CANVAS (Cyberpunk)
   ============================================= */
const canvas = document.getElementById('particles');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
const PARTICLE_COUNT = 80;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size   = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.6;
    this.speedY = (Math.random() - 0.5) * 0.6;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color  = Math.random() > 0.6
      ? `rgba(0,255,136,${this.opacity})`
      : Math.random() > 0.5
        ? `rgba(123,47,190,${this.opacity})`
        : `rgba(0,245,255,${this.opacity})`;
    this.pulse  = Math.random() * Math.PI * 2;
    this.pulseSpeed = Math.random() * 0.02 + 0.01;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.pulse += this.pulseSpeed;
    if (this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    const s = this.size + Math.sin(this.pulse) * 0.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, s, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Connection lines between close particles
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        const alpha = (1 - dist / 120) * 0.12;
        ctx.strokeStyle = `rgba(123,47,190,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function initParticles() {
  if (!canvas || !ctx) return;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

/* =============================================
   3. ANIMATED GRADIENT BLUR BACKGROUND
   (Applied via floating orbs in CSS +
    a secondary canvas layer for gradient blur)
   ============================================= */
// Smooth animated gradient overlay on hero
const hero = document.querySelector('.hero');
let gradientAngle = 0;
function animateHeroGradient() {
  gradientAngle += 0.3;
  if (hero) {
    const r = 120 + Math.sin(gradientAngle * Math.PI / 180) * 30;
    const g = 0;
    const b = 200 + Math.cos(gradientAngle * Math.PI / 180) * 50;
    // We let CSS handle most of this; JS augments glow positions
  }
  requestAnimationFrame(animateHeroGradient);
}
animateHeroGradient();

/* =============================================
   4. NAVBAR — SCROLL BEHAVIOR
   ============================================= */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  // Navbar style on scroll
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Show scroll-to-top button
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }

  // Active nav link highlight
  updateActiveNav();

  // Trigger stat bar fills when in view
  triggerStatBars();
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(sec => {
    const top    = sec.offsetTop - 100;
    const bottom = top + sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// Scroll to top
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =============================================
   5. HAMBURGER MENU
   ============================================= */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

/* =============================================
   6. SCROLL REVEAL ANIMATIONS
   ============================================= */
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger animations for grid children
      const parent = entry.target.closest('.services-grid, .stats-grid, .creators-grid, .about-card-stack, .blog-side');
      if (parent) {
        const siblings = parent.querySelectorAll('.reveal');
        siblings.forEach((el, idx) => {
          setTimeout(() => {
            el.classList.add('visible');
          }, idx * 120);
        });
      } else {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 100);
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* =============================================
   7. COUNTER ANIMATION (Hero + Stats)
   ============================================= */
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

// Hero counters
const heroNums = document.querySelectorAll('.h-num');
let heroCountersDone = false;
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !heroCountersDone) {
      heroCountersDone = true;
      heroNums.forEach(num => {
        const target = parseInt(num.dataset.target);
        animateCounter(num, target, 2200);
      });
    }
  });
}, { threshold: 0.5 });
const heroSection = document.querySelector('.hero-stats');
if (heroSection) heroObserver.observe(heroSection);

// Stats section counters
const statCounts = document.querySelectorAll('.count');
let statCountersDone = false;
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statCountersDone) {
      statCountersDone = true;
      statCounts.forEach(count => {
        const target = parseInt(count.dataset.target);
        animateCounter(count, target, 2000);
      });
    }
  });
}, { threshold: 0.3 });
const statsSection = document.querySelector('.stats-grid');
if (statsSection) statsObserver.observe(statsSection);

/* =============================================
   8. STAT BAR FILL ANIMATION
   ============================================= */
let statBarsDone = false;
function triggerStatBars() {
  if (statBarsDone) return;
  const statsGrid = document.querySelector('.stats-grid');
  if (!statsGrid) return;
  const rect = statsGrid.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.8) {
    statBarsDone = true;
    document.querySelectorAll('.stat-fill').forEach(bar => {
      bar.style.width = bar.style.width; // trigger CSS transition
    });
  }
}

/* =============================================
   9. CONTACT FORM SUBMISSION
   ============================================= */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    // Simulate async submission (replace with real backend/EmailJS)
    setTimeout(() => {
      contactForm.reset();
      btn.textContent = 'Send Message ✉';
      btn.disabled = false;
      if (formSuccess) {
        formSuccess.style.display = 'block';
        setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
      }
    }, 1500);
  });
}

/* =============================================
   10. TYPING EFFECT on Hero
   ============================================= */
const typingWords = ['BRAND', 'STORY', 'REACH', 'GROWTH'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.querySelector('.hero-title .line-2');

function typeEffect() {
  if (!typingEl) return;
  const current = typingWords[wordIndex];
  if (isDeleting) {
    typingEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }
  if (!isDeleting && charIndex === current.length) {
    setTimeout(() => { isDeleting = true; typeEffect(); }, 2000);
    return;
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % typingWords.length;
  }
  const speed = isDeleting ? 80 : 130;
  setTimeout(typeEffect, speed);
}
// Typing animation disabled — hero title is static "STORY"
// setTimeout(typeEffect, 3000);

/* =============================================
   11. PARALLAX on HERO GLOW ORBS
   ============================================= */
const glows = document.querySelectorAll('.hero-glow');
window.addEventListener('mousemove', (e) => {
  const xRatio = (e.clientX / window.innerWidth - 0.5) * 40;
  const yRatio = (e.clientY / window.innerHeight - 0.5) * 40;
  glows.forEach((glow, i) => {
    const factor = (i + 1) * 0.4;
    glow.style.transform = `translate(${xRatio * factor}px, ${yRatio * factor}px)`;
  });
});

/* =============================================
   12. GALLERY ITEM TILT EFFECT
   ============================================= */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    item.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.03)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

/* =============================================
   13. SERVICE CARD NEON BORDER FOLLOW
   ============================================= */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,255,136,0.07) 0%, rgba(30,0,60,0.6) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* =============================================
   14. CREATOR CARD GLITCH on HOVER (name)
   ============================================= */
document.querySelectorAll('.creator-card h4').forEach(name => {
  name.addEventListener('mouseenter', () => {
    name.style.animation = 'none';
    name.style.textShadow = '2px 0 #00FF88, -2px 0 #FF006E';
    setTimeout(() => {
      name.style.textShadow = '';
    }, 300);
  });
});

/* =============================================
   15. SMOOTH SECTION ENTRANCE with delay stagger
   ============================================= */
document.querySelectorAll('.services-grid .service-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});
document.querySelectorAll('.stats-grid .stat-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});
document.querySelectorAll('.creators-grid .creator-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
});
document.querySelectorAll('.gallery-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.07}s`;
});

/* =============================================
   16. GLITCH FLICKER on Logo Text
   ============================================= */
const logoTexts = document.querySelectorAll('.logo-text, .footer-logo-text');
function glitchFlicker(el) {
  const original = el.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
  let iteration = 0;
  const interval = setInterval(() => {
    el.textContent = original.split('').map((char, i) => {
      if (i < iteration) return char;
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    if (iteration >= original.length) clearInterval(interval);
    iteration += 0.4;
  }, 40);
}
logoTexts.forEach(el => {
  el.addEventListener('mouseenter', () => glitchFlicker(el));
});

/* =============================================
   17. PAGE LOAD — Entry Animation Trigger
   ============================================= */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  // Trigger stat fills for any already-visible stats
  setTimeout(triggerStatBars, 500);
});

console.log('%c GREWDIS 🚀 ', 'background:#7B2FBE;color:#00FF88;font-size:20px;font-weight:bold;padding:8px 16px;border-radius:4px;');
console.log('%c Built with 💜 in Patna, Bihar', 'color:#C0B8D4;font-size:12px;');
