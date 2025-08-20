/* ============================================
   MICRO-INTERACTIONS CONTROLLER
   ============================================
   Sistema maestro de control para todas las 
   micro-interacciones premium del sitio
*/

(function() {
    'use strict';

    class MicroInteractions {
        constructor() {
            this.isInitialized = false;
            this.isMobile = window.innerWidth <= 768;
            this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            // Configuration
            this.config = {
                revealOffset: 100,
                counterDuration: 2000,
                particleCount: 20,
                magneticStrength: 0.2,
                cursorLag: 0.1
            };
            
            // State
            this.mousePosition = { x: 0, y: 0 };
            this.scrollPosition = 0;
            this.rafId = null;
            
            // Initialize if not reduced motion
            if (!this.prefersReducedMotion) {
                this.init();
            }
        }
        
        /**
         * Initialize all micro-interactions
         */
        init() {
            if (this.isInitialized) return;
            
            // Setup all interactions
            this.setupCustomCursor();
            this.setupScrollReveals();
            this.setupMagneticButtons();
            this.setupLiquidButtons();
            this.setup3DCards();
            this.setupCounters();
            this.setupFormAnimations();
            this.setupTooltips();
            this.setupRippleEffects();
            this.setupParallax();
            this.setupTextAnimations();
            this.setupImageEffects();
            this.setupSpecialEffects();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start animation loop
            this.startAnimationLoop();
            
            this.isInitialized = true;
            console.log('✨ Micro-interactions initialized');
        }
        
        /**
         * Setup custom cursor (desktop only)
         */
        setupCustomCursor() {
            if (this.isMobile) return;
            
            // Create cursor elements
            const cursor = document.createElement('div');
            cursor.className = 'custom-cursor';
            document.body.appendChild(cursor);
            
            const follower = document.createElement('div');
            follower.className = 'custom-cursor-follower';
            document.body.appendChild(follower);
            
            this.cursor = cursor;
            this.follower = follower;
            
            // Hide default cursor
            document.body.style.cursor = 'none';
            
            // Track mouse movement
            document.addEventListener('mousemove', (e) => {
                this.mousePosition.x = e.clientX;
                this.mousePosition.y = e.clientY;
                
                // Immediate cursor position
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                
                // Delayed follower
                setTimeout(() => {
                    follower.style.left = e.clientX + 'px';
                    follower.style.top = e.clientY + 'px';
                }, 100);
            });
            
            // Click animation
            document.addEventListener('mousedown', () => {
                cursor.classList.add('clicking');
            });
            
            document.addEventListener('mouseup', () => {
                cursor.classList.remove('clicking');
            });
            
            // Hover states
            const interactiveElements = document.querySelectorAll('a, button, input, textarea, select');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
                });
                
                el.addEventListener('mouseleave', () => {
                    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                    follower.style.transform = 'translate(-50%, -50%) scale(1)';
                });
            });
        }
        
        /**
         * Setup scroll reveal animations
         */
        setupScrollReveals() {
            const reveals = document.querySelectorAll('[data-reveal]');
            
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        
                        // Add stagger effect for children
                        const children = entry.target.querySelectorAll('[data-reveal-child]');
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('revealed');
                            }, index * 100);
                        });
                        
                        // Unobserve after revealing
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            reveals.forEach(el => observer.observe(el));
        }
        
        /**
         * Setup magnetic button effects
         */
        setupMagneticButtons() {
            const magneticButtons = document.querySelectorAll('.btn-magnetic, .nav-cta-button');
            
            magneticButtons.forEach(button => {
                button.addEventListener('mousemove', (e) => {
                    const rect = button.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    const distance = Math.sqrt(x * x + y * y);
                    const maxDistance = Math.max(rect.width, rect.height);
                    
                    if (distance < maxDistance) {
                        const strength = (1 - distance / maxDistance) * this.config.magneticStrength;
                        button.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
                    }
                });
                
                button.addEventListener('mouseleave', () => {
                    button.style.transform = 'translate(0, 0)';
                });
            });
        }
        
        /**
         * Setup liquid button effects
         */
        setupLiquidButtons() {
            const liquidButtons = document.querySelectorAll('.btn-liquid, .cta-button');
            
            liquidButtons.forEach(button => {
                // Add liquid class if not present
                if (!button.classList.contains('btn-liquid')) {
                    button.classList.add('btn-liquid');
                }
                
                // Wrap text in span if not already wrapped
                if (!button.querySelector('span')) {
                    button.innerHTML = `<span>${button.innerHTML}</span>`;
                }
            });
        }
        
        /**
         * Setup 3D card tilt effects
         */
        setup3DCards() {
            const cards = document.querySelectorAll('.product-card, .testimonial-card, .success-card');
            
            cards.forEach(card => {
                card.classList.add('card-3d');
                
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                });
            });
        }
        
        /**
         * Setup animated counters
         */
        setupCounters() {
            const counters = document.querySelectorAll('[data-target]');
            
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.5
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            counters.forEach(counter => {
                counter.classList.add('counter');
                observer.observe(counter);
            });
        }
        
        /**
         * Animate a counter element
         */
        animateCounter(element) {
            const target = parseInt(element.dataset.target);
            const prefix = element.dataset.prefix || '';
            const suffix = element.dataset.suffix || '';
            const duration = this.config.counterDuration;
            
            let current = 0;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
                current += increment;
                
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                    element.classList.add('counting');
                    setTimeout(() => element.classList.remove('counting'), 500);
                }
                
                // Format number based on type
                let displayValue = Math.floor(current);
                if (element.dataset.type === 'currency') {
                    displayValue = '$' + displayValue + 'M';
                } else if (element.dataset.type === 'percentage') {
                    displayValue = displayValue + '%';
                } else {
                    displayValue = prefix + displayValue + suffix;
                }
                
                element.textContent = displayValue;
            }, 16);
        }
        
        /**
         * Setup form animations
         */
        setupFormAnimations() {
            // Add floating labels
            const formGroups = document.querySelectorAll('.hero-form-group, .form-group');
            
            formGroups.forEach(group => {
                const input = group.querySelector('input, select, textarea');
                const label = group.querySelector('label');
                
                if (input && label) {
                    group.classList.add('form-group-animated');
                    
                    // Add glow effect
                    input.classList.add('input-glow');
                    
                    // Check if input has value on load
                    if (input.value) {
                        group.classList.add('has-value');
                    }
                    
                    // Add focus/blur handlers
                    input.addEventListener('focus', () => {
                        group.classList.add('focused');
                    });
                    
                    input.addEventListener('blur', () => {
                        group.classList.remove('focused');
                        if (input.value) {
                            group.classList.add('has-value');
                        } else {
                            group.classList.remove('has-value');
                        }
                    });
                    
                    // Add input animation
                    input.addEventListener('input', () => {
                        if (input.value) {
                            group.classList.add('has-value');
                        } else {
                            group.classList.remove('has-value');
                        }
                    });
                }
            });
        }
        
        /**
         * Setup tooltips
         */
        setupTooltips() {
            const tooltipElements = document.querySelectorAll('[title]');
            
            tooltipElements.forEach(el => {
                const tooltipText = el.getAttribute('title');
                el.setAttribute('data-tooltip', tooltipText);
                el.removeAttribute('title');
            });
        }
        
        /**
         * Setup ripple effects for buttons and links
         */
        setupRippleEffects() {
            const rippleElements = document.querySelectorAll('button, .cta-button, .nav-link, .mobile-nav-link');
            
            rippleElements.forEach(el => {
                el.classList.add('touch-ripple');
                
                el.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    ripple.className = 'ripple-effect';
                    
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.width = ripple.style.height = size + 'px';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';
                    
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });
            });
        }
        
        /**
         * Setup parallax scrolling effects
         */
        setupParallax() {
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach(el => {
                    const speed = el.dataset.parallax || 0.5;
                    const yPos = -(scrolled * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });
            });
        }
        
        /**
         * Setup text animations
         */
        setupTextAnimations() {
            // Split text animation
            const splitTexts = document.querySelectorAll('.hero-title, .process-title, .founders-title');
            
            splitTexts.forEach(text => {
                const words = text.textContent.split(' ');
                text.innerHTML = words.map(word => 
                    `<span class="split-text"><span>${word}</span></span>`
                ).join(' ');
                
                // Trigger animation on scroll
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.querySelectorAll('.split-text').forEach((span, i) => {
                                setTimeout(() => {
                                    span.classList.add('animate');
                                }, i * 50);
                            });
                            observer.unobserve(entry.target);
                        }
                    });
                });
                
                observer.observe(text);
            });
            
            // Gradient text animation
            const gradientTexts = document.querySelectorAll('.hero-title-accent, .recruitment-title-highlight');
            gradientTexts.forEach(text => {
                text.classList.add('gradient-text');
            });
        }
        
        /**
         * Setup image effects
         */
        setupImageEffects() {
            // Ken Burns effect for hero images
            const heroImages = document.querySelectorAll('.hero-video-wrapper, .founders-image');
            heroImages.forEach(img => {
                img.classList.add('ken-burns');
            });
            
            // Image reveal effect
            const revealImages = document.querySelectorAll('.product-icon, .trust-logo-item');
            revealImages.forEach(img => {
                img.classList.add('image-reveal');
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('revealed');
                            observer.unobserve(entry.target);
                        }
                    });
                });
                
                observer.observe(img);
            });
        }
        
        /**
         * Setup special effects
         */
        setupSpecialEffects() {
            // Add shimmer to CTAs
            const ctaButtons = document.querySelectorAll('.cta-primary, .hero-form-button');
            ctaButtons.forEach(btn => {
                btn.classList.add('shimmer');
            });
            
            // Add glow to important elements
            const glowElements = document.querySelectorAll('.hero-badge, .achievement-badge, .hero-form-badge');
            glowElements.forEach(el => {
                el.classList.add('glow-on-hover');
            });
            
            // Add morph animation to decorative shapes
            const shapes = document.querySelectorAll('.hero-particles, .recruitment-badge');
            shapes.forEach(shape => {
                shape.classList.add('morph-shape');
            });
        }
        
        /**
         * Generate floating particles
         */
        generateParticles() {
            const containers = document.querySelectorAll('.hero, .recruitment');
            
            containers.forEach(container => {
                const particlesContainer = document.createElement('div');
                particlesContainer.className = 'particles-container';
                
                for (let i = 0; i < this.config.particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.animationDelay = Math.random() * 10 + 's';
                    particle.style.animationDuration = (10 + Math.random() * 10) + 's';
                    particlesContainer.appendChild(particle);
                }
                
                container.appendChild(particlesContainer);
            });
        }
        
        /**
         * Setup event listeners
         */
        setupEventListeners() {
            // Regenerate particles on resize
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    this.isMobile = window.innerWidth <= 768;
                    
                    // Remove custom cursor on mobile
                    if (this.isMobile && this.cursor) {
                        this.cursor.remove();
                        this.follower.remove();
                        document.body.style.cursor = 'auto';
                    }
                }, 250);
            });
            
            // Performance optimization: Pause animations when tab is not visible
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseAnimations();
                } else {
                    this.resumeAnimations();
                }
            });
        }
        
        /**
         * Start animation loop
         */
        startAnimationLoop() {
            const animate = () => {
                // Update any continuous animations here
                
                this.rafId = requestAnimationFrame(animate);
            };
            
            animate();
        }
        
        /**
         * Pause animations for performance
         */
        pauseAnimations() {
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
            
            // Pause CSS animations
            document.body.classList.add('animations-paused');
        }
        
        /**
         * Resume animations
         */
        resumeAnimations() {
            document.body.classList.remove('animations-paused');
            this.startAnimationLoop();
        }
        
        /**
         * Destroy instance
         */
        destroy() {
            // Cancel animation frame
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
            
            // Remove custom cursor
            if (this.cursor) {
                this.cursor.remove();
                this.follower.remove();
                document.body.style.cursor = 'auto';
            }
            
            // Reset state
            this.isInitialized = false;
            
            console.log('Micro-interactions destroyed');
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMicroInteractions);
    } else {
        initMicroInteractions();
    }
    
    function initMicroInteractions() {
        window.MicroInteractions = new MicroInteractions();
        
        // Generate particles after a short delay
        setTimeout(() => {
            window.MicroInteractions.generateParticles();
        }, 500);
    }
    
})();

// CSS class for pausing animations
const style = document.createElement('style');
style.textContent = `
    .animations-paused * {
        animation-play-state: paused !important;
    }
`;
document.head.appendChild(style);