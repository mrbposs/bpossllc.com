/* ============================================================
   BPOSS LLC — Marketing Website Scripts
   Vanilla JS, no dependencies
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Nav Shadow on Scroll ──────────────────────────────── */
  const nav = document.getElementById('site-nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load in case page is pre-scrolled
  }

  /* ── 2. Mobile Nav Drawer Toggle ──────────────────────────── */
  const burger = document.getElementById('nav-burger');
  const drawer = document.getElementById('nav-drawer');

  if (burger && drawer) {
    burger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on any drawer link click
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        burger.focus();
      }
    });
  }

  /* ── 3. Smooth Scroll (all anchor links) ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 68;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  });

  /* ── 4. Scroll-Triggered Reveal Animations ───────────────── */
  const animateEls = document.querySelectorAll('.animate-on-scroll');

  if (animateEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    animateEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything if IntersectionObserver not supported
    animateEls.forEach(el => el.classList.add('visible'));
  }

  /* ── 5. Scroll Spy — Active Nav Link ─────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-35% 0px -60% 0px' }
    );
    sections.forEach(s => spyObserver.observe(s));
  }

  /* ── 6. Animated Stat Counters (Hero) ────────────────────── */
  const counterEls = document.querySelectorAll('[data-target]');

  if (counterEls.length && 'IntersectionObserver' in window) {
    const animateCounter = el => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const startTime = performance.now();

      const tick = now => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* ── 7. Contact Form Validation ──────────────────────────── */
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    const requiredFields = [
      { id: 'name',    errorId: 'name-error',    label: 'Full name is required.' },
      { id: 'email',   errorId: 'email-error',   label: 'Email address is required.' },
      { id: 'company', errorId: 'company-error', label: 'Practice or company name is required.' },
      { id: 'message', errorId: 'message-error', label: 'Please describe how we can help.' },
    ];

    const showError = (field, errorEl, msg) => {
      field.classList.add('error');
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
      }
    };

    const clearError = (field, errorEl) => {
      field.classList.remove('error');
      if (errorEl) errorEl.style.display = 'none';
    };

    // Live clear-on-input
    requiredFields.forEach(({ id, errorId }) => {
      const field = document.getElementById(id);
      const errorEl = document.getElementById(errorId);
      if (field) {
        field.addEventListener('input', () => clearError(field, errorEl));
        field.addEventListener('change', () => clearError(field, errorEl));
      }
    });

    form.addEventListener('submit', function (e) {
      let isValid = true;

      requiredFields.forEach(({ id, errorId, label }) => {
        const field = document.getElementById(id);
        const errorEl = document.getElementById(errorId);
        if (!field) return;

        const value = field.value.trim();

        if (!value) {
          showError(field, errorEl, label);
          isValid = false;
        } else if (id === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
          if (!emailRegex.test(value)) {
            showError(field, errorEl, 'Please enter a valid email address.');
            isValid = false;
          } else {
            clearError(field, errorEl);
          }
        } else {
          clearError(field, errorEl);
        }
      });

      if (!isValid) {
        e.preventDefault();
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
          const navHeight = nav ? nav.offsetHeight : 68;
          const top = firstError.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          window.scrollTo({ top, behavior: 'smooth' });
          firstError.focus();
        }
        return;
      }

      // If Formspree ID hasn't been set, show demo success state
      const action = form.getAttribute('action') || '';
      if (action.includes('YOUR_FORM_ID')) {
        e.preventDefault();
        if (formSuccess) {
          form.style.display = 'none';
          formSuccess.style.display = 'block';
        }
      }
      // Otherwise, Formspree handles the real POST submission natively
    });
  }

  /* ── 8. Passive touch scroll fix for mobile drawer ───────── */
  if (drawer) {
    drawer.addEventListener('touchmove', e => {
      e.stopPropagation();
    }, { passive: true });
  }

})();
