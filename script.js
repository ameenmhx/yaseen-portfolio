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
    // 5. Contact Overhaul: Live Clock, Chat Flow, Parallax & Canvas
    // ==========================================
    
    // --- Live IST Clock ---
    const updateLiveClock = () => {
        const liveClockEl = document.getElementById('live-clock');
        if (liveClockEl) {
            const timeString = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' });
            liveClockEl.textContent = timeString + " (IST)";
        }
    };
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    // --- Chat Stage Flow & Web3Forms Contact Form ---
    const chatStage1 = document.getElementById('chat-stage-1');
    const chatStage2 = document.getElementById('chat-stage-2');
    const chatButtons = document.querySelectorAll('.chat-btn');

    chatButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (chatStage1 && chatStage2) {
                chatStage1.style.opacity = '0';
                chatStage1.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    chatStage1.classList.add('hidden');
                    chatStage2.classList.remove('hidden');
                    void chatStage2.offsetWidth; // Trigger layout reflow
                    chatStage2.style.opacity = '1';
                    chatStage2.style.transform = 'translateY(0)';
                    const messageField = document.querySelector('#contact-form textarea[name="message"]');
                    if (messageField) messageField.focus();
                }, 400);
            }
        });
    });

    const contactForm = document.getElementById('contact-form');
    const terminalStatus = document.querySelector('.terminal-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent standard page reload

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // 1. Loading State
            submitBtn.innerHTML = 'Initiating Handshake...';
            submitBtn.disabled = true;
            if (terminalStatus) terminalStatus.innerText = '> Executing send_message()...';

            // 2. Gather Data
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            try {
                // 3. Send to Web3Forms
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });
                
                const result = await response.json();
                
                if (response.status === 200) {
                    // 4. Success State
                    if (terminalStatus) {
                        terminalStatus.innerText = '> 200 OK: Message delivered successfully.';
                        terminalStatus.style.color = '#4ade80'; // Turn text green
                    }
                    submitBtn.innerHTML = 'Message Sent ✓';
                    
                    // 5. Transition to Stage 3 (Thanks confirmation message)
                    const chatStage3 = document.getElementById('chat-stage-3');
                    setTimeout(() => {
                        if (chatStage2 && chatStage3) {
                            chatStage2.style.opacity = '0';
                            chatStage2.style.transform = 'translateY(-10px)';
                            setTimeout(() => {
                                chatStage2.classList.add('hidden');
                                chatStage3.classList.remove('hidden');
                                void chatStage3.offsetWidth; // Trigger layout reflow
                                chatStage3.style.opacity = '1';
                                chatStage3.style.transform = 'translateY(0)';
                                contactForm.reset();
                                submitBtn.disabled = false;
                                submitBtn.innerHTML = originalBtnText;
                                if (terminalStatus) {
                                    terminalStatus.innerText = '> Ready...';
                                    terminalStatus.style.color = '';
                                }
                            }, 400);
                        }
                    }, 1200);
                } else {
                    // 6. API Error State
                    console.error(result);
                    if (terminalStatus) {
                        terminalStatus.innerText = '> ERROR: Delivery failed. Try again.';
                        terminalStatus.style.color = '#E63946'; // Turn text red
                    }
                    submitBtn.innerHTML = 'Start a Conversation →';
                    submitBtn.disabled = false;
                }
            } catch (error) {
                // 7. Network Error State
                console.error(error);
                if (terminalStatus) {
                    terminalStatus.innerText = '> FATAL: Network connection lost.';
                    terminalStatus.style.color = '#E63946';
                }
                submitBtn.innerHTML = 'Start a Conversation →';
                submitBtn.disabled = false;
            }
        });
    }

    // --- Mouse Parallax ---
    const contactSection = document.getElementById('contact');
    const contactInfo = document.querySelector('.contact-info');
    const glassChatPanel = document.querySelector('.glass-chat-panel');

    if (contactSection && contactInfo && glassChatPanel) {
        contactSection.addEventListener('mousemove', (e) => {
            const rect = contactSection.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            
            const maxMove = 5;
            const moveX = x * maxMove;
            const moveY = y * maxMove;
            
            contactInfo.style.transform = `translate(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px)`;
            glassChatPanel.style.transform = `translate(${-moveX.toFixed(2)}px, ${-moveY.toFixed(2)}px)`;
        });
        
        contactSection.addEventListener('mouseleave', () => {
            contactInfo.style.transition = 'transform 0.4s ease';
            glassChatPanel.style.transition = 'transform 0.4s ease';
            contactInfo.style.transform = 'translate(0, 0)';
            glassChatPanel.style.transform = 'translate(0, 0)';
        });
        
        contactSection.addEventListener('mouseenter', () => {
            contactInfo.style.transition = 'none';
            glassChatPanel.style.transition = 'none';
        });
    }

    // --- Interactive Background Canvas ---
    const contactCanvas = document.getElementById('contact-bg-canvas');
    if (contactCanvas) {
        const cctx = contactCanvas.getContext('2d');

        const CODE_SNIPPETS = [
            'SELECT * FROM account_move',
            'EXPLAIN ANALYZE SELECT',
            'def migrate_v14_to_v18():',
            'POST /api/v1/webhook',
            'docker run -d odoo:18',
            'env["ir.model"].search()',
            'RETURNING id, status',
            '200 OK - 12ms',
            'CREATE INDEX CONCURRENTLY',
            'async def handle_payload():',
            'pg_dump -h localhost',
            'class PaymentGatewayMiddleware:',
        ];

        let contactElements = [];
        let contactAnimId = null;

        const initContactCanvas = () => {
            const section = contactCanvas.parentElement ? contactCanvas.parentElement.parentElement : null;
            contactCanvas.width = section ? section.offsetWidth : window.innerWidth;
            contactCanvas.height = section ? section.offsetHeight : window.innerHeight;

            contactElements = [];

            const snippetCount = 5;
            for (let i = 0; i < snippetCount; i++) {
                contactElements.push({
                    type: 'code',
                    text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
                    x: Math.random() * contactCanvas.width,
                    y: Math.random() * contactCanvas.height,
                    speed: 0.05 + Math.random() * 0.05,
                    fontSize: 10 + Math.floor(Math.random() * 2),
                    opacity: 0.08 + Math.random() * 0.08
                });
            }

            const particleCount = 15;
            for (let i = 0; i < particleCount; i++) {
                contactElements.push({
                    type: 'particle',
                    x: Math.random() * contactCanvas.width,
                    y: Math.random() * contactCanvas.height,
                    r: 0.5 + Math.random() * 1.0,
                    speed: 0.04 + Math.random() * 0.06,
                    opacity: 0.10 + Math.random() * 0.15
                });
            }
        };

        const drawContactBackground = () => {
            cctx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);

            contactElements.forEach(el => {
                if (el.type === 'code') {
                    cctx.font = `${el.fontSize}px "Courier New", monospace`;
                    cctx.fillStyle = `rgba(225, 235, 255, ${el.opacity.toFixed(3)})`;
                    cctx.fillText(el.text, el.x, el.y);
                } else {
                    cctx.beginPath();
                    cctx.arc(el.x, el.y, el.r, 0, Math.PI * 2);
                    cctx.fillStyle = `rgba(255, 255, 255, ${el.opacity.toFixed(3)})`;
                    cctx.fill();
                }

                el.y -= el.speed;
                if (el.y < -30) {
                    el.y = contactCanvas.height + 20;
                    el.x = Math.random() * contactCanvas.width;
                }
            });

            contactAnimId = requestAnimationFrame(drawContactBackground);
        };

        initContactCanvas();
        drawContactBackground();

        let contactResizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(contactResizeTimer);
            contactResizeTimer = setTimeout(() => {
                if (contactAnimId) cancelAnimationFrame(contactAnimId);
                initContactCanvas();
                drawContactBackground();
            }, 180);
        });
    }

    // ==========================================
    // 6. PARTICLE CANVAS ANIMATION (Premium Data-Node Network)
    // ==========================================
    function initDataNodeNetwork(canvasId, minParticles = 60) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

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
        const LINE_MAX_ALPHA   = 0.22;    // subtle lines
        const DOT_MIN_ALPHA    = 0.25;    // floor opacity — soft
        const DOT_MAX_ALPHA    = 0.45;    // muted nodes

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
            // Scale count with viewport area
            const count = Math.max(minParticles, Math.floor((canvas.width * canvas.height) / 7000));
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

    initDataNodeNetwork('hero-canvas', 60);
    initDataNodeNetwork('footer-particles', 15);
    initDataNodeNetwork('modal-canvas', 30);

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
        const AB_LINE_MAX_ALPHA  = 0.06;      // very subtle connecting lines
        const AB_DOT_MIN_ALPHA   = 0.10;      // floor dot opacity
        const AB_DOT_MAX_ALPHA   = 0.22;      // ceiling dot opacity

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

    // ==========================================
    // 11. EXPERIENCE — Animated Achievement Counters
    // ==========================================
    function animateExpCounter(el, target, duration = 2000) {
        let startTs = null;
        const tick = (timestamp) => {
            if (!startTs) startTs = timestamp;
            const elapsed  = timestamp - startTs;
            const progress = Math.min(elapsed / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        };
        requestAnimationFrame(tick);
    }

    const expStatsRow = document.getElementById('exp-stats');
    if (expStatsRow) {
        let countersStarted = false;
        const expStatsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    expStatsRow.querySelectorAll('.exp-stat-number').forEach(el => {
                        const target = parseInt(el.dataset.target, 10);
                        animateExpCounter(el, target, 2000);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        expStatsObserver.observe(expStatsRow);
    }

    // ==========================================
    // 12. EXPERIENCE MODAL — Click-to-open popup
    //     Data lives here in JS; clicking a card
    //     injects the matching content into #modal-body
    //     and removes the .hidden class.
    // ==========================================
    const EXP_DATA = {
        ygg: {
            icon: 'fa-gift',
            role: 'Senior Odoo Developer',
            company: 'YouGotaGift',
            date: '2024 — Present',
            color: '230, 57, 70',
            hex: '#E63946',
            metrics: [
                { icon: 'fa-cubes',  label: '40+ Modules'    },
                { icon: 'fa-bolt',   label: '120K Txn/day'   },
                { icon: 'fa-users',  label: 'Led 6 Developers'},
            ],
            bullets: [
                'Architected high-throughput transaction pipelines processing 120K+ operations daily with zero downtime SLA.',
                'Led a cross-functional team of 6 engineers to deliver 40+ custom Odoo modules on schedule.',
                'Integrated Docker-containerised Odoo instances with AWS infrastructure (EC2, RDS, S3).',
                'Optimised critical PostgreSQL queries reducing average response time by 60%.',
            ],
            techCategories: [
                {
                    title: 'CORE BACKEND',
                    badges: ['Python', 'Odoo 17', 'PostgreSQL']
                },
                {
                    title: 'DEVOPS & INFRA',
                    badges: ['Docker', 'AWS']
                },
                {
                    title: 'APIS & INTEG',
                    badges: ['REST APIs']
                }
            ]
        },
        odoo: {
            icon: 'fa-gears',
            role: 'Software Developer',
            company: 'Odoo Pvt Ltd',
            date: '2022 — 2024',
            color: '124, 58, 237',
            hex: '#7C3AED',
            metrics: [
                { icon: 'fa-layer-group', label: '35 Modules'     },
                { icon: 'fa-database',    label: 'Data Migration'  },
                { icon: 'fa-plug',        label: 'REST APIs'       },
            ],
            bullets: [
                'Delivered 35 enterprise-grade modules spanning Accounting, Sales, Purchase, and Inventory verticals.',
                'Executed large-scale data migration strategies across Odoo v14 → v16 version upgrades with 99% data integrity.',
                'Designed and maintained REST API integrations connecting Odoo with third-party platforms and payment gateways.',
                'Enhanced system security by implementing row-level access rules and audit logging frameworks.',
            ],
            techCategories: [
                {
                    title: 'CORE BACKEND',
                    badges: ['Python', 'Odoo ORM', 'PostgreSQL']
                },
                {
                    title: 'FRONTEND & UI',
                    badges: ['XML Views', 'JavaScript']
                },
                {
                    title: 'APIS & INTEG',
                    badges: ['REST APIs']
                }
            ]
        },
        bassam: {
            icon: 'fa-code',
            role: 'Python Odoo Trainee',
            company: 'Bassam Infotech',
            date: '2020 — 2022',
            color: '14, 165, 233',
            hex: '#0EA5E9',
            metrics: [
                { icon: 'fa-graduation-cap',  label: 'Learning Journey' },
                { icon: 'fa-robot',           label: 'Automation'       },
                { icon: 'fa-table-columns',   label: 'XML & ORM'        },
            ],
            bullets: [
                'Built custom views, workflows, and wizards for SME clients using Odoo ORM and XML view architecture.',
                'Developed Python automation scripts that reduced manual data-entry workload for clients by ~40%.',
                'Delivered integrations with third-party services (SMS gateways, shipping APIs) while maintaining code quality standards.',
                'Gained deep foundational expertise in Odoo module structure, inheritance, and computed fields.',
            ],
            techCategories: [
                {
                    title: 'CORE BACKEND',
                    badges: ['Python', 'Odoo ORM', 'PostgreSQL']
                },
                {
                    title: 'FRONTEND & UI',
                    badges: ['XML', 'QWeb', 'JavaScript']
                },
                {
                    title: 'APIS & INTEG',
                    badges: ['API Integrations']
                }
            ]
        },
    };

    const expModal      = document.getElementById('experience-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBody     = document.getElementById('modal-body');

    function buildModalContent(data) {
        const c   = data.color;
        const hex = data.hex;

        const metricsHTML = data.metrics.map(m =>
            `<span class="metric-badge" style="color:rgba(${c},1);background:rgba(${c},0.12);border:1px solid rgba(${c},0.28);">
                <i class="fa-solid ${m.icon}"></i>${m.label}
             </span>`
        ).join('');

        const bulletsHTML = data.bullets.map(b =>
            `<li><span class="bullet-dot" style="background:rgba(${c},0.85);"></span>${b}</li>`
        ).join('');

        const techCategoriesHTML = data.techCategories.map(cat => `
            <div class="tech-category-box" style="--box-color:rgba(${c},0.35);--box-shadow-color:rgba(${c},0.08);--box-shadow-hover:rgba(${c},0.2);">
                <span class="tech-category-title">${cat.title}</span>
                <div class="tech-items">
                    ${cat.badges.map(badge => `<span class="tech-badge">${badge}</span>`).join('')}
                </div>
            </div>
        `).join('');

        return `
            <div class="modal-header">
                <div class="modal-icon"
                     style="background:linear-gradient(135deg,rgba(${c},0.22),rgba(${c},0.07));
                            border:1px solid rgba(${c},0.35);
                            color:rgba(${c},1);">
                    <i class="fa-solid ${data.icon}"></i>
                </div>
                <div class="modal-title-block">
                    <h3 class="modal-role-title" id="modal-title">${data.role}</h3>
                    <p class="modal-company-name" style="color:rgba(${c},1);">${data.company}</p>
                    <span class="modal-date-badge">${data.date}</span>
                </div>
            </div>

            <div class="modal-section">
                <p class="modal-section-label">Key Metrics</p>
                <div class="key-metrics">
                    <div class="metrics-track">${metricsHTML}${metricsHTML}</div>
                </div>
            </div>

            <div class="modal-section">
                <p class="modal-section-label">Responsibilities</p>
                <ul class="modal-bullets">${bulletsHTML}</ul>
            </div>

            <div class="modal-section">
                <p class="modal-section-label">Tech Stack</p>
                <div class="floating-tech-stack">
                    <div class="tech-stack-track">${techCategoriesHTML}${techCategoriesHTML}</div>
                </div>
            </div>`;
    }

    function openModal(cardKey) {
        const data = EXP_DATA[cardKey];
        if (!data || !expModal || !modalBody) return;
        modalBody.innerHTML = buildModalContent(data);
        expModal.classList.add('active');
        document.body.classList.add('modal-open');
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 50);
    }

    function closeModal() {
        if (!expModal) return;
        expModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    // Card click → open
    document.querySelectorAll('.experience-card[data-card]').forEach(card => {
        card.addEventListener('click', () => openModal(card.dataset.card));
    });

    // Close button
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    // Click on overlay backdrop (outside modal-content) → close
    if (expModal) {
        expModal.addEventListener('click', (e) => {
            if (e.target === expModal) closeModal();
        });
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ==========================================
    // 13. EXPERIENCE — Falling Code-Syntax Canvas
    //     Matrix-style rain using coding symbols
    //     in dark brand-red.  Runs on the canvas
    //     absolutely positioned behind the section.
    // ==========================================
    const codeCanvas = document.getElementById('experience-code-canvas');
    if (codeCanvas) {
        const cctx    = codeCanvas.getContext('2d');
        const SYMBOLS = [
            '{', '}', '<', '>', '/', '(', ')', '[', ']', ';',
            '0', '1', '=', '=>', 'def', 'SELECT', 'FROM',
            'class', 'if', 'return', 'True', 'False', 'null',
            'int', 'str', 'fn', '::', '&&', '||', '!=',
        ];
        const FONT_SIZE  = 14;
        const RAIN_COLOR = 'rgba(230, 57, 70,';   // brand red — opacity added per-drop
        let   columns    = [];
        let   drops      = [];

        function initCodeCanvas() {
            const section = codeCanvas.parentElement;
            codeCanvas.width  = section ? section.offsetWidth  : window.innerWidth;
            codeCanvas.height = section ? section.offsetHeight : window.innerHeight;
            const cols = Math.floor(codeCanvas.width / (FONT_SIZE * 1.6));
            columns = Array.from({ length: cols }, (_, i) => ({
                x       : i * FONT_SIZE * 1.6 + FONT_SIZE / 2,
                speed   : 0.15 + Math.random() * 0.25,  // reduced fall speed for ambient effect
                opacity : 0.4 + Math.random() * 0.35,  // softened brightness for subtle texture
            }));
            drops   = columns.map(() => Math.random() * -codeCanvas.height);  // start above canvas
        }

        let codeAnimId = null;

        function drawCodeRain() {
            // Fade trail — semi-transparent fill clears previous frame
            cctx.fillStyle = 'rgba(5, 0, 0, 0.12)';
            cctx.fillRect(0, 0, codeCanvas.width, codeCanvas.height);

            cctx.font = `${FONT_SIZE}px "Courier New", monospace`;

            columns.forEach((col, i) => {
                const sym  = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                const y    = drops[i];

                // Head symbol — brighter with higher alpha/opacity
                cctx.fillStyle = `${RAIN_COLOR} ${col.opacity})`;
                cctx.fillText(sym, col.x, y);

                // Advance drop
                drops[i] += FONT_SIZE * col.speed;

                // Reset when it exits the bottom — randomise delay
                if (drops[i] > codeCanvas.height + FONT_SIZE) {
                    drops[i] = -(Math.random() * codeCanvas.height * 0.5);
                    col.speed   = 0.15 + Math.random() * 0.25;
                    col.opacity = 0.4 + Math.random() * 0.35;
                }
            });

            codeAnimId = requestAnimationFrame(drawCodeRain);
        }

        initCodeCanvas();
        drawCodeRain();

        // Resize
        let codeResizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(codeResizeTimer);
            codeResizeTimer = setTimeout(() => {
                if (codeAnimId) cancelAnimationFrame(codeAnimId);
                initCodeCanvas();
                drawCodeRain();
            }, 200);
        });
    }

    // ==========================================
    // 14. EXPERIENCE CARDS — Magnetic 3D Tilt
    //     Subtle perspective tilt (max ±4°).
    //     Disabled while modal is open.
    // ==========================================
    const MAX_TILT = 4;

    document.querySelectorAll('.experience-card').forEach(card => {

        card.addEventListener('mousemove', (e) => {
            if (expModal && expModal.classList.contains('active')) return;
            const rect    = card.getBoundingClientRect();
            const nx      = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
            const ny      = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
            const rotateY =  nx * MAX_TILT;
            const rotateX = -ny * MAX_TILT;
            card.style.transition = 'transform 0.1s linear, box-shadow 0.35s ease, border-color 0.35s ease';
            card.style.transform  = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.55s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.35s ease, border-color 0.35s ease';
            card.style.transform  = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // ==========================================
    // 15. PROJECTS SECTION — 3D Magnetic Hover & Cursor Glow
    // ==========================================
    const PROJECT_MAX_TILT = 5;

    document.querySelectorAll('.project-card').forEach(card => {
        const glow = card.querySelector('.card-glow');

        card.addEventListener('mousemove', (e) => {
            if (projModal && projModal.classList.contains('active')) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const nx = (x / rect.width - 0.5) * 2;
            const ny = (y / rect.height - 0.5) * 2;

            const rotateY = nx * PROJECT_MAX_TILT;
            const rotateX = -ny * PROJECT_MAX_TILT;

            card.style.transition = 'transform 0.1s linear, box-shadow 0.35s ease, border-color 0.35s ease';
            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

            if (glow) {
                card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
                card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.35s ease, border-color 0.35s ease';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // ==========================================
    // 15b. PER-CARD CANVAS PARTICLE ANIMATION
    //      Each project card has its own mini canvas
    //      with accent-colored drifting particles
    // ==========================================
    (function initProjectCardCanvases() {
        const THEME_COLORS = {
            'theme-data':    '69, 123, 157',
            'theme-backend': '230, 57, 70',
            'theme-devops':  '42, 157, 143',
        };

        document.querySelectorAll('.project-card').forEach(card => {
            const canvas = card.querySelector('.project-card-canvas');
            if (!canvas) return;

            // Determine accent color from card's theme class
            let rgb = '200, 200, 200';
            for (const [cls, color] of Object.entries(THEME_COLORS)) {
                if (card.classList.contains(cls)) { rgb = color; break; }
            }

            const ctx = canvas.getContext('2d');
            const particles = [];
            let animId;

            function resizeCanvas() {
                canvas.width  = card.offsetWidth;
                canvas.height = card.offsetHeight;
            }

            function spawnParticles() {
                particles.length = 0;
                const count = Math.max(18, Math.floor((canvas.width * canvas.height) / 2200));
                for (let i = 0; i < count; i++) {
                    particles.push({
                        x:    Math.random() * canvas.width,
                        y:    Math.random() * canvas.height,
                        r:    0.8 + Math.random() * 2.2,
                        vx:   (Math.random() - 0.5) * 0.35,
                        vy:   -0.2 - Math.random() * 0.4,
                        alpha: 0.12 + Math.random() * 0.28,
                    });
                }
            }

            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${rgb}, ${p.alpha.toFixed(3)})`;
                    ctx.fill();

                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.y < -5)            p.y = canvas.height + 5;
                    if (p.x < -5)            p.x = canvas.width  + 5;
                    if (p.x > canvas.width + 5) p.x = -5;
                });
                animId = requestAnimationFrame(draw);
            }

            resizeCanvas();
            spawnParticles();
            draw();

            // Respawn on resize
            const ro = new ResizeObserver(() => {
                if (animId) cancelAnimationFrame(animId);
                resizeCanvas();
                spawnParticles();
                draw();
            });
            ro.observe(card);
        });
    })();


    //     Floating low-opacity code snippets & tiny drifting particles
    // ==========================================
    // 16. PROJECTS SECTION — Complex Canvas Background Engine
    //     Floating low-opacity code snippets & tiny drifting particles
    // ==========================================
    const projCanvas = document.getElementById('projects-bg-canvas');
    if (projCanvas) {
        const pctx = projCanvas.getContext('2d');

        const CODE_SNIPPETS = [
            'SELECT * FROM account_move',
            'EXPLAIN ANALYZE SELECT',
            'def migrate_v14_to_v18():',
            'POST /api/v1/webhook',
            'docker run -d odoo:18',
            'env["ir.model"].search()',
            'RETURNING id, status',
            '200 OK - 12ms',
            'CREATE INDEX CONCURRENTLY',
            'async def handle_payload():',
            'pg_dump -h localhost',
            'class PaymentGatewayMiddleware:',
        ];

        let projElements = [];
        let projAnimId = null;

        const initProjCanvas = () => {
            const section = projCanvas.parentElement ? projCanvas.parentElement.parentElement : null;
            projCanvas.width = section ? section.offsetWidth : window.innerWidth;
            projCanvas.height = section ? section.offsetHeight : window.innerHeight;

            projElements = [];

            const snippetCount = Math.max(14, Math.floor(projCanvas.width / 100));
            for (let i = 0; i < snippetCount; i++) {
                projElements.push({
                    type: 'code',
                    text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
                    x: Math.random() * projCanvas.width,
                    y: Math.random() * projCanvas.height,
                    speed: 0.25 + Math.random() * 0.35,
                    fontSize: 12 + Math.floor(Math.random() * 4),
                    opacity: 0.22 + Math.random() * 0.25  // Increased opacity for vivid visibility
                });
            }

            const particleCount = Math.max(35, Math.floor(projCanvas.width / 35));
            for (let i = 0; i < particleCount; i++) {
                projElements.push({
                    type: 'particle',
                    x: Math.random() * projCanvas.width,
                    y: Math.random() * projCanvas.height,
                    r: 1.2 + Math.random() * 2.2,
                    speed: 0.20 + Math.random() * 0.40,
                    opacity: 0.25 + Math.random() * 0.35  // Increased particle opacity
                });
            }
        };

        const drawProjBackground = () => {
            pctx.clearRect(0, 0, projCanvas.width, projCanvas.height);

            projElements.forEach(el => {
                if (el.type === 'code') {
                    pctx.font = `${el.fontSize}px "Courier New", monospace`;
                    pctx.fillStyle = `rgba(225, 235, 255, ${el.opacity.toFixed(3)})`;
                    pctx.fillText(el.text, el.x, el.y);
                } else {
                    pctx.beginPath();
                    pctx.arc(el.x, el.y, el.r, 0, Math.PI * 2);
                    pctx.fillStyle = `rgba(255, 255, 255, ${el.opacity.toFixed(3)})`;
                    pctx.fill();
                }

                el.y -= el.speed;
                if (el.y < -30) {
                    el.y = projCanvas.height + 20;
                    el.x = Math.random() * projCanvas.width;
                }
            });

            projAnimId = requestAnimationFrame(drawProjBackground);
        };

        initProjCanvas();
        drawProjBackground();

        let projResizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(projResizeTimer);
            projResizeTimer = setTimeout(() => {
                if (projAnimId) cancelAnimationFrame(projAnimId);
                initProjCanvas();
                drawProjBackground();
            }, 180);
        });
    }

    // ==========================================
    // 17. PROJECT CASE STUDY MODAL LOGIC
    // ==========================================
    const PROJECT_DATA = {
        migration: {
            title: 'Odoo Database Migration Hub',
            category: 'DATA & CLOUD',
            icon: 'fa-cloud-arrow-up',
            color: '69, 123, 157',
            hex: '#457B9D',
            metrics: [
                { icon: 'fa-check-double', label: '99.9% Accuracy' },
                { icon: 'fa-bolt', label: '4x Speedup' },
                { icon: 'fa-database', label: 'v14 → v18' }
            ],
            problem: 'Enterprise Odoo version upgrades (v14 to v18) presented high operational downtime and severe data loss risks due to legacy schema shifts.',
            solution: 'Engineered an automated ETL data migration engine using Python & Odoo ORM with dynamic field transformation, constraint pre-checks, and parallel thread execution.',
            result: 'Achieved 99.9% data migration integrity across 500K+ records with zero unplanned downtime during enterprise go-live.',
            tech: ['Python', 'Odoo ORM', 'PostgreSQL', 'ETL Engine', 'Docker', 'Linux']
        },
        optimizer: {
            title: 'PostgreSQL Query Optimizer',
            category: 'BACKEND ARCHITECTURE',
            icon: 'fa-microchip',
            color: '230, 57, 70',
            hex: '#E63946',
            metrics: [
                { icon: 'fa-gauge-high', label: '80% Latency Drop' },
                { icon: 'fa-chart-line', label: 'Real-time Profiling' },
                { icon: 'fa-lock-open', label: 'Lock Detection' }
            ],
            problem: 'Unindexed complex SQL join queries bottlenecked core ERP transactions during peak sales hours.',
            solution: 'Developed a real-time database profiling daemon in Python that continuously monitors slow queries, logs lock contention, and generates automatic index recommendations.',
            result: 'Slashed query latency by 80% and eliminated transaction deadlock timeouts under heavy concurrent loads.',
            tech: ['PostgreSQL', 'Python', 'Daemon', 'Indexing', 'SQL EXPLAIN', 'Asyncio']
        },
        middleware: {
            title: 'Odoo Payment Gateway Middleware',
            category: 'DEVOPS & INFRA',
            icon: 'fa-network-wired',
            color: '42, 157, 143',
            hex: '#2A9D8F',
            metrics: [
                { icon: 'fa-server', label: '10K+ Webhooks/day' },
                { icon: 'fa-shield-halved', label: '99.99% Uptime' },
                { icon: 'fa-arrows-rotate', label: 'Retry Queue' }
            ],
            problem: 'High webhooks traffic during flash sales caused synchronization failures between Odoo instances and external payment gateways.',
            solution: 'Architected a high-concurrency Flask microservice layer with Redis job queues, exponential backoff retries, and HMAC signature validation.',
            result: 'Successfully processed 10,000+ daily webhooks with zero dropped transactions at 99.99% system availability.',
            tech: ['Flask', 'REST APIs', 'Webhooks', 'Microservices', 'Redis', 'Python']
        }
    };

    const projModal = document.getElementById('project-modal');
    const projModalCloseBtn = document.getElementById('project-modal-close-btn');
    const projModalBody = document.getElementById('project-modal-body');

    function buildProjectModalContent(data) {
        const c = data.color;
        const metricsHTML = data.metrics.map(m =>
            `<span class="metric-badge" style="color:rgba(${c},1);background:rgba(${c},0.12);border:1px solid rgba(${c},0.28);">
                <i class="fa-solid ${m.icon}"></i>${m.label}
             </span>`
        ).join('');

        // Build doubled tech pills for the marquee loop
        const techPillsHTML = data.tech.map(t =>
            `<span style="display:inline-flex;align-items:center;padding:5px 14px;background:rgba(${c},0.1);border:1px solid rgba(${c},0.28);border-radius:100px;font-size:0.75rem;font-weight:600;color:rgba(${c},1);white-space:nowrap;letter-spacing:0.4px;">${t}</span>`
        ).join('');

        return `
            <div class="modal-header">
                <div class="modal-icon" style="background:linear-gradient(135deg,rgba(${c},0.25),rgba(${c},0.08));border:1px solid rgba(${c},0.4);color:rgba(${c},1);">
                    <i class="fa-solid ${data.icon}"></i>
                </div>
                <div class="modal-title-block">
                    <h3 class="modal-role-title">${data.title}</h3>
                    <p class="modal-company-name" style="color:rgba(${c},1);">${data.category}</p>
                </div>
            </div>

            <div class="modal-section">
                <p class="modal-section-label">Performance Metrics</p>
                <div class="key-metrics">
                    <div class="metrics-track">${metricsHTML}${metricsHTML}</div>
                </div>
            </div>

            <div class="modal-section">
                <p class="modal-section-label">Case Study Overview</p>
                <div class="project-psr-flow">
                    <div class="psr-step psr-problem">
                        <span class="psr-label">Problem</span>
                        <span class="psr-text">${data.problem}</span>
                    </div>
                    <div class="psr-arrow">↓</div>
                    <div class="psr-step psr-solution">
                        <span class="psr-label">Solution</span>
                        <span class="psr-text">${data.solution}</span>
                    </div>
                    <div class="psr-arrow">↓</div>
                    <div class="psr-step psr-result">
                        <span class="psr-label">Result</span>
                        <span class="psr-text"><strong class="psr-metric" style="color:rgba(${c},1);">${data.result}</strong></span>
                    </div>
                </div>
            </div>

            <div class="modal-section">
                <p class="modal-section-label">Technologies Used</p>
                <div style="overflow:hidden;padding:4px 0;mask-image:linear-gradient(to right,transparent,black 8%,black 92%,transparent);-webkit-mask-image:linear-gradient(to right,transparent,black 8%,black 92%,transparent);">
                    <div class="pc-tech-track" style="animation-duration:14s;">
                        ${techPillsHTML}${techPillsHTML}
                    </div>
                </div>
            </div>`;
    }

    let projModalCanvasAnimId = null;

    function openProjectModal(key) {
        const data = PROJECT_DATA[key];
        if (!data || !projModal || !projModalBody) return;
        projModalBody.innerHTML = buildProjectModalContent(data);
        projModal.classList.add('active');
        document.body.classList.add('modal-open');

        // Animate the project modal canvas with accent-colored particles
        const pmCanvas = document.getElementById('project-modal-canvas');
        if (pmCanvas) {
            if (projModalCanvasAnimId) cancelAnimationFrame(projModalCanvasAnimId);
            const pmCtx = pmCanvas.getContext('2d');
            const rgb = data.color;
            const pmParticles = [];

            const initPmCanvas = () => {
                const mc = pmCanvas.parentElement;
                pmCanvas.width  = mc ? mc.offsetWidth  : 560;
                pmCanvas.height = mc ? mc.offsetHeight : 500;
                pmParticles.length = 0;
                const count = Math.max(25, Math.floor((pmCanvas.width * pmCanvas.height) / 3000));
                for (let i = 0; i < count; i++) {
                    pmParticles.push({
                        x:     Math.random() * pmCanvas.width,
                        y:     Math.random() * pmCanvas.height,
                        r:     0.6 + Math.random() * 2.0,
                        vx:    (Math.random() - 0.5) * 0.3,
                        vy:    -0.15 - Math.random() * 0.35,
                        alpha: 0.08 + Math.random() * 0.22,
                    });
                }
            };

            const drawPmCanvas = () => {
                pmCtx.clearRect(0, 0, pmCanvas.width, pmCanvas.height);
                pmParticles.forEach(p => {
                    pmCtx.beginPath();
                    pmCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    pmCtx.fillStyle = `rgba(${rgb}, ${p.alpha.toFixed(3)})`;
                    pmCtx.fill();
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.y < -5) p.y = pmCanvas.height + 5;
                    if (p.x < -5) p.x = pmCanvas.width + 5;
                    if (p.x > pmCanvas.width + 5) p.x = -5;
                });
                projModalCanvasAnimId = requestAnimationFrame(drawPmCanvas);
            };

            setTimeout(() => {
                initPmCanvas();
                drawPmCanvas();
            }, 50);
        }

        setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 50);
    }

    function closeProjectModal() {
        if (!projModal) return;
        if (projModalCanvasAnimId) {
            cancelAnimationFrame(projModalCanvasAnimId);
            projModalCanvasAnimId = null;
        }
        projModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    document.querySelectorAll('.project-card[data-project]').forEach(card => {
        card.addEventListener('click', (e) => {
            const projectKey = card.dataset.project;
            if (projectKey) openProjectModal(projectKey);
        });
    });

    if (projModalCloseBtn) projModalCloseBtn.addEventListener('click', closeProjectModal);
    if (projModal) {
        projModal.addEventListener('click', (e) => {
            if (e.target === projModal) closeProjectModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProjectModal();
    });

    // ==========================================
    // 14. RESUME DOWNLOAD CONFIRMATION MODAL
    // ==========================================
    const resumeModal = document.getElementById('resume-modal');
    const triggerResumeModal = document.getElementById('trigger-resume-modal');
    const cancelDownload = document.getElementById('cancel-download');
    const confirmDownload = document.getElementById('confirm-download');

    function closeResumeModal() {
        if (resumeModal) {
            resumeModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    }

    if (triggerResumeModal && resumeModal) {
        triggerResumeModal.addEventListener('click', () => {
            resumeModal.classList.add('active');
            document.body.classList.add('modal-open');
        });
    }

    if (cancelDownload) {
        cancelDownload.addEventListener('click', closeResumeModal);
    }

    if (confirmDownload) {
        confirmDownload.addEventListener('click', closeResumeModal);
    }

    if (resumeModal) {
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                closeResumeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeResumeModal();
        }
    });

});

