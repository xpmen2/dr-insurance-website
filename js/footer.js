/* ============================================
   FOOTER FUNCTIONALITY
   ============================================ */

(function() {
    'use strict';

class FooterSection {
    constructor() {
        this.footer = document.querySelector('.footer');
        this.backToTop = document.querySelector('.footer-back-top');
        this.newsletterForm = document.querySelector('.footer-newsletter-form');
        
        this.init();
    }
    
    init() {
        if (!this.footer) return;
        
        // Setup back to top button
        this.setupBackToTop();
        
        // Setup newsletter form
        this.setupNewsletter();
        
        // Setup smooth scroll for footer links
        this.setupSmoothScroll();
        
        // Add year to copyright
        this.updateCopyright();
        
        // Setup map if needed
        this.setupMap();
    }
    
    setupBackToTop() {
        if (!this.backToTop) {
            // Create back to top button if it doesn't exist
            this.backToTop = document.createElement('button');
            this.backToTop.className = 'footer-back-top';
            this.backToTop.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M7 14l5-5 5 5z"/>
                </svg>
            `;
            document.body.appendChild(this.backToTop);
        }
        
        // Show/hide on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.backToTop.classList.add('visible');
            } else {
                this.backToTop.classList.remove('visible');
            }
        });
        
        // Scroll to top on click
        this.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Track click
            this.trackEvent('back_to_top', 'Footer');
        });
    }
    
    setupNewsletter() {
        if (!this.newsletterForm) return;
        
        this.newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const input = this.newsletterForm.querySelector('.footer-newsletter-input');
            const button = this.newsletterForm.querySelector('.footer-newsletter-btn');
            const email = input.value;
            
            if (!this.validateEmail(email)) {
                this.showError(input, 'Por favor ingresa un email válido');
                return;
            }
            
            // Show loading state
            const originalText = button.textContent;
            button.textContent = 'Enviando...';
            button.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                this.showSuccess();
                
                // Reset form
                input.value = '';
                button.textContent = originalText;
                button.disabled = false;
                
                // Track subscription
                this.trackEvent('newsletter_subscribe', email);
            }, 1500);
        });
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    showError(input, message) {
        // Remove existing error
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Add error message
        const error = document.createElement('div');
        error.className = 'error-message';
        error.style.cssText = `
            color: #ff6b6b;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            animation: shake 0.3s ease;
        `;
        error.textContent = message;
        input.parentElement.appendChild(error);
        
        // Add shake animation
        input.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            input.style.animation = '';
        }, 300);
        
        // Remove error after 3 seconds
        setTimeout(() => {
            error.remove();
        }, 3000);
    }
    
    showSuccess() {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'newsletter-success';
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            background: linear-gradient(135deg, #D4AF37, #C4A030);
            color: #001A33;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
            z-index: 1000;
            animation: slideInRight 0.5s ease;
            display: flex;
            align-items: center;
            gap: 1rem;
            font-weight: 600;
        `;
        
        notification.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            ¡Suscripción exitosa! Te enviaremos las mejores ofertas.
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    }
    
    setupSmoothScroll() {
        const links = this.footer.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offset = 80; // Account for fixed header
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Track link click
                    this.trackEvent('footer_link_click', href);
                }
            });
        });
    }
    
    updateCopyright() {
        const yearElements = document.querySelectorAll('.current-year');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(element => {
            element.textContent = currentYear;
        });
    }
    
    setupMap() {
        const mapContainer = document.querySelector('.footer-map');
        if (!mapContainer) return;
        
        // Create interactive map placeholder
        const mapPlaceholder = document.createElement('div');
        mapPlaceholder.style.cssText = `
            width: 100%;
            height: 200px;
            background: linear-gradient(135deg, #001A33 0%, #003F7F 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        `;
        
        mapPlaceholder.innerHTML = `
            <div style="text-align: center; z-index: 1;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" style="margin-bottom: 0.5rem;">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <p>Miami, Florida</p>
                <p style="font-size: 0.875rem; opacity: 0.8;">Click para ver en Google Maps</p>
            </div>
        `;
        
        // Add hover effect
        mapPlaceholder.addEventListener('mouseenter', () => {
            mapPlaceholder.style.transform = 'scale(1.02)';
            mapPlaceholder.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        });
        
        mapPlaceholder.addEventListener('mouseleave', () => {
            mapPlaceholder.style.transform = 'scale(1)';
            mapPlaceholder.style.boxShadow = 'none';
        });
        
        // Open Google Maps on click
        mapPlaceholder.addEventListener('click', () => {
            window.open('https://maps.google.com/maps?q=Miami,+FL', '_blank');
            this.trackEvent('map_click', 'Footer');
        });
        
        mapContainer.appendChild(mapPlaceholder);
    }
    
    trackEvent(action, label) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'footer',
                'event_label': label
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: 'Footer Interaction',
                content_category: label
            });
        }
    }
}

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes slideInRight {
        from { 
            transform: translateX(100%);
            opacity: 0;
        }
        to { 
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from { 
            transform: translateX(0);
            opacity: 1;
        }
        to { 
            transform: translateX(100%);
            opacity: 0;
        }
    }
    `;
    document.head.appendChild(style);

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        new FooterSection();
    });

    // Export for use in other modules
    window.FooterSection = FooterSection;

})(); // End IIFE