/**
 * NovaTech — Interactive Fixed Navigation Menu & Dynamic Webpage
 * Task 1: Responsive Webpage with Dynamic Navigation Bar
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('header');
  const navMenu = document.getElementById('nav-menu');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Simulator Elements
  const simTopBtn = document.getElementById('sim-top');
  const simScrolledBtn = document.getElementById('sim-scrolled');
  const navStateText = document.getElementById('nav-state-text');

  // Contact Form Elements
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  // Showcase Filter Elements
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  /* ==========================================================================
     1. SCROLL LISTENER — DYNAMIC NAVBAR STATE CHANGE
     ========================================================================== */
  const SCROLL_THRESHOLD = 50; // pixels to trigger scrolled state
  let isTicking = false;

  function updateNavbarOnScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > SCROLL_THRESHOLD) {
      if (!header.classList.contains('scrolled')) {
        header.classList.add('scrolled');
        updateSimState(true);
      }
    } else {
      if (header.classList.contains('scrolled')) {
        header.classList.remove('scrolled');
        updateSimState(false);
      }
    }
  }

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        updateNavbarOnScroll();
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  // Initial check on load
  updateNavbarOnScroll();

  /* ==========================================================================
     2. SCROLLSPY — ACTIVE LINK HIGHLIGHTING
     ========================================================================== */
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the active viewing zone
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        setActiveNavLink(id);
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  function setActiveNavLink(sectionId) {
    navLinks.forEach((link) => {
      const linkHref = link.getAttribute('href');
      if (linkHref === `#${sectionId}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /* ==========================================================================
     3. MOBILE NAVIGATION DRAWER & ACCESSIBILITY
     ========================================================================== */
  function toggleMobileMenu() {
    const isOpen = navMenu.classList.toggle('open');
    mobileToggle.classList.toggle('active', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    if (isOpen) {
      document.body.style.overflowY = 'hidden'; // Prevent background scrolling when menu open
    } else {
      document.body.style.overflowY = '';
    }
  }

  function closeMobileMenu() {
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflowY = '';
    }
  }

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });

  // Close menu when clicking nav links
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && navMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     4. DARK / LIGHT THEME TOGGLE
     ========================================================================== */
  // Load saved preference or default to dark
  const savedTheme = localStorage.getItem('novatech_theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('novatech_theme', newTheme);

    // Provide tactile feedback animation
    themeToggle.style.transform = 'scale(0.85) rotate(90deg)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 200);
  });

  /* ==========================================================================
     5. HERO INTERACTIVE NAVBAR STATE SIMULATOR
     ========================================================================== */
  function updateSimState(isScrolled) {
    if (!simTopBtn || !simScrolledBtn || !navStateText) return;

    if (isScrolled) {
      simScrolledBtn.classList.add('active');
      simTopBtn.classList.remove('active');
      navStateText.textContent = 'Current State: Scrolled (Frosted Glass & Compact Height)';
    } else {
      simTopBtn.classList.add('active');
      simScrolledBtn.classList.remove('active');
      navStateText.textContent = 'Current State: Top View (Transparent Glass Base)';
    }
  }

  if (simTopBtn && simScrolledBtn) {
    simTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    simScrolledBtn.addEventListener('click', () => {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     6. PORTFOLIO SHOWCASE FILTER TABS
     ========================================================================== */
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active filter button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === cardCategory) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  /* ==========================================================================
     7. CONTACT FORM INTERACTION
     ========================================================================== */
  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('submit-btn');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        formFeedback.textContent = 'Thank you! Your message has been sent successfully.';
        formFeedback.className = 'form-feedback success';
        contactForm.reset();

        setTimeout(() => {
          formFeedback.textContent = '';
        }, 5000);
      }, 1000);
    });
  }
});