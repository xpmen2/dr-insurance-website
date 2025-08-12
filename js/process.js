/* ============================================
   PROCESS SECTION FUNCTIONALITY
   ============================================ */

class ProcessSection {
    constructor() {
        this.steps = document.querySelectorAll('.process-step');
        this.currentStep = 0;
        this.autoProgressInterval = null;
        
        this.init();
    }
    
    init() {
        if (!this.steps.length) return;
        
        // Setup intersection observer for animations
        this.setupIntersectionObserver();
        
        // Setup click handlers
        this.setupClickHandlers();
        
        // Setup hover effects
        this.setupHoverEffects();
        
        // Start auto progress when in view
        this.setupAutoProgress();
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const timeline = entry.target.querySelector('.process-timeline');
                    if (timeline) {
                        this.animateSteps();
                        this.startAutoProgress();
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        const processSection = document.querySelector('.process');
        if (processSection) {
            observer.observe(processSection);
        }
    }
    
    animateSteps() {
        this.steps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('animated');
                
                // Animate the icon
                const icon = step.querySelector('.process-step-icon');
                if (icon) {
                    icon.style.animation = 'iconBounce 0.6s ease';
                }
                
                // Show step number with pop effect
                const badge = step.querySelector('.process-step-badge');
                if (badge) {
                    badge.style.animation = 'checkPop 0.4s ease';
                }
            }, index * 200);
        });
    }
    
    setupClickHandlers() {
        this.steps.forEach((step, index) => {
            step.addEventListener('click', () => {
                this.activateStep(index);
                
                // Track click
                this.trackEvent('step_click', `Step ${index + 1}`);
            });
            
            // CTA link handler
            const link = step.querySelector('.process-step-link');
            if (link) {
                link.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.trackEvent('step_cta_click', `Step ${index + 1}`);
                });
            }
        });
    }
    
    setupHoverEffects() {
        this.steps.forEach((step, index) => {
            step.addEventListener('mouseenter', () => {
                // Pause auto progress on hover
                if (this.autoProgressInterval) {
                    clearInterval(this.autoProgressInterval);
                }
                
                // Highlight connecting line
                this.updateProgressLine(index);
            });
            
            step.addEventListener('mouseleave', () => {
                // Resume auto progress
                this.startAutoProgress();
                
                // Reset line to current step
                this.updateProgressLine(this.currentStep);
            });
        });
    }
    
    activateStep(index) {
        // Remove active from all steps
        this.steps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Add active to current step
        this.steps[index].classList.add('active');
        
        // Mark previous steps as completed
        for (let i = 0; i < index; i++) {
            this.steps[i].classList.add('completed');
        }
        
        // Remove completed from future steps
        for (let i = index; i < this.steps.length; i++) {
            this.steps[i].classList.remove('completed');
        }
        
        this.currentStep = index;
        this.updateProgressLine(index);
        
        // Add pulse effect to the activated step
        this.addPulseEffect(this.steps[index]);
    }
    
    updateProgressLine(index) {
        const timeline = document.querySelector('.process-timeline');
        if (!timeline) return;
        
        const progressPercent = (index / (this.steps.length - 1)) * 100;
        
        // Update the gradient to show progress
        const beforeElement = timeline.querySelector('::before') || timeline;
        beforeElement.style.background = `linear-gradient(90deg, 
            #D4AF37 0%, 
            #D4AF37 ${progressPercent}%, 
            #e0e0e0 ${progressPercent}%, 
            #e0e0e0 100%)`;
    }
    
    startAutoProgress() {
        // Clear any existing interval
        if (this.autoProgressInterval) {
            clearInterval(this.autoProgressInterval);
        }
        
        // Auto progress through steps
        this.autoProgressInterval = setInterval(() => {
            const nextStep = (this.currentStep + 1) % this.steps.length;
            this.activateStep(nextStep);
        }, 3000); // Change step every 3 seconds
    }
    
    addPulseEffect(element) {
        const circle = element.querySelector('.process-step-circle');
        if (!circle) return;
        
        // Create pulse element
        const pulse = document.createElement('div');
        pulse.className = 'process-pulse';
        pulse.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 50%;
            border: 3px solid #D4AF37;
            animation: pulse-ring 1s ease-out;
            pointer-events: none;
        `;
        
        circle.appendChild(pulse);
        
        // Remove after animation
        setTimeout(() => {
            pulse.remove();
        }, 1000);
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

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse-ring {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(1.3);
            opacity: 0;
        }
    }
    
    .process-timeline::before {
        transition: background 0.5s ease;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProcessSection();
});

// Export for use in other modules
window.ProcessSection = ProcessSection;