// ===========================
// 1. Loading Screen
// ===========================
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 900);
});

// ===========================
// 2. Cursor Glow (smooth trailing follow)
// ===========================
const cursorGlow = document.getElementById('cursorGlow');
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (cursorGlow && supportsHover && !prefersReducedMotion) {
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let hasMoved = false;
  let rafId = null;

  const render = () => {
    // Ease toward the target position for a smooth trailing effect
    currentX += (targetX - currentX) * 0.15;
    currentY += (targetY - currentY) * 0.15;
    cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    rafId = requestAnimationFrame(render);
  };

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!hasMoved) {
      // Snap instantly on first move so it doesn't glide in from the center
      currentX = targetX;
      currentY = targetY;
      hasMoved = true;
    }
    cursorGlow.classList.add('active');
    if (!rafId) render();
  });

  // Hide only when the pointer actually leaves the browser viewport/window
  document.documentElement.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
  window.addEventListener('blur', () => cursorGlow.classList.remove('active'));
  document.addEventListener('mouseenter', () => { if (hasMoved) cursorGlow.classList.add('active'); });
}

// ===========================
// 3. Scroll Progress Bar + Sticky Navbar + Active Link + Timeline Fill + Parallax
// ===========================
const scrollProgress = document.getElementById('scrollProgress');
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const heroBg = document.getElementById('heroBg');
const timelineFill = document.getElementById('timelineFill');
const timelineEl = document.querySelector('.timeline');
const navLinkEls = document.querySelectorAll('.nav-link');
const sectionsForNav = document.querySelectorAll('main > section[id]');

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = progress + '%';

  navbar.classList.toggle('scrolled', scrollTop > 40);
  backToTop.classList.toggle('visible', scrollTop > 500);

  if (heroBg) {
    heroBg.style.transform = `translateY(${scrollTop * 0.25}px)`;
  }

  // Timeline fill based on visibility
  if (timelineEl) {
    const rect = timelineEl.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const visible = Math.min(Math.max(viewportH - rect.top, 0), rect.height);
    const pct = Math.min((visible / rect.height) * 100, 100);
    timelineFill.style.height = pct + '%';
  }

  // Active nav link
  let currentId = '';
  sectionsForNav.forEach((sec) => {
    const top = sec.offsetTop - 140;
    if (scrollTop >= top) currentId = sec.id;
  });
  navLinkEls.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
  });
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===========================
// 4. Mobile Menu
// ===========================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// ===========================
// 5. Typing Text Effect
// ===========================
const typingText = document.getElementById('typingText');
const words = ['interfaces.', 'experiences.', 'products.', 'ideas into code.'];
let wIndex = 0, cIndex = 0, deleting = false;

function typeLoop() {
  const word = words[wIndex];
  if (!deleting) {
    cIndex++;
    typingText.textContent = word.slice(0, cIndex);
    if (cIndex === word.length) { deleting = true; setTimeout(typeLoop, 1400); return; }
  } else {
    cIndex--;
    typingText.textContent = word.slice(0, cIndex);
    if (cIndex === 0) { deleting = false; wIndex = (wIndex + 1) % words.length; }
  }
  setTimeout(typeLoop, deleting ? 45 : 90);
}
typeLoop();

// ===========================
// 6. Scroll Reveal (IntersectionObserver)
// ===========================
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => revealObserver.observe(el));

// ===========================
// 7. Skill Rings
// ===========================
const skillItems = document.querySelectorAll('.skill-item');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const item = entry.target;
    const level = parseInt(item.dataset.level, 10);
    const ring = item.querySelector('.ring-fill');
    const pctLabel = item.querySelector('.skill-pct');
    const circumference = 264;
    const offset = circumference - (level / 100) * circumference;
    requestAnimationFrame(() => { ring.style.strokeDashoffset = offset; });

    let current = 0;
    const step = Math.max(1, Math.round(level / 40));
    const interval = setInterval(() => {
      current += step;
      if (current >= level) { current = level; clearInterval(interval); }
      pctLabel.textContent = current + '%';
    }, 25);

    skillObserver.unobserve(item);
  });
}, { threshold: 0.4 });
skillItems.forEach((item) => skillObserver.observe(item));

// ===========================
// 8. Animated Counters (Statistics)
// ===========================
const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    let current = 0;
    const step = Math.max(1, Math.round(target / 50));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      el.textContent = current;
    }, 30);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });
statNumbers.forEach((el) => statObserver.observe(el));

// ===========================
// 9. Testimonial Slider
// ===========================
const track = document.getElementById('testimonialTrack');
const dotsWrap = document.getElementById('testimonialDots');
const slides = track ? track.children.length : 0;
let currentSlide = 0;

if (track) {
  for (let i = 0; i < slides; i++) {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  }

  function goToSlide(i) {
    currentSlide = i;
    track.style.transform = `translateX(-${i * 100}%)`;
    [...dotsWrap.children].forEach((d, idx) => d.classList.toggle('active', idx === i));
  }

  let autoSlide = setInterval(() => {
    goToSlide((currentSlide + 1) % slides);
  }, 5000);

  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.parentElement.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => goToSlide((currentSlide + 1) % slides), 5000);
  });
}

// ===========================
// 10. Gallery Lightbox (Removed - Gallery replaced with Articles)
// ===========================

// ===========================
// 11. Ripple Button Effect
// ===========================
document.querySelectorAll('.ripple').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const circle = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    circle.className = 'ripple-circle';
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
    circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(circle);
    setTimeout(() => circle.remove(), 650);
  });
});

// ===========================
// 12. Contact Form (front-end only demo)
// ===========================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.textContent = 'Sending...';
    setTimeout(() => {
      formStatus.textContent = "Thanks! Your message has been noted. I'll get back to you soon.";
      submitBtn.textContent = 'Send Message';
      contactForm.reset();
    }, 900);
  });
}

// ===========================
// 13b. Project Filters
// ===========================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !match);
    });
  });
});

// ===========================
// 14. Footer year
// ===========================
document.getElementById('year').textContent = new Date().getFullYear();
