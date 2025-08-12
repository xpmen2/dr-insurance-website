/* ============================================
   NAVIGATION FUNCTIONALITY
   ============================================ */

class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navbarToggle = document.querySelector('.navbar-toggle');
        this.navbarMenu = document.querySelector('.navbar-menu');
        this.navbarOverlay = document.querySelector('.navbar-overlay');
        this.navbarLinks = document.querySelectorAll('.navbar-link');
        this.languageSelector = document.querySelector('.language-selector');
        
        this.init();
    }
    
    init() {
        // Mobile menu toggle
        if (this.navbarToggle) {
            this.navbarToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Overlay click
        if (this.navbarOverlay) {
            this.navbarOverlay.addEventListener('click', () => this.closeMobileMenu());
        }
        
        // Scroll behavior
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Smooth scroll for anchor links
        this.navbarLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });
        
        // Language toggle
        if (this.languageSelector) {
            this.languageSelector.addEventListener('click', () => this.toggleLanguage());
        }
        
        // Close mobile menu on link click
        this.navbarLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Handle dropdown on mobile
        this.handleMobileDropdowns();
    }
    
    toggleMobileMenu() {
        this.navbarToggle.classList.toggle('active');
        this.navbarMenu.classList.toggle('active');
        this.navbarOverlay.classList.toggle('active');
        document.body.style.overflow = this.navbarMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    closeMobileMenu() {
        this.navbarToggle.classList.remove('active');
        this.navbarMenu.classList.remove('active');
        this.navbarOverlay.classList.remove('active');
        document.body.style.overflow = '';
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
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offset = this.navbar.offsetHeight;
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    toggleLanguage() {
        const currentLang = document.documentElement.lang || 'es';
        const newLang = currentLang === 'es' ? 'en' : 'es';
        
        // Store preference
        localStorage.setItem('preferredLanguage', newLang);
        
        // Update flag
        this.updateLanguageUI(newLang);
        
        // Trigger language change event
        window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: newLang } }));
    }
    
    updateLanguageUI(lang) {
        const flagImg = this.languageSelector.querySelector('.language-flag');
        
        if (lang === 'en') {
            flagImg.src = '/images/flag-us.svg';
            flagImg.alt = 'English';
            // Add visual feedback
            this.languageSelector.classList.add('has-update');
            setTimeout(() => {
                this.languageSelector.classList.remove('has-update');
            }, 2000);
        } else {
            flagImg.src = '/images/flag-es.svg';
            flagImg.alt = 'Español';
        }
        
        document.documentElement.lang = lang;
    }
    
    handleMobileDropdowns() {
        const dropdowns = document.querySelectorAll('.navbar-dropdown');
        
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.navbar-link');
            
            if (link) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 1024) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});

// Export for use in other modules
window.Navigation = Navigation;