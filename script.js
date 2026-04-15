/* =============================================
   NU GUA — Serviço Estrutural
   Interactive Scripts
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- LANGUAGE TOGGLE ----------
    const langToggle = document.getElementById('langToggle');
    const html = document.documentElement;
    let currentLang = 'en';

    const supportedLangs = ['en', 'pt', 'es', 'zh'];

    function setLanguage(lang) {
        if (!supportedLangs.includes(lang)) lang = 'en';
        currentLang = lang;
        html.setAttribute('data-lang', lang);

        document.querySelectorAll('[data-en]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`) || el.getAttribute('data-en');
            if (text) el.innerHTML = text;
        });

        document.querySelectorAll('[data-placeholder-en]').forEach(el => {
            const placeholder = el.getAttribute(`data-placeholder-${lang}`) || el.getAttribute('data-placeholder-en');
            if (placeholder) el.placeholder = placeholder;
        });

        document.querySelectorAll('select option[data-en]').forEach(option => {
            const text = option.getAttribute(`data-${lang}`) || option.getAttribute('data-en');
            if (text) option.textContent = text;
        });

        if (langToggle) {
            langToggle.querySelectorAll('.nav__lang-option').forEach(opt => {
                opt.classList.toggle('nav__lang-option--active', opt.dataset.value === lang);
            });
        }

        try { localStorage.setItem('vr-lang', lang); } catch (e) {}
    }

    if (langToggle) {
        langToggle.querySelectorAll('.nav__lang-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                setLanguage(opt.dataset.value);
            });
        });
    }

    // Check saved preference or browser language
    try {
        const savedLang = localStorage.getItem('vr-lang');
        if (savedLang && supportedLangs.includes(savedLang)) {
            setLanguage(savedLang);
        } else {
            const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
            if (browserLang.startsWith('pt')) setLanguage('pt');
            else if (browserLang.startsWith('es')) setLanguage('es');
            else if (browserLang.startsWith('zh')) setLanguage('zh');
            else setLanguage('en');
        }
    } catch (e) { setLanguage('en'); }


    // ---------- MOBILE NAVIGATION ----------
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('nav__toggle--active');
            navMenu.classList.toggle('nav__menu--open');
            document.body.style.overflow = navMenu.classList.contains('nav__menu--open') ? 'hidden' : '';
        });

        navMenu.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('nav__toggle--active');
                navMenu.classList.remove('nav__menu--open');
                document.body.style.overflow = '';
            });
        });
    }


    // ---------- NAVBAR SCROLL EFFECT ----------
    const nav = document.getElementById('nav');
    if (nav) {
        function handleNavScroll() {
            nav.classList.toggle('nav--scrolled', window.scrollY > 50);
        }
        window.addEventListener('scroll', handleNavScroll, { passive: true });
        handleNavScroll();
    }


    // ---------- ACTIVE NAV LINK (multi-page) ----------
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('nav__link--active');
        }
    });

    // Active section tracking (for index.html with anchor links)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

    if (navLinks.length > 0) {
        function updateActiveLink() {
            const scrollY = window.scrollY + window.innerHeight / 3;
            let currentSection = '';
            sections.forEach(section => {
                const top = section.offsetTop;
                if (scrollY >= top && scrollY < top + section.offsetHeight) {
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
    }


    // ---------- SCROLL ANIMATIONS ----------
    const fadeElements = document.querySelectorAll('.fade-in');
    if ('IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in--visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        fadeElements.forEach(el => fadeObserver.observe(el));
    } else {
        fadeElements.forEach(el => el.classList.add('fade-in--visible'));
    }


    // ---------- SMOOTH SCROLL ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = 72;
                window.scrollTo({ top: target.offsetTop - navHeight, behavior: 'smooth' });
            }
        });
    });


    // ---------- CONTACT FORM ----------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('.contact__submit');
            const originalText = submitBtn.textContent;
            const requiredFields = this.querySelectorAll('[required]');
            let valid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#e74c3c';
                    valid = false;
                    setTimeout(() => { field.style.borderColor = ''; }, 3000);
                }
            });
            if (!valid) return;

            submitBtn.disabled = true;
            const sendingText = { en: 'Sending...', pt: 'Enviando...', es: 'Enviando...', zh: '发送中...' };
            submitBtn.textContent = sendingText[currentLang] || sendingText.en;

            setTimeout(() => {
                const sentText = { en: 'Message Sent!', pt: 'Mensagem Enviada!', es: 'Mensaje Enviado!', zh: '消息已发送！' };
                submitBtn.textContent = sentText[currentLang] || sentText.en;
                submitBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
                contactForm.reset();
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }


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
