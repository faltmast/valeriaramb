/* =============================================
   VALERIA RAMB — Structural Engineering
   Interactive Scripts
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- LANGUAGE TOGGLE ----------
    const langToggle = document.getElementById('langToggle');
    const html = document.documentElement;
    let currentLang = 'en';

    function setLanguage(lang) {
        currentLang = lang;
        html.setAttribute('data-lang', lang);

        // Update all elements with data-en / data-pt attributes
        document.querySelectorAll('[data-en][data-pt]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                // Use innerHTML to support HTML entities
                el.innerHTML = text;
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-placeholder-en][data-placeholder-pt]').forEach(el => {
            const placeholder = el.getAttribute(`data-placeholder-${lang}`);
            if (placeholder) {
                el.placeholder = placeholder;
            }
        });

        // Update select options
        document.querySelectorAll('select option[data-en][data-pt]').forEach(option => {
            const text = option.getAttribute(`data-${lang}`);
            if (text) {
                option.textContent = text;
            }
        });

        // Update active state on toggle
        langToggle.querySelectorAll('.nav__lang-option').forEach(opt => {
            opt.classList.toggle('nav__lang-option--active', opt.dataset.value === lang);
        });

        // Store preference
        try {
            localStorage.setItem('vr-lang', lang);
        } catch (e) {
            // localStorage not available
        }
    }

    // Language toggle click
    langToggle.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'pt' : 'en';
        setLanguage(newLang);
    });

    // Also allow clicking individual language options
    langToggle.querySelectorAll('.nav__lang-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            setLanguage(opt.dataset.value);
        });
    });

    // Check for saved preference or browser language
    try {
        const savedLang = localStorage.getItem('vr-lang');
        if (savedLang && (savedLang === 'en' || savedLang === 'pt')) {
            setLanguage(savedLang);
        } else {
            // Detect browser language
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang && browserLang.startsWith('pt')) {
                setLanguage('pt');
            } else {
                setLanguage('en');
            }
        }
    } catch (e) {
        setLanguage('en');
    }


    // ---------- MOBILE NAVIGATION ----------
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('nav__toggle--active');
        navMenu.classList.toggle('nav__menu--open');
        document.body.style.overflow = navMenu.classList.contains('nav__menu--open') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navMenu.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('nav__toggle--active');
            navMenu.classList.remove('nav__menu--open');
            document.body.style.overflow = '';
        });
    });


    // ---------- NAVBAR SCROLL EFFECT ----------
    const nav = document.getElementById('nav');
    let lastScrollY = 0;

    function handleNavScroll() {
        const scrollY = window.scrollY;
        nav.classList.toggle('nav--scrolled', scrollY > 50);
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();


    // ---------- ACTIVE NAV LINK ----------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    function updateActiveLink() {
        const scrollY = window.scrollY + window.innerHeight / 3;

        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('nav__link--active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();


    // ---------- SCROLL ANIMATIONS (Intersection Observer) ----------
    const fadeElements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in--visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(el => fadeObserver.observe(el));
    } else {
        // Fallback: show everything
        fadeElements.forEach(el => el.classList.add('fade-in--visible'));
    }


    // ---------- SMOOTH SCROLL (fallback for older browsers) ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ---------- CONTACT FORM ----------
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.contact__submit');
        const originalText = submitBtn.textContent;

        // Simple validation visual
        const requiredFields = this.querySelectorAll('[required]');
        let valid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#e74c3c';
                valid = false;
                setTimeout(() => {
                    field.style.borderColor = '';
                }, 3000);
            }
        });

        if (!valid) return;

        // Simulate submission
        submitBtn.disabled = true;
        submitBtn.textContent = currentLang === 'pt' ? 'Enviando...' : 'Sending...';

        setTimeout(() => {
            submitBtn.textContent = currentLang === 'pt' ? 'Mensagem Enviada!' : 'Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';

            // Reset form
            contactForm.reset();

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
            }, 3000);
        }, 1500);
    });


    // ---------- PARALLAX EFFECT ON HERO SHAPES ----------
    const heroShapes = document.querySelectorAll('.hero__shape');

    if (heroShapes.length > 0 && window.matchMedia('(min-width: 768px)').matches) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            heroShapes.forEach((shape, i) => {
                const speed = (i + 1) * 8;
                shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        }, { passive: true });
    }

});
