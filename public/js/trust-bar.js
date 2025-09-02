/* ============================================
   TRUST BAR FUNCTIONALITY
   ============================================ */

class TrustBar {
    constructor() {
        this.track = document.querySelector('.trust-carousel-track');
        this.logos = document.querySelectorAll('.trust-logo-item');
        this.animationDuration = 30; // seconds
        
        this.init();
    }
    
    init() {
        // Clone logos for infinite scroll
        this.setupInfiniteScroll();
        
        // Pause on hover
        this.setupHoverPause();
        
        // Handle reduced motion preference
        this.handleReducedMotion();
        
        // Lazy load images
        this.lazyLoadImages();
    }
    
    setupInfiniteScroll() {
        if (!this.track) return;
        
        // Get the first group of logos
        const firstGroup = this.track.querySelector('.trust-carousel-group');
        if (!firstGroup) return;
        
        // Clone the group for seamless loop
        const clone = firstGroup.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true'); // For accessibility
        this.track.appendChild(clone);
    }
    
    setupHoverPause() {
        if (!this.track) return;
        
        // Pause animation on hover
        this.track.addEventListener('mouseenter', () => {
            this.track.style.animationPlayState = 'paused';
        });
        
        this.track.addEventListener('mouseleave', () => {
            this.track.style.animationPlayState = 'running';
        });
        
        // Touch support for mobile
        this.track.addEventListener('touchstart', () => {
            this.track.style.animationPlayState = 'paused';
        });
        
        this.track.addEventListener('touchend', () => {
            setTimeout(() => {
                this.track.style.animationPlayState = 'running';
            }, 3000); // Resume after 3 seconds
        });
    }
    
    handleReducedMotion() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion && this.track) {
            this.track.style.animation = 'none';
            
            // Add alternative interaction
            this.setupManualScroll();
        }
    }
    
    setupManualScroll() {
        if (!this.track) return;
        
        // Add scroll buttons for accessibility
        const wrapper = this.track.closest('.trust-carousel-wrapper');
        if (!wrapper) return;
        
        // Create scroll buttons
        const prevBtn = document.createElement('button');
        prevBtn.className = 'trust-scroll-btn trust-scroll-prev';
        prevBtn.innerHTML = '←';
        prevBtn.setAttribute('aria-label', 'Ver logos anteriores');
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'trust-scroll-btn trust-scroll-next';
        nextBtn.innerHTML = '→';
        nextBtn.setAttribute('aria-label', 'Ver siguientes logos');
        
        wrapper.appendChild(prevBtn);
        wrapper.appendChild(nextBtn);
        
        // Add scroll functionality
        let scrollPosition = 0;
        const scrollAmount = 200;
        
        prevBtn.addEventListener('click', () => {
            scrollPosition = Math.max(0, scrollPosition - scrollAmount);
            this.track.style.transform = `translateX(-${scrollPosition}px)`;
        });
        
        nextBtn.addEventListener('click', () => {
            const maxScroll = this.track.scrollWidth - wrapper.offsetWidth;
            scrollPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
            this.track.style.transform = `translateX(-${scrollPosition}px)`;
        });
    }
    
    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            // Observe all logo images
            this.logos.forEach(logo => {
                const img = logo.querySelector('img');
                if (img && img.dataset.src) {
                    imageObserver.observe(img);
                }
            });
        }
    }
    
    // Public method to pause animation
    pause() {
        if (this.track) {
            this.track.style.animationPlayState = 'paused';
        }
    }
    
    // Public method to resume animation
    resume() {
        if (this.track) {
            this.track.style.animationPlayState = 'running';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TrustBar();
});

// Export for use in other modules
window.TrustBar = TrustBar;