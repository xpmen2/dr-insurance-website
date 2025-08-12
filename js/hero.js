/* ============================================
   HERO SECTION FUNCTIONALITY
   ============================================ */

class HeroSection {
    constructor() {
        this.form = document.querySelector('.hero-form');
        this.formInputs = document.querySelectorAll('.hero-form-input, .hero-form-select');
        this.submitButton = document.querySelector('.hero-form-button');
        this.trustNumbers = document.querySelectorAll('.hero-trust-number');
        
        this.init();
    }
    
    init() {
        // Form handling
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        
        // Input validation
        this.formInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
        
        // Animate numbers on scroll
        this.initNumberAnimation();
        
        // Generate particles
        this.generateParticles();
        
        // Phone number formatting
        this.initPhoneFormatting();
        
        // Video lazy loading
        this.initVideoLoading();
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        this.formInputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        // Collect form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Track conversion
        this.trackConversion('hero_form', data);
        
        // Simulate API call (replace with actual endpoint)
        setTimeout(() => {
            this.setLoadingState(false);
            this.showSuccessMessage();
            
            // Reset form after 3 seconds
            setTimeout(() => {
                this.form.reset();
                this.hideSuccessMessage();
            }, 3000);
        }, 2000);
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Required check
        if (!value) {
            errorMessage = 'Este campo es requerido';
            isValid = false;
        }
        
        // Email validation
        else if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Por favor ingrese un email válido';
                isValid = false;
            }
        }
        
        // Phone validation
        else if (type === 'tel' || name === 'phone') {
            const phoneRegex = /^[\d\s\-\(\)\+]+$/;
            const cleanPhone = value.replace(/\D/g, '');
            if (!phoneRegex.test(value) || cleanPhone.length < 10) {
                errorMessage = 'Por favor ingrese un teléfono válido';
                isValid = false;
            }
        }
        
        // Show/hide error
        if (!isValid) {
            this.showError(field, errorMessage);
        } else {
            this.clearError(field);
        }
        
        return isValid;
    }
    
    showError(field, message) {
        // Remove existing error
        this.clearError(field);
        
        // Add error class
        field.classList.add('error');
        
        // Create error element
        const errorEl = document.createElement('span');
        errorEl.className = 'hero-form-error';
        errorEl.textContent = message;
        errorEl.style.cssText = `
            display: block;
            color: #dc3545;
            font-size: 0.75rem;
            margin-top: 0.25rem;
            animation: fadeIn 0.3s;
        `;
        
        field.parentElement.appendChild(errorEl);
    }
    
    clearError(field) {
        field.classList.remove('error');
        const errorEl = field.parentElement.querySelector('.hero-form-error');
        if (errorEl) {
            errorEl.remove();
        }
    }
    
    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = `
                <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="31.4" stroke-dashoffset="10"/>
                </svg>
                Procesando...
            `;
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = 'Recibir Cotización Gratis';
        }
    }
    
    showSuccessMessage() {
        // Create success overlay
        const successOverlay = document.createElement('div');
        successOverlay.className = 'hero-form-success';
        successOverlay.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; text-align: center; max-width: 400px;">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="#00A86B" style="margin-bottom: 1rem;">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <h3 style="color: #00A86B; margin-bottom: 0.5rem;">¡Solicitud Recibida!</h3>
                <p style="color: #666;">Un especialista te contactará en menos de 15 minutos.</p>
            </div>
        `;
        
        successOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s;
        `;
        
        document.body.appendChild(successOverlay);
        
        // Track success
        this.trackEvent('form_success', 'hero_quote');
    }
    
    hideSuccessMessage() {
        const successOverlay = document.querySelector('.hero-form-success');
        if (successOverlay) {
            successOverlay.style.animation = 'fadeOut 0.3s';
            setTimeout(() => successOverlay.remove(), 300);
        }
    }
    
    initNumberAnimation() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.animated) {
                    this.animateNumber(entry.target);
                    entry.target.animated = true;
                }
            });
        }, observerOptions);
        
        this.trustNumbers.forEach(number => {
            observer.observe(number);
        });
    }
    
    animateNumber(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with suffix
            let formatted = Math.floor(current).toString();
            if (element.textContent.includes('+')) {
                formatted += '+';
            }
            if (element.textContent.includes('K')) {
                formatted = (current / 1000).toFixed(1) + 'K';
            }
            
            element.textContent = formatted;
        }, 16);
    }
    
    generateParticles() {
        const particlesContainer = document.querySelector('.hero-particles');
        if (!particlesContainer) return;
        
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    initPhoneFormatting() {
        const phoneInput = document.querySelector('input[type="tel"]');
        if (!phoneInput) return;
        
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else if (value.length <= 10) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            
            e.target.value = value;
        });
    }
    
    initVideoLoading() {
        const video = document.querySelector('.hero-video');
        if (!video) return;
        
        // Only load video on desktop and good connection
        if (window.innerWidth > 1024 && navigator.connection?.effectiveType !== 'slow-2g') {
            video.setAttribute('src', video.dataset.src);
            video.load();
        }
    }
    
    trackConversion(action, data) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'event_category': 'form',
                'event_label': action,
                'value': 1
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: action,
                content_category: 'Insurance Quote'
            });
        }
        
        console.log('Conversion tracked:', action, data);
    }
    
    trackEvent(action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_label': label
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new HeroSection();
});

// Add to global scope
window.HeroSection = HeroSection;

// CSS for spinner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);