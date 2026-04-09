/* =============================================
   BANAPPANAKATTI GANESH — PORTFOLIO JAVASCRIPT
   Features: Bubble cursor, scroll effects,
   nav highlight, form handling, animations
   ============================================= */

'use strict';

/* ============================================
   1. BUBBLE CURSOR
   ============================================ */
(function initBubbleCursor() {
  const canvas = document.getElementById('bubble-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  let mouseX = -200, mouseY = -200;

  canvas.width = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (Math.random() < 0.35) spawnBubble(mouseX, mouseY);
  });

  // Cursor dot
  const cursorDot = { x: -200, y: -200, targetX: -200, targetY: -200 };
  window.addEventListener('mousemove', (e) => {
    cursorDot.targetX = e.clientX;
    cursorDot.targetY = e.clientY;
  });

  // Bubbles pool
  const bubbles = [];

  function spawnBubble(x, y) {
    bubbles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 1.8,
      vy: -(Math.random() * 2.5 + 0.8),
      radius: Math.random() * 14 + 4,
      opacity: Math.random() * 0.4 + 0.25,
      life: 0,
      maxLife: Math.random() * 60 + 50,
      hue: Math.random() * 30 + 185, // cyan-blue range
    });
  }

  function drawCursorDot() {
    // Smooth follow
    cursorDot.x += (cursorDot.targetX - cursorDot.x) * 0.18;
    cursorDot.y += (cursorDot.targetY - cursorDot.y) * 0.18;

    if (cursorDot.x < 0) return;

    // Outer ring
    ctx.beginPath();
    ctx.arc(cursorDot.x, cursorDot.y, 18, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 180, 216, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner dot
    ctx.beginPath();
    ctx.arc(cursorDot.targetX, cursorDot.targetY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 180, 216, 0.9)';
    ctx.fill();
  }

  function drawBubble(b) {
    const progress = b.life / b.maxLife;
    const alpha = b.opacity * (1 - progress);
    const r = b.radius * (0.5 + progress * 0.5);

    ctx.beginPath();
    ctx.arc(b.x, b.y, r, 0, Math.PI * 2);

    // Gradient fill
    const grad = ctx.createRadialGradient(
      b.x - r * 0.3, b.y - r * 0.3, r * 0.1,
      b.x, b.y, r
    );
    grad.addColorStop(0, `hsla(${b.hue}, 90%, 75%, ${alpha * 0.7})`);
    grad.addColorStop(0.7, `hsla(${b.hue}, 80%, 55%, ${alpha * 0.2})`);
    grad.addColorStop(1, `hsla(${b.hue}, 70%, 50%, 0)`);

    ctx.fillStyle = grad;
    ctx.fill();

    // Rim highlight
    ctx.beginPath();
    ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${b.hue}, 90%, 80%, ${alpha * 0.5})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Specular
    ctx.beginPath();
    ctx.arc(b.x - r * 0.3, b.y - r * 0.3, r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(0, 0%, 100%, ${alpha * 0.55})`;
    ctx.fill();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    // Update & draw bubbles
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy -= 0.02; // slight upward acceleration
      b.life++;

      if (b.life >= b.maxLife || b.opacity <= 0) {
        bubbles.splice(i, 1);
        continue;
      }
      drawBubble(b);
    }

    drawCursorDot();
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ============================================
   2. NAVBAR SCROLL BEHAVIOUR
   ============================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Sticky style
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger mobile menu
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
  });

  // Close menu on link click
  navLinksContainer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksContainer.classList.remove('open');
    });
  });
})();

/* ============================================
   3. SCROLL-TRIGGERED REVEAL ANIMATIONS
   ============================================ */
(function initReveal() {
  // Add reveal class to all major cards/blocks
  const targets = [
    '.skill-category',
    '.project-card',
    '.achievement-card',
    '.contact-item',
    '.contact-form',
    '.stat-card',
    '.about-text > p',
  ];

  targets.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      if (i < 4) el.classList.add(`reveal-delay-${i + 1}`);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();

/* ============================================
   4. TIMELINE ITEMS REVEAL
   ============================================ */
(function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  const fills = document.querySelectorAll('.score-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Also animate score fills inside this item
          entry.target.querySelectorAll('.score-fill').forEach((fill) => {
            fill.classList.add('animate');
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach((item) => observer.observe(item));
})();

/* ============================================
   5. HERO SECTION PARALLAX ORBS
   ============================================ */
(function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('mousemove', (e) => {
    const xPct = (e.clientX / window.innerWidth - 0.5);
    const yPct = (e.clientY / window.innerHeight - 0.5);
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 12;
      orb.style.transform = `translate(${xPct * depth}px, ${yPct * depth}px)`;
    });
  });
})();

/* ============================================
   6. CONTACT FORM
   ============================================ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit');

  if (!form) return;

  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `form-status show ${type}`;
  }

  function hideStatus() {
    statusEl.className = 'form-status';
    statusEl.textContent = '';
  }

  function setLoading(loading) {
    const textEl = submitBtn.querySelector('.btn-text');
    const iconEl = submitBtn.querySelector('.btn-icon');
    if (loading) {
      textEl.textContent = 'Sending…';
      iconEl.textContent = '⏳';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
    } else {
      textEl.textContent = 'Send Message';
      iconEl.textContent = '→';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideStatus();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    // Validation
    if (!name) { showStatus('Please enter your name.', 'error'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }
    if (!message) { showStatus('Please enter a message.', 'error'); return; }

    setLoading(true);

    // Simulate sending (mailto fallback since no backend is configured)
    await new Promise((res) => setTimeout(res, 1000));

    const subject = encodeURIComponent(
      document.getElementById('form-subject').value.trim() || `Portfolio Contact from ${name}`
    );
    const body = encodeURIComponent(
      `Hi Ganesh,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    const mailtoUrl = `mailto:bganeshbganesh2424@gmail.com?subject=${subject}&body=${body}`;

    // Open mailto
    window.location.href = mailtoUrl;

    setLoading(false);
    showStatus('✅ Opening your email client… Thank you for reaching out!', 'success');
    form.reset();

    setTimeout(hideStatus, 5000);
  });
})();

/* ============================================
   7. NUMBER COUNTER ANIMATION (Stats)
   ============================================ */
(function initCounters() {
  const stats = [
    { id: 'stat-gpa',  target: 8.28,  decimals: 2, suffix: '' },
    { id: 'stat-puc',  target: 94.33, decimals: 2, suffix: '%' },
    { id: 'stat-10th', target: 93.92, decimals: 2, suffix: '%' },
  ];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const stat = stats.find((s) => s.id === entry.target.id);
        if (!stat) return;

        const valEl = entry.target.querySelector('.stat-value');
        if (!valEl) return;

        let start = 0;
        const duration = 1400;
        const startTime = performance.now();

        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const current = (stat.target * ease).toFixed(stat.decimals);
          valEl.textContent = current + stat.suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((s) => {
    const el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });
})();

/* ============================================
   8. SMOOTH ACTIVE-SECTION UNDERLINE INDICATOR
   ============================================ */
(function initSectionIndicator() {
  // Add subtle typing cursor effect to hero tagline
  const tagline = document.querySelector('.hero-tagline');
  if (!tagline) return;

  const text = tagline.textContent;
  tagline.textContent = '';
  tagline.style.borderRight = '2px solid rgba(0,180,216,0.7)';

  let i = 0;
  function type() {
    if (i <= text.length) {
      tagline.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 38);
    } else {
      // Blink cursor briefly then remove
      let blinks = 0;
      const blink = setInterval(() => {
        tagline.style.borderRightColor = blinks % 2 === 0
          ? 'rgba(0,180,216,0.7)'
          : 'transparent';
        blinks++;
        if (blinks > 6) {
          clearInterval(blink);
          tagline.style.borderRight = 'none';
        }
      }, 450);
    }
  }

  // Start typing after hero animations complete
  setTimeout(type, 900);
})();

/* ============================================
   9. SKILL PILL HOVER RIPPLE
   ============================================ */
(function initPillRipple() {
  document.querySelectorAll('.pill').forEach((pill) => {
    pill.addEventListener('click', (e) => {
      const rect = pill.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        border-radius:50%;background:rgba(0,180,216,0.25);
        top:${e.clientY - rect.top - size / 2}px;
        left:${e.clientX - rect.left - size / 2}px;
        transform:scale(0);animation:rippleAnim 0.5s ease;
        pointer-events:none;
      `;
      pill.style.position = 'relative';
      pill.style.overflow = 'hidden';
      pill.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `@keyframes rippleAnim{to{transform:scale(2.5);opacity:0}}`;
  document.head.appendChild(style);
})();

/* ============================================
   10. EASTER EGG — KONAMI CODE
   ============================================ */
(function initEasterEgg() {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key === code[idx]) {
      idx++;
      if (idx === code.length) {
        idx = 0;
        // Launch bubble burst
        const canvas = document.getElementById('bubble-canvas');
        if (!canvas) return;
        // Dispatch fake mousemove events across screen
        let t = 0;
        const interval = setInterval(() => {
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * window.innerHeight;
          window.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: y }));
          t++;
          if (t > 80) clearInterval(interval);
        }, 25);
        // Show fun message
        const msg = document.createElement('div');
        msg.textContent = '🌊 Ocean mode activated! Keep building amazing things, Ganesh!';
        msg.style.cssText = `
          position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);
          background:rgba(0,180,216,0.15);border:1px solid rgba(0,180,216,0.4);
          color:#48cae4;padding:0.75rem 1.5rem;border-radius:999px;
          font-family:Outfit,sans-serif;font-size:0.9rem;font-weight:600;
          z-index:10000;animation:fadeInUp 0.5s ease;backdrop-filter:blur(12px);
          white-space:nowrap;
        `;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 4000);
      }
    } else {
      idx = 0;
    }
  });
})();
