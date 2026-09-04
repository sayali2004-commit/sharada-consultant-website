// ===== PRELOADER =====
// Never block first paint on slow/mobile networks: hide on DOM ready,
// re-confirm on full load, and force-hide after 4s no matter what.
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader && !preloader.classList.contains('loaded')) {
    preloader.classList.add('loaded');
    setTimeout(() => { preloader.style.display = 'none'; }, 700);
  }
}
document.addEventListener('DOMContentLoaded', () => setTimeout(hidePreloader, 400));
window.addEventListener('load', () => setTimeout(hidePreloader, 400));
setTimeout(hidePreloader, 4000);

// ===== HEADER SCROLL =====
const header = document.querySelector('.header');

function updateHeader() {
  if (window.scrollY > 100) {
    if (header) header.classList.add('scrolled');
  } else {
    if (header) header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.querySelector('.scroll-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== MOBILE MENU =====
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  const mobileMenuClose = mobileMenu.querySelector('.mobile-menu-close');
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
}

// ===== HERO SLIDER =====
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
const progressBar = document.querySelector('.hero-progress-bar');
let currentSlide = 0;
let slideInterval;
const slideDuration = 6000;

function showSlide(index) {
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  if (slides[index]) slides[index].classList.add('active');
  if (dots[index]) dots[index].classList.add('active');
  currentSlide = index;
  if (progressBar) {
    progressBar.style.width = '0%';
    setTimeout(() => progressBar.style.width = '100%', 50);
  }
}

function nextSlide() {
  showSlide((currentSlide + 1) % slides.length);
}

function startSlider() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, slideDuration);
  if (progressBar) {
    progressBar.style.width = '0%';
    setTimeout(() => progressBar.style.width = '100%', 50);
  }
}

if (slides.length > 0) {
  showSlide(0);
  startSlider();

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
      startSlider();
    });
  });
}

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px 200px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.counter-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const finalValue = target.getAttribute('data-count');
      if (!finalValue) return;
      const suffix = target.getAttribute('data-suffix') || '';
      const duration = 2000;
      const increment = parseInt(finalValue) / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= parseInt(finalValue)) {
          current = parseInt(finalValue);
          clearInterval(timer);
        }
        target.textContent = Math.floor(current) + suffix;
      }, 16);
      counterObserver.unobserve(target);
    }
  });
}, { threshold: 0.3, rootMargin: '0px 0px 100px 0px' });

counters.forEach(c => counterObserver.observe(c));

// ===== PROJECT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card, .project-page-card');

function applyFilter(filter) {
  projectCards.forEach(card => {
    const categories = (card.getAttribute('data-category') || '').split(' ');
    const cardImg = card.querySelector('img');
    if (filter === 'highlight' && cardImg && cardImg.getAttribute('alt') === 'Titan Apartment') {
      card.style.order = '-1';
    } else {
      card.style.order = '';
    }
    if (filter === 'all' || categories.includes(filter)) {
      card.style.display = '';
      setTimeout(() => card.style.opacity = '1', 50);
    } else {
      card.style.opacity = '0';
      setTimeout(() => card.style.display = 'none', 400);
    }
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.getAttribute('data-filter'));
  });
});

const activeFilter = document.querySelector('.filter-btn.active');
if (activeFilter) {
  applyFilter(activeFilter.getAttribute('data-filter'));
}

// ===== GALLERY LIGHTBOX =====
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
let galleryImages = [];
let currentGalleryIndex = 0;

document.querySelectorAll('.gallery-item').forEach((item, i) => {
  item.addEventListener('click', () => {
    galleryImages = [];
    document.querySelectorAll('.gallery-item img').forEach(img => {
      galleryImages.push(img.src);
    });
    currentGalleryIndex = i;
    openLightbox(galleryImages[i]);
  });
});

function openLightbox(src) {
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

if (lightboxPrev) {
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIndex];
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIndex];
  });
}

document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIndex];
  }
  if (e.key === 'ArrowRight') {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIndex];
  }
});

// ===== PROJECT IMAGE FULLSCREEN =====
document.querySelectorAll('.project-page-img, .project-card-img').forEach((img) => {
  img.addEventListener('click', () => {
    galleryImages = [];
    document.querySelectorAll('.project-page-img, .project-card-img').forEach(im => {
      galleryImages.push(im.src);
    });
    currentGalleryIndex = Math.max(0, galleryImages.indexOf(img.src));
    openLightbox(img.src);
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// ===== PARALLAX (rAF-throttled for smooth mobile scrolling) =====
let parallaxTicking = false;
window.addEventListener('scroll', () => {
  if (parallaxTicking) return;
  parallaxTicking = true;
  requestAnimationFrame(() => {
    const scrolled = window.scrollY;
    document.querySelectorAll('.hero-slide-bg').forEach((bg, i) => {
      if (slides[i] && slides[i].classList.contains('active')) {
        bg.style.transform = `translateY(${scrolled * 0.2}px)`;
      }
    });
    parallaxTicking = false;
  });
}, { passive: true });
