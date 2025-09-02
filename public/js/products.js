/* ============================================
   PRODUCTS SECTION FUNCTIONALITY
   ============================================ */

(function() {
    'use strict';

    class ProductsSection {
    constructor() {
        this.cards = document.querySelectorAll('.product-card');
        this.buttons = document.querySelectorAll('.product-btn');
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.init();
    }
    
    init() {
        // Set up intersection observer for animations
        this.setupIntersectionObserver();
        
        // Add click tracking
        this.setupClickTracking();
        
        // Add hover effects
        this.setupHoverEffects();
        
        // Initialize tooltips
        this.setupTooltips();
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animate benefits list
                    const benefits = entry.target.querySelectorAll('.product-benefit');
                    benefits.forEach((benefit, index) => {
                        setTimeout(() => {
                            benefit.style.opacity = '1';
                            benefit.style.transform = 'translateX(0)';
                        }, 100 * index);
                    });
                }
            });
        }, this.observerOptions);
        
        this.cards.forEach(card => {
            observer.observe(card);
            
            // Prepare benefits for animation
            const benefits = card.querySelectorAll('.product-benefit');
            benefits.forEach(benefit => {
                benefit.style.opacity = '0';
                benefit.style.transform = 'translateX(-20px)';
                benefit.style.transition = 'all 0.5s ease';
            });
        });
    }
    
    setupClickTracking() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const card = button.closest('.product-card');
                const productName = card.querySelector('.product-title').textContent;
                
                // Track the click
                this.trackProductClick(productName);
                
                // Add ripple effect
                this.createRipple(e, button);
            });
        });
    }
    
    setupHoverEffects() {
        this.cards.forEach(card => {
            const icon = card.querySelector('.product-icon');
            
            card.addEventListener('mouseenter', () => {
                // Animate icon
                if (icon) {
                    icon.style.animation = 'pulse 1s infinite';
                }
                
                // Add glow effect to featured card
                if (card.classList.contains('featured')) {
                    card.style.boxShadow = '0 15px 50px rgba(0, 63, 127, 0.5)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                // Remove icon animation
                if (icon) {
                    icon.style.animation = '';
                }
                
                // Reset shadow
                if (card.classList.contains('featured')) {
                    card.style.boxShadow = '';
                }
            });
        });
    }
    
    setupTooltips() {
        // Add tooltips to benefit icons
        const benefitIcons = document.querySelectorAll('.product-benefit-icon');
        
        benefitIcons.forEach(icon => {
            icon.setAttribute('title', 'Beneficio incluido');
            
            icon.addEventListener('mouseenter', (e) => {
                const tooltip = this.createTooltip('✓ Incluido en el plan');
                document.body.appendChild(tooltip);
                
                const rect = icon.getBoundingClientRect();
                tooltip.style.left = rect.left + 'px';
                tooltip.style.top = (rect.top - 40) + 'px';
                
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                }, 10);
            });
            
            icon.addEventListener('mouseleave', () => {
                const tooltips = document.querySelectorAll('.product-tooltip');
                tooltips.forEach(t => t.remove());
            });
        });
    }
    
    createTooltip(text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'product-tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: fixed;
            background: var(--dark-navy);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        `;
        return tooltip;
    }
    
    createRipple(event, button) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple-animation 0.6s ease-out;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    trackProductClick(productName) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'product_click', {
                'event_category': 'engagement',
                'event_label': productName
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: productName,
                content_category: 'Insurance Product'
            });
        }
        
        console.log('Product clicked:', productName);
    }
}

    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        new ProductsSection();
    });

    // Export for use in other modules
    window.ProductsSection = ProductsSection;

})(); // End IIFE