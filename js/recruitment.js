/* ============================================
   RECRUITMENT SECTION FUNCTIONALITY
   ============================================ */

(function() {
    'use strict';

class RecruitmentSection {
    constructor() {
        this.section = document.querySelector('.recruitment');
        this.stats = document.querySelectorAll('.recruitment-stat-number');
        this.hasAnimated = false;
        this.formOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.section) return;
        
        // Setup intersection observer
        this.setupIntersectionObserver();
        
        // Setup video modal
        this.setupVideoModal();
        
        // Setup application form
        this.setupApplicationForm();
        
        // Add floating money animation
        this.createFloatingMoney();
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateStats();
                    this.animateBenefits();
                    this.hasAnimated = true;
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        observer.observe(this.section);
    }
    
    animateStats() {
        this.stats.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-target')) || parseInt(stat.textContent);
            const prefix = stat.getAttribute('data-prefix') || '';
            const suffix = stat.getAttribute('data-suffix') || '';
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            setTimeout(() => {
                const updateNumber = () => {
                    current += increment;
                    
                    if (current >= target) {
                        current = target;
                        stat.textContent = prefix + current.toLocaleString() + suffix;
                        
                        // Add celebration effect
                        stat.style.animation = 'pulse 0.5s ease';
                        this.createConfetti(stat);
                    } else {
                        stat.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
                        requestAnimationFrame(updateNumber);
                    }
                };
                
                updateNumber();
            }, index * 200);
        });
    }
    
    animateBenefits() {
        const benefits = this.section.querySelectorAll('.recruitment-benefit');
        benefits.forEach((benefit, index) => {
            setTimeout(() => {
                benefit.style.opacity = '0';
                benefit.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    benefit.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    benefit.style.opacity = '1';
                    benefit.style.transform = 'translateY(0)';
                }, 50);
            }, index * 150);
        });
    }
    
    createFloatingMoney() {
        const floatersContainer = document.createElement('div');
        floatersContainer.className = 'recruitment-floaters';
        
        const symbols = ['💰', '💵', '📈', '🏆', '💎'];
        
        for (let i = 0; i < 5; i++) {
            const floater = document.createElement('div');
            floater.className = 'money-float';
            floater.textContent = symbols[i];
            floatersContainer.appendChild(floater);
        }
        
        this.section.appendChild(floatersContainer);
    }
    
    createConfetti(element) {
        const rect = element.getBoundingClientRect();
        const colors = ['#D4AF37', '#C4A030', '#ffffff', '#001A33'];
        
        for (let i = 0; i < 10; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            document.body.appendChild(confetti);
            
            // Animate confetti
            const angle = (Math.PI * 2 * i) / 10;
            const velocity = 5 + Math.random() * 5;
            const lifetime = 1000 + Math.random() * 1000;
            
            let x = 0;
            let y = 0;
            let opacity = 1;
            
            const animate = () => {
                x += Math.cos(angle) * velocity;
                y += Math.sin(angle) * velocity + 2;
                opacity -= 1 / (lifetime / 16);
                
                confetti.style.transform = `translate(${x}px, ${y}px)`;
                confetti.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
    
    setupVideoModal() {
        const videoTrigger = this.section.querySelector('.recruitment-video-placeholder');
        if (!videoTrigger) return;
        
        videoTrigger.addEventListener('click', () => {
            this.openVideoModal();
        });
    }
    
    openVideoModal() {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        const container = document.createElement('div');
        container.style.cssText = `
            position: relative;
            width: 90%;
            max-width: 900px;
            aspect-ratio: 16/9;
            background: #000;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
        `;
        
        // Placeholder content
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            background: linear-gradient(135deg, #001A33 0%, #003F7F 100%);
        `;
        placeholder.innerHTML = `
            <div style="text-align: center;">
                <p style="margin-bottom: 1rem;">📹 Video de Presentación del Negocio</p>
                <p style="font-size: 1rem; opacity: 0.8;">Descubre cómo cambiar tu vida con DR Protection</p>
            </div>
        `;
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            border-radius: 50%;
            transition: all 0.3s ease;
            z-index: 1;
        `;
        
        container.appendChild(placeholder);
        container.appendChild(closeBtn);
        modal.appendChild(container);
        document.body.appendChild(modal);
        
        // Close handlers
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Track video view
        this.trackEvent('video_view', 'Business Opportunity');
    }
    
    setupApplicationForm() {
        const applyBtns = this.section.querySelectorAll('.recruitment-cta-btn.primary');
        
        applyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openApplicationForm();
            });
        });
    }
    
    openApplicationForm() {
        if (this.formOpen) return;
        this.formOpen = true;
        
        const modal = document.createElement('div');
        modal.className = 'application-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
            overflow-y: auto;
            padding: 2rem;
        `;
        
        const form = document.createElement('form');
        form.className = 'application-form';
        form.style.cssText = `
            background: white;
            border-radius: 24px;
            padding: 3rem;
            max-width: 600px;
            width: 100%;
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
        `;
        
        form.innerHTML = `
            <h2 style="font-size: 2rem; color: #001A33; margin-bottom: 1rem;">
                🚀 Comienza Tu Carrera Hoy
            </h2>
            <p style="color: #666; margin-bottom: 2rem;">
                Completa este formulario y te contactaremos en las próximas 24 horas
            </p>
            
            <div style="display: grid; gap: 1.5rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;">
                        Nombre Completo *
                    </label>
                    <input type="text" required style="width: 100%; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;">
                        Teléfono *
                    </label>
                    <input type="tel" required style="width: 100%; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;">
                        Email *
                    </label>
                    <input type="email" required style="width: 100%; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;">
                        Experiencia en Ventas
                    </label>
                    <select style="width: 100%; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
                        <option>Sin experiencia</option>
                        <option>Menos de 1 año</option>
                        <option>1-3 años</option>
                        <option>3-5 años</option>
                        <option>Más de 5 años</option>
                    </select>
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;">
                        ¿Por qué quieres unirte a DR Protection?
                    </label>
                    <textarea rows="4" style="width: 100%; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; resize: vertical;"></textarea>
                </div>
                
                <button type="submit" style="
                    background: linear-gradient(135deg, #D4AF37, #C4A030);
                    color: white;
                    padding: 1rem 2rem;
                    border: none;
                    border-radius: 100px;
                    font-size: 1.125rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    Enviar Aplicación
                </button>
            </div>
            
            <button type="button" class="close-form" style="
                position: absolute;
                top: 1.5rem;
                right: 1.5rem;
                width: 40px;
                height: 40px;
                background: #f0f0f0;
                border: none;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
            ">×</button>
        `;
        
        modal.appendChild(form);
        document.body.appendChild(modal);
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitApplication(form);
        });
        
        // Close handlers
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
                this.formOpen = false;
            }, 300);
        };
        
        form.querySelector('.close-form').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    submitApplication(form) {
        // Show success message
        form.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                <h3 style="font-size: 1.5rem; color: #001A33; margin-bottom: 1rem;">
                    ¡Aplicación Enviada con Éxito!
                </h3>
                <p style="color: #666; margin-bottom: 2rem;">
                    Te contactaremos en las próximas 24 horas para agendar tu entrevista.
                </p>
                <button style="
                    background: linear-gradient(135deg, #D4AF37, #C4A030);
                    color: white;
                    padding: 1rem 2rem;
                    border: none;
                    border-radius: 100px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                " onclick="this.closest('.application-modal').remove()">
                    Cerrar
                </button>
            </div>
        `;
        
        // Track application
        this.trackEvent('application_submitted', 'Agent Recruitment');
    }
    
    trackEvent(action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'recruitment',
                'event_label': label
            });
        }
        
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'Agent Application',
                content_category: label
            });
        }
    }
}

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
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

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        new RecruitmentSection();
    });

    // Export for use in other modules
    window.RecruitmentSection = RecruitmentSection;

})(); // End IIFE