document.addEventListener('DOMContentLoaded', () => {
  
  // ===== 1. DYNAMIC FOOTER YEAR =====
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ===== 2. MOBILE NAVIGATION TOGGLE =====
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const body = document.body;

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===== 3. SCROLL PROGRESS BAR & BACK TO TOP =====
  const scrollBar = document.getElementById('scrollBar');
  const toTopBtn = document.getElementById('toTop');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Update Progress Bar
    if (scrollBar && docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollBar.style.width = `${scrollPercent}%`;
    }

    // Show/Hide Back to Top Button
    if (toTopBtn) {
      if (scrollTop > 400) {
        toTopBtn.classList.add('show');
      } else {
        toTopBtn.classList.remove('show');
      }
    }
  });

  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== 4. FULLSCREEN HD IMAGE LIGHTBOX =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  if (lightbox && lightboxImg && lightboxCaption && lightboxClose) {

    // Open Lightbox — load full-resolution image
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        // Use the full src (not a thumbnail) for HD display
        lightboxImg.src = trigger.src;
        lightboxImg.alt = trigger.alt || '';
        lightboxCaption.textContent = trigger.alt || '';
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        body.style.overflow = 'hidden';

        // Re-trigger the zoom animation on each open
        const figure = lightbox.querySelector('.lightbox-figure');
        if (figure) {
          figure.style.animation = 'none';
          // Force reflow to restart animation
          void figure.offsetHeight;
          figure.style.animation = '';
        }
      });
    });

    // Close Lightbox Logic
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      body.style.overflow = '';
      
      // Delay clearing src so fade-out animation completes smoothly
      setTimeout(() => {
        lightboxImg.src = '';
        lightboxCaption.textContent = '';
      }, 300);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on outside click (clicking the dark overlay, not the image)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ===== 5. SCROLL REVEAL ANIMATIONS =====
  const revealSections = document.querySelectorAll('[data-reveal]');
  
  if ('IntersectionObserver' in window && revealSections.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealSections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(24px)';
      section.style.transition = 'opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
      observer.observe(section);
    });
  }

  // ===== 6. ACTIVE NAV LINK HIGHLIGHT ON SCROLL =====
  const navAnchors = document.querySelectorAll('nav .nav-links a[href^="#"]');
  const allSections = document.querySelectorAll('section[id]');

  if (navAnchors.length > 0 && allSections.length > 0) {
    const highlightNav = () => {
      const scrollPos = window.scrollY + 120;

      allSections.forEach(sec => {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        const id = sec.getAttribute('id');

        navAnchors.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            if (scrollPos >= top && scrollPos < bottom) {
              link.style.color = 'var(--accent)';
            } else {
              link.style.color = '';
            }
          }
        });
      });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });
  }
});