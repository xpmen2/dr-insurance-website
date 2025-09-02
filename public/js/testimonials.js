/* ============================================
   TESTIMONIALS FUNCTIONALITY - COMPLETELY FIXED
   ============================================ */

class TestimonialsSection {
    constructor() {
        this.currentTab = 'clients';
        this.currentSlides = {
            clients: 0,
            agents: 0
        };
        
        this.testimonialData = {
            clients: [
                {
                    id: 1,
                    name: 'María González',
                    age: 45,
                    location: 'Miami, FL',
                    insurance: 'Seguro de Vida IUL',
                    text: 'Gracias a DR Protection, ahora tengo la tranquilidad de saber que mi familia está protegida. El seguro IUL no solo me da seguridad, sino que también está haciendo crecer mi patrimonio. En solo 3 años, ya veo resultados increíbles.',
                    highlight: 'En solo 3 años, ya veo resultados increíbles',
                    rating: 5,
                    hasVideo: true
                },
                {
                    id: 2,
                    name: 'Carlos Rodríguez',
                    age: 38,
                    location: 'Orlando, FL',
                    insurance: 'Seguro de Salud + IUL',
                    text: 'El equipo de DR Protection me ayudó a entender todas mis opciones. Ahora tengo cobertura médica completa para mi familia y un IUL que está construyendo nuestro futuro. El servicio personalizado en español marcó toda la diferencia.',
                    highlight: 'El servicio personalizado en español marcó toda la diferencia',
                    rating: 5,
                    hasVideo: false
                },
                {
                    id: 3,
                    name: 'Ana Martínez',
                    age: 52,
                    location: 'Tampa, FL',
                    insurance: 'IUL para Retiro',
                    text: 'Estaba preocupada por mi retiro hasta que conocí el IUL. DR Protection me mostró cómo puedo retirarme con dignidad y dejar un legado a mis hijos. Ya he visto crecer mi póliza un 8% este año.',
                    highlight: 'Ya he visto crecer mi póliza un 8% este año',
                    rating: 5,
                    hasVideo: true
                }
            ],
            agents: [
                {
                    id: 1,
                    name: 'Roberto Silva',
                    timeAsAgent: '2 años',
                    previousJob: 'Vendedor de autos',
                    text: 'Cambiar a la industria de seguros con DR Protection fue la mejor decisión de mi vida. Con su sistema de entrenamiento y mentoría, logré generar ingresos de 6 cifras en mi primer año. El apoyo es incomparable.',
                    highlight: 'ingresos de 6 cifras en mi primer año',
                    achievement: '$120,000+',
                    achievementLabel: 'Primer año de ingresos',
                    rating: 5
                },
                {
                    id: 2,
                    name: 'Patricia Fernández',
                    timeAsAgent: '3 años',
                    previousJob: 'Maestra',
                    text: 'Como madre soltera, necesitaba flexibilidad y buenos ingresos. DR Protection me dio ambos. Trabajo desde casa, manejo mi horario y gano más que nunca. Este año califiqué para el viaje de incentivo a Cancún.',
                    highlight: 'Trabajo desde casa, manejo mi horario y gano más que nunca',
                    achievement: 'Top 10%',
                    achievementLabel: 'Productora Nacional',
                    rating: 5
                },
                {
                    id: 3,
                    name: 'Miguel Ángel Torres',
                    timeAsAgent: '6 meses',
                    previousJob: 'Recién graduado',
                    text: 'Recién salido de la universidad, DR Protection me dio la oportunidad de crecer rápidamente. En solo 6 meses ya tengo mi propia cartera de clientes y estoy construyendo ingresos residuales para mi futuro.',
                    highlight: 'En solo 6 meses ya tengo mi propia cartera de clientes',
                    achievement: '50+',
                    achievementLabel: 'Clientes en 6 meses',
                    rating: 5
                }
            ]
        };
        
        this.init();
    }
    
    init() {
        // Check if testimonials section exists
        if (!document.querySelector('.testimonials')) {
            console.log('Testimonials section not found');
            return;
        }
        
        this.setupTabs();
        this.setupCarousel();
        
        // Initial render - IMPORTANT: This must happen after setup
        setTimeout(() => {
            this.renderInitialTestimonials();
        }, 100);
    }
    
    renderInitialTestimonials() {
        // Render the first testimonial for each tab
        ['clients', 'agents'].forEach(tabType => {
            const carousel = document.querySelector(`[data-panel="${tabType}"] .testimonials-carousel`);
            if (carousel) {
                const firstTestimonial = this.testimonialData[tabType][0];
                carousel.innerHTML = this.createTestimonialHTML(firstTestimonial, tabType);
            }
            
            // Setup dots
            this.updateDots(tabType);
        });
    }
    
    setupTabs() {
        const tabs = document.querySelectorAll('.testimonials-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabType = tab.dataset.tab;
                this.switchTab(tabType);
            });
        });
    }
    
    switchTab(tabType) {
        // Update active tab
        document.querySelectorAll('.testimonials-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabType) {
                tab.classList.add('active');
            }
        });
        
        // Update active panel
        document.querySelectorAll('.testimonials-panel').forEach(panel => {
            panel.classList.remove('active');
            if (panel.dataset.panel === tabType) {
                panel.classList.add('active');
            }
        });
        
        this.currentTab = tabType;
    }
    
    setupCarousel() {
        // Setup arrow controls for both panels
        document.querySelectorAll('.testimonials-panel').forEach(panel => {
            const tabType = panel.dataset.panel;
            
            // Previous arrow
            const prevArrow = panel.querySelector('[data-direction="prev"]');
            if (prevArrow) {
                prevArrow.addEventListener('click', () => {
                    this.previousSlide(tabType);
                });
            }
            
            // Next arrow
            const nextArrow = panel.querySelector('[data-direction="next"]');
            if (nextArrow) {
                nextArrow.addEventListener('click', () => {
                    this.nextSlide(tabType);
                });
            }
        });
    }
    
    previousSlide(tabType) {
        const testimonials = this.testimonialData[tabType];
        if (this.currentSlides[tabType] > 0) {
            this.currentSlides[tabType]--;
        } else {
            this.currentSlides[tabType] = testimonials.length - 1;
        }
        this.updateSlide(tabType);
    }
    
    nextSlide(tabType) {
        const testimonials = this.testimonialData[tabType];
        if (this.currentSlides[tabType] < testimonials.length - 1) {
            this.currentSlides[tabType]++;
        } else {
            this.currentSlides[tabType] = 0;
        }
        this.updateSlide(tabType);
    }
    
    updateSlide(tabType) {
        const carousel = document.querySelector(`[data-panel="${tabType}"] .testimonials-carousel`);
        if (!carousel) return;
        
        const currentIndex = this.currentSlides[tabType];
        const testimonial = this.testimonialData[tabType][currentIndex];
        
        // Fade out
        carousel.style.opacity = '0';
        
        // Wait for fade out, then update content and fade in
        setTimeout(() => {
            carousel.innerHTML = this.createTestimonialHTML(testimonial, tabType);
            carousel.style.opacity = '1';
        }, 300);
        
        // Update dots
        this.updateDots(tabType);
    }
    
    createTestimonialHTML(testimonial, type) {
        if (type === 'clients') {
            return `
                <div class="testimonial-card">
                    ${testimonial.hasVideo ? `
                        <div class="testimonial-video-badge">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                            Video Testimonial
                        </div>
                    ` : ''}
                    
                    <div class="testimonial-quote-mark">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                        </svg>
                    </div>
                    
                    <div class="testimonial-body">
                        <p class="testimonial-text">
                            "${testimonial.text.replace(testimonial.highlight, 
                                `<span class="testimonial-highlight">${testimonial.highlight}</span>`)}"
                        </p>
                    </div>
                    
                    <div class="testimonial-author">
                        <div class="testimonial-avatar">
                            <div class="testimonial-avatar-placeholder">
                                ${testimonial.name.split(' ').map(n => n[0]).join('')}
                            </div>
                        </div>
                        <div class="testimonial-info">
                            <div class="testimonial-name">${testimonial.name}</div>
                            <div class="testimonial-details">
                                ${testimonial.age} años • ${testimonial.location}<br>
                                <span class="testimonial-badge">${testimonial.insurance}</span>
                            </div>
                            <div class="testimonial-rating">
                                ${this.createStars(testimonial.rating)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="testimonial-card">
                    <div class="testimonial-quote-mark">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                        </svg>
                    </div>
                    
                    <div class="testimonial-body">
                        <p class="testimonial-text">
                            "${testimonial.text.replace(testimonial.highlight, 
                                `<span class="testimonial-highlight">${testimonial.highlight}</span>`)}"
                        </p>
                    </div>
                    
                    <div class="agent-achievement">
                        <div class="agent-achievement-title">${testimonial.achievementLabel}</div>
                        <div class="agent-achievement-value">${testimonial.achievement}</div>
                    </div>
                    
                    <div class="testimonial-author">
                        <div class="testimonial-avatar">
                            <div class="testimonial-avatar-placeholder">
                                ${testimonial.name.split(' ').map(n => n[0]).join('')}
                            </div>
                        </div>
                        <div class="testimonial-info">
                            <div class="testimonial-name">${testimonial.name}</div>
                            <div class="testimonial-details">
                                Agente por ${testimonial.timeAsAgent}<br>
                                Antes: ${testimonial.previousJob}
                            </div>
                            <div class="testimonial-rating">
                                ${this.createStars(testimonial.rating)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    updateDots(tabType) {
        const dotsContainer = document.querySelector(`[data-panel="${tabType}"] .testimonials-dots`);
        if (!dotsContainer) return;
        
        const currentSlide = this.currentSlides[tabType];
        const totalSlides = this.testimonialData[tabType].length;
        
        // Clear existing dots
        dotsContainer.innerHTML = '';
        
        // Create new dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot';
            if (i === currentSlide) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                this.currentSlides[tabType] = i;
                this.updateSlide(tabType);
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    createStars(rating) {
        let stars = '';
        for (let i = 0; i < rating; i++) {
            stars += `
                <span class="testimonial-star">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </span>
            `;
        }
        return stars;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const testimonialsSection = new TestimonialsSection();
});

// Export for use in other modules
window.TestimonialsSection = TestimonialsSection;