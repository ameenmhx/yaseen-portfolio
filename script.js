/**
 * Muhammad Yaseen Portfolio — Premium JS with Tech Animations
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Navigation scroll effect
    // ==========================================
    const navbar = document.getElementById('navbar');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ==========================================
    // 2. Mobile Menu Toggle
    // ==========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    };

    mobileToggle.addEventListener('click', toggleMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) toggleMenu();
        });
    });

    // ==========================================
    // 3. Scroll Reveal
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 4. Smooth scroll with navbar offset
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navOffset = navbar.classList.contains('scrolled') ? 55 : 65;
                const offsetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // ==========================================
    // 5. Contact Form
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const successClose = document.getElementById('success-close');
    const btnSubmit = document.getElementById('btn-submit');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const originalBtnContent = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';
            btnSubmit.disabled = true;
            setTimeout(() => {
                formSuccess.classList.add('active');
                contactForm.reset();
                btnSubmit.innerHTML = originalBtnContent;
                btnSubmit.disabled = false;
            }, 1500);
        });
    }
    if (successClose) {
        successClose.addEventListener('click', () => formSuccess.classList.remove('active'));
    }

    // ==========================================
    // 6. PARTICLE CANVAS ANIMATION (Premium Data-Node Network)
    // ==========================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles     = [];
        let animFrameId   = null;

        // --- Config ---
        const CONNECTION_DIST  = 200;     // px — wider reach = more simultaneous links
        const SPEED_BASE       = 0.18;    // very slow drift (px per frame)
        const SPEED_VARIANCE   = 0.04;
        // Bright warm red — punches through the dark background
        const DOT_COLOR        = 'rgba(255, 80, 80,';
        const LINE_COLOR       = 'rgba(255, 80, 80,';
        const LINE_MAX_ALPHA   = 0.45;    // much more visible lines
        const DOT_MIN_ALPHA    = 0.50;    // floor opacity — never faint
        const DOT_MAX_ALPHA    = 0.85;    // bright crisp nodes

        // --- Resize handler ---
        const resize = () => {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        let resizeTimer;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resize();
                initParticles();   // re-seed to fill new dimensions
            }, 120);
        };
        resize();
        window.addEventListener('resize', onResize);

        // --- Seed particles (area-based density) ---
        function initParticles() {
            particles = [];
            // Scale count with viewport area — minimum 60 nodes
            const count = Math.max(60, Math.floor((canvas.width * canvas.height) / 7000));
            for (let i = 0; i < count; i++) {
                const speed = SPEED_BASE + (Math.random() * SPEED_VARIANCE * 2 - SPEED_VARIANCE);
                const angle = Math.random() * Math.PI * 2;
                particles.push({
                    x     : Math.random() * canvas.width,
                    y     : Math.random() * canvas.height,
                    r     : Math.random() * 2.6 + 1.2,  // 1.2 – 3.8 px (larger nodes)
                    dx    : Math.cos(angle) * speed,
                    dy    : Math.sin(angle) * speed,
                    alpha : DOT_MIN_ALPHA + Math.random() * (DOT_MAX_ALPHA - DOT_MIN_ALPHA)
                });
            }
        }
        initParticles();


        // --- Draw frame ---
        function drawFrame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Connecting lines — drawn first (background pass)
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const ddx  = particles[i].x - particles[j].x;
                    const ddy  = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(ddx * ddx + ddy * ddy);

                    if (dist < CONNECTION_DIST) {
                        // Linear fade: fully opaque at dist=0, transparent at dist=CONNECTION_DIST
                        const lineAlpha = LINE_MAX_ALPHA * (1 - dist / CONNECTION_DIST);
                        ctx.beginPath();
                        ctx.strokeStyle = `${LINE_COLOR} ${lineAlpha.toFixed(3)})`;
                        ctx.lineWidth   = 0.7;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // 2. Data-node dots — drawn on top of lines
            particles.forEach(p => {
                // Soft glow halo via a tiny radial gradient
                const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.5);
                grd.addColorStop(0,   `${DOT_COLOR} ${(p.alpha * 0.9).toFixed(3)})`);
                grd.addColorStop(0.4, `${DOT_COLOR} ${(p.alpha * 0.4).toFixed(3)})`);
                grd.addColorStop(1,   `${DOT_COLOR} 0)`);

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();

                // Hard crisp dot core
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `${DOT_COLOR} ${p.alpha.toFixed(3)})`;
                ctx.fill();

                // Move & bounce
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height)  p.dy *= -1;
            });

            animFrameId = requestAnimationFrame(drawFrame);
        }

        // Cancel any previous loop then start fresh
        if (animFrameId) cancelAnimationFrame(animFrameId);
        drawFrame();
    }

    // ==========================================
    // 6b. ABOUT SECTION — Light-Theme Particle Network
    //     A soft, elegant particle network anchored
    //     to the about section canvas. Colors are
    //     dark/semi-transparent so they read clearly
    //     against the #F5F2F2 light background.
    // ==========================================
    const aboutCanvas = document.getElementById('about-canvas');
    if (aboutCanvas) {
        const actx        = aboutCanvas.getContext('2d');
        let abParticles   = [];
        let abAnimId      = null;

        // --- Config for light-background visibility ---
        const AB_CONNECTION_DIST = 180;       // connection radius in px
        const AB_SPEED_BASE      = 0.12;      // very slow drift
        const AB_SPEED_VARIANCE  = 0.05;
        // Muted brand-red — visible but not distracting on light bg
        const AB_DOT_COLOR       = 'rgba(230, 57, 70,';
        const AB_LINE_COLOR      = 'rgba(26, 10, 10,';
        const AB_LINE_MAX_ALPHA  = 0.12;      // subtle connecting lines
        const AB_DOT_MIN_ALPHA   = 0.20;      // floor dot opacity
        const AB_DOT_MAX_ALPHA   = 0.45;      // ceiling dot opacity

        // --- Resize: match the SECTION's dimensions, not just window ---
        const abResize = () => {
            // Use the section element as the size source so the canvas
            // stays in sync even if the section height is not 100vh.
            const section = aboutCanvas.parentElement;
            aboutCanvas.width  = section ? section.offsetWidth  : aboutCanvas.offsetWidth;
            aboutCanvas.height = section ? section.offsetHeight : aboutCanvas.offsetHeight;
        };

        let abResizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(abResizeTimer);
            abResizeTimer = setTimeout(() => {
                abResize();
                abInitParticles();
            }, 120);
        });
        abResize();

        // --- Seed particles proportional to canvas area ---
        function abInitParticles() {
            abParticles = [];
            // Sparser than hero (÷10 000) for a lighter, airier feel
            const count = Math.max(40, Math.floor((aboutCanvas.width * aboutCanvas.height) / 10000));
            for (let i = 0; i < count; i++) {
                const speed = AB_SPEED_BASE + (Math.random() * AB_SPEED_VARIANCE * 2 - AB_SPEED_VARIANCE);
                const angle = Math.random() * Math.PI * 2;
                abParticles.push({
                    x     : Math.random() * aboutCanvas.width,
                    y     : Math.random() * aboutCanvas.height,
                    r     : Math.random() * 2.0 + 0.8,   // 0.8–2.8 px — smaller nodes
                    dx    : Math.cos(angle) * speed,
                    dy    : Math.sin(angle) * speed,
                    alpha : AB_DOT_MIN_ALPHA + Math.random() * (AB_DOT_MAX_ALPHA - AB_DOT_MIN_ALPHA)
                });
            }
        }
        abInitParticles();

        // --- Draw one frame ---
        function abDrawFrame() {
            actx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);

            // Pass 1 — Connecting lines (background pass)
            for (let i = 0; i < abParticles.length; i++) {
                for (let j = i + 1; j < abParticles.length; j++) {
                    const ddx  = abParticles[i].x - abParticles[j].x;
                    const ddy  = abParticles[i].y - abParticles[j].y;
                    const dist = Math.sqrt(ddx * ddx + ddy * ddy);

                    if (dist < AB_CONNECTION_DIST) {
                        // Fade lines out as particles drift apart
                        const lineAlpha = AB_LINE_MAX_ALPHA * (1 - dist / AB_CONNECTION_DIST);
                        actx.beginPath();
                        actx.strokeStyle = `${AB_LINE_COLOR} ${lineAlpha.toFixed(3)})`;
                        actx.lineWidth   = 0.6;
                        actx.moveTo(abParticles[i].x, abParticles[i].y);
                        actx.lineTo(abParticles[j].x, abParticles[j].y);
                        actx.stroke();
                    }
                }
            }

            // Pass 2 — Dot nodes (foreground pass)
            abParticles.forEach(p => {
                // Soft radial glow halo
                const grd = actx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
                grd.addColorStop(0,   `${AB_DOT_COLOR} ${(p.alpha * 0.8).toFixed(3)})`);
                grd.addColorStop(0.4, `${AB_DOT_COLOR} ${(p.alpha * 0.3).toFixed(3)})`);
                grd.addColorStop(1,   `${AB_DOT_COLOR} 0)`);

                actx.beginPath();
                actx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
                actx.fillStyle = grd;
                actx.fill();

                // Hard crisp dot core
                actx.beginPath();
                actx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                actx.fillStyle = `${AB_DOT_COLOR} ${p.alpha.toFixed(3)})`;
                actx.fill();

                // Move & bounce off section edges
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > aboutCanvas.width)  p.dx *= -1;
                if (p.y < 0 || p.y > aboutCanvas.height)  p.dy *= -1;
            });

            abAnimId = requestAnimationFrame(abDrawFrame);
        }

        if (abAnimId) cancelAnimationFrame(abAnimId);
        abDrawFrame();
    }


    // ==========================================
    // 7. TYPEWRITER EFFECT
    // ==========================================
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        const phrases = [
            'Senior Odoo Developer',
            'Backend Python Engineer',
            'ERP Solutions Architect',
            'PostgreSQL Specialist',
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 65;

        function type() {
            const current = phrases[phraseIndex];
            if (isDeleting) {
                typewriterEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 35;
            } else {
                typewriterEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 65;
            }

            if (!isDeleting && charIndex === current.length) {
                typeSpeed = 1800; // pause before deleting
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 350; // pause before typing next
            }
            setTimeout(type, typeSpeed);
        }
        // Start after hero entrance animation delay
        setTimeout(type, 900);
    }

    // ==========================================
    // 8. ANIMATED METRIC COUNTER CARDS
    // ==========================================
    function animateCounter(el, target, duration = 1600) {
        let start = 0;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        };
        requestAnimationFrame(step);
    }

    const metricCards = document.querySelectorAll('.metric-card');

    if (metricCards.length) {
        setTimeout(() => {
            metricCards.forEach((card, i) => {
                setTimeout(() => {
                    card.classList.add('visible');
                    const valueEl = card.querySelector('.metric-value');
                    const target = parseInt(valueEl.dataset.target);
                    setTimeout(() => animateCounter(valueEl, target), 300);
                }, i * 250);
            });
        }, 600);
    }

    // ==========================================
    // 9. INTERACTIVE SPOTLIGHT REVEAL
    // ==========================================
    const spotlightContainer = document.getElementById('spotlight-container');
    const imgReveal = spotlightContainer
        ? spotlightContainer.querySelector('.img-reveal')
        : null;

    if (spotlightContainer && imgReveal) {

        const RADIUS_ACTIVE = '90px';  // spotlight radius while hovering
        const RADIUS_HIDDEN = '0px';   // collapsed when idle

        /**
         * Converts a pointer/touch event into percentage-based coordinates
         * relative to the spotlight container's bounding box.
         * Percentage keeps the clip-path accurate even after resize.
         */
        function getCoords(e) {
            const rect = spotlightContainer.getBoundingClientRect();
            // Support both mouse and touch events
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const xPct = ((clientX - rect.left) / rect.width)  * 100;
            const yPct = ((clientY - rect.top)  / rect.height) * 100;
            return { xPct, yPct };
        }

        /** Snap the spotlight on instantly when the mouse enters */
        function onMouseEnter(e) {
            imgReveal.style.transition = 'none'; // no animation — instant appear
            const { xPct, yPct } = getCoords(e);
            spotlightContainer.style.setProperty('--x', `${xPct}%`);
            spotlightContainer.style.setProperty('--y', `${yPct}%`);
            spotlightContainer.style.setProperty('--spotlight-radius', RADIUS_ACTIVE);
        }

        /** Track the cursor with zero lag — no transition at all */
        function onMouseMove(e) {
            imgReveal.style.transition = 'none';
            const { xPct, yPct } = getCoords(e);
            spotlightContainer.style.setProperty('--x', `${xPct}%`);
            spotlightContainer.style.setProperty('--y', `${yPct}%`);
        }

        /** Disappear instantly when the mouse leaves — no ease-out */
        function onMouseLeave() {
            imgReveal.style.transition = 'none'; // instant off
            spotlightContainer.style.setProperty('--spotlight-radius', RADIUS_HIDDEN);
        }

        // --- Mouse events (hover-based, no click required) ---
        spotlightContainer.addEventListener('mouseenter', onMouseEnter);
        spotlightContainer.addEventListener('mousemove',  onMouseMove);
        spotlightContainer.addEventListener('mouseleave', onMouseLeave);

        // --- Touch events (passive:false lets us call preventDefault on move) ---
        spotlightContainer.addEventListener('touchstart', (e) => {
            imgReveal.style.transition = 'none';
            const { xPct, yPct } = getCoords(e);
            spotlightContainer.style.setProperty('--x', `${xPct}%`);
            spotlightContainer.style.setProperty('--y', `${yPct}%`);
            spotlightContainer.style.setProperty('--spotlight-radius', RADIUS_ACTIVE);
        }, { passive: true });

        spotlightContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            imgReveal.style.transition = 'none';
            const { xPct, yPct } = getCoords(e);
            spotlightContainer.style.setProperty('--x', `${xPct}%`);
            spotlightContainer.style.setProperty('--y', `${yPct}%`);
        }, { passive: false });

        const onTouchEnd = () => {
            imgReveal.style.transition = 'none'; // instant off on touch end
            spotlightContainer.style.setProperty('--spotlight-radius', RADIUS_HIDDEN);
        };
        spotlightContainer.addEventListener('touchend',    onTouchEnd);
        spotlightContainer.addEventListener('touchcancel', onTouchEnd);
    }

    // ==========================================
    // 10. PROFILE FLIP CARD — Click to flip
    // ==========================================
    const profileFlipCard = document.getElementById('profile-flip-card');

    if (profileFlipCard) {
        const flipInner = profileFlipCard.querySelector('.flip-card-inner');

        profileFlipCard.addEventListener('click', () => {
            flipInner.classList.toggle('is-flipped');
        });
    }

});
