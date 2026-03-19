'use strict';

// ─── HEADER SCROLL ────────────────────────────────────────────────
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });
}

// ─── HAMBURGER / MOBILE NAV ───────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('mainNav');

if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));
  document.addEventListener('click', e => {
    if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && !hamburger.contains(e.target)) {
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ─── ACTIVE NAV ───────────────────────────────────────────────────
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('nav-active');
  });
})();

// ─── FAQ ACCORDION ────────────────────────────────────────────────
document.querySelectorAll('.faq-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ─── REVEAL ON SCROLL ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

document.querySelectorAll(
  '.reveal, .svc-card, .testi-card, .industry-card, .value-card, ' +
  '.faq-item, .process-item, .metric, .ci-item, .ind-card, .platform-pill'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ─── COUNTER ANIMATION ────────────────────────────────────────────
function countUp(el) {
  const text   = el.dataset.count || el.textContent.trim();
  const prefix = text.match(/^[^\d]*/)?.[0] || '';
  const suffix = text.match(/[^\d]*$/)?.[0] || '';
  const target = parseInt(text.replace(/\D/g, ''), 10);
  if (isNaN(target)) return;

  const dur  = 1800;
  const ease = t => 1 - Math.pow(1 - t, 3.5);
  let start  = null;

  function frame(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    el.textContent = prefix + Math.round(ease(p) * target) + suffix;
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = prefix + target + suffix;
  }
  requestAnimationFrame(frame);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.metric-num, .hero-stat .num, .rstat .big, .about-img-badge .big')
  .forEach(el => { if (/\d/.test(el.textContent)) counterObs.observe(el); });

// ─── LAZY IMAGES ──────────────────────────────────────────────────
if ('IntersectionObserver' in window) {
  const lazyObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
        lazyObs.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px' });
  document.querySelectorAll('img[data-src]').forEach(img => lazyObs.observe(img));
}

// ─── SMOOTH ANCHOR SCROLL ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) {
      e.preventDefault();
      const top = t.getBoundingClientRect().top + scrollY - 82;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── ANALYTICS: Phone & Email clicks ──────────────────────────────
document.querySelectorAll('a[href^="tel:"]').forEach(a => {
  a.addEventListener('click', () => {
    if (typeof gtag === 'function') gtag('event', 'phone_click', {
      event_category: 'engagement',
      event_label: a.href,
      value: 1
    });
  });
});

document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
  a.addEventListener('click', () => {
    if (typeof gtag === 'function') gtag('event', 'email_click', {
      event_category: 'engagement',
      event_label: a.href
    });
  });
});

// ─── ANALYTICS: Sticky Call button ────────────────────────────────
document.querySelectorAll('.sticky-call').forEach(a => {
  a.addEventListener('click', () => {
    if (typeof gtag === 'function') gtag('event', 'sticky_call_click', {
      event_category: 'engagement',
      event_label: 'Sticky Call Float Button',
      value: 1
    });
  });
});

// ─── ANALYTICS: CTA button clicks ─────────────────────────────────
document.querySelectorAll('.btn-gold, .btn-nav, [class*="cta"]').forEach(btn => {
  btn.addEventListener('click', () => {
    const label = btn.textContent.trim().substring(0, 50);
    if (typeof gtag === 'function') gtag('event', 'cta_click', {
      event_category: 'engagement',
      event_label: label
    });
  });
});

// ─── ANALYTICS: Form submissions ──────────────────────────────────
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', () => {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; btn.style.opacity = '0.65'; }
    if (typeof gtag === 'function') gtag('event', 'form_submit', {
      event_category: 'lead',
      event_label: document.title,
      value: 1
    });
  });
});

// ─── ANALYTICS: Scroll depth tracking ────────────────────────────
(function () {
  const depths = [25, 50, 75, 90];
  const fired  = new Set();
  window.addEventListener('scroll', () => {
    const pct = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    depths.forEach(d => {
      if (pct >= d && !fired.has(d)) {
        fired.add(d);
        if (typeof gtag === 'function') gtag('event', 'scroll_depth', {
          event_category: 'engagement',
          event_label: d + '%',
          non_interaction: true
        });
      }
    });
  }, { passive: true });
})();

// ─── ANALYTICS: Time on page (30s, 60s, 120s milestones) ─────────
(function () {
  const milestones = [30, 60, 120];
  milestones.forEach(sec => {
    setTimeout(() => {
      if (typeof gtag === 'function') gtag('event', 'time_on_page', {
        event_category: 'engagement',
        event_label: sec + 's',
        non_interaction: true
      });
    }, sec * 1000);
  });
})();

// ─── ANALYTICS: Outbound link clicks ──────────────────────────────
document.querySelectorAll('a[href^="http"]').forEach(a => {
  try {
    if (new URL(a.href).hostname !== location.hostname) {
      a.addEventListener('click', () => {
        if (typeof gtag === 'function') gtag('event', 'outbound_click', {
          event_category: 'engagement',
          event_label: a.href
        });
      });
    }
  } catch(e) {}
});

// ─── ANALYTICS: Map / directions click ────────────────────────────
document.querySelectorAll('a[href*="maps.google"]').forEach(a => {
  a.addEventListener('click', () => {
    if (typeof gtag === 'function') gtag('event', 'directions_click', {
      event_category: 'engagement',
      event_label: 'Google Maps directions'
    });
  });
});

// ─── PERF MARK ────────────────────────────────────────────────────
if (window.performance?.mark) window.performance.mark('app_ready');
