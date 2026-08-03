/* Sahil Makhamale — portfolio site JS
   Every feature checks its elements exist, so this one file runs on all pages. */

const BASE_URL = "https://sahilmakhamale.com";
const WHATSAPP_NUMBER = "917262854580"; // change here if your number changes

/* ---------- Mobile nav ---------- */
const burger = document.querySelector('.nav-burger');
if (burger) {
  burger.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
  });
}

/* ---------- Scroll reveal (with auto-stagger for grids) ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .1 });

// Auto-apply stagger classes to grid children
document.querySelectorAll('.work-grid, .svc-grid, .price-grid, .process-grid, .testimonials-grid, .capabilities-grid').forEach(grid => {
  grid.querySelectorAll('.reveal').forEach((el, i) => {
    el.classList.add('stagger-' + Math.min(i + 1, 6));
  });
});

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- Dual-audience toggle (home page only) ---------- */
const btnB = document.getElementById('btn-business');
const btnR = document.getElementById('btn-recruiter');
if (btnB && btnR) {
  const copy = {
    business: {
      eyebrow: "Web developer & app builder — Pune, India",
      title: 'Your business deserves to be <em>found, trusted, and booked</em> online.',
      sub: "I build fast, professional websites and apps for businesses in Pune and beyond — with WhatsApp booking, Google visibility, and designs your customers actually enjoy using. Delivered in days, not months.",
      ctaPrimary: { text: "Explore services", href: "services.html", external: false },
      ctaSecondary: { text: "See my work", href: "projects.html", external: false },
      facts: [
        { n: "4", l: "Live Client Sites" },
        { n: "7 days", l: "Typical Delivery" },
        { n: "Web · Mobile · AI · Data", l: "Full-Stack Range" },
        { n: "Pune & Remote", l: "Dedicated Support" }
      ]
    },
    recruiter: {
      eyebrow: "Full-Stack Engineer — Web · Mobile · AI · WebGL",
      title: 'I ship <em>production apps solo</em>, from WebGL to on-device LLMs.',
      sub: "Full-stack developer fluent in Next.js 15, React Native, Three.js/WebGL, Python analytics, and local LLMs (Ollama). Shipped live client platforms, offline-first AI apps, and data models — all built with clean, production-ready code.",
      ctaPrimary: { text: "View GitHub", href: "https://github.com/Sahil-886", external: true },
      ctaSecondary: { text: "Connect on LinkedIn", href: "https://linkedin.com/in/sahil-makhamale-440256248", external: true },
      facts: [
        { n: "6+", l: "Shipped Projects" },
        { n: "Next.js · RN · LLM", l: "Tech Stack Depth" },
        { n: "3D WebGL & Local AI", l: "Specialized Engineering" },
        { n: "B.Tech IT '27", l: "PCU Pune" }
      ]
    }
  };

  const els = {
    eyebrow: document.getElementById('hero-eyebrow'),
    title: document.getElementById('hero-title'),
    sub: document.getElementById('hero-sub'),
    ctaP: document.getElementById('cta-primary'),
    ctaS: document.getElementById('cta-secondary'),
    factsContainer: document.querySelector('.hero-facts')
  };

  function setAudience(mode, save = true) {
    if (!els.eyebrow || !els.title || !els.sub) return;

    if (save) {
      try { localStorage.setItem('portfolio_audience_mode', mode); } catch (e) {}
    }

    const heroInner = document.querySelector('.hero-inner');
    if (heroInner) {
      heroInner.style.transition = 'opacity 0.18s ease';
      heroInner.style.opacity = '0.4';
    }

    setTimeout(() => {
      const c = copy[mode];
      els.eyebrow.textContent = c.eyebrow;
      els.title.innerHTML = c.title;
      els.sub.textContent = c.sub;

      els.ctaP.textContent = c.ctaPrimary.text;
      els.ctaP.href = c.ctaPrimary.href;
      if (c.ctaPrimary.external) {
        els.ctaP.target = "_blank";
        els.ctaP.rel = "noopener";
      } else {
        els.ctaP.removeAttribute("target");
        els.ctaP.removeAttribute("rel");
      }

      els.ctaS.textContent = c.ctaSecondary.text;
      els.ctaS.href = c.ctaSecondary.href;
      if (c.ctaSecondary.external) {
        els.ctaS.target = "_blank";
        els.ctaS.rel = "noopener";
      } else {
        els.ctaS.removeAttribute("target");
        els.ctaS.removeAttribute("rel");
      }

      if (els.factsContainer && c.facts) {
        els.factsContainer.innerHTML = c.facts.map(f => `
          <div class="fact">
            <div class="n">${f.n}</div>
            <div class="l">${f.l}</div>
          </div>
        `).join('');
      }

      btnB.classList.toggle('active', mode === 'business');
      btnR.classList.toggle('active', mode === 'recruiter');
      btnB.setAttribute('aria-selected', mode === 'business');
      btnR.setAttribute('aria-selected', mode === 'recruiter');

      if (heroInner) {
        heroInner.style.opacity = '1';
      }
    }, 120);
  }

  // Restore saved audience or default to business
  let savedMode = 'business';
  try {
    const stored = localStorage.getItem('portfolio_audience_mode');
    if (stored === 'recruiter' || stored === 'business') savedMode = stored;
  } catch (e) {}

  setAudience(savedMode, false);

  btnB.addEventListener('click', () => setAudience('business'));
  btnR.addEventListener('click', () => setAudience('recruiter'));
}

/* ---------- WhatsApp enquiry modal (services page) ---------- */
const modal = document.getElementById('enquiry-modal');
if (modal) {
  const packageField = document.getElementById('enq-package');
  const openBtns = document.querySelectorAll('[data-package]');
  const closeBtn = modal.querySelector('.close');

  openBtns.forEach(btn => {
    const openModal = () => {
      packageField.value = btn.dataset.package;
      modal.classList.add('open');
      document.getElementById('enq-name').focus();
    };
    btn.addEventListener('click', openModal);
    btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); } });
  });
  function closeModal(){ modal.classList.remove('open'); }
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  document.getElementById('enq-send').addEventListener('click', () => {
    const name = document.getElementById('enq-name').value.trim();
    const business = document.getElementById('enq-business').value.trim();
    const pkg = packageField.value;
    const msg = document.getElementById('enq-message').value.trim();
    if (!name) { document.getElementById('enq-name').focus(); return; }
    let text = `Hi Sahil! I'm ${name}`;
    if (business) text += ` from ${business}`;
    text += `. I'm interested in the *${pkg}* package.`;
    if (msg) text += `\n\n${msg}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    closeModal();
  });
}

/* ---------- Project filtering (projects page) ---------- */
const filterBar = document.querySelector('.filter-bar');
if (filterBar) {
  const pills = filterBar.querySelectorAll('.filter-pill');
  const grid = document.getElementById('projects-grid');
  const cards = grid ? grid.querySelectorAll('.card[data-category]') : [];

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.dataset.filter;

      // Update active pill
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      // Filter cards with smooth transition
      cards.forEach(card => {
        const categories = card.dataset.category.split(' ');
        const show = filter === 'all' || categories.includes(filter);

        if (show) {
          card.classList.remove('filter-hidden');
          card.style.position = '';
        } else {
          card.classList.add('filter-hidden');
          // After fade out, collapse the space
          setTimeout(() => {
            if (card.classList.contains('filter-hidden')) {
              card.style.position = 'absolute';
            }
          }, 350);
        }
      });
    });
  });
}

/* ---------- Back to top button ---------- */
const bttBtn = document.getElementById('back-to-top');
if (bttBtn) {
  const showAfter = 400; // pixels scrolled before showing
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        bttBtn.classList.toggle('visible', window.scrollY > showAfter);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Three.js hero particle field (mobile-optimized & perf-focused) ---------- */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof THREE === 'undefined') return; // CDN failed — page works fine without it

  const isMobile = window.innerWidth < 768;
  const COUNT = isMobile ? 350 : 900;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 12;

  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 34;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xC9A96A, size: isMobile ? 0.055 : 0.045,
    transparent: true, opacity: 0.5, depthWrite: false
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  let mouseX = 0, mouseY = 0;
  if (!isMobile) {
    window.addEventListener('pointermove', e => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    }, { passive: true });
  }

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let heroVisible = true, raf = null;
  const heroIO = new IntersectionObserver(en => { heroVisible = en[0].isIntersecting; manage(); }, { threshold: 0 });
  const heroContainer = canvas.parentElement || document.body;
  heroIO.observe(heroContainer);
  document.addEventListener('visibilitychange', manage);

  function manage() {
    const shouldRun = heroVisible && !document.hidden;
    if (shouldRun && raf === null) loop();
    if (!shouldRun && raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }
  function loop() {
    points.rotation.y += 0.0008;
    points.rotation.x += 0.0002;
    camera.position.x += ((mouseX * 1.4) - camera.position.x) * 0.03;
    camera.position.y += ((-mouseY * 0.8) - camera.position.y) * 0.03;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  manage();
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(initHeroCanvas);
} else {
  window.addEventListener('load', () => setTimeout(initHeroCanvas, 150));
}
