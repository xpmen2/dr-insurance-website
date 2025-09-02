/* ============================================
   NAVIGATION FUNCTIONALITY - ENHANCED v2.0
   ============================================ 
   Modular, conflict-free navigation with premium interactions
*/

(function() {
    'use strict';

    class NavigationController {
        constructor() {
            // Core elements
            this.navbar = null;
            this.mobileMenuBtn = null;
            this.mobileMenu = null;
            this.navLinks = null;
            this.mobileNavLinks = null;
            this.langToggle = null;
            
            // State management
            this.isInitialized = false;
            this.isMobileMenuOpen = false;
            this.lastScrollY = 0;
            this.scrollDirection = 'up';
            
            // Configuration
            this.config = {
                scrollThreshold: 50,
                navbarHeight: 80,
                scrollOffset: 75,
                animationDuration: 300,
                debounceDelay: 10
            };
            
            // Bind methods to preserve context
            this.handleScroll = this.debounce(this.handleScroll.bind(this), this.config.debounceDelay);
            this.handleResize = this.debounce(this.handleResize.bind(this), 100);
        }
        
        /**
         * Initialize navigation system
         */
        init() {
            if (this.isInitialized) {
                console.warn('Navigation already initialized');
                return;
            }
            
            // Query elements with error handling
            this.queryElements();
            
            if (!this.navbar) {
                console.error('Navigation: Navbar element not found');
                return;
            }
            
            // Setup all event listeners
            this.setupEventListeners();
            
            // Setup intersection observer for active link highlighting
            this.setupIntersectionObserver();
            
            // Initialize language from localStorage
            this.initializeLanguage();
            
            // Add premium hover effects
            this.addPremiumEffects();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('✅ Navigation v2.0 initialized successfully');
        }
        
        /**
         * Query and cache DOM elements
         */
        queryElements() {
            this.navbar = document.getElementById('navbar');
            this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
            this.mobileMenu = document.getElementById('mobileMenu');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
            this.langToggle = document.querySelector('.lang-toggle');
        }
        
        /**
         * Setup all event listeners
         */
        setupEventListeners() {
            // Mobile menu toggle
            if (this.mobileMenuBtn) {
                this.mobileMenuBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleMobileMenu();
                });
            }
            
            // Scroll events
            window.addEventListener('scroll', this.handleScroll);
            window.addEventListener('resize', this.handleResize);
            
            // Navigation links - Desktop
            this.navLinks.forEach(link => {
                // Remove any existing handlers
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
                
                newLink.addEventListener('click', (e) => {
                    const href = newLink.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        this.handleNavClick(href);
                    }
                });
            });
            
            // Navigation links - Mobile
            this.mobileNavLinks.forEach(link => {
                // Remove any existing handlers
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
                
                newLink.addEventListener('click', (e) => {
                    const href = newLink.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        this.handleNavClick(href);
                        this.closeMobileMenu();
                    }
                });
            });
            
            // Language toggle
            if (this.langToggle) {
                this.langToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleLanguage();
                });
            }
            
            // Close mobile menu on outside click
            document.addEventListener('click', (e) => {
                if (this.isMobileMenuOpen && 
                    !this.mobileMenu.contains(e.target) && 
                    !this.mobileMenuBtn.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
            
            // Handle escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        }
        
        /**
         * Handle navigation link clicks with smooth scrolling
         */
        handleNavClick(href) {
            if (!href || href === '#') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Calculate scroll position
                const rect = targetElement.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const targetPosition = rect.top + scrollTop - this.config.scrollOffset;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without triggering scroll
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
                
                // Trigger custom event
                this.dispatchNavigationEvent('navigate', { target: targetId });
                
            } else {
                console.warn(`Navigation target not found: ${targetId}`);
            }
        }
        
        /**
         * Toggle mobile menu with animations
         */
        toggleMobileMenu() {
            if (this.isMobileMenuOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        }
        
        /**
         * Open mobile menu
         */
        openMobileMenu() {
            if (!this.mobileMenu || !this.mobileMenuBtn) return;
            
            this.isMobileMenuOpen = true;
            
            // Add classes with slight delay for animation
            this.mobileMenuBtn.classList.add('active');
            this.mobileMenu.classList.add('active');
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Animate menu items
            this.animateMobileMenuItems('in');
            
            // Dispatch event
            this.dispatchNavigationEvent('mobileMenuOpen');
        }
        
        /**
         * Close mobile menu
         */
        closeMobileMenu() {
            if (!this.mobileMenu || !this.mobileMenuBtn) return;
            
            this.isMobileMenuOpen = false;
            
            // Animate menu items out first
            this.animateMobileMenuItems('out');
            
            // Then close menu after animation
            setTimeout(() => {
                this.mobileMenuBtn.classList.remove('active');
                this.mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }, 200);
            
            // Dispatch event
            this.dispatchNavigationEvent('mobileMenuClose');
        }
        
        /**
         * Animate mobile menu items
         */
        animateMobileMenuItems(direction) {
            const items = this.mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-cta-button');
            
            items.forEach((item, index) => {
                if (direction === 'in') {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                    
                    setTimeout(() => {
                        item.style.transition = 'all 0.3s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 50);
                } else {
                    item.style.transition = 'all 0.2s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                }
            });
        }
        
        /**
         * Handle scroll events for navbar behavior
         */
        handleScroll() {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class
            if (currentScrollY > this.config.scrollThreshold) {
                this.navbar.classList.add('scrolled');
                
                // Hide/show navbar based on scroll direction
                if (currentScrollY > this.lastScrollY && currentScrollY > 300) {
                    // Scrolling down - hide navbar
                    if (this.scrollDirection !== 'down') {
                        this.navbar.style.transform = 'translateY(-100%)';
                        this.scrollDirection = 'down';
                    }
                } else {
                    // Scrolling up - show navbar
                    if (this.scrollDirection !== 'up') {
                        this.navbar.style.transform = 'translateY(0)';
                        this.scrollDirection = 'up';
                    }
                }
            } else {
                this.navbar.classList.remove('scrolled');
                this.navbar.style.transform = 'translateY(0)';
            }
            
            this.lastScrollY = currentScrollY;
        }
        
        /**
         * Handle window resize
         */
        handleResize() {
            // Close mobile menu on desktop resize
            if (window.innerWidth > 768 && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        }
        
        /**
         * Setup Intersection Observer for active link highlighting
         */
        setupIntersectionObserver() {
            const sections = document.querySelectorAll('section[id]');
            
            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -70% 0px',
                threshold: 0
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        this.setActiveLink(id);
                    }
                });
            }, observerOptions);
            
            sections.forEach(section => {
                observer.observe(section);
            });
        }
        
        /**
         * Set active navigation link - DESHABILITADO para evitar que se quede pegado
         */
        setActiveLink(sectionId) {
            // Función deshabilitada - no agregar clase active
            return;
            
            /* Código comentado para prevenir el efecto pegado
            // Remove all active classes
            this.navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            this.mobileNavLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to matching links
            const activeLinks = document.querySelectorAll(`a[href="#${sectionId}"]`);
            activeLinks.forEach(link => {
                link.classList.add('active');
            });
            */
        }
        
        /**
         * Toggle language preference
         */
        toggleLanguage() {
            if (!this.langToggle) return;
            
            const langText = this.langToggle.querySelector('.lang-text');
            const currentLang = langText.textContent;
            const newLang = currentLang === 'ES' ? 'EN' : 'ES';
            
            // Update UI
            langText.textContent = newLang;
            
            // Update HTML lang attribute
            document.documentElement.lang = newLang === 'ES' ? 'es' : 'en';
            
            // Store preference
            localStorage.setItem('preferredLanguage', document.documentElement.lang);
            
            // Add animation effect
            this.langToggle.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.langToggle.style.transform = 'scale(1)';
            }, 200);
            
            // Dispatch language change event
            this.dispatchNavigationEvent('languageChange', { 
                language: document.documentElement.lang 
            });
        }
        
        /**
         * Initialize language from localStorage
         */
        initializeLanguage() {
            const savedLang = localStorage.getItem('preferredLanguage');
            
            if (savedLang && this.langToggle) {
                const langText = this.langToggle.querySelector('.lang-text');
                
                if (savedLang === 'en') {
                    langText.textContent = 'EN';
                    document.documentElement.lang = 'en';
                } else {
                    langText.textContent = 'ES';
                    document.documentElement.lang = 'es';
                }
            }
        }
        
        /**
         * Add premium hover effects and micro-interactions
         */
        addPremiumEffects() {
            // Add magnetic effect to CTA buttons
            const ctaButtons = document.querySelectorAll('.nav-cta-button');
            
            ctaButtons.forEach(button => {
                button.addEventListener('mousemove', (e) => {
                    const rect = button.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
                });
                
                button.addEventListener('mouseleave', () => {
                    button.style.transform = 'translate(0, 0)';
                });
            });
            
            // Add ripple effect to nav links
            this.navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    ripple.classList.add('ripple');
                    this.appendChild(ripple);
                    
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.width = ripple.style.height = size + 'px';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });
            });
        }
        
        /**
         * Dispatch custom navigation events
         */
        dispatchNavigationEvent(eventName, detail = {}) {
            const event = new CustomEvent(`navigation:${eventName}`, {
                detail: detail,
                bubbles: true
            });
            
            window.dispatchEvent(event);
        }
        
        /**
         * Utility: Debounce function
         */
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
        
        /**
         * Destroy navigation instance (cleanup)
         */
        destroy() {
            // Remove event listeners
            window.removeEventListener('scroll', this.handleScroll);
            window.removeEventListener('resize', this.handleResize);
            
            // Reset state
            this.isInitialized = false;
            this.isMobileMenuOpen = false;
            
            console.log('Navigation instance destroyed');
        }
    }
    
    // Initialize navigation when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        initNavigation();
    }
    
    function initNavigation() {
        // Check if navigation already exists
        if (window.DRNavigation) {
            console.warn('Navigation already exists, destroying old instance');
            window.DRNavigation.destroy();
        }
        
        // Create new instance
        window.DRNavigation = new NavigationController();
        window.DRNavigation.init();
    }
    
    // Export for debugging
    window.NavigationController = NavigationController;
    
})();