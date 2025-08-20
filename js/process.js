/* ============================================
   PROCESS SECTION FUNCTIONALITY - SIMPLIFIED
   ============================================ */

(function() {
    'use strict';

class ProcessSection {
    constructor() {
        this.steps = document.querySelectorAll('.process-step');
        this.init();
    }
    
    init() {
        if (!this.steps.length) return;
        
        // Setup hover effects only - no active states
        this.setupHoverEffects();
        
        // Setup click handlers for links only
        this.setupLinkHandlers();
    }
    
    setupHoverEffects() {
        this.steps.forEach((step) => {
            // Simple hover effect on the circle only
            const circle = step.querySelector('.process-step-circle');
            if (circle) {
                step.addEventListener('mouseenter', () => {
                    // Just add a subtle scale effect
                    circle.style.transform = 'translateY(-10px) scale(1.1)';
                });
                
                step.addEventListener('mouseleave', () => {
                    // Reset
                    circle.style.transform = '';
                });
            }
        });
    }
    
    setupLinkHandlers() {
        // Handle CTA links clicks for tracking
        this.steps.forEach((step, index) => {
            const link = step.querySelector('.process-step-link');
            if (link) {
                link.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.trackEvent('step_cta_click', `Step ${index + 1}`);
                });
            }
        });
    }
    
    trackEvent(action, label) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'process',
                'event_label': label
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: 'Process Step',
                content_category: label
            });
        }
        
        console.log('Process event:', action, label);
    }
}

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        new ProcessSection();
    });

    // Export for use in other modules
    window.ProcessSection = ProcessSection;

})(); // End IIFE