/* ========================================
   Portfolio — Sichu Maharjan
   Main JS — no dependencies
   ======================================== */

(function () {
  'use strict';

  // ---- DOM refs ----
  const nav        = document.querySelector('.nav');
  const navToggle  = document.querySelector('.nav-toggle');
  const navLinks   = document.querySelector('.nav-links');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections   = document.querySelectorAll('section[id]');
  const reveals    = document.querySelectorAll('.reveal');
  const form       = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  // ---- Mobile menu toggle ----
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navLinks.classList.toggle('open', !open);
    });

    // Close menu when a nav link is clicked
    navAnchors.forEach(function (a) {
      a.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
      });
    });
  }

  // ---- Scroll-based nav background ----
  function handleNavScroll() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Active nav link highlighting ----
  if (sections.length && navAnchors.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navAnchors.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, {
      rootMargin: '-40% 0px -55% 0px'
    });

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  // ---- Scroll-reveal animations ----
  if (reveals.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  // ---- Contact form submission ----
  if (form && formStatus) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var action = form.getAttribute('action');

      // Check if Formspree is configured
      if (!action || action.indexOf('YOUR_FORM_ID') !== -1) {
        formStatus.textContent = 'Form endpoint not configured yet. Please email me directly.';
        formStatus.className = 'form-status error';
        return;
      }

      var data = new FormData(form);
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending...';

      fetch(action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          formStatus.textContent = 'Message sent! I\'ll get back to you soon.';
          formStatus.className = 'form-status success';
          form.reset();
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(function () {
        formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
        formStatus.className = 'form-status error';
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = 'Send Message';
      });
    });
  }

})();
