/* ============================================
   NAVIGATION FUNCTIONALITY - ENHANCED
   ============================================ */

class Navigation {
    constructor() {
        // Updated selectors for new structure
        this.navbar = document.getElementById('navbar');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        this.langToggle = document.querySelector('.lang-toggle');
        
        this.init();
    }
    
    init() {
        // Mobile menu toggle
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Scroll behavior
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Smooth scroll for ALL anchor links (including nav and CTA buttons)
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });
        
        // Language toggle
        if (this.langToggle) {
            this.langToggle.addEventListener('click', () => this.toggleLanguage());
        }
        
        // Close mobile menu on link click
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
    }
    
    toggleMobileMenu() {
        this.mobileMenuBtn.classList.toggle('active');
        this.mobileMenu.classList.toggle('active');
        document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    closeMobileMenu() {
        if (this.mobileMenuBtn && this.mobileMenu) {
            this.mobileMenuBtn.classList.remove('active');
            this.mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    handleScroll() {
        const scrolled = window.scrollY > 50;
        
        if (scrolled) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    
    handleSmoothScroll(e) {
        const href = e.currentTarget.getAttribute('href');
        
        // Only handle hash links
        if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            
            const targetId = href.substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                // Calculate offset (navbar height + some padding)
                const navbarHeight = this.navbar ? this.navbar.offsetHeight : 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                this.closeMobileMenu();
                
                // Update URL hash without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            } else {
                console.warn(`Target element not found: ${targetId}`);
            }
        }
    }
    
    toggleLanguage() {
        const langText = this.langToggle.querySelector('.lang-text');
        const flagIcon = this.langToggle.querySelector('.flag-icon');
        
        if (langText.textContent === 'ES') {
            langText.textContent = 'EN';
            flagIcon.classList.remove('flag-es');
            flagIcon.classList.add('flag-en');
            document.documentElement.lang = 'en';
        } else {
            langText.textContent = 'ES';
            flagIcon.classList.remove('flag-en');
            flagIcon.classList.add('flag-es');
            document.documentElement.lang = 'es';
        }
        
        // Store preference
        localStorage.setItem('preferredLanguage', document.documentElement.lang);
        
        // Trigger language change event
        window.dispatchEvent(new CustomEvent('languageChange', { 
            detail: { language: document.documentElement.lang } 
        }));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});

// Export for use in other modules
window.Navigation = Navigation;