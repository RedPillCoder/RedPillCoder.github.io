document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const has = k => k.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : undefined), window);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Custom cursor
  const cursor = $('.cursor');
  const cursorFollower = $('.cursor-follower');
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouch && cursor && cursorFollower && has('gsap') && !reduceMotion) {
    const updateCursor = e => {
      gsap.to(cursor, { duration: 0.1, x: e.clientX, y: e.clientY });
      gsap.to(cursorFollower, { duration: 0.3, x: e.clientX, y: e.clientY });
    };
    document.addEventListener('mousemove', updateCursor);

    $$('.project-card, a, button, .form-group input, .form-group textarea').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorFollower.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorFollower.classList.remove('cursor-hover');
      });
    });

    document.addEventListener('mousedown', () => {
      cursor.classList.add('cursor-click');
      cursorFollower.classList.add('cursor-click');
    });
    document.addEventListener('mouseup', () => {
      cursor.classList.remove('cursor-click');
      cursorFollower.classList.remove('cursor-click');
    });
  } else {
    // Disable custom cursor on touch or reduced motion
    document.body.style.cursor = 'auto';
    if (cursor) cursor.style.display = 'none';
    if (cursorFollower) cursorFollower.style.display = 'none';
  }

  // Navbar scroll effect with debounce
  const header = $('header');
  if (header) {
    let last = 0, t;
    const headerHeight = header.offsetHeight;
    const onScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      header.style.top = y > last ? `-${headerHeight}px` : '0';
      last = y;
    };
    window.addEventListener('scroll', () => {
      clearTimeout(t);
      t = setTimeout(onScroll, 100);
    }, { passive: true });
  }

  // Smooth scrolling (ignore href="#" placeholders)
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = $(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // GSAP animations
  if (has('gsap') && !reduceMotion) {
    if (has('ScrollTrigger')) gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-content', { duration: 1, y: 50, opacity: 0, ease: 'power3.out', delay: 0.5 });
    gsap.from('.hero-image',   { duration: 1, x: 50, opacity: 0, ease: 'power3.out', delay: 0.8 });

    if (has('ScrollTrigger')) {
      gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'bottom 20%', toggleActions: 'play none none reverse' },
          y: 50, opacity: 0, duration: 1, ease: 'power3.out'
        });
      });

      $$('.skill-bar').forEach(bar => {
        gsap.to(bar, {
          width: bar.dataset.level || '0%',
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: { trigger: bar, start: 'top 80%' }
        });
      });
    }

    $$('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => gsap.to(card, { scale: 1.05, duration: 0.3, ease: 'power2.out' }));
      card.addEventListener('mouseleave', () => gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' }));
    });
  }

  // AOS
  if (has('AOS') && !reduceMotion) AOS.init({ duration: 800, once: true });

  // Typed.js
  if (has('Typed') && $('#typed-text') && !reduceMotion) {
    new Typed('#typed-text', {
      strings: ['Creative Technologist', 'Full-Stack Developer', 'UI/UX Enthusiast'],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1500,
      loop: true
    });
  }

  // Mobile menu
  const menuToggle = $('.menu-toggle');
  const navUl = $('nav ul');
  if (menuToggle && navUl) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      navUl.classList.toggle('show');
    });
    $$('.nav-link').forEach(link => link.addEventListener('click', () => {
      navUl.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Lazy-load images
  const lazyImgs = $$('img.lazy[data-src]');
  const swapSrc = img => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
    img.classList.remove('lazy');
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          swapSrc(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { rootMargin: '200px 0px' });
    lazyImgs.forEach(img => io.observe(img));
  } else {
    lazyImgs.forEach(swapSrc);
  }
});

// Heavy effect after full load
window.addEventListener('load', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.particlesJS && !reduceMotion) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#6c5ce7' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#a29bfe', opacity: 0.4, width: 1 },
        move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'repulse' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          repulse: { distance: 100, duration: 0.4 },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    });
  }
});
