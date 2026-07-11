/* Sahil Makhamale — portfolio site JS
   Every feature checks its elements exist, so this one file runs on all pages. */

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
document.querySelectorAll('.work-grid, .svc-grid, .price-grid, .process-grid, .testimonials-grid').forEach(grid => {
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
      ctaPrimary: { text: "Explore services", href: "services.html" },
      ctaSecondary: { text: "See my work", href: "projects.html" }
    },
    recruiter: {
      eyebrow: "Developer & analyst — Web · React Native · LLM · Data",
      title: 'I ship <em>real products</em>, not just coursework.',
      sub: "Freelance developer with live client work, self-built products, and hands-on data experience: an AI companion app running a local LLM, a travel platform redesign, churn analysis internship work, and the Uber x upGrad forecasting mentorship — all while completing my B.Tech.",
      ctaPrimary: { text: "View my projects", href: "projects.html" },
      ctaSecondary: { text: "Get in touch", href: "#contact" }
    }
  };
  const els = {
    eyebrow: document.getElementById('hero-eyebrow'),
    title: document.getElementById('hero-title'),
    sub: document.getElementById('hero-sub'),
    ctaP: document.getElementById('cta-primary'),
    ctaS: document.getElementById('cta-secondary'),
  };
  function setAudience(mode) {
    const c = copy[mode];
    els.eyebrow.textContent = c.eyebrow;
    els.title.innerHTML = c.title;
    els.sub.textContent = c.sub;
    els.ctaP.textContent = c.ctaPrimary.text; els.ctaP.href = c.ctaPrimary.href;
    els.ctaS.textContent = c.ctaSecondary.text; els.ctaS.href = c.ctaSecondary.href;
    btnB.classList.toggle('active', mode === 'business');
    btnR.classList.toggle('active', mode === 'recruiter');
    btnB.setAttribute('aria-selected', mode === 'business');
    btnR.setAttribute('aria-selected', mode === 'recruiter');
  }
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
    btn.addEventListener('click', () => {
      packageField.value = btn.dataset.package;
      modal.classList.add('open');
      document.getElementById('enq-name').focus();
    });
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

/* ---------- Three.js hero particle field (home page, mobile-optimized) ---------- */
window.addEventListener('load', function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof THREE === 'undefined') return; // CDN failed — page works fine without it

  const hero = canvas.parentElement;
  const isMobile = window.innerWidth < 768;
  const COUNT = isMobile ? 420 : 1200;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5));

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
    color: 0xC9A96A, size: isMobile ? 0.06 : 0.05,
    transparent: true, opacity: 0.55, depthWrite: false
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
  window.addEventListener('resize', resize);

  let heroVisible = true, raf = null;
  const heroIO = new IntersectionObserver(en => { heroVisible = en[0].isIntersecting; manage(); }, { threshold: 0 });
  heroIO.observe(document.body);
  document.addEventListener('visibilitychange', manage);

  function manage() {
    const shouldRun = heroVisible && !document.hidden;
    if (shouldRun && raf === null) loop();
    if (!shouldRun && raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }
  function loop() {
    points.rotation.y += 0.0009;
    points.rotation.x += 0.0003;
    camera.position.x += ((mouseX * 1.6) - camera.position.x) * 0.03;
    camera.position.y += ((-mouseY * 1.0) - camera.position.y) * 0.03;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  manage();
});
